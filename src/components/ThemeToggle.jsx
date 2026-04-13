import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      dir="ltr"
      // w-16 للموبايل و w-20 للديسكتوب - الارتفاع h-12 و h-14 مطابق للبروفايل
      className={`relative w-16 h-12 md:w-20 md:h-14 flex items-center rounded-xl md:rounded-2xl p-1 transition-all duration-500 shadow-inner shrink-0 border
        ${isDarkMode 
          ? 'bg-slate-800 border-white/10' 
          : 'bg-slate-100 border-slate-200'}`}
    >
      {/* الدائرة المتحركة - المقاس محسوب بالملي لضمان السنترة الطولية */}
      <div
        className={`absolute top-1 left-1 w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl shadow-md transform transition-transform duration-500 flex items-center justify-center
          ${isDarkMode 
            ? 'translate-x-4 md:translate-x-6 bg-slate-900 text-blue-400' 
            : 'translate-x-0 bg-white text-amber-500'}`}
      >
        {isDarkMode ? (
          <Moon size={18} className="md:w-5 md:h-5 animate-in fade-in zoom-in duration-300" />
        ) : (
          <Sun size={18} className="md:w-5 md:h-5 animate-in fade-in zoom-in duration-300" />
        )}
      </div>
      
      {/* أيقونات الخلفية الهادية - px-2.5 تضمن إنهم ورا الدائرة بالظبط */}
      <div className="flex justify-between items-center w-full px-2.5 md:px-3.5 opacity-20 pointer-events-none">
        <Sun size={12} className={`md:w-4 ${isDarkMode ? 'text-white' : 'text-slate-400'}`} />
        <Moon size={12} className={`md:w-4 ${isDarkMode ? 'text-white' : 'text-slate-400'}`} />
      </div>
    </button>
  );
};

export default ThemeToggle;