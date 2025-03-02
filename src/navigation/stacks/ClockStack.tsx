import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChessClockSelection from '../../features/clock/screens/ChessClockSelection';
import { ClockStackParamList } from '../types';
import { useTheme } from '../../shared/theme/ThemeContext';
import { getStackScreenOptions } from '../constants';

const Stack = createNativeStackNavigator<ClockStackParamList>();


export const ClockStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator screenOptions={getStackScreenOptions(theme)}>
      <Stack.Screen name="Clocks" component={ChessClockSelection} />
    </Stack.Navigator>
  );
}; 