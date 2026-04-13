import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Search, Trash2, Dumbbell, Sparkles } from 'lucide-react';
import API from '../api/axios'; 
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next'; 

const ExerciseModal = ({ isOpen, onClose, patientEmail, onSave }) => {
  const [exercises, setExercises] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { isDarkMode } = useTheme();
  const { t, i18n } = useTranslation(); 

  useEffect(() => {
    if (isOpen) {
      API.get('/doctors/exercises-library')
        .then(res => setExercises(res.data))
        .catch(err => console.error("Library fetch error:", err));
    }
  }, [isOpen]);

  const toggleSelect = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredExercises = exercises.filter(ex => 
    ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedDetails = exercises.filter(ex => selected.includes(ex.id));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-2000 flex items-center justify-center p-3 md:p-12 transition-all animate-in fade-in duration-300">
      {/* Overlay */}
      <div className={`absolute inset-0 backdrop-blur-md ${isDarkMode ? 'bg-black/60' : 'bg-slate-900/40'}`} onClick={onClose} />
      
      {/* Modal Content */}
      <div className={`relative z-10 w-full max-w-6xl rounded-4xl md:rounded-[3.5rem] border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] transition-all duration-500
        ${isDarkMode ? 'bg-[#070b14] border-white/10 shadow-black/60' : 'bg-white border-slate-100'}`}
        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      >
        
        {/* Header - Adaptive Padding */}
        <div className={`p-5 md:p-10 border-b flex justify-between items-center transition-colors
          ${isDarkMode ? 'bg-white/3 border-white/5' : 'bg-white border-slate-50'}`}>
          <div className={i18n.language === 'ar' ? 'text-right' : 'text-left'}>
            <div className="flex items-center gap-3 md:gap-4 mb-1 md:mb-2">
              <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${isDarkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <Dumbbell size={24} className="md:w-7 md:h-7" />
              </div>
              <h3 className={`text-xl md:text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {t('customize_plan_title')}
              </h3>
            </div>
            <p className={`text-[10px] md:text-sm font-bold opacity-50 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('send_updates_to')} <span className="text-blue-500 lowercase">{patientEmail}</span>
            </p>
          </div>
          <button onClick={onClose} className={`p-3 md:p-5 rounded-xl md:rounded-2xl transition-all active:scale-90
            ${isDarkMode ? 'bg-white/5 text-slate-400 hover:bg-red-500/20 hover:text-red-400' : 'bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500'}`}>
            <X size={20} className="md:w-7 md:h-7" />
          </button>
        </div>

        {/* Search & Selected Tags Bar */}
        <div className={`p-5 md:p-8 border-b space-y-4 md:space-y-6 transition-colors ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
          <div className="relative group">
            <Search className={`absolute ${i18n.language === 'ar' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-slate-600 group-focus-within:text-blue-400' : 'text-slate-300'}`} size={20} />
            <input 
              type="text" 
              placeholder={t('search_exercise_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${i18n.language === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} py-4 md:py-5 rounded-2xl md:rounded-3xl outline-none transition-all font-bold text-sm md:text-base
                ${isDarkMode 
                  ? 'bg-white/5 border border-white/5 text-white focus:ring-2 focus:ring-blue-500/50' 
                  : 'bg-white border border-slate-200 text-slate-900 focus:ring-4 focus:ring-blue-500/10 shadow-sm'}`}
            />
          </div>

          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 md:gap-3 animate-in slide-in-from-top-2">
              {selectedDetails.map(ex => (
                <div key={ex.id} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black shadow-lg shadow-blue-500/20 border border-white/10 transition-all hover:scale-105">
                  {ex.title}
                  <button onClick={(e) => { e.stopPropagation(); toggleSelect(ex.id); }} className="hover:rotate-90 transition-transform bg-white/20 rounded-full p-0.5">
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setSelected([])}
                className={`flex items-center gap-2 px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black border transition-all active:scale-95
                  ${isDarkMode ? 'border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10' : 'border-red-100 text-red-500 bg-red-50 hover:bg-red-100'}`}>
                {t('clear_all')} <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Exercises Grid - Improved for Mobile Touch */}
        <div className="p-5 md:p-10 overflow-y-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 flex-1 custom-scrollbar">
          {filteredExercises.map((ex) => {
            const isSelected = selected.includes(ex.id);
            return (
              <div 
                key={ex.id}
                onClick={() => toggleSelect(ex.id)}
                className={`group p-4 md:p-6 rounded-3xl md:rounded-[2.5rem] border-2 transition-all duration-300 cursor-pointer flex items-center gap-4 md:gap-5 relative overflow-hidden
                  ${isSelected 
                    ? (isDarkMode ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : 'border-blue-600 bg-blue-50') 
                    : (isDarkMode ? 'border-white/5 bg-white/3 hover:border-white/20' : 'border-slate-100 bg-white hover:border-blue-200 shadow-sm')}`}
              >
                <div className="relative shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-white/5">
                    <img src={ex.image_url} alt={ex.title} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isSelected ? '' : 'grayscale-[0.4]'}`} />
                  </div>
                  {isSelected && (
                    <div className={`absolute -top-2 ${i18n.language === 'ar' ? '-right-2' : '-left-2'} bg-blue-600 text-white rounded-full p-1.5 shadow-xl border-4 ${isDarkMode ? 'border-[#070b14]' : 'border-white'} animate-in zoom-in`}>
                      <CheckCircle2 size={14} />
                    </div>
                  )}
                </div>
                
                <div className={`flex-1 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <h4 className={`font-black text-sm md:text-base mb-0.5 md:mb-1 line-clamp-1 ${isSelected ? 'text-blue-500' : (isDarkMode ? 'text-white' : 'text-slate-800')}`}>
                    {ex.title}
                  </h4>
                  <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider opacity-40 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {ex.category}
                  </p>
                </div>

                <div className={`absolute bottom-0 left-0 h-1 bg-blue-600 transition-all duration-700 ${isSelected ? 'w-full' : 'w-0'}`} />
              </div>
            );
          })}
        </div>

        {/* Footer - Stacked on Mobile */}
        <div className={`p-5 md:p-10 border-t flex flex-col md:flex-row ${i18n.language === 'ar' ? 'md:flex-row-reverse' : 'md:flex-row'} gap-4 md:gap-6 transition-colors ${isDarkMode ? 'bg-white/3 border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
          <button 
            onClick={() => onSave(selected)}
            disabled={selected.length === 0}
            className={`flex-1 py-4 md:py-6 rounded-2xl md:rounded-4xl font-black text-lg md:text-xl flex items-center justify-center gap-2 md:gap-3 transition-all active:scale-[0.97] shadow-2xl
              ${selected.length > 0 
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/30' 
                : (isDarkMode ? 'bg-slate-800 text-slate-600 shadow-none' : 'bg-slate-200 text-slate-400 shadow-none')}`}
          >
            {selected.length > 0 ? <Sparkles size={20} className="md:w-7 md:h-7" /> : null}
            {t('confirm_send_plan', { count: selected.length })}
          </button>
          
          <button 
            onClick={onClose} 
            className={`px-10 md:px-14 py-4 md:py-6 rounded-2xl md:rounded-4xl font-black text-base md:text-lg transition-all active:scale-95
              ${isDarkMode ? 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>
            {t('cancel_edit_btn')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseModal;