import React from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Header } from './Header';
import Loader from './Loader';
import { GalaxyBackground } from './GalaxyBackground';

interface ScreenWrapperProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  showBack?: boolean;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  loaderVisible?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  title,
  showHeader = true,
  showBack = true,
  rightAction,
  loaderVisible = false,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      
      <GalaxyBackground />

      {showHeader && title && (
        <Header title={title} showBack={showBack} rightAction={rightAction} />
      )}

      <View style={[styles.content]}>
        {children}
      </View>
      <Loader visible={loaderVisible} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: Platform.OS === 'android' ? 0 : undefined,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
}); 