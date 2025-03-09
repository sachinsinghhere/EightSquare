import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Theme, brandThemes } from './theme'; // Removed BrandTheme import
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(brandThemes.default.mars);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('selectedTheme');
        if (storedTheme) {
          const parsedTheme = JSON.parse(storedTheme);
          setThemeState(parsedTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  const setTheme = useCallback(async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem('selectedTheme', JSON.stringify(newTheme));
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 
