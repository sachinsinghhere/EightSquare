import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Share,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import {Chess, Square} from 'chess.js';
import Chessboard, {ChessboardRef} from 'react-native-chessboard';
import {captureRef} from 'react-native-view-shot';
import Icon from '../../../shared/components/Icon';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {textStyles} from '../../../shared/theme/typography';
import {themeChessboardImages} from '../../../shared/theme/theme';
import {TrainStackParamList} from '../../../navigation/types';
import {Q} from '@nozbe/watermelondb';
import {database} from '../../../shared/services/database';
import Puzzle from '../../../shared/services/database/models/puzzle';

const {width} = Dimensions.get('window');
const BOARD_SIZE = width - 32;

interface PuzzleRaw {
  id: string;
  _status: string;
  _changed: string;
  puzzle_id: string;
  fen: string;
  moves: string;
  rating: number;
  rating_deviation: number | null;
  popularity: number | null;
  nb_plays: number | null;
  themes: string;
  game_url: string | null;
  opening_tags: string;
}

const PuzzleSolverScreen = () => {
  const route = useRoute<RouteProp<TrainStackParamList, 'PuzzleSolver'>>();
  const {theme} = useTheme();
  const chessboardRef = useRef<ChessboardRef>(null);
  const boardRef = useRef<View>(null);
  const chessRef = useRef(new Chess());

  const [moveIndex, setMoveIndex] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCorrectMove, setIsCorrectMove] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isOpponentMoving, setIsOpponentMoving] = useState(false);
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  const {filter} = route.params;

  useEffect(() => {
    const loadPuzzles = async () => {
      setLoading(true);
      try {
        const query =
          filter.type === 'random'
            ? database.get('puzzles').query()
            : database
                .get('puzzles')
                .query(Q.where('themes', Q.like(`%${filter.type}%`)));

        const puzzleCollection = await query.fetch();
        const randomPuzzles = puzzleCollection
          .sort(() => Math.random() - 0.5)
          .slice(0, 20) as unknown as Puzzle[];

        setPuzzles(randomPuzzles);
        if (randomPuzzles.length > 0) {
          setCurrentPuzzle(randomPuzzles[0]);
        }
      } catch (error) {
        console.error('Error loading puzzles:', error);
        Alert.alert('Error', 'Failed to load puzzles');
      } finally {
        setLoading(false);
      }
    };

    loadPuzzles();
  }, [filter]);

  useEffect(() => {
    if (currentPuzzle) {
      const raw = currentPuzzle._raw as PuzzleRaw;
      const chess = new Chess(raw.fen);
      chessRef.current = chess;
      
      // Get the first move (opponent's move)
      const moves = raw.moves.split(' ');
      const firstMove = moves[0];
      const [fromOpp, toOpp] = [
        firstMove.slice(0, 2) as Square,
        firstMove.slice(2, 4) as Square,
      ];

      // Set initial states
      setPlayerColor(chess.turn() === 'w' ? 'b' : 'w'); // Player's color is opposite of initial FEN
      setMoveIndex(1); // Start from index 1 since first move is auto-played
      setIsCorrectMove(null);
      setIsPlayerTurn(false);
      
      // Play the first move automatically
      setIsOpponentMoving(true);
      setTimeout(() => {
        chessboardRef.current?.move({from: fromOpp, to: toOpp});
        chessRef.current.move({from: fromOpp, to: toOpp});
        setIsOpponentMoving(false);
        setIsPlayerTurn(true);
      }, 500);
    }
  }, [currentPuzzle]);

  const moveToNextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      chessboardRef.current?.resetBoard();
      setCurrentPuzzleIndex(prev => prev + 1);
      setCurrentPuzzle(puzzles[currentPuzzleIndex + 1]);
    } else {
      Alert.alert(
        'Congratulations!',
        `You've completed all puzzles in this set!\nTotal Score: ${score}`,
        [
          {
            text: 'Start Over',
            onPress: () => {
              setCurrentPuzzleIndex(0);
              setCurrentPuzzle(puzzles[0]);
              setScore(0);
            },
          },
        ],
      );
    }
  };

  const handleMove = ({move}: {move: {from: string; to: string}}) => {
    if (!currentPuzzle || isOpponentMoving || !isPlayerTurn) return;

    const {from, to} = move;
    const raw = currentPuzzle._raw as PuzzleRaw;
    const moves = raw.moves.split(' ');
    const expectedMove = moves[moveIndex];
    const actualMove = `${from}${to}`;

    if (actualMove === expectedMove) {
      // Correct move
      const fromSquare = from as Square;
      const toSquare = to as Square;
      chessRef.current.move({from: fromSquare, to: toSquare});
      setIsCorrectMove(true);
      setIsPlayerTurn(false);

      if (moveIndex === moves.length - 1) {
        // Puzzle completed
        setScore(s => s + 1);
        setTimeout(() => {
          Alert.alert('Success!', 'Puzzle solved correctly!', [
            {text: 'Next Puzzle', onPress: moveToNextPuzzle},
          ]);
        }, 500);
      } else {
        // Make opponent's move
        const opponentMove = moves[moveIndex + 1];
        const [fromOpp, toOpp] = [
          opponentMove.slice(0, 2) as Square,
          opponentMove.slice(2, 4) as Square,
        ];
        setIsOpponentMoving(true);
        setTimeout(() => {
          chessboardRef.current?.move({from: fromOpp, to: toOpp});
          chessRef.current.move({from: fromOpp, to: toOpp});
          setIsOpponentMoving(false);
          setIsPlayerTurn(true);
          setMoveIndex(moveIndex + 2);
        }, 500);
      }
    } else {
      // Wrong move
      setIsCorrectMove(false);
      setTimeout(() => {
        chessboardRef.current?.undo();
        setIsCorrectMove(null);
      }, 500);
    }
  };

  const handleShare = async () => {
    try {
      if (boardRef.current && currentPuzzle) {
        const uri = await captureRef(boardRef.current, {
          format: 'png',
          quality: 1,
        });
        const raw = currentPuzzle._raw as PuzzleRaw;
        await Share.share({
          url: uri,
          message: `Can you solve this chess puzzle? Rating: ${raw.rating}`,
        });
      }
    } catch (error) {
      console.error('Error sharing puzzle:', error);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (loading || !currentPuzzle) {
    return (
      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <Text style={[textStyles.h4, {color: theme.colors.text}]}>
          Loading puzzles...
        </Text>
      </View>
    );
  }

  const raw = currentPuzzle._raw as PuzzleRaw;
  console.log('RAW', raw);

  const solutionMoves = raw.moves.split(' ').map((move, index) => {
    const from = move.slice(0, 2);
    const to = move.slice(2, 4);
    return {
      number: Math.floor(index / 2) + 1,
      move: `${from} → ${to}`,
      isPlayer: index % 2 !== 0,
    };
  });

  return (
    <ScrollView

      contentContainerStyle={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text
        style={[
          textStyles.h5,
          {color: theme.colors.text, marginBottom: 8, textAlign: 'center'},
        ]}>
        {isOpponentMoving
          ? 'Opponent is moving...'
          : isPlayerTurn
          ? 'Your turn'
          : "Opponent's turn"}
      </Text>
      <Text
        style={[
          textStyles.bodySmall,
          {color: theme.colors.text, marginBottom: 8, textAlign: 'center'},
        ]}>
        You are playing as {playerColor === 'w' ? 'White' : 'Black'}
      </Text>
      <View
        style={[
          styles.boardContainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <Chessboard
          ref={chessboardRef}
          fen={raw.fen}
          onMove={showSolution ? undefined : handleMove}
          renderPiece={piece => (
            <Image
              style={{
                width: BOARD_SIZE / 8,
                height: BOARD_SIZE / 8,
              }}
              source={themeChessboardImages[theme.name.toLowerCase()][piece]}
            />
          )}
          colors={{
            black: theme.colors.primary,
            white: theme.colors.secondary,
            lastMoveHighlight:
              isCorrectMove === true
                ? 'rgba(0, 255, 0, 0.4)'
                : isCorrectMove === false
                ? 'rgba(255, 0, 0, 0.4)'
                : 'rgba(255, 255, 255, 0.2)',
            checkmateHighlight: theme.colors.error,
            promotionPieceButton: theme.colors.success,
          }}
          boardSize={BOARD_SIZE}
          gestureEnabled={!showSolution}
        />
      </View>
      <View style={styles.controls}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '100%',
          }}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: theme.colors.primary}]}
            onPress={toggleFavorite}>
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={theme.colors.card}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, {backgroundColor: theme.colors.primary}]}
            onPress={() => setShowSolution(!showSolution)}>
            <Text style={[textStyles.button, {color: theme.colors.card}]}>
              {showSolution ? 'Hide Solution' : 'View Solution'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, {backgroundColor: theme.colors.primary}]}
            onPress={handleShare}>
            <Icon name="share-variant" size={24} color={theme.colors.card} />
          </TouchableOpacity>
        </View>
        {showSolution && <View
          style={[styles.solutionBox, {backgroundColor: theme.colors.card}]}>
          <Text
            style={[
              textStyles.h5,
              {color: theme.colors.text, marginBottom: 8},
            ]}>
            Solution
          </Text>
          <ScrollView style={styles.solutionScroll}>
            {solutionMoves.map((move, index) => (
              <View key={index} style={styles.moveRow}>
                {move.isPlayer ? (
                  <Text
                    style={[
                      textStyles.bodySmall,
                      {color: theme.colors.primary},
                    ]}>
                    {move.number}. Your move: {move.move}
                  </Text>
                ) : (
                  <Text
                    style={[
                      textStyles.bodySmall,
                      {color: theme.colors.text, opacity: 0.8},
                    ]}>
                    {move.number}. Opponent: {move.move}
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 100,
  },
  boardContainer: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 16,
  },
  controls: {
    width: '100%',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  solutionBox: {
    margin: 16,
    padding: 15,
    borderRadius: 12,
    maxHeight: 220,
  },
  solutionScroll: {
    maxHeight: 150,
  },
  moveRow: {
    marginBottom: 8,
  },
});

export default PuzzleSolverScreen;
