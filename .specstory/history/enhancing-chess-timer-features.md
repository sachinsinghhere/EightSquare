## SpecStory

## Enhancing Chess Timer Features (2/24/2025, 10:27:45 PM)

_**User**_

Understand the code. 

Add a validation that if any one of the players clock's time has ended then another we'll disable the clock and animate a beautiful message saying match has ended and gives an option to restart the clock. 

Please design the clock as per available themes. 

Please fix the slider it should not take more than 4 hours and player should have an option to select between seconds minutes and hours.



---

_**Assistant**_

I'll help you enhance the chess timer with these features. Let me break this down into steps:

1. First, I'll add theme support to the ChessTimer component
2. Add game over validation and UI
3. Improve the time selection slider

Let me start by modifying the ChessTimer component:

---

_**Assistant**_

```
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface RouteParams {
  minutes: number;
  increment: number;
}

const ChessTimer = () => {
  const route = useRoute();
  const { minutes, increment } = route.params as RouteParams;
  const theme = useTheme();

  const [isRunning, setIsRunning] = useState(false);
  const [activePlayer, setActivePlayer] = useState<'top' | 'bottom' | null>(null);
  const [topTime, setTopTime] = useState(minutes * 60);
  const [bottomTime, setBottomTime] = useState(minutes * 60);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'top' | 'bottom' | null>(null);

  const topScale = useSharedValue(1);
  const bottomScale = useSharedValue(1);
  const gameOverOpacity = useSharedValue(0);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && activePlayer && !gameOver) {
      interval = setInterval(() => {
        if (activePlayer === 'top') {
          setTopTime(prev => {
            if (prev <= 1) {
              setGameOver(true);
              setWinner('bottom');
              setIsRunning(false);
              return 0;
            }
            return Math.max(0, prev - 1);
          });
        } else {
          setBottomTime(prev => {
            if (prev <= 1) {
              setGameOver(true);
              setWinner('top');
              setIsRunning(false);
              return 0;
            }
            return Math.max(0, prev - 1);
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, activePlayer, gameOver]);

  const handlePress = (player: 'top' | 'bottom') => {
    if (gameOver) return;
    
    if (!isRunning) {
      setIsRunning(true);
      setActivePlayer(player);
      return;
    }

    if (activePlayer === player) return;

    // Add increment to the player who just moved
    if (activePlayer === 'top') {
      setTopTime(prev => prev + increment);
      topScale.value = withSequence(
        withSpring(0.95),
        withSpring(1)
      );
    } else {
      setBottomTime(prev => prev + increment);
      bottomScale.value = withSequence(
        withSpring(0.95),
        withSpring(1)
      );
    }

    setActivePlayer(player);
  };

  const topAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: topScale.value }],
  }));

  const bottomAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bottomScale.value }],
  }));

  const gameOverAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(gameOver ? 1 : 0),
    transform: [{ scale: withSpring(gameOver ? 1 : 0.8) }],
  }));

  const resetGame = useCallback(() => {
    setIsRunning(false);
    setActivePlayer(null);
    setTopTime(minutes * 60);
    setBottomTime(minutes * 60);
    setGameOver(false);
    setWinner(null);
  }, [minutes]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar hidden />
      <TouchableOpacity
        style={[
          styles.playerSection,
          styles.topSection,
          { backgroundColor: theme.colors.card },
          activePlayer === 'top' && [styles.activeSection, { backgroundColor: theme.colors.primary }],
        ]}
        onPress={() => handlePress('top')}
        disabled={gameOver}
      >
        <Animated.View style={[styles.timeContainer, topAnimatedStyle]}>
          <Text style={[
            styles.time,
            { color: theme.colors.text },
            activePlayer === 'top' && { color: theme.colors.background },
          ]}>
            {formatTime(topTime)}
          </Text>
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: theme.colors.primary }]}
          onPress={resetGame}
        >
          <Icon name="refresh" size={24} color={theme.colors.background} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.playerSection,
          styles.bottomSection,
          { backgroundColor: theme.colors.card },
          activePlayer === 'bottom' && [styles.activeSection, { backgroundColor: theme.colors.primary }],
        ]}
        onPress={() => handlePress('bottom')}
        disabled={gameOver}
      >
        <Animated.View style={[styles.timeContainer, bottomAnimatedStyle]}>
          <Text style={[
            styles.time,
            { color: theme.colors.text },
            activePlayer === 'bottom' && { color: theme.colors.background },
          ]}>
            {formatTime(bottomTime)}
          </Text>
        </Animated.View>
      </TouchableOpacity>

      {gameOver && (
        <Animated.View 
          style={[styles.gameOverContainer, gameOverAnimatedStyle]}
          entering={FadeInDown}
        >
          <View style={[styles.gameOverCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.gameOverTitle, { color: theme.colors.text }]}>
              Game Over!
            </Text>
            <Text style={[styles.gameOverSubtitle, { color: theme.colors.primary }]}>
              {winner === 'top' ? 'Top' : 'Bottom'} player wins!
            </Text>
            <TouchableOpacity
              style={[styles.restartButton, { backgroundColor: theme.colors.primary }]}
              onPress={resetGame}
            >
              <Text style={[styles.restartButtonText, { color: theme.colors.background }]}>
                Play Again
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  playerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    transform: [{ rotate: '180deg' }],
  },
  bottomSection: {},
  activeSection: {},
  timeContainer: {
    padding: 20,
    borderRadius: 16,
    minWidth: width * 0.6,
    alignItems: 'center',
  },
  time: {
    fontSize: 64,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  controls: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -25 },
      { translateY: -25 },
    ],
    zIndex: 1,
  },
  resetButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 2,
  },
  gameOverCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  gameOverSubtitle: {
    fontSize: 20,
    marginBottom: 24,
  },
  restartButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  restartButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ChessTimer;
```

