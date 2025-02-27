import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../shared/theme/ThemeContext';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { textStyles, combineStyles } from '../shared/theme/typography';

const { width } = Dimensions.get('window');

interface RouteParams {
  minutes: number;
  increment: number;
}

const ChessTimer = () => {
  const route = useRoute();
  const { minutes, increment } = route.params as RouteParams;
  const {theme} = useTheme();

  const [isRunning, setIsRunning] = useState(false);
  const [activePlayer, setActivePlayer] = useState<'top' | 'bottom' | null>(null);
  const [topTime, setTopTime] = useState(minutes * 60);
  const [bottomTime, setBottomTime] = useState(minutes * 60);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'top' | 'bottom' | null>(null);

  const topScale = useSharedValue(1);
  const bottomScale = useSharedValue(1);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && activePlayer && !gameOver) {
      interval = setInterval(() => {
        if (activePlayer === 'top') {
          setTopTime(prev => {
            if (prev <= 1) {
              setGameOver(true);
              setWinner('bottom');
              setIsRunning(false);
              return 0;
            }
            return Math.max(0, prev - 1);
          });
        } else {
          setBottomTime(prev => {
            if (prev <= 1) {
              setGameOver(true);
              setWinner('top');
              setIsRunning(false);
              return 0;
            }
            return Math.max(0, prev - 1);
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, activePlayer, gameOver]);

  const handlePress = (player: 'top' | 'bottom') => {
    if (gameOver) return;
    
    if (!isRunning) {
      setIsRunning(true);
      setActivePlayer(player);
      return;
    }

    if (activePlayer === player) return;

    // Add increment to the player who just moved
    if (activePlayer === 'top') {
      setTopTime(prev => prev + increment);
      topScale.value = withSequence(
        withSpring(0.95),
        withSpring(1)
      );
    } else {
      setBottomTime(prev => prev + increment);
      bottomScale.value = withSequence(
        withSpring(0.95),
        withSpring(1)
      );
    }

    setActivePlayer(player);
  };

  const topAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: topScale.value }],
  }));

  const bottomAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bottomScale.value }],
  }));

  const gameOverAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(gameOver ? 1 : 0),
    transform: [{ scale: withSpring(gameOver ? 1 : 0.8) }],
  }));

  const resetGame = useCallback(() => {
    setIsRunning(false);
    setActivePlayer(null);
    setTopTime(minutes * 60);
    setBottomTime(minutes * 60);
    setGameOver(false);
    setWinner(null);
  }, [minutes]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <StatusBar hidden />
      <TouchableOpacity
        style={[
          styles.playerSection,
          styles.topSection,
          { backgroundColor: theme.colors.card },
          activePlayer === 'top' && [styles.activeSection, { backgroundColor: theme.colors.primary }],
        ]}
        onPress={() => handlePress('top')}
        disabled={gameOver}
      >
        <Animated.View style={[styles.timeContainer, topAnimatedStyle]}>
          <Text style={[
            styles.time,
            { color: theme.colors.text },
            activePlayer === 'top' && { color: theme.colors.background },
          ]}>
            {formatTime(topTime)}
          </Text>
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: theme.colors.primary }]}
          onPress={resetGame}
        >
          <Icon name="refresh" size={24} color={theme.colors.background} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.playerSection,
          styles.bottomSection,
          { backgroundColor: theme.colors.card },
          activePlayer === 'bottom' && [styles.activeSection, { backgroundColor: theme.colors.primary }],
        ]}
        onPress={() => handlePress('bottom')}
        disabled={gameOver}
      >
        <Animated.View style={[styles.timeContainer, bottomAnimatedStyle]}>
          <Text style={[
            styles.time,
            { color: theme.colors.text },
            activePlayer === 'bottom' && { color: theme.colors.background },
          ]}>
            {formatTime(bottomTime)}
          </Text>
        </Animated.View>
      </TouchableOpacity>

      {gameOver && (
        <Animated.View 
          style={[styles.gameOverContainer, gameOverAnimatedStyle]}
          entering={FadeInDown}
        >
          <View style={[styles.gameOverCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.gameOverTitle, { color: theme.colors.text }]}>
              Game Over!
            </Text>
            <Text style={[styles.gameOverSubtitle, { color: theme.colors.primary }]}>
              {winner === 'top' ? 'Top' : 'Bottom'} player wins!
            </Text>
            <TouchableOpacity
              style={[styles.restartButton, { backgroundColor: theme.colors.primary }]}
              onPress={resetGame}
            >
              <Text style={[styles.restartButtonText, { color: theme.colors.background }]}>
                Play Again
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  playerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    transform: [{ rotate: '180deg' }],
  },
  bottomSection: {},
  activeSection: {},
  timeContainer: {
    padding: 20,
    borderRadius: 16,
    minWidth: width * 0.6,
    alignItems: 'center',
  },
  time: {
    ...combineStyles(
      textStyles.h1,
      textStyles.getSecondaryStyle(textStyles.h1),
      { fontVariant: ['tabular-nums'] }
    ),
  },
  controls: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -25 },
      { translateY: -25 },
    ],
    zIndex: 10,
  },
  resetButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  gameOverCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: width * 0.8,
  },
  gameOverTitle: {
    ...textStyles.h2,
    marginBottom: 8,
  },
  gameOverSubtitle: {
    ...textStyles.h4,
    marginBottom: 24,
  },
  restartButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  restartButtonText: {
    ...textStyles.button,
  },
});

export default ChessTimer; 