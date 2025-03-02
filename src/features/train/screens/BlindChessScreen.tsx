import { StyleSheet, Text, View, TouchableOpacity, Switch, Dimensions, Image } from 'react-native'
import React, { useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../shared/theme/ThemeContext'
import Chessboard, { ChessboardRef } from 'react-native-chessboard'
import { Chess } from 'chess.js'
import { themeChessboardImages } from '../../../shared/theme/theme'

const { width } = Dimensions.get('window')
const BOARD_SIZE = width - 32

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

const BlindChessScreen = () => {
  const { theme } = useTheme()
  const [showPieces, setShowPieces] = useState(true)
  const [showCoordinates, setShowCoordinates] = useState(true)
  const chessboardRef = useRef<ChessboardRef>(null)
  const chessRef = useRef(new Chess())

  const CHESSBOARD_STYLE = {
    Snow: {
      black: theme.colors.primary,
      white: theme.colors.secondary,
      lastMoveHighlight: 'rgba(255,255,255, 0.2)',
      checkmateHighlight: theme.colors.error,
      promotionPieceButton: theme.colors.success,
    },
  }

  const handleMove = (moveData: { move: ChessMove; state: ChessState }) => {
    if (!moveData.move) return;
    
    chessRef.current.move({
      from: moveData.move.from,
      to: moveData.move.to,
    });
  }

  const handleReset = async () => {
    chessRef.current.reset();
    await chessboardRef.current?.resetBoard();
  }

  const handleFlip = () => {
    chessboardRef.current?.flipBoard();
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Blind Chess</Text>
      </View>
      
      <View style={[styles.settingsContainer, { backgroundColor: theme.colors.card }]}>
        <View style={styles.settingRow}>
          <Text style={[styles.settingText, { color: theme.colors.text }]}>Show Pieces</Text>
          <Switch
            value={showPieces}
            onValueChange={setShowPieces}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={[styles.settingText, { color: theme.colors.text }]}>Show Coordinates</Text>
          <Switch
            value={showCoordinates}
            onValueChange={setShowCoordinates}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          />
        </View>
      </View>

      <View style={[styles.boardContainer, { backgroundColor: theme.colors.background }]}>
        <Chessboard
          ref={chessboardRef}
          onMove={handleMove}
          colors={CHESSBOARD_STYLE.Snow}
          boardSize={BOARD_SIZE}
          renderPiece={(piece) => (
            <Image
              style={{
                width: BOARD_SIZE / 8,
                height: BOARD_SIZE / 8,
                opacity: showPieces ? 1 : 0,
              }}
              source={themeChessboardImages[theme.name.toLowerCase()][piece]}
            />
          )}
          showCoordinates={showCoordinates}
        />
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleReset}
        >
          <Text style={[styles.buttonText, { color: theme.colors.background }]}>Reset</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleFlip}
        >
          <Text style={[styles.buttonText, { color: theme.colors.background }]}>Flip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default BlindChessScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'CormorantGaramond-Bold',
  },
  settingsContainer: {
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingText: {
    fontSize: 14,
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
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginTop: 16,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  }
}) 