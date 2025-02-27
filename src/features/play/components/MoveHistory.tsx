import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {textStyles} from '../../../shared/theme/typography';

interface MoveHistoryProps {
  moves: string[];
  currentMoveIndex: number;
  onMoveSelect: (index: number) => void;
}

const MOVE_ITEM_WIDTH = 60;

export const MoveHistory: React.FC<MoveHistoryProps> = ({
  moves,
  currentMoveIndex,
  onMoveSelect,
}) => {
  const {theme} = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (currentMoveIndex >= 0 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: Math.max(0, currentMoveIndex * MOVE_ITEM_WIDTH),
        animated: true,
      });
    }
  }, [currentMoveIndex]);

  const renderMove = (move: string, index: number) => {
    const moveNumber = Math.floor(index / 2) + 1;
    const isWhiteMove = index % 2 === 0;
    const isSelected = index === currentMoveIndex;

    return (
      <TouchableOpacity
        key={`${moveNumber}-${isWhiteMove ? 'w' : 'b'}`}
        onPress={() => onMoveSelect(index)}
        style={[
          styles.moveContainer,
          isSelected && {backgroundColor: theme.colors.primary},
        ]}>
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
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      {moves.map((move, index) => renderMove(move, index))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 32,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...textStyles.caption,
    color: '#666',
    fontStyle: 'italic',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  moveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    marginHorizontal: 2,
    borderRadius: 4,
    minWidth: MOVE_ITEM_WIDTH - 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  moveNumber: {
    ...textStyles.caption,
    fontSize: 11,
    marginRight: 2,
    minWidth: 16,
    color: '#666',
    fontFamily: 'System',
  },
  moveText: {
    ...textStyles.caption,
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'System',
  },
  whiteMove: {
    color: '#000',
  },
  blackMove: {
    color: '#333',
  },
}); 