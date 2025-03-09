## SpecStory

## Chess Piece Movement Issue Investigation (3/9/2025, 1:47:43 PM)

_**User**_

This happened when i tried to move, please check for all the cases. 

---

_**Assistant**_

Let me help investigate the issue with piece movement. From the screenshot, I can see that there's a bishop piece that needs to be moved from f2 to d4, but it seems there might be issues with the move validation or handling. Let me check the code to identify potential problems.

First, let me fetch the chessboard rules to understand any specific requirements:

---

_**Assistant**_



---

_**Assistant**_

Looking at the code and the screenshot, I notice a few potential issues that need to be checked:

1. Let me first check if the move from f2 to d4 is actually a valid bishop move in the current implementation:

---

_**Assistant**_



---

_**Assistant**_

Let me analyze the code in `PieceMovementScreen.tsx` to identify potential issues with the move validation. I notice a few potential problems:

1. The current implementation of `handleMove` in `PieceMovementScreen.tsx` doesn't properly validate if the move is legal according to chess rules. Let me check the current implementation:

---

_**Assistant**_



---

_**Assistant**_



---

_**Assistant**_

I've identified several issues in the code that could be causing problems with the bishop move:

1. The current `handleMove` implementation only checks if the move matches the target squares (`from` and `to`), but doesn't validate if the move is actually legal according to chess rules.

2. There's no validation to ensure the move follows the bishop's movement pattern (diagonal movement).

3. The code doesn't check if there are any pieces blocking the bishop's path.

Let me fix these issues by modifying the `handleMove` function to include proper chess move validation:

---

_**Assistant**_

```
// ... existing code ...
  const handleMove = useCallback(
    (info: ChessMoveInfo) => {
      if (!targetMove) return;

      try {
        // Get all legal moves for the piece at the 'from' square
        const legalMoves = chessRef.current.moves({ 
          verbose: true,
          square: info.move.from 
        });

        // Check if the move is legal and matches our target
        const isLegalMove = legalMoves.some(m => m.from === info.move.from && m.to === info.move.to);
        const isTargetMove = info.move.from === targetMove.from && info.move.to === targetMove.to;

        if (!isLegalMove) {
          // If move is not legal, reset the board to previous position
          chessboardRef.current?.resetBoard(chessRef.current.fen());
          return;
        }

        // Make the move in the chess instance
        chessRef.current.move({
          from: info.move.from,
          to: info.move.to
        });

        // Update score based on if it was the target move
        setScore(prev => {
          const newScore = prev + (isTargetMove ? 1 : -1);

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
      } catch (error) {
        console.error('Invalid move:', error);
        // Reset board to previous position if move was invalid
        chessboardRef.current?.resetBoard(chessRef.current.fen());
      }
    },
    [targetMove, generateNewChallenge],
  );
// ... existing code ...
```

---

_**Assistant**_

Let me fix the linter errors by properly typing the Square type:

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
// ... existing code ...

  const handleMove = useCallback(
    (info: ChessMoveInfo) => {
      if (!targetMove) return;

      try {
        // Get all legal moves for the piece at the 'from' square
        const legalMoves = chessRef.current.moves({ 
          verbose: true,
          square: info.move.from as Square
        });

        // Check if the move is legal and matches our target
        const isLegalMove = legalMoves.some(m => m.from === info.move.from && m.to === info.move.to);
        const isTargetMove = info.move.from === targetMove.from && info.move.to === targetMove.to;

        if (!isLegalMove) {
          // If move is not legal, reset the board to previous position
          chessboardRef.current?.resetBoard(chessRef.current.fen());
          return;
        }

        // Make the move in the chess instance
        chessRef.current.move({
          from: info.move.from as Square,
          to: info.move.to as Square
        });
// ... existing code ...
```

---

_**Assistant**_

I've made several improvements to fix the issues with the bishop movement:

1. Added proper chess move validation using `chess.js`'s built-in validation
2. Added error handling for invalid moves
3. Fixed type issues with the Square type
4. Added board reset when invalid moves are attempted

The changes now ensure that:
1. Only legal chess moves are allowed
2. The bishop can only move diagonally
3. The bishop cannot jump over other pieces
4. The board resets to the previous position if an illegal move is attempted
5. The score is only updated for valid moves

Try moving the bishop again. The move from f2 to d4 should now work correctly if it's a legal move (i.e., if there are no pieces blocking the diagonal path). If you're still experiencing issues, please let me know and I can help investigate further.

---



---

