/**
 * Main navigation container for the application
 * Sets up the stack navigator and defines the main routes
 */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import BottomTabs from './bottom-tabs/BottomTabs';
import ChessTimer from '../features/clock/screens/ChessTimer';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer
      initialState={{
        routes: [
          {
            name: 'BottomTabs',
            state: {
              routes: [{name: 'Play'}],
            },
          },
        ],
      }}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
        <Stack.Screen
          name="ChessTimer"
          component={ChessTimer}
          options={{animation: 'fade'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
