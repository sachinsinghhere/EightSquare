import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-gesture-handler';
import { ThemeProvider } from './src/shared/theme/ThemeContext';
import { brandThemes } from './src/shared/theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('selectedTheme');
      console.log(`Loaded theme: ${storedTheme}`); // Log loaded theme
      if (storedTheme) {
        // setTheme(brandThemes.default[storedTheme]);
      }
    };
    loadTheme();
  }, []);
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <AppNavigator />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

export default App;
