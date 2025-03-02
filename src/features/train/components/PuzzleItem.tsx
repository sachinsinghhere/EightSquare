import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Puzzle from '../../../shared/database/models/puzzle';


interface PuzzleItemProps {
  puzzle: Puzzle;
  onPress: (puzzle: Puzzle) => void;
}

const PuzzleItem: React.FC<PuzzleItemProps> = ({puzzle, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(puzzle)}>
      <View style={styles.content}>
        <Text style={styles.title}>Puzzle #{puzzle.puzzleId}</Text>
        <Text style={styles.rating}>Rating: {puzzle.rating}</Text>
        <View style={styles.tagsContainer}>
          {puzzle.themesList.slice(0, 3).map((theme, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{theme}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
  },
});

export default PuzzleItem;
