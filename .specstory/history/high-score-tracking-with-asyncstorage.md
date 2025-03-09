## SpecStory

## High Score Tracking with AsyncStorage (3/9/2025, 1:42:07 PM)

_**User**_

On both screens create a method that keeps the track of highest score achived by player and persist it using asyncstorage, this is installed already, 

by default it will be 0 if user score 10 then it's a new highscore if he scores 12 next time it will update to 12.


---

_**Assistant**_

I'll help you add high score tracking to both screens using AsyncStorage. First, let me search for any existing high score implementations.

---

_**Assistant**_



---

_**Assistant**_

I see that AsyncStorage is already installed and being used in the project. Let me implement the high score tracking for both screens. I'll start with the SquareRecognitionScreen.

---

_**Assistant**_

```
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Switch, Animated } from 'react-native'
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { ScreenWrapper } from '../../../shared/components/ScreenWrapper'
import { useTheme } from '../../../shared/theme/ThemeContext'
import { fonts, textStyles } from '../../../shared/theme/typography'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width } = Dimensions.get('window')
const BOARD_SIZE = width * 0.85

const MOTIVATIONAL_MESSAGES = [
// ... existing code ...

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
// ... existing code ...

  return (
    <ScreenWrapper title="Square Recognition">
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
// ... existing code ...

const styles = StyleSheet.create({
  // ... existing styles ...
  highScore: {
    ...textStyles.h4,
    fontFamily: fonts.secondary.bold,
    textAlign: 'center',
    marginTop: 5,
  },
  // ... existing styles ...
})
```

---

_**Assistant**_

Now let's implement the same functionality for the PieceMovementScreen.

---

_**Assistant**_

```
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Switch,
  ScrollView,
} from 'react-native';
import React, {useState, useRef, useCallback, useMemo, useEffect} from 'react';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {ChessboardRef} from 'react-native-chessboard';
import {Chess, PieceType, Square} from 'chess.js';
import ESChessboard from '../../../shared/components/ESChessboard';
import {ScreenWrapper} from '../../../shared/components/ScreenWrapper';
import { textStyles } from '../../../shared/theme/typography';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ... existing code ...

const PieceMovementScreen = () => {
  const {theme} = useTheme();
  const [currentChallenge, setCurrentChallenge] = useState<string>('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showMotivation, setShowMotivation] = useState<string>('');
  const [showLetters, setShowLetters] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const chessboardRef = useRef<ChessboardRef>(null);
  const chessRef = useRef(new Chess());
  const [targetMove, setTargetMove] = useState<{
    from: string;
    to: string;
  } | null>(null);

  // Load high score on component mount
  useEffect(() => {
    const loadHighScore = async () => {
      try {
        const storedHighScore = await AsyncStorage.getItem('pieceMovementHighScore');
        if (storedHighScore) {
          setHighScore(parseInt(storedHighScore, 10));
        }
      } catch (error) {
        console.error('Error loading high score:', error);
      }
    };
    loadHighScore();
  }, []);

  // Update high score when score changes
  useEffect(() => {
    const updateHighScore = async () => {
      if (score > highScore) {
        try {
          await AsyncStorage.setItem('pieceMovementHighScore', score.toString());
          setHighScore(score);
        } catch (error) {
          console.error('Error saving high score:', error);
        }
      }
    };
    updateHighScore();
  }, [score, highScore]);

  // ... rest of existing code ...

  return (
    <ScreenWrapper title="Piece Movement">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.colors.background,
              shadowColor: theme.colors.primary,
            },
          ]}>
          <Text
            style={[
              styles.score,
              {color: score < 0 ? theme.colors.error : theme.colors.text},
            ]}>
            Score: {score}
          </Text>
          <Text
            style={[
              styles.highScore,
              {color: theme.colors.text},
            ]}>
            High Score: {highScore}
          </Text>
          <Text style={[styles.challenge, {color: theme.colors.text}]}>
            {currentChallenge}
          </Text>
        </View>

        // ... rest of existing code ...

const styles = StyleSheet.create({
  // ... existing styles ...
  highScore: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'CormorantGaramond-Bold',
    marginTop: 5,
  },
  // ... rest of existing styles ...
});
```

---

_**Assistant**_

I've implemented high score tracking for both the SquareRecognitionScreen and PieceMovementScreen. Here's what I've added to each screen:

1. A new state variable `highScore` to track the highest score achieved
2. A useEffect hook to load the high score from AsyncStorage when the component mounts
3. A useEffect hook to update the high score in AsyncStorage whenever the current score exceeds the high score
4. A visual display of the high score in the header section of each screen
5. Proper error handling for AsyncStorage operations

The high scores are stored with unique keys for each screen:
- `squareRecognitionHighScore` for the Square Recognition screen
- `pieceMovementHighScore` for the Piece Movement screen

The high score will persist between app sessions and will only update when the player achieves a new high score. The high score is displayed prominently alongside the current score, giving players a goal to strive for.

Would you like me to make any adjustments to the implementation?

---



---

