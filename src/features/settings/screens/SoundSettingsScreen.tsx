import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { ScreenWrapper } from '../../../shared/components/ScreenWrapper';
import { useTheme } from '../../../shared/theme/ThemeContext';
import Slider from '@react-native-community/slider';

const SoundSettingsScreen = () => {
  const { theme } = useTheme();
  const [moveSound, setMoveSound] = useState(true);
  const [notificationSound, setNotificationSound] = useState(true);
  const [volume, setVolume] = useState(0.8);

  const settings = [
    {
      title: 'Piece Movement Sound',
      description: 'Play sound when moving pieces',
      value: moveSound,
      onValueChange: setMoveSound,
    },
    {
      title: 'Notification Sound',
      description: 'Play sound for notifications',
      value: notificationSound,
      onValueChange: setNotificationSound,
    },
  ];

  return (
    <ScreenWrapper title="Sound">
      <View style={styles.container}>
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

        {/* <View style={[styles.volumeContainer, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.volumeTitle, { color: theme.colors.text, fontFamily: 'CormorantGaramond-Medium' }]}>
            Volume
          </Text>
          <Slider
            style={styles.slider}
            value={volume}
            onValueChange={setVolume}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.primary}
          />
          <Text style={[styles.volumeValue, { color: theme.colors.text, fontFamily: 'Roboto-Regular' }]}>
            {Math.round(volume * 100)}%
          </Text>
        </View> */}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  volumeContainer: {
    padding: 16,
    borderRadius: 12,
  },
  volumeTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  slider: {
    height: 40,
  },
  volumeValue: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default SoundSettingsScreen; 