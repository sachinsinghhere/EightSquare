import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {textStyles} from '../../../shared/theme/typography';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomHeader from '../../../shared/components/CustomHeader';
import Animated, {FadeInDown} from 'react-native-reanimated';
import { ScreenWrapper } from '../../../shared/components/ScreenWrapper';

export type TrainingStackParamList = {
  TrainingModules: undefined;
  PuzzleCategories: undefined;
  Puzzles: {filter: {type: string}};
  VisionTraining: undefined;
  BlindChess: undefined;
  ChessTitles: undefined;
};

type TrainingNavigationProp = NativeStackNavigationProp<TrainingStackParamList>;

const trainingModules = [
  {
    title: 'Puzzles',
    description: 'Solve chess puzzles based on openings, difficulty, or tactical themes',
    emoji: '🧩',
    screen: 'PuzzleCategories' as const,
  },
  {
    title: 'Vision Training',
    description: 'Practice piece movement and square recognition',
    emoji: '👁️',
    screen: 'VisionTraining' as const,
  },
  {
    title: 'Blind Chess',
    description: 'Practice playing chess without seeing the pieces',
    emoji: '🎯',
    screen: 'BlindChess' as const,
  },
  {
    title: 'Chess Titles',
    description: 'Learn about chess titles and their requirements',
    emoji: '👑',
    screen: 'ChessTitles' as const,
  },
] as const;

const TrainingModules = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<TrainingNavigationProp>();

  return (
    <ScreenWrapper title="Training" showBack={false}>
      <View
        style={[styles.container]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {trainingModules.map((module, index) => (
              <Animated.View
                key={module.title}
                entering={FadeInDown.delay(index * 100).springify()}>
                <TouchableOpacity
                  style={[
                    styles.moduleCard,
                    {
                      backgroundColor: theme.colors.card,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  onPress={() => navigation.navigate(module.screen)}>
                  <Text style={styles.moduleEmoji}>{module.emoji}</Text>
                  <View style={styles.moduleInfo}>
                    <Text style={[textStyles.h4, {color: theme.colors.text}]}>
                      {module.title}
                    </Text>
                    <Text
                      style={[
                        textStyles.bodyMedium,
                        styles.moduleDescription,
                        {color: theme.colors.text},
                      ]}>
                      {module.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  moduleCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  moduleEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleDescription: {
    marginTop: 4,
    opacity: 0.8,
  },
});

export default TrainingModules;