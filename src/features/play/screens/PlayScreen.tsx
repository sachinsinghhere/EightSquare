import React, {useRef, useState} from 'react';
import {View, StyleSheet, Dimensions, Image} from 'react-native';
import Chessboard, {ChessboardRef} from 'react-native-chessboard';
import {Chess, Square} from 'chess.js';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {themeChessboardImages} from '../../../shared/theme/theme';
import {MoveHistory} from '../components/MoveHistory';
import {ScreenWrapper} from '../../../shared/components/ScreenWrapper';
import {playMoveSound} from '../../../utils/sound';

const {width} = Dimensions.get('window');
const BOARD_SIZE = width - 32; // Full width minus padding

interface ChessMove {
  color: 'w' | 'b';
  from: Square;
  to: Square;
  flags: string;
  piece: string;
  san: string;
}

interface Move {
  raw: string;
  formatted: string;
}

export const PlayScreen: React.FC = () => {
  const chessboardRef = useRef<ChessboardRef>(null);
  const chessRef = useRef(new Chess());
  const {theme} = useTheme();
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isPrevMove, setIsPrevMove] = useState(false);

  const CHESSBOARD_STYLE = {
    Snow: {
      black: theme.colors.primary,
      white: theme.colors.secondary,
      lastMoveHighlight: 'rgba(255,255,255, 0.2)',
      checkmateHighlight: theme.colors.error,
      promotionPieceButton: theme.colors.success,
    },
  };

  const handleMove = (moveData: { move: ChessMove; state: any }) => {
    if (isPrevMove) return;
    if (!moveData.move) return;
    
    const rawMove = `${moveData.move.from}-${moveData.move.to}`;
    const formattedMove = moveData.move.san;
    
    // Only add new moves if we're at the end of the move list
    if (currentMoveIndex === moves.length - 1 || currentMoveIndex === -1) {
      const newMove: Move = {
        raw: rawMove,
        formatted: formattedMove,
      };
      const newMoves = [...moves, newMove];
      setMoves(newMoves);
      setCurrentMoveIndex(newMoves.length - 1);
      
      // Update chess instance
      chessRef.current.move({
        from: moveData.move.from,
        to: moveData.move.to,
      });

      // Play sound based on move type
      playMoveSound({
        _from: moveData.move.from,
        _to: moveData.move.to,
        isCapture: moveData.move.flags.includes('c'),
        isCheck: chessRef.current.in_check(),
        isCastle: moveData.move.flags.includes('k') || moveData.move.flags.includes('q'),
        isGameEnd: chessRef.current.game_over(),
      });
    }
  };

  const handleMoveSelect = async (index: number) => {
    setIsPrevMove(true);
    // Reset both chess instance and board
    chessRef.current.reset();
    await chessboardRef.current?.resetBoard();
    
    // Replay moves up to selected index
    for (let i = 0; i <= index; i++) {
      const [from, to] = moves[i].raw.split('-') as [Square, Square];
      chessRef.current.move({from, to});
      await chessboardRef.current?.move({from, to});
    }
    setIsPrevMove(false);
    
    setCurrentMoveIndex(index);
  };

  return (
    <ScreenWrapper title="Play" showBack={false}>
      <View style={styles.container}>
        <View
          style={[
            styles.boardContainer,
            {backgroundColor: theme.colors.background},
          ]}>
          <Chessboard
            ref={chessboardRef}
            onMove={handleMove}
            renderPiece={piece => (
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

        <View style={styles.moveHistoryContainer}>
          <MoveHistory
            moves={moves.map(m => m.formatted)}
            currentMoveIndex={currentMoveIndex}
            onMoveSelect={handleMoveSelect}
          />
        </View>
      </View>
    </ScreenWrapper>
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
  moveHistoryContainer: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: 8,
  },
});