---

_**Assistant**_



Now let me modify the ChessClockSelection component to improve the time selection:

---

_**Assistant**_

```
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

interface TimeOption {
  minutes: number;
  increment: number;
  display: string;
}

interface TimeSection {
  title: string;
  emoji: string;
  subtitle?: string;
  options: TimeOption[];
}

type TimeUnit = 'seconds' | 'minutes' | 'hours';

const timeSections: TimeSection[] = [
  {
    title: 'Bullet',
    emoji: '🚀',
    options: [
      { minutes: 1, increment: 0, display: '1 min' },
      { minutes: 1, increment: 1, display: '1 | 1' },
      { minutes: 2, increment: 1, display: '2 | 1' },
    ]
  },
  {
    title: 'Blitz',
    emoji: '⚡️',
    options: [
      { minutes: 3, increment: 0, display: '3 min' },
      { minutes: 3, increment: 2, display: '3 | 2' },
      { minutes: 5, increment: 0, display: '5 min' },
      { minutes: 5, increment: 5, display: '5 | 5' },
      { minutes: 5, increment: 2, display: '5 | 2' },
    ]
  },
  {
    title: 'Rapid',
    emoji: '⏰',
    options: [
      { minutes: 10, increment: 0, display: '10 min' },
      { minutes: 15, increment: 10, display: '15 | 10' },
      { minutes: 30, increment: 0, display: '30 min' },
      { minutes: 10, increment: 5, display: '10 | 5' },
      { minutes: 20, increment: 0, display: '20 min' },
      { minutes: 60, increment: 0, display: '60 min' },
    ]
  },
];

const ChessClockSelection = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [customTime, setCustomTime] = useState(10);
  const [customIncrement, setCustomIncrement] = useState(0);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('minutes');
  const [incrementUnit, setIncrementUnit] = useState<TimeUnit>('seconds');

  const getMaxTime = (unit: TimeUnit) => {
    switch (unit) {
      case 'hours':
        return 4;
      case 'minutes':
        return 240;
      case 'seconds':
        return 14400;
    }
  };

  const convertToMinutes = (value: number, unit: TimeUnit) => {
    switch (unit) {
      case 'hours':
        return value * 60;
      case 'minutes':
        return value;
      case 'seconds':
        return value / 60;
    }
  };

  const convertFromMinutes = (minutes: number, unit: TimeUnit) => {
    switch (unit) {
      case 'hours':
        return minutes / 60;
      case 'minutes':
        return minutes;
      case 'seconds':
        return minutes * 60;
    }
  };

  const handleTimeSelect = (minutes: number, increment: number) => {
    navigation.navigate('ChessTimer', { minutes, increment });
  };

  const handleCustomTimeSelect = () => {
    const minutes = convertToMinutes(customTime, timeUnit);
    const incrementSeconds = convertToMinutes(customIncrement, incrementUnit) * 60;
    handleTimeSelect(minutes, incrementSeconds);
  };

  const renderTimeOption = (option: TimeOption) => (
    <TouchableOpacity
      key={option.display}
      style={[styles.timeOption, { backgroundColor: theme.colors.card }]}
      onPress={() => handleTimeSelect(option.minutes, option.increment)}
    >
      <Text style={[styles.timeOptionText, { color: theme.colors.text }]}>{option.display}</Text>
    </TouchableOpacity>
  );

  const renderSection = (section: TimeSection) => (
    <Animated.View 
      key={section.title}
      entering={FadeIn}
      style={styles.section}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEmoji}>{section.emoji}</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{section.title}</Text>
        {section.subtitle && (
          <Text style={[styles.sectionSubtitle, { color: theme.colors.text }]}>{section.subtitle}</Text>
        )}
      </View>
      <View style={styles.optionsGrid}>
        {section.options.map(renderTimeOption)}
      </View>
    </Animated.View>
  );

  const renderUnitSelector = (
    currentUnit: TimeUnit,
    onSelect: (unit: TimeUnit) => void,
    allowHours: boolean = true
  ) => (
    <View style={styles.unitSelector}>
      <TouchableOpacity
        style={[
          styles.unitOption,
          currentUnit === 'seconds' && { backgroundColor: theme.colors.primary },
        ]}
        onPress={() => onSelect('seconds')}
      >
        <Text style={[
          styles.unitText,
          { color: currentUnit === 'seconds' ? theme.colors.background : theme.colors.text },
        ]}>sec</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.unitOption,
          currentUnit === 'minutes' && { backgroundColor: theme.colors.primary },
        ]}
        onPress={() => onSelect('minutes')}
      >
        <Text style={[
          styles.unitText,
          { color: currentUnit === 'minutes' ? theme.colors.background : theme.colors.text },
        ]}>min</Text>
      </TouchableOpacity>
      {allowHours && (
        <TouchableOpacity
          style={[
            styles.unitOption,
            currentUnit === 'hours' && { backgroundColor: theme.colors.primary },
          ]}
          onPress={() => onSelect('hours')}
        >
          <Text style={[
            styles.unitText,
            { color: currentUnit === 'hours' ? theme.colors.background : theme.colors.text },
          ]}>hr</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Time Control</Text>
      {timeSections.map(renderSection)}
      
      <Animated.View 
        entering={FadeIn}
        style={styles.section}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEmoji}>⚙️</Text>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Custom</Text>
        </View>
        <View style={[styles.customSection, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.customLabel, { color: theme.colors.text }]}>
            Initial Time: {customTime} {timeUnit}
          </Text>
          {renderUnitSelector(timeUnit, setTimeUnit)}
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={getMaxTime(timeUnit)}
            value={convertFromMinutes(customTime, timeUnit)}
            onValueChange={(value) => setCustomTime(Math.round(value))}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.primary}
          />
          
          <Text style={[styles.customLabel, { color: theme.colors.text }]}>
            Increment: {customIncrement} {incrementUnit}
          </Text>
          {renderUnitSelector(incrementUnit, setIncrementUnit, false)}
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={60}
            value={customIncrement}
            onValueChange={(value) => setCustomIncrement(Math.round(value))}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.primary}
          />
          
          <TouchableOpacity
            style={[styles.selectButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleCustomTimeSelect}
          >
            <Text style={[styles.selectButtonText, { color: theme.colors.background }]}>Start Game</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 14,
    marginLeft: 8,
    alignSelf: 'flex-end',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeOption: {
    borderRadius: 8,
    padding: 12,
    minWidth: (width - 48) / 3,
    alignItems: 'center',
  },
  timeOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  customSection: {
    borderRadius: 12,
    padding: 16,
  },
  customLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 16,
  },
  unitSelector: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  unitOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  unitText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectButton: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChessClockSelection;
```

