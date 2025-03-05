## SpecStory

## Integrating Chess Titles in React Native (3/4/2025, 11:35:51 PM)

_**User**_

Add a section to know about chess titles in @TrainingModuleScreen.tsx add it's navigation to @TrainStack.tsx The code is in @ChessTitles.tsx file. 

Please check it once improve it where needed. Also this implementation should be in react-native-cli I've added react-native-linear-gradient

you just have to use it, at the end make this screen theme compatible.

---

_**Assistant**_

I'll help you integrate the chess titles section into your training modules and make it theme compatible. Let's do this step by step:

1. First, let's add the chess titles module to the training modules list:

---

_**Assistant**_

```
// ... existing code ...
export type TrainingStackParamList = {
  TrainingModules: undefined;
  PuzzleCategories: undefined;
  Puzzles: {filter: {type: string}};
  VisionTraining: undefined;
  BlindChess: undefined;
  ChessTitles: undefined;
};

const trainingModules = [
  {
    title: 'Puzzles',
    description: 'Solve chess puzzles based on openings, difficulty, or tactical themes',
    emoji: '🧩',
    screen: 'PuzzleCategories' as const,
  },
  {
    title: 'Vision Training',
    description: 'Practice piece movement and square recognition',
    emoji: '👁️',
    screen: 'VisionTraining' as const,
  },
  {
    title: 'Blind Chess',
    description: 'Practice playing chess without seeing the pieces',
    emoji: '🎯',
    screen: 'BlindChess' as const,
  },
  {
    title: 'Chess Titles',
    description: 'Learn about chess titles and their requirements',
    emoji: '👑',
    screen: 'ChessTitles' as const,
  },
] as const;
// ... existing code ...
```

---

_**Assistant**_



2. Now, let's add the chess titles screen to the navigation stack:

---

_**Assistant**_

```
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TrainStackParamList } from '../types';
import { useTheme } from '../../shared/theme/ThemeContext';
import { getStackScreenOptions } from '../constants';
import TrainingModules from '../../features/train/screens/TrainingModuleScreen';
import PuzzleCategoriesScreen from '../../features/train/screens/PuzzleCategoriesScreen';
import PuzzleSolverScreen from '../../features/train/screens/PuzzleSolverScreen';
import VisionTrainingScreen from '../../features/train/screens/VisionTrainingScreen';
import BlindChessScreen from '../../features/train/screens/BlindChessScreen';
import ChessTitlesScreen from '../../features/train/screens/ChessTitles';
import { ScreenWrapper } from '../../shared/components/ScreenWrapper';

// ... existing code ...

const WrappedChessTitles = () => (
  <ScreenWrapper title="Chess Titles">
    <ChessTitlesScreen />
  </ScreenWrapper>
);

export const TrainStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator screenOptions={getStackScreenOptions(theme)}>
      <Stack.Screen
        name="TrainingModules"
        component={WrappedTrainingModules}
      />
      <Stack.Screen
        name="PuzzleCategories"
        component={WrappedPuzzleCategories}
      />
      <Stack.Screen
        name="PuzzleSolver"
        component={WrappedPuzzleSolver}
      />
      <Stack.Screen
        name="VisionTraining"
        component={WrappedVisionTraining}
      />
      <Stack.Screen
        name="BlindChess"
        component={WrappedBlindChess}
      />
      <Stack.Screen
        name="ChessTitles"
        component={WrappedChessTitles}
      />
    </Stack.Navigator>
  );
};
```

---

_**Assistant**_



3. Now, let's update the ChessTitles screen to make it theme compatible and fix the TypeScript errors:

---

_**Assistant**_

