import { useCallback } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { ThemeVariant, brandThemes } from '../theme/theme';

export const useAppTheme = () => {
  const { theme, setTheme } = useTheme();

  const changeTheme = useCallback((variant: ThemeVariant) => {
    const newTheme = brandThemes.default[variant];
    setTheme(newTheme);
  }, [setTheme]);

  const isDarkMode = theme.dark;

  return {
    theme,
    isDarkMode,
    changeTheme,
    currentVariant: theme.name as ThemeVariant,
  };
}; 