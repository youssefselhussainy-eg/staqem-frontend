import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      dir="ltr"
      // w-16 للموبايل و w-20 للديسكتوب - مقاسات ثابتة ومحكمة
      className={`relative w-16 h-10 md:w-20 md:h-12 flex items-center rounded-full p-1 transition-all duration-500 shadow-inner shrink-0 border
        ${isDarkMode 
          ? 'bg-slate-800 border-white/10' 
          : 'bg-slate-100 border-slate-200'}`}
    >
      {/* الدائرة المتحركة - استخدمنا absolute عشان نضمن السنترة والحركة 100% */}
      <div
        className={`absolute top-1 bottom-1 w-8 h-8 md:w-10 md:h-10 rounded-full shadow-md transform transition-transform duration-500 flex items-center justify-center
          ${isDarkMode 
            ? 'translate-x-6 md:translate-x-8 bg-slate-900 text-blue-400' 
            : 'translate-x-0 bg-white text-amber-500'}`}
      >
        {isDarkMode ? (
          <Moon size={18} className="md:w-5 md:h-5 animate-in fade-in zoom-in duration-300" />
        ) : (
          <Sun size={18} className="md:w-5 md:h-5 animate-in fade-in zoom-in duration-300" />
        )}
      </div>
      
      {/* أيقونات الخلفية الهادية */}
      <div className="flex justify-between items-center w-full px-2 md:px-3 opacity-20 pointer-events-none">
        <Sun size={12} className={`md:w-3.5 ${isDarkMode ? 'text-white' : 'text-slate-400'}`} />
        <Moon size={12} className={`md:w-3.5 ${isDarkMode ? 'text-white' : 'text-slate-400'}`} />
      </div>
    </button>
  );
};

export default ThemeToggle;