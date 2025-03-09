import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
  BackHandler,
} from 'react-native';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {ScreenWrapper} from '../../../shared/components/ScreenWrapper';
import {useRoute, useNavigation} from '@react-navigation/native';
import {Game} from 'js-chess-engine';
import type {Move} from 'chess.js';
import ESChessboard from '../../../shared/components/ESChessboard';
import type {ChessboardRef} from 'react-native-chessboard';
import {ChessState, playMoveSound} from '../../../utils/sounds';
import {textStyles} from '../../../shared/theme/typography';

interface ChessMoveInfo {
  move: Move;
  state: ChessState;
}

interface RouteParams {
  minutes: number;
  increment: number;
}

interface GameState {
  isFinished: boolean;
  checkMate: boolean;
  pieces: {
    [key: string]: string;
  };
}

const PlayerClock = ({
  time,
  isActive,
  playerColor,
  theme,
  onResign,
  onDraw,
  isGameOver,
}: {
  time: number;
  isActive: boolean;
  playerColor: string;
  theme: any;
  onResign: () => void;
  onDraw: () => void;
  isGameOver: boolean;
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View
      style={[
        styles.clockContainer,
        {
          backgroundColor: isActive ? theme.colors.primary + '10' : 'transparent',
          borderColor: isActive ? theme.colors.primary : theme.colors.border,
        },
      ]}>
      <View style={styles.clockInnerContainer}>
        <View style={styles.playerSection}>
          <Text style={[textStyles.bodyMedium, {color: theme.colors.text}]}>
            {playerColor}
          </Text>
          <Text
            style={[
              textStyles.h5,
              {
                color: isActive ? theme.colors.primary : theme.colors.text,
              },
            ]}>
            {formatTime(time)}
          </Text>
        </View>
        <View style={styles.controlsSection}>
          <TouchableOpacity
            style={[
              styles.miniButton,
              {
                backgroundColor: theme.colors.error,
                opacity: isGameOver ? 0.5 : 1,
              },
            ]}
            onPress={onResign}
            disabled={isGameOver}>
            <Text style={[textStyles.caption, styles.buttonText]}>Resign</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.miniButton,
              {
                backgroundColor: theme.colors.primary + 'CC',
                opacity: isGameOver ? 0.5 : 1,
                marginLeft: 8,
              },
            ]}
            onPress={onDraw}
            disabled={isGameOver}>
            <Text style={[textStyles.caption, styles.buttonText]}>Draw</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const GameScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {minutes, increment} = route.params as RouteParams;
  const {theme} = useTheme();
  const {width} = useWindowDimensions();
  const BOARD_SIZE = width - 32;

  const [whiteTime, setWhiteTime] = useState(minutes * 60);
  const [blackTime, setBlackTime] = useState(minutes * 60);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<'white' | 'black' | 'draw' | null>(null);

  const chessboardRef = useRef<ChessboardRef>(null);
  const gameRef = useRef(new Game());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle game over
  const handleGameOver = useCallback((result: 'white' | 'black' | 'draw') => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsGameOver(true);
    setWinner(result);
  }, []);

  // Start timer for current player
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      if (currentPlayer === 'white') {
        setWhiteTime(prev => {
          if (prev <= 1) {
            handleGameOver('black');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            handleGameOver('white');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
  }, [currentPlayer, handleGameOver]);

  // Start timer on mount
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTimer]);

  // Handle move
  const handleMove = useCallback(
    ({move,state}: ChessMoveInfo) => {
      if (isGameOver) return;
      console.log('move', move, state);
      
      playMoveSound(move, state);
      try {
        gameRef.current.move(move.from.toUpperCase(), move.to.toUpperCase());
        const afterState = gameRef.current.exportJson() as GameState;

        // Add increment to the player who just moved
        if (currentPlayer === 'white') {
          setWhiteTime(prev => prev + increment);
        } else {
          setBlackTime(prev => prev + increment);
        }

        // Play move sound
        const isCapture = afterState.pieces[move.to.toUpperCase()] !== undefined;
        const isCheck = false; // Since js-chess-engine doesn't provide check status
        const isCastle =
          (move.from.toLowerCase() === 'e1' &&
            (move.to.toLowerCase() === 'g1' || move.to.toLowerCase() === 'c1')) ||
          (move.from.toLowerCase() === 'e8' &&
            (move.to.toLowerCase() === 'g8' || move.to.toLowerCase() === 'c8'));

        playMoveSound(move.from, move.to, isCapture, isCheck, isCastle);

        // Switch player and start their timer
        setCurrentPlayer(prev => (prev === 'white' ? 'black' : 'white'));
        startTimer();

        // Check for game end
        if (afterState.isFinished) {
          handleGameOver(afterState.checkMate ? currentPlayer : 'draw');
        }
      } catch (error) {
        console.error('Move error:', error);
        chessboardRef.current?.resetBoard();
      }
    },
    [currentPlayer, increment, isGameOver, startTimer, handleGameOver],
  );

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
            handleGameOver(currentPlayer === 'white' ? 'black' : 'white');
          },
        },
      ],
    );
  }, [currentPlayer, handleGameOver]);

  // Handle draw offer
  const handleDrawOffer = useCallback(() => {
    Alert.alert(
      'Offer Draw',
      'Are you sure you want to offer a draw?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Offer Draw',
          onPress: () => {
            Alert.alert(
              'Draw Offer',
              `${
                currentPlayer === 'white' ? 'Black' : 'White'
              } player, do you accept the draw offer?`,
              [
                {
                  text: 'Decline',
                  style: 'cancel',
                },
                {
                  text: 'Accept',
                  onPress: () => handleGameOver('draw'),
                },
              ],
            );
          },
        },
      ],
    );
  }, [currentPlayer, handleGameOver]);

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
              handleGameOver(currentPlayer === 'white' ? 'black' : 'white');
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
              handleGameOver(currentPlayer === 'white' ? 'black' : 'white');
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
  }, [navigation, isGameOver, handleGameOver, currentPlayer]);

  return (
    <ScreenWrapper title="Chess Game" showBack>
      <View style={styles.container}>
        <PlayerClock
          time={blackTime}
          isActive={currentPlayer === 'black'}
          playerColor="Black"
          theme={theme}
          onResign={handleResign}
          onDraw={handleDrawOffer}
          isGameOver={isGameOver}
        />

        <ESChessboard
          boardRef={chessboardRef}
          boardSize={BOARD_SIZE}
          onMove={handleMove}
        />

        <PlayerClock
          time={whiteTime}
          isActive={currentPlayer === 'white'}
          playerColor="White"
          theme={theme}
          onResign={handleResign}
          onDraw={handleDrawOffer}
          isGameOver={isGameOver}
        />

        {isGameOver && (
          <View
            style={[
              styles.gameOverContainer,
              {backgroundColor: theme.colors.surface},
            ]}>
            <Text
              style={[
                textStyles.h3,
                styles.gameOverText,
                {color: theme.colors.text},
              ]}>
              Game Over!{' '}
              {winner === 'draw'
                ? "It's a draw!"
                : `${winner?.toUpperCase()} wins!`}
            </Text>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockContainer: {
    marginVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: '100%',
  },
  clockInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  playerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlsSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 48,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  gameOverContainer: {
    position: 'absolute',
    top: '50%',
    left: 16,
    right: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    transform: [{translateY: -50}],
  },
  gameOverText: {
    textAlign: 'center',
  },
});

export default GameScreen; 