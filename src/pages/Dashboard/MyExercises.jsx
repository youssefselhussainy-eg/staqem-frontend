import React, { useEffect, useState } from 'react';
// استبدلنا axios العادي بملف الـ API الموحد
import API from '../../api/axios'; 
import { CheckCircle, Clock, ArrowRight, PartyPopper, Play, X, Zap, Dumbbell, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ExerciseMonitor from '../../components/ExerciseMonitor'; 
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import { useTranslation } from 'react-i18next'; 

const MyExercises = () => {
  const { t, i18n } = useTranslation(); 
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeEx, setActiveEx] = useState(null); 
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const userEmail = localStorage.getItem('user_email');
  const userName = localStorage.getItem('user_name') || 'Staqem Hero';

  useEffect(() => {
    const fetchMyExercises = async () => {
      try {
        setLoading(true);
        // الـ API عارف لوحده يروح لـ Render أو localhost
        const res = await API.get(`/users/my-exercises/${userEmail}`);
        setExercises(res.data);
      } catch (err) {
        console.error("Error fetching exercises:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userEmail) fetchMyExercises();
  }, [userEmail]);

  const handleComplete = async (exId, isAlreadyDone) => {
    if (isAlreadyDone) return;
    try {
      // إرسال طلب اكتمال التمرين عبر الـ API الموحد
      await API.post('/users/complete-exercise', {
        email: userEmail,
        exercise_id: exId
      });

      setExercises(prev => prev.map(ex => 
        ex.id === exId ? { ...ex, is_completed: true } : ex
      ));

      setActiveEx(null);

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: isDarkMode ? '#0f172a' : '#fff',
        color: isDarkMode ? '#fff' : '#1e293b',
        customClass: {
          popup: 'rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl',
        }
      });
      Toast.fire({
        icon: 'success',
        title: t('exercise_complete_toast', { name: userName.split(' ')[0] })
      });
    } catch (err) {
      console.error("Completion error:", err);
      Swal.fire({
        title: t('error'),
        text: t('exercise_complete_error'),
        icon: 'error',
        background: isDarkMode ? '#0f172a' : '#fff',
        color: isDarkMode ? '#fff' : '#1e293b',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-[2.5rem]' }
      });
    }
  };

  if (loading) return (
    <div className={`flex flex-col justify-center items-center h-screen font-black tracking-widest uppercase transition-colors duration-500 
      ${isDarkMode ? 'bg-[#070b14] text-blue-500' : 'bg-slate-50 text-blue-600'}`}>
      <Zap className="animate-bounce mb-4" size={48} />
      {t('loading_exercises')}
    </div>
  );

  return (
    <div className={`relative min-h-screen w-full transition-colors duration-500 font-sans p-4 md:p-8 overflow-x-hidden
      ${isDarkMode ? 'bg-[#070b14]' : 'bg-slate-50'}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      
      {isDarkMode && (
        <>
          <div className="absolute top-[-5%] left-[-5%] w-150 h-150 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-5%] w-150 h-150 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
        </>
      )}

      <div className="max-w-360 mx-auto relative z-10">
        
        {/* Navigation & Header */}
        <div className={`mb-10 p-8 rounded-[3rem] border backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500
          ${isDarkMode ? 'bg-white/3 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
          
          <div className={i18n.language === 'ar' ? 'text-right' : 'text-left'}>
            <button 
              onClick={() => navigate('/patient-dashboard')} 
              className={`flex items-center gap-2 mb-4 transition-all font-bold group text-sm
                ${isDarkMode ? 'text-slate-500 hover:text-blue-400' : 'text-slate-400 hover:text-blue-600'}`}>
              <ArrowRight size={18} className={`transition-transform ${i18n.language === 'en' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} /> 
              {t('back_to_home')}
            </button>
            <h1 className={`text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {t('my_daily_exercises')} 🧘‍♀️✨
            </h1>
          </div>
          
          <div className="flex items-center gap-4 h-14">
            <ThemeToggle />
            <div className={`flex items-center gap-4 px-6 h-full rounded-2xl border backdrop-blur-md
              ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className={i18n.language === 'ar' ? 'text-right' : 'text-left'}>
                <p className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t('daily_achievement')}</p>
                <p className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {exercises.filter(e => e.is_completed).length} <span className="text-sm opacity-30">/ {exercises.length}</span>
                </p>
              </div>
              <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <Dumbbell size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          {exercises.map((ex) => (
            <div 
              key={ex.id} 
              className={`group relative rounded-[2.5rem] p-6 border backdrop-blur-sm transition-all duration-500 flex flex-col sm:flex-row gap-6 items-center
                ${ex.is_completed 
                  ? (isDarkMode ? 'bg-green-500/5 border-green-500/20 opacity-80' : 'bg-green-50/50 border-green-100 opacity-80') 
                  : (isDarkMode ? 'bg-white/3 border-white/10 hover:border-blue-500/30 shadow-2xl hover:bg-white/5' : 'bg-white border-slate-100 hover:shadow-xl')}`}
            >
              <div className="relative w-full sm:w-56 h-44 shrink-0 overflow-hidden rounded-3xl shadow-lg">
                <img 
                  src={ex.image_url} 
                  alt={ex.title} 
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${ex.is_completed ? 'grayscale' : ''}`} 
                />
                {ex.is_completed && (
                  <div className="absolute inset-0 bg-green-600/40 flex items-center justify-center backdrop-blur-[2px]">
                    <CheckCircle className="text-white drop-shadow-lg" size={56} />
                  </div>
                )}
              </div>
              
              <div className={`flex-1 flex flex-col justify-between w-full ${i18n.language === 'ar' ? 'text-right' : 'text-left'} py-1`}>
                <div>
                  <div className={`flex justify-between items-start mb-2 ${i18n.language === 'en' ? 'flex-row-reverse' : ''}`}>
                    <h3 className={`text-2xl font-black tracking-tight ${ex.is_completed ? 'text-slate-500' : (isDarkMode ? 'text-white' : 'text-slate-800')}`}>
                      {ex.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border
                      ${isDarkMode ? 'bg-blue-600/10 text-blue-400 border-blue-500/10' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                      {ex.category}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed mb-6 line-clamp-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {ex.description}
                  </p>
                </div>

                <div className={`flex items-center justify-between ${i18n.language === 'en' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black border
                    ${isDarkMode ? 'bg-white/5 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-100 text-slate-500'}`}>
                    <Clock size={16} className="text-blue-500"/> {ex.reps_sets}
                  </div>
                  
                  <div className="flex gap-3">
                    {!ex.is_completed && (
                      <button 
                        onClick={() => setActiveEx(ex)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-sm shadow-xl hover:bg-blue-500 active:scale-95 transition-all"
                      >
                        <Play fill="currentColor" size={16} className={i18n.language === 'ar' ? 'rotate-180' : ''} /> {t('start_btn')}
                      </button>
                    )}
                    <button 
                      onClick={() => handleComplete(ex.id, ex.is_completed)}
                      disabled={ex.is_completed}
                      className={`p-3 rounded-xl border-2 transition-all active:scale-90
                        ${ex.is_completed 
                          ? 'bg-green-500 text-white border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                          : 'bg-transparent text-slate-300 border-slate-200 hover:text-green-500 hover:border-green-500/30'}`}
                    >
                      <CheckCircle size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Success Banner */}
        {exercises.length > 0 && exercises.every(ex => ex.is_completed) && (
          <div className="p-16 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[4rem] text-white text-center shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-1000">
            <div className={`absolute top-0 ${i18n.language === 'ar' ? 'right-0' : 'left-0'} p-8 opacity-10 rotate-12`}>
               <Trophy size={220} />
            </div>
            <PartyPopper size={80} className="mx-auto mb-8 text-blue-200 animate-bounce" />
            <h2 className="text-5xl font-black mb-6">
              {t('amazing_performance_title', { name: userName.split(' ')[0] })} 🏆
            </h2>
            <p className="text-blue-100 text-xl opacity-90 max-w-3xl mx-auto leading-relaxed font-medium">
              {t('all_completed_desc')}
            </p>
          </div>
        )}
      </div>

      {/* Monitor Modal Overlay */}
      {activeEx && (
        <div className="fixed inset-0 z-1000 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-0 overflow-hidden animate-in fade-in duration-300">
          <div className={`absolute top-8 ${i18n.language === 'ar' ? 'left-8' : 'right-8'} z-1100`}>
            <button 
              onClick={() => setActiveEx(null)} 
              className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-xl border border-white/10 transition-all active:scale-90 shadow-2xl"
            >
              <X size={36} />
            </button>
          </div>
          <div className="w-full h-full flex items-center justify-center">
            <ExerciseMonitor exercise={activeEx} onComplete={() => handleComplete(activeEx.id, false)} />
          </div>
        </div>
      )}

      <p className={`mt-16 text-center text-[10px] font-black uppercase tracking-[0.6em] opacity-20 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        Staqem Clinical Network • Daily Rehab Plan
      </p>
    </div>
  );
};

export default MyExercises;