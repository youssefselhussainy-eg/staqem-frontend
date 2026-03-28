import React from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// التعديل هنا: استدعاء الـ ThemeContext مباشرة
import { useTheme } from '../../context/ThemeContext';

const ProfileButton = () => { // شيلنا الـ Prop عشان يلقطها لوحده
  const navigate = useNavigate();
  const { isDarkMode } = useTheme(); // قفشنا الـ Theme من المصدر

  return (
    <button 
      onClick={() => navigate('/profile')}
      className={`h-full w-14 rounded-2xl border transition-all hover:scale-110 active:scale-95 flex items-center justify-center
        ${isDarkMode 
          ? 'bg-white/5 border-white/10 text-slate-400 hover:text-blue-400 hover:bg-white/10' 
          : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-white shadow-sm'}`}
      title="الملف الشخصي"
    >
      <User size={24} />
    </button>
  );
};

export default ProfileButton;