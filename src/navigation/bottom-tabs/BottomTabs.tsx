/**
 * Bottom tab navigation component
 * Defines the main tabs for the application: Play, Train, Clock, and Settings
 */
import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlayScreen } from '../../features/play/screens/PlayScreen';
import { useTheme } from '../../shared/theme/ThemeContext';
import Icon from '../../shared/components/Icon';
import { RootTabParamList } from '../types';
import { getTabNavigatorOptions } from '../constants';
import { ClockStack } from '../stacks/ClockStack';
import { TrainStack } from '../stacks/TrainStack';
import { SettingsStack } from '../stacks/SettingsStack';

const Tab = createBottomTabNavigator<RootTabParamList>();

const BottomTabs = () => {
  const { theme } = useTheme();

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <Tab.Navigator screenOptions={getTabNavigatorOptions(theme)}>
        <Tab.Screen
          name="Play"
          component={PlayScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="chess-king" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Train"
          component={TrainStack}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="sword" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Clock"
          component={ClockStack}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="timer" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsStack}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="cog" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default BottomTabs; 