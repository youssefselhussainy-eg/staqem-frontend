/* eslint-disable no-unused-vars */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, MessageSquare, Activity, Trash2 } from 'lucide-react';

const NotificationsModal = ({ isOpen, onClose, notifications = [], isDarkMode, onClearAll }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-3000 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-24 left-4 md:left-20 z-3001 w-87.5 max-h-125 rounded-[2.5rem] border shadow-2xl overflow-hidden flex flex-col backdrop-blur-2xl transition-all duration-500
              ${isDarkMode ? 'bg-slate-900/95 border-white/10 shadow-black' : 'bg-white/95 border-slate-200 shadow-slate-200'}`}
          >
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center" dir="rtl">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-blue-500" />
                <h3 className={`font-black text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>الإشعارات</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-red-500/10 rounded-xl text-slate-400"><X size={18} /></button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" dir="rtl">
              {notifications.length > 0 ? (
                notifications.map((notif, idx) => (
                  <div key={idx} className={`p-4 rounded-3xl border transition-all hover:scale-[1.02]
                    ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex shrink-0 items-center justify-center 
                        ${notif.type === 'CHAT' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-green-600 text-white'}`}>
                        {notif.type === 'CHAT' ? <MessageSquare size={18} /> : <Activity size={18} />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-black leading-snug ${isDarkMode ? 'text-blue-50' : 'text-slate-700'}`}>
                          {notif.message}
                        </p>
                        {/* التعديل: كلمة "الآن" أصبحت واضحة (أبيض في الدارك) */}
                        <span className={`text-[10px] font-black mt-2 block uppercase tracking-tighter
                          ${isDarkMode ? 'text-white/90' : 'text-slate-400'}`}>
                          {notif.time || "الآن"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center opacity-30">
                  <Bell size={48} className="mx-auto mb-4" />
                  <p className="font-black text-sm">لا توجد إشعارات جديدة</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t text-center bg-black/5">
                <button onClick={onClearAll} className="text-[11px] font-black text-red-500 flex items-center gap-2 mx-auto hover:scale-105">
                  <Trash2 size={14} /> مسح الكل
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationsModal;