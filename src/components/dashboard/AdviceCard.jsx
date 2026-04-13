/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Trophy, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// مصفوفة المفاتيح (الترجمة الفعلية هتكون في ملف i18n.js) ✅
const adviceKeys = [
  "advice_text_1",
  "advice_text_2",
  "advice_text_3",
  "advice_text_4",
  "advice_text_5",
  "advice_text_6"
];

const AdviceCard = ({ doctorName, isDarkMode }) => {
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % adviceKeys.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    // التعديل: جعل الـ padding والـ rounded متجاوبين (p-6 و rounded-2rem للموبايل)
    <div className={`p-6 md:p-8 rounded-4xl md:rounded-[3rem] border backdrop-blur-sm transition-all duration-500 h-full flex flex-col justify-between
      ${isDarkMode ? 'bg-white/3 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
      
      <div className={`flex items-center gap-3 md:gap-4 mb-4 md:mb-6 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <div className={`p-3 md:p-4 rounded-2xl md:rounded-3xl ${isDarkMode ? 'bg-amber-600/20 text-amber-400' : 'bg-amber-50 text-amber-500'}`}>
          <Trophy size={24} className="md:w-7 md:h-7" />
        </div>
        <div>
          <h3 className={`font-black text-lg md:text-xl ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
             {t('dr_advice_title', { name: doctorName?.split(' ')[0] || t('specialist') })} 
          </h3>
          <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
            {t('medical_guidance')}
          </p>
        </div>
      </div>

      {/* التعديل: جعل الحاوية الداخلية مرنة في الموبايل (p-4 و rounded-3xl) */}
      <div className={`p-4 md:p-6 rounded-3xl md:rounded-4xl border relative overflow-hidden flex-1 flex items-center
        ${isDarkMode ? 'bg-white/5 border-white/5 shadow-inner' : 'bg-linear-to-br from-amber-50/50 to-orange-50/50 border-amber-100'}`}>
        
        <Quote 
          size={48}
          className={`md:w-15 md:h-15 absolute -top-2 ${i18n.language === 'ar' ? '-left-2 rotate-180' : '-right-2'} opacity-10 ${isDarkMode ? 'text-white' : 'text-amber-100'}`} 
        />
        
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, x: i18n.language === 'ar' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: i18n.language === 'ar' ? -20 : 20 }}
            transition={{ duration: 0.6 }}
            className={`text-base md:text-lg leading-relaxed font-bold italic w-full
              ${i18n.language === 'ar' ? 'text-right' : 'text-left'}
              ${isDarkMode ? 'text-blue-50' : 'text-amber-900'}`}
            dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
          >
            "{t(adviceKeys[currentIndex])}"
          </motion.p>
        </AnimatePresence>

        <div className={`absolute -bottom-4 ${i18n.language === 'ar' ? '-right-4' : '-left-4'} opacity-5 rotate-12`}>
          <Trophy size={80} className="md:w-25 md:h-25" />
        </div>
      </div>

      <div className="flex justify-center gap-1.5 md:gap-2 mt-4 md:mt-6">
        {adviceKeys.map((_, i) => (
          <div key={i} className={`h-1 md:h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-5 md:w-6 bg-amber-500' : 'w-1 md:w-1.5 bg-slate-300 opacity-30'}`} />
        ))}
      </div>
    </div>
  );
};

export default AdviceCard;