## SpecStory

## Conditional Engines Section Implementation (3/9/2025, 6:53:25 PM)

_**User**_

In the mentioned Array, I want two objects in a section Engines name them whatever you want, this section should be only visible when internet is available. 

For avatar images select any available one for now

Now when i click on play after fliping the card we'll pass the depth from here, on @PlayScreen2.tsx we will hit the api to get response and move the board accordingly. 

Be careful when changing something it should not break current implementation.

---

_**Assistant**_

I'll help you add an "Engines" section to the `DIFFICULTY_LEVELS` array that will be conditionally rendered based on internet connectivity. I'll also modify the interface and components to handle the depth parameter.

First, let's look at the current code and make our changes:

---

_**Assistant**_

```
// ... existing code ...
export interface AIPersona {
  id: string;
  name: string;
  rating: number;
  level: number;
  image: any;
  description: string;
  depth?: number; // Optional depth parameter for engine-based opponents
  personality: {
    style: string;
    strength: string;
    weakness: string;
  };
  commentary: {
    opening: string[];
    middlegame: string[];
    endgame: string[];
    winning: string[];
    losing: string[];
    draw: string[];
  } | ((move: any) => string);
  prompts: {
    moveAnalysis: string;
    gameStrategy: string;
    personalityTraits: string;
  };
}

// ... existing code ...

const DIFFICULTY_LEVELS = [
  {
    name: 'Beginner',
    description: 'Perfect for learning the basics',
    color: '#4CAF50',
    personas: [
      // ... existing personas ...
    ],
  },
  {
    name: 'Intermediate',
    description: 'For players who know the basics',
    color: '#2196F3',
    personas: [
      // ... existing personas ...
    ],
  },
  {
    name: 'Advanced',
    description: 'Challenge yourself against strong opponents',
    color: '#FF5722',
    personas: [
      // ... existing personas ...
    ],
  },
  {
    name: 'Engines',
    description: 'Play against powerful chess engines (Requires Internet)',
    color: '#9C27B0',
    requiresInternet: true,
    personas: [
      {
        id: 'stockfish_rapid',
        name: 'Stockfish Rapid',
        rating: 2800,
        level: 12,
        depth: 12,
        image: Avatars.avatar_eight, // Using existing avatar for now
        description: 'Fast and strong chess engine for rapid games',
        personality: {
          style: 'Universal calculation',
          strength: 'Perfect tactics',
          weakness: 'None',
        },
        commentary: (move: any) => {
          if (move.san?.includes('+')) return 'Check! The position is forcing.';
          if (move.san?.includes('x')) return 'Material balance shifts.';
          if (move.san?.includes('=')) return 'Promotion is decisive.';
          if (move.san?.includes('O-O')) return 'Position secured.';
          return 'Position evaluated.';
        },
        prompts: {
          moveAnalysis: 'Analyze this position with perfect tactical accuracy.',
          gameStrategy: 'Calculate the optimal continuation in this position.',
          personalityTraits: 'You are precise, calculating, and tactically perfect.',
        },
      },
      {
        id: 'stockfish_deep',
        name: 'Stockfish Deep',
        rating: 3000,
        level: 20,
        depth: 20,
        image: Avatars.avatar_nine, // Using existing avatar for now
        description: 'Deep calculating chess engine for serious analysis',
        personality: {
          style: 'Deep calculation',
          strength: 'Strategic mastery',
          weakness: 'None',
        },
        commentary: (move: any) => {
          if (move.san?.includes('+')) return 'Check. Position is winning.';
          if (move.san?.includes('x')) return 'Exchange is necessary.';
          if (move.san?.includes('=')) return 'Promotion is inevitable.';
          if (move.san?.includes('O-O')) return 'King position optimized.';
          return 'Move follows optimal strategy.';
        },
        prompts: {
          moveAnalysis: 'Provide deep strategic analysis of this position.',
          gameStrategy: 'Calculate the deepest strategic implications.',
          personalityTraits: 'You are deeply analytical and strategically perfect.',
        },
      },
    ],
  },
];

// ... existing code ...
```

---

_**Assistant**_

