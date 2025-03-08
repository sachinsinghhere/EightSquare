import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlayScreen2 from '../../features/play/screens/PlayScreen2';
import {AIPersonaScreen} from '../../features/play/screens/AIPersonaScreen';
import PlayOptionsScreen from '../../features/play/screens/PlayOptionsScreen';
import ChessClockSelection from '../../features/clock/screens/ChessClockSelection';
import GameScreen from '../../features/play/screens/GameScreen';

export type PlayStackParamList = {
  PlayOptions: undefined;
  AIPersona: undefined;
  ChooseTimer: undefined;
  Game: {
    minutes: number;
    increment: number;
  };
  Play: {
    selectedPersona: {
      id: string;
      name: string;
      rating: number;
      level: number;
      image: any;
      description: string;
      personality: {
        style: string;
        strength: string;
        weakness: string;
      };
      commentary: {
        opening: string[];
        middlegame: string[];
        endgame: string[];
        winning: string[];
        losing: string[];
        draw: string[];
      };
      prompts: {
        moveAnalysis: string;
        gameStrategy: string;
        personalityTraits: string;
      };
    };
  };
};

const Stack = createNativeStackNavigator<PlayStackParamList>();

export const PlayStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="PlayOptions"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="PlayOptions" component={PlayOptionsScreen} />
      <Stack.Screen name="AIPersona" component={AIPersonaScreen} />
      <Stack.Screen name="ChooseTimer" component={ChessClockSelection} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="Play" component={PlayScreen2} />
    </Stack.Navigator>
  );
}; 