## SpecStory

## Chess Application Feature Request (3/4/2025, 12:07:23 AM)

_**User**_

Can you add a feature of black to play or white to play ? 

Also it looks like that i'm playing opponent's move i confirmed from the solution can you check that too? 

---

_**Assistant**_

Let me help you with both issues. First, let me analyze the code and the problems you've mentioned.

1. For the first issue, we need to add an indicator showing whose turn it is to play in the puzzle.

2. For the second issue, looking at the code, I can see that in the solution display, it shows "Your move" for even-indexed moves (index % 2 === 0), but we should verify if this matches the actual turn order from the FEN position.

Let me first check the current puzzle's FEN to understand whose turn it is:

---

_**Assistant**_



---

_**Assistant**_



Let me fix both issues. I'll modify the code to:
1. Add a clear indicator for whose turn it is (White/Black to play)
2. Fix the move sequence to ensure the player is making the correct moves

---

_**Assistant**_

```
const PuzzleSolverScreen = () => {
  const route = useRoute<RouteProp<TrainStackParamList, 'PuzzleSolver'>>();
  const {theme} = useTheme();
  const chessboardRef = useRef<ChessboardRef>(null);
  const boardRef = useRef<View>(null);
  const chessRef = useRef(new Chess());

  const [moveIndex, setMoveIndex] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCorrectMove, setIsCorrectMove] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isOpponentMoving, setIsOpponentMoving] = useState(false);
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

// ... existing code ...

  useEffect(() => {
    if (currentPuzzle) {
      const raw = currentPuzzle._raw as PuzzleRaw;
      const chess = new Chess(raw.fen);
      const initialTurn = chess.turn();
      setPlayerColor(initialTurn);
      chessRef.current = chess;
      setMoveIndex(0);
      setIsCorrectMove(null);
      setIsPlayerTurn(true);

      // If player is black, make the initial white move
      if (initialTurn === 'b') {
        const moves = raw.moves.split(' ');
        const firstMove = moves[0];
        const [fromOpp, toOpp] = [
          firstMove.slice(0, 2) as Square,
          firstMove.slice(2, 4) as Square,
        ];
        setIsOpponentMoving(true);
        setTimeout(() => {
          chessboardRef.current?.move({from: fromOpp, to: toOpp});
          chessRef.current.move({from: fromOpp, to: toOpp});
          setIsOpponentMoving(false);
          setMoveIndex(1);
        }, 500);
      }
    }
  }, [currentPuzzle]);

  const handleMove = ({move}: {move: {from: string; to: string}}) => {
    if (!currentPuzzle || isOpponentMoving || !isPlayerTurn) return;

    const {from, to} = move;
    const raw = currentPuzzle._raw as PuzzleRaw;
    const moves = raw.moves.split(' ');
    const expectedMove = moves[moveIndex];
    const actualMove = `${from}${to}`;

    if (actualMove === expectedMove) {
      // Correct move
      const fromSquare = from as Square;
      const toSquare = to as Square;
      chessRef.current.move({from: fromSquare, to: toSquare});
      setIsCorrectMove(true);
      setIsPlayerTurn(false);

      if (moveIndex === moves.length - 1) {
        // Puzzle completed
        setScore(s => s + 1);
        setTimeout(() => {
          Alert.alert('Success!', 'Puzzle solved correctly!', [
            {text: 'Next Puzzle', onPress: moveToNextPuzzle},
          ]);
        }, 500);
      } else {
        // Make opponent's move
        const opponentMove = moves[moveIndex + 1];
        const [fromOpp, toOpp] = [
          opponentMove.slice(0, 2) as Square,
          opponentMove.slice(2, 4) as Square,
        ];
        setIsOpponentMoving(true);
        setTimeout(() => {
          chessboardRef.current?.move({from: fromOpp, to: toOpp});
          chessRef.current.move({from: fromOpp, to: toOpp});
          setIsOpponentMoving(false);
          setIsPlayerTurn(true);
          setMoveIndex(moveIndex + 2);
        }, 500);
      }
    } else {
      // Wrong move
      setIsCorrectMove(false);
      setTimeout(() => {
        chessboardRef.current?.undo();
        setIsCorrectMove(null);
      }, 500);
    }
  };

// ... existing code ...

      <View
        style={[
          styles.boardContainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <Text style={[textStyles.h5, {color: theme.colors.text, marginBottom: 8, textAlign: 'center'}]}>
          {isPlayerTurn ? (playerColor === 'w' ? "White" : "Black") : (playerColor === 'w' ? "Black" : "White")} to play
        </Text>
        <Chessboard
// ... rest of the existing code ...
```