Now we need to modify the rendering logic to only show the Engines section when online. Let's update the component:

---

_**Assistant**_

```
// ... existing code ...
import {useNetworkStatus} from '../../../shared/hooks/useNetworkStatus';

// ... existing code ...

export const AIPersonaScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<PlayScreenNavigationProp>();
  const {width} = useWindowDimensions();
  const {isOnline} = useNetworkStatus();
  const cardWidth = width * 0.42;

  const handlePersonaSelect = useCallback((persona: AIPersona) => {
    navigation.navigate('Play', {
      selectedPersona: {
        ...persona,
        commentary: typeof persona.commentary === 'function' ? {
          opening: [],
          middlegame: [],
          endgame: [],
          winning: [],
          losing: [],
          draw: [],
        } : persona.commentary
      }
    });
  }, [navigation]);

  // ... existing renderPersonaCard code ...

  const sections = DIFFICULTY_LEVELS
    .filter(level => !level.requiresInternet || isOnline)
    .map(level => ({
      name: level.name,
      description: level.description,
      data: level.personas,
    }));

  return (
    <ScreenWrapper title="Play with AI" showBack>
      <SectionList
        style={[styles.container]}
        contentContainerStyle={styles.contentContainer}
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={() => <View style={styles.sectionFooter} />}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
      />
    </ScreenWrapper>
  );
};

// ... rest of the code ...
```

---

_**Assistant**_

Now let's update the PlayScreen2 to handle the depth parameter when making API calls:

---

_**Assistant**_

```
// ... existing code ...

  // Handle AI move
  const handleAIMove = useCallback(async () => {
    try {
      if (selectedPersona.depth && isOnline) {
        // Use Stockfish API for engine-based opponents
        const fen = gameRef.current.exportFEN();
        const response = await fetch(`https://stockfish.online/api/s/v2.php?fen=${fen}&depth=${selectedPersona.depth}`);
        const data = await response.json();
        
        if (data.success && data.bestmove) {
          const [from, to] = data.bestmove.split(/(?<=^.{2})/);
          
          setMoves(prev => [...prev, {
            player: 'black',
            from: from.toUpperCase(),
            to: to.toUpperCase(),
            timestamp: Date.now(),
          }]);

          if (chessboardRef.current) {
            await chessboardRef.current.move({
              from: from.toLowerCase() as Move['from'],
              to: to.toLowerCase() as Move['to'],
            });
          }

          gameRef.current.move(from.toUpperCase(), to.toUpperCase());
        } else {
          throw new Error('Invalid response from Stockfish API');
        }
      } else {
        // Use existing js-chess-engine for non-engine opponents
        const aiMoveResult = gameRef.current.aiMove(selectedPersona.level);
        const from = Object.keys(aiMoveResult)[0];
        const to = aiMoveResult[from];

        setMoves(prev => [...prev, {
          player: 'black',
          from,
          to,
          timestamp: Date.now(),
        }]);

        if (chessboardRef.current) {
          await chessboardRef.current.move({
            from: from.toLowerCase() as Move['from'],
            to: to.toLowerCase() as Move['to'],
          });
        }
      }

      // Get the player's last move and AI's move
      const playerLastMove = moves[moves.length - 1];
      const commentary = await generateAICommentary(
        `${playerLastMove.from}-${playerLastMove.to}`,
        null,
      );
      setCommentary(commentary.text);

      const gameStatus = gameRef.current.exportJson();
      if (gameStatus.isFinished) {
        handleGameOver(gameStatus.checkMate ? 'black' : 'draw');
      }
    } catch (error) {
      console.error('AI move error:', error);
      setCommentary('Oops! Something went wrong with the AI move.');
    }
  }, [handleGameOver, selectedPersona, generateAICommentary, moves, isOnline]);

// ... rest of the code ...
```

---

_**Assistant**_

Let me explain the changes I've made:

1. Added an Engines section with two personas: Stockfish Rapid (depth 12) and Stockfish Deep (depth 20)
2. Added `requiresInternet: true` flag to the Engines section
3. Updated the AIPersona interface to include an optional `depth` parameter
4. Modified the section filtering to only show engine options when online
5. Updated the handleAIMove function to use the Stockfish API when depth is provided and online
6. Fixed the commentary type issue by converting function-based commentary to object format when navigating

There are some linter errors that need to be addressed. Let's fix them:

---

_**Assistant**_

```
// ... existing code ...

