import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// استبدلنا axios العادي بملف الـ API الموحد
import API from '../../api/axios'; 
import { 
  ArrowRight, Activity, Calendar, Plus, User, 
  CheckCircle2, Circle, Clock, History, Sparkles, TrendingUp,
  MessageSquare, FileText, Loader2 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import ExerciseModal from '../../components/ExerciseModal';
import Swal from 'sweetalert2';
import { useTheme } from '../../context/ThemeContext';
import ChatModal from '../../components/chat/ChatModal';
import { useTranslation } from 'react-i18next';

const PatientDetails = () => {
  const { t, i18n } = useTranslation();
  const { email } = useParams();
  const [data, setData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); 
  const [requesting, setRequesting] = useState(false); 
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const doctorEmail = localStorage.getItem('user_email');

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      // الـ API عارف لوحده يروح لـ Render أو localhost
      const res = await API.get(`/doctors/patient-detail/${email}`);
      setData(res.data);
      const logsRes = await API.get(`/users/exercise-logs/${email}`);
      setLogs(logsRes.data);
    } catch (err) {
      console.error("Error fetching patient details:", err);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (email) fetchDetail();
  }, [email, fetchDetail]);

  const handleRequestAssessment = async () => {
    setRequesting(true);
    try {
      await API.post(`/users/request-assessment/${email}`);
      
      Swal.fire({
        title: t('request_sent_title'),
        text: t('request_sent_text', { name: data.patient.full_name }),
        icon: 'success',
        confirmButtonColor: '#3b82f6',
        background: isDarkMode ? '#0f172a' : '#fff',
        color: isDarkMode ? '#fff' : '#1e293b',
        customClass: { popup: 'rounded-[3rem] border border-white/10' }
      });
    } catch { 
      Swal.fire(t('error'), t('request_failed'), 'error');
    } finally {
      setRequesting(false);
    }
  };

  const handleSaveExercises = async (selectedIds) => {
    try {
      await API.post('/doctors/assign-exercises', {
        patient_email: email,
        exercise_ids: selectedIds
      });
      setIsModalOpen(false);
      fetchDetail();
      
      Swal.fire({
        title: t('update_success_title'),
        text: t('update_success_text', { name: data.patient.full_name }),
        icon: 'success',
        iconColor: '#22c55e',
        background: isDarkMode ? '#0f172a' : '#fff',
        color: isDarkMode ? '#fff' : '#1e293b',
        confirmButtonText: t('excellent'),
        confirmButtonColor: '#3b82f6',
        customClass: { 
          popup: 'rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl animate-in zoom-in duration-300',
          title: 'font-black text-2xl',
          confirmButton: 'rounded-2xl px-10 py-3 font-black transition-all hover:scale-105'
        }
      });
    } catch { 
       Swal.fire({
         title: t('save_failed_title'),
         text: t('save_failed_text'),
         icon: 'error',
         background: isDarkMode ? '#0f172a' : '#fff',
         color: isDarkMode ? '#fff' : '#1e293b',
         confirmButtonColor: '#ef4444',
         customClass: { popup: 'rounded-[2.5rem]' }
       });
    }
  };

  const getSeverity = (score) => {
    if (score <= 4) return { text: t('excellent_status'), color: "text-green-500", bg: isDarkMode ? "bg-green-500/10" : "bg-green-50", border: "border-green-500/20" };
    if (score <= 14) return { text: t('mild_disability'), color: "text-blue-500", bg: isDarkMode ? "bg-blue-500/10" : "bg-blue-50", border: "border-blue-500/20" };
    if (score <= 24) return { text: t('moderate_disability'), color: "text-yellow-600", bg: isDarkMode ? "bg-yellow-500/10" : "bg-yellow-50", border: "border-yellow-500/20" };
    return { text: t('severe_disability'), color: "text-red-500", bg: isDarkMode ? "bg-red-500/10" : "bg-red-50", border: "border-red-500/20" };
  };

  if (loading) return (
    <div className={`flex flex-col items-center justify-center h-screen space-y-6 transition-colors duration-500
      ${isDarkMode ? 'bg-[#070b14] text-blue-400' : 'bg-slate-50 text-blue-600'}`}>
      <div className="w-16 h-16 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black tracking-widest uppercase text-sm">{t('syncing_patient_file')}</p>
    </div>
  );

  const { patient, history, current_plan } = data;
  const latestAssessment = history.length > 0 ? history[history.length - 1] : null;
  const severity = latestAssessment ? getSeverity(latestAssessment.total_score) : { text: t('not_started'), color: "text-slate-400", bg: isDarkMode ? "bg-white/5" : "bg-slate-50", border: "border-transparent" };

  return (
    <div className={`relative min-h-screen w-full transition-colors duration-500 font-sans p-4 md:p-8 overflow-x-hidden
      ${isDarkMode ? 'bg-[#070b14]' : 'bg-slate-50'}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      
      {isDarkMode && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-150 h-150 bg-blue-600/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-120 h-120 bg-purple-600/5 rounded-full blur-[100px]" />
        </div>
      )}

      <div className="max-w-360 mx-auto relative z-10">
        
        {/* Navigation */}
        <button onClick={() => navigate(-1)} className={`flex items-center gap-2 mb-10 font-black group transition-all text-xs uppercase tracking-widest
          ${isDarkMode ? 'text-slate-500 hover:text-blue-400' : 'text-slate-400 hover:text-blue-600'}`}>
          <ArrowRight size={18} className={`group-hover:translate-x-1 transition-transform ${i18n.language === 'en' ? 'rotate-180' : ''}`} /> 
          {t('back_to_dashboard')}
        </button>

        {/* Patient Header Card */}
        <div className={`p-10 rounded-[3.5rem] border backdrop-blur-xl mb-10 flex flex-col md:flex-row justify-between items-center gap-10 transition-all duration-500
          ${isDarkMode ? 'bg-white/3 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
          
          <div className={`flex items-center gap-8 text-right w-full ${i18n.language === 'en' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center transition-all shadow-2xl shrink-0
              ${isDarkMode ? 'bg-blue-600/20 border border-blue-500/20 text-blue-400' : 'bg-blue-600 text-white'}`}>
              <User size={64} />
            </div>
            <div className={`flex-1 ${i18n.language === 'en' ? 'text-left' : 'text-right'}`}>
              <div className={`flex items-center gap-4 ${i18n.language === 'en' ? 'flex-row-reverse' : ''}`}>
                <h1 className={`text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{patient.full_name}</h1>
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className={`p-3 rounded-2xl transition-all active:scale-90 flex items-center gap-2 font-black text-xs
                    ${isDarkMode ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                >
                  <MessageSquare size={18} /> {t('message_patient')}
                </button>
              </div>
              <p className={`text-sm font-bold mt-1 opacity-50 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{patient.email}</p>
              <div className={`inline-flex items-center gap-3 mt-6 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border transition-colors
                ${severity.bg} ${severity.color} ${severity.border}`}>
                <Activity size={16} /> {severity.text}
              </div>
            </div>
          </div>

          <div className={`p-10 rounded-[2.5rem] border text-center min-w-60 transition-all shadow-inner
            ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-blue-50/50 border-blue-100'}`}>
            <p className={`text-[10px] uppercase font-black tracking-[0.4em] mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>
              {t('ndi_latest_label')}
            </p>
            <div className={`text-7xl font-black ${isDarkMode ? 'text-white' : 'text-blue-600'}`}>
              {latestAssessment?.total_score || '--'}<span className="text-3xl opacity-20 mr-2">/50</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className={`p-10 rounded-[3.5rem] border backdrop-blur-sm transition-all duration-500
              ${isDarkMode ? 'bg-white/3 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
              <h3 className={`font-black text-2xl mb-10 flex items-center gap-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                <div className="p-3.5 rounded-2xl bg-green-500/10 text-green-500 border border-green-500/20 shadow-inner">
                  <CheckCircle2 size={28} />
                </div>
                {t('daily_compliance_tracking')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {current_plan?.length > 0 ? current_plan.map((ex) => (
                  <div key={ex.id} className={`p-6 rounded-4xl border transition-all flex items-center justify-between group
                    ${ex.is_completed 
                      ? (isDarkMode ? 'bg-green-500/5 border-green-500/20' : 'bg-green-50 border-green-100') 
                      : (isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100')}`}>
                    <div className={`flex items-center gap-5 ${i18n.language === 'en' ? 'flex-row-reverse' : ''}`}>
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                         <img src={ex.image_url} className={`w-full h-full object-cover transition-all ${ex.is_completed ? '' : 'grayscale opacity-40'}`} alt="" />
                      </div>
                      <div className={i18n.language === 'en' ? 'text-left' : 'text-right'}>
                        <p className={`font-black text-base ${ex.is_completed ? 'text-green-500' : (isDarkMode ? 'text-slate-200' : 'text-slate-700')}`}>{ex.title}</p>
                        <p className={`text-[10px] font-black mt-1.5 flex items-center gap-1.5 uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                           <Clock size={12}/> {ex.reps_sets}
                        </p>
                      </div>
                    </div>
                    {ex.is_completed ? <CheckCircle2 className="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]" size={28} /> : <Circle className="text-slate-700 opacity-10" size={28} />}
                  </div>
                )) : <div className="col-span-full py-12 text-center opacity-30 italic font-bold">{t('no_assigned_exercises')}</div>}
              </div>
            </div>

            <div className={`p-10 rounded-[3.5rem] border backdrop-blur-sm transition-all duration-500
              ${isDarkMode ? 'bg-white/3 border-white/5 shadow-2xl' : 'bg-white border-slate-100'}`}>
              <div className="flex justify-between items-center mb-12">
                <h3 className={`font-black text-2xl flex items-center gap-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-inner">
                    <TrendingUp size={28} />
                  </div>
                  {t('ndi_improvement_indicator')}
                </h3>
              </div>
              <div className="h-96 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history.map(h => ({ 
                    date: new Date(h.created_at).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {day: 'numeric', month: 'short'}), 
                    score: h.total_score 
                  }))}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#ffffff05" : "#f1f5f9"} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: '900'}} dy={15} />
                    <YAxis domain={[0, 50]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: '900'}} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '2rem', 
                        backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                        border: isDarkMode ? '1px solid #ffffff10' : 'none',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                        padding: '1.5rem'
                      }} 
                    />
                    <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={5} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className={`p-10 rounded-[3.5rem] border transition-all duration-700 relative overflow-hidden group shadow-2xl
              ${isDarkMode ? 'bg-blue-600/10 border-blue-500/20' : 'bg-linear-to-br from-blue-600 to-indigo-800 border-transparent shadow-blue-200'}`}>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-15 transition-opacity duration-1000 rotate-12">
                 <Sparkles size={220} />
              </div>
              <div className="relative z-10">
                <h3 className="font-black text-3xl text-white mb-6 flex items-center gap-3">
                  {t('plan_management')} <Sparkles size={28} className="text-blue-300 animate-pulse" />
                </h3>
                <p className={`text-blue-100/80 text-base mb-10 leading-relaxed font-bold ${i18n.language === 'en' ? 'text-left' : 'text-right'}`}>
                  {t('plan_management_desc')}
                </p>
                <div className="space-y-4">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-6 bg-white text-blue-600 rounded-4xl font-black text-xl flex items-center justify-center gap-3 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1.5 transition-all active:scale-95"
                  >
                    <Plus size={32} /> {t('edit_program')}
                  </button>

                  <button 
                    onClick={handleRequestAssessment}
                    disabled={requesting}
                    className={`w-full py-5 rounded-4xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 border-2
                      ${isDarkMode 
                        ? 'bg-transparent border-blue-400 text-blue-400 hover:bg-blue-400/10' 
                        : 'bg-blue-700/50 border-white/20 text-white hover:bg-blue-700 shadow-lg'}`}
                  >
                    {requesting ? <Loader2 className="animate-spin" size={24} /> : <FileText size={24} />}
                    {t('request_ndi_reassessment')}
                  </button>
                </div>
              </div>
            </div>

            <div className={`p-10 rounded-[3.5rem] border backdrop-blur-sm transition-all duration-500 shadow-xl
              ${isDarkMode ? 'bg-white/3 border-white/5 shadow-black/20' : 'bg-white border-slate-100'}`}>
              <h3 className={`font-black text-xl mb-10 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                <History className="text-blue-500" size={24} /> {t('historical_logs')}
              </h3>
              <div className="space-y-5">
                {logs.length > 0 ? logs.map((log, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-6 rounded-3xl border transition-all
                    ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-100 hover:shadow-md hover:bg-white'}`}>
                    <div className={i18n.language === 'en' ? 'text-left' : 'text-right'}>
                      <p className={`text-sm font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {new Date(log.date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long' })}
                      </p>
                      <p className="text-[10px] text-slate-500 font-black mt-1 uppercase tracking-tighter opacity-50">{t('physical_activity')}</p>
                    </div>
                    <span className="text-[11px] font-black text-blue-500 bg-blue-500/10 px-5 py-2.5 rounded-2xl border border-blue-500/10 shadow-sm">
                      {log.count} {t('exercises_count')}
                    </span>
                  </div>
                )) : <div className="text-center py-10 opacity-20 italic font-bold">{t('no_historical_logs')}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ExerciseModal 
        key={isModalOpen} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        patientEmail={email} 
        onSave={handleSaveExercises} 
      />

      <ChatModal 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        senderEmail={doctorEmail}
        receiverEmail={email}
        receiverName={patient.full_name}
      />

      <p className={`mt-20 text-center text-[10px] font-black uppercase tracking-[0.7em] opacity-20 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        Patient Analytics Module • Staqem Clinical Network
      </p>
    </div>
  );
};

export default PatientDetails;