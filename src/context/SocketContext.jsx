/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

// 1. إنشاء الـ Context
const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const userEmail = localStorage.getItem('user_email');
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        if (userEmail && userRole === 'patient') {
            // --- التعديل السحري هنا عشان يشتغل في الرفعة ---
            const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            const wsProtocol = baseURL.startsWith('https') ? 'wss' : 'ws';
            const wsHost = baseURL.replace(/^https?:\/\//, ''); // بيشيل http:// أو https://
            
            const ws = new WebSocket(`${wsProtocol}://${wsHost}/ws/${userEmail}`);
            // ----------------------------------------------

            ws.onopen = () => console.log("📡 [WS] Connected to Staqem Server");

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === "NEW_EXERCISES" || data.type === "REMINDER") {
                    Swal.fire({
                        title: data.title,
                        text: data.message,
                        icon: 'info',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 5000,
                        timerProgressBar: true,
                    });
                    
                    const audio = new Audio('/notification-sound.mp3'); 
                    audio.play().catch(() => {}); 
                }
            };

            ws.onclose = () => console.log("🔌 [WS] Disconnected from Server");

            socketRef.current = ws;

            return () => {
                if (socketRef.current) socketRef.current.close();
            };
        }
    }, [userEmail, userRole]);

    return (
        <SocketContext.Provider value={socketRef}>
            {children}
        </SocketContext.Provider>
    );
};

// 2. الـ Hook المخصص
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};