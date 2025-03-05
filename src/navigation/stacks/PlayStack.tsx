import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlayScreen2 from '../../features/play/screens/PlayScreen2';
import {AIPersonaScreen} from '../../features/play/screens/AIPersonaScreen';

export type PlayStackParamList = {
  AIPersona: undefined;
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
      initialRouteName="AIPersona"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="AIPersona" component={AIPersonaScreen} />
      <Stack.Screen name="Play" component={PlayScreen2} />
    </Stack.Navigator>
  );
}; 