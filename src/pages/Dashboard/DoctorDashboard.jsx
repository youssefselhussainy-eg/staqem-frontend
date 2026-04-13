import React, { useEffect, useState, useCallback } from 'react';
import API from '../../api/axios'; 
import { Search, ChevronLeft, UserCircle, LogOut, CheckCircle2, Users, Activity, Bell, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle'; 
import LanguageToggle from '../../components/LanguageToggle'; 
import FloatingChatIcon from '../../components/chat/FloatingChatIcon';
import ChatModal from '../../components/chat/ChatModal';
import NotificationsModal from '../../components/NotificationsModal';
import ProfileButton from '../../components/dashboard/ProfileButton';
import { useTranslation } from 'react-i18next';

const getSeverityColor = (score, isDarkMode) => {
  if (!score && score !== 0) return isDarkMode ? "bg-white/5 text-slate-500" : "bg-slate-100 text-slate-400";
  if (score <= 14) return isDarkMode ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-green-50 text-green-600 border-green-100";
  if (score <= 24) return isDarkMode ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-yellow-50 text-yellow-600 border-yellow-100";
  return isDarkMode ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-red-50 text-red-600 border-red-100";
};

const DoctorDashboard = () => {
  const { t, i18n } = useTranslation();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null); 
  const [totalUnread, setTotalUnread] = useState(0); 
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const doctorName = localStorage.getItem('user_name');
  const doctorEmail = localStorage.getItem('user_email'); 

  const fetchPatients = useCallback(async () => {
    if (!doctorEmail) return;
    try {
      const res = await API.get(`/doctors/patients/${doctorEmail}`);
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients", err);
    }
  }, [doctorEmail]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (isMounted) await fetchPatients();
    };
    loadData();
    return () => { isMounted = false; };
  }, [fetchPatients]);

  useEffect(() => {
    if (!doctorEmail) return;
    const fetchUnreadTotal = async () => {
      try {
        const res = await API.get(`/chat/unread-count/${doctorEmail}`);
        const newCount = res.data.unread_count;
        if (newCount !== totalUnread) {
          setTotalUnread(newCount);
          await fetchPatients(); 
        }
      } catch (err) { console.error("Unread fetch error:", err); }
    };
    const interval = setInterval(fetchUnreadTotal, 15000);
    return () => clearInterval(interval);
  }, [doctorEmail, totalUnread, fetchPatients]);

  useEffect(() => {
    if (!doctorEmail) return;
    const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    const wsProtocol = baseURL.startsWith('https') ? 'wss' : 'ws';
    const wsHost = baseURL.replace(/^https?:\/\//, '');
    const ws = new WebSocket(`${wsProtocol}://${wsHost}/ws/${doctorEmail}`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NEW_MESSAGE") {
        setTotalUnread(prev => prev + 1);
        setPatients(prev => prev.map(p => 
          p.email === data.sender_email ? { ...p, unread_messages: (p.unread_messages || 0) + 1 } : p
        ));
      }
    };
    return () => ws.close();
  }, [doctorEmail]);

  const handleClearNotifications = async () => {
    try {
      const unreadPatients = patients.filter(p => p.unread_messages > 0);
      await Promise.all(unreadPatients.map(p => 
        API.patch('/chat/mark-as-read', { sender: p.email, receiver: doctorEmail })
      ));
      setTotalUnread(0);
      setPatients(prev => prev.map(p => ({ ...p, unread_messages: 0 })));
      setIsNotifOpen(false);
    } catch (err) { console.error("Clear notifications error:", err); }
  };

  const filteredPatients = patients.filter(p => p.full_name.toLowerCase().includes(searchQuery.toLowerCase()));

  const openChatWith = (e, patient) => {
    e.stopPropagation(); 
    setSelectedPatient(patient);
    setIsChatOpen(true);
    setTotalUnread(prev => Math.max(0, prev - (patient.unread_messages || 0)));
    setPatients(prev => prev.map(p => p.email === patient.email ? { ...p, unread_messages: 0 } : p));
  };

  const notifications = [];
  patients.forEach(p => {
    if (p.unread_messages > 0) {
      notifications.push({ type: 'CHAT', message: t('new_message_from', { name: p.full_name }), time: t('now') });
    }
  });

  return (
    <div className={`relative min-h-screen w-full transition-colors duration-500 font-sans p-3 md:p-8 overflow-x-hidden
      ${isDarkMode ? 'bg-[#070b14]' : 'bg-slate-50'}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      
      {isDarkMode && (
        <>
          <div className="absolute top-[-10%] left-[-5%] w-150 h-150 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-5%] w-150 h-150 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
        </>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- Header Section --- */}
        <div className={`mb-8 md:mb-12 p-5 md:p-8 rounded-4xl md:rounded-[3rem] border backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all duration-500
          ${isDarkMode ? 'bg-white/3 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
          
          <div className="flex items-center gap-4 md:gap-6 text-center sm:text-right">
            <div className={`p-3 md:p-4 rounded-2xl md:rounded-3xl border transition-colors
              ${isDarkMode ? 'bg-blue-600/20 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
               <Users size={28} className="md:w-8 md:h-8" />
            </div>
            <div>
              <h1 className={`text-xl md:text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {t('dr_prefix')} {doctorName || 'Staqem'} 🩺
              </h1>
              <p className={`text-xs md:text-sm mt-1 flex items-center gap-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('under_supervision_count', { count: patients.length })}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 md:gap-4 h-auto lg:h-14">
            <div className="flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
                <ProfileButton />
            </div>

            <div className="flex items-center gap-2">
                <button 
                onClick={() => setIsNotifOpen(true)}
                className={`h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl border transition-all hover:scale-105 active:scale-95 flex items-center justify-center relative
                    ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}
                >
                <Bell size={20} className="md:w-6 md:h-6" />
                {totalUnread > 0 && (
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#070b14] animate-pulse" />
                )}
                </button>

                <div className="relative group h-12 md:h-14">
                <Search className={`absolute ${i18n.language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 transition-colors 
                    ${isDarkMode ? 'text-slate-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={18} />
                <input 
                    type="text" 
                    placeholder={t('search_placeholder')} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`h-full w-32 sm:w-48 md:w-64 rounded-xl md:rounded-2xl outline-none transition-all font-medium border text-xs md:text-base
                    ${i18n.language === 'ar' ? 'pr-10 md:pr-12 pl-4' : 'pl-10 md:pl-12 pr-4'}
                    ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-blue-500/50' : 'bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-600/20 shadow-sm'}`}
                />
                </div>
                
                <button onClick={() => { localStorage.clear(); navigate('/login'); }}
                className={`h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl border transition-all active:scale-95 shadow-lg flex items-center justify-center
                    ${isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-white border-red-50 text-red-500 hover:bg-red-50'}`}
                >
                <LogOut size={20} className="md:w-6 md:h-6" />
                </button>
            </div>
          </div>
        </div>

        {/* --- Patients Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-8">
          {filteredPatients.length > 0 ? filteredPatients.map((patient) => (
            <div 
              key={patient.id} 
              onClick={() => navigate(`/doctor/patient/${patient.email}`)}
              className={`group p-5 md:p-7 rounded-4xl md:rounded-[2.5rem] border transition-all duration-500 cursor-pointer relative overflow-hidden backdrop-blur-sm hover:-translate-y-1
                ${isDarkMode 
                  ? 'bg-white/3 border-white/5 hover:border-blue-500/30 hover:bg-white/5 shadow-2xl' 
                  : 'bg-white border-slate-100 hover:shadow-xl'}`}
            >
              <div className="flex items-center justify-between mb-6 gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-12 h-12 rounded-xl md:w-14 md:h-14 md:rounded-2xl shrink-0 flex items-center justify-center transition-colors
                    ${isDarkMode ? 'bg-blue-600/10 text-blue-400 border border-blue-500/10' : 'bg-blue-50 text-blue-600'}`}>
                    <UserCircle size={28} className="md:w-8 md:h-8" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className={`font-black text-base md:text-lg tracking-tight truncate transition-colors 
                      ${isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-slate-800 group-hover:text-blue-600'}`}>
                      {patient.full_name}
                    </h3>
                    <p className={`text-[10px] md:text-xs font-bold opacity-50 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {patient.email}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={(e) => openChatWith(e, patient)}
                  className={`shrink-0 p-2.5 rounded-lg md:rounded-xl transition-all active:scale-90 shadow-sm border relative
                    ${isDarkMode 
                      ? 'bg-white/5 border-white/10 text-blue-400 hover:bg-blue-600 hover:text-white' 
                      : 'bg-slate-50 border-slate-200 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                >
                  <MessageSquare size={16} />
                  {(patient.unread_messages || 0) > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-[8px] font-black text-white">
                      {patient.unread_messages}
                    </span>
                  )}
                </button>
              </div>

              <div className={`mb-5 p-4 rounded-2xl border transition-colors
                ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 
                    ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {patient.is_done_today ? <CheckCircle2 size={12} className="text-green-500"/> : <Activity size={12} className="text-blue-500 animate-pulse"/>}
                    {t('daily_achievement')}
                  </span>
                  <span className={`text-xs font-black ${patient.is_done_today ? 'text-green-500' : 'text-blue-500'}`}>
                    {patient.daily_progress}%
                  </span>
                </div>
                <div className={`h-1.5 rounded-full overflow-hidden p-0.5 ${isDarkMode ? 'bg-black/40' : 'bg-slate-200'}`}>
                  <div className={`h-full rounded-full transition-all duration-1000 ease-out 
                      ${patient.is_done_today ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]'}`}
                    style={{ width: `${patient.daily_progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-5">
                 <div className={`p-3 rounded-2xl text-center border transition-colors
                   ${isDarkMode ? 'bg-white/3 border-white/5' : 'bg-slate-50/50 border-slate-50'}`}>
                    <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t('ndi_score')}</p>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black border transition-all ${getSeverityColor(patient.latest_score, isDarkMode)}`}>
                      {patient.latest_score ?? '--'}
                    </span>
                 </div>
                 <div className={`p-3 rounded-2xl text-center border transition-colors
                   ${isDarkMode ? 'bg-white/3 border-white/5' : 'bg-slate-50/50 border-slate-50'}`}>
                    <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t('last_assessment')}</p>
                    <span className={`text-[9px] font-black ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
                      {patient.last_assessment_date ? new Date(patient.last_assessment_date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US') : "--"}
                    </span>
                 </div>
              </div>
              
              <button className={`w-full py-3.5 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 active:scale-95
                ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'}`}>
                {t('review_file')} <ChevronLeft size={14} className={i18n.language === 'en' ? 'rotate-180' : ''} />
              </button>
            </div>
          )) : (
            <div className={`col-span-full text-center py-16 md:py-24 rounded-4xl md:rounded-[3.5rem] border-2 border-dashed transition-all
              ${isDarkMode ? 'bg-white/3 border-white/10 text-slate-500' : 'bg-white border-slate-100 text-slate-400'}`}>
                <UserCircle size={48} className="mx-auto mb-4 md:mb-6 opacity-20 md:w-16 md:h-16" />
                <p className="text-lg md:text-xl font-bold italic tracking-tight">{t('no_patients')}</p>
            </div>
          )}
        </div>
      </div>

      <NotificationsModal 
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        isDarkMode={isDarkMode}
        onClearAll={handleClearNotifications}
      />

      <FloatingChatIcon userEmail={doctorEmail} onClick={() => setIsChatOpen(true)} />

      {selectedPatient && (
        <ChatModal 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          senderEmail={doctorEmail}
          receiverEmail={selectedPatient.email}
          receiverName={selectedPatient.full_name}
        />
      )}

      <p className={`mt-8 md:mt-12 text-center text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] opacity-20 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        Doctor Analytics • Staqem Clinical Data
      </p>
    </div>
  );
};

export default DoctorDashboard;