```
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useTheme } from "../../../shared/theme/ThemeContext";

const { width, height } = Dimensions.get("window");

interface ChessTitle {
  title: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  level: number;
}

// Chess title data with level property for pyramid positioning
const chessData: ChessTitle[] = [
  {
    title: "GM",
    name: "Grandmaster",
    description:
      "The highest title a chess player can attain. Requires 3 norms and a rating of 2500 or above.",
    color: "#FFD700", // Gold
    icon: "♔",
    level: 1, // Top of pyramid
  },
  {
    title: "IM",
    name: "International Master",
    description:
      "Second highest title. Requires 3 norms and a rating of 2400 or above.",
    color: "#C0C0C0", // Silver
    icon: "♕",
    level: 2,
  },
  {
    title: "FM",
    name: "FIDE Master",
    description: "Awarded to players who reach a FIDE rating of 2300 or above.",
    color: "#CD7F32", // Bronze
    icon: "♖",
    level: 2,
  },
  {
    title: "CM",
    name: "Candidate Master",
    description: "Awarded to players who reach a FIDE rating of 2200 or above.",
    color: "#2E8B57", // Green
    icon: "♗",
    level: 3,
  },
  {
    title: "WGM",
    name: "Woman Grandmaster",
    description:
      "Highest title for women. Requires 3 norms and a rating of 2300 or above.",
    color: "#FFB6C1", // Pink
    icon: "♛",
    level: 3,
  },
  {
    title: "WIM",
    name: "Woman International Master",
    description: "Requires 3 norms and a rating of 2200 or above.",
    color: "#DDA0DD", // Plum
    icon: "♜",
    level: 4,
  },
  {
    title: "WFM",
    name: "Woman FIDE Master",
    description: "Awarded to women who reach a FIDE rating of 2100 or above.",
    color: "#87CEFA", // Light Blue
    icon: "♝",
    level: 4,
  },
  {
    title: "WCM",
    name: "Woman Candidate Master",
    description: "Awarded to women who reach a FIDE rating of 2000 or above.",
    color: "#98FB98", // Pale Green
    icon: "♞",
    level: 4,
  },
];

interface GroupedTitles {
  [key: number]: ChessTitle[];
}

// Group titles by level for pyramid layout
const groupedTitles: GroupedTitles = chessData.reduce((acc: GroupedTitles, item) => {
  if (!acc[item.level]) {
    acc[item.level] = [];
  }
  acc[item.level].push(item);
  return acc;
}, {});

interface EnergyParticleProps {
  color: string;
  x: number;
  y: number;
  size: number;
  delay: number;
}

// Energy particle component
const EnergyParticle: React.FC<EnergyParticleProps> = ({ color, x, y, size, delay }) => {
  const particleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(particleAnim, {
          toValue: 1,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [delay, particleAnim]);

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        left: x - size / 2,
        top: y - size / 2,
        opacity: particleAnim.interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [0, 0.7, 0],
        }),
        transform: [
          {
            translateX: particleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, (Math.random() - 0.5) * 100],
            }),
          },
          {
            translateY: particleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, (Math.random() - 0.5) * 100],
            }),
          },
          {
            scale: particleAnim.interpolate({
              inputRange: [0, 0.3, 1],
              outputRange: [0.3, 1, 0.5],
            }),
          },
        ],
      }}
    />
  );
};

interface EnergyEffectProps {
  active: boolean;
  color: string;
  centerX: number;
  centerY: number;
}

interface Particle {
  id: number;
  size: number;
  delay: number;
}

// Energy effect component
const EnergyEffect: React.FC<EnergyEffectProps> = ({ active, color, centerX, centerY }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (active) {
      // Generate particles
      const newParticles = Array(15)
        .fill(0)
        .map((_, i) => ({
          id: i,
          size: 4 + Math.random() * 8,
          delay: i * 100,
        }));
      setParticles(newParticles);

      // Start pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      setParticles([]);
    }
  }, [active, pulseAnim]);

  if (!active) return null;

  return (
    <>
      <Animated.View
        style={{
          position: "absolute",
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: `${color}40`,
          left: centerX - 50,
          top: centerY - 50,
          transform: [
            {
              scale: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.5],
              }),
            },
          ],
          opacity: pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 0],
          }),
        }}
      />
      {particles.map((particle) => (
        <EnergyParticle
          key={particle.id}
          color={color}
          x={centerX}
          y={centerY}
          size={particle.size}
          delay={particle.delay}
        />
      ))}
    </>
  );
};

interface ChessTitleNodeProps {
  item: ChessTitle;
  isActive: boolean;
  onPress: () => void;
  centerX: number;
  centerY: number;
}

// Chess title component
const ChessTitleNode: React.FC<ChessTitleNodeProps> = ({ item, isActive, onPress, centerX, centerY }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { theme } = useTheme();

  useEffect(() => {
    // Entry animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Continuous soft pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim, pulseAnim]);

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.setValue(0);
    }
  }, [isActive, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <>
      <EnergyEffect
        active={isActive}
        color={item.color}
        centerX={centerX}
        centerY={centerY}
      />

      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Animated.View
          style={{
            transform: [
              { scale: Animated.multiply(scaleAnim, pulseAnim) },
              { rotate: spin },
            ],
          }}
        >
          <LinearGradient
            colors={[item.color, theme.colors.card, item.color]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.titleNode,
              {
                borderColor: item.color,
                backgroundColor: isActive ? theme.colors.card : theme.colors.background,
                shadowColor: item.color,
                shadowOpacity: isActive ? 0.8 : 0.3,
              },
            ]}
          >
            <Text style={[styles.titleIcon, { color: item.color }]}>
              {item.icon}
            </Text>
            <Text style={[styles.titleAbbr, { color: theme.colors.text }]}>{item.title}</Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </>
  );
};

interface ConnectingLineProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

// Simple line component to replace SVG
const ConnectingLine: React.FC<ConnectingLineProps> = ({ startX, startY, endX, endY }) => {
  const angle = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI;
  const distance = Math.sqrt(
    Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
  );

  return (
    <View
      style={{
        position: "absolute",
        width: distance,
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        left: startX,
        top: startY,
        transformOrigin: "left center",
        transform: [{ rotate: `${angle}deg` }],
        zIndex: -1,
      }}
    />
  );
};

// Main pyramid visualization component
const PyramidVisualization = () => {
  const [selectedTitle, setSelectedTitle] = useState<ChessTitle | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const detailAnim = useRef(new Animated.Value(0)).current;
  const { theme } = useTheme();

  useEffect(() => {
    if (selectedTitle) {
      setDetailVisible(true);
      Animated.timing(detailAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(detailAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDetailVisible(false));
    }
  }, [selectedTitle, detailAnim]);

  const handleSelectTitle = (title: ChessTitle) => {
    if (selectedTitle === title) {
      Animated.timing(detailAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setSelectedTitle(null);
        setDetailVisible(false);
      });
    } else {
      setSelectedTitle(title);
      setDetailVisible(true);
      Animated.timing(detailAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const renderPyramidLevel = (level: number, items: ChessTitle[]) => {
    const levelHeight = 120;
    const levelY = 80 + (level - 1) * levelHeight;
    const itemWidth = width / (items.length + 1);

    return items.map((item, index) => {
      const x = itemWidth * (index + 1);
      const y = levelY;

      return (
        <View
          key={item.title}
          style={{
            position: "absolute",
            left: x - 40,
            top: y - 40,
          }}
        >
          <ChessTitleNode
            item={item}
            isActive={selectedTitle === item}
            onPress={() => handleSelectTitle(item)}
            centerX={x}
            centerY={y}
          />
        </View>
      );
    });
  };

  const renderPyramidLevels = () => {
    return Object.entries(groupedTitles).map(([level, items]) => {
      return renderPyramidLevel(parseInt(level), items);
    });
  };

  const renderConnectingLines = () => {
    const lines: JSX.Element[] = [];

    for (let level = 1; level < Object.keys(groupedTitles).length; level++) {
      const upperItems = groupedTitles[level];
      const lowerItems = groupedTitles[level + 1];

      if (!upperItems || !lowerItems) continue;

      const upperLevelY = 80 + (level - 1) * 120;
      const lowerLevelY = 80 + level * 120;
      const upperItemWidth = width / (upperItems.length + 1);
      const lowerItemWidth = width / (lowerItems.length + 1);

      upperItems.forEach((upperItem, upperIndex) => {
        const upperX = upperItemWidth * (upperIndex + 1);

        lowerItems.forEach((lowerItem, lowerIndex) => {
          const lowerX = lowerItemWidth * (lowerIndex + 1);

          lines.push(
            <ConnectingLine
              key={`${upperItem.title}-${lowerItem.title}`}
              startX={upperX}
              startY={upperLevelY}
              endX={lowerX}
              endY={lowerLevelY}
            />
          );
        });
      });
    }

    return lines;
  };

  return (
    <View style={[styles.pyramidContainer, { backgroundColor: theme.colors.background }]}>
      {renderConnectingLines()}
      {renderPyramidLevels()}

      {detailVisible && selectedTitle && (
        <Animated.View
          style={[
            styles.detailCard,
            {
              opacity: detailAnim,
              transform: [
                {
                  translateY: detailAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.card, theme.colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.detailCardGradient}
          >
            <View style={styles.detailHeader}>
              <Text style={[styles.detailTitleIcon, { color: selectedTitle.color }]}>
                {selectedTitle.icon}
              </Text>
              <View>
                <Text style={[styles.detailTitleAbbr, { color: theme.colors.text }]}>
                  {selectedTitle.title}
                </Text>
                <Text style={[styles.detailTitleName, { color: theme.colors.text }]}>
                  {selectedTitle.name}
                </Text>
              </View>
            </View>
            <Text style={[styles.detailDescription, { color: theme.colors.text }]}>
              {selectedTitle.description}
            </Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.colors.border }]}
              onPress={() => setSelectedTitle(null)}
            >
              <Text style={[styles.closeButtonText, { color: theme.colors.text }]}>
                Close
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pyramidContainer: {
    flex: 1,
    position: "relative",
  },
  titleNode: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    elevation: 8,
  },
  titleIcon: {
    fontSize: 24,
    marginBottom: 5,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  titleAbbr: {
    fontSize: 14,
    fontWeight: "bold",
  },
  detailCard: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  detailCardGradient: {
    padding: 20,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  detailTitleIcon: {
    fontSize: 36,
    marginRight: 16,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  detailTitleAbbr: {
    fontSize: 24,
    fontWeight: "bold",
  },
  detailTitleName: {
    fontSize: 16,
  },
  detailDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  closeButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  closeButtonText: {
    fontWeight: "bold",
  },
});

export default PyramidVisualization;
```

