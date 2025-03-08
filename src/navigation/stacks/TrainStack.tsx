import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TrainStackParamList} from '../types';
import {useTheme} from '../../shared/theme/ThemeContext';
import {getStackScreenOptions} from '../constants';
import TrainingModules from '../../features/train/screens/TrainingModuleScreen';
import PuzzleCategoriesScreen from '../../features/train/screens/PuzzleCategoriesScreen';
import PuzzleSolverScreen from '../../features/train/screens/PuzzleSolverScreen';
import VisionTrainingScreen from '../../features/train/screens/VisionTrainingScreen';
import BlindChessScreen from '../../features/train/screens/BlindChessScreen';
import ChessTitlesScreen from '../../features/train/screens/ChessTitles';
import PieceMovementScreen from '../../features/train/screens/PieceMovementScreen';
import SquareRecognitionScreen from '../../features/train/screens/SquareRecognitionScreen';
import {ScreenWrapper} from '../../shared/components/ScreenWrapper';

const Stack = createNativeStackNavigator<TrainStackParamList>();

const WrappedTrainingModules = () => <TrainingModules />;

const WrappedPuzzleCategories = () => <PuzzleCategoriesScreen />;

const WrappedPuzzleSolver = () => <PuzzleSolverScreen />;

const WrappedVisionTraining = () => <VisionTrainingScreen />;

const WrappedBlindChess = () => (
  <ScreenWrapper title="Blind Chess">
    <BlindChessScreen />
  </ScreenWrapper>
);

const WrappedChessTitles = () => (
  <ScreenWrapper title="Chess Titles">
    <ChessTitlesScreen />
  </ScreenWrapper>
);

const WrappedPieceMovement = () => <PieceMovementScreen />;

const WrappedSquareRecognition = () => <SquareRecognitionScreen />;

export const TrainStack = () => {
  const {theme} = useTheme();

  return (
    <Stack.Navigator screenOptions={getStackScreenOptions(theme)}>
      <Stack.Screen name="TrainingModules" component={WrappedTrainingModules} />
      <Stack.Screen
        name="PuzzleCategories"
        component={WrappedPuzzleCategories}
      />
      <Stack.Screen name="PuzzleSolver" component={WrappedPuzzleSolver} />
      <Stack.Screen name="VisionTraining" component={WrappedVisionTraining} />
      <Stack.Screen name="BlindChess" component={WrappedBlindChess} />
      <Stack.Screen name="ChessTitles" component={WrappedChessTitles} />
      <Stack.Screen name="PieceMovement" component={WrappedPieceMovement} />
      <Stack.Screen
        name="SquareRecognition"
        component={WrappedSquareRecognition}
      />
    </Stack.Navigator>
  );
};
