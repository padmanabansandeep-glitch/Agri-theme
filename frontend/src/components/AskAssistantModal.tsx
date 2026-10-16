import React, { useState } from 'react';
import { X, Send, Mic, MicOff, Volume2, Sparkles, ShieldCheck } from 'lucide-react';
import { askAgriAssistant } from '../lib/api';
import { useAppStore } from '../store/useAppStore';

interface AskAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskAssistantModal: React.FC<AskAssistantModalProps> = ({ isOpen, onClose }) => {
  const { language, selectedCrop, currentExpenses, currentProfit } = useAppStore();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; badge?: string }>>([
    {
      sender: 'ai',
      text: language === 'ta'
        ? "வணக்கம்! நான் உங்கள் அக்ரிஸ்மார்ட் உதவியாளர். பயிர் பரிந்துரை, சாகுபடி செலவு அல்லது மண் வளம் பற்றி ஏதேனும் கேட்கலாம்."
        : language === 'hi'
        ? "नमस्ते! मैं आपका एग्रीस्मार्ट सहायक हूँ। आप फसल अनुशंसा, खेती की लागत या मृदा स्वास्थ्य के बारे में पूछ सकते हैं।"
        : "Hello! I am your AgriSmart Agronomy Advisor. Ask me anything about crop suitability, expense drivers, or soil health management.",
      badge: "Verified Agronomy Advice"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim()) return;

    const userMsg = { sender: 'user' as const, text: q };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    const context = {
      crop_name: selectedCrop?.name || 'recommended crops',
      total_cost: currentExpenses ? `₹${currentExpenses.total_cost}` : undefined,
      net_profit: currentProfit ? `₹${currentProfit.expected_scenario?.net_profit}` : undefined
    };

    try {
      const res = await askAgriAssistant(q, context, language);
      setMessages(prev => [...prev, { sender: 'ai', text: res.reply, badge: res.data_badge }]);

      // Speak response if speech synthesis available
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(res.reply);
        utterance.lang = language === 'ta' ? 'ta-IN' : (language === 'hi' ? 'hi-IN' : 'en-US');
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "I am having trouble reaching the agronomy engine. However, maintaining good soil organic matter and balanced NPK is universally recommended.",
          badge: "Local Agronomy Advice"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ta' ? 'ta-IN' : (language === 'hi' ? 'hi-IN' : 'en-IN');
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setQuery(transcript);
          handleSend(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  const quickPrompts = [
    language === 'ta' ? "மண் pH அளவை எவ்வாறு மேம்படுத்துவது?" : (language === 'hi' ? "मिट्टी का pH कैसे सुधारें?" : "How to balance soil pH?"),
    language === 'ta' ? "சாகுபடி செலவை குறைப்பது எப்படி?" : (language === 'hi' ? "खेती की लागत कैसे कम करें?" : "How to reduce cultivation cost?"),
    language === 'ta' ? "பூச்சி தாக்குதலை கட்டுப்படுத்த இயற்கை வழி?" : (language === 'hi' ? "जैविक कीट नियंत्रण के उपाय?" : "Organic pest control methods?")
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-emerald-100 dark:border-emerald-800 flex flex-col h-[85vh] sm:h-[650px] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm font-display">Ask AgriSmart Advisor</h3>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
                  Honest AI
                </span>
              </div>
              <p className="text-[11px] text-emerald-100">Zero hallucination · Only explains verified scoring</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-none border border-zinc-200 dark:border-zinc-700'
                }`}
              >
                {m.text}
              </div>
              {m.badge && (
                <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-1 pl-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{m.badge}</span>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-zinc-400 p-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Checking agronomic knowledge base...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-zinc-100 dark:border-zinc-800">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="text-[11px] whitespace-nowrap px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
          <button
            onClick={toggleSpeechRecognition}
            className={`p-2.5 rounded-full transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300'
            }`}
            title="Voice Input (Tamil / Hindi / English)"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <input
            type="text"
            placeholder={isListening ? "Listening..." : "Ask agronomy question or explain results..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full px-4 py-2 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!query.trim() || isLoading}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-full transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
