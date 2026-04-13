/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios'; 
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, CheckCircle2, 
  Home, Loader2 
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
        customClass: { popup: 'rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-2xl' }
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
    <div className={`min-h-screen w-full transition-colors duration-500 font-sans p-3 md:p-8 flex flex-col items-center justify-center relative overflow-x-hidden
      ${isDarkMode ? 'bg-[#070b14]' : 'bg-slate-50'}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className={`absolute top-[-10%] right-[-10%] w-64 md:w-96 h-64 md:h-96 rounded-full blur-[80px] md:blur-[120px] opacity-20
          ${isDarkMode ? 'bg-blue-600' : 'bg-blue-400'}`} />
      </div>

      <div className="max-w-3xl w-full relative z-10">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 md:mb-8 px-2 md:px-4">
          <button 
            onClick={() => navigate('/patient-dashboard')}
            className={`flex items-center gap-1.5 md:gap-2 text-[11px] md:text-sm font-black transition-all
              ${isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}
          >
            <Home size={16} className="md:w-4.5" /> {t('cancel_and_back')}
          </button>
          <div className={`flex flex-col ${i18n.language === 'ar' ? 'items-end' : 'items-start'}`}>
            <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {t('clinical_assessment')}
            </span>
            <h2 className={`text-base md:text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {t('ndi_developed_index')}
            </h2>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className={`w-full h-2.5 md:h-3 rounded-full mb-8 md:mb-10 p-0.5 border overflow-hidden
          ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-linear-to-r from-blue-600 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]"
          />
        </div>

        {/* Main Assessment Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-6 md:p-12 rounded-4xl md:rounded-[3.5rem] border backdrop-blur-2xl shadow-2xl transition-all
              ${isDarkMode ? 'bg-white/3 border-white/5' : 'bg-white border-slate-100'}`}
          >
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-base md:text-lg shrink-0
                ${isDarkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                {currentStep + 1}
              </div>
              <h3 className={`text-lg md:text-2xl font-black leading-snug ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {ndiQuestions[currentStep].category[i18n.language === 'ar' ? 'ar' : 'en']}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-3 md:space-y-4">
              {ndiQuestions[currentStep].options[i18n.language === 'ar' ? 'ar' : 'en'].map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`w-full p-4 md:p-6 rounded-2xl md:rounded-3xl text-right font-bold transition-all flex items-center justify-between group
                    ${answers[ndiQuestions[currentStep].id] === index
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-[1.01] md:scale-[1.02]'
                      : (isDarkMode 
                          ? 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10' 
                          : 'bg-slate-50 border border-slate-100 text-slate-600 hover:bg-white hover:shadow-md')
                    }`}
                  dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                >
                  <span className="text-sm md:text-lg leading-relaxed">{option}</span>
                  {answers[ndiQuestions[currentStep].id] === index && <CheckCircle2 size={20} className="shrink-0 md:w-6 md:h-6" />}
                </button>
              ))}
            </div>

            {/* Footer Navigation Buttons */}
            <div className="flex items-center justify-between mt-10 md:mt-12 pt-6 md:pt-8 border-t border-white/5 gap-4">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`flex items-center gap-1.5 md:gap-2 font-black text-xs md:text-sm transition-all
                  ${currentStep === 0 ? 'opacity-0 pointer-events-none' : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800')}`}
              >
                <ChevronRight size={18} className={`md:w-5 md:h-5 ${i18n.language === 'en' ? 'rotate-180' : ''}`} /> {t('previous')}
              </button>

              <button
                onClick={handleNext}
                disabled={!isCurrentAnswered || isSubmitting}
                className={`px-6 md:px-10 py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black text-sm md:text-base flex items-center justify-center gap-2 md:gap-3 transition-all active:scale-95 flex-1 md:flex-none
                  ${!isCurrentAnswered 
                    ? (isDarkMode ? 'bg-white/5 text-slate-600' : 'bg-slate-100 text-slate-400')
                    : 'bg-blue-600 text-white shadow-xl hover:bg-blue-500 shadow-blue-600/20'}`}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
                  currentStep === totalQuestions - 1 ? t('finish_and_save') : t('next')
                )}
                {currentStep !== totalQuestions - 1 && <ChevronLeft size={18} className={`md:w-5 md:h-5 ${i18n.language === 'en' ? 'rotate-180' : ''}`} />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className={`mt-8 text-center text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] opacity-20 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Clinical Accuracy Guaranteed • Staqem NDI Module
        </p>
      </div>
    </div>
  );
};

export default ReAssessment;