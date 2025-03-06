import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform, ScrollView, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ScreenWrapper } from '../../../shared/components/ScreenWrapper';
import { useTheme } from '../../../shared/theme/ThemeContext';
import NotificationService, { NotificationPreferences } from '../../../shared/services/NotificationService';
import { TextInput } from 'react-native-gesture-handler';

const NotificationsScreen = () => {
  const { theme } = useTheme();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    dailyReminder: true,
    dailyReminderTime: '11:00',
    puzzleNotifications: false,
    gameInvites: false,
    achievements: false,
    customMessage: 'Time to improve your chess skills!',
    masterToggle: true,
  });
  const [originalPreferences, setOriginalPreferences] = useState<NotificationPreferences | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      const notificationService = NotificationService.getInstance();
      await notificationService.requestPermissions();
      const savedPreferences = await notificationService.getPreferences();
      setPreferences(savedPreferences);
      setOriginalPreferences(savedPreferences);
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean | string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      handlePreferenceChange('dailyReminderTime', timeString);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const period = parseInt(hours) >= 12 ? 'PM' : 'AM';
    const hour12 = parseInt(hours) % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  const hasChanges = () => {
    if (!originalPreferences) return false;
    return JSON.stringify(preferences) !== JSON.stringify(originalPreferences);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const notificationService = NotificationService.getInstance();
      await notificationService.updatePreferences(preferences);
      setOriginalPreferences(preferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper title="Daily Training">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper title="Daily Training">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.settingItem, { backgroundColor: theme.colors.card }]}>
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.colors.text, fontFamily: 'CormorantGaramond-Medium' }]}>
                Daily Training Reminder
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.text, fontFamily: 'Roboto-Regular' }]}>
                Get a daily reminder to practice chess
              </Text>
            </View>
            <Switch
              value={preferences.dailyReminder}
              onValueChange={(value) => handlePreferenceChange('dailyReminder', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            />
          </View>

          {preferences.dailyReminder && (
            <View style={[styles.settingItem, { backgroundColor: theme.colors.card }]}>
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: theme.colors.text, fontFamily: 'CormorantGaramond-Medium' }]}>
                  Reminder Settings
                </Text>
                
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={[styles.timeText, { color: theme.colors.primary }]}>
                    {formatTime(preferences.dailyReminderTime)}
                  </Text>
                </TouchableOpacity>

                <TextInput
                  style={[styles.input, { color: theme.colors.text, fontFamily: 'Roboto-Regular' }]}
                  value={preferences.customMessage}
                  onChangeText={(text) => handlePreferenceChange('customMessage', text)}
                  placeholder="Enter your motivational message"
                  placeholderTextColor={theme.colors.text + '80'}
                  multiline
                  maxLength={100}
                />
              </View>
            </View>
          )}

          <Text style={[styles.note, { color: theme.colors.text, fontFamily: 'Roboto-Regular' }]}>
            You'll receive a notification at {formatTime(preferences.dailyReminderTime)} every day to help maintain your training routine.
          </Text>

          {hasChanges() && (
            <TouchableOpacity
              style={[
                styles.saveButton,
                {
                  backgroundColor: theme.colors.primary,
                  opacity: isSaving ? 0.7 : 1,
                },
              ]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          )}
        </ScrollView>

        {showTimePicker && Platform.OS === 'ios' && (
          <View style={[styles.timePickerContainer, { backgroundColor: theme.colors.card }]}>
            <DateTimePicker
              value={(() => {
                const [hours, minutes] = preferences.dailyReminderTime.split(':');
                const date = new Date();
                date.setHours(parseInt(hours, 10));
                date.setMinutes(parseInt(minutes, 10));
                return date;
              })()}
              mode="time"
              is24Hour={false}
              display="spinner"
              onChange={handleTimeChange}
            />
            <TouchableOpacity
              style={[styles.doneButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setShowTimePicker(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}

        {showTimePicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={(() => {
              const [hours, minutes] = preferences.dailyReminderTime.split(':');
              const date = new Date();
              date.setHours(parseInt(hours, 10));
              date.setMinutes(parseInt(minutes, 10));
              return date;
            })()}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 32, // Extra padding for iOS time picker
  },
  settingItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 16,
  },
  timeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 20,
    fontFamily: 'CormorantGaramond-Bold',
  },
  input: {
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  note: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 20,
  },
  saveButton: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'CormorantGaramond-Bold',
  },
  timePickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  doneButton: {
    padding: 16,
    alignItems: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'CormorantGaramond-Bold',
  },
});

export default NotificationsScreen; 