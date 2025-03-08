import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {textStyles} from '../../../shared/theme/typography';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TrainStackParamList} from '../../../navigation/types';
import Animated, {FadeInDown} from 'react-native-reanimated';
import { ScreenWrapper } from '../../../shared/components/ScreenWrapper';

type PuzzleCategoriesNavigationProp = NativeStackNavigationProp<TrainStackParamList>;

const categories = [
  {
    title: 'By Opening',
    description: 'Practice puzzles from specific chess openings',
    emoji: '♟️',
    filter: {type: 'opening'},
  },
  {
    title: 'By Difficulty',
    description: 'Choose puzzles based on rating level',
    emoji: '📊',
    filter: {type: 'difficulty'},
  },
  {
    title: 'By Tactical Theme',
    description: 'Practice specific tactical motifs',
    emoji: '⚔️',
    filter: {type: 'theme'},
  },
  {
    title: 'Random Challenge',
    description: 'Get a random puzzle to solve',
    emoji: '🎲',
    filter: {type: 'random'},
  },
] as const;

const PuzzleCategoriesScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<PuzzleCategoriesNavigationProp>();

  const handleCategorySelect = (filter: {type: string}) => {
    navigation.navigate('PuzzleSolver', {filter});
  };

  return (
  <ScreenWrapper title="Categories">

    <View style={[styles.container]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {categories.map((category, index) => (
            <Animated.View
              key={category.title}
              entering={FadeInDown.delay(index * 100).springify()}>
              <TouchableOpacity
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => handleCategorySelect(category.filter)}>
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <View style={styles.categoryInfo}>
                  <Text
                    style={[
                      textStyles.h4,
                      {color: theme.colors.text},
                    ]}>
                    {category.title}
                  </Text>
                  <Text
                    style={[
                      textStyles.bodyMedium,
                      styles.categoryDescription,
                      {color: theme.colors.text},
                    ]}>
                    {category.description}
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
  categoryCard: {
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
  categoryEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryDescription: {
    marginTop: 4,
    opacity: 0.8,
  },
});

export default PuzzleCategoriesScreen; 