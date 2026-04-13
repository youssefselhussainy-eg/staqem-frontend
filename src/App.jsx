import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';

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

  useEffect(() => {
    const currentLang = i18n.language || 'ar';
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [i18n.language]);

  return (
    <Router>
      <SocketProvider>
        {/* أضفنا هذا الـ div ليغلف التطبيق بالكامل للتحكم في Responsive Layout */}
        <div className="app-shell">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />
            
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

            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </SocketProvider>
    </Router>
  );
}

export default App;