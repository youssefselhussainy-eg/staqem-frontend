import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Stethoscope, User, Mail, Lock, Phone, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// استبدلنا axios العادي بملف الـ API بتاعنا عشان يقرأ من Render
import API from '../api/axios'; 
import Swal from 'sweetalert2';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle'; 
import LanguageToggle from '../components/LanguageToggle'; 
import { useTranslation } from 'react-i18next'; 

const Signup = () => {
  const { t, i18n } = useTranslation(); 
  const { register, handleSubmit, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const selectedRole = watch("role", "patient");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // استخدمنا الـ API الموحد وشلنا الرابط اليدوي
        const response = await API.get('/users/doctors-list');
        setDoctors(response.data);
      } catch (error) {
        console.error(t('fetch_doctors_error'), error);
      }
    };
    fetchDoctors();
  }, [t]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // الـ API عارف لوحده إنه يكلم Render أو localhost حسب الـ .env
      await API.post('/users/signup', data);
      
      Swal.fire({
        title: t('signup_success_title'),
        text: t('signup_success_text'),
        icon: 'success',
        iconColor: '#22c55e',
        background: isDarkMode ? '#0f172a' : '#fff',
        color: isDarkMode ? '#fff' : '#1e293b',
        confirmButtonText: t('let_is_go'),
        confirmButtonColor: '#3b82f6',
        customClass: { 
          popup: 'rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl animate-in zoom-in duration-300',
          title: 'font-black text-2xl',
          confirmButton: 'rounded-2xl px-10 py-3 font-black transition-all hover:scale-105'
        }
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });

    } catch (error) {
      Swal.fire({
        title: t('signup_error_title'),
        text: error.response?.data?.detail || t('signup_error_text'),
        icon: 'error',
        iconColor: '#ef4444',
        background: isDarkMode ? '#0f172a' : '#fff',
        color: isDarkMode ? '#fff' : '#1e293b',
        confirmButtonText: t('ok_btn'),
        confirmButtonColor: '#3b82f6',
        customClass: { 
          popup: 'rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl animate-in zoom-in duration-300',
          title: 'font-black text-2xl',
          confirmButton: 'rounded-2xl px-10 py-3 font-black transition-all hover:scale-105'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center transition-colors duration-500 font-sans p-4 overflow-hidden 
      ${isDarkMode ? 'bg-[#070b14]' : 'bg-slate-50'}`}>
      
      {/* أزرار التحكم باللغة والثيرم */}
      <div className={`absolute top-8 ${i18n.language === 'ar' ? 'left-8' : 'right-8'} z-50 flex gap-4 animate-in fade-in duration-700`}>
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {isDarkMode && (
        <>
          <div className="absolute top-[-5%] right-[-5%] w-150 h-150 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-5%] left-[-5%] w-150 h-150 bg-purple-600/10 rounded-full blur-[120px]" />
        </>
      )}

      <div className={`relative z-10 max-w-xl w-full backdrop-blur-2xl border rounded-[3.5rem] p-8 md:p-12 shadow-2xl transition-all duration-500 animate-in fade-in zoom-in
        ${isDarkMode 
          ? 'bg-white/3 border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]' 
          : 'bg-white border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]'}`}>
        
        <div className="text-center mb-10">
           <div className={`inline-flex p-5 rounded-4xl mb-4 border transition-colors 
             ${isDarkMode ? 'bg-blue-600/20 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
              <h1 className="text-4xl font-black tracking-tighter">{i18n.language === 'ar' ? 'استقم' : 'Staqem'} 🩺</h1>
           </div>
           <h2 className={`text-2xl font-black mt-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
             {t('signup_title')}
           </h2>
           <p className={`text-sm font-medium opacity-60 mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
             {t('signup_subtitle')}
           </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
          
          <div className="relative group">
            <User className={`absolute ${i18n.language === 'ar' ? 'right-5' : 'left-5'} top-4.5 transition-colors 
              ${isDarkMode ? 'text-slate-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={20} />
            <input {...register("full_name", { required: true })} type="text" placeholder={t('full_name_placeholder')} 
              className={`w-full ${i18n.language === 'ar' ? 'pr-14 pl-6' : 'pl-14 pr-6'} py-4.5 rounded-2xl outline-none transition-all font-bold placeholder:opacity-50
                ${isDarkMode 
                  ? 'bg-white/5 border border-white/5 text-white focus:ring-2 focus:ring-blue-500/50' 
                  : 'bg-slate-50 border border-slate-100 text-slate-900 focus:ring-2 focus:ring-blue-600/20'}`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative group">
              <Mail className={`absolute ${i18n.language === 'ar' ? 'right-5' : 'left-5'} top-4.5 transition-colors 
                ${isDarkMode ? 'text-slate-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={20} />
              <input {...register("email", { required: true })} type="email" placeholder={t('email_label')} 
                className={`w-full ${i18n.language === 'ar' ? 'pr-14 pl-6' : 'pl-14 pr-6'} py-4.5 rounded-2xl outline-none transition-all font-bold placeholder:opacity-50
                  ${isDarkMode 
                    ? 'bg-white/5 border border-white/5 text-white focus:ring-2 focus:ring-blue-500/50' 
                    : 'bg-slate-50 border border-slate-100 text-slate-900 focus:ring-2 focus:ring-blue-600/20'}`}
              />
            </div>

            <div className="relative group">
              <Phone className={`absolute ${i18n.language === 'ar' ? 'right-5' : 'left-5'} top-4.5 transition-colors 
                ${isDarkMode ? 'text-slate-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={20} />
              <input {...register("phone", { required: true })} type="tel" placeholder={t('phone_placeholder')} 
                className={`w-full ${i18n.language === 'ar' ? 'pr-14 pl-6' : 'pl-14 pr-6'} py-4.5 rounded-2xl outline-none transition-all font-bold placeholder:opacity-50
                  ${isDarkMode 
                    ? 'bg-white/5 border border-white/5 text-white focus:ring-2 focus:ring-blue-500/50' 
                    : 'bg-slate-50 border border-slate-100 text-slate-900 focus:ring-2 focus:ring-blue-600/20'}`}
              />
            </div>
          </div>

          <div className={`flex gap-2 p-2 rounded-2xl transition-colors border ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
            <label className="flex-1 cursor-pointer">
              <input {...register("role")} type="radio" value="patient" className="hidden peer" defaultChecked />
              <div className={`text-center py-3 rounded-xl transition-all font-black text-xs uppercase tracking-[0.2em]
                peer-checked:bg-blue-600 peer-checked:text-white peer-checked:shadow-lg peer-checked:shadow-blue-500/20
                ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>{t('patient')}</div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input {...register("role")} type="radio" value="doctor" className="hidden peer" />
              <div className={`text-center py-3 rounded-xl transition-all font-black text-xs uppercase tracking-[0.2em]
                peer-checked:bg-blue-600 peer-checked:text-white peer-checked:shadow-lg peer-checked:shadow-blue-500/20
                ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>{t('doctor')}</div>
            </label>
          </div>

          {selectedRole === "patient" && (
            <div className="relative group animate-in slide-in-from-top-2 duration-300">
              <Stethoscope className={`absolute ${i18n.language === 'ar' ? 'right-5' : 'left-5'} top-4.5 transition-colors 
                ${isDarkMode ? 'text-slate-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={20} />
              <select
                {...register("doctor_id", { required: selectedRole === "patient" })}
                className={`w-full ${i18n.language === 'ar' ? 'pr-14 pl-8' : 'pl-14 pr-8'} py-4.5 rounded-2xl outline-none appearance-none transition-all font-bold
                  ${isDarkMode 
                    ? 'bg-white/5 border border-white/5 text-white focus:ring-2 focus:ring-blue-500/50' 
                    : 'bg-slate-50 border border-slate-100 text-slate-900 focus:ring-2 focus:ring-blue-600/20'}`}
              >
                <option value="" className={isDarkMode ? 'bg-[#070b14]' : ''}>{t('select_doctor')}</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.email} className={isDarkMode ? 'bg-[#070b14]' : ''}>
                    {t('dr_prefix')} {doc.full_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="relative group">
            <Lock className={`absolute ${i18n.language === 'ar' ? 'right-5' : 'left-5'} top-4.5 transition-colors 
              ${isDarkMode ? 'text-slate-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={20} />
            <input {...register("password", { required: true, minLength: 6 })} type="password" placeholder={t('password_placeholder')} 
              className={`w-full ${i18n.language === 'ar' ? 'pr-14 pl-6' : 'pl-14 pr-6'} py-4.5 rounded-2xl outline-none transition-all font-bold placeholder:opacity-50
                ${isDarkMode 
                  ? 'bg-white/5 border border-white/5 text-white focus:ring-2 focus:ring-blue-500/50' 
                  : 'bg-slate-50 border border-slate-100 text-slate-900 focus:ring-2 focus:ring-blue-600/20'}`}
            />
          </div>

          <button type="submit" disabled={loading} 
            className={`w-full py-5 rounded-4xl font-black text-xl transition-all active:scale-95 flex items-center justify-center gap-3 mt-6 shadow-2xl
              ${isDarkMode 
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/20' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'}`}>
            {loading ? <Loader2 className="animate-spin" size={24} /> : <><Sparkles size={22} /> {t('signup_btn')}</>}
          </button>
        </form>

        <div className={`mt-10 pt-8 border-t text-center ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
          <p className={`${isDarkMode ? 'text-slate-500' : 'text-slate-400'} text-sm font-bold`}>
            {t('already_have_account')}
            <span onClick={() => navigate("/login")} 
              className={`font-black ${i18n.language === 'ar' ? 'mr-2' : 'ml-2'} cursor-pointer text-blue-500 hover:underline underline-offset-8 transition-all`}>
              {t('login_link')}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;