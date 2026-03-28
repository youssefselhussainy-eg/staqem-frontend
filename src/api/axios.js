import axios from 'axios';

// ده الملف اللي هيتحكم في كل اتصالاتك بالباك إند
const API = axios.create({
  // هنا بنسحب الرابط من الـ .env لو موجود، لو مش موجود يشتغل localhost (عشان وجع الدماغ)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// لو عندك Token محتاج يتبعت في كل الـ Headers (للـ Protected Routes)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;