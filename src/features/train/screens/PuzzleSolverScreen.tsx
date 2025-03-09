import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {Chess, Square} from 'chess.js';
import {ChessboardRef} from 'react-native-chessboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {textStyles} from '../../../shared/theme/typography';
import {TrainStackParamList} from '../../../navigation/types';
import {Q} from '@nozbe/watermelondb';
import {database} from '../../../shared/services/database';
import Puzzle from '../../../shared/services/database/models/puzzle';
import {playMoveSound, playChessSound} from '../../../utils/sounds';
import ESChessboard from '../../../shared/components/ESChessboard';
import {ScreenWrapper} from '../../../shared/components/ScreenWrapper';

const {width} = Dimensions.get('window');
const BOARD_SIZE = width * 0.85;

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
  gameUrl: string | null;
  opening_tags: string;
}

const PuzzleSolverScreen = () => {
  const route = useRoute<RouteProp<TrainStackParamList, 'PuzzleSolver'>>();
  const navigation = useNavigation();
  const {theme} = useTheme();
  const chessboardRef = useRef<ChessboardRef>(null);
  const boardRef = useRef<View>(null);
  const chessRef = useRef(new Chess());
  const solutionScrollViewRef = useRef<ScrollView>(null);

  const [moveIndex, setMoveIndex] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCorrectMove, setIsCorrectMove] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [isOpponentMoving, setIsOpponentMoving] = useState(false);
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [boardKey, setBoardKey] = useState(0);

  const {filter} = route.params;

  useEffect(() => {
    const loadPuzzles = async () => {
      setLoading(true);
      try {
        const query =
          filter.type === 'random'
            ? database.get('puzzles').query()
            : filter.type === 'theme'
            ? database
                .get('puzzles')
                .query(Q.where('themes', Q.like(`%${filter.tag}%`)))
            : database
                .get('puzzles')
                .query(Q.where('opening_tags', Q.like(`%${filter.tag}%`)));

        if (!filter.includeSolved) {
          query.extend(Q.where('solved', Q.notEq(true)));
        }

        const puzzleCollection = await query.fetch();
        console.log('puzzleCollection', puzzleCollection);
        const randomPuzzles = puzzleCollection
          .sort(() => Math.random() - 0.5)
          .slice(0, 20) as unknown as Puzzle[];

        setPuzzles(randomPuzzles);
        if (randomPuzzles.length > 0) {
          setCurrentPuzzle(randomPuzzles[0]);
        } else {
          Alert.alert(
            'No Puzzles Available',
            'No unsolved puzzles found in this category. Try another category or include solved puzzles.',
            [
              {
                text: 'Go Back',
                onPress: () => navigation.goBack(),
              },
            ],
          );
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

  useEffect(() => {
    const loadHighScore = async () => {
      try {
        const savedHighScore = await AsyncStorage.getItem('puzzleHighScore');
        if (savedHighScore !== null) {
          setHighScore(parseInt(savedHighScore, 10));
        }
      } catch (error) {
        console.error('Error loading high score:', error);
      }
    };
    loadHighScore();
  }, []);

  const updateHighScore = async (newScore: number) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      try {
        await AsyncStorage.setItem('puzzleHighScore', newScore.toString());
      } catch (error) {
        console.error('Error saving high score:', error);
      }
    }
  };

  const moveToNextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      const nextPuzzle = puzzles[currentPuzzleIndex + 1];
      const raw = nextPuzzle._raw as PuzzleRaw;
      
      // Reset the chess instance with the new FEN
      chessRef.current = new Chess(raw.fen);
      
      // Update states
      setCurrentPuzzleIndex(prev => prev + 1);
      setCurrentPuzzle(nextPuzzle);
      setMoveIndex(0);
      setIsCorrectMove(null);
      setIsPlayerTurn(false);
      setIsOpponentMoving(false);
      setShowSolution(false);
      setBoardKey(prev => prev + 1); // Force board re-render
      
      // Make the first opponent move after a short delay
      setTimeout(() => {
        const moves = raw.moves.split(' ');
        const firstMove = moves[0];
        const [fromOpp, toOpp] = [
          firstMove.slice(0, 2) as Square,
          firstMove.slice(2, 4) as Square,
        ];
        
        setIsOpponentMoving(true);
        chessboardRef.current?.move({from: fromOpp, to: toOpp});
        chessRef.current.move({from: fromOpp, to: toOpp});
        setIsOpponentMoving(false);
        setIsPlayerTurn(true);
        setMoveIndex(1);
      }, 500);
    } else {
      Alert.alert(
        'Congratulations!',
        `You've completed all puzzles in this set!\nFinal Score: ${score}\nHigh Score: ${highScore}`,
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

      // Play appropriate sound based on move type
      const isCapture = chessRef.current.get(toSquare) !== null;
      const isCheck = chessRef.current.in_check();
      playMoveSound(from, to, isCapture, isCheck, false);

      setIsCorrectMove(true);
      setIsPlayerTurn(false);

      if (moveIndex === moves.length - 1) {
        // Puzzle completed
        if (!showSolution) {
          const newScore = score + 1;
          setScore(newScore);
          updateHighScore(newScore);
        }
        playChessSound('game_end');
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

          // Play sound for opponent's move
          const isCapture = chessRef.current.get(toOpp) !== null;
          const isCheck = chessRef.current.in_check();
          playMoveSound(fromOpp, toOpp, isCapture, isCheck, false);

          setIsOpponentMoving(false);
          setIsPlayerTurn(true);
          setMoveIndex(moveIndex + 2);
        }, 500);
      }
    } else {
      // Wrong move
      setIsCorrectMove(false);
      playChessSound('move'); // Play a normal move sound for wrong moves
      setTimeout(() => {
        chessboardRef.current?.undo();
        setIsCorrectMove(null);
      }, 500);
    }
  };

  // Add this effect to scroll to bottom when solution is shown
  useEffect(() => {
    if (showSolution && solutionScrollViewRef.current) {
      setTimeout(() => {
        solutionScrollViewRef.current?.scrollToEnd({animated: true});
      }, 100);
    }
  }, [showSolution]);

  if (loading || !currentPuzzle) {
    return (
      <ScreenWrapper title="Solve Puzzles" loaderVisible={loading}>
        <Text style={[textStyles.h4, {color: theme.colors.text}]}>{''}</Text>
      </ScreenWrapper>
    );
  }

  const raw = currentPuzzle?._raw as PuzzleRaw;
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
    <ScreenWrapper title="Solve Puzzles">
      <ScrollView
        contentContainerStyle={[styles.container]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.scoreContainer}>
          <Text style={[textStyles.h5, {color: theme.colors.text}]}>
            Score: {score}
          </Text>
          <Text style={[textStyles.h5, {color: theme.colors.text}]}>
            High Score: {highScore}
          </Text>
        </View>
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
        <ESChessboard
          key={boardKey}
          boardRef={chessboardRef}
          fen={raw.fen}
          onMove={handleMove}
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
          gestureEnabled={true}
        />
        <View style={styles.controls}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginTop: 16,
            }}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: theme.colors.primary}]}
              onPress={() => setShowSolution(!showSolution)}>
              <Text style={[textStyles.button, {color: theme.colors.card}]}>
                {showSolution ? 'Hide Solution' : 'View Solution'}
              </Text>
            </TouchableOpacity>
          </View>
          {showSolution && (
            <View
              style={[
                styles.solutionBox,
                {backgroundColor: theme.colors.card},
              ]}>
              <Text
                style={[
                  textStyles.h5,
                  {color: theme.colors.text, marginBottom: 8},
                ]}>
                Solution
              </Text>
              <ScrollView
                ref={solutionScrollViewRef}
                style={styles.solutionScroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.solutionScrollContent}>
                {solutionMoves.map((move, index) => (
                  <View key={index} style={styles.moveRow}>
                    {move.isPlayer ? (
                      <Text
                        style={[
                          textStyles.bodySmall,
                          {color: theme.colors.success, fontWeight: '600'},
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
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
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
    maxHeight: 400,
  },
  solutionScroll: {
    maxHeight: 350,
  },
  solutionScrollContent: {
    paddingBottom: 16,
  },
  moveRow: {
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 16,
  },
});

export default PuzzleSolverScreen;
