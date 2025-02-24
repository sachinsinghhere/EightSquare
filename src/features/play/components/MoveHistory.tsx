import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import {useTheme} from '../../../shared/theme/ThemeContext';

interface MoveHistoryProps {
  moves: string[];
  currentMoveIndex: number;
  onMoveSelect: (index: number) => void;
  allowPlayFromMove?: boolean;
}

const {width} = Dimensions.get('window');
const MOVE_ITEM_WIDTH = 100;

export const MoveHistory: React.FC<MoveHistoryProps> = ({
  moves,
  currentMoveIndex,
  onMoveSelect,
  allowPlayFromMove = true,
}) => {
  const {theme} = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    if (currentMoveIndex >= 0 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: Math.max(0, (currentMoveIndex - 1) * MOVE_ITEM_WIDTH),
        animated: true,
      });
    }
  }, [currentMoveIndex]);

  const renderMove = (move: string, index: number) => {
    const moveNumber = Math.floor(index / 2) + 1;
    const isWhiteMove = index % 2 === 0;
    const isSelected = index === currentMoveIndex;

    return (
      <Animated.View
        key={`${moveNumber}-${isWhiteMove ? 'w' : 'b'}`}
        style={[
          styles.moveContainer,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
            backgroundColor: isSelected ? theme.colors.primary : 'rgba(0,0,0,0.05)',
          },
        ]}>
        <TouchableOpacity
          onPress={() => allowPlayFromMove && onMoveSelect(index)}
          disabled={!allowPlayFromMove}
          style={styles.moveButton}>
          <Text
            style={[
              styles.moveNumber,
              isSelected && {color: theme.colors.background},
            ]}>
            {isWhiteMove ? `${moveNumber}.` : ''}
          </Text>
          <Text
            style={[
              styles.moveText,
              isSelected && {color: theme.colors.background},
              isWhiteMove ? styles.whiteMove : styles.blackMove,
            ]}>
            {move}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (moves.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>No moves yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={MOVE_ITEM_WIDTH}
        snapToAlignment="center">
        {moves.map((move, index) => renderMove(move, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    marginVertical: 10,
    width: width - 32,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.5)',
    fontStyle: 'italic',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  moveContainer: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    width: MOVE_ITEM_WIDTH - 8,
  },
  moveButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moveNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
    minWidth: 24,
  },
  moveText: {
    fontSize: 14,
    fontWeight: '500',
  },
  whiteMove: {
    color: '#000',
  },
  blackMove: {
    color: '#666',
  },
}); 