import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
  ScrollView,
  Switch,
  Image,
  BackHandler,
} from 'react-native';
import {ChessboardRef} from 'react-native-chessboard';
import {Game} from 'js-chess-engine';
import type {Move} from 'chess.js';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {ScreenWrapper} from '../../../shared/components/ScreenWrapper';
import type {AIPersona} from './AIPersonaScreen';
import { useNetworkStatus } from '../../../shared/hooks/useNetworkStatus';
import ESChessboard from '../../../shared/components/ESChessboard';
import {generateCommentary} from '../services/commentaryService';
import {AnalysisPanel} from '../components/AnalysisPanel';
import {useNavigation} from '@react-navigation/native';

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

interface GameState {
  isFinished: boolean;
  checkMate: boolean;
  pieces: {
    [key: string]: string;
  };
}

// Add type for Game class
interface ExtendedGame extends Game {
  exportFEN: () => string;
}

const DIFFICULTY_LEVELS = [
  {
    id: 'beginner',
    name: 'Beginner',
    personas: [
      {
        id: 'default',
        name: 'Chess Engine',
        rating: 800,
        level: 1,
        depth: undefined,
        image: null,
        description: 'A chess engine opponent',
        personality: {
          style: 'Engine',
          strength: 'Calculation',
          weakness: 'None',
        },
        commentary: {
          opening: [''],
          middlegame: [''],
          endgame: [''],
          winning: [''],
          losing: [''],
          draw: [''],
        },
        prompts: {
          moveAnalysis: '',
          gameStrategy: '',
          personalityTraits: '',
        },
      },
    ],
  },
];

interface RouteParams {
  selectedPersona: AIPersona;
}

interface Route {
  params?: RouteParams;
}

