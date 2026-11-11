'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  RefreshCw,
  X,
  MessageSquare,
  HelpCircle,
  ShieldAlert,
  Sprout,
  ArrowRight,
} from 'lucide-react';
import { FarmProfile } from '@/lib/farm-data';

interface AIFarmingAssistantProps {
  profile: FarmProfile;
  initialPrompt?: string | null;
  isOpenAsModal?: boolean;
  onCloseModal?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  'How to treat yellowing tomato leaves with organic remedies?',
  'Best organic biological control for eggplant fruit borer (Talong)?',
  'What is the ideal N-P-K fertilizer timing for sweet corn?',
  'How to make Fermented Plant Juice (FPJ) and CalPhos at home?',
  'How to prevent bacterial wilt during continuous tropical rains?',
  'What crops can I plant as companion crops with tomatoes?',
];

export default function AIFarmingAssistant({
  profile,
  initialPrompt,
  isOpenAsModal = false,
  onCloseModal,
}: AIFarmingAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'model',
      content: `Hello! I am **AgriMind AI**, your certified agricultural advisor for **${profile.name}** in **${profile.location}**.\n\nI have full context on your farm: **${profile.areaSize} ${profile.areaUnit}**, **${profile.soilType}** soil (pH ${profile.soilPh}), and **${profile.waterSource}** irrigation.\n\nHow can I assist your farming operations today? Feel free to ask about pest management, organic fertilizer formulations, pruning techniques, or planting schedules.`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({ role: m.role, content: m.content })),
          farmContext: profile,
        }),
      });

      const resData = await response.json();
      const botReply =
        resData?.reply ||
        `I am currently operating with our local agronomic knowledge base. \n\n**Quick Advisory for ${profile.soilType} Soil (${profile.location}):**\n- Maintain adequate raised beds (20-30cm) for optimal root aeration.\n- Spray cold-pressed neem oil (5ml/L) at dusk for safe organic pest prevention.\n- Feel free to re-ask any specific planting or fertilization question!`;

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        role: 'model',
        content: `**Agronomic Field Advisory for ${profile.name || 'Your Farm'}:**\n- **Soil (${profile.soilType}, pH ${profile.soilPh}):** Ensure proper bed elevation to avoid water stagnation.\n- **Pest Control:** Scout foliage early morning; apply bio-pesticides or neem extract at sunset.\n- You can also check the **Plant Scanner** and **Weather Monitor** for instant field insights.`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // If initialPrompt provided, trigger asynchronously
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      const timer = setTimeout(() => {
        sendMessage(initialPrompt);
      }, 50);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const content = (
    <div className="flex flex-col h-full max-h-[85vh] bg-white dark:bg-emerald-950 rounded-2xl border border-emerald-800/40 shadow-xl overflow-hidden">
      {/* Assistant Header */}
      <div className="p-4 bg-emerald-900 text-white flex items-center justify-between border-b border-emerald-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-0.5 shadow-md">
            <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-300" />
            </div>
          </div>
          <div>
            <div className="font-bold text-sm flex items-center gap-2">
              <span>AgriMind AI Advisor</span>
              <span className="px-2 py-0.2 rounded-full text-[10px] bg-emerald-800 text-emerald-300 font-semibold border border-emerald-700">
                Gemini 3.8 Flash
              </span>
            </div>
            <div className="text-[11px] text-emerald-200/80">
              Farm: {profile.name} ({profile.soilType}, pH {profile.soilPh})
            </div>
          </div>
        </div>

        {isOpenAsModal && onCloseModal && (
          <button
            onClick={onCloseModal}
            className="p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggested Chips Bar */}
      <div className="p-2.5 bg-emerald-950/40 border-b border-emerald-900/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
        <span className="font-bold text-emerald-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Quick Ask:
        </span>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(q)}
            className="px-2.5 py-1 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 whitespace-nowrap border border-emerald-800/60 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white ${
                  isUser ? 'bg-emerald-600' : 'bg-emerald-900 border border-emerald-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-400" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-emerald-50/70 dark:bg-emerald-900/30 text-gray-800 dark:text-emerald-100 border border-emerald-100 dark:border-emerald-800/50 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed text-xs">
                  {m.content}
                </div>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    isUser ? 'text-emerald-200' : 'text-gray-400 dark:text-emerald-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs p-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Consulting agronomic knowledge base...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white dark:bg-emerald-950 border-t border-gray-100 dark:border-emerald-800/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about pest control, fertilizers, soil prep, pruning..."
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-900/30 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md disabled:opacity-50 transition-all active:scale-95"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-[10px] text-gray-400 dark:text-emerald-400/60 mt-1 text-center">
          AgriMind AI provides decision support. Always follow local agricultural chemical safety guidelines & manufacturer labels.
        </div>
      </div>
    </div>
  );

  if (isOpenAsModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="max-w-2xl w-full h-[650px]">{content}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white dark:bg-emerald-950/40 p-6 rounded-2xl border border-gray-100 dark:border-emerald-800/40 shadow-sm space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              AI Farming Assistant (AgriMind)
            </h1>
            <p className="text-xs text-gray-500 dark:text-emerald-300/80">
              Conversational agricultural expert calibrated with your farm&apos;s active profile, soil chemistry, and crops.
            </p>
          </div>
        </div>
      </div>

      <div className="h-[620px]">{content}</div>
    </div>
  );
}