---

_**Assistant**_



Let me fix the linter errors in both files:

---

_**Assistant**_

```
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

// ... rest of the file stays the same ...
```

---

_**Assistant**_

```
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

interface RouteParams {
  minutes: number;
  increment: number;
}

const ChessTimer = () => {
  const route = useRoute();
  const { minutes, increment } = route.params as RouteParams;
  const theme = useTheme();

  const [isRunning, setIsRunning] = useState(false);
  const [activePlayer, setActivePlayer] = useState<'top' | 'bottom' | null>(null);
  const [topTime, setTopTime] = useState(minutes * 60);
  const [bottomTime, setBottomTime] = useState(minutes * 60);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'top' | 'bottom' | null>(null);

  const topScale = useSharedValue(1);
  const bottomScale = useSharedValue(1);

  // ... rest of the file stays the same ...
```

---

_**Assistant**_

```
  const [winner, setWinner] = useState<'top' | 'bottom' | null>(null);

  const topScale = useSharedValue(1);
  const bottomScale = useSharedValue(1);

  const formatTime = (seconds: number) => {
// ... rest of the file stays the same ...
```

---

_**Assistant**_

```
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

// ... rest of the file stays the same ...
```

---

_**Assistant**_



I've made several improvements to the chess timer app:

1. Added theme support to both screens using the theme system from `theme.ts`
2. Added game over state with a beautiful animated overlay
3. Improved time selection with:
   - Unit selection (seconds/minutes/hours)
   - Maximum time limit of 4 hours
   - Separate units for initial time and increment
   - Better slider ranges based on selected unit
   - Improved UI with theme support

