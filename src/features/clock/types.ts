export type TimeUnit = 'minutes' | 'hours';

export interface TimeControl {
  name: string;
  minutes: number;
  increment: number;
  icon: string;
  description: string;
}

export interface ClockState {
  isRunning: boolean;
  activePlayer: 'top' | 'bottom';
  topTime: number;
  bottomTime: number;
  increment: number;
} 