import React, { useState, useEffect } from 'react';
import { MessageSquareText } from 'lucide-react';
// الـ API الموحد عشان يلقط من السيرفر الأونلاين
import API from '../../api/axios'; 
import { useTheme } from '../../context/ThemeContext';

const FloatingChatIcon = ({ onClick, userEmail }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchUnread = async () => {
      if (!userEmail) return;
      try {
        // نداء الـ API لجلب عدد الرسائل غير المقروءة
        const res = await API.get(`/chat/unread-count/${userEmail}`);
        setUnreadCount(res.data.unread_count);
      } catch (err) { 
        console.error("Unread fetch error:", err); 
      }
    };

    fetchUnread();
    // تحديث تلقائي كل 15 ثانية
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
      // استخدمنا z-[1500] لضمان الظهور فوق أي حاجة، و w-14 للموبايل و w-16 للديسكتاب
      className={`fixed bottom-6 left-6 md:bottom-8 md:left-8 z-1500 w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-4xl flex items-center justify-center transition-all duration-500 shadow-2xl hover:scale-110 active:scale-90 group
        ${isDarkMode 
          ? 'bg-blue-600 text-white shadow-blue-900/40 border border-white/20' 
          : 'bg-blue-600 text-white shadow-blue-200 border border-blue-400'}`}
    >
      <MessageSquareText size={24} className="md:w-7 md:h-7 group-hover:rotate-12 transition-transform" />
      
      {/* --- إشعار الرسائل (Notification Badge) --- */}
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-6 w-6 z-1501">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className={`relative inline-flex rounded-full h-6 w-6 bg-red-500 text-[10px] font-black items-center justify-center border-2 shadow-lg
            ${isDarkMode ? 'border-[#070b14]' : 'border-white'}`}>
            {unreadCount}
          </span>
        </span>
      )}
    </button>
  );
};

export default FloatingChatIcon;