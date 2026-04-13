import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const { isDarkMode } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <button
      onClick={toggleLanguage}
      // التعديل: h-12 للموبايل و h-14 للديسكوب، مع تقليل الـ padding (px-3) والـ gap للموبايل
      className={`h-12 md:h-14 px-3 md:px-4 rounded-xl md:rounded-2xl border transition-all flex items-center gap-1.5 md:gap-2 font-black text-[10px] md:text-xs uppercase tracking-widest active:scale-95 shrink-0
        ${isDarkMode 
          ? 'bg-white/5 border-white/10 text-blue-400 hover:bg-blue-600/10' 
          : 'bg-slate-100 border-slate-200 text-blue-600 hover:bg-blue-50'}`}
    >
      <Languages size={18} className="md:w-5 md:h-5" />
      <span>{i18n.language === 'ar' ? 'EN' : 'عربي'}</span>
    </button>
  );
};

export default LanguageToggle;