import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      dir="ltr"
      // التعديل: وسّعنا العرض (w-20 للموبايل و w-24 للديسكتوب) عشان يبان إنه Toggle مش مربع
      // وحافظنا على الارتفاع (h-12 و h-14) عشان يطابق البروفايل
      className={`relative w-20 h-12 md:w-24 md:h-14 flex items-center rounded-xl md:rounded-2xl p-1.5 transition-all duration-500 shadow-inner shrink-0 border
        ${isDarkMode 
          ? 'bg-slate-800 border-white/10' 
          : 'bg-slate-100 border-slate-200'}`}
    >
      {/* الدائرة المتحركة - صغرنا حجمها (w-8 للموبايل و w-10 للديسكتوب) عشان تبان "دائرة" مش "بلوك" */}
      <div
        className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl shadow-md transform transition-transform duration-500 flex items-center justify-center
          ${isDarkMode 
            ? 'translate-x-9 md:translate-x-11 bg-slate-900 text-blue-400' 
            : 'translate-x-0 bg-white text-amber-500'}`}
      >
        {isDarkMode ? (
          <Moon size={18} className="md:w-5 md:h-5 animate-in fade-in zoom-in duration-300" />
        ) : (
          <Sun size={18} className="md:w-5 md:h-5 animate-in fade-in zoom-in duration-300" />
        )}
      </div>
      
      {/* أيقونات الخلفية الهادية - متوزعة بانتظام */}
      <div className="absolute inset-0 flex justify-between items-center px-3 md:px-4 pointer-events-none opacity-20">
        <Sun size={14} className={isDarkMode ? 'text-white' : 'text-slate-400'} />
        <Moon size={14} className={isDarkMode ? 'text-white' : 'text-slate-400'} />
      </div>
    </button>
  );
};

export default ThemeToggle;