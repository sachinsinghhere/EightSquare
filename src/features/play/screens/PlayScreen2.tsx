import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  useWindowDimensions,
  Image,
} from 'react-native';
import Chessboard, {ChessboardRef} from 'react-native-chessboard';
import {Game} from 'js-chess-engine';
import type {Move} from 'chess.js';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {themeChessboardImages} from '../../../shared/theme/theme';
import {ScreenWrapper} from '../../../shared/components/ScreenWrapper';
import type {AIPersona} from './AIPersonaScreen';

interface ChessMoveInfo {
  move: Move;
  state: {
    in_promotion: boolean;
    [key: string]: any;
  };
}

interface GameMove {
  player: 'white' | 'black';
  from: string;
  to: string;
  timestamp: number;
}

interface PlayerStats {
  totalMoves: number;
  goodMoves: number;  // Moves that gain material or position
  blunders: number;   // Moves that lose material or position
  avgMoveTime: number;
  lastEvaluation: number;
}

const ADAPTIVE_THRESHOLDS = {
  MOVES_TO_EVALUATE: 5,      // Minimum moves before adapting difficulty
  GOOD_MOVE_RATIO: 0.6,     // 60% good moves to increase difficulty
  BLUNDER_RATIO: 0.3,       // 30% blunders to decrease difficulty
  MIN_AVG_TIME: 5000,       // Minimum average move time (ms) for level increase
};

