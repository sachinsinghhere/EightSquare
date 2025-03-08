## SpecStory

## UI Improvement for Chess Game Controls (3/8/2025, 6:11:14 PM)

_**User**_

Apart from chess board, improve the UI of clock, resign & draw buttons keep them encapsulated. use @typography.ts for the fontfamily integration. 

---

_**Assistant**_

I'll help improve the UI of the clock and game control buttons using the typography styles. I'll first analyze the current code and then make the improvements.

Let me fetch the chessboard rule to ensure our changes align with the existing design system.

---

_**Assistant**_



---

_**Assistant**_

I'll now improve the UI by creating a dedicated clock component and a game controls component with better styling and typography. I'll edit the GameScreen.tsx file to implement these changes.

---

_**Assistant**_

```
import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
} from 'react-native';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {ScreenWrapper} from '../../../shared/components/ScreenWrapper';
import {useRoute} from '@react-navigation/native';
import {Game} from 'js-chess-engine';
import type {Move} from 'chess.js';
import ESChessboard from '../../../shared/components/ESChessboard';
import type {ChessboardRef} from 'react-native-chessboard';
import {playMoveSound} from '../../../utils/sounds';
import {textStyles, fonts} from '../../../shared/theme/typography';

// ... existing code ...

const PlayerClock = ({
  time,
  isActive,
  playerColor,
  theme,
}: {
  time: number;
  isActive: boolean;
  playerColor: string;
  theme: any;
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View
      style={[
        styles.clockContainer,
        {
          backgroundColor: isActive ? theme.colors.primary + '20' : 'transparent',
          borderColor: isActive ? theme.colors.primary : theme.colors.border,
        },
      ]}>
      <Text style={[textStyles.h4, styles.playerText, {color: theme.colors.text}]}>
        {playerColor}
      </Text>
      <Text
        style={[
          textStyles.h2,
          {
            color: isActive ? theme.colors.primary : theme.colors.text,
          },
        ]}>
        {formatTime(time)}
      </Text>
    </View>
  );
};

const GameControls = ({
  onResign,
  onDraw,
  isGameOver,
  theme,
}: {
  onResign: () => void;
  onDraw: () => void;
  isGameOver: boolean;
  theme: any;
}) => (
  <View style={styles.gameControlsContainer}>
    <TouchableOpacity
      style={[
        styles.controlButton,
        {
          backgroundColor: theme.colors.error,
          opacity: isGameOver ? 0.5 : 1,
        },
      ]}
      onPress={onResign}
      disabled={isGameOver}>
      <Text style={[textStyles.button, styles.buttonText]}>Resign</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[
        styles.controlButton,
        {
          backgroundColor: theme.colors.primary,
          opacity: isGameOver ? 0.5 : 1,
        },
      ]}
      onPress={onDraw}
      disabled={isGameOver}>
      <Text style={[textStyles.button, styles.buttonText]}>Offer Draw</Text>
    </TouchableOpacity>
  </View>
);

const GameScreen = () => {
  // ... existing code until return statement ...

  return (
    <ScreenWrapper title="Chess Game" showBack>
      <View style={styles.container}>
        <PlayerClock
          time={blackTime}
          isActive={currentPlayer === 'black'}
          playerColor="Black"
          theme={theme}
        />

        <ESChessboard
          boardRef={chessboardRef}
          boardSize={BOARD_SIZE}
          onMove={handleMove}
        />

        <PlayerClock
          time={whiteTime}
          isActive={currentPlayer === 'white'}
          playerColor="White"
          theme={theme}
        />

        <GameControls
          onResign={handleResign}
          onDraw={handleDrawOffer}
          isGameOver={isGameOver}
          theme={theme}
        />

        {isGameOver && (
          <View
            style={[
              styles.gameOverContainer,
              {backgroundColor: theme.colors.surface},
            ]}>
            <Text
              style={[
                textStyles.h3,
                styles.gameOverText,
                {color: theme.colors.text},
              ]}>
              Game Over!{' '}
              {winner === 'draw'
                ? "It's a draw!"
                : `${winner?.toUpperCase()} wins!`}
            </Text>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  clockContainer: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  playerText: {
    marginBottom: 4,
  },
  gameControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  controlButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 140,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  gameOverContainer: {
    position: 'absolute',
    top: '50%',
    left: 16,
    right: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    transform: [{translateY: -50}],
  },
  gameOverText: {
    textAlign: 'center',
  },
});

export default GameScreen;
```

---

_**Assistant**_

I've made several improvements to the UI:

1. Created a dedicated `PlayerClock` component that:
   - Uses proper typography from the design system
   - Has a subtle background highlight when active
   - Includes a border and elevation for depth
   - Shows player color and time in a cleaner layout

2. Created a `GameControls` component that:
   - Uses consistent button styling
   - Implements proper typography for button text
   - Has improved spacing and padding
   - Includes elevation and shadow effects
   - Shows disabled state when game is over

3. Enhanced the overall styling:
   - Added proper spacing between components
   - Improved the game over modal with better elevation and typography
   - Made buttons larger and more prominent
   - Added subtle animations through opacity changes for interactive states

4. Integrated the typography system:
   - Using `textStyles.h2` for clock numbers
   - Using `textStyles.h4` for player labels
   - Using `textStyles.button` for button text
   - Using `textStyles.h3` for game over text

Let me fix the linter errors by removing the unused imports and functions:

---

_**Assistant**_

```
import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
} from 'react-native';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {ScreenWrapper} from '../../../shared/components/ScreenWrapper';
import {useRoute} from '@react-navigation/native';
import {Game} from 'js-chess-engine';
import type {Move} from 'chess.js';
import ESChessboard from '../../../shared/components/ESChessboard';
import type {ChessboardRef} from 'react-native-chessboard';
import {playMoveSound} from '../../../utils/sounds';
import {textStyles} from '../../../shared/theme/typography';

// ... existing code ...
```

