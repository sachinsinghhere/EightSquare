import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from 'react-native'
import React, { useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../shared/theme/ThemeContext'
import { textStyles } from '../../../shared/theme/typography'
import Chessboard, { ChessboardRef } from 'react-native-chessboard'
import { Chess } from 'chess.js'
import { themeChessboardImages } from '../../../shared/theme/theme'

const { width } = Dimensions.get('window')
const BOARD_SIZE = width - 32

const VisionTrainingScreen = () => {
  const { theme } = useTheme()
  const [selectedMode, setSelectedMode] = useState<'pieces' | 'squares' | null>(null)
  const [currentChallenge, setCurrentChallenge] = useState<string>('')
  const [score, setScore] = useState(0)
  const chessboardRef = useRef<ChessboardRef>(null)
  const chessRef = useRef(new Chess())

  const modes = [
    {
      title: 'Piece Movement',
      description: 'Practice moving pieces to specific squares',
      icon: '♟️',
      mode: 'pieces' as const
    },
    {
      title: 'Square Recognition',
      description: 'Identify and tap specific squares on the board',
      icon: '🎯',
      mode: 'squares' as const
    }
  ]

  const handleModeSelect = (mode: 'pieces' | 'squares') => {
    setSelectedMode(mode)
    generateNewChallenge(mode)
  }

  const generateNewChallenge = (mode: 'pieces' | 'squares') => {
    if (mode === 'pieces') {
      const pieces = ['♟️', '♞', '♝', '♜', '♛', '♚']
      const squares = ['e4', 'h8', 'g5', 'f3', 'c6', 'd4']
      const piece = pieces[Math.floor(Math.random() * pieces.length)]
      const square = squares[Math.floor(Math.random() * squares.length)]
      setCurrentChallenge(`Move ${piece} to ${square}`)
    } else {
      const squares = ['a1', 'b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8']
      setCurrentChallenge(`Tap square ${squares[Math.floor(Math.random() * squares.length)]}`)
    }
  }

  const CHESSBOARD_STYLE = {
    Snow: {
      black: theme.colors.primary,
      white: theme.colors.secondary,
      lastMoveHighlight: 'rgba(255,255,255, 0.2)',
      checkmateHighlight: theme.colors.error,
      promotionPieceButton: theme.colors.success,
    },
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {!selectedMode ? (
        <>
          <View style={styles.modesContainer}>
            {modes.map((mode, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.modeCard, { backgroundColor: theme.colors.card }]}
                onPress={() => handleModeSelect(mode.mode)}
              >
                <Text style={styles.modeIcon}>{mode.icon}</Text>
                <View style={styles.modeInfo}>
                  <Text style={[styles.modeTitle, { color: theme.colors.text, fontFamily: 'CormorantGaramond-Medium' }]}>{mode.title}</Text>
                  <Text style={[styles.modeDescription, { color: theme.colors.text, fontFamily: 'Roboto-Regular' }]}>{mode.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.challengeContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: theme.colors.card }]}
              onPress={() => setSelectedMode(null)}
            >
              <Text style={[styles.backButtonText, { color: theme.colors.text }]}>←</Text>
            </TouchableOpacity>
            <Text style={[styles.score, { color: theme.colors.text }]}>Score: {score}</Text>
          </View>
          
          <Text style={[styles.challenge, { color: theme.colors.text }]}>{currentChallenge}</Text>
          
          <View style={[styles.boardContainer, { backgroundColor: theme.colors.background }]}>
            <Chessboard
              ref={chessboardRef}
              colors={CHESSBOARD_STYLE.Snow}
              boardSize={BOARD_SIZE}
              renderPiece={(piece) => (
                <Image
                  style={{
                    width: BOARD_SIZE / 8,
                    height: BOARD_SIZE / 8,
                  }}
                  source={themeChessboardImages[theme.name.toLowerCase()][piece]}
                />
              )}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

export default VisionTrainingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  modesContainer: {
    padding: 12,
  },
  modeCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modeIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 20,
    marginBottom: 4,
    fontWeight: '500',
  },
  modeDescription: {
    fontSize: 13,
    opacity: 0.8,
  },
  challengeContainer: {
    flex: 1,
  },
  score: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'CormorantGaramond-Bold',
  },
  challenge: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 16,
    fontFamily: 'Roboto-Regular',
  },
  boardContainer: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: '600',
  }
}) 