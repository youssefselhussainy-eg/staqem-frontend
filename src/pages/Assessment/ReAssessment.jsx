import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// استبدلنا axios العادي بملف الـ API الموحد بتاعنا
import API from '../../api/axios'; 
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, CheckCircle2, 
  ClipboardList, AlertCircle, Loader2, Home 
} from 'lucide-react';
import { ndiQuestions } from '../../data/questions';
import { useTheme } from '../../context/ThemeContext';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next'; 

const ReAssessment = () => {
  const { t, i18n } = useTranslation(); 
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const userEmail = localStorage.getItem('user_email');

  const totalQuestions = ndiQuestions.length;
  const progress = ((currentStep + 1) / totalQuestions) * 100;

  const handleOptionSelect = (optionIndex) => {
    setAnswers({ ...answers, [ndiQuestions[currentStep].id]: optionIndex });
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitAssessment();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const submitAssessment = async () => {
    const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
    const scoresList = ndiQuestions.map(q => answers[q.id]);

    let severityLabel = t('severe_disability');
    if (totalScore <= 4) severityLabel = t('excellent_status');
    else if (totalScore <= 14) severityLabel = t('mild_disability');
    else if (totalScore <= 24) severityLabel = t('moderate_disability');
    
    setIsSubmitting(true);
    try {
      // الـ API عارف لوحده يروح لـ Render أو localhost وبيبعت الـ Token أوتوماتيك
      await API.post('/users/onboarding', {
        patient_id: userEmail,
        scores: scoresList,
        total_score: totalScore,
        severity: severityLabel,
        created_at: new Date().toISOString()
      });

      Swal.fire({
        title: t('assessment_success_title'),
        text: t('assessment_success_text', { score: totalScore }),
        icon: 'success',
        confirmButtonColor: '#3b82f6',
        background: isDarkMode ? '#0f172a' : '#fff',
        color: isDarkMode ? '#fff' : '#1e293b',
        customClass: { popup: 'rounded-[3rem] border border-white/10 shadow-2xl' }
      }).then(() => navigate('/patient-dashboard'));

    } catch (err) {
      console.error("Submission error details:", err.response?.data);
      Swal.fire(t('error'), t('save_failed_text'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCurrentAnswered = answers[ndiQuestions[currentStep].id] !== undefined;

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 font-sans p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden
      ${isDarkMode ? 'bg-[#070b14]' : 'bg-slate-50'}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className={`absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full blur-[120px] opacity-20
          ${isDarkMode ? 'bg-blue-600' : 'bg-blue-400'}`} />
      </div>

      <div className="max-w-3xl w-full relative z-10">
        <div className="flex items-center justify-between mb-8 px-4">
          <button 
            onClick={() => navigate('/patient-dashboard')}
            className={`flex items-center gap-2 text-sm font-black transition-all
              ${isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}
          >
            <Home size={18} /> {t('cancel_and_back')}
          </button>
          <div className={`flex flex-col ${i18n.language === 'ar' ? 'items-end' : 'items-start'}`}>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {t('clinical_assessment')}
            </span>
            <h2 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {t('ndi_developed_index')}
            </h2>
          </div>
        </div>

        <div className={`w-full h-3 rounded-full mb-10 p-0.5 border overflow-hidden
          ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-linear-to-r from-blue-600 to-cyan-400 rounded-full"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`p-8 md:p-12 rounded-[3.5rem] border backdrop-blur-2xl shadow-2xl transition-all
              ${isDarkMode ? 'bg-white/3 border-white/5' : 'bg-white border-slate-100'}`}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg
                ${isDarkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                {currentStep + 1}
              </div>
              <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {ndiQuestions[currentStep].category[i18n.language === 'ar' ? 'ar' : 'en']}
              </h3>
            </div>

            <div className="space-y-4">
              {ndiQuestions[currentStep].options[i18n.language === 'ar' ? 'ar' : 'en'].map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`w-full p-6 rounded-3xl text-right font-bold transition-all flex items-center justify-between group
                    ${answers[ndiQuestions[currentStep].id] === index
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-[1.02]'
                      : (isDarkMode 
                          ? 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10' 
                          : 'bg-slate-50 border border-slate-100 text-slate-600 hover:bg-white hover:shadow-md')
                    }`}
                  dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                >
                  <span className="text-lg leading-relaxed">{option}</span>
                  {answers[ndiQuestions[currentStep].id] === index && <CheckCircle2 size={24} className="shrink-0" />}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 font-black transition-all
                  ${currentStep === 0 ? 'opacity-0 pointer-events-none' : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800')}`}
              >
                <ChevronRight size={20} className={i18n.language === 'en' ? 'rotate-180' : ''} /> {t('previous')}
              </button>

              <button
                onClick={handleNext}
                disabled={!isCurrentAnswered || isSubmitting}
                className={`px-10 py-5 rounded-2xl font-black flex items-center gap-3 transition-all active:scale-95
                  ${!isCurrentAnswered 
                    ? (isDarkMode ? 'bg-white/5 text-slate-600' : 'bg-slate-100 text-slate-400')
                    : 'bg-blue-600 text-white shadow-xl hover:bg-blue-500 shadow-blue-600/20'}`}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : (
                  currentStep === totalQuestions - 1 ? t('finish_and_save') : t('next')
                )}
                {currentStep !== totalQuestions - 1 && <ChevronLeft size={20} className={i18n.language === 'en' ? 'rotate-180' : ''} />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className={`mt-8 text-center text-[10px] font-black uppercase tracking-[0.6em] opacity-20 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Clinical Accuracy Guaranteed • Staqem NDI Module
        </p>
      </div>
    </div>
  );
};

export default ReAssessment;