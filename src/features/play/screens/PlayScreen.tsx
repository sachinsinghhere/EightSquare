import React, {useRef, useState} from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity, Text, Image} from 'react-native';
import Chessboard, {ChessboardRef} from 'react-native-chessboard';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {themeChessboardImages} from '../../../shared/theme/theme';
import {MoveHistory} from '../components/MoveHistory';

const {width} = Dimensions.get('window');
const BOARD_SIZE = width - 32; // Full width minus padding

interface Move {
  raw: string;
  formatted: string;
}

export const PlayScreen: React.FC = () => {
  const chessboardRef = useRef<ChessboardRef>(null);
  const {theme} = useTheme();
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [allowPlayFromMove, setAllowPlayFromMove] = useState(true);

  const CHESSBOARD_STYLE = {
    Snow: {
      black: theme.colors.primary,
      white: theme.colors.secondary,
      lastMoveHighlight: 'rgba(255,255,255, 0.2)',
      checkmateHighlight: theme.colors.error,
      promotionPieceButton: theme.colors.success,
    },
  };

  const handleMove = (state:any) => {
    console.log('state', state);
    if (!state.history || state.history.length === 0) return;
    
    // Get the last move details
    const rawMove = state.history[state.history.length - 1];
    
    // Only add the move if we're at the end of the move list
    if (currentMoveIndex === moves.length - 1 || currentMoveIndex === -1) {
      const newMove: Move = {
        raw: rawMove,
        formatted: rawMove.replace('-', ' → '),
      };
      const newMoves = [...moves, newMove];
      setMoves(newMoves);
      setCurrentMoveIndex(newMoves.length - 1);
    }
  };

  const handleMoveSelect = async (index: number) => {
    if (!allowPlayFromMove) return;
    
    // Reset board
    await chessboardRef.current?.resetBoard();
    
    // Replay moves up to selected index
    for (let i = 0; i <= index; i++) {
      const [from, to] = moves[i].raw.split('-');
      await chessboardRef.current?.move({from, to});
    }
    
    setCurrentMoveIndex(index);
  };

  const handleReset = () => {
    chessboardRef?.current?.resetBoard();
    setMoves([]);
    setCurrentMoveIndex(-1);
  };

  const handlePrevMove = () => {
    if (currentMoveIndex > 0) {
      handleMoveSelect(currentMoveIndex - 1);
    }
  };

  const handleNextMove = () => {
    if (currentMoveIndex < moves.length - 1) {
      handleMoveSelect(currentMoveIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.boardContainer, {backgroundColor: theme.colors.background}]}>
        <Chessboard
          ref={chessboardRef}
          onMove={handleMove}
          renderPiece={(piece) => (
            <Image
              style={{
                width: BOARD_SIZE / 8,
                height: BOARD_SIZE / 8,
              }}
              source={themeChessboardImages[theme.name.toLowerCase()][piece]}
            />
          )}
          colors={CHESSBOARD_STYLE.Snow}
          boardSize={BOARD_SIZE}
        />
      </View>
      
      <View style={styles.controlsContainer}>
        <MoveHistory
          moves={moves.map(m => m.formatted)}
          currentMoveIndex={currentMoveIndex}
          onMoveSelect={handleMoveSelect}
          allowPlayFromMove={allowPlayFromMove}
        />
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: theme.colors.primary}]}
            onPress={handleReset}>
            <Text style={[styles.buttonText, {color: theme.colors.background}]}>
              Reset
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, {backgroundColor: theme.colors.primary}]}
            onPress={() => setAllowPlayFromMove(!allowPlayFromMove)}>
            <Text style={[styles.buttonText, {color: theme.colors.background}]}>
              {allowPlayFromMove ? "Lock Moves" : "Unlock Moves"}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[
              styles.navButton,
              {backgroundColor: theme.colors.primary},
              currentMoveIndex <= 0 && styles.disabledButton,
            ]}
            onPress={handlePrevMove}
            disabled={currentMoveIndex <= 0}>
            <Text style={[styles.buttonText, {color: theme.colors.background}]}>
              ← Prev
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.navButton,
              {backgroundColor: theme.colors.primary},
              currentMoveIndex >= moves.length - 1 && styles.disabledButton,
            ]}
            onPress={handleNextMove}
            disabled={currentMoveIndex >= moves.length - 1}>
            <Text style={[styles.buttonText, {color: theme.colors.background}]}>
              Next →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
  },
  boardContainer: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  controlsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
