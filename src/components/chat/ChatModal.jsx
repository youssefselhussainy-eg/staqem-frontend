/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, User, Loader2 } from 'lucide-react';
import API from '../../api/axios'; 
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next'; 

const ChatModal = ({ isOpen, onClose, senderEmail, receiverEmail, receiverName }) => {
  const { t, i18n } = useTranslation(); 
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const scrollRef = useRef(null);
  const ws = useRef(null);

  const markAsRead = useCallback(async () => {
    if (!senderEmail || !receiverEmail) return;
    try {
      await API.patch('/chat/mark-as-read', { 
        sender: receiverEmail,
        receiver: senderEmail
      });
    } catch (err) {
      console.error("Mark Read Error:", err);
    }
  }, [senderEmail, receiverEmail]);

  const fetchHistory = useCallback(async () => {
    if (!senderEmail || !receiverEmail) return;
    setLoading(true);
    try {
      const res = await API.get(`/chat/history/${senderEmail}/${receiverEmail}`);
      setMessages(res.data);
    } catch (err) {
      console.error("History Error:", err);
    } finally {
      setLoading(false);
    }
  }, [senderEmail, receiverEmail]);

  useEffect(() => {
    if (isOpen && senderEmail && receiverEmail) {
      fetchHistory();
      markAsRead();

      const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const wsProtocol = baseURL.startsWith('https') ? 'wss' : 'ws';
      const wsHost = baseURL.replace(/^https?:\/\//, '');
      
      ws.current = new WebSocket(`${wsProtocol}://${wsHost}/ws/${senderEmail}`);
      
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "NEW_MESSAGE" && data.sender_email === receiverEmail) {
          setMessages((prev) => [...prev, data]);
          markAsRead();
        }
      };
      return () => { if (ws.current) ws.current.close(); };
    }
  }, [isOpen, senderEmail, receiverEmail, fetchHistory, markAsRead]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msgData = {
      type: "CHAT",
      sender_email: senderEmail,
      receiver_email: receiverEmail,
      content: newMessage,
    };
    try {
      await API.post('/chat/send', msgData);
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(msgData));
      }
      setMessages((prev) => [
        ...prev,
        { ...msgData, created_at: new Date().toISOString() },
      ]);
      setNewMessage("");
    } catch (err) { console.error("Send Error:", err); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        // التعديل: جعل الحاوية inset-0 بالكامل مع items-end للموبايل عشان تطلع من تحت شيك
        <div className={`fixed inset-0 z-9999 flex items-end md:items-center ${i18n.language === 'ar' ? 'md:justify-end' : 'md:justify-start'} md:p-12 pointer-events-none`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            // التعديل: h-[85vh] للموبايل عشان ميقفلش الشاشة كلها والـ rounded-t ضخمة
            className={`w-full max-w-lg h-[85vh] md:h-150 rounded-t-[2.5rem] md:rounded-[3rem] border shadow-2xl overflow-hidden flex flex-col pointer-events-auto backdrop-blur-3xl transition-all duration-500
              ${isDarkMode ? 'bg-slate-900/95 border-white/10 shadow-black' : 'bg-white/95 border-slate-200 shadow-slate-200'}`}
          >
            {/* Header - تقليل الـ padding في الموبايل */}
            <div className={`p-5 md:p-6 border-b flex justify-between items-center ${isDarkMode ? 'bg-white/5 border-white/5 text-white' : 'bg-slate-50 border-slate-100 text-slate-800'}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shrink-0">
                  <User size={20} className="md:w-6 md:h-6" />
                </div>
                <div className={i18n.language === 'ar' ? 'text-right' : 'text-left'}>
                  <h3 className="font-black text-base md:text-lg line-clamp-1">{receiverName || t('receiver_default')}</h3>
                  <p className="text-[9px] md:text-[10px] text-green-500 font-black animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> {t('online_now')}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 md:p-3 rounded-xl transition-all hover:bg-red-500/10 hover:text-red-400 text-slate-400">
                <X size={18} className="md:w-5 md:h-5" />
              </button>
            </div>

            {/* Messages Area - مساحات مرنة */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
              {loading ? (
                <div className="h-full flex items-center justify-center opacity-40">
                  <Loader2 className="animate-spin text-blue-500" size={32} />
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.sender_email === senderEmail;
                  return (
                    <div key={idx} className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}>
                      <div
                        className={`max-w-[85%] p-3.5 md:p-4 rounded-2xl md:rounded-3xl text-sm font-bold shadow-sm border
                        ${isMe 
                          ? `bg-blue-600 border-blue-500 text-white ${i18n.language === 'ar' ? 'rounded-br-none' : 'rounded-bl-none'}` 
                          : (isDarkMode 
                              ? `bg-white/10 border-white/5 text-blue-50 ${i18n.language === 'ar' ? 'rounded-bl-none' : 'rounded-br-none'}` 
                              : `bg-slate-100 border-slate-200 text-slate-700 ${i18n.language === 'ar' ? 'rounded-bl-none' : 'rounded-br-none'}`)}`}
                      >
                        {msg.content}
                        <p className={`text-[8px] md:text-[9px] mt-1 opacity-40 ${isMe ? 'text-white' : (isDarkMode ? 'text-blue-200' : 'text-slate-500')}`}>
                          {new Date(msg.created_at || msg.timestamp).toLocaleTimeString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Area - تظبيط شكل الـ input للموبايل */}
            <form onSubmit={handleSend} className={`p-4 md:p-6 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
              <div className={`flex items-center gap-2 md:gap-3 p-1.5 md:p-2 rounded-3xl md:rounded-4xl border transition-all focus-within:ring-2 focus-within:ring-blue-500/50
                ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('chat_input_placeholder')}
                  className={`flex-1 bg-transparent border-none outline-none px-3 md:px-4 text-xs md:text-sm font-bold placeholder:opacity-30 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2.5 md:p-3 bg-blue-600 text-white rounded-xl md:rounded-2xl hover:bg-blue-500 transition-all active:scale-90 shadow-lg disabled:opacity-50"
                >
                  <Send size={16} className={`md:w-4.5 md:h-4.5 ${i18n.language === 'en' ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;