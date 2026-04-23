'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

declare global {
  interface Window {
    localStorage: Storage;
  }
}

export const THEME_ID = 'theme' as const;
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

const { LIGHT, DARK } = Theme;

const getStoredTheme = () => {
  if (typeof window === 'undefined') return null;

  return window.localStorage.getItem(THEME_ID) as Theme;
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const initialContext: ThemeContextType = {
  theme: getStoredTheme() || DARK,
  toggleTheme: () => {},
  setTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(initialContext);

// const getSystemTheme = (): Theme => (window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT);
const getSavedTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    return getStoredTheme() || DARK;
  }

  return DARK;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getSavedTheme);

  const toggleTheme = () => setTheme((prevTheme) => (prevTheme === DARK ? LIGHT : DARK));

  useEffect(() => {
    window?.localStorage.setItem(THEME_ID, theme);

    if (theme === DARK) {
      document.documentElement.classList.add(DARK);
    } else {
      document.documentElement.classList.remove(DARK);
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? DARK : LIGHT);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