interface GameState {
  isFinished: boolean;
  checkMate: boolean;
  pieces: {
    [key: string]: string;
  };
}

// Add type for Game class
interface ExtendedGame extends Game {
  exportFEN: () => string;
}

// ... existing code ...

  const gameRef = useRef<ExtendedGame>(new Game() as ExtendedGame);

  // Helper function to get commentary based on phase
  const getPhaseCommentary = useCallback((phase: 'opening' | 'middlegame' | 'endgame') => {
    if (typeof selectedPersona.commentary === 'function') {
      return [selectedPersona.commentary({ san: '' })];
    }
    return selectedPersona.commentary[phase];
  }, [selectedPersona]);

  // Helper function to get result commentary
  const getResultCommentary = useCallback((result: 'draw' | 'win' | 'loss') => {
    if (typeof selectedPersona.commentary === 'function') {
      return selectedPersona.commentary({ san: result === 'win' ? '+' : 'x' });
    }
    const commentaryObj = selectedPersona.commentary as {
      draw: string[];
      winning: string[];
      losing: string[];
    };
    if (result === 'draw') return commentaryObj.draw;
    return result === 'win' ? commentaryObj.winning : commentaryObj.losing;
  }, [selectedPersona]);

  // Get commentary for game result
  const getGameResultCommentary = useCallback((winner: 'white' | 'black' | 'draw') => {
    if (winner === 'draw') {
      const messages = getResultCommentary('draw');
      return messages[Math.floor(Math.random() * messages.length)];
    }
    const isWinning = winner === 'black';
    const messages = getResultCommentary(isWinning ? 'win' : 'loss');
    return messages[Math.floor(Math.random() * messages.length)];
  }, [getResultCommentary]);

  // ... rest of the code ...

  // Handle AI move
  const handleAIMove = useCallback(async () => {
    try {
      if (selectedPersona.depth && isOnline) {
        // Use Stockfish API for engine-based opponents
        const fen = gameRef.current.exportFEN();
        const response = await fetch(`https://stockfish.online/api/s/v2.php?fen=${fen}&depth=${selectedPersona.depth}`);
        const data = await response.json();
        
        if (data.success && data.bestmove) {
          const [from, to] = data.bestmove.split(/(?<=^.{2})/);
          
          setMoves(prev => [...prev, {
            player: 'black',
            from: from.toUpperCase(),
            to: to.toUpperCase(),
            timestamp: Date.now(),
          }]);

          if (chessboardRef.current) {
            await chessboardRef.current.move({
              from: from.toLowerCase() as Move['from'],
              to: to.toLowerCase() as Move['to'],
            });
          }

          gameRef.current.move(from.toUpperCase(), to.toUpperCase());
        } else {
          throw new Error('Invalid response from Stockfish API');
        }
      } else {
        // Use existing js-chess-engine for non-engine opponents
        const aiMoveResult = gameRef.current.aiMove(selectedPersona.level);
        const from = Object.keys(aiMoveResult)[0];
        const to = aiMoveResult[from];

        setMoves(prev => [...prev, {
          player: 'black',
          from,
          to,
          timestamp: Date.now(),
        }]);

        if (chessboardRef.current) {
          await chessboardRef.current.move({
            from: from.toLowerCase() as Move['from'],
            to: to.toLowerCase() as Move['to'],
          });
        }
      }

      // Get the player's last move and AI's move
      const playerLastMove = moves[moves.length - 1];
      const commentary = await generateAICommentary(
        `${playerLastMove.from}-${playerLastMove.to}`,
        null,
      );
      setCommentary(commentary.text);

      const gameStatus = gameRef.current.exportJson() as GameState;
      if (gameStatus.isFinished) {
        handleGameOver(gameStatus.checkMate ? 'black' : 'draw');
      }
    } catch (error) {
      console.error('AI move error:', error);
      setCommentary('Oops! Something went wrong with the AI move.');
    }
  }, [handleGameOver, selectedPersona, generateAICommentary, moves, isOnline]);

