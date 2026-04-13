import React, { useState, useMemo, useRef } from 'react';
import { Target, CheckCircle2, Play, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const ExerciseMonitor = ({ exercise, onComplete }) => {
  const { isDarkMode } = useTheme();
  const { t, i18n } = useTranslation();
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
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] md:w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] md:w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[100px] md:blur-[150px]" />
      </div>

      {/* Header Section - Adaptive for Mobile */}
      <div className={`w-full p-4 md:p-8 flex flex-col md:flex-row justify-between items-center backdrop-blur-2xl border-b shadow-2xl relative z-20 gap-4
        ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-slate-200 shadow-slate-200/50'}`}>
        
        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
          <div className="bg-blue-600 shadow-lg p-3 md:p-4 rounded-2xl md:rounded-3xl shrink-0">
            <Target className="text-white md:w-8 md:h-8" size={24} />
          </div>
          <div className={i18n.language === 'ar' ? 'text-right' : 'text-left'}>
            <h2 className={`text-xl md:text-3xl font-black tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {exercise.title}
            </h2>
            <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border mt-1 inline-block
               ${isDarkMode ? 'text-blue-400 border-blue-400/30 bg-blue-400/5' : 'text-blue-600 border-blue-200 bg-blue-50/50'}`}>
              {exercise.category || t('clinical_therapy_label')}
            </span>
          </div>
        </div>
        
        {/* Stats Display */}
        <div className="flex gap-6 md:gap-10 items-center justify-center w-full md:w-auto">
          <div className={`text-center px-6 md:px-10 ${i18n.language === 'ar' ? 'border-l' : 'border-r'} ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
            <p className="text-slate-500 text-[8px] md:text-[10px] font-black uppercase mb-1 opacity-60">{t('set')}</p>
            <p className={`text-3xl md:text-5xl font-black ${isDarkMode ? 'text-white' : 'text-blue-600'}`}>
              {currentSet}<span className="text-lg opacity-20 ml-1">/{target.sets}</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-slate-500 text-[8px] md:text-[10px] font-black uppercase mb-1 opacity-60">{t('reps')}</p>
            <p className={`text-3xl md:text-5xl font-black ${isDarkMode ? 'text-white' : 'text-blue-600'}`}>
              {currentRep}<span className="text-lg opacity-20 ml-1">/{target.reps}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden relative z-10">
        
        {/* Instructions Side (Hidden/Compact on Mobile if needed, here we make it scrollable) */}
        <div className={`hidden lg:flex lg:col-span-4 p-10 flex-col gap-8 ${i18n.language === 'ar' ? 'border-r' : 'border-l'} backdrop-blur-sm overflow-y-auto
          ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-white/30 border-slate-200'}`}>
          
          <div className={`p-8 rounded-[3rem] border shadow-2xl backdrop-blur-xl transition-all duration-500
            ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/80 border-white'}`}>
            <div className={`flex items-center gap-3 text-blue-500 mb-6 ${i18n.language === 'ar' ? 'justify-end' : 'justify-start'}`}>
              <Info size={24} />
              <h3 className="font-black text-[11px] uppercase tracking-[0.2em]">{t('clinical_guidance_label')}</h3>
            </div>
            <p className={`text-lg font-bold leading-relaxed ${i18n.language === 'ar' ? 'text-right' : 'text-left'} ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              {exercise.instructions || exercise.description || t('default_monitor_instructions')}
            </p>
          </div>

          <div className={`flex-1 rounded-[3rem] border overflow-hidden flex items-center justify-center p-8 relative
            ${isDarkMode ? 'bg-black/40 border-white/5 shadow-inner' : 'bg-white border-white shadow-xl'}`}>
            <img 
              src={exercise.image_url} 
              className={`max-h-full transition-all duration-1000 ${isDarkMode ? 'mix-blend-lighten opacity-90' : ''}`}
              alt="Exercise"
              onError={(e) => { e.target.src = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZ3R5cmh0Z3R5cmh0Z3R5JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxP5pYFh876/giphy.gif" }}
            />
          </div>
        </div>

        {/* Interaction Center */}
        <div className="lg:col-span-8 p-6 md:p-12 flex flex-col items-center justify-center gap-8 md:gap-12 relative overflow-hidden">
          
          <div className="w-full max-w-2xl space-y-8 md:space-y-16 relative z-10 text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div>
               <p className={`text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-4 md:mb-8 opacity-40 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                 {t('session_progress_label')}
               </p>
               <h1 className={`text-7xl sm:text-9xl md:text-[15rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b
                 ${isDarkMode ? 'from-white via-blue-400 to-blue-800' : 'from-blue-600 via-blue-800 to-indigo-950'}`}>
                 {Math.round(totalProgress)}<span className="text-2xl md:text-5xl text-blue-600 ml-2 opacity-40">%</span>
               </h1>
            </div>

            <div className="px-4 md:px-12">
              <div className={`h-4 md:h-7 rounded-full overflow-hidden p-1 border shadow-lg backdrop-blur-md
                ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-200 border-white'}`}>
                <div 
                  className="h-full bg-linear-to-r from-blue-600 via-blue-400 to-cyan-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_20px_rgba(37,99,235,0.6)]" 
                  style={{ width: `${totalProgress}%` }} 
                />
              </div>
            </div>

            <div className="space-y-6 md:space-y-8 px-4 md:px-12">
              <button 
                onClick={handleManualCount}
                disabled={isFinished}
                className={`w-full py-8 md:py-12 rounded-[2.5rem] md:rounded-[4rem] font-black text-2xl md:text-6xl flex items-center justify-center gap-4 md:gap-8 transition-all active:scale-[0.94] shadow-2xl border-t relative overflow-hidden group
                  ${isDarkMode 
                    ? 'bg-blue-600 text-white border-white/20 shadow-blue-900/40 hover:bg-blue-500' 
                    : 'bg-blue-600 text-white border-blue-400 shadow-blue-200 hover:bg-blue-700'}`}
              >
                {isFinished ? t('done_btn') : t('log_rep_btn')} 
                {!isFinished && <Play className={`group-hover:translate-x-2 transition-transform duration-500 ${i18n.language === 'ar' ? 'rotate-180' : ''} md:w-16 md:h-16`} fill="currentColor" size={32} />}
              </button>
              
              <p className={`text-center text-[10px] md:text-sm font-black uppercase tracking-[0.3em] opacity-40 animate-pulse ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {t('tap_hint')}
              </p>
            </div>
          </div>

          {/* Success Overlay - Polished for all screens */}
          {isFinished && (
            <div className={`absolute inset-0 backdrop-blur-[60px] md:backdrop-blur-[80px] flex flex-col items-center justify-center animate-in zoom-in duration-700 z-60
              ${isDarkMode ? 'bg-green-600/20' : 'bg-green-500/10'}`}>
               <div className="bg-white/90 p-8 md:p-14 rounded-[3rem] md:rounded-[4rem] shadow-2xl mb-8 transform -rotate-2 scale-110 md:scale-125 border border-white flex items-center justify-center">
                  <CheckCircle2 size={100} className="text-green-500 animate-bounce md:w-45 md:h-45" />
               </div>
               <p className={`${isDarkMode ? 'text-white' : 'text-green-700'} text-5xl md:text-[10rem] font-black uppercase tracking-widest italic drop-shadow-2xl animate-in slide-in-from-bottom-10 duration-700`}>
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