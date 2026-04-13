import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ndiQuestions } from '../data/questions';
import { ChevronRight, ChevronLeft, CheckCircle2, Loader2, ClipboardList } from 'lucide-react';
import API from '../api/axios'; 
import Swal from 'sweetalert2';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next'; 

const Onboarding = () => {
  const { t, i18n } = useTranslation(); 
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const totalQuestions = ndiQuestions.length;
  const progress = ((currentStep + 1) / totalQuestions) * 100;

  const handleAnswer = (questionId, score) => {
    setAnswers({ ...answers, [questionId]: score });
  };

  const nextStep = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitAssessment();
    }
  };

  const submitAssessment = async () => {
    const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
    const scoreList = ndiQuestions.map(q => answers[q.id] || 0);
    const patientEmail = localStorage.getItem('user_email');

    let severityLabel = t('severe_disability');
    if (totalScore <= 4) severityLabel = t('excellent_status');
    else if (totalScore <= 14) severityLabel = t('mild_disability');
    else if (totalScore <= 24) severityLabel = t('moderate_disability');

    setLoading(true);
    try {
      await API.post('/users/onboarding', {
        patient_id: patientEmail,
        scores: scoreList,
        total_score: totalScore,
        severity: severityLabel 
      });

      Swal.fire({
        title: t('onboarding_success_title'),
        text: t('onboarding_success_text', { score: totalScore }),
        icon: 'success',
        iconColor: '#22c55e',
        background: isDarkMode ? '#0f172a' : '#fff',
        color: isDarkMode ? '#fff' : '#1e293b',
        confirmButtonText: t('go_to_dashboard'),
        confirmButtonColor: '#3b82f6',
        customClass: { 
          popup: 'rounded-[2rem] md:rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl animate-in zoom-in duration-300',
          title: 'font-black text-xl md:text-2xl',
          confirmButton: 'rounded-2xl px-10 py-3 font-black transition-all hover:scale-105'
        }
      }).then(() => {
        navigate('/patient-dashboard');
      });

    } catch (error) {
      console.error(error);
      Swal.fire({
        title: t('oops'),
        text: t('onboarding_error_text'),
        icon: 'error',
        iconColor: '#ef4444',
        background: isDarkMode ? '#0f172a' : '#fff',
        color: isDarkMode ? '#fff' : '#1e293b',
        confirmButtonText: t('ok_btn'),
        confirmButtonColor: '#3b82f6',
        customClass: { 
          popup: 'rounded-[2rem] md:rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl',
          title: 'font-black text-xl md:text-2xl',
          confirmButton: 'rounded-2xl px-10 py-3 font-black'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = ndiQuestions[currentStep];

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-500 font-sans p-3 md:p-4 overflow-x-hidden 
      ${isDarkMode ? 'bg-[#070b14]' : 'bg-slate-50'}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      
      {isDarkMode && (
        <>
          <div className="absolute top-[-10%] right-[-5%] w-80 md:w-120 h-80 md:h-120 bg-blue-600/10 rounded-full blur-[80px] md:blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-5%] w-80 md:w-120 h-80 md:h-120 bg-cyan-600/10 rounded-full blur-[80px] md:blur-[100px]" />
        </>
      )}

      {/* Main Container */}
      <div className={`relative z-10 max-w-4xl w-full backdrop-blur-2xl border rounded-4xl md:rounded-[3.5rem] shadow-2xl overflow-hidden transition-all duration-500 animate-in fade-in zoom-in
        ${isDarkMode ? 'bg-white/3 border-white/10' : 'bg-white border-slate-200'}`}>
        
        {/* Progress Bar */}
        <div className={`w-full h-2 md:h-3 ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
          <div 
            className="h-full bg-linear-to-r from-blue-600 to-cyan-400 transition-all duration-700 ease-out shadow-[0_0_20px_rgba(37,99,235,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-16">
          <div className={`flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-4 md:gap-6 ${i18n.language === 'en' ? 'md:flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 md:gap-4 ${i18n.language === 'en' ? 'flex-row-reverse' : ''} w-full md:w-auto justify-center md:justify-start`}>
              <div className={`p-3 md:p-4 rounded-2xl md:rounded-3xl ${isDarkMode ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                <ClipboardList size={24} className="md:w-7 md:h-7" />
              </div>
              <div className={i18n.language === 'ar' ? 'text-right' : 'text-left'}>
                <h2 className={`text-xl md:text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {currentQuestion.category[i18n.language === 'ar' ? 'ar' : 'en']}
                </h2>
                <p className={`text-[10px] md:text-xs font-black uppercase tracking-[0.2em] opacity-40 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t('clinical_ndi_label')}
                </p>
              </div>
            </div>
            
            <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-widest px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl border
              ${isDarkMode ? 'text-blue-400 border-blue-500/20 bg-blue-500/5' : 'text-blue-600 border-blue-100 bg-blue-50'}`}>
              {t('question_label', { current: currentStep + 1, total: totalQuestions })}
            </span>
          </div>

          {/* Options Grid */}
          <div className="space-y-3 md:space-y-4">
            {currentQuestion.options[i18n.language === 'ar' ? 'ar' : 'en'].map((option, index) => {
              const isSelected = answers[currentQuestion.id] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion.id, index)}
                  className={`w-full ${i18n.language === 'ar' ? 'text-right' : 'text-left'} p-4 md:p-6 rounded-2xl md:rounded-4xl border-2 transition-all flex items-center justify-between group relative overflow-hidden
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.1)]' 
                      : isDarkMode 
                        ? 'border-white/5 bg-white/5 text-slate-400 hover:border-white/20' 
                        : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-blue-200'}`}
                >
                  <span className={`text-sm md:text-lg font-bold transition-colors ${isSelected ? (isDarkMode ? 'text-blue-400' : 'text-blue-700') : ''}`}>
                    {option}
                  </span>
                  
                  {isSelected ? (
                    /* ✅ تم إصلاح تكرار الـ className هنا */
                    <CheckCircle2 className="text-blue-500 animate-in zoom-in shrink-0 md:w-7 md:h-7" size={24} />
                  ) : (
                    <div className={`w-5 h-5 md:w-7 md:h-7 rounded-full border-2 transition-colors shrink-0
                      ${isDarkMode ? 'border-white/10 group-hover:border-blue-500/50' : 'border-slate-200 group-hover:border-blue-300'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className={`flex flex-col-reverse md:flex-row justify-between mt-10 md:mt-16 gap-4 md:gap-6 ${i18n.language === 'en' ? 'md:flex-row-reverse' : ''}`}>
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 0}
              className={`px-6 md:px-10 py-4 md:py-6 rounded-2xl md:rounded-4xl font-black text-xs md:text-sm transition-all flex items-center justify-center gap-2
                ${isDarkMode ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'} 
                disabled:opacity-0 pointer-events-auto w-full md:w-auto`}
            >
                <ChevronRight size={20} className={i18n.language === 'en' ? 'rotate-180' : ''} /> {t('previous')}
            </button>

            <button
              onClick={nextStep}
              disabled={answers[currentQuestion.id] === undefined || loading}
              className="flex-1 flex items-center justify-center gap-2 md:gap-3 bg-blue-600 hover:bg-blue-500 text-white py-4 md:py-6 rounded-2xl md:rounded-4xl font-black text-lg md:text-xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all active:scale-95 disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none w-full"
            >
              {currentStep === totalQuestions - 1 ? (loading ? <Loader2 className="animate-spin" /> : t('finish_confirm')) : t('next_question')} 
              <ChevronLeft size={22} className={`md:w-6 md:h-6 ${i18n.language === 'en' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <p className={`mt-8 md:mt-10 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-center opacity-20 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        Staqem Clinical Intelligence • Secure Assessment
      </p>
    </div>
  );
};

export default Onboarding;