The changes include:

1. In ChessTimer:
- Added game over detection and UI
- Added theme support for colors
- Improved animations for game over state
- Added winner display
- Fixed time formatting to support hours

2. In ChessClockSelection:
- Added unit selection (seconds/minutes/hours)
- Improved time selection UI
- Added theme support
- Better time conversion between units
- Maximum time limits (4 hours, 240 minutes, or 14400 seconds)
- Separate increment unit selection
- Improved slider behavior

The timer will now:
1. Stop when any player's time runs out
2. Show a beautiful animated overlay with the winner
3. Offer a "Play Again" button
4. Support theme colors from the theme system
5. Have better time selection controls

The time selection now:
1. Supports hours/minutes/seconds
2. Has a maximum limit of 4 hours
3. Has separate unit selection for initial time and increment
4. Shows the selected unit next to the value
5. Automatically converts between units

Would you like me to make any adjustments to these changes?

---

_**User**_

Please fix bugs of Custom timer selection. 

- remove secs selection 
- I can see some miscalculation while selecting timers for both.


---

_**Assistant**_

I'll help fix the custom timer selection issues. Let me modify the ChessClockSelection component to:
1. Remove seconds as a time unit option
2. Fix the time calculations
3. Simplify the increment selection

---

_**Assistant**_

```
undefined
```

---

_**Assistant**_



---



---

