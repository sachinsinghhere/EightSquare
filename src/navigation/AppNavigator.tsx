import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './bottom-tabs/BottomTabs';
import ThemeSelectionScreen from '../features/settings/screens/ThemeSelectionScreen';


const Stack = createNativeStackNavigator();

            const AppNavigator = () => {
  return (
    <NavigationContainer initialState={{
        routes: [
            {
                name: 'BottomTabs',
                state: {
                    routes: [{name: 'Play'}]
                }
            }
        ]}}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
        <Stack.Screen name="ThemeSelection" component={ThemeSelectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
