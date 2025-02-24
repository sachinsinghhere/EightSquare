import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { PlayScreen } from '../../features/play/screens/PlayScreen';
import { useTheme } from '../../shared/theme/ThemeContext';
import SettingsScreen from '../../features/settings/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const { theme } = useTheme();

  return (
      <View style={{flex: 1, backgroundColor: theme.colors.background}}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {backgroundColor: theme.colors.card},
            tabBarLabelStyle: {fontSize: 12, color: theme.colors.text},
          }}>
          <Tab.Screen
            name="Play"
            component={PlayScreen}
            options={{
              tabBarIcon: ({color}) => (
                <Icon name="play" size={20} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Train"
            component={TrainScreen}
            options={{
              tabBarIcon: ({color}) => (
                <Icon name="school" size={20} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Clock"
            component={ClockScreen}
            options={{
              tabBarIcon: ({color}) => (
                <Icon name="timer" size={20} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarIcon: ({color}) => (
                <Icon name="settings" size={20} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
  );
};



const TrainScreen = () => <View><Text>Train Screen</Text></View>;
const ClockScreen = () => <View><Text>Clock Screen</Text></View>;

export default BottomTabs; 