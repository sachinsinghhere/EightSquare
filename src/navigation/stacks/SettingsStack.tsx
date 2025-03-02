import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../types';
import { useTheme } from '../../shared/theme/ThemeContext';
import { getStackScreenOptions } from '../constants';
import SettingsScreen from '../../features/settings/screens/SettingsScreen';
import ThemeSelectionScreen from '../../features/settings/screens/ThemeSelectionScreen';
import SoundSettingsScreen from '../../features/settings/screens/SoundSettingsScreen';
import NotificationsScreen from '../../features/settings/screens/NotificationsScreen';
import LanguageScreen from '../../features/settings/screens/LanguageScreen';
import AboutScreen from '../../features/settings/screens/AboutScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();


export const SettingsStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator screenOptions={getStackScreenOptions(theme)}>
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ThemeSelection" component={ThemeSelectionScreen} />
      <Stack.Screen name="Sound" component={SoundSettingsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}; 