import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {textStyles} from '../../../shared/theme/typography';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {
  database,
  syncPuzzlesToLocal,
  loadMorePuzzles,
} from '../../../shared/services/database';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TrainStackParamList } from '../../../navigation/types';
import Puzzle from '../../../shared/services/database/models/puzzle';

interface PuzzleItemProps {
  puzzle: Puzzle;
  onPress: (puzzle: Puzzle) => void;
}

const PuzzleItem: React.FC<PuzzleItemProps> = ({puzzle, onPress}) => {
  const {theme} = useTheme();
  return (
    <Animated.View entering={FadeInDown.springify()}>
      <TouchableOpacity
        style={[
          styles.puzzleCard,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={() => onPress(puzzle)}>
        <View style={styles.puzzleInfo}>
          <Text style={[textStyles.h4, {color: theme.colors.text}]}>
            Puzzle #{puzzle.puzzleId}
          </Text>
          <Text
            style={[
              textStyles.bodyMedium,
              {color: theme.colors.text, opacity: 0.8},
            ]}>
            Rating: {puzzle.rating}
          </Text>
          <View style={styles.tagsContainer}>
            {puzzle.themesList.slice(0, 3).map((themeTag, index) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  {backgroundColor: theme.colors.surfaceVariant},
                ]}>
                <Text
                  style={[
                    textStyles.caption,
                    {color: theme.colors.text},
                  ]}>
                  {themeTag}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface EnhancedPuzzleListProps {
  puzzles?: Puzzle[];
  loading: boolean;
  onLoadMore: () => void;
  onPuzzlePress: (puzzle: Puzzle) => void;
}

const PuzzleList: React.FC<EnhancedPuzzleListProps> = ({
  puzzles,
  loading,
  onLoadMore,
  onPuzzlePress,
}) => {
  const {theme} = useTheme();

  if (!puzzles) {
    return (
      <View style={styles.centerContainer}>
        <Text style={[textStyles.bodyLarge, {color: theme.colors.text}]}>
          Loading puzzles...
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={puzzles}
      keyExtractor={item => item.puzzleId}
      renderItem={({item}) => (
        <PuzzleItem puzzle={item} onPress={onPuzzlePress} />
      )}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      contentContainerStyle={styles.listContent}
      ListFooterComponent={
        loading ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={styles.loader}
          />
        ) : null
      }
      ListEmptyComponent={
        <View style={styles.centerContainer}>
          <Text style={[textStyles.bodyLarge, {color: theme.colors.text}]}>
            No puzzles found
          </Text>
        </View>
      }
    />
  );
};

const EnhancedPuzzleList = withObservables(
  ['ratingFilter', 'themeFilter'],
  ({
    database,
    ratingFilter,
    themeFilter,
  }: {
    database: any;
    ratingFilter: number;
    themeFilter: string;
  }) => {
    if (!database) return {};

    return {
      puzzles: database
        .get('puzzles')
        .query(
          Q.where('rating', Q.lte(ratingFilter || 3000)),
          themeFilter
            ? Q.where('themes', Q.like(`%${themeFilter}%`))
            : Q.where('puzzle_id', Q.notEq(null)),
        )
        .observe(),
    };
  },
)(PuzzleList);

const PuzzlesScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<TrainStackParamList>>();
  const [offset, setOffset] = useState<number>(1000);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [ratingFilter, setRatingFilter] = useState<number>(2000);
  const [themeFilter, setThemeFilter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        setLoading(true);
        await syncPuzzlesToLocal();
        setInitialLoad(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize database');
        console.error('Database initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (initialLoad) {
      initDatabase();
    }
  }, [initialLoad]);

  const handleLoadMore = async () => {
    if (!loading) {
      setLoading(true);
      const count = await loadMorePuzzles(offset, 1000);
      if (count > 0) {
        setOffset(offset + count);
      }
      setLoading(false);
    }
  };

  const handlePuzzlePress = (puzzle: Puzzle) => {
    navigation.navigate('PuzzleSolver', { puzzle });
  };

  const filters = [
    {
      title: 'Easy',
      rating: 1500,
      emoji: '🟢',
    },
    {
      title: 'Medium',
      rating: 2000,
      emoji: '🟡',
    },
    {
      title: 'Hard',
      rating: 2500,
      emoji: '🔴',
    },
  ];

  const themes = [
    {title: 'Tactical', filter: 'tactical', emoji: '⚔️'},
    {title: 'Endgame', filter: 'endgame', emoji: '♟️'},
    {title: 'All', filter: '', emoji: '🎯'},
  ];

  if (error) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={styles.centerContainer}>
          <Text style={[textStyles.bodyLarge, {color: theme.colors.text}]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[
              styles.retryButton,
              {backgroundColor: theme.colors.primary},
            ]}
            onPress={() => setInitialLoad(true)}>
            <Text style={[textStyles.button, {color: theme.colors.card}]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.title}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    ratingFilter === filter.rating
                      ? theme.colors.primary
                      : theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setRatingFilter(filter.rating)}>
              <Text style={styles.filterEmoji}>{filter.emoji}</Text>
              <Text
                style={[
                  textStyles.button,
                  {
                    color:
                      ratingFilter === filter.rating
                        ? theme.colors.card
                        : theme.colors.text,
                  },
                ]}>
                {filter.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}>
          {themes.map(item => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    themeFilter === item.filter
                      ? theme.colors.primary
                      : theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setThemeFilter(item.filter)}>
              <Text style={styles.filterEmoji}>{item.emoji}</Text>
              <Text
                style={[
                  textStyles.button,
                  {
                    color:
                      themeFilter === item.filter
                        ? theme.colors.card
                        : theme.colors.text,
                  },
                ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <EnhancedPuzzleList
        database={database}
        ratingFilter={ratingFilter}
        themeFilter={themeFilter}
        loading={loading}
        onLoadMore={handleLoadMore}
        onPuzzlePress={handlePuzzlePress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    paddingVertical: 8,
  },
  filtersScroll: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  listContent: {
    padding: 16,
  },
  puzzleCard: {
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  puzzleInfo: {
    padding: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  loader: {
    marginVertical: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
});

export default PuzzlesScreen;
