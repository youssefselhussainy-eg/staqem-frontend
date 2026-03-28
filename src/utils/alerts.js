import Swal from 'sweetalert2';
import i18n from '../i18n'; // استيراد i18n عشان نستخدمه بره الـ Hooks

export const showStaqemAlert = ({ title, text, icon, isDarkMode, confirmButtonText }) => {
  // التعديل: لو مبعتش نص للزرار، هيسحب ok_btn (تمام/OK) حسب لغة السيستم ✅
  const defaultConfirmText = i18n.t('ok_btn');
  
  return Swal.fire({
    title,
    text,
    icon,
    iconColor: icon === 'success' ? '#22c55e' : (icon === 'error' ? '#ef4444' : '#3b82f6'),
    background: isDarkMode ? '#0f172a' : '#fff',
    color: isDarkMode ? '#fff' : '#1e293b',
    confirmButtonText: confirmButtonText || defaultConfirmText,
    confirmButtonColor: '#3b82f6',
    customClass: {
      popup: 'rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl animate-in zoom-in duration-300',
      title: 'font-black text-2xl',
      confirmButton: 'rounded-2xl px-10 py-3 font-black transition-all hover:scale-105 active:scale-95'
    }
  });
};

export const showStaqemToast = (title, icon = 'success', isDarkMode = true) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: isDarkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    color: isDarkMode ? '#fff' : '#1e293b',
    customClass: {
      popup: 'rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl',
    }
  });
  return Toast.fire({ icon, title });
};