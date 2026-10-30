import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  X,
  Send,
  Mic,
  Volume2,
  VolumeX,
  Trash2,
  Copy,
  Check,
  Compass,
  ArrowRight,
  Bot,
  AlertCircle,
} from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';
import { askAssistantAi } from '../../services/apiService';
import { CompanionOrb3D } from '../3d/CompanionOrb3D';

export const AIAssistantDrawer: React.FC = () => {
  const isAssistantOpen = useTripStore((s) => s.isAssistantOpen);
  const toggleAssistant = useTripStore((s) => s.toggleAssistant);
  const messages = useTripStore((s) => s.assistantMessages);
  const addMessage = useTripStore((s) => s.addAssistantMessage);
  const clearChat = useTripStore((s) => s.clearAssistantChat);
  const hasUnread = useTripStore((s) => s.hasUnreadAssistantAlert);
  const isTtsEnabled = useTripStore((s) => s.isTtsEnabled);
  const toggleTts = useTripStore((s) => s.toggleTts);

  const language = useTripStore((s) => s.language);
  const plannerForm = useTripStore((s) => s.plannerForm);
  const selectedPackage = useTripStore((s) => s.selectedPackage);
  const activeDisruption = useTripStore((s) => s.activeDisruption);
  const userLocation = useTripStore((s) => s.userLocation);
  const triggerDisruption = useTripStore((s) => s.triggerDisruption);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Speech synthesis helper
  const speakText = (text: string) => {
    if (!isTtsEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Web Speech API Voice Recognition
  const handleMicInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSendMessage(transcript);
    };

    recognition.start();
  };

  const handleSendMessage = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || isLoading) return;

    addMessage({
      sender: 'user',
      text: textToSend,
    });
    setInput('');
    setIsLoading(true);

    // Check for demo simulation triggers
    const lower = textToSend.toLowerCase();
    if (lower.includes('simulate rain') || lower.includes('மழை')) {
      triggerDisruption('disrupt-rain');
    } else if (lower.includes('simulate train') || lower.includes('ரயில்')) {
      triggerDisruption('disrupt-train');
    } else if (lower.includes('simulate budget') || lower.includes('பட்ஜெட்')) {
      triggerDisruption('disrupt-budget');
    }

    const tripContext = {
      from: plannerForm.from,
      destination: plannerForm.destination,
      budget: plannerForm.budget,
      travelers: plannerForm.travelers,
      package: selectedPackage?.name,
      disruption: activeDisruption?.title,
      location: userLocation.address,
    };

    const res = await askAssistantAi(textToSend, tripContext, language);

    addMessage({
      sender: 'assistant',
      text: res.reply,
      suggestedChips: [
        'Is my current route safe?',
        'Suggest best local food places',
        'How to reduce remaining expenses?',
      ],
    });

    speakText(res.reply);
    setIsLoading(false);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <>
      {/* Floating 3D Assistant Orb / Button */}
      <div className="fixed bottom-20 md:bottom-6 right-5 z-40 flex items-center gap-2">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <div
            onClick={toggleAssistant}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0B1F3A] via-[#14B8A6] to-[#FF7A1A] p-0.5 shadow-xl shadow-[#FF7A1A]/30 flex items-center justify-center cursor-pointer group"
          >
            <div className="w-full h-full rounded-full bg-[#071427] flex items-center justify-center overflow-hidden">
              <CompanionOrb3D
                isThinking={isLoading}
                hasAlert={hasUnread}
                className="w-12 h-12"
              />
            </div>
          </div>

          {/* Unread Alert Dot */}
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white animate-bounce flex items-center justify-center text-[9px] font-bold text-white">
              !
            </span>
          )}

          {/* Desktop Hover Tooltip */}
          <div className="hidden lg:block absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-full bg-white dark:bg-[#0B1F3A] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {language === 'ta' ? 'TripPilot AI-ஐ கேளுங்கள்' : 'Ask TripPilot AI'}
          </div>
        </motion.div>
      </div>

      {/* Slide-out Drawer / Bottom Sheet */}
      <AnimatePresence>
        {isAssistantOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleAssistant}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="relative w-full max-w-md h-full bg-white/95 dark:bg-[#071427]/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF7A1A] to-[#14B8A6] flex items-center justify-center text-white shadow-md">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>TripPilot AI Assistant</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30">
                        {language === 'ta' ? 'செயலில் உள்ளது' : 'Active'}
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === 'ta'
                        ? 'உங்கள் ஸ்மார்ட் பயணத் துணை'
                        : 'Your smart 24/7 travel co-pilot'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleTts}
                    className={`p-2 rounded-full transition ${
                      isTtsEnabled
                        ? 'text-[#FF7A1A] bg-[#FF7A1A]/10'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title={isTtsEnabled ? 'Voice Output ON' : 'Voice Output OFF'}
                  >
                    {isTtsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={clearChat}
                    className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                    title="Clear Chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={toggleAssistant}
                    className="p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm relative group ${
                          isUser
                            ? 'bg-gradient-to-r from-[#FF7A1A] to-[#ff8c38] text-white rounded-br-xs'
                            : 'bg-white dark:bg-[#0B1F3A] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-bl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {!isUser && (
                          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                            <span>{msg.timestamp}</span>
                            <button
                              onClick={() => handleCopy(msg.id, msg.text)}
                              className="hover:text-[#FF7A1A] flex items-center gap-1 transition"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-teal-500" />
                                  <span className="text-teal-500">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Suggested Chips from AI */}
                      {!isUser && msg.suggestedChips && msg.suggestedChips.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {msg.suggestedChips.map((chip, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(chip)}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-[#FF7A1A]/10 hover:text-[#FF7A1A] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1"
                            >
                              <span>{chip}</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Loading typing bubble */}
                {isLoading && (
                  <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-100 dark:bg-[#0B1F3A] border border-slate-200 dark:border-slate-800 w-24">
                    <span className="w-2 h-2 rounded-full bg-[#FF7A1A] animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-[#FF7A1A] animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Demo Action Shortcuts */}
              <div className="px-4 py-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                  Simulate:
                </span>
                {[
                  { label: '🌧️ Heavy Rain', action: 'simulate rain' },
                  { label: '🚂 Train Delay', action: 'simulate train delay' },
                  { label: '💸 Budget Alert', action: 'simulate budget overrun' },
                ].map((s) => (
                  <button
                    key={s.action}
                    onClick={() => handleSendMessage(s.action)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap hover:border-[#FF7A1A] transition"
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Chat Input Field */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#071427]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={handleMicInput}
                    className={`p-2.5 rounded-xl border transition ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse border-red-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:text-[#FF7A1A]'
                    }`}
                    title="Speak to Assistant"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      language === 'ta'
                        ? 'பாதை, பாதுகாப்பு, உணவகங்கள் பற்றி கேளுங்கள்...'
                        : 'Ask anything about your route, safety, food...'
                    }
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] transition"
                  />

                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-2.5 rounded-xl bg-[#FF7A1A] hover:bg-[#ff8c38] disabled:opacity-40 text-white transition shadow-md shadow-[#FF7A1A]/30 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
