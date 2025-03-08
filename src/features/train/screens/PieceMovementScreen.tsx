import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Switch,
  ScrollView,
} from 'react-native';
import React, {useState, useRef, useCallback, useMemo} from 'react';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {ChessboardRef} from 'react-native-chessboard';
import {Chess, PieceType, Square} from 'chess.js';
import ESChessboard from '../../../shared/components/ESChessboard';
import {ScreenWrapper} from '../../../shared/components/ScreenWrapper';
import { textStyles } from '../../../shared/theme/typography';

const {width} = Dimensions.get('window');
const BOARD_SIZE = width * 0.85;

const MOTIVATIONAL_MESSAGES = [
  'Great job! Keep going! 🎉',
  "You're crushing it! 🌟",
  'Amazing progress! 🚀',
  "You're a natural! ⭐",
  'Fantastic work! 🏆',
  'Keep up the momentum! 💫',
  "You're mastering this! 👑",
];

type ChessMoveInfo = {
  move: {
    from: string;
    to: string;
  };
};

const PieceMovementScreen = () => {
  const {theme} = useTheme();
  const [currentChallenge, setCurrentChallenge] = useState<string>('');
  const [score, setScore] = useState(0);
  const [showMotivation, setShowMotivation] = useState<string>('');
  const [showLetters, setShowLetters] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const chessboardRef = useRef<ChessboardRef>(null);
  const chessRef = useRef(new Chess());
  const [targetMove, setTargetMove] = useState<{
    from: string;
    to: string;
  } | null>(null);

  const SQUARES = useMemo(
    () =>
      [
        'a1',
        'b1',
        'c1',
        'd1',
        'e1',
        'f1',
        'g1',
        'h1',
        'a2',
        'b2',
        'c2',
        'd2',
        'e2',
        'f2',
        'g2',
        'h2',
        'a3',
        'b3',
        'c3',
        'd3',
        'e3',
        'f3',
        'g3',
        'h3',
        'a4',
        'b4',
        'c4',
        'd4',
        'e4',
        'f4',
        'g4',
        'h4',
        'a5',
        'b5',
        'c5',
        'd5',
        'e5',
        'f5',
        'g5',
        'h5',
        'a6',
        'b6',
        'c6',
        'd6',
        'e6',
        'f6',
        'g6',
        'h6',
        'a7',
        'b7',
        'c7',
        'd7',
        'e7',
        'f7',
        'g7',
        'h7',
        'a8',
        'b8',
        'c8',
        'd8',
        'e8',
        'f8',
        'g8',
        'h8',
      ] as const,
    [],
  );

  const getPieceName = (piece: PieceType) => {
    const pieceNames: {[key in PieceType]: string} = {
      p: '♟️ Pawn',
      n: '♞ Knight',
      b: '♝ Bishop',
      r: '♜ Rook',
      q: '♛ Queen',
      k: '♚ King',
    };
    return pieceNames[piece];
  };

  const generateNewChallenge = useCallback(() => {
    if (!chessRef.current) return;

    chessRef.current.clear();

    // Place 2-3 random pieces
    const numPieces = Math.floor(Math.random() * 2) + 2;
    const pieces = ['n', 'b', 'r', 'q'] as const; // Only use pieces that can move multiple squares
    const colors = ['w', 'b'] as const;
    const squares = [...SQUARES].sort(() => Math.random() - 0.5);

    for (let i = 0; i < numPieces; i++) {
      if (squares.length === 0) break;

      const piece = pieces[Math.floor(Math.random() * pieces.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const square = squares.pop()!;

      chessRef.current.put(
        {type: piece as PieceType, color: color},
        square as Square,
      );
    }

    // Get all possible moves
    const possibleMoves = chessRef.current.moves({verbose: true});

    if (possibleMoves.length === 0) {
      generateNewChallenge();
      return;
    }

    // Select a random target move
    const move =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    setTargetMove({from: move.from, to: move.to});

    // Create challenge text
    const pieceAt = chessRef.current.get(move.from);
    if (pieceAt) {
      setCurrentChallenge(
        `Move the ${getPieceName(pieceAt.type)} from ${move.from} to ${
          move.to
        }`,
      );
    }

    chessboardRef.current?.resetBoard(chessRef.current.fen());
  }, [SQUARES]);

  const handleMove = useCallback(
    (info: ChessMoveInfo) => {
      if (!targetMove) return;

      const isCorrectMove =
        info.move.from === targetMove.from && info.move.to === targetMove.to;

      // Update score
      setScore(prev => {
        const newScore = prev + (isCorrectMove ? 1 : -1);

        // Show motivation on multiples of 7 (only for positive scores)
        if (newScore > 0 && newScore % 7 === 0) {
          const message =
            MOTIVATIONAL_MESSAGES[
              Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)
            ];
          setShowMotivation(message);
          setTimeout(() => setShowMotivation(''), 3000);
        }

        return newScore;
      });

      // Generate new challenge regardless of move correctness
      generateNewChallenge();
    },
    [targetMove, generateNewChallenge],
  );

  // Initial challenge
  React.useEffect(() => {
    generateNewChallenge();
  }, [generateNewChallenge]);

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
          <Text style={[styles.challenge, {color: theme.colors.text}]}>
            {currentChallenge}
          </Text>
        </View>

        <View style={[styles.motivationContainer]}>
          {showMotivation ? (
            <Text style={[styles.motivation, {color: theme.colors.primary}]}>
              {showMotivation}
            </Text>
          ) : null}
        </View>

        <View
          style={[
            styles.toggleContainer,
            {backgroundColor: theme.colors.background},
          ]}>
          <View style={styles.toggleItem}>
            <Text style={[styles.toggleLabel, {color: theme.colors.text}]}>
              Show Letters
            </Text>
            <Switch
              style={styles.switch}
              value={showLetters}
              onValueChange={setShowLetters}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
            />
          </View>
          <View style={styles.toggleItem}>
            <Text style={[styles.toggleLabel, {color: theme.colors.text}]}>
              Show Numbers
            </Text>
            <Switch
              style={styles.switch}
              value={showNumbers}
              onValueChange={setShowNumbers}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
            />
          </View>
        </View>

        <ESChessboard
          boardRef={chessboardRef}
          boardSize={BOARD_SIZE}
          onMove={handleMove}
          fen={chessRef.current.fen()}
          withLetters={showLetters}
          withNumbers={showNumbers}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default PieceMovementScreen;

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
    width: '85%',
    alignSelf: 'center',
    borderRadius: 10,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  motivationContainer: {
    height: 50,
    width: '85%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'CormorantGaramond-Bold',
  },
  challenge: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Roboto-Regular',
  },
  motivation: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'CormorantGaramond-Bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    marginBottom: 20,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    ...textStyles.bodySmall,
    marginRight: 8,
  },
  switch: {
    transform: [{scaleX: 0.7}, {scaleY: 0.7}],
  },
});
