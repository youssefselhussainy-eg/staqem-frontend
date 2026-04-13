/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import API from '../../api/axios'; 
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, ShieldCheck, Camera, 
  Save, ArrowRight, Loader2, Edit3, 
  Bell, LogOut, ChevronLeft
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle'; 
import LanguageToggle from '../../components/LanguageToggle'; 
import ProfileButton from '../../components/dashboard/ProfileButton';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; 

const ProfilePage = () => {
  const { t, i18n } = useTranslation(); 
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const fileInputRef = useRef(null);
  
  const userEmail = localStorage.getItem('user_email');
  const userName = localStorage.getItem('user_name');
  const userRole = localStorage.getItem('user_role');

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await API.get(`/users/me/${userEmail}`);
        setFormData({
          full_name: res.data.full_name || '',
          phone: res.data.phone || '',
          email: res.data.email || '',
          role: res.data.role || ''
        });
        if (res.data.profile_picture) {
          setPreviewImage(res.data.profile_picture);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setLoading(false);
      }
    };
    if (userEmail) fetchUserData();
  }, [userEmail]);

  const handleImageClick = () => fileInputRef.current.click();
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await API.put(`/users/update/${userEmail}`, {
        full_name: formData.full_name,
        phone: formData.phone,
        profile_picture: previewImage 
      });

      localStorage.setItem('user_name', formData.full_name);
      
      Swal.fire({
        title: t('update_success_title'),
        icon: 'success',
        confirmButtonColor: '#3b82f6',
        background: isDarkMode ? '#0f172a' : '#fff',
        color: isDarkMode ? '#fff' : '#1e293b',
        customClass: { popup: 'rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-2xl' }
      });
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire(t('error'), t('update_failed_text'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackNavigation = () => {
    if (formData.role === 'doctor') {
      navigate('/doctor-dashboard');
    } else {
      navigate('/patient-dashboard');
    }
  };

  if (loading) return (
    <div className={`h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#070b14]' : 'bg-slate-50'}`}>
      <Loader2 className="animate-spin text-blue-500" size={48} />
    </div>
  );

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 font-sans p-3 md:p-8 overflow-x-hidden relative
      ${isDarkMode ? 'bg-[#070b14]' : 'bg-slate-50'}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      
      <div className="max-w-6xl mx-auto relative z-20">
        
        {/* العودة للرئيسية */}
        <div className={`flex ${i18n.language === 'ar' ? 'justify-start' : 'justify-end'} mb-4 px-2`}>
            <button 
              onClick={handleBackNavigation}
              className={`flex items-center gap-2 text-[10px] md:text-[11px] font-bold transition-all hover:gap-3
                ${isDarkMode ? 'text-slate-500 hover:text-blue-400' : 'text-slate-400 hover:text-blue-600'}`}
            >
              {i18n.language === 'ar' && <ChevronLeft size={14} className="rotate-180" />}
              {t('back_to_dashboard')}
              {i18n.language === 'en' && <ChevronLeft size={14} className="rotate-180" />}
            </button>
        </div>

        {/* 1. Header Section */}
        <div className={`mb-6 md:mb-10 p-5 md:p-8 rounded-4xl md:rounded-[3rem] border backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500
          ${isDarkMode ? 'bg-white/3 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
          
          <div className={`relative ${i18n.language === 'ar' ? 'text-center md:text-right' : 'text-center md:text-left'} w-full md:w-auto`}>
            <h1 className={`text-2xl md:text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {t('profile_page_title')} 👤
            </h1>
            <p className={`mt-1 md:mt-2 text-sm md:text-base font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('profile_greeting', { name: userName?.split(' ')[0] || 'Champ' })}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 md:gap-4 h-auto md:h-14">
            <LanguageToggle />
            <ThemeToggle /> 
            <ProfileButton />
            
            <button className={`h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl border transition-all flex items-center justify-center
              ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
              <Bell size={20} className="md:w-6 md:h-6" />
            </button>

            <button 
              onClick={() => { localStorage.clear(); navigate('/login'); }}
              className={`h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl border transition-all active:scale-95 shadow-lg flex items-center justify-center
                ${isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' : 'bg-white border-red-50 text-red-500'}`}
            >
              <LogOut size={20} className="md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* 2. Content Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-start">
          
          {/* Sidebar: Profile Picture */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`lg:col-span-4 p-6 md:p-10 rounded-4xl md:rounded-[3.5rem] border backdrop-blur-2xl flex flex-col items-center text-center
              ${isDarkMode ? 'bg-white/3 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-xl'}`}
          >
            <div className="relative group cursor-pointer" onClick={handleImageClick}>
              <div className={`w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] md:rounded-[3.5rem] flex items-center justify-center border-4 overflow-hidden transition-all group-hover:scale-105
                ${isDarkMode ? 'bg-blue-600/5 border-white/10' : 'bg-slate-50 border-white shadow-inner'}`}>
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={60} className={`md:w-20 ${isDarkMode ? 'text-blue-500' : 'text-blue-200'}`} />
                )}
              </div>
              <button className={`absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 p-3 md:p-4 bg-blue-600 text-white rounded-xl md:rounded-2xl shadow-xl hover:bg-blue-500 border-4 ${isDarkMode ? 'border-[#070b14]' : 'border-white'}`}>
                <Camera size={18} className="md:w-5 md:h-5" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            </div>

            <h2 className={`mt-6 md:mt-8 text-xl md:text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {formData.full_name}
            </h2>
            <span className={`mt-2 md:mt-3 px-5 py-1.5 md:px-6 md:py-2 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black border
              ${formData.role === 'doctor' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
              {formData.role === 'doctor' ? t('role_doctor') : t('role_patient')}
            </span>
          </motion.div>

          {/* Main Content: Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`lg:col-span-8 p-6 md:p-12 rounded-4xl md:rounded-[3.5rem] border backdrop-blur-2xl
              ${isDarkMode ? 'bg-white/3 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-xl'}`}
          >
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                <div className="space-y-2 md:space-y-4">
                  <label className={`text-[10px] md:text-xs font-black opacity-50 uppercase flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Edit3 size={14} className="text-blue-500" /> {t('full_name_label')}
                  </label>
                  <input 
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className={`w-full p-4 md:p-6 rounded-xl md:rounded-2xl outline-none border transition-all font-bold text-base md:text-lg
                      ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-blue-500 focus:bg-white/5' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600 focus:bg-white'}`}
                  />
                </div>

                <div className="space-y-2 md:space-y-4">
                  <label className={`text-[10px] md:text-xs font-black opacity-50 uppercase flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Phone size={14} className="text-blue-500" /> {t('phone_placeholder')}
                  </label>
                  <input 
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={`w-full p-4 md:p-6 rounded-xl md:rounded-2xl outline-none border transition-all font-bold text-base md:text-lg
                      ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-blue-500 focus:bg-white/5' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600 focus:bg-white'}`}
                  />
                </div>

                <div className="space-y-2 md:space-y-4">
                  <label className={`text-[10px] md:text-xs font-black opacity-50 uppercase flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Mail size={14} className="text-slate-500" /> {t('email_label_fixed')}
                  </label>
                  <div className={`w-full p-4 md:p-6 rounded-xl md:rounded-2xl border font-bold opacity-60 text-sm md:text-base
                    ${isDarkMode ? 'bg-black/20 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                    {formData.email}
                  </div>
                </div>

                <div className="space-y-2 md:space-y-4">
                  <label className={`text-[10px] md:text-xs font-black opacity-50 uppercase flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <ShieldCheck size={14} className="text-slate-500" /> {t('account_type_label')}
                  </label>
                  <div className={`w-full p-4 md:p-6 rounded-xl md:rounded-2xl border font-bold opacity-60 text-sm md:text-base
                    ${isDarkMode ? 'bg-black/20 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                    {formData.role === 'doctor' ? t('role_doctor_desc') : t('role_patient_desc')}
                  </div>
                </div>
              </div>

              <div className={`pt-6 md:pt-10 border-t border-white/5 flex ${i18n.language === 'ar' ? 'justify-end' : 'justify-start'}`}>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className={`w-full md:w-auto px-10 md:px-12 py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-white transition-all flex items-center justify-center gap-4 active:scale-95 shadow-2xl
                    ${isSaving ? 'bg-slate-600' : 'bg-linear-to-r from-blue-600 to-cyan-500 hover:scale-105 hover:shadow-blue-500/40'}`}
                >
                  {isSaving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                  {t('save')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
      
      <p className={`mt-10 md:mt-16 text-center text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] opacity-20 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        Secure Identity Management • Staqem • 2026
      </p>
    </div>
  );
};

export default ProfilePage;