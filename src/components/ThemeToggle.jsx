import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      dir="ltr"
      // التعديل: جعل العرض والارتفاع Responsive (w-16 h-12 للموبايل و w-20 h-14 للديسكتوب)
      className={`relative w-16 h-12 md:w-20 md:h-14 flex items-center rounded-xl md:rounded-2xl p-1 transition-all duration-500 shadow-inner shrink-0 border
        ${isDarkMode 
          ? 'bg-white/5 border-white/10' 
          : 'bg-slate-100 border-slate-200'}`}
    >
      {/* الدائرة المتحركة */}
      <div
        // التعديل: مقاس الدائرة (w-8 h-8 للموبايل و w-10 h-10 للديسكتوب) 
        // وتعديل مسافة الـ Translate لتناسب العرض الجديد (translate-x-6 للموبايل و translate-x-8 للديسكتوب)
        className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl shadow-md transform transition-transform duration-500 flex items-center justify-center
          ${isDarkMode 
            ? 'translate-x-6 md:translate-x-8 bg-slate-800 text-blue-400' 
            : 'translate-x-0 bg-white text-amber-500'}`}
      >
        {isDarkMode ? (
          <Moon size={18} className="md:w-5 md:h-5 animate-in fade-in zoom-in duration-300" />
        ) : (
          <Sun size={18} className="md:w-5 md:h-5 animate-in fade-in zoom-in duration-300" />
        )}
      </div>
      
      {/* خلفية جمالية ثابتة */}
      <div className="absolute inset-0 flex justify-between items-center px-2 md:px-3 pointer-events-none opacity-20">
        <Sun size={12} className={`md:w-3.5 ${isDarkMode ? 'text-white' : 'text-slate-400'}`} />
        <Moon size={12} className={`md:w-3.5 ${isDarkMode ? 'text-white' : 'text-slate-400'}`} />
      </div>
    </button>
  );
};

export default ThemeToggle;