// ... rest of the code ...
```

---

_**Assistant**_

Let me fix the remaining linter errors:

---

_**Assistant**_

```
// ... existing code ...

interface PieceValues {
  [key: string]: number;
  p: number;
  n: number;
  b: number;
  r: number;
  q: number;
  k: number;
}

const pieceValues: PieceValues = {
  p: 1,  // pawn
  n: 3,  // knight
  b: 3,  // bishop
  r: 5,  // rook
  q: 9,  // queen
  k: 0   // king (not counted for material advantage)
};

// ... existing code ...

  // Generate AI commentary based on persona and connectivity
  const generateAICommentary = useCallback(async (playerMove: string | null = null, aiMove: string | null = null) => {
    if (!isOnline || moves.length === 0) {
      // Use static commentary for offline mode or initial state
      const phase = getGamePhase();
      const comments = getPhaseCommentary(phase);
      const comment = comments[Math.floor(Math.random() * comments.length)];
      return {
        text: comment,
        textWithoutEmoji: comment.replace(/[\u{1F600}-\u{1F6FF}]/gu, '').trim()
      };
    }

    try {
      const gameState = gameRef.current.exportJson();
      const commentary = await generateCommentary(
        selectedPersona,
        JSON.stringify(gameState),
        playerMove || `${moves[moves.length - 1].from}-${moves[moves.length - 1].to}`,
        aiMove,
        getGamePhase(),
      );
      return commentary;
    } catch (error) {
      console.error('Commentary generation error:', error);
      // Fallback to static commentary on error
      const phase = getGamePhase();
      const comments = getPhaseCommentary(phase);
      const comment = comments[Math.floor(Math.random() * comments.length)];
      return {
        text: comment,
        textWithoutEmoji: comment.replace(/[\u{1F600}-\u{1F6FF}]/gu, '').trim()
      };
    }
  }, [isOnline, moves, getGamePhase, selectedPersona, getPhaseCommentary]);

  // ... existing code ...

  // Handle player move
  const handleMove = useCallback(
    async ({move}: ChessMoveInfo) => {
      if (isThinking || isGameOver) {
        return;
      }

      try {
        const beforeState = gameRef.current.exportJson();
        gameRef.current.move(move.from.toUpperCase(), move.to.toUpperCase());
        const afterState = gameRef.current.exportJson();
        
        // Play appropriate sound based on move type
        const isCapture = afterState.pieces[move.to.toUpperCase()] !== undefined;
        const isCastle = move.from.toLowerCase() === 'e1' && move.to.toLowerCase() === 'g1' ||
                        move.from.toLowerCase() === 'e1' && move.to.toLowerCase() === 'c1' ||
                        move.from.toLowerCase() === 'e8' && move.to.toLowerCase() === 'g8' ||
                        move.from.toLowerCase() === 'e8' && move.to.toLowerCase() === 'c8';
        
        playMoveSound(move.from, move.to);
        
        evaluateMove(beforeState, afterState);
        adjustDifficulty();

        setMoves(prev => [...prev, {
          player: 'white',
          from: move.from.toUpperCase(),
          to: move.to.toUpperCase(),
          timestamp: Date.now(),
        }]);
        
        if (afterState.isFinished) {
          playChessSound('game_end');
          handleGameOver(afterState.checkMate ? 'white' : 'draw');
          return;
        }

        setIsThinking(true);
        // Comment on player's move immediately
        const commentary = await generateAICommentary(
          `${move.from}-${move.to}`,
          null,
        );
        setCommentary(commentary.text);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        await handleAIMove();
      } catch (error) {
        console.error('Move error:', error);
        chessboardRef.current?.resetBoard();
      } finally {
        setIsThinking(false);
      }
    },
    [handleAIMove, isThinking, isGameOver, handleGameOver, evaluateMove, adjustDifficulty, generateAICommentary],
  );

// ... rest of the code ...
```

---

_**Assistant**_

Let me fix the remaining type error:

---

_**Assistant**_

```
// ... existing code ...

interface ChessMove {
  from: string;
  to: string;
}

