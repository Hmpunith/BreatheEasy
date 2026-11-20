/**
 * @file Air Quality State Orchestration Hook
 * @description Centralized React hook managing AQI readings, profiles, and API synchronization.
 * @module src/hooks/useAirQuality
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  ActiveTab,
  AqiAssessment,
  DailyRoutine,
  RankedHack,
  FamilyProfile,
  HomeProfile,
  ChatMessage,
} from '../types';
import { DEFAULT_FAMILY_PROFILE, DEFAULT_HOME_PROFILE } from '../constants/defaultProfile';
import { MONITORED_CITIES } from '../constants/aqiLevels';
import {
  fetchAqiClassification,
  fetchDailyRoutine,
  fetchRecommendedHacks,
  sendCopilotChat,
} from '../services/breatheApi';
import { formatCurrentTime } from '../utils/formatters';

export function useAirQuality() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentCity, setCurrentCity] = useState(MONITORED_CITIES[0].name);
  const [aqi, setAqi] = useState(MONITORED_CITIES[0].defaultAqi);

  const [familyProfile, setFamilyProfile] = useState<FamilyProfile>(DEFAULT_FAMILY_PROFILE);
  const [homeProfile, setHomeProfile] = useState<HomeProfile>(DEFAULT_HOME_PROFILE);

  const [assessment, setAssessment] = useState<AqiAssessment | null>(null);
  const [routine, setRoutine] = useState<DailyRoutine | null>(null);
  const [hacks, setHacks] = useState<RankedHack[]>([]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am AirSense, your Urban Air Quality Assistant. How can I help protect your household from severe winter smog today?',
      timestamp: formatCurrentTime(),
      source: 'fallback',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync classification and routines on AQI or city change
  const refreshAqiData = useCallback(async (newAqi: number, profile: FamilyProfile, hProfile: HomeProfile) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [classRes, routineRes, hackRes] = await Promise.all([
        fetchAqiClassification(newAqi),
        fetchDailyRoutine(newAqi, profile),
        fetchRecommendedHacks(newAqi, hProfile),
      ]);
      setAssessment(classRes);
      setRoutine(routineRes);
      setHacks(hackRes);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAqiData(aqi, familyProfile, homeProfile);
  }, [aqi, familyProfile, homeProfile, refreshAqiData]);

  const handleCitySelect = (cityName: string) => {
    const found = MONITORED_CITIES.find((c) => c.name === cityName);
    if (found) {
      setCurrentCity(found.name);
      setAqi(found.defaultAqi);
      setFamilyProfile((prev) => ({ ...prev, location: found.name }));
    }
  };

  const handleAqiChange = (newVal: number) => {
    setAqi(Math.max(0, Math.min(500, newVal)));
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) {
      return;
    }
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text,
      timestamp: formatCurrentTime(),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const res = await sendCopilotChat(text, aqi, currentCity, familyProfile);
      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: res.reply,
        timestamp: formatCurrentTime(),
        source: res.source,
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: `Unable to connect to live AI: ${(err as Error).message}. Stay indoors with sealed windows and run air filtration.`,
        timestamp: formatCurrentTime(),
        source: 'fallback',
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  return {
    activeTab,
    setActiveTab,
    currentCity,
    aqi,
    assessment,
    routine,
    hacks,
    familyProfile,
    homeProfile,
    chatMessages,
    isLoading,
    errorMsg,
    handleCitySelect,
    handleAqiChange,
    setFamilyProfile,
    setHomeProfile,
    handleSendMessage,
  };
}
