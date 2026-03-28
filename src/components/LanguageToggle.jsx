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
    // تغيير اتجاه الصفحة بالكامل
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`h-14 px-4 rounded-2xl border transition-all flex items-center gap-2 font-black text-xs uppercase tracking-widest active:scale-95
        ${isDarkMode 
          ? 'bg-white/5 border-white/10 text-blue-400 hover:bg-blue-600/10' 
          : 'bg-slate-100 border-slate-200 text-blue-600 hover:bg-blue-50'}`}
    >
      <Languages size={20} />
      <span>{i18n.language === 'ar' ? 'EN' : 'عربي'}</span>
    </button>
  );
};

export default LanguageToggle;