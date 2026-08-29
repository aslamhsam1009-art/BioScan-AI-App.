import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, ShieldCheck } from 'lucide-react';
import { ScanResult, LanguageCode, CountryInfo } from '../types';
import { translations } from '../i18n/translations';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  scanResult: ScanResult;
  language: LanguageCode;
  country: CountryInfo;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  scanResult,
  language,
  country,
}) => {
  const t = translations[language];
  const organismName = scanResult.plantData?.commonName || scanResult.animalData?.commonName || (language === 'ar' ? 'الكائن الحي' : 'Identified Organism');
  const organismType = scanResult.type;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    organismType === 'plant'
      ? (language === 'ar' ? 'كم مرة يجب أن أسقي هذا النبات؟' : 'How often should I water this?')
      : (language === 'ar' ? 'ما هو النظام الغذائي الأنسب والصحي؟' : 'What is the healthiest diet?'),
    organismType === 'plant'
      ? (language === 'ar' ? 'هل هذه النبتة سامة للقطط والكلاب؟' : 'Is this toxic to household pets?')
      : (language === 'ar' ? 'ماذا تعني الأصوات والحركات الشائعة التي يصدرها؟' : 'What do its common sounds mean?'),
    language === 'ar' ? `كيف يتأقلم مع مناخ ${country.name}؟` : `How does it adapt to ${country.name}'s climate?`,
    language === 'ar' ? 'ما هي العلامات المبكرة للأمراض أو المشاكل الصحية؟' : 'What are the early warning signs of illness?',
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: ChatMessage = {
        id: 'init-1',
        sender: 'ai',
        text: language === 'ar'
          ? `مرحباً بك! أنا مساعد الذكاء الاصطناعي الخاص بـ **${organismName}** (${organismType === 'plant' ? 'نبات' : 'حيوان'}). تفضل بطرح أي استفسار حول طرق العناية اليومية، التشخيص المرضي، السمية، دلالات الأصوات، أو التأقلم المناخي في **${country.name}**!`
          : `Hello! I am your BioScan AI Assistant for **${organismName}** (${organismType}). Ask me any questions about daily care, health diagnostics, toxicity, sound meanings, or climate adaptation in **${country.name}**!`,
        timestamp: Date.now(),
      };
      setMessages([greeting]);
    }
  }, [isOpen, organismName, organismType, country.name, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organismName,
          organismType,
          organismData: scanResult.plantData || scanResult.animalData,
          message: query,
          country: country.name,
          language,
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || (language === 'ar' ? 'إليك المعلومات الإرشادية الخاصة بسؤالك.' : 'Here is the relevant information based on your question.'),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: language === 'ar'
          ? `عذراً، حدث اضطراب مؤقت في الاتصال. باختصار بالنسبة لـ **${organismName}**: تأكد من توفير بيئة ملائمة وحرارة مناسبة والري/التغذية الصحيحة واستشارة أخصائي عند الضرورة.`
          : `I experienced a temporary connection issue. In summary for **${organismName}**: Ensure suitable temperature, proper nutrition/watering, and consult a local professional in ${country.name} for acute symptoms.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh] max-h-[750px]">
        {/* Header */}
        <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img src={scanResult.imageUrl} alt={organismName} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{organismName}</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] uppercase font-bold border border-emerald-200">
                  {language === 'ar' ? 'مساعد ذكي' : 'AI Expert'}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 font-normal">
                <span>{language === 'ar' ? `مخصص لـ ${country.flag} ${country.name}` : `Tailored for ${country.flag} ${country.name}`}</span>
              </p>
            </div>
          </div>

          <button
            id="chat-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title={t.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History Stage */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold shrink-0 mt-1 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-te-none shadow-xs font-normal text-left rtl:text-right'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-ts-none shadow-xs font-normal text-left rtl:text-right'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className={`text-[9px] mt-1.5 ${msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'} text-end font-medium`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700 shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-ts-none px-4 py-2.5 text-xs text-slate-500 flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                <span className="ms-1 text-[11px] text-slate-500">
                  {language === 'ar' ? 'جارٍ استشارة قاعدة البيانات العلمية...' : 'BioScan AI is consulting database...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Follow-Up Prompts */}
        <div className="p-3 bg-white border-t border-slate-100">
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase mb-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{t.suggestedQuestions}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                id={`chat-sug-${i}`}
                onClick={() => handleSendMessage(sug)}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-800 font-semibold transition-colors text-left rtl:text-right border border-slate-200 shadow-2xs"
              >
                💬 {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <textarea
            id="chat-input-textarea"
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.chatInputPlaceholder}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white resize-none max-h-24 transition-colors"
          />
          <button
            id="chat-send-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isTyping}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-colors shadow-xs"
            title={t.send}
          >
            <Send className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        {/* Footer Disclaimer */}
        <div className="px-4 py-2 bg-slate-50 text-[10px] text-slate-500 text-center border-t border-slate-100 flex items-center justify-center gap-1 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.disclaimerText}</span>
        </div>
      </div>
    </div>
  );
};
