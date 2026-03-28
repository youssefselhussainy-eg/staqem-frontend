/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
// استبدلنا axios العادي بملف الـ API الموحد
import API from '../../api/axios'; 
import { 
  Activity, Calendar, LogOut, Bell, Zap, ChevronLeft, 
  ClipboardCheck, ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ErgonomicGuide from '../../components/ErgonomicGuide';
import ThemeToggle from '../../components/ThemeToggle'; 
import LanguageToggle from '../../components/LanguageToggle'; 
import { useTheme } from '../../context/ThemeContext';
import FloatingChatIcon from '../../components/chat/FloatingChatIcon';
import ChatModal from '../../components/chat/ChatModal';
import NotificationsModal from '../../components/NotificationsModal';
import AdviceCard from '../../components/dashboard/AdviceCard';
import ProfileButton from '../../components/dashboard/ProfileButton';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; 

const getStatus = (score, isDarkMode, t) => {
  if (score <= 4) return { text: t('excellent_status'), color: "text-green-500", bg: isDarkMode ? "bg-green-500/10" : "bg-green-50", border: "border-green-500/20" };
  if (score <= 14) return { text: t('mild_disability'), color: "text-blue-500", bg: isDarkMode ? "bg-blue-500/10" : "bg-blue-50", border: "border-blue-500/20" };
  if (score <= 24) return { text: t('moderate_disability'), color: "text-yellow-600", bg: isDarkMode ? "bg-yellow-500/10" : "bg-yellow-50", border: "border-yellow-500/20" };
  return { text: t('severe_disability'), color: "text-red-500", bg: isDarkMode ? "bg-red-500/10" : "bg-red-50", border: "border-red-500/20" };
};

const PatientDashboard = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); 
  
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const userName = localStorage.getItem('user_name');
  const userEmail = localStorage.getItem('user_email');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // الـ API عارف لوحده يروح لـ Render أو localhost
        const res = await API.get(`/users/me/${userEmail}`);
        setData(res.data);

        if (res.data.pending_assessment) {
          Swal.fire({
            title: t('assessment_alert_title'),
            text: t('assessment_alert_text'),
            icon: 'warning',
            iconColor: '#3b82f6',
            showCancelButton: true,
            confirmButtonText: t('start_assessment'),
            cancelButtonText: t('later'),
            confirmButtonColor: '#3b82f6',
            background: isDarkMode ? '#0f172a' : '#fff',
            color: isDarkMode ? '#fff' : '#1e293b',
            customClass: { popup: 'rounded-[3rem] border border-white/10' }
          }).then((result) => {
            if (result.isConfirmed) navigate('/re-assessment');
          });
        }

        if (res.data.exercise_stats?.has_notification) {
          Swal.fire({
            title: t('new_exercises_title'),
            text: t('new_exercises_text'),
            icon: 'info',
            iconColor: '#3b82f6',
            background: isDarkMode ? '#0f172a' : '#fff',
            color: isDarkMode ? '#fff' : '#1e293b',
            confirmButtonText: t('view_exercises'),
            confirmButtonColor: '#3b82f6',
            customClass: { popup: 'rounded-[3rem] border border-white/10' }
          }).then((result) => {
            if (result.isConfirmed) navigate('/my-exercises');
          });
        }
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };
    if (userEmail) fetchData();
  }, [userEmail, navigate, isDarkMode, t]);

  useEffect(() => {
    const fetchUnread = async () => {
      if (!userEmail) return;
      try {
        // التحديث للرسائل الجديدة من السيرفر
        const res = await API.get(`/chat/unread-count/${userEmail}`);
        setUnreadCount(res.data.unread_count);
      } catch (err) { console.error("Unread error", err); }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [userEmail]);

  if (!data) return (
    <div className={`flex flex-col justify-center items-center h-screen font-black tracking-widest uppercase transition-colors duration-500 
      ${isDarkMode ? 'bg-[#070b14] text-blue-500' : 'bg-slate-50 text-blue-600'}`}>
      <Zap className="animate-bounce mb-4" size={48} />
      {t('loading_data')}
    </div>
  );

  const score = data.latest_assessment?.total_score || 0;
  const status = getStatus(score, isDarkMode, t);
  const { total, completed } = data.exercise_stats || { total: 0, completed: 0 };
  const progressPercent = total > 0 ? (completed / total) * 100 : 0;

  const doctorName = data.doctor?.full_name || "هاجر سعيد";
  const doctorEmail = data.doctor?.email || "haeersaeed@gmail.com";

  const notifications = [];
  if (unreadCount > 0) {
    notifications.push({
      type: 'CHAT',
      message: i18n.language === 'ar' 
        ? `لديك ${unreadCount} رسائل جديدة من د. ${doctorName.split(' ')[0]}`
        : `You have ${unreadCount} new messages from Dr. ${doctorName.split(' ')[0]}`,
      time: i18n.language === 'ar' ? 'الآن' : 'Now'
    });
  }

  return (
    <div className={`relative min-h-screen w-full transition-colors duration-500 font-sans p-4 md:p-8 overflow-x-hidden
      ${isDarkMode ? 'bg-[#070b14]' : 'bg-slate-50'}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      
      {isDarkMode && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-5%] left-[-5%] w-150 h-150 bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-150 h-150 bg-cyan-600/5 rounded-full blur-[120px]" />
        </div>
      )}

      <div className="max-w-360 mx-auto relative z-10">
        
        {/* --- Header Section --- */}
        <div className={`mb-10 p-8 rounded-[3rem] border backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500
          ${isDarkMode ? 'bg-white/3 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
          
          <div className="relative text-right w-full md:w-auto">
            <h1 className={`text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {t('hello')} {userName?.split(' ')[0] || 'Champ'} 👋
            </h1>
            <p className={`mt-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('ready_for_recovery')}
            </p>
          </div>

          <div className="flex items-stretch gap-4 h-14">
            <LanguageToggle />
            <ThemeToggle /> 
            <ProfileButton />

            <button 
              onClick={() => setIsNotifOpen(true)}
              className={`h-full w-14 rounded-2xl border transition-all hover:scale-110 active:scale-95 flex items-center justify-center relative
                ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}
            >
              <Bell size={24} />
              {(notifications.length > 0) && (
                <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#070b14] animate-pulse" />
              )}
            </button>

            <button 
              onClick={() => { localStorage.clear(); navigate('/login'); }}
              className={`h-full w-14 rounded-2xl border transition-all active:scale-95 shadow-lg flex items-center justify-center
                ${isDarkMode 
                  ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-50' 
                  : 'bg-white border-red-50 text-red-500 hover:bg-red-50'}`}
            >
              <LogOut size={24} />
            </button>
          </div>
        </div>

        {/* --- Reassessment Alert Card --- */}
        {data.pending_assessment && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-10 p-8 rounded-[2.5rem] border flex flex-col md:flex-row items-center justify-between gap-6 transition-all shadow-2xl
              ${isDarkMode ? 'bg-blue-600/10 border-blue-500/30' : 'bg-blue-50 border-blue-200 shadow-blue-100'}`}
          >
            <div className="flex items-center gap-6">
              <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg">
                <ClipboardCheck size={32} />
              </div>
              <div className="text-right">
                <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>{t('reassessment_notice_title')}</h3>
                <p className={`text-sm font-bold opacity-70 ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                  {t('reassessment_notice_text', { name: doctorName })}
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/re-assessment')}
              className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-xl shadow-blue-600/20"
            >
              {t('start_assessment')} <ArrowLeft size={20} className={i18n.language === 'en' ? 'rotate-180' : ''} />
            </button>
          </motion.div>
        )}

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {/* NDI Score Card */}
          <div className={`p-10 rounded-[3rem] border backdrop-blur-sm flex flex-col items-center text-center transition-all duration-500
            ${isDarkMode ? 'bg-white/3 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className={`w-24 h-24 rounded-[2.5rem] ${status.bg} flex items-center justify-center mb-6 shadow-inner border ${status.border}`}>
              <Activity className={status.color} size={40} />
            </div>
            <h3 className={`font-black text-[10px] uppercase tracking-[0.3em] mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              {t('ndi_score')}
            </h3>
            <div className={`text-6xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {score}<span className="text-2xl opacity-20 ml-2">/50</span>
            </div>
            <span className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-colors ${status.bg} ${status.color} ${status.border}`}>
              {status.text}
            </span>
          </div>

          {/* Daily Progress Card */}
          <div className={`p-10 rounded-[3rem] border backdrop-blur-sm transition-all duration-500 group
            ${isDarkMode ? 'bg-white/3 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4 text-right">
                <div className={`p-4 rounded-3xl ${isDarkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                  <Calendar size={28} />
                </div>
                <div>
                  <h3 className={`font-black text-xl ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{t('today_progress')}</h3>
                  <p className={`text-[10px] font-bold opacity-50 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t('completed_stats', { completed, total })}
                  </p>
                </div>
              </div>
              <span className="text-blue-500 font-black text-3xl">{Math.round(progressPercent)}%</span>
            </div>

            <div className="space-y-8">
              <div className={`h-4 rounded-full overflow-hidden p-1 shadow-inner ${isDarkMode ? 'bg-black/40' : 'bg-slate-100'}`}>
                <div 
                  className="h-full bg-linear-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <button 
                onClick={() => navigate('/my-exercises')}
                className={`w-full py-5 rounded-4xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95
                  ${progressPercent === 100 
                    ? (isDarkMode ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-green-50 text-green-600 border border-green-200')
                    : (isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100')
                  }`}
              >
                {progressPercent === 100 ? t('review_exercises') : t('start_now')}
                <ChevronLeft size={24} className={i18n.language === 'en' ? 'rotate-180' : ''} />
              </button>
            </div>
          </div>

          <AdviceCard doctorName={doctorName} isDarkMode={isDarkMode} />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <ErgonomicGuide />
        </div>
      </div>

      <NotificationsModal 
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        isDarkMode={isDarkMode}
      />

      <FloatingChatIcon userEmail={userEmail} onClick={() => setIsChatOpen(true)} />

      {data && (
        <ChatModal 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)}
          senderEmail={userEmail}
          receiverEmail={doctorEmail} 
          receiverName={doctorName}
        />
      )}

      <p className={`mt-10 text-center text-[10px] font-black uppercase tracking-[0.6em] opacity-20 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        Staqem Recovery Network • Patient Dashboard
      </p>
    </div>
  );
};

export default PatientDashboard;