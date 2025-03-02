import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '../../../shared/components/ScreenWrapper';
import { useTheme } from '../../../shared/theme/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface SettingOption {
  title: string;
  description: string;
  icon: string;
  screen: keyof SettingsStackParamList;
}

export type SettingsStackParamList = {
  Settings: undefined;
  ThemeSelection: undefined;
  Sound: undefined;
  Notifications: undefined;
  Language: undefined;
  About: undefined;
};

type SettingsNavigationProp = NativeStackNavigationProp<SettingsStackParamList>;

interface Props {
  navigation: SettingsNavigationProp;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();

  const settingOptions: SettingOption[] = [
    {
      title: 'Theme',
      description: 'Customize app appearance',
      icon: 'palette',
      screen: 'ThemeSelection',
    },
    {
      title: 'Sound',
      description: 'Piece movement and notification sounds',
      icon: 'volume-high',
      screen: 'Sound',
    },
    {
      title: 'Notifications',
      description: 'Manage push notifications',
      icon: 'bell',
      screen: 'Notifications',
    },
    {
      title: 'Language',
      description: 'Change app language',
      icon: 'translate',
      screen: 'Language',
    },
    {
      title: 'About',
      description: 'App information and credits',
      icon: 'information',
      screen: 'About',
    },
  ];

  const renderSettingItem = (option: SettingOption) => (
    <TouchableOpacity
      key={option.title}
      style={[styles.settingItem, { backgroundColor: theme.colors.card }]}
      onPress={() => navigation.navigate(option.screen)}
    >
      <View style={styles.settingContent}>
        <MaterialCommunityIcons name={option.icon} size={24} color={theme.colors.primary} style={styles.icon} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.colors.text, fontFamily: 'CormorantGaramond-Medium' }]}>
            {option.title}
          </Text>
          <Text style={[styles.settingDescription, { color: theme.colors.text, fontFamily: 'Roboto-Regular' }]}>
            {option.description}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.text} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper title="Settings" showBack={false}>
      <ScrollView style={styles.scrollView}>
        {settingOptions.map(renderSettingItem)}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 12,
  },
  settingItem: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  icon: {
    marginRight: 14,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 18,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    opacity: 0.8,
  },
});

export default SettingsScreen;