const ChessScreen = ({route}: {route: Route}) => {
  const {isOnline} = useNetworkStatus();
  const selectedPersona = route.params?.selectedPersona || DIFFICULTY_LEVELS[0].personas[0];
  const {theme} = useTheme();
  const [isThinking, setIsThinking] = useState(false);
  const [moveMessage, setMoveMessage] = useState('Game started. Make your move!');
  const [moves, setMoves] = useState<GameMove[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showCommentary, setShowCommentary] = useState(true);
  const [currentCommentary, setCurrentCommentary] = useState<string>('');
  const [commentaryQueue, setCommentaryQueue] = useState<{
    state: string;
    move: string;
    phase: 'opening' | 'middlegame' | 'endgame';
  } | null>(null);

  const {width} = useWindowDimensions();
  const BOARD_SIZE = width - 32;
  const chessboardRef = useRef<ChessboardRef>(null);
  const gameRef = useRef<ExtendedGame>(new Game() as ExtendedGame);
  const navigation = useNavigation();

  // Handle game over
  const handleGameOver = useCallback((winner: 'white' | 'black' | 'draw') => {
    setIsGameOver(true);
    setMoveMessage(winner === 'draw' ? 'Game ended in a draw!' : `${winner === 'white' ? 'You' : 'Engine'} won!`);
  }, []);

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
      let from: string, to: string;

      if (selectedPersona.depth && isOnline) {
        // Use Stockfish API for engine-based opponents
        const fen = gameRef.current.exportFEN();
        const response = await fetch(`https://stockfish.online/api/s/v2.php?fen=${fen}&depth=${selectedPersona.depth}`);
        const data = await response.json();
        
        if (data.success && data.bestmove) {
          [from, to] = data.bestmove.split(/(?<=^.{2})/);
          from = from.toUpperCase();
          to = to.toUpperCase();
        } else {
          throw new Error('Invalid response from Stockfish API');
        }
      } else {
        // Use existing js-chess-engine for non-engine opponents
        const aiMoveResult = gameRef.current.aiMove(selectedPersona.level);
        from = Object.keys(aiMoveResult)[0];
        to = aiMoveResult[from];
      }

      setMoves(prev => [...prev, {
        player: 'black',
        from,
        to,
        timestamp: Date.now(),
      }]);

      if (chessboardRef.current) {
        await chessboardRef.current.move({
          from: from.toLowerCase() as Move['from'],
          to: to.toLowerCase() as Move['to'],
        });
      }

      // gameRef.current.move(from.toLowerCase(), to.toLowerCase() );
      setMoveMessage(`${selectedPersona.name} played ${from.toLowerCase()}-${to.toLowerCase()}`);

      const gameStatus = gameRef.current.exportJson() as GameState;
      if (gameStatus.isFinished) {
        handleGameOver(gameStatus.checkMate ? 'black' : 'draw');
      }
    } catch (error) {
      console.error('AI move error:', error);
      setMoveMessage('Error: Engine failed to make a move');
    }
  }, [handleGameOver, selectedPersona, isOnline]);

  // Helper to determine game phase
  const getGamePhase = useCallback((moveCount: number): 'opening' | 'middlegame' | 'endgame' => {
    if (moveCount <= 10) return 'opening';
    if (moveCount <= 30) return 'middlegame';
    return 'endgame';
  }, []);

  // Handle commentary generation separately
  React.useEffect(() => {
    let isMounted = true;

    const generateMoveCommentary = async () => {
      if (!commentaryQueue || !showCommentary) return;

      try {
        const commentary = await generateCommentary(
          selectedPersona,
          commentaryQueue.state,
          commentaryQueue.move,
          null,
          commentaryQueue.phase
        );
        
        // Only update if component is still mounted
        if (isMounted) {
          setCurrentCommentary(commentary.commentary);
          setCommentaryQueue(null); // Clear the queue after processing
        }
      } catch (error) {
        console.error('Commentary error:', error);
        if (isMounted) {
          setCommentaryQueue(null); // Clear the queue on error
        }
      }
    };

    generateMoveCommentary();

    return () => {
      isMounted = false;
    };
  }, [commentaryQueue, showCommentary, selectedPersona]);

  // Handle player move
  const handleMove = useCallback(
    async ({move}: ChessMoveInfo) => {
      if (isThinking || isGameOver) {
        return;
      }

      try {
        gameRef.current.move(move.from.toUpperCase(), move.to.toUpperCase());
        const afterState = gameRef.current.exportJson() as GameState;

        const playerMove = {
          player: 'white' as const,
          from: move.from.toUpperCase(),
          to: move.to.toUpperCase(),
          timestamp: Date.now(),
        };
        setMoves(prev => [...prev, playerMove]);
        setMoveMessage(`You played ${playerMove.from}-${playerMove.to}`);
        
        if (afterState.isFinished) {
          handleGameOver(afterState.checkMate ? 'white' : 'draw');
          return;
        }

        setIsThinking(true);
        
        // Queue commentary generation separately from main game flow
        if (showCommentary) {
          setCommentaryQueue({
            state: JSON.stringify(afterState),
            move: `${playerMove.from}-${playerMove.to}`,
            phase: getGamePhase(moves.length)
          });
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
    [handleAIMove, isThinking, isGameOver, handleGameOver, showCommentary, moves.length, getGamePhase],
  );

  // Handle back button and gesture
  useEffect(() => {
    const handleBack = () => {
      if (isGameOver) {
        navigation.goBack();
        return true;
      }

      Alert.alert(
        'Leave Game?',
        'You need to resign to leave the game. Would you like to resign?',
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
              navigation.goBack();
            },
          },
        ],
      );
      return true;
    };

    // Add back handler
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack);
    
    // Add navigation listener for gesture/header back
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (isGameOver) {
        return;
      }

      // Prevent default behavior
      e.preventDefault();

      // Show resign confirmation
      Alert.alert(
        'Leave Game?',
        'You need to resign to leave the game. Would you like to resign?',
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
              navigation.dispatch(e.data.action);
            },
          },
        ],
      );
    });

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [navigation, isGameOver, handleGameOver]);

  return (
    <ScreenWrapper title={`You vs ${selectedPersona.name}`} showBack={true}>
      <ScrollView
        style={[styles.container]}
        contentContainerStyle={styles.contentContainer}
        bounces={false}>
        <View
          style={[
            styles.personaHeader,
            {backgroundColor: theme.colors.surface},
          ]}>
          <View style={styles.personaInfoContainer}>
            {selectedPersona.image && (
              <Image 
                source={selectedPersona.image}
                style={styles.personaImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.personaInfo}>
              <Text style={[styles.personaName, {color: theme.colors.text}]}>
                {selectedPersona.name}
              </Text>
              <Text style={[styles.personaRating, {color: theme.colors.primary}]}>
                Rating: {selectedPersona.rating}
              </Text>
            </View>
          </View>
          <View style={styles.commentaryToggle}>
            <Text style={[styles.commentaryLabel, {color: theme.colors.text}]}>
              Commentary
            </Text>
            <Switch
              value={showCommentary}
              onValueChange={setShowCommentary}
              trackColor={{false: theme.colors.surfaceVariant, true: theme.colors.primary}}
            />
          </View>
        </View>

        <ESChessboard
          boardRef={chessboardRef}
          gestureEnabled={!isThinking && !isGameOver}
          onMove={handleMove}
          colors={{
            black: theme.colors.primary,
            white: theme.colors.secondary,
          }}
          boardSize={BOARD_SIZE}
        />

        <View
          style={[
            styles.infoContainer,
            {backgroundColor: theme.colors.surface},
          ]}>
          <View style={styles.statsRow}>
            <Text style={[styles.moveCount, {color: theme.colors.text}]}>
              Moves: {moves.length}
            </Text>
          </View>
          {isThinking && (
            <View style={styles.thinkingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={[styles.thinkingText, {color: theme.colors.text}]}>
                Thinking...
              </Text>
            </View>
          )}
          <Text style={[styles.moveMessage, {color: theme.colors.text}]}>
            {moveMessage}
          </Text>
          {showCommentary && currentCommentary && (
            <View style={styles.commentaryContainer}>
              <Text style={[styles.commentary, {color: theme.colors.primary}]}>
                {currentCommentary}
              </Text>
              <Text style={[styles.commentaryLabel, {color: theme.colors.surfaceVariant}]}>
                ✨ Commentary by AI
              </Text>
            </View>
          )}
          
          {/* Add Analysis Panel */}
          {!isGameOver && (
            <AnalysisPanel fen={gameRef.current.exportFEN()} />
          )}

          {!isGameOver && (
            <TouchableOpacity
              style={[
                styles.resignButton,
                {backgroundColor: theme.colors.error},
              ]}
              onPress={handleResign}
              disabled={isThinking}>
              <Text style={styles.resignButtonText}>Resign</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  personaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  personaInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  personaImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
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
  infoContainer: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,

  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moveCount: {
    fontSize: 16,
  },
  thinkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  thinkingText: {
    marginLeft: 10,
    fontSize: 16,
  },
  moveMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  resignButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  resignButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  commentaryToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentaryContainer: {
    marginVertical: 8,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  commentary: {
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 4,
  },
  commentaryLabel: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default ChessScreen; 