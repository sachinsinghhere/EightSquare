import React, {useRef, useState} from 'react';
import {View, StyleSheet, Dimensions, Image} from 'react-native';
import Chessboard, {ChessboardRef} from 'react-native-chessboard';
import {Chess} from 'chess.js';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {themeChessboardImages} from '../../../shared/theme/theme';
import {MoveHistory} from '../components/MoveHistory';

const {width} = Dimensions.get('window');
const BOARD_SIZE = width - 32; // Full width minus padding

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
  in_promotion: boolean;
}

interface Move {
  raw: string;
  formatted: string;
}

const PIECE_SYMBOLS: Record<string, string> = {
  k: '♔',
  q: '♕',
  r: '♖',
  b: '♗',
  n: '♘',
  p: '♙',
};

const formatChessMove = (move: ChessMove): string => {
  // Combine both notations for better UX
  const pieceSymbol = move.piece !== 'p' ? PIECE_SYMBOLS[move.piece] : '';
  return `${pieceSymbol}${move.san}`;
};

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

  const handleMove = (moveData: { move: ChessMove; state: ChessState }) => {
    if (isPrevMove) return;
    if (!moveData.move) return;
    
    const rawMove = `${moveData.move.from}-${moveData.move.to}`;
    const formattedMove = formatChessMove(moveData.move);
    
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
    }
  };

  const handleMoveSelect = async (index: number) => {
    setIsPrevMove(true);
    // Reset both chess instance and board
    chessRef.current.reset();
    await chessboardRef.current?.resetBoard();
    
    // Replay moves up to selected index
    for (let i = 0; i <= index; i++) {
      const [from, to] = moves[i].raw.split('-');
      chessRef.current.move({from, to});
      await chessboardRef.current?.move({from, to});
    }
    setIsPrevMove(false);
    
    setCurrentMoveIndex(index);
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
      
      <View style={styles.moveHistoryContainer}>
        <MoveHistory
          moves={moves.map(m => m.formatted)}
          currentMoveIndex={currentMoveIndex}
          onMoveSelect={handleMoveSelect}
        />
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
  moveHistoryContainer: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: 8,
  },
});
