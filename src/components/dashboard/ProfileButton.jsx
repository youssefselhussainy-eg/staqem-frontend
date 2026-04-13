import React from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const ProfileButton = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <button 
      onClick={() => navigate('/profile')}
      // التعديل: استبدال h-full و w-14 بمقاسات Responsive (w-12 للموبايل و w-14 للديسكتوب) 
      // مع التأكد من وجود flex و items-center و justify-center للسنترة
      className={`h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl border transition-all hover:scale-110 active:scale-95 flex items-center justify-center shrink-0
        ${isDarkMode 
          ? 'bg-white/5 border-white/10 text-slate-400 hover:text-blue-400 hover:bg-white/10' 
          : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-white shadow-sm'}`}
      title="الملف الشخصي"
    >
      <User size={24} className="md:w-6 md:h-6 w-5 h-5" />
    </button>
  );
};

export default ProfileButton;