---

_**Assistant**_

Let me fix the remaining linter error by removing the unused `formatTime` function from the main component since it's now only used in the `PlayerClock` component:

---

_**Assistant**_

```
// ... existing imports ...

const GameScreen = () => {
  const route = useRoute();
  const {minutes, increment} = route.params as RouteParams;
  const {theme} = useTheme();
  const {width} = useWindowDimensions();
  const BOARD_SIZE = width - 32;

  const [whiteTime, setWhiteTime] = useState(minutes * 60);
  const [blackTime, setBlackTime] = useState(minutes * 60);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<'white' | 'black' | 'draw' | null>(null);

  const chessboardRef = useRef<ChessboardRef>(null);
  const gameRef = useRef(new Game());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle game over
  const handleGameOver = useCallback((result: 'white' | 'black' | 'draw') => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsGameOver(true);
    setWinner(result);
  }, []);

// ... rest of the existing code ...
```

---

_**Assistant**_

The UI improvements are now complete and all linter errors have been fixed. The changes include:

1. Better encapsulation through dedicated components
2. Improved visual hierarchy with proper typography
3. Enhanced user feedback through visual states
4. Better spacing and layout
5. Proper elevation and shadows for depth
6. Consistent styling across all elements

The game screen now has a more polished and professional look while maintaining its functionality. The clocks are more prominent and easier to read, and the game controls are more accessible and visually appealing.

Is there anything specific about the improved UI that you'd like me to explain or adjust further?

---

_**User**_

The timer looks too big keep it compact, also I can't see the options to resign or offer a draw, please include them. Keep the design responsive. I liked the rest of the things.

---

_**Assistant**_

I'll help modify the UI to make the timer more compact and ensure the game controls are visible. Looking at the screenshot, I can see that the game controls are missing and the timer takes up too much space. Let me adjust the styling:

---

_**Assistant**_

```
const PlayerClock = ({
  time,
  isActive,
  playerColor,
  theme,
}: {
  time: number;
  isActive: boolean;
  playerColor: string;
  theme: any;
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View
      style={[
        styles.clockContainer,
        {
          backgroundColor: isActive ? theme.colors.primary + '10' : 'transparent',
          borderColor: isActive ? theme.colors.primary : theme.colors.border,
        },
      ]}>
      <View style={styles.clockInnerContainer}>
        <Text style={[textStyles.bodyMedium, styles.playerText, {color: theme.colors.text}]}>
          {playerColor}
        </Text>
        <Text
          style={[
            textStyles.h4,
            {
              color: isActive ? theme.colors.primary : theme.colors.text,
            },
          ]}>
          {formatTime(time)}
        </Text>
      </View>
    </View>
  );
};

const GameControls = ({
  onResign,
  onDraw,
  isGameOver,
  theme,
}: {
  onResign: () => void;
  onDraw: () => void;
  isGameOver: boolean;
  theme: any;
}) => (
  <View style={styles.gameControlsContainer}>
    <TouchableOpacity
      style={[
        styles.controlButton,
        {
          backgroundColor: theme.colors.error + 'CC',
          opacity: isGameOver ? 0.5 : 1,
        },
      ]}
      onPress={onResign}
      disabled={isGameOver}>
      <Text style={[textStyles.bodySmall, styles.buttonText]}>Resign</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[
        styles.controlButton,
        {
          backgroundColor: theme.colors.primary + 'CC',
          opacity: isGameOver ? 0.5 : 1,
        },
      ]}
      onPress={onDraw}
      disabled={isGameOver}>
      <Text style={[textStyles.bodySmall, styles.buttonText]}>Offer Draw</Text>
    </TouchableOpacity>
  </View>
);

// ... rest of the code until styles ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  clockContainer: {
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  clockInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  playerText: {
    marginRight: 8,
  },
  gameControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  controlButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  gameOverContainer: {
    position: 'absolute',
    top: '50%',
    left: 16,
    right: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    transform: [{translateY: -50}],
  },
  gameOverText: {
    textAlign: 'center',
  },
});
```

---

_**Assistant**_

I've made several improvements to match the screenshot and make the UI more compact:

1. Clock Component Changes:
   - Made the clock more compact by using a horizontal layout
   - Reduced the font size using `textStyles.h4` instead of `h2`
   - Decreased padding and margins
   - Made the active state highlight more subtle
   - Player name and time now appear on the same line
   - Reduced elevation and shadow for a flatter look

2. Game Controls Changes:
   - Positioned the controls at the bottom of the screen using `position: 'absolute'`
   - Made buttons smaller and more compact
   - Added semi-transparency to the button backgrounds
   - Reduced text size using `textStyles.bodySmall`
   - Ensured buttons are always visible with `zIndex: 1`
   - Spaced buttons evenly with proper padding
   - Reduced elevation and shadow effects

3. Layout Improvements:
   - Reduced vertical spacing between components
   - Made all elements more compact while maintaining touch targets
   - Ensured the UI remains responsive on different screen sizes
   - Improved the visual hierarchy with more subtle shadows and elevations

The changes maintain the functionality while making the UI more compact and ensuring the game controls are always visible at the bottom of the screen. The timer is now less prominent but still clearly readable, and the overall layout is more balanced.

Would you like me to make any additional adjustments to the sizing or positioning of these elements?

---

_**User**_

Looks good. Can you keep the option of resign and draw in the timer component, adjust accordingly. Also I want the options for both players.

---

_**Assistant**_

I'll modify the PlayerClock component to include the game controls for each player, making them more compact and integrated with the timer. Here's the update:

---

_**Assistant**_

```
undefined
```

---

_**Assistant**_



---



---

