## SpecStory

## Chess Game Move Handling Bug (3/3/2025, 11:25:44 PM)

_**User**_

Bug
- When I've played correct move, after that oppponent playes next move and it goes to undo state. 



---

_**Assistant**_

Let me help you fix this bug in the puzzle solver. The issue appears to be in the move handling logic where the opponent's move is not being properly applied to the chess game state.

Let me analyze the code and make the necessary changes:

1. The bug occurs because while we're making the opponent's move on the chessboard UI using `chessboardRef.current?.move()`, we're not updating the internal chess game state (`chessRef`) with the opponent's move.

2. Let me modify the `handleMove` function to properly handle both player and opponent moves:

---

_**Assistant**_

```
  const handleMove = ({move}: {from: string; to: string}) => {
    if (!currentPuzzle) return;

    const {from, to} = move;
    const raw = currentPuzzle._raw as PuzzleRaw;
    const moves = raw.moves.split(' ');
    const expectedMove = moves[moveIndex];
    const actualMove = `${from}${to}`;

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
        setTimeout(() => {
          // Update both the UI and chess game state with opponent's move
          chessboardRef.current?.move({from: fromOpp, to: toOpp});
          chessRef.current.move({from: fromOpp, to: toOpp});
        }, 500);
        setMoveIndex(moveIndex + 2);
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
```

---

_**Assistant**_



I notice there's a type mismatch in the function parameter. Let me fix that:

---

_**Assistant**_

```
  const handleMove = (move: {from: string; to: string}) => {
    if (!currentPuzzle) return;

    const {from, to} = move;
// ... existing code ...
```

---

_**Assistant**_



I've made two important changes to fix the bug:

1. Added proper chess game state updates for both player and opponent moves by calling `chessRef.current.move()` for both moves. Previously, we were only updating the game state for the player's move but not for the opponent's move.

2. Fixed a type definition issue in the `handleMove` function parameter to match the expected move object structure.

These changes should resolve the issue where the opponent's move was being undone. Now:
1. When you make a correct move, it updates both the UI and the internal chess game state
2. When the opponent makes their move, it also updates both the UI and the internal chess game state
3. This ensures that the game state remains consistent throughout the puzzle solving process

Try the puzzle solver again - you should now see that after making a correct move, the opponent's move stays on the board as expected.

Let me know if you encounter any other issues!

---



---

