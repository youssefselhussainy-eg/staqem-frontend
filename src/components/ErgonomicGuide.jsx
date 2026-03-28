import React from 'react';
import { Monitor, Smartphone, Clock, Bed, ShoppingBag, UserCheck, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next'; // استيراد الترجمة

const ErgonomicGuide = () => {
  const { isDarkMode } = useTheme();
  const { t, i18n } = useTranslation(); // تفعيل الترجمة

  const guidelines = [
    {
      id: 1,
      title: t('guide_sitting_title'),
      engTitle: "Sitting Posture",
      tips: [t('guide_sitting_tip1'), t('guide_sitting_tip2')],
      icon: <UserCheck size={24} />,
      color: "blue"
    },
    {
      id: 2,
      title: t('guide_screen_title'),
      engTitle: "Screen Position",
      tips: [t('guide_screen_tip1'), t('guide_screen_tip2'), t('guide_screen_tip3')],
      icon: <Monitor size={24} />,
      color: "purple"
    },
    {
      id: 3,
      title: t('guide_mobile_title'),
      engTitle: "Mobile Usage",
      tips: [t('guide_mobile_tip1'), t('guide_mobile_tip2')],
      icon: <Smartphone size={24} />,
      color: "indigo"
    },
    {
      id: 4,
      title: t('guide_breaks_title'),
      engTitle: "Smart Breaks",
      tips: [t('guide_breaks_tip1'), t('guide_breaks_tip2')],
      icon: <Clock size={24} />,
      color: "emerald"
    },
    {
      id: 5,
      title: t('guide_sleep_title'),
      engTitle: "Healthy Sleeping",
      tips: [t('guide_sleep_tip1'), t('guide_sleep_tip2')],
      icon: <Bed size={24} />,
      color: "amber"
    },
    {
      id: 6,
      title: t('guide_bags_title'),
      engTitle: "Carrying Bags",
      tips: [t('guide_bags_tip1'), t('guide_bags_tip2')],
      icon: <ShoppingBag size={24} />,
      color: "rose"
    }
  ];

  const getIconStyles = (color) => {
    const colors = {
      blue: isDarkMode ? "bg-blue-500/20 text-blue-400 border-blue-500/20" : "bg-blue-50 text-blue-600 border-blue-100",
      purple: isDarkMode ? "bg-purple-500/20 text-purple-400 border-purple-500/20" : "bg-purple-50 text-purple-600 border-purple-100",
      indigo: isDarkMode ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/20" : "bg-indigo-50 text-indigo-600 border-indigo-100",
      emerald: isDarkMode ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border-emerald-100",
      amber: isDarkMode ? "bg-amber-500/20 text-amber-400 border-amber-500/20" : "bg-amber-50 text-amber-600 border-amber-100",
      rose: isDarkMode ? "bg-rose-500/20 text-rose-400 border-rose-500/20" : "bg-rose-50 text-rose-600 border-rose-100",
    };
    return colors[color];
  };

  return (
    <div className={`mt-12 rounded-[3.5rem] p-10 border backdrop-blur-md transition-all duration-500
      ${isDarkMode ? 'bg-white/3 border-white/10 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`} 
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      
      <div className={`flex flex-col mb-12 ${i18n.language === 'ar' ? 'items-start text-right' : 'items-start text-left'}`}>
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="text-blue-500" size={24} />
          <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            {t('guide_main_title')}
          </h2>
        </div>
        <p className={`text-sm font-medium opacity-60 ${i18n.language === 'ar' ? 'pr-9' : 'pl-9'} ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {t('guide_main_subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {guidelines.map((item) => (
          <div key={item.id} className={`group p-8 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2
            ${isDarkMode ? 'bg-white/3 border-white/10 hover:border-blue-500/30' : 'bg-slate-50/50 border-slate-50 hover:border-blue-100 hover:bg-white hover:shadow-xl'}`}>
            
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-transform group-hover:scale-110 duration-500 ${getIconStyles(item.color)}`}>
              {item.icon}
            </div>
            
            <div className={i18n.language === 'ar' ? 'text-right' : 'text-left'}>
              <h3 className={`font-black text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{item.title}</h3>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-4 opacity-50">{item.engTitle}</p>
              
              <ul className="space-y-3">
                {item.tips.map((tip, idx) => (
                  <li key={idx} className={`text-sm font-medium flex items-start gap-3 leading-relaxed
                    ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${isDarkMode ? 'bg-blue-500/40' : 'bg-blue-200'}`}></span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-12 p-6 rounded-3xl border-2 border-dashed text-center transition-colors
        ${isDarkMode ? 'border-white/5 bg-white/2' : 'border-blue-50 bg-blue-50/30'}`}>
        <p className={`text-xs font-bold italic ${isDarkMode ? 'text-slate-500' : 'text-blue-400'}`}>
          "{t('guide_footer_quote')}"
        </p>
      </div>
    </div>
  );
};

export default ErgonomicGuide;