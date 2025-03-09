import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Switch, Animated, ScrollView } from 'react-native'
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { ScreenWrapper } from '../../../shared/components/ScreenWrapper'
import { useTheme } from '../../../shared/theme/ThemeContext'
import { fonts, textStyles } from '../../../shared/theme/typography'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width } = Dimensions.get('window')
const BOARD_SIZE = width * 0.85

const MOTIVATIONAL_MESSAGES = [
  "Great job! Keep going! 🎉",
  "You're crushing it! 🌟",
  "Amazing progress! 🚀",
  "You're a natural! ⭐",
  "Fantastic work! 🏆",
  "Keep up the momentum! 💫",
  "You're mastering this! 👑",
];

const SQUARES = [
  'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
  'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
  'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
  'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
  'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
  'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
  'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
  'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1',
];

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const SquareRecognitionScreen = () => {
  const { theme } = useTheme()
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [targetSquare, setTargetSquare] = useState('')
  const [showMotivation, setShowMotivation] = useState('')
  const [showLetters, setShowLetters] = useState(false)
  const [showNumbers, setShowNumbers] = useState(false)
  const motivationOpacity = useRef(new Animated.Value(0)).current

  // Load high score on component mount
  useEffect(() => {
    const loadHighScore = async () => {
      try {
        const storedHighScore = await AsyncStorage.getItem('squareRecognitionHighScore')
        if (storedHighScore) {
          setHighScore(parseInt(storedHighScore, 10))
        }
      } catch (error) {
        console.error('Error loading high score:', error)
      }
    }
    loadHighScore()
  }, [])

  // Update high score when score changes
  useEffect(() => {
    const updateHighScore = async () => {
      if (score > highScore) {
        try {
          await AsyncStorage.setItem('squareRecognitionHighScore', score.toString())
          setHighScore(score)
        } catch (error) {
          console.error('Error saving high score:', error)
        }
      }
    }
    updateHighScore()
  }, [score, highScore])

  const generateNewTarget = useCallback(() => {
    const newTarget = SQUARES[Math.floor(Math.random() * SQUARES.length)]
    setTargetSquare(newTarget)
  }, [])

  // Initialize the game
  React.useEffect(() => {
    generateNewTarget()
  }, [generateNewTarget])

  const animateMotivation = useCallback((message: string) => {
    setShowMotivation(message)
    Animated.sequence([
      Animated.timing(motivationOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2400),
      Animated.timing(motivationOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => setShowMotivation(''))
  }, [motivationOpacity])

  const handleSquarePress = useCallback((square: string) => {
    const isCorrect = square === targetSquare
    
    setScore(prev => {
      const newScore = prev + (isCorrect ? 1 : -1)
      
      // Show motivation on multiples of 7 (only for positive scores)
      if (newScore > 0 && newScore % 7 === 0) {
        const message = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
        animateMotivation(message)
      }
      
      return newScore
    })

    // Generate new target square
    generateNewTarget()
  }, [targetSquare, generateNewTarget, animateMotivation])

  // Create the 8x8 grid of squares
  const renderBoard = useMemo(() => {
    const squares = []
    for (let row = 0; row < 8; row++) {
      const squareRow = []
      for (let col = 0; col < 8; col++) {
        const isLightSquare = (row + col) % 2 === 0
        const square = SQUARES[row * 8 + col]
        
        squareRow.push(
          <TouchableOpacity
            key={square}
            style={[
              styles.square,
              {
                backgroundColor: isLightSquare ? theme.colors.secondary : theme.colors.primary,
              },
            ]}
            onPress={() => handleSquarePress(square)}
          >
            {(col === 0 && showNumbers) && (
              <Text style={[styles.rankLabel, { color: theme.colors.text }]}>
                {8 - row}
              </Text>
            )}
            {(row === 7 && showLetters) && (
              <Text style={[styles.fileLabel, { color: theme.colors.text }]}>
                {FILES[col]}
              </Text>
            )}
          </TouchableOpacity>
        )
      }
      squares.push(
        <View key={row} style={styles.row}>
          {squareRow}
        </View>
      )
    }
    return squares
  }, [theme.colors, handleSquarePress, showLetters, showNumbers])

  return (
    <ScreenWrapper title="Square Recognition" >
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={[styles.container]}>
        <View style={[styles.header, { backgroundColor: theme.colors.background, shadowColor: theme.colors.primary }]}>
          <Text style={[styles.score, { color: score < 0 ? theme.colors.error : theme.colors.text }]}>
            Score: {score}
          </Text>
          <Text style={[styles.highScore, { color: theme.colors.text }]}>
            High Score: {highScore}
          </Text>
          <Text style={[styles.challenge, { color: theme.colors.text }]}>
            Tap square {targetSquare}
          </Text>
        </View>

        <Animated.View style={[styles.motivationContainer, { opacity: motivationOpacity }]}>
          {showMotivation ? (
            <Text style={[styles.motivation, { color: theme.colors.primary }]}>
              {showMotivation}
            </Text>
          ) : null}
        </Animated.View>

        <View style={[styles.toggleContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.toggleItem}>
            <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>
              Show Letters
            </Text>
            <Switch
              style={styles.switch}
              value={showLetters}
              onValueChange={setShowLetters}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.background}
            />
          </View>
          <View style={styles.toggleItem}>
            <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>
              Show Numbers
            </Text>
            <Switch
              style={styles.switch}
              value={showNumbers}
              onValueChange={setShowNumbers}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.background}
            />
          </View>
        </View>

        <View style={[styles.board, { backgroundColor: theme.colors.primary }]}>
          {renderBoard}
        </View>
      </View>
      </ScrollView>
    </ScreenWrapper>
  )
}

export default SquareRecognitionScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
    width: '85%',
    alignSelf: 'center',
    borderRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  score: {
    ...textStyles.h4,
    fontFamily: fonts.secondary.bold,
    textAlign: 'center',
  },
  highScore: {
    ...textStyles.h4,
    fontFamily: fonts.secondary.bold,
    textAlign: 'center',
    marginTop: 5,
  },
  challenge: {
    ...textStyles.bodyLarge,
    textAlign: 'center',
    marginTop: 10,
  },
  motivationContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  motivation: {
    ...textStyles.getSecondaryStyle(textStyles.h5),
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    marginBottom: 20,
    width: '100%',
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    ...textStyles.bodySmall,
    marginRight: 8,
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    height: BOARD_SIZE / 8,
  },
  square: {
    width: BOARD_SIZE / 8,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankLabel: {
    ...textStyles.getSecondaryStyle(textStyles.bodySmall),
    position: 'absolute',
    left: 4,
    top: 2,
  },
  fileLabel: {
    ...textStyles.getSecondaryStyle(textStyles.bodySmall),
    position: 'absolute',
    right: 4,
    bottom: 2,
  },
  switch: {
    transform: [{scaleX: 0.7}, {scaleY: 0.7}],
  },
}) 