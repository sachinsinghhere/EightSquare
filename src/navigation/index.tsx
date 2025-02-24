import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChessClockSelection from '../screens/ChessClockSelection';
import ChessTimer from '../screens/ChessTimer';

export type RootStackParamList = {
  ChessClockSelection: undefined;
  ChessTimer: {
    minutes: number;
    increment: number;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen
          name="ChessClockSelection"
          component={ChessClockSelection}
        />
        <Stack.Screen
          name="ChessTimer"
          component={ChessTimer}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation; 