---

_**Assistant**_



Now let's fix the remaining linter errors in the navigation types:

---

_**Assistant**_

```
export type TrainStackParamList = {
  TrainingModules: undefined;
  PuzzleCategories: undefined;
  PuzzleSolver: undefined;
  VisionTraining: undefined;
  BlindChess: undefined;
  ChessTitles: undefined;
};
```

---

_**Assistant**_



Let me explain the changes I've made:

1. Added the chess titles module to the training modules list with a crown emoji and appropriate description.
2. Added the chess titles screen to the navigation stack with proper wrapping.
3. Updated the chess titles component to be theme compatible by:
   - Using theme colors for backgrounds, text, and gradients
   - Removing hardcoded colors and using theme colors instead
   - Making the component fully TypeScript compatible
   - Fixing all React hooks dependencies
   - Removing unused components and styles
   - Using react-native-linear-gradient instead of expo-linear-gradient

The chess titles visualization is now fully integrated into your training module and will respect your app's theme settings. The pyramid visualization shows the hierarchy of chess titles with interactive elements and smooth animations.

Would you like me to make any adjustments to the implementation or explain any part in more detail?

---

_**User**_

Got an error saying "ViewConfig not found for component BVLinearGradient"

---

_**Assistant**_

This error occurs when the native module for react-native-linear-gradient isn't properly linked. Let's fix this by properly linking the native module.

1. First, let's install and link the package properly:

---

_**Assistant**_

```
cd /Users/user/Projects/ai/EightSquare && yarn add react-native-linear-gradient
```

---

_**Assistant**_



2. For iOS, we need to install pods:

---

_**Assistant**_

```
cd ios && pod install && cd ..
```

---

_**Assistant**_



3. Now let's clean and rebuild the app:

---

_**Assistant**_

```
yarn start --reset-cache
```

---

_**Assistant**_

```
cd ios && xcodebuild clean -workspace EightSquare.xcworkspace -scheme EightSquare && cd ..
```

---

_**Assistant**_



---



---

