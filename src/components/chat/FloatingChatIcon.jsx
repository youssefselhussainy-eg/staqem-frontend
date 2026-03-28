import React, { useState, useEffect } from 'react';
import { MessageSquareText } from 'lucide-react';
// استبدلنا axios العادي بملف الـ API الموحد عشان يكلم السيرفر الأونلاين
import API from '../../api/axios'; 
import { useTheme } from '../../context/ThemeContext';

const FloatingChatIcon = ({ onClick, userEmail }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchUnread = async () => {
      if (!userEmail) return;
      try {
        // الـ API دلوقت عارف يروح لـ Render أوتوماتيك
        const res = await API.get(`/chat/unread-count/${userEmail}`);
        setUnreadCount(res.data.unread_count);
      } catch (err) { 
        console.error("Unread fetch error:", err); 
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    
    return () => clearInterval(interval);
  }, [userEmail]);

  const handleIconClick = () => {
    setUnreadCount(0);
    onClick();
  };

  return (
    <button 
      onClick={handleIconClick}
      className={`fixed bottom-8 left-8 z-1500 w-16 h-16 rounded-4xl flex items-center justify-center transition-all duration-500 shadow-2xl hover:scale-110 active:scale-90 group pointer-events-auto
        ${isDarkMode 
          ? 'bg-blue-600 text-white shadow-blue-900/40 border border-white/20' 
          : 'bg-blue-600 text-white shadow-blue-200 border border-blue-400'}`}
    >
      <MessageSquareText size={28} className="group-hover:rotate-12 transition-transform" />
      
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-6 w-6">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 text-[10px] font-black items-center justify-center border-2 border-[#070b14]">
            {unreadCount}
          </span>
        </span>
      )}
    </button>
  );
};

export default FloatingChatIcon;