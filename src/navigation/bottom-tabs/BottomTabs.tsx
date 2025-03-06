/**
 * Bottom tab navigation component
 * Defines the main tabs for the application: Play, Train, Clock, and Settings
 */
import React from 'react';
import { View } from 'react-native';
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../shared/theme/ThemeContext';
import { RootTabParamList } from '../types';
import { PlayStack } from '../stacks/PlayStack';
import { ClockStack } from '../stacks/ClockStack';
import { TrainStack } from '../stacks/TrainStack';
import { SettingsStack } from '../stacks/SettingsStack';

const Tabs = AnimatedTabBarNavigator<RootTabParamList>();

const BottomTabs = () => {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Tabs.Navigator
        appearance={{
          floating: false,
          tabBarBackground: theme.colors.card,
          shadow: true,
          dotSize: "small",
          tabButtonLayout: "horizontal",
          activeTabBackgrounds: theme.colors.primary,
          horizontalPadding: 10,
          tabBarHeight: 60,
        }}
        tabBarOptions={{
          activeTintColor: theme.colors.background,
          inactiveTintColor: theme.colors.text,
          activeBackgroundColor: theme.colors.primary,
          labelStyle: {
            fontSize: 12,
            fontFamily: 'Roboto-Medium',
          },
        }}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="Play"
          component={PlayStack}
          options={{
            tabBarIcon: ({ focused, color }) => {
              return focused 
                ? <Icon name="chess-queen" size={24} color={color} />
                : <Icon name="chess-queen-outline" size={24} color={color} />;
            },
          }}
        />
        <Tabs.Screen
          name="Train"
          component={TrainStack}
          options={{
            tabBarIcon: ({ focused, color }) => {
              return focused 
                ? <Icon name="school" size={24} color={color} />
                : <Icon name="school-outline" size={24} color={color} />;
            },
          }}
        />
        <Tabs.Screen
          name="Clock"
          component={ClockStack}
          options={{
            tabBarIcon: ({ focused, color }) => {
              return focused 
                ? <Icon name="timer" size={24} color={color} />
                : <Icon name="timer-outline" size={24} color={color} />;
            },
          }}
        />
        <Tabs.Screen
          name="Settings"
          component={SettingsStack}
          options={{
            tabBarIcon: ({ focused, color }) => {
              return focused 
                ? <Icon name="cog" size={24} color={color} />
                : <Icon name="cog-outline" size={24} color={color} />;
            },
          }}
        />
      </Tabs.Navigator>
    </View>
  );
};

export default BottomTabs; 