import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TrainStackParamList} from '../../../navigation/types';
import {database, syncPuzzlesToLocal} from '../../../shared/services/database';
import {Accordion} from '../../../shared/components/Accordion';
import {ScreenWrapper} from '../../../shared/components/ScreenWrapper';
import Puzzle from '../../../shared/services/database/models/puzzle';
import {textStyles} from '../../../shared/theme/typography';

type PuzzleCategoriesNavigationProp = NativeStackNavigationProp<TrainStackParamList>;

interface TagCount {
  label: string;
  count: number;
  solvedCount: number;
}

const PuzzleCategoriesScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<PuzzleCategoriesNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [openingTags, setOpeningTags] = useState<TagCount[]>([]);
  const [themeTags, setThemeTags] = useState<TagCount[]>([]);
  const [categoryStats, setCategoryStats] = useState<{[key: string]: {total: number; solved: number}}>({});

  const fetchTagCounts = useCallback(async () => {
    setLoading(true);
    try {
      // First ensure we have puzzles synced
      const syncResult = await syncPuzzlesToLocal();
      if (!syncResult) {
        console.error('Failed to sync puzzles from Supabase');
        setLoading(false);
        return;
      }
      
      const puzzlesCollection = database.get<Puzzle>('puzzles');
      const puzzles = await puzzlesCollection.query().fetch();
      console.log('Number of puzzles found:', puzzles.length);
      
      // Debug opening tags
      const puzzlesWithOpenings = puzzles.filter(p => p.opening_tags && p.opening_tags !== 'EMPTY');
      console.log('Puzzles with opening tags:', puzzlesWithOpenings.length);
      if (puzzlesWithOpenings.length > 0) {
        console.log('Sample opening tags:', puzzlesWithOpenings.slice(0, 3).map(p => p.opening_tags));
      }
      
      const openingTagsMap = new Map<string, {total: number; solved: number}>();
      const themeTagsMap = new Map<string, {total: number; solved: number}>();
      const stats: {[key: string]: {total: number; solved: number}} = {};

      puzzles.forEach(puzzle => {
        // Process opening tags
        const openingTagsValue = puzzle.opening_tags;
        if (openingTagsValue && openingTagsValue !== 'EMPTY') {
          const openings = openingTagsValue.split(' ');
          openings.forEach(tag => {
            if (tag) {
              const cleanTag = tag.replace(/_/g, ' ');
              const current = openingTagsMap.get(cleanTag) || {total: 0, solved: 0};
              openingTagsMap.set(cleanTag, {
                total: current.total + 1,
                solved: current.solved + (puzzle.solved ? 1 : 0),
              });
            }
          });
        }

        // Process theme tags
        const themes = puzzle.themes?.split(' ') || [];
        themes.forEach(tag => {
          if (tag) {
            const current = themeTagsMap.get(tag) || {total: 0, solved: 0};
            themeTagsMap.set(tag, {
              total: current.total + 1,
              solved: current.solved + (puzzle.solved ? 1 : 0),
            });
          }
        });
      });

      // Debug opening tags map
      console.log('Opening tags found:', Array.from(openingTagsMap.keys()));

      // Update category stats - exclude EMPTY values from counts
      stats.openings = {
        total: puzzles.filter(p => p.opening_tags && p.opening_tags !== 'EMPTY').length,
        solved: puzzles.filter(p => p.opening_tags && p.opening_tags !== 'EMPTY' && p.solved).length,
      };
      stats.themes = {
        total: puzzles.filter(p => p.themes).length,
        solved: puzzles.filter(p => p.themes && p.solved).length,
      };
      setCategoryStats(stats);
      console.log('Category stats:', stats);

      setOpeningTags(
        Array.from(openingTagsMap.entries())
          .map(([label, {total, solved}]) => ({
            label,
            count: total,
            solvedCount: solved,
          }))
          .filter(tag => tag.count > 0)
          .sort((a, b) => b.count - a.count),
      );

      setThemeTags(
        Array.from(themeTagsMap.entries())
          .map(([label, {total, solved}]) => ({
            label,
            count: total,
            solvedCount: solved,
          }))
          .filter(tag => tag.count > 0)
          .sort((a, b) => b.count - a.count),
      );
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTagCounts();
  }, [fetchTagCounts]);

  const handleCategorySelect = (type: string, tag?: string) => {
    const queryTag = type === 'opening' && tag ? tag.replace(/ /g, '_') : tag;
    
    // Check if all puzzles in this category are solved
    const items = type === 'opening' ? openingTags : themeTags;
    const selectedItem = items.find(item => item.label === tag);
    
    if (selectedItem && selectedItem.count === selectedItem.solvedCount) {
      Alert.alert(
        'Category Completed!',
        'You have solved all puzzles in this category. Would you like to retry them or choose a different category?',
        [
          {
            text: 'Retry Category',
            onPress: () => {
              navigation.navigate('PuzzleSolver', {
                filter: {
                  type,
                  tag: queryTag,
                  includeSolved: true,
                },
              });
            },
          },
          {
            text: 'Choose Different',
            style: 'cancel',
          },
        ],
      );
      return;
    }

    navigation.navigate('PuzzleSolver', {
      filter: {
        type,
        tag: queryTag,
        includeSolved: false,
      },
    });
  };

  return (
    <ScreenWrapper title="Categories" loaderVisible={loading}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {openingTags.length > 0 && (
            <Accordion
              title="By Opening"
              description={`Practice puzzles from specific chess openings (${categoryStats.openings?.solved || 0}/${categoryStats.openings?.total || 0} solved)`}
              emoji="♟️"
              items={openingTags}
              onSelectItem={tag => handleCategorySelect('opening', tag)}
            />
          )}

          {themeTags.length > 0 && (
            <Accordion
              title="By Tactical Theme"
              description={`Practice specific tactical motifs (${categoryStats.themes?.solved || 0}/${categoryStats.themes?.total || 0} solved)`}
              emoji="⚔️"
              items={themeTags}
              onSelectItem={tag => handleCategorySelect('theme', tag)}
            />
          )}

          <TouchableOpacity
            style={[
              styles.randomCard,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => handleCategorySelect('random')}>
            <View style={styles.randomContent}>
              <View style={styles.randomLeft}>
                <Text style={styles.emoji}>🎲</Text>
                <View style={styles.cardTextContainer}>
                  <Text style={[textStyles.h4, {color: theme.colors.text}]}>
                    Random Challenge
                  </Text>
                  <Text
                    style={[
                      textStyles.bodyMedium,
                      styles.description,
                      {color: theme.colors.text},
                    ]}>
                    Get a random puzzle to solve
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  randomCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  randomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  randomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 32,
    marginRight: 16,
  },
  description: {
    marginTop: 4,
    opacity: 0.8,
  },
  cardTextContainer: {
    flex: 1,
    marginRight: 16,
  },
});

export default PuzzleCategoriesScreen; 