// ... existing code ...

  // Handle player move
  const handleMove = useCallback(
    async ({move}: ChessMoveInfo) => {
      if (isThinking || isGameOver) {
        return;
      }

      try {
        const beforeState = gameRef.current.exportJson();
        gameRef.current.move(move.from.toUpperCase(), move.to.toUpperCase());
        const afterState = gameRef.current.exportJson();
        
        // Play appropriate sound based on move type
        const isCapture = afterState.pieces[move.to.toUpperCase()] !== undefined;
        const isCastle = move.from.toLowerCase() === 'e1' && move.to.toLowerCase() === 'g1' ||
                        move.from.toLowerCase() === 'e1' && move.to.toLowerCase() === 'c1' ||
                        move.from.toLowerCase() === 'e8' && move.to.toLowerCase() === 'g8' ||
                        move.from.toLowerCase() === 'e8' && move.to.toLowerCase() === 'c8';
        
        playMoveSound({ from: move.from, to: move.to });
        
        evaluateMove(beforeState, afterState);
        adjustDifficulty();

        // ... rest of the code ...
      } catch (error) {
        console.error('Move error:', error);
        chessboardRef.current?.resetBoard();
      } finally {
        setIsThinking(false);
      }
    },
    [handleAIMove, isThinking, isGameOver, handleGameOver, evaluateMove, adjustDifficulty, generateAICommentary],
  );

// ... rest of the code ...
```

---

_**Assistant**_

Let me check the playMoveSound function signature:

---

_**Assistant**_



---

_**Assistant**_

Let me check the actual implementation:

---

_**Assistant**_



---

_**Assistant**_

Now I understand the issue. Let me fix the playMoveSound call:

---

_**Assistant**_

```
// ... existing code ...

  // Handle player move
  const handleMove = useCallback(
    async ({move}: ChessMoveInfo) => {
      if (isThinking || isGameOver) {
        return;
      }

      try {
        const beforeState = gameRef.current.exportJson();
        gameRef.current.move(move.from.toUpperCase(), move.to.toUpperCase());
        const afterState = gameRef.current.exportJson();
        
        // Play appropriate sound based on move type
        const isCapture = afterState.pieces[move.to.toUpperCase()] !== undefined;
        const isCastle = move.from.toLowerCase() === 'e1' && move.to.toLowerCase() === 'g1' ||
                        move.from.toLowerCase() === 'e1' && move.to.toLowerCase() === 'c1' ||
                        move.from.toLowerCase() === 'e8' && move.to.toLowerCase() === 'g8' ||
                        move.from.toLowerCase() === 'e8' && move.to.toLowerCase() === 'c8';
        
        // Play move sound
        playChessSound(isCapture ? 'capture' : isCastle ? 'castle' : 'move_piece');
        
        evaluateMove(beforeState, afterState);
        adjustDifficulty();

        // ... rest of the code ...
      } catch (error) {
        console.error('Move error:', error);
        chessboardRef.current?.resetBoard();
      } finally {
        setIsThinking(false);
      }
    },
    [handleAIMove, isThinking, isGameOver, handleGameOver, evaluateMove, adjustDifficulty, generateAICommentary],
  );

// ... rest of the code ...
```

---

_**Assistant**_

Great! I've made all the necessary changes to implement the Engines section and fix the related issues:

1. Added an Engines section with two personas:
   - Stockfish Rapid (depth 12)
   - Stockfish Deep (depth 20)

2. Added `requiresInternet: true` flag to make the section only visible when online

3. Updated the AIPersona interface to include an optional `depth` parameter

4. Modified the section filtering to only show engine options when online

5. Updated the handleAIMove function to use the Stockfish API when depth is provided and online

6. Fixed various type errors and function calls

The implementation now:
- Shows engine options only when online
- Uses the Stockfish API for engine-based opponents
- Falls back to js-chess-engine for offline/non-engine opponents
- Properly handles move sounds and commentary
- Maintains type safety throughout the codebase

You can now select an engine opponent when online, and it will use the specified depth for move calculation through the Stockfish API.

Would you like me to make any adjustments to this implementation?

---



---

