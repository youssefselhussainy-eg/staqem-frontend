import { useEffect } from 'react'; // أضفنا useEffect
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // أضفنا Hook الترجمة
import './i18n'; // استيراد ملف الإعدادات (اللي هتعمله)

import Signup from './pages/Signup';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding'; 
import PatientDashboard from './pages/Dashboard/PatientDashboard';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard';
import PatientDetails from './pages/Dashboard/PatientDetails';
import MyExercises from './pages/Dashboard/MyExercises';
import ProfilePage from './pages/Profile/ProfilePage';
import ReAssessment from './pages/Assessment/ReAssessment';
import { SocketProvider } from './context/SocketContext'; 

// --- 🛡️ حارس المسارات (ProtectedRoute) ---
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('user_role');

  if (!token) return <Navigate to="/login" replace />;
  
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'} replace />;
  }
  
  return children;
};

function App() {
  const { i18n } = useTranslation();

  // --- 💡 مراقب اللغة الذكي: يغير اتجاه التطبيق بالكامل فور تغيير اللغة ---
  useEffect(() => {
    const currentLang = i18n.language || 'ar';
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [i18n.language]);

  return (
    <Router>
      <SocketProvider>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* --- 🧘‍♂️ مسارات المريض --- */}
          <Route path="/patient-dashboard" element={
            <ProtectedRoute allowedRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          } />

          <Route path="/my-exercises" element={
            <ProtectedRoute allowedRole="patient">
              <MyExercises />
            </ProtectedRoute>
          } />

          <Route path="/re-assessment" element={
            <ProtectedRoute allowedRole="patient">
              <ReAssessment />
            </ProtectedRoute>
          } />

          {/* --- 🩺 مسارات الدكتور --- */}
          <Route path="/doctor-dashboard" element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/doctor/patient/:email" element={
            <ProtectedRoute allowedRole="doctor">
              <PatientDetails />
            </ProtectedRoute>
          } />

          {/* --- 👤 الملف الشخصي --- */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </SocketProvider>
    </Router>
  );
}

export default App;