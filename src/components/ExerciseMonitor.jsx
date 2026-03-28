import React, { useState, useMemo, useRef } from 'react';
import { Target, CheckCircle2, Play, Info, Activity, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next'; // استيراد الترجمة

const ExerciseMonitor = ({ exercise, onComplete }) => {
  const { isDarkMode } = useTheme();
  const { t, i18n } = useTranslation(); // تفعيل الترجمة
  const successAudio = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'));
  const clickAudio = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'));

  const target = useMemo(() => {
    const numbers = (exercise.reps_sets || "").match(/\d+/g);
    return {
      sets: numbers?.[0] ? parseInt(numbers[0]) : 3,
      reps: numbers?.[1] ? parseInt(numbers[1]) : 12
    };
  }, [exercise.reps_sets]);

  const [currentRep, setCurrentRep] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [completedTotal, setCompletedTotal] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const totalRepsTarget = target.sets * target.reps;
  const totalProgress = (completedTotal / totalRepsTarget) * 100;

  const handleManualCount = () => {
    if (isFinished) return;
    clickAudio.current.play().catch(() => {});
    
    const nextTotal = completedTotal + 1;
    setCompletedTotal(nextTotal);

    if (nextTotal >= totalRepsTarget) {
      setIsFinished(true);
      successAudio.current.play().catch(() => {});
      setTimeout(() => onComplete(), 2000);
      return;
    }

    if (currentRep + 1 >= target.reps) {
      setCurrentRep(0);
      setCurrentSet(prev => prev + 1);
      successAudio.current.play().catch(() => {});
    } else {
      setCurrentRep(prev => prev + 1);
    }
  };

  return (
    <div className={`fixed inset-0 w-full h-full font-sans overflow-hidden flex flex-col z-100 transition-colors duration-700
      ${isDarkMode ? 'bg-[#030712]' : 'bg-slate-50'}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* --- Glassmorphism Background Blobs --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[150px]" />
        <div className={`absolute top-[30%] left-[20%] w-64 h-64 rounded-full blur-[100px] 
          ${isDarkMode ? 'bg-cyan-500/10' : 'bg-blue-200/30'}`} />
      </div>

      {/* --- Header (Frosted Glass) --- */}
      <div className={`w-full p-8 flex justify-between items-center backdrop-blur-2xl border-b shadow-2xl relative z-20
        ${isDarkMode ? 'bg-white/5 border-white/10 shadow-black/40' : 'bg-white/70 border-slate-200 shadow-slate-200/50'}`}>
        
        <div className="flex items-center gap-6">
          <div className="bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.5)] p-4 rounded-3xl animate-in zoom-in duration-500">
            <Target className="text-white" size={32} />
          </div>
          <div className={i18n.language === 'ar' ? 'text-right' : 'text-left'}>
            <h2 className={`text-3xl font-black tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {exercise.title}
            </h2>
            <div className="mt-3">
               <span className={`text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border backdrop-blur-md
                 ${isDarkMode ? 'text-blue-400 border-blue-400/30 bg-blue-400/5' : 'text-blue-600 border-blue-200 bg-blue-50/50'}`}>
                {exercise.category || t('clinical_therapy_label')}
               </span>
            </div>
          </div>
        </div>
        
        {/* تم تعديل الـ padding والـ border حسب اللغة */}
        <div className={`flex gap-10 items-center ${i18n.language === 'ar' ? 'pl-24' : 'pr-24'}`}>
          <div className={`text-center px-10 ${i18n.language === 'ar' ? 'border-l' : 'border-r'} ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">{t('set')}</p>
            <p className={`text-5xl font-black ${isDarkMode ? 'text-white' : 'text-blue-600'}`}>
              {currentSet}<span className="text-xl opacity-20 ml-2">/{target.sets}</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">{t('reps')}</p>
            <p className={`text-5xl font-black ${isDarkMode ? 'text-white' : 'text-blue-600'}`}>
              {currentRep}<span className="text-xl opacity-20 ml-2">/{target.reps}</span>
            </p>
          </div>
        </div>
      </div>

      {/* --- Main Content Layout --- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden relative z-10">
        
        {/* Left/Right Column: Instructions & Media */}
        <div className={`lg:col-span-4 p-10 flex flex-col gap-8 ${i18n.language === 'ar' ? 'border-r' : 'border-l'} backdrop-blur-sm overflow-y-auto
          ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-white/30 border-slate-200'}`}>
          
          {/* Instructions Card */}
          <div className={`p-8 rounded-[3.5rem] border shadow-2xl backdrop-blur-xl relative group transition-all duration-500
            ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/80 border-white shadow-slate-200'}`}>
            <div className={`flex items-center gap-3 text-blue-500 mb-6 ${i18n.language === 'ar' ? 'justify-end' : 'justify-start'}`}>
              {i18n.language === 'en' && <Info size={24} />}
              <h3 className="font-black text-[11px] uppercase tracking-[0.2em]">{t('clinical_guidance_label')}</h3>
              {i18n.language === 'ar' && <Info size={24} />}
            </div>
            <p className={`text-xl font-bold leading-relaxed ${i18n.language === 'ar' ? 'text-right' : 'text-left'} ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              {exercise.instructions || exercise.description || t('default_monitor_instructions')}
            </p>
          </div>

          <div className={`flex-1 rounded-[3.5rem] border overflow-hidden flex items-center justify-center p-8 relative group transition-all duration-500
            ${isDarkMode ? 'bg-black/40 border-white/5 shadow-inner' : 'bg-white border-white shadow-xl'}`}>
            <img 
              src={exercise.image_url} 
              className={`max-h-full transition-all duration-1000 group-hover:scale-105 ${isDarkMode ? 'mix-blend-lighten opacity-90' : ''}`}
              alt={t('exercise_guide_alt')}
              onError={(e) => { e.target.src = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZ3R5cmh0Z3R5cmh0Z3R5JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxP5pYFh876/giphy.gif" }}
            />
          </div>
        </div>

        {/* Interaction Column */}
        <div className="lg:col-span-8 p-12 flex flex-col items-center justify-center gap-12 relative overflow-hidden">
          
          <div className="w-full max-w-3xl space-y-16 relative z-10 text-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div>
               <p className={`text-xs font-black uppercase tracking-[0.5em] mb-8 opacity-40 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                 {t('session_progress_label')}
               </p>
               <h1 className={`text-[17rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]
                 ${isDarkMode ? 'from-white via-blue-400 to-blue-800' : 'from-blue-600 via-blue-800 to-indigo-950'}`}>
                 {Math.round(totalProgress)}<span className="text-5xl text-blue-600 ml-4 opacity-40">%</span>
               </h1>
            </div>

            <div className="px-12">
              <div className={`h-7 rounded-full overflow-hidden p-1.5 border shadow-2xl backdrop-blur-md
                ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-200 border-white shadow-inner'}`}>
                <div 
                  className="h-full bg-linear-to-r from-blue-600 via-blue-400 to-cyan-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_30px_rgba(37,99,235,0.6)]" 
                  style={{ width: `${totalProgress}%` }} 
                />
              </div>
            </div>

            <div className="space-y-8 px-12">
              <button 
                onClick={handleManualCount}
                disabled={isFinished}
                className={`w-full py-12 rounded-[4rem] font-black text-6xl flex items-center justify-center gap-8 transition-all active:scale-[0.94] shadow-2xl border-t relative overflow-hidden group
                  ${isDarkMode 
                    ? 'bg-blue-600 text-white border-white/20 shadow-blue-900/40 hover:bg-blue-500' 
                    : 'bg-blue-600 text-white border-blue-400 shadow-blue-200 hover:bg-blue-700'}`}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {isFinished ? t('done_btn') : t('log_rep_btn')} 
                {!isFinished && <Play className={`group-hover:translate-x-4 transition-transform duration-500 ${i18n.language === 'ar' ? 'rotate-180' : ''}`} fill="currentColor" size={64} />}
              </button>
              
              <p className={`text-center text-sm font-black uppercase tracking-[0.4em] opacity-40 animate-pulse ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {t('tap_hint')}
              </p>
            </div>
          </div>

          {/* Success Overlay */}
          {isFinished && (
            <div className={`absolute inset-0 backdrop-blur-[80px] flex flex-col items-center justify-center animate-in zoom-in duration-1000 z-50
              ${isDarkMode ? 'bg-green-600/20' : 'bg-green-500/10'}`}>
               <div className="bg-white/90 p-14 rounded-[4rem] shadow-[0_40px_100px_rgba(34,197,94,0.5)] mb-12 transform -rotate-3 scale-125 border border-white">
                  <CheckCircle2 size={180} className="text-green-500 animate-bounce" />
               </div>
               <p className={`${isDarkMode ? 'text-white' : 'text-green-700'} text-[10rem] font-black uppercase tracking-widest italic drop-shadow-2xl animate-in slide-in-from-bottom-20 duration-1000`}>
                 {t('victory_label')}
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseMonitor;