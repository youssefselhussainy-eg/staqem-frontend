import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // بنشوف اليوزر كان مختار إيه قبل كدة أو بنخلي الـ Dark هو الأساسي
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'light' ? false : true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// السطر ده هو اللي بيحل مشكلة الـ ESLint والـ Fast Refresh
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);