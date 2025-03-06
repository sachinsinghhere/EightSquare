import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
  Event,
  Notification,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationService from './NavigationService';

export interface NotificationPreferences {
  dailyReminder: boolean;
  dailyReminderTime: string; // HH:mm format
  puzzleNotifications: boolean;
  gameInvites: boolean;
  achievements: boolean;
  customMessage: string;
  masterToggle: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  dailyReminder: true,
  dailyReminderTime: '11:00',
  puzzleNotifications: false,
  gameInvites: false,
  achievements: false,
  customMessage: 'Time to improve your chess skills!',
  masterToggle: true,
};

const CHANNEL_ID = 'chess_training';
const PREFERENCES_KEY = 'notification_preferences';
const DAILY_REMINDER_ID = 'daily_reminder';

class NotificationService {
  private static instance: NotificationService;
  private preferences: NotificationPreferences = DEFAULT_PREFERENCES;
  private navigationService: NavigationService;
  private isInitializing: boolean = true;

  private constructor() {
    this.navigationService = NavigationService.getInstance();
    this.initialize();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async initialize() {
    try {
      // Load saved preferences first
      await this.loadPreferences();
      
      // Create notification channel
      await this.createDefaultChannel();
      
      // Set up notification listeners
      this.setupNotificationListeners();

      // Schedule notifications based on saved preferences
      if (this.preferences.dailyReminder) {
        await this.scheduleDailyReminder();
      }

      this.isInitializing = false;
    } catch (error) {
      console.error('Error initializing notification service:', error);
      this.isInitializing = false;
    }
  }

  private async createDefaultChannel() {
    await notifee.createChannel({
      id: CHANNEL_ID,
      name: 'Chess Training',
      lights: true,
      vibration: true,
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      // Add these for better kill state handling
      allowBubbles: true,
      bypassDnd: true,
      enableVibration: true,
      enableLights: true,
    });
  }

  private async loadPreferences() {
    try {
      const savedPrefs = await AsyncStorage.getItem(PREFERENCES_KEY);
      if (savedPrefs) {
        const parsedPrefs = JSON.parse(savedPrefs);
        // Only update with saved preferences, keeping defaults for any missing values
        this.preferences = {
          ...DEFAULT_PREFERENCES,
          ...parsedPrefs,
        };
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
      // Keep default preferences on error
    }
  }

  private setupNotificationListeners() {
    notifee.onForegroundEvent((event: Event) => {
      if (event.type === EventType.PRESS) {
        this.handleNotificationPress(event.detail.notification);
      }
    });

    notifee.onBackgroundEvent(async (event: Event) => {
      if (event.type === EventType.PRESS) {
        return this.handleNotificationPress(event.detail.notification);
      }
    });

    // Handle kill state by requesting permissions on app launch
    notifee.requestPermission({
      alert: true,
      badge: true,
      sound: true,
      criticalAlert: true,
      provisional: true,
    });
  }

  private async handleNotificationPress(notification: Notification) {
    if (notification?.data?.screen) {
      const { screen, params } = notification.data;
      this.navigationService.reset('BottomTabs', {
        screen,
        params,
      });
    }
  }

  public async updatePreferences(newPreferences: Partial<NotificationPreferences>) {
    const oldPreferences = { ...this.preferences };
    this.preferences = { ...this.preferences, ...newPreferences };
    
    try {
      // Save to storage first
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(this.preferences));
      
      // Only reschedule notifications if relevant preferences have changed
      // and we're not in the initialization phase
      if (!this.isInitializing) {
        const shouldReschedule = 
          oldPreferences.dailyReminder !== this.preferences.dailyReminder ||
          oldPreferences.dailyReminderTime !== this.preferences.dailyReminderTime ||
          oldPreferences.customMessage !== this.preferences.customMessage;

        if (shouldReschedule) {
          // Cancel existing notifications before scheduling new ones
          await this.cancelAllNotifications();
          if (this.preferences.dailyReminder) {
            await this.scheduleDailyReminder();
          }
        }
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      // Revert preferences on error
      this.preferences = oldPreferences;
      throw error;
    }
  }

  public async getPreferences(): Promise<NotificationPreferences> {
    // Ensure we have the latest preferences
    await this.loadPreferences();
    return this.preferences;
  }

  public async scheduleDailyReminder() {
    if (!this.preferences.dailyReminder) {
      return;
    }

    try {
      // Cancel any existing daily reminders
      await notifee.cancelTriggerNotifications();

      const [hours, minutes] = this.preferences.dailyReminderTime.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      date.setSeconds(0);
      date.setMilliseconds(0);

      // If time has passed for today, schedule for tomorrow
      if (date.getTime() < Date.now()) {
        date.setDate(date.getDate() + 1);
      }

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(),
        repeatFrequency: RepeatFrequency.DAILY,
        alarmManager: true, // Use Android's AlarmManager for better kill state handling
      };

      await notifee.createTriggerNotification(
        {
          id: DAILY_REMINDER_ID,
          title: 'Daily Chess Training',
          body: this.preferences.customMessage,
          android: {
            channelId: CHANNEL_ID,
            pressAction: {
              id: 'default',
            },
            importance: AndroidImportance.HIGH,
            // Add these for better kill state handling
            showTimestamp: true,
            wakeLockTimeout: 3000, // Wake device for 3 seconds
            autoCancel: false,
          },
          ios: {
            categoryId: 'reminder',
            critical: true,
            sound: 'default',
            interruptionLevel: 'timeSensitive',
          },
          data: {
            screen: 'Train',
            params: {
              screen: 'TrainingModules',
            },
          },
        },
        trigger,
      );
    } catch (error) {
      console.error('Error scheduling daily reminder:', error);
      throw error;
    }
  }

  public async scheduleNewPuzzleNotification() {
    if (!this.preferences.masterToggle || !this.preferences.puzzleNotifications) {
      return;
    }

    await notifee.createTriggerNotification(
      {
        title: 'New Chess Puzzles Available',
        body: 'Challenge yourself with new puzzles!',
        android: {
          channelId: CHANNEL_ID,
          pressAction: {
            id: 'default',
          },
        },
        data: {
          screen: 'Train',
          params: {
            screen: 'PuzzleCategories',
          },
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
        repeatFrequency: RepeatFrequency.DAILY,
      },
    );
  }

  public async displayAchievementNotification(achievement: string) {
    if (!this.preferences.masterToggle || !this.preferences.achievements) {
      return;
    }

    await notifee.displayNotification({
      title: 'New Achievement!',
      body: `Congratulations! You've earned: ${achievement}`,
      android: {
        channelId: CHANNEL_ID,
        pressAction: {
          id: 'default',
        },
      },
      data: {
        screen: 'Settings',
        params: {
          screen: 'Achievements',
        },
      },
    });
  }

  public async displayGameInviteNotification(opponent: string) {
    if (!this.preferences.masterToggle || !this.preferences.gameInvites) {
      return;
    }

    await notifee.displayNotification({
      title: 'New Game Invite',
      body: `${opponent} has invited you to play a game!`,
      android: {
        channelId: CHANNEL_ID,
        pressAction: {
          id: 'default',
        },
      },
      data: {
        screen: 'Play',
      },
    });
  }

  private async cancelAllNotifications() {
    await notifee.cancelAllNotifications();
    await notifee.cancelTriggerNotifications();
  }

  public async requestPermissions() {
    return notifee.requestPermission({
      alert: true,
      badge: true,
      sound: true,
      criticalAlert: true,
      provisional: true,
    });
  }
}

export default NotificationService; 