## SpecStory

## Design Enhancement with Titles and Animations (3/7/2025, 9:59:29 PM)

_**User**_

Add some titles to improve this design, do not alter anything apart from that. 

Add a feature whenever i set a theme it should scroll to top and we play a animation like a sprinkle or a wind blowing.

---

_**Assistant**_

I'll help you add titles and the animation feature. Let me first check the theme-related rules since we're working with themes.

---

_**Assistant**_



---

_**Assistant**_

I'll make the following changes:
1. Add titles to improve the design
2. Add a scroll-to-top animation when a theme is selected
3. Add a sprinkle animation effect

First, let's edit the file to add these features:

---

_**Assistant**_

```
import React, {useEffect, useCallback, useRef} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  Image,
  ScrollView,
  Text,
  Animated,
} from 'react-native';
// ... existing code ...

const ThemeSelectionScreen: React.FC<ThemeSelectionScreenProps> = ({
  navigation,
}) => {
  const themes = Object.values(brandThemes.default);
  const {theme, setTheme} = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const sparkleAnimation = useRef(new Animated.Value(0)).current;

  const animateSparkle = () => {
    sparkleAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(sparkleAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('selectedTheme');
        if (storedTheme) {
          const parsedTheme = JSON.parse(storedTheme);
          setTheme(parsedTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, [setTheme]);

  const handleSelectTheme = useCallback(async (selectedTheme: Theme) => {
    try {
      await AsyncStorage.setItem('selectedTheme', JSON.stringify(selectedTheme));
      setTheme(selectedTheme);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      animateSparkle();
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, [setTheme, sparkleAnimation]);

  // ... existing code ...

  return (
    <ScreenWrapper title="Theme">
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.mainTitle, { color: theme.colors.text }]}>
          Preview Board
        </Text>
        <View pointerEvents="none" style={[styles.board, {height: BOARD_SIZE}]}>
          <Animated.View
            style={[
              styles.sparkleOverlay,
              {
                opacity: sparkleAnimation,
                transform: [{
                  scale: sparkleAnimation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.2, 1]
                  })
                }]
              }
            ]}
          >
            <Chessboard
              colors={{
                black: theme.colors.primary,
                white: theme.colors.secondary,
              }}
              renderPiece={piece => (
                <Image
                  style={{
                    width: BOARD_SIZE / 8,
                    height: BOARD_SIZE / 8,
                  }}
                  source={themeChessboardImages[theme.name.toLowerCase()][piece]}
                />
              )}
              boardSize={BOARD_SIZE}
            />
          </Animated.View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Available Themes
        </Text>
        <View
          style={[
            styles.container,
            {backgroundColor: theme.colors.background},
          ]}>
          <FlatList
            scrollEnabled={false}
            data={themes}
            showsVerticalScrollIndicator={false}
            renderItem={renderThemeItem}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainTitle: {
    fontFamily: 'CormorantGaramond-Bold',
    fontSize: 28,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'CormorantGaramond-Bold',
    fontSize: 24,
    marginLeft: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  sparkleOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  // ... existing styles ...
```

---

_**Assistant**_

Let me fix the linter error by adding the missing dependency to the useCallback hook:

---

_**Assistant**_

```
// ... existing code ...
  const handleSelectTheme = useCallback(async (selectedTheme: Theme) => {
    try {
      await AsyncStorage.setItem('selectedTheme', JSON.stringify(selectedTheme));
      setTheme(selectedTheme);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      animateSparkle();
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, [setTheme, sparkleAnimation, animateSparkle]);
// ... existing code ...
```

---

_**Assistant**_

Let me fix the final linter error by removing the unnecessary dependency:

---

_**Assistant**_

```
// ... existing code ...
  const handleSelectTheme = useCallback(async (selectedTheme: Theme) => {
    try {
      await AsyncStorage.setItem('selectedTheme', JSON.stringify(selectedTheme));
      setTheme(selectedTheme);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      animateSparkle();
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, [setTheme, animateSparkle]);
// ... existing code ...
```

---

_**Assistant**_

Let me fix the final linter error by wrapping the `animateSparkle` function in its own `useCallback` hook:

---

_**Assistant**_

```
// ... existing code ...
  const sparkleAnimation = useRef(new Animated.Value(0)).current;

  const animateSparkle = useCallback(() => {
    sparkleAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(sparkleAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [sparkleAnimation]);

// ... existing code ...
```

---

_**Assistant**_

I've made all the requested changes to improve the design and add animation features:

1. Added two new titles:
   - "Preview Board" above the chessboard
   - "Available Themes" above the theme list

2. Added animation features:
   - When a theme is selected, the screen automatically scrolls to the top
   - Added a sparkle animation effect that scales and fades the board when a new theme is selected

3. Fixed all linter errors by:
   - Properly managing dependencies in useCallback hooks
   - Wrapping the animation function in its own useCallback

The changes create a more polished user experience with:
- Clear section headers to improve navigation
- Smooth scrolling to top when changing themes
- A subtle but noticeable animation effect when selecting a new theme
- The animation is implemented using React Native's Animated API for optimal performance

Is there anything specific about the animations or titles that you'd like me to adjust?

---



---

