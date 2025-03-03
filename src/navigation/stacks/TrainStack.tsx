import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TrainStackParamList } from '../types';
import { useTheme } from '../../shared/theme/ThemeContext';
import { getStackScreenOptions } from '../constants';
import TrainingModules from '../../features/train/screens/TrainingModuleScreen';
import PuzzleCategoriesScreen from '../../features/train/screens/PuzzleCategoriesScreen';
import PuzzleSolverScreen from '../../features/train/screens/PuzzleSolverScreen';
import VisionTrainingScreen from '../../features/train/screens/VisionTrainingScreen';
import BlindChessScreen from '../../features/train/screens/BlindChessScreen';
import { ScreenWrapper } from '../../shared/components/ScreenWrapper';

const Stack = createNativeStackNavigator<TrainStackParamList>();

const WrappedTrainingModules = () => (
  <ScreenWrapper title="Training" showBack={false}>
    <TrainingModules />
  </ScreenWrapper>
);

const WrappedPuzzleCategories = () => (
  <ScreenWrapper title="Categories">
    <PuzzleCategoriesScreen />
  </ScreenWrapper>
);

const WrappedPuzzleSolver = () => (
  <ScreenWrapper title="Solve Puzzles">
    <PuzzleSolverScreen />
  </ScreenWrapper>
);

const WrappedVisionTraining = () => (
  <ScreenWrapper title="Vision Training">
    <VisionTrainingScreen />
  </ScreenWrapper>
);

const WrappedBlindChess = () => (
  <ScreenWrapper title="Blind Chess">
    <BlindChessScreen />
  </ScreenWrapper>
);

export const TrainStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator screenOptions={getStackScreenOptions(theme)}>
      <Stack.Screen
        name="TrainingModules"
        component={WrappedTrainingModules}
      />
      <Stack.Screen
        name="PuzzleCategories"
        component={WrappedPuzzleCategories}
      />
      <Stack.Screen
        name="PuzzleSolver"
        component={WrappedPuzzleSolver}
      />
      <Stack.Screen
        name="VisionTraining"
        component={WrappedVisionTraining}
      />
      <Stack.Screen
        name="BlindChess"
        component={WrappedBlindChess}
      />
    </Stack.Navigator>
  );
}; 