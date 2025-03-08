import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useState, useRef, useEffect, Suspense} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {ChessboardRef} from 'react-native-chessboard';
import {Chess, Square, Move} from 'chess.js';
import {playMoveSound, playChessSound} from '../../../utils/sounds';
import ESChessboard from '../../../shared/components/ESChessboard';
import FlipCard from 'react-native-flip-card';
import * as JSChessEngine from 'js-chess-engine';
import {textStyles} from '../../../shared/theme/typography';
import Loader from '../../../shared/components/Loader';

const {width} = Dimensions.get('window');
const BOARD_SIZE = width - 32;

interface ChessMove {
  color: 'w' | 'b';
  from: string;
  to: string;
  flags: string;
  piece: string;
  san: string;
}

interface ChessState {
  in_check: boolean;
  in_checkmate: boolean;
  in_draw: boolean;
  in_stalemate: boolean;
  in_threefold_repetition: boolean;
  insufficient_material: boolean;
  game_over: boolean;
  fen: string;
}

const ChessboardWithSuspense = React.lazy(() =>
  Promise.resolve({default: ESChessboard}),
);

const BlindChessScreen = () => {
  const {theme} = useTheme();
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gameStatus, setGameStatus] = useState<string>('');
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [currentFen, setCurrentFen] = useState('');
  const chessboardRef = useRef<ChessboardRef>(null);
  const chessRef = useRef(new Chess());
  const engineRef = useRef(new JSChessEngine.Game());

  useEffect(() => {
    updateLegalMoves();
  }, []);

  const updateLegalMoves = () => {
    const moves = chessRef.current.moves({verbose: true});
    setLegalMoves(moves);
    setCurrentFen(chessRef.current.fen());

    // Update game status
    const chess = chessRef.current;
    if (chess.game_over()) {
      if (chess.in_checkmate) {
        setGameStatus('Checkmate!');
        playChessSound('game_end');
      } else if (chess.in_draw) {
        setGameStatus('Draw!');
        playChessSound('game_end');
      } else if (chess.in_stalemate) {
        setGameStatus('Stalemate!');
        playChessSound('game_end');
      } else {
        setGameStatus('Game Over!');
        playChessSound('game_end');
      }
    } else if (chess.in_check) {
      setGameStatus('Check!');
      playChessSound('check');
    } else {
      setGameStatus('');
    }
  };

  const handleMove = async (moveData: {move: Move; state: ChessState}) => {
    if (!moveData.move) return;

    setLoading(true);
    const from = moveData.move.from as Square;
    const to = moveData.move.to as Square;

    try {
      // Make player's move
      chessRef.current.move({
        from,
        to,
      });

      // Play sound
      playMoveSound(from, to);

      // Update game state
      updateLegalMoves();

      // Make engine move
      const engineMove = await makeEngineMove();
      if (engineMove) {
        updateLegalMoves();
      }
    } catch (error) {
      console.error('Error making move:', error);
    } finally {
      setLoading(false);
    }
  };

  const makeEngineMove = async () => {
    try {
      const currentFen = chessRef.current.fen();
      engineRef.current = new JSChessEngine.Game();
      const gameState = JSChessEngine.status(currentFen);
      const move = JSChessEngine.aiMove(gameState);
      const [fromSquare, toSquare] = Object.entries(move)[0];

      const from = fromSquare.toLowerCase() as Square;
      const to = toSquare.toLowerCase() as Square;

      chessRef.current.move({
        from,
        to,
        promotion: 'q', // Default to queen promotion
      });

      await chessboardRef.current?.move({from, to});
      return true;
    } catch (error) {
      console.error('Engine move error:', error);
      return false;
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      chessRef.current.reset();
      await chessboardRef.current?.resetBoard();
      engineRef.current = new JSChessEngine.Game();
      updateLegalMoves();
      setGameStatus('');
    } catch (error) {
      console.error('Reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMovesList = () => {
    return (
      <ScrollView style={styles.movesContainer}>
        <View style={styles.movesGrid}>
          {legalMoves.map((move, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.moveTag, {backgroundColor: theme.colors.primary}]}
              onPress={() =>
                handleMove({
                  move,
                  state: {
                    in_check: chessRef.current.in_check,
                    in_checkmate: chessRef.current.in_checkmate,
                    in_draw: chessRef.current.in_draw,
                    in_stalemate: chessRef.current.in_stalemate,
                    in_threefold_repetition:
                      chessRef.current.in_threefold_repetition,
                    insufficient_material:
                      chessRef.current.insufficient_material,
                    game_over: chessRef.current.game_over,
                    fen: chessRef.current.fen(),
                  },
                })
              }>
              <Text
                style={[
                  textStyles.bodyMedium,
                  styles.moveText,
                  {color: theme.colors.background},
                ]}>
                {move.san}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container]}>
      <View style={styles.header}>
        <Text style={[textStyles.h3, {color: theme.colors.text}]}>
          Imagine the board
        </Text>
        {/* {gameStatus ? (
          <Text style={[textStyles.h4, {color: theme.colors.primary}]}>
            {gameStatus}
          </Text>
        ) : null} */}
      </View>

      <FlipCard
        style={styles.flipCard}
        friction={6}
        perspective={1000}
        flipHorizontal={true}
        flipVertical={false}
        flip={isFlipped}
        clickable={false}>
        {/* Face Side */}
        <View
          style={[
            styles.cardSide,
            styles.cardFace,
            {backgroundColor: theme.colors.surface},
          ]}>
          <Text
            style={[
              textStyles.h4,
              {color: theme.colors.text, marginBottom: 16},
            ]}>
            Available Moves
          </Text>
          {renderMovesList()}
        </View>

        {/* Back Side */}
        <View
          style={[
            styles.cardSide,
            styles.cardBack,
            {backgroundColor: theme.colors.surface},
          ]}>
          <View style={styles.boardContainer}>
            <Suspense fallback={<Loader visible={true} />}>
              <ChessboardWithSuspense
                boardRef={chessboardRef}
                boardSize={BOARD_SIZE - 32}
                onMove={handleMove}
                fen={currentFen}
              />
            </Suspense>
          </View>
        </View>
      </FlipCard>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: theme.colors.primary}]}
          onPress={handleReset}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color={theme.colors.background} />
          ) : (
            <Text style={[textStyles.button, {color: theme.colors.background}]}>
              Reset
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: theme.colors.primary}]}
          onPress={() => setIsFlipped(!isFlipped)}
          disabled={loading}>
          <Text style={[textStyles.button, {color: theme.colors.background}]}>
            {isFlipped ? 'Show Moves' : 'Show Board'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BlindChessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  flipCard: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardSide: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backfaceVisibility: 'hidden',
  },
  cardFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  movesContainer: {
    flex: 1,
  },
  movesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 8,
  },
  moveTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 60,
  },
  moveText: {
    textAlign: 'center',
    fontSize: 14,
  },
  boardContainer: {
    width: BOARD_SIZE - 32,
    height: BOARD_SIZE - 32,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
});
