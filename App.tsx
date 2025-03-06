/**
 * Main App component that serves as the entry point for the application.
 * Sets up theme provider and navigation.
 */
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/shared/theme/ThemeContext';
import { NetworkProvider } from './src/shared/context/NetworkContext';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <NetworkProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppNavigator />
        </GestureHandlerRootView>
      </NetworkProvider>
    </ThemeProvider>
  );
}

export default App;
