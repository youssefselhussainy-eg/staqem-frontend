import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      dir="ltr"
      // w-16 للموبايل و w-20 للديسكتوب - الارتفاع h-12 و h-14 مطابق للبروفايل بالظبط
      // والـ rounded-xl و rounded-2xl عشان نرجع للشكل المربع الأصلي
      className={`relative w-16 h-12 md:w-20 md:h-14 flex items-center rounded-xl md:rounded-2xl p-1 transition-all duration-500 shadow-inner shrink-0 border
        ${isDarkMode 
          ? 'bg-slate-800 border-white/10' 
          : 'bg-slate-100 border-slate-200'}`}
    >
      {/* الدائرة المتحركة - absolute لضمان السنترة 100% بدون تدخل الـ CSS الخارجي */}
      <div
        className={`absolute top-1 bottom-1 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl shadow-md transform transition-transform duration-500 flex items-center justify-center
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
        <Sun size={12} className={`md:w-[14px] ${isDarkMode ? 'text-white' : 'text-slate-400'}`} />
        <Moon size={12} className={`md:w-[14px] ${isDarkMode ? 'text-white' : 'text-slate-400'}`} />
      </div>
    </button>
  );
};

export default ThemeToggle;