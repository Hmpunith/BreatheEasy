/**
 * @file AirSense Copilot Chat Interface
 * @description GenAI-powered conversational interface grounded in live AQI metrics and household profile.
 * @module src/components/panels/CopilotPanel
 */

import React, { useState } from 'react';
import { PaperPlaneTilt, Sparkle, Lightning } from '@phosphor-icons/react';
import type { ChatMessage, FamilyProfile } from '../../types';
import { STARTER_PROMPTS } from '../../constants/starterPrompts';

export interface CopilotPanelProps {
  messages: ChatMessage[];
  currentCity: string;
  aqi: number;
  familyProfile: FamilyProfile;
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

export const CopilotPanel: React.FC<CopilotPanelProps> = ({
  messages,
  currentCity,
  aqi,
  familyProfile,
  isLoading,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div id="panel-copilot" role="tabpanel" aria-labelledby="tab-copilot" className="space-y-4">
      {/* Context Grounding Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
        <div className="flex items-center space-x-2">
          <Sparkle size={18} weight="fill" className="text-cyan-400" />
          <span className="font-semibold text-slate-200">AirSense Grounded Intelligence:</span>
          <span>{currentCity}</span>
          <span>•</span>
          <span className="font-mono text-cyan-400">AQI {aqi}</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Household: {familyProfile.memberCount} members
          {familyProfile.hasChildren && ' • Children'}
          {familyProfile.hasElderly && ' • Elderly'}
          {familyProfile.hasRespiratoryConditions && ' • Asthma/Respiratory'}
        </div>
      </div>

      {/* Starter Prompts */}
      <div className="flex flex-wrap gap-2">
        {STARTER_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(prompt)}
            className="text-[11px] px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message History */}
      <div
        tabIndex={0}
        aria-label="AirSense Copilot Chat History"
        className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 h-[440px] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-700"
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-cyan-600 text-slate-100 rounded-br-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none'
                }`}
              >
                <div className="flex items-center justify-between space-x-4 mb-1.5 text-[10px] opacity-75">
                  <span className="font-semibold">{isUser ? 'You' : 'AirSense Assistant'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="whitespace-pre-line">{msg.text}</p>
                {!isUser && msg.source && (
                  <div className="mt-2 pt-1.5 border-t border-slate-700/50 flex items-center space-x-1 text-[10px] text-cyan-400">
                    <Lightning size={12} weight="fill" />
                    <span className="capitalize">{msg.source} Engine Verified</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/90 text-slate-300 rounded-2xl p-3 text-xs flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>AirSense is analyzing winter smog patterns...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about smog defense, indoor hacks, or low-emission alternatives..."
          aria-label="Message AirSense Copilot"
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          aria-label="Send message"
          className="px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs flex items-center space-x-2 hover:bg-cyan-400 disabled:opacity-50 transition-all shadow-md shadow-cyan-500/20"
        >
          <span>Send</span>
          <PaperPlaneTilt size={16} weight="bold" />
        </button>
      </form>
    </div>
  );
};
