declare module '@notifee/react-native' {
  export interface Notification {
    id?: string;
    title?: string;
    body?: string;
    data?: {
      [key: string]: any;
    };
    android?: AndroidNotification;
    ios?: IOSNotification;
  }

  export interface Event {
    type: EventType;
    detail: {
      notification: Notification;
    };
  }

  export interface AndroidNotification {
    channelId: string;
    pressAction?: {
      id: string;
    };
    importance?: AndroidImportance;
  }

  export interface IOSNotification {
    categoryId?: string;
    critical?: boolean;
  }

  export enum EventType {
    DELIVERED = 3,
    PRESS = 1,
    DISMISSED = 2,
    TRIGGER_NOTIFICATION_CREATED = 7,
  }

  export enum AndroidImportance {
    DEFAULT = 3,
    HIGH = 4,
    LOW = 2,
    MIN = 1,
    NONE = 0,
  }

  export enum AndroidVisibility {
    PRIVATE = 0,
    PUBLIC = 1,
    SECRET = -1,
  }

  export enum RepeatFrequency {
    NONE = 0,
    HOURLY = 1,
    DAILY = 2,
    WEEKLY = 3,
  }

  export enum TriggerType {
    TIMESTAMP = 0,
    INTERVAL = 1,
  }

  export interface TimestampTrigger {
    type: TriggerType.TIMESTAMP;
    timestamp: number;
    repeatFrequency?: RepeatFrequency;
  }

  export interface Channel {
    id: string;
    name: string;
    lights?: boolean;
    vibration?: boolean;
    importance?: AndroidImportance;
    visibility?: AndroidVisibility;
  }

  export function createChannel(channel: Channel): Promise<void>;
  export function displayNotification(notification: Notification): Promise<void>;
  export function createTriggerNotification(
    notification: Notification,
    trigger: TimestampTrigger,
  ): Promise<void>;
  export function cancelAllNotifications(): Promise<void>;
  export function cancelTriggerNotifications(): Promise<void>;
  export function requestPermission(): Promise<void>;
  export function onForegroundEvent(callback: (event: Event) => void): void;
  export function onBackgroundEvent(callback: (event: Event) => Promise<void>): void;

  export default {
    createChannel,
    displayNotification,
    createTriggerNotification,
    cancelAllNotifications,
    cancelTriggerNotifications,
    requestPermission,
    onForegroundEvent,
    onBackgroundEvent,
    EventType,
    AndroidImportance,
    AndroidVisibility,
    RepeatFrequency,
    TriggerType,
  };
} 