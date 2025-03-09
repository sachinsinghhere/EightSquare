import { NavigatorScreenParams } from '@react-navigation/native';

export type TrainStackParamList = {
  TrainingModules: undefined;
  PuzzleCategories: undefined;
  PuzzleSolver: {
    filter: {
      type: string;
      tag?: string;
      includeSolved?: boolean;
    };
  };
  VisionTraining: undefined;
  BlindChess: undefined;
  ChessTitles: undefined;
  PieceMovement: undefined;
  SquareRecognition: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
  ThemeSelection: undefined;
  Sound: undefined;
  Notifications: undefined;
  Language: undefined;
  About: undefined;
};

export type ClockStackParamList = {
  Clocks: undefined;
};

export type RootTabParamList = {
  Play: undefined;
  Train: NavigatorScreenParams<TrainStackParamList>;
  Clock: NavigatorScreenParams<ClockStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

export type RootStackParamList = {
  BottomTabs: NavigatorScreenParams<RootTabParamList>;
  ChessTimer: {
    minutes: number;
    increment: number;
  };
}; 