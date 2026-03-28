import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      // dir="ltr" هي السر هنا عشان نلغي تأثير العربي على حركة الزرار
      dir="ltr"
      className={`relative w-20 h-14 flex items-center rounded-2xl p-1 transition-all duration-500 shadow-inner shrink-0 border
        ${isDarkMode 
          ? 'bg-white/5 border-white/10' 
          : 'bg-slate-100 border-slate-200'}`}
    >
      {/* الدائرة المتحركة */}
      <div
        className={`w-10 h-10 rounded-xl shadow-md transform transition-transform duration-500 flex items-center justify-center
          ${isDarkMode 
            ? 'translate-x-8 bg-slate-800 text-blue-400' // بيتحرك لليمين في الدارك
            : 'translate-x-0 bg-white text-amber-500'}`}  // بيفضل مكانه عالشمال في اللايت
      >
        {isDarkMode ? (
          <Moon size={20} className="animate-in fade-in zoom-in duration-300" />
        ) : (
          <Sun size={20} className="animate-in fade-in zoom-in duration-300" />
        )}
      </div>
      
      {/* خلفية جمالية ثابتة */}
      <div className="absolute inset-0 flex justify-between items-center px-3 pointer-events-none opacity-20">
        <Sun size={14} className={isDarkMode ? 'text-white' : 'text-slate-400'} />
        <Moon size={14} className={isDarkMode ? 'text-white' : 'text-slate-400'} />
      </div>
    </button>
  );
};

export default ThemeToggle;