 import React, { useEffect, useState, useCallback } from 'react';
// استبدلنا axios العادي بملف الـ API الموحد
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

  // --- 🛡️ جلب المرضى عبر الـ API الموحد ---
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

  // --- 🛡️ تحديث الرسائل غير المقروءة ---
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

  // --- 🛡️ WebSocket التحديث اللحظي (معدل للرفع) ---
  useEffect(() => {
    if (!doctorEmail) return;

    // تحديد البروتوكول والرابط ديناميكياً
    const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    const wsProtocol = baseURL.startsWith('https') ? 'wss' : 'ws';
    const wsHost = baseURL.replace(/^https?:\/\//, '');
    
    const ws = new WebSocket(`${wsProtocol}://${wsHost}/ws/${doctorEmail}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NEW_MESSAGE") {
        setTotalUnread(prev => prev + 1);
        setPatients(prev => prev.map(p => 
          p.email === data.sender_email 
            ? { ...p, unread_messages: (p.unread_messages || 0) + 1 } 
            : p
        ));
      }
    };
    return () => ws.close();
  }, [doctorEmail]);

  const handleClearNotifications = async () => {
    try {
      const unreadPatients = patients.filter(p => p.unread_messages > 0);
      await Promise.all(unreadPatients.map(p => 
        API.patch('/chat/mark-as-read', {
          sender: p.email,
          receiver: doctorEmail
        })
      ));
      
      setTotalUnread(0);
      setPatients(prev => prev.map(p => ({ ...p, unread_messages: 0 })));
      setIsNotifOpen(false);
    } catch (err) {
      console.error("Clear notifications error:", err);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openChatWith = (e, patient) => {
    e.stopPropagation(); 
    setSelectedPatient(patient);
    setIsChatOpen(true);
    setTotalUnread(prev => Math.max(0, prev - (patient.unread_messages || 0)));
    setPatients(prev => prev.map(p => 
      p.email === patient.email ? { ...p, unread_messages: 0 } : p
    ));
  };

  const notifications = [];
  patients.forEach(p => {
    if (p.unread_messages > 0) {
      notifications.push({
        type: 'CHAT',
        message: t('new_message_from', { name: p.full_name }),
        time: t('now')
      });
    }
  });

  if (notifications.length === 0 && totalUnread > 0) {
    notifications.push({
      type: 'CHAT',
      message: t('unread_messages_count', { count: totalUnread }),
      time: t('now')
    });
  }

  return (
    <div className={`relative min-h-screen w-full transition-colors duration-500 font-sans p-4 md:p-8 overflow-x-hidden
      ${isDarkMode ? 'bg-[#070b14]' : 'bg-slate-50'}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      
      {isDarkMode && (
        <>
          <div className="absolute top-[-10%] left-[-5%] w-150 h-150 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-5%] w-150 h-150 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
        </>
      )}

      <div className="max-w-360 mx-auto relative z-10">
        
        <div className={`mb-12 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all duration-500
          ${isDarkMode ? 'bg-white/3 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
          
          <div className="flex items-center gap-6 text-right">
            <div className={`p-4 rounded-3xl border transition-colors
              ${isDarkMode ? 'bg-blue-600/20 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
               <Users size={32} />
            </div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {t('dr_prefix')} {doctorName || 'Staqem'} 🩺
              </h1>
              <p className={`mt-1 flex items-center gap-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('under_supervision_count', { count: patients.length })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 h-14">
            <LanguageToggle />
            <ThemeToggle />
            <ProfileButton />

            <button 
              onClick={() => setIsNotifOpen(true)}
              className={`h-14 w-14 rounded-2xl border transition-all hover:scale-110 active:scale-95 flex items-center justify-center relative
                ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}
            >
              <Bell size={24} />
              {totalUnread > 0 && (
                <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#070b14] animate-pulse" />
              )}
            </button>

            <div className="relative group hidden lg:block h-full">
              <Search className={`absolute ${i18n.language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 transition-colors 
                ${isDarkMode ? 'text-slate-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={20} />
              <input 
                type="text" 
                placeholder={t('search_placeholder')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`h-full w-64 rounded-2xl outline-none transition-all font-medium border
                  ${i18n.language === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'}
                  ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-blue-500/50' : 'bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-600/20 shadow-sm'}`}
              />
            </div>
            
            <button onClick={() => { localStorage.clear(); navigate('/login'); }}
              className={`h-14 w-14 rounded-2xl border transition-all active:scale-95 shadow-lg flex items-center justify-center
                ${isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-white border-red-50 text-red-500 hover:bg-red-50'}`}
            >
              <LogOut size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
          {filteredPatients.length > 0 ? filteredPatients.map((patient) => (
            <div 
              key={patient.id} 
              onClick={() => navigate(`/doctor/patient/${patient.email}`)}
              className={`group p-6 md:p-7 rounded-[2.5rem] border transition-all duration-500 cursor-pointer relative overflow-hidden backdrop-blur-sm hover:-translate-y-2
                ${isDarkMode 
                  ? 'bg-white/3 border-white/5 hover:border-blue-500/30 hover:bg-white/5 shadow-2xl' 
                  : 'bg-white border-slate-100 hover:shadow-xl'}`}
            >
              <div className="flex items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center transition-colors
                    ${isDarkMode ? 'bg-blue-600/10 text-blue-400 border border-blue-500/10' : 'bg-blue-50 text-blue-600'}`}>
                    <UserCircle size={32} />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className={`font-black text-lg tracking-tight truncate transition-colors 
                      ${isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-slate-800 group-hover:text-blue-600'}`}>
                      {patient.full_name}
                    </h3>
                    <p className={`text-xs font-bold opacity-50 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {patient.email}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={(e) => openChatWith(e, patient)}
                  className={`shrink-0 p-3 rounded-xl transition-all active:scale-90 shadow-sm border relative
                    ${isDarkMode 
                      ? 'bg-white/5 border-white/10 text-blue-400 hover:bg-blue-600 hover:text-white' 
                      : 'bg-slate-50 border-slate-200 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                >
                  <MessageSquare size={18} />
                  {(patient.unread_messages || 0) > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-[8px] font-black text-white">
                      {patient.unread_messages}
                    </span>
                  )}
                </button>
              </div>

              <div className={`mb-6 p-5 rounded-3xl border transition-colors
                ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 
                    ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {patient.is_done_today ? <CheckCircle2 size={14} className="text-green-500"/> : <Activity size={14} className="text-blue-500 animate-pulse"/>}
                    {t('daily_achievement')}
                  </span>
                  <span className={`text-sm font-black ${patient.is_done_today ? 'text-green-500' : 'text-blue-500'}`}>
                    {patient.daily_progress}%
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden p-0.5 ${isDarkMode ? 'bg-black/40' : 'bg-slate-200'}`}>
                  <div className={`h-full rounded-full transition-all duration-1000 ease-out 
                      ${patient.is_done_today ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]'}`}
                    style={{ width: `${patient.daily_progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                 <div className={`p-4 rounded-3xl text-center border transition-colors
                   ${isDarkMode ? 'bg-white/3 border-white/5' : 'bg-slate-50/50 border-slate-50'}`}>
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t('ndi_score')}</p>
                    <span className={`px-2 py-1 rounded-lg text-xs font-black border transition-all ${getSeverityColor(patient.latest_score, isDarkMode)}`}>
                      {patient.latest_score ?? '--'}
                    </span>
                 </div>
                 <div className={`p-4 rounded-3xl text-center border transition-colors
                   ${isDarkMode ? 'bg-white/3 border-white/5' : 'bg-slate-50/50 border-slate-50'}`}>
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t('last_assessment')}</p>
                    <span className={`text-[10px] font-black ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
                      {patient.last_assessment_date ? new Date(patient.last_assessment_date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US') : "--"}
                    </span>
                 </div>
              </div>
              
              <button className={`w-full py-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-3 active:scale-95
                ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'}`}>
                {t('review_file')} <ChevronLeft size={16} className={i18n.language === 'en' ? 'rotate-180' : ''} />
              </button>
            </div>
          )) : (
            <div className={`col-span-full text-center py-24 rounded-[3.5rem] border-2 border-dashed transition-all
              ${isDarkMode ? 'bg-white/3 border-white/10 text-slate-500' : 'bg-white border-slate-100 text-slate-400'}`}>
                <UserCircle size={64} className="mx-auto mb-6 opacity-20" />
                <p className="text-xl font-bold italic tracking-tight">{t('no_patients')}</p>
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

      <p className={`mt-12 text-center text-[10px] font-black uppercase tracking-[0.5em] opacity-20 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        Doctor Analytics • Staqem Clinical Data
      </p>
    </div>
  );
};

export default DoctorDashboard;