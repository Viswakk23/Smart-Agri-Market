import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Namaste! I am your **KisanAI Multi-Factor Decision Advisor**.

I can help you make data-driven decisions on:
- **Sell / Store / Wait strategies** based on predictive machine learning
- **Global export demand parity & international trade trends**
- **Crop disease & post-harvest rot early warnings**
- **Road freight diesel costs vs net in-hand realization**
- **Cold storage feasibility & breakeven analysis**

How can I assist you with your harvest today?`,
      timestamp: 'Just now',
      suggestions: [
        'Should I sell tomatoes today in Kolar?',
        'Check tomato disease risk & post-harvest loss',
        'Analyze international export trends for Basmati & Cotton',
        'Calculate road freight deduction to Azadpur',
        'Is cold storage profitable for onions in Nashik?'
      ]
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputPrompt).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          context: {
            currentDate: '2026-09-04',
            region: 'India wholesale agmarknet'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from Agri Assistant');
      }

      const data = await response.json();

      const botMessage: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'I could not process your query at this moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dataCard: data.dataCard
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        text: `### KisanAI Fallback Advisory:
Based on current Agmarknet records, wholesale mandi rates are stable across major commodities. If you are holding perishables like Tomato, sell within 48 hours to avoid quality degradation. For storable crops like Onion or Wheat, check the **Profit Simulator** to verify warehouse rent breakeven points.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">KisanAI Decision Assistant</h1>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                AI + Agro Rules Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Trained on Agmarknet historical price cycles, weather shocks, and cold storage logistics.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Chat</span>
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-slate-800 text-white'
                    : 'bg-emerald-600 text-white shadow-xs'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] space-y-2`}>
                <div
                  className={`rounded-xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-xs'
                      : 'bg-slate-50 text-slate-900 border border-slate-200 rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">
                    {msg.text}
                  </div>

                  {/* Optional Data Card Attached to Assistant Message */}
                  {msg.dataCard && (
                    <div className="mt-3 pt-3 border-t border-slate-200 bg-white rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block mb-2">
                        📊 {msg.dataCard.title}
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(msg.dataCard.details).map(([key, val]) => (
                          <div key={key} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span className="text-[10px] text-slate-500 block">{key}:</span>
                            <strong className="text-slate-900 text-xs">{val}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <span
                    className={`block text-[10px] mt-2 text-right ${
                      msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {/* Suggestions Pills if any */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(suggestion)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold transition text-left"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-500 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span>Analyzing mandi prices and weather data...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-4 border-t border-slate-200 flex items-center gap-2"
        >
          <input
            id="chat-input"
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask anything, e.g. 'Should I sell tomatoes today in Kolar?'..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            id="chat-submit-btn"
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