---

_**Assistant**_



I've made several important changes to fix both issues:

1. Added a clear indicator showing whose turn it is:
   - Added a text display above the board showing "White to play" or "Black to play"
   - The text updates automatically based on whose turn it is

2. Fixed the move sequence logic:
   - Added `playerColor` state to track if the player is White or Black
   - Added `isPlayerTurn` state to track whose turn it is
   - Modified the initialization logic to:
     - Determine the player's color from the initial FEN position
     - If the player is Black, automatically make the first White move
   - Updated the move handling to:
     - Prevent moves when it's not the player's turn
     - Properly alternate between player and opponent turns
     - Remove debug console.log statements
     - Keep the move sequence in the correct order

The key improvements are:
1. The game now correctly identifies the player's color from the initial position
2. Players can only move on their turn
3. There's a clear visual indicator of whose turn it is
4. The puzzle will now follow the correct sequence of moves based on the initial position

Would you like to test these changes and see if they resolve both issues?

---

_**User**_

I found the issue i think the puzle we're getting from list expects first move from opponent so user can play next move, please update accordingly.

---

_**Assistant**_

Ah, I understand the issue now. In chess puzzles, typically the opponent's last move is already made, and the player needs to find the correct response. Let me modify the code to handle this correctly.

---

_**Assistant**_

```
  useEffect(() => {
    if (currentPuzzle) {
      const raw = currentPuzzle._raw as PuzzleRaw;
      const chess = new Chess(raw.fen);
      // In puzzles, it's always the player's turn to move first
      setPlayerColor(chess.turn());
      chessRef.current = chess;
      setMoveIndex(0);
      setIsCorrectMove(null);
      setIsPlayerTurn(true);
    }
  }, [currentPuzzle]);

  const handleMove = ({move}: {move: {from: string; to: string}}) => {
    if (!currentPuzzle || isOpponentMoving || !isPlayerTurn) return;

    const {from, to} = move;
    const raw = currentPuzzle._raw as PuzzleRaw;
    const moves = raw.moves.split(' ');
    const expectedMove = moves[moveIndex];
    const actualMove = `${from}${to}`;

    if (actualMove === expectedMove) {
      // Correct move
      const fromSquare = from as Square;
      const toSquare = to as Square;
      chessRef.current.move({from: fromSquare, to: toSquare});
      setIsCorrectMove(true);
      setIsPlayerTurn(false);

      if (moveIndex === moves.length - 1) {
        // Puzzle completed
        setScore(s => s + 1);
        setTimeout(() => {
          Alert.alert('Success!', 'Puzzle solved correctly!', [
            {text: 'Next Puzzle', onPress: moveToNextPuzzle},
          ]);
        }, 500);
      } else {
        // Make opponent's move
        const opponentMove = moves[moveIndex + 1];
        const [fromOpp, toOpp] = [
          opponentMove.slice(0, 2) as Square,
          opponentMove.slice(2, 4) as Square,
        ];
        setIsOpponentMoving(true);
        setTimeout(() => {
          chessboardRef.current?.move({from: fromOpp, to: toOpp});
          chessRef.current.move({from: fromOpp, to: toOpp});
          setIsOpponentMoving(false);
          setIsPlayerTurn(true);
          setMoveIndex(moveIndex + 2);
        }, 500);
      }
    } else {
      // Wrong move
      setIsCorrectMove(false);
      setTimeout(() => {
        chessboardRef.current?.undo();
        setIsCorrectMove(null);
      }, 500);
    }
  };
```

---

_**Assistant**_



I've made the following changes to fix the move sequence:

1. Removed the initial opponent move logic since the puzzle FEN already represents the position after the opponent's move
2. Simplified the initialization to:
   - Set the player's color based on whose turn it is in the FEN
   - Always set `isPlayerTurn` to true since puzzles start with the player's move
   - Keep the move index at 0 since the first move in the moves array is the player's correct response

The key improvements are:
1. The puzzle now correctly starts with the player's move
2. The FEN position already shows the opponent's last move
3. The move sequence properly alternates between player and opponent
4. The player's color is correctly set based on the FEN position

This should now work correctly with the puzzle format where:
1. The FEN shows the position after the opponent's move
2. The player needs to find the correct response
3. The moves array starts with the player's correct move

Would you like to test these changes and see if they resolve the issue?

---

_**User**_

