/**
 * Bottom tab navigation component
 * Defines the main tabs for the application: Play, Train, Clock, and Settings
 */
import React, { useEffect } from 'react';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../shared/theme/ThemeContext';
import { RootTabParamList } from '../types';
import { PlayStack } from '../stacks/PlayStack';
import { ClockStack } from '../stacks/ClockStack';
import { TrainStack } from '../stacks/TrainStack';
import { SettingsStack } from '../stacks/SettingsStack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from 'react-native-splash-screen';

const Tabs = createBottomTabNavigator<RootTabParamList>();

const BottomTabs = () => {
  const { theme } = useTheme();
  
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <Tabs.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderTopWidth: 1,
            borderTopColor: `${theme.colors.primary}40`,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: `${theme.colors.primary}80`,
          tabBarActiveBackgroundColor: 'transparent',
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Roboto-Medium',
          },
        }}>
        <Tabs.Screen
          name="Play"
          component={PlayStack}
          options={{
            tabBarIcon: ({focused, color}) => (
              <MaterialCommunityIcons
                name={
                  focused
                    ? 'gamepad-variant'
                    : 'gamepad-variant-outline'
                }
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Train"
          component={TrainStack}
          options={{
            tabBarIcon: ({focused, color}) => (
              <MaterialCommunityIcons
                name={focused ? 'school' : 'school-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Clock"
          component={ClockStack}
          options={{
            tabBarIcon: ({focused, color}) => (
              <MaterialCommunityIcons
                name={focused ? 'timer' : 'timer-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Settings"
          component={SettingsStack}
          options={{
            tabBarIcon: ({focused, color}) => (
              <MaterialCommunityIcons
                name={focused ? 'cog' : 'cog-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tabs.Navigator>
    </View>
  );
};

export default BottomTabs; 