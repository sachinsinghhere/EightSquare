import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Header } from './Header';
import Loader from './Loader';

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
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle={theme.name === 'Dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      {showHeader && title && (
        <Header title={title} showBack={showBack} rightAction={rightAction} />
      )}

      <View
        style={[styles.content, {backgroundColor: theme.colors.background}]}>
        {children}
      </View>
      <Loader visible={loaderVisible} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
}); 