I think issue still remains the first move should played auto and it's opponent's move so i should start playing after that, also update the text accordingly.

---

_**Assistant**_

Ah, I understand now. The puzzle starts with the opponent's move that should be played automatically, and then the player responds. Let me fix this.

---

_**Assistant**_

```
  useEffect(() => {
    if (currentPuzzle) {
      const raw = currentPuzzle._raw as PuzzleRaw;
      const chess = new Chess(raw.fen);
      chessRef.current = chess;
      
      // Get the first move (opponent's move)
      const moves = raw.moves.split(' ');
      const firstMove = moves[0];
      const [fromOpp, toOpp] = [
        firstMove.slice(0, 2) as Square,
        firstMove.slice(2, 4) as Square,
      ];

      // Set initial states
      setPlayerColor(chess.turn() === 'w' ? 'b' : 'w'); // Player's color is opposite of initial FEN
      setMoveIndex(1); // Start from index 1 since first move is auto-played
      setIsCorrectMove(null);
      setIsPlayerTurn(false);
      
      // Play the first move automatically
      setIsOpponentMoving(true);
      setTimeout(() => {
        chessboardRef.current?.move({from: fromOpp, to: toOpp});
        chessRef.current.move({from: fromOpp, to: toOpp});
        setIsOpponentMoving(false);
        setIsPlayerTurn(true);
      }, 500);
    }
  }, [currentPuzzle]);

  const handleMove = ({move}: {move: {from: string; to: string}}) => {
    if (!currentPuzzle || isOpponentMoving || !isPlayerTurn) return;

    const {from, to} = move;
    const raw = currentPuzzle._raw as PuzzleRaw;
    const moves = raw.moves.split(' ');
    const expectedMove = moves[moveIndex];
    const actualMove = `${from}${to}`;

    if (actualMove === expectedMove) {
      // Correct move
      const fromSquare = from as Square;
      const toSquare = to as Square;
      chessRef.current.move({from: fromSquare, to: toSquare});
      setIsCorrectMove(true);
      setIsPlayerTurn(false);

      if (moveIndex === moves.length - 1) {
        // Puzzle completed
        setScore(s => s + 1);
        setTimeout(() => {
          Alert.alert('Success!', 'Puzzle solved correctly!', [
            {text: 'Next Puzzle', onPress: moveToNextPuzzle},
          ]);
        }, 500);
      } else {
        // Make opponent's move
        const opponentMove = moves[moveIndex + 1];
        const [fromOpp, toOpp] = [
          opponentMove.slice(0, 2) as Square,
          opponentMove.slice(2, 4) as Square,
        ];
        setIsOpponentMoving(true);
        setTimeout(() => {
          chessboardRef.current?.move({from: fromOpp, to: toOpp});
          chessRef.current.move({from: fromOpp, to: toOpp});
          setIsOpponentMoving(false);
          setIsPlayerTurn(true);
          setMoveIndex(moveIndex + 2);
        }, 500);
      }
    } else {
      // Wrong move
      setIsCorrectMove(false);
      setTimeout(() => {
        chessboardRef.current?.undo();
        setIsCorrectMove(null);
      }, 500);
    }
  };

// ... rest of the code ...

      <View
        style={[
          styles.boardContainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <Text style={[textStyles.h5, {color: theme.colors.text, marginBottom: 8, textAlign: 'center'}]}>
          {isOpponentMoving ? "Opponent is moving..." : (isPlayerTurn ? "Your turn" : "Opponent's turn")}
        </Text>
        <Text style={[textStyles.bodySmall, {color: theme.colors.text, marginBottom: 8, textAlign: 'center'}]}>
          You are playing as {playerColor === 'w' ? "White" : "Black"}
        </Text>
        <Chessboard
```

---

_**Assistant**_



I've made several important changes to fix the puzzle sequence and improve the UI:

1. Modified the puzzle initialization to:
   - Determine player's color as opposite of the initial FEN position
   - Start from moveIndex 1 since move[0] is the opponent's first move
   - Automatically play the opponent's first move
   - Set correct turn states during initialization

2. Improved the turn indicator UI:
   - Added "Opponent is moving..." during opponent moves
   - Changed to "Your turn" / "Opponent's turn" instead of colors
   - Added a separate indicator showing which color you're playing as

The key improvements are:
1. The puzzle now correctly:
   - Starts by showing the opponent's first move automatically
   - Sets the player's color correctly (opposite of initial position)
   - Starts from the correct move index

---



---