const ChessScreen = ({route}) => {
  const {selectedPersona} = route.params || {};
  const {theme} = useTheme();
  const [isThinking, setIsThinking] = useState(false);
  const [commentary, setCommentary] = useState('Select your opponent to begin!');
  const [moves, setMoves] = useState<GameMove[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    totalMoves: 0,
    goodMoves: 0,
    blunders: 0,
    avgMoveTime: 0,
    lastEvaluation: 0,
  });

  const {width} = useWindowDimensions();
  const BOARD_SIZE = width - 32;
  const chessboardRef = useRef<ChessboardRef>(null);
  const gameRef = useRef(new Game());
  const lastMoveTime = useRef(Date.now());

  // Evaluate move quality
  const evaluateMove = useCallback((beforeState: any, afterState: any) => {
    const moveTime = Date.now() - lastMoveTime.current;
    lastMoveTime.current = Date.now();

    // Update average move time
    setPlayerStats(prev => ({
      ...prev,
      avgMoveTime: (prev.avgMoveTime * prev.totalMoves + moveTime) / (prev.totalMoves + 1),
      totalMoves: prev.totalMoves + 1,
    }));

    // Simple material evaluation (you can make this more sophisticated)
    const materialBefore = countMaterial(beforeState);
    const materialAfter = countMaterial(afterState);
    const materialDiff = materialAfter - materialBefore;

    if (materialDiff > 0) {
      setPlayerStats(prev => ({
        ...prev,
        goodMoves: prev.goodMoves + 1,
      }));
    } else if (materialDiff < -2) { // Consider it a blunder if losing more than a pawn worth
      setPlayerStats(prev => ({
        ...prev,
        blunders: prev.blunders + 1,
      }));
    }

    return materialDiff;
  }, []);

  // Adjust difficulty based on player performance
  const adjustDifficulty = useCallback(() => {
    if (playerStats.totalMoves < ADAPTIVE_THRESHOLDS.MOVES_TO_EVALUATE) {
      return;
    }

    const goodMoveRatio = playerStats.goodMoves / playerStats.totalMoves;
    const blunderRatio = playerStats.blunders / playerStats.totalMoves;
    const currentLevel = selectedPersona.level;

    if (goodMoveRatio >= ADAPTIVE_THRESHOLDS.GOOD_MOVE_RATIO && 
        playerStats.avgMoveTime >= ADAPTIVE_THRESHOLDS.MIN_AVG_TIME &&
        currentLevel < 4) {
      // Player is doing well, increase difficulty
      const newPersona = AI_PERSONAS[currentLevel + 1];
      setSelectedPersona(newPersona);
      setCommentary(`Impressive! ${newPersona.name} would like to challenge you.`);
    } else if (blunderRatio >= ADAPTIVE_THRESHOLDS.BLUNDER_RATIO && currentLevel > 0) {
      // Player is struggling, decrease difficulty
      const newPersona = AI_PERSONAS[currentLevel - 1];
      setSelectedPersona(newPersona);
      setCommentary(`${newPersona.name} steps in to continue the game.`);
    }
  }, [playerStats, selectedPersona.level]);

  // Helper function to count material value
  const countMaterial = (state: any) => {
    const pieceValues = {
      p: 1,  // pawn
      n: 3,  // knight
      b: 3,  // bishop
      r: 5,  // rook
      q: 9,  // queen
      k: 0   // king (not counted for material advantage)
    };
    
    let total = 0;
    if (state.pieces) {
      Object.values(state.pieces).forEach((piece: any) => {
        const value = pieceValues[piece.toLowerCase()];
        total += value || 0;
      });
    }
    return total;
  };

  // Generate AI commentary based on persona
  const generateCommentary = useCallback(() => {
    const comments = selectedPersona.commentary;
    return comments[Math.floor(Math.random() * comments.length)];
  }, [selectedPersona]);

  // Generate AI thinking message
  const getThinkingMessage = useCallback(() => {
    const messages = selectedPersona.thinking;
    return messages[Math.floor(Math.random() * messages.length)];
  }, [selectedPersona]);

  // Handle game over
  const handleGameOver = useCallback((winner: 'white' | 'black' | 'draw') => {
    setIsGameOver(true);
    let result;
    if (winner === 'draw') {
      result = 'Game ended in a draw!';
    } else {
      const messages = winner === 'white' ? selectedPersona.defeat : selectedPersona.victory;
      result = messages[Math.floor(Math.random() * messages.length)];
    }
    setCommentary(result);

    // Save game history or show analysis
    console.log('Game moves:', moves);
  }, [moves, selectedPersona]);

  // Handle resign
  const handleResign = useCallback(() => {
    Alert.alert(
      'Resign Game',
      'Are you sure you want to resign?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Resign',
          style: 'destructive',
          onPress: () => {
            handleGameOver('black');
          },
        },
      ],
    );
  }, [handleGameOver]);

  // Handle AI move
  const handleAIMove = useCallback(async () => {
    try {
      // Get AI's move
      const aiMoveResult = gameRef.current.aiMove(selectedPersona.level);
      const from = Object.keys(aiMoveResult)[0];
      const to = aiMoveResult[from];

      // Record AI's move
      setMoves(prev => [...prev, {
        player: 'black',
        from,
        to,
        timestamp: Date.now(),
      }]);

      // Update the board with AI's move
      if (chessboardRef.current) {
        await chessboardRef.current.move({
          from: from.toLowerCase() as Move['from'],
          to: to.toLowerCase() as Move['to'],
        });
      }

      setCommentary(generateCommentary());

      // Check for game over conditions after AI move
      const gameStatus = gameRef.current.exportJson();
      if (gameStatus.isFinished) {
        handleGameOver(gameStatus.checkMate ? 'black' : 'draw');
      }
    } catch (error) {
      console.error('AI move error:', error);
      setCommentary('Oops! Something went wrong with the AI move.');
    }
  }, [handleGameOver, selectedPersona, generateCommentary]);

  // Handle player move
  const handleMove = useCallback(
    async ({move}: ChessMoveInfo) => {
      if (isThinking || isGameOver) {
        return;
      }

      try {
        const beforeState = gameRef.current.exportJson();
        gameRef.current.move(move.from.toUpperCase(), move.to.toUpperCase());
        const afterState = gameRef.current.exportJson();
        
        evaluateMove(beforeState, afterState);
        adjustDifficulty();

        setMoves(prev => [...prev, {
          player: 'white',
          from: move.from.toUpperCase(),
          to: move.to.toUpperCase(),
          timestamp: Date.now(),
        }]);
        
        if (afterState.isFinished) {
          handleGameOver(afterState.checkMate ? 'white' : 'draw');
          return;
        }

        setIsThinking(true);
        // Use persona's thinking commentary
        if (selectedPersona) {
          const thinkingMessages = selectedPersona.commentary.middlegame;
          const randomMessage = thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)];
          setCommentary(randomMessage);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        await handleAIMove();
      } catch (error) {
        console.error('Move error:', error);
        chessboardRef.current?.resetBoard();
      } finally {
        setIsThinking(false);
      }
    },
    [handleAIMove, isThinking, isGameOver, handleGameOver, evaluateMove, adjustDifficulty, selectedPersona],
  );

  return (
    <ScreenWrapper title={`You vs ${selectedPersona.name}`} showBack={true}>
      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        {selectedPersona && (
          <View
            style={[
              styles.personaHeader,
              {backgroundColor: theme.colors.surface},
            ]}>
            <Image
              source={selectedPersona.image}
              style={styles.personaImage}
              // defaultSource={require('../../../assets/images/themeBgs/clay.png')}
            />
            <View style={styles.personaInfo}>
              <Text style={[styles.personaName, {color: theme.colors.text}]}>
                {selectedPersona.name}
              </Text>
              <Text
                style={[styles.personaRating, {color: theme.colors.primary}]}>
                Rating: {selectedPersona.rating}
              </Text>
            </View>
          </View>
        )}

        <View style={[styles.board, {backgroundColor: theme.colors.surface}]}>
          <Chessboard
            ref={chessboardRef}
            gestureEnabled={!isThinking && !isGameOver}
            onMove={handleMove}
            colors={{
              black: theme.colors.primary,
              white: theme.colors.secondary,
              moving: 'rgba(255, 255, 255, 0.2)',
            }}
            renderPiece={piece => (
              <Image
                style={{
                  width: BOARD_SIZE / 8,
                  height: BOARD_SIZE / 8,
                }}
                source={themeChessboardImages[theme.name.toLowerCase()][piece]}
              />
            )}
            boardSize={BOARD_SIZE}
          />
        </View>

        <View
          style={[
            styles.infoContainer,
            {backgroundColor: theme.colors.surface},
          ]}>
          <View style={styles.statsRow}>
            <Text style={[styles.moveCount, {color: theme.colors.text}]}>
              Moves: {moves.length}
            </Text>
            <Text style={[styles.statsText, {color: theme.colors.text}]}>
              Accuracy:{' '}
              {playerStats.totalMoves > 0
                ? Math.round(
                    (playerStats.goodMoves / playerStats.totalMoves) * 100,
                  )
                : 0}
              %
            </Text>
          </View>
          {isThinking && (
            <View style={styles.thinkingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={[styles.thinkingText, {color: theme.colors.text}]}>
                {commentary}
              </Text>
            </View>
          )}
          <Text style={[styles.commentary, {color: theme.colors.text}]}>
            {commentary}
          </Text>
        </View>

        {!isGameOver && (
          <TouchableOpacity
            style={[styles.resignButton, {backgroundColor: theme.colors.error}]}
            onPress={handleResign}
            disabled={isThinking}>
            <Text style={styles.resignButtonText}>Resign</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  personaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  personaImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  personaInfo: {
    flex: 1,
  },
  personaName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  personaRating: {
    fontSize: 14,
  },
  board: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1F2E',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#1A1F2E',
    borderRadius: 12,
    marginBottom: 20,
  },
  moveCount: {
    fontSize: 16,
    color: '#8F9BB3',
    marginBottom: 8,
  },
  thinkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  thinkingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#8F9BB3',
  },
  commentary: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  resignButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FF3D71',
    borderRadius: 8,
    opacity: 1,
  },
  resignButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 16,
    color: '#8F9BB3',
  },
});

export default ChessScreen; 