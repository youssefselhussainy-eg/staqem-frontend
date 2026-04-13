import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios'; 
import Swal from 'sweetalert2';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle'; 
import LanguageToggle from '../components/LanguageToggle'; 
import { useTranslation } from 'react-i18next'; 

const Login = () => {
  const { t, i18n } = useTranslation(); 
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await API.post('/users/login', data);
      
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user_role', response.data.role);
      localStorage.setItem('user_name', response.data.full_name);
      localStorage.setItem('user_email', response.data.email);
      
      if (response.data.role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        response.data.is_onboarded ? navigate("/patient-dashboard") : navigate("/onboarding");
      }
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({
        title: t('login_error_title'), 
        text: t('login_error_text'),   
        icon: 'error',
        iconColor: '#ef4444',
        background: isDarkMode ? '#0f172a' : '#fff',
        color: isDarkMode ? '#fff' : '#1e293b',
        confirmButtonText: t('try_again'), 
        confirmButtonColor: '#3b82f6',
        customClass: { 
          popup: 'rounded-[2rem] md:rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl animate-in zoom-in duration-300',
          title: 'font-black text-xl md:text-2xl',
          confirmButton: 'rounded-2xl px-8 md:px-10 py-3 font-black transition-all hover:scale-105'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center transition-colors duration-500 font-sans p-4 overflow-hidden 
      ${isDarkMode ? 'bg-[#070b14]' : 'bg-slate-50'}`}>
      
      {/* الأزرار العلوية - تعديل المسافات في الموبايل */}
      <div className={`absolute top-4 md:top-8 ${i18n.language === 'ar' ? 'left-4 md:left-8' : 'right-4 md:right-8'} z-50 flex gap-2 md:gap-4 animate-in fade-in duration-700`}>
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {isDarkMode && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-80 md:w-125 h-80 md:h-125 bg-blue-600/10 rounded-full blur-[100px] md:blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 md:w-150 h-96 md:h-150 bg-purple-600/10 rounded-full blur-[100px] md:blur-[120px] animate-bounce" style={{ animationDuration: '8s' }} />
        </>
      )}

      {/* الكارت الأساسي - جعل الحواف والمسافات متجاوبة */}
      <div className={`relative z-10 max-w-md w-full backdrop-blur-2xl border rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 shadow-2xl transition-all duration-500 animate-in fade-in zoom-in
        ${isDarkMode 
          ? 'bg-white/3 border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]' 
          : 'bg-white border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]'}`}>
        
        <div className="text-center mb-6 md:mb-10">
           <div className={`inline-flex p-4 md:p-5 rounded-3xl md:rounded-4xl mb-4 border transition-colors 
             ${isDarkMode ? 'bg-blue-600/20 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter">{i18n.language === 'ar' ? 'استقم' : 'Staqem'} 🩺</h1>
           </div>
           <p className={`mt-2 font-black tracking-[0.2em] md:tracking-[0.3em] uppercase text-[9px] md:text-[10px] opacity-50 
             ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Clinical Rehab AI</p>
           <h2 className={`text-xl md:text-2xl font-black mt-4 md:mt-6 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
             {t('welcome_back')}
           </h2>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
          <div className="relative group">
            <User className={`absolute ${i18n.language === 'ar' ? 'right-5' : 'left-5'} top-4 md:top-5 transition-colors 
              ${isDarkMode ? 'text-slate-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={18} />
            <input
              {...register("email", { required: true })}
              type="text"
              placeholder={t('email_placeholder')}
              className={`w-full ${i18n.language === 'ar' ? 'pr-12 md:pr-14 pl-6' : 'pl-12 md:pl-14 pr-6'} py-4 md:py-5 rounded-xl md:rounded-2xl outline-none transition-all font-bold placeholder:opacity-50 text-sm md:text-base
                ${isDarkMode 
                  ? 'bg-white/5 border border-white/5 text-white focus:ring-2 focus:ring-blue-500/50' 
                  : 'bg-slate-50 border border-slate-100 text-slate-900 focus:ring-2 focus:ring-blue-600/20'}`}
            />
          </div>
          
          <div className="relative group">
            <Lock className={`absolute ${i18n.language === 'ar' ? 'right-5' : 'left-5'} top-4 md:top-5 transition-colors 
              ${isDarkMode ? 'text-slate-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={18} />
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder={t('password_placeholder')}
              className={`w-full ${i18n.language === 'ar' ? 'pr-12 md:pr-14 pl-6' : 'pl-12 md:pl-14 pr-6'} py-4 md:py-5 rounded-xl md:rounded-2xl outline-none transition-all font-bold placeholder:opacity-50 text-sm md:text-base
                ${isDarkMode 
                  ? 'bg-white/5 border border-white/5 text-white focus:ring-2 focus:ring-blue-500/50' 
                  : 'bg-slate-50 border border-slate-100 text-slate-900 focus:ring-2 focus:ring-blue-600/20'}`}
            />
          </div>
          
          <button 
            disabled={loading}
            type="submit"
            className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-lg md:text-xl transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl
              ${isDarkMode 
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/20' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'}`}
          >
            {loading ? <Loader2 className="animate-spin" /> : t('login_btn')}
          </button>
        </form>

        <div className={`mt-8 md:mt-10 pt-6 md:pt-8 border-t text-center ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
          <p className={`${isDarkMode ? 'text-slate-500' : 'text-slate-400'} text-xs md:text-sm font-bold`}>
            {t('no_account')}
            <span 
              onClick={() => navigate('/signup')} 
              className={`font-black ${i18n.language === 'ar' ? 'mr-2' : 'ml-2'} cursor-pointer text-blue-500 hover:underline underline-offset-8 transition-all`}
            >
              {t('register_now')}
            </span>
          </p>
        </div>
      </div>

      {/* Footer - مخفي في الشاشات الصغيرة لتقليل الزحمة */}
      <div className={`absolute bottom-4 md:bottom-8 w-full justify-between px-6 md:px-12 opacity-20 hidden md:flex ${i18n.language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
         <p className={`${isDarkMode ? 'text-white' : 'text-slate-900'} text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em]`}>Staqem Encryption Active</p>
         <p className={`${isDarkMode ? 'text-white' : 'text-slate-900'} text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em]`}>© 2026 Professional Care</p>
      </div>
    </div>
  );
};

export default Login;