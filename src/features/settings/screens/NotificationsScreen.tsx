import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { ScreenWrapper } from '../../../shared/components/ScreenWrapper';
import { useTheme } from '../../../shared/theme/ThemeContext';

const NotificationsScreen = () => {
  const { theme } = useTheme();
  const [dailyReminder, setDailyReminder] = useState(true);
  const [puzzleNotifications, setPuzzleNotifications] = useState(true);
  const [gameInvites, setGameInvites] = useState(true);
  const [achievements, setAchievements] = useState(true);

  const settings = [
    {
      title: 'Daily Training Reminder',
      description: 'Receive daily reminders to practice',
      value: dailyReminder,
      onValueChange: setDailyReminder,
    },
    {
      title: 'New Puzzles',
      description: 'Get notified about new puzzles',
      value: puzzleNotifications,
      onValueChange: setPuzzleNotifications,
    },
    {
      title: 'Game Invites',
      description: 'Receive game invitations',
      value: gameInvites,
      onValueChange: setGameInvites,
    },
    {
      title: 'Achievements',
      description: 'Get notified about new achievements',
      value: achievements,
      onValueChange: setAchievements,
    },
  ];

  return (
    <ScreenWrapper title="Notifications">
      <View style={styles.container}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: 'CormorantGaramond-Bold' }]}>
          Push Notifications
        </Text>
        
        {settings.map((setting, index) => (
          <View
            key={index}
            style={[styles.settingItem, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.colors.text, fontFamily: 'CormorantGaramond-Medium' }]}>
                {setting.title}
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.text, fontFamily: 'Roboto-Regular' }]}>
                {setting.description}
              </Text>
            </View>
            <Switch
              value={setting.value}
              onValueChange={setting.onValueChange}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            />
          </View>
        ))}

        <Text style={[styles.note, { color: theme.colors.text, fontFamily: 'Roboto-Regular' }]}>
          You can change these settings anytime. Make sure notifications are enabled in your device settings.
        </Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  settingText: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    opacity: 0.8,
  },
  note: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default NotificationsScreen; 