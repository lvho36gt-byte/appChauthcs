import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Volume2, VolumeX, Trash2, AlertCircle, CheckCircle2, Atom, User as UserIcon } from 'lucide-react';
import { User } from '../types/physics';

interface Message {
  id: string;
  sender: 'user' | 'physi';
  text: string;
  timestamp: string;
}

interface PhysiAssistantModuleProps {
  currentUser: User;
  initialTopic?: string;
}

export const PhysiAssistantModule: React.FC<PhysiAssistantModuleProps> = ({ currentUser, initialTopic }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-01',
      sender: 'physi',
      text: `Xin chào ${currentUser.name}! Thầy là PHYSI – Trợ lý Nhà khoa học AI của Trường THCS Chu Văn An. 
Thầy ở đây để đồng hành cùng em trong các thí nghiệm Vật lí thật, giải thích bản chất hiện tượng và hướng dẫn em cách thu thập số liệu chính xác. Em đang quan tâm đến chủ đề hoặc thí nghiệm nào hôm nay?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputVal, setInputVal] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [reportedMsgId, setReportedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialTopic) {
      sendMessage(`Em muốn tìm hiểu sâu về chủ đề: ${initialTopic}. Thầy có thể hướng dẫn em cách làm thí nghiệm đo đạc không?`);
    }
  }, [initialTopic]);

  const quickPrompts = [
    'Làm sao để đo tốc độ xe đồ chơi mà ít bị sai số bấm tay?',
    'Giải thích tại sao góc phản xạ luôn bằng góc tới i\' = i?',
    'Điều kiện cân bằng của đòn bẩy F1 × l1 = F2 × l2 là gì?',
    'Tại sao bình giữ nhiệt lại có lớp vỏ chân không?',
    'Phân biệt mạch điện kín và mạch điện hở khi mắc đèn LED?',
    'Chu kì dao động con lắc đơn T phụ thuộc vào yếu tố nào?'
  ];

  // Speech synthesis in Vietnamese
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!speechEnabled) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const sendMessage = async (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/physi-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          grade: currentUser.className?.includes('6') ? 6 : currentUser.className?.includes('8') ? 8 : 7
        })
      });

      const data = await res.json();
      const replyText = data.reply || 'Thầy đã nhận được câu hỏi. Em hãy thử đối chiếu lại số liệu thí nghiệm xem nhé!';

      const physiMsg: Message = {
        id: `msg-physi-${Date.now()}`,
        sender: 'physi',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, physiMsg]);
      if (speechEnabled) {
        speakText(replyText);
      }
    } catch (err) {
      console.error('Failed to chat with Physi:', err);
      const fallbackMsg: Message = {
        id: `msg-physi-${Date.now()}`,
        sender: 'physi',
        text: 'Hiện thầy đang kết nối lại với phòng thí nghiệm. Em hãy nhớ nguyên tắc: "Thí nghiệm thật – Dữ liệu thật – Khám phá cùng AI" nhé!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'physi',
        text: `Đã làm mới cuộc hội thoại! Thầy PHYSI sẵn sàng trả lời các câu hỏi thí nghiệm mới của em.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px]">
      {/* Top Banner / Persona Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-cyan-800/40">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Atom className="w-7 h-7 text-white animate-spin-slow" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base tracking-tight text-white">PHYSI – NHÀ KHOA HỌC AI</h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider border border-cyan-400/30">
                THCS Chu Văn An
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Trợ lý học tập thông minh: Đặt câu hỏi gợi mở • Giải thích hiện tượng • Hướng dẫn thí nghiệm an toàn
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              else setSpeechEnabled(!speechEnabled);
            }}
            title={speechEnabled ? 'Bật đọc tiếng Việt' : 'Tắt đọc'}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              speechEnabled
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline">Dừng đọc</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">{speechEnabled ? 'Giọng đọc: BẬT' : 'Giọng đọc: TẮT'}</span>
              </>
            )}
          </button>

          <button
            onClick={clearChat}
            title="Xóa đoạn chat"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        {messages.map(msg => {
          const isPhysi = msg.sender === 'physi';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isPhysi ? 'justify-start' : 'justify-end'}`}
            >
              {isPhysi && (
                <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Atom className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5 ${isPhysi ? '' : 'items-end flex flex-col'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                    isPhysi
                      ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm'
                  }`}
                >
                  {msg.text}
                </div>

                <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {isPhysi && (
                    <>
                      <span>•</span>
                      <button
                        onClick={() => speakText(msg.text)}
                        className="hover:text-cyan-600 flex items-center gap-1"
                      >
                        <Volume2 className="w-3 h-3" />
                        Đọc lại
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => {
                          setReportedMsgId(msg.id);
                          setTimeout(() => setReportedMsgId(null), 3000);
                        }}
                        className="hover:text-amber-600"
                      >
                        {reportedMsgId === msg.id ? '✓ Đã báo cáo' : 'Báo cáo chưa chuẩn'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {!isPhysi && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Atom className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-sm text-xs text-slate-500 flex items-center gap-2">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.4s]"></span>
              </span>
              <span>PHYSI đang tra cứu kiến thức và suy nghĩ câu trả lời...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 overflow-x-auto flex items-center gap-2 shrink-0">
        <span className="text-[11px] font-bold text-slate-500 shrink-0">Gợi ý nhanh:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(p)}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-slate-700 hover:text-cyan-800 text-[11px] font-medium shrink-0 transition-all shadow-2xs"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={e => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Hỏi PHYSI về định luật, cách đo số liệu, giải thích sai số..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Gửi câu hỏi</span>
          </button>
        </form>
      </div>
    </div>
  );
};
