## SpecStory

## Fixing Game Move Logic (3/3/2025, 11:46:10 PM)

_**User**_

I think i get it now, the issue here is that, when opponent's move it consider players move again, so in that case it falls under else where it get undoed. 

Please fix this.

---

_**Assistant**_

I understand the issue. When the opponent's move is made, the `handleMove` function is still being triggered, which then considers it as a wrong move and undoes it. We need to prevent the board from accepting moves while the opponent is making their move.

Let me add a state to track when the opponent is moving and use it to prevent any moves during that time.

I'll modify the code:

---

_**Assistant**_

```
import React, {useRef, useEffect, useState} from 'react';
// ... existing code ...
const PuzzleSolverScreen = () => {
  // ... existing code ...
  const [isCorrectMove, setIsCorrectMove] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isOpponentMoving, setIsOpponentMoving] = useState(false);

  // ... existing code ...

  const handleMove = ({move}: {move: {from: string; to: string}}) => {
    if (!currentPuzzle || isOpponentMoving) return;
    // ... existing code ...
    if (actualMove === expectedMove) {
      // Correct move
      const fromSquare = from as Square;
      const toSquare = to as Square;
      // Update chess game state with player's move
      chessRef.current.move({from: fromSquare, to: toSquare});
      setIsCorrectMove(true);

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
          // Update both the UI and chess game state with opponent's move
          chessboardRef.current?.move({from: fromOpp, to: toOpp});
          chessRef.current.move({from: fromOpp, to: toOpp});
          setIsOpponentMoving(false);
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



I've made the following changes to fix the issue:

1. Added a new state variable `isOpponentMoving` to track when the opponent is making their move
2. Modified the `handleMove` function to return early if `isOpponentMoving` is true
3. Set `isOpponentMoving` to true before the opponent's move starts
4. Set `isOpponentMoving` back to false after the opponent's move is complete
5. Moved the `setMoveIndex` call inside the timeout callback to ensure it happens after the opponent's move is complete

Now, when the opponent is making their move, any attempts to move pieces will be ignored until the opponent's move is complete. This should prevent the unwanted undo behavior you were experiencing.

The changes ensure that:
1. Player moves are blocked during opponent's turn
2. The move index is updated only after the opponent's move is complete
3. The timing of state updates is properly synchronized with the visual moves on the board

Would you like to test this fix and see if it resolves the issue?

---

_**User**_

Yes, I think it's going into reverse manner, I'm playing opponent's moves

also can you please add a text indicating white to play or black to play.

---

_**Assistant**_

I understand the issue. The puzzle's FEN position tells us whose turn it is, and we need to ensure the player plays the correct side. Let me modify the code to handle this and add an indicator for whose turn it is.

---

_**Assistant**_

```
const PuzzleSolverScreen = () => {
  // ... existing code ...
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  useEffect(() => {
    if (currentPuzzle) {
      const raw = currentPuzzle._raw as PuzzleRaw;
      const chess = new Chess(raw.fen);
      setIsPlayerTurn(chess.turn() === 'w');
      chessRef.current = chess;
      setMoveIndex(0);
      setIsCorrectMove(null);
    }
  }, [currentPuzzle]);

  const handleMove = ({move}: {move: {from: string; to: string}}) => {
    if (!currentPuzzle || isOpponentMoving || !isPlayerTurn) return;
    console.log('move', move);

    const {from, to} = move;
    const raw = currentPuzzle._raw as PuzzleRaw;
    const moves = raw.moves.split(' ');
    const expectedMove = moves[moveIndex];
    const actualMove = `${from}${to}`;
    console.log('actualMove', actualMove);
    console.log('expectedMove', expectedMove);

    if (actualMove === expectedMove) {
      // Correct move
      const fromSquare = from as Square;
      const toSquare = to as Square;
      // Update chess game state with player's move
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
          // Update both the UI and chess game state with opponent's move
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

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View
        style={[
          styles.boardContainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <Text style={[textStyles.h5, {color: theme.colors.text, marginBottom: 8}]}>
          {isPlayerTurn ? "White" : "Black"} to play
        </Text>
        <Chessboard
          // ... existing Chessboard props ...
        />
      </View>
      // ... rest of the JSX ...
    </View>
  );
};
```

---

_**Assistant**_



I've made several important changes to fix the move order and add the turn indicator:

1. Added an `isPlayerTurn` state to track whose turn it is
2. In the `useEffect` for `currentPuzzle`, we now:
   - Create a new Chess instance with the puzzle's FEN
   - Set `isPlayerTurn` based on the initial position (white = 'w')
   - Update the chess reference

3. Modified `handleMove` to:
   - Prevent moves when it's not the player's turn
   - Update `isPlayerTurn` after each move (both player and opponent moves)

4. Added a text indicator above the board showing whose turn it is

The key improvements are:
1. The game now correctly identifies whose turn it is from the initial position
2. Players can only move on their turn
3. There's a clear visual indicator of whose turn it is
4. The turn state properly alternates between player and opponent

This should fix the issue of playing opponent's moves and make it clearer whose turn it is. The puzzle will now follow the correct sequence of moves based on the initial position.

Would you like to test these changes and see if they resolve the issue?

---

_**User**_

now it stopped playing for opponent, please fix it for forever.

---

_**Assistant**_

I notice that we need to handle the case where the player might be playing as Black. Let me modify the code to properly handle both White and Black player positions, and ensure the opponent's moves are always played correctly.

---

_**Assistant**_

```
const PuzzleSolverScreen = () => {
  // ... existing code ...
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');

  useEffect(() => {
    if (currentPuzzle) {
      const raw = currentPuzzle._raw as PuzzleRaw;
      const chess = new Chess(raw.fen);
      const initialTurn = chess.turn();
      setPlayerColor(initialTurn);
      setIsPlayerTurn(true); // Player always makes the first move in puzzles
      chessRef.current = chess;
      setMoveIndex(0);
      setIsCorrectMove(null);

      // If player is black, make the initial white move
      if (initialTurn === 'b') {
        const moves = raw.moves.split(' ');
        const firstMove = moves[0];
        const [fromOpp, toOpp] = [
          firstMove.slice(0, 2) as Square,
          firstMove.slice(2, 4) as Square,
        ];
        setTimeout(() => {
          chessboardRef.current?.move({from: fromOpp, to: toOpp});
          chessRef.current.move({from: fromOpp, to: toOpp});
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

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View
        style={[
          styles.boardContainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <Text style={[textStyles.h5, {color: theme.colors.text, marginBottom: 8}]}>
          {isPlayerTurn ? (playerColor === 'w' ? "White" : "Black") : (playerColor === 'w' ? "Black" : "White")} to play
        </Text>
        <Chessboard
          ref={chessboardRef}
          fen={raw.fen}
          onMove={showSolution ? undefined : handleMove}
          renderPiece={piece => (
            <Image
              style={{
                width: BOARD_SIZE / 8,
                height: BOARD_SIZE / 8,
              }}
              source={themeChessboardImages[theme.name.toLowerCase()][piece]}
            />
          )}
          colors={{
            black: theme.colors.primary,
            white: theme.colors.secondary,
            lastMoveHighlight:
              isCorrectMove === true
                ? 'rgba(0, 255, 0, 0.4)'
                : isCorrectMove === false
                ? 'rgba(255, 0, 0, 0.4)'
                : 'rgba(255, 255, 255, 0.2)',
            checkmateHighlight: theme.colors.error,
            promotionPieceButton: theme.colors.success,
          }}
          boardSize={BOARD_SIZE}
          gestureEnabled={!showSolution && isPlayerTurn}
        />
      </View>
```

---

_**Assistant**_



I've made several important changes to fix the opponent move issues and handle both White and Black positions correctly:

1. Added a `playerColor` state to track whether the player is White or Black
2. Modified the puzzle initialization to:
   - Set the player's color based on the initial position
   - If the player is Black, automatically make the first White move
   - Always set `isPlayerTurn` to true after initialization (since puzzles always start with the player's move)

3. Improved the turn indicator to show the correct color based on both the player's color and whose turn it is
4. Added `isPlayerTurn` to the `gestureEnabled` prop to prevent moves during opponent's turn
5. Removed unnecessary console.log statements
6. Cleaned up comments for better readability

The key improvements are:
1. The game now correctly handles both White and Black positions
2. If the player is Black, the initial White move is automatically played
3. The turn indicator correctly shows whose move it is based on the player's color
4. Move validation is more robust with the additional checks
5. The board is disabled during opponent's moves

This should now work correctly for both White and Black positions, and the opponent's moves should always play properly. Would you like to test these changes?

---



---

