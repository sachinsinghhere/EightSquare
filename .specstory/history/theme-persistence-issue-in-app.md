## SpecStory

## Theme Persistence Issue in App (3/9/2025, 4:14:58 PM)

_**User**_

The selected theme is not persisting when coming from kill state only works for this screen not whole app.

Please fix it and make sure it should not break current implementation.

---

_**Assistant**_

I'll help you fix the theme persistence issue. The problem seems to be that while we're saving the theme to AsyncStorage, we need to load it when the app starts up, not just in the ThemeSelectionScreen.

Let me search for the theme context implementation first to see how we can properly fix this.

---

_**Assistant**_



---

_**Assistant**_

I see the issue. The theme is being loaded in the `ThemeSelectionScreen` but it needs to be loaded when the app starts. Let me check the current theme context implementation to make the necessary changes.

---

_**Assistant**_



---

_**Assistant**_

I'll modify the `ThemeProvider` to load the theme from AsyncStorage when the app starts and save it whenever it changes. Here's what I'll do:

1. Add a useEffect hook in the ThemeProvider to load the theme from AsyncStorage on app start
2. Wrap the setTheme function to automatically save to AsyncStorage whenever the theme changes

Let me make these changes:

---

_**Assistant**_

```
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Theme, brandThemes } from './theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(brandThemes.default.cosmos);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('selectedTheme');
        if (storedTheme) {
          const parsedTheme = JSON.parse(storedTheme);
          setThemeState(parsedTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  const setTheme = useCallback(async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem('selectedTheme', JSON.stringify(newTheme));
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

---

_**Assistant**_

Now that I've updated the `ThemeContext` to handle theme persistence, we can simplify the `ThemeSelectionScreen` since it no longer needs to handle the AsyncStorage operations itself. Let me update that file:

---

_**Assistant**_

```
import React, {useCallback, useRef} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Text,
} from 'react-native';
import {
  brandThemes,
  Theme,
  themeChessboardImages,
} from '../../../shared/theme/theme';
import {useTheme} from '../../../shared/theme/ThemeContext';
import ThemeItem from '../components/Theme';
import {ScreenWrapper} from '../../../shared/components/ScreenWrapper';
import Chessboard from 'react-native-chessboard';
import FastImage from 'react-native-fast-image';

interface ThemeSelectionScreenProps {
  navigation: {
    goBack: () => void;
  };
}

const ThemeSelectionScreen: React.FC<ThemeSelectionScreenProps> = ({
  navigation,
}) => {
  const themes = Object.values(brandThemes.default);
  const {theme, setTheme} = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSelectTheme = useCallback(
    (selectedTheme: Theme) => {
      setTheme(selectedTheme);
      scrollViewRef.current?.scrollTo({x: 0, y: 0, animated: true});
      // navigation.goBack();
    },
    [setTheme],
  );

  const renderThemeItem = useCallback(
    ({item, index}: {item: Theme; index: number}) => (
      <ThemeItem
        item={item}
        index={index}
        currentTheme={theme.name}
        onSelect={handleSelectTheme}
      />
    ),
    [theme.name, handleSelectTheme],
  );

  const {width} = useWindowDimensions();
  const BOARD_SIZE = width * 0.6;

  return (
    <ScreenWrapper title="Theme">
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        <Text
          style={{
            color: theme.colors.text,
            fontSize: 24,
            fontFamily: 'CormorantGaramond-Bold',
            textAlign: 'center',
            marginTop: 20,
          }}>
          Board preview
        </Text>
        <View pointerEvents="none" style={[styles.board, {height: BOARD_SIZE}]}>
          <Chessboard
            colors={{
              black: theme.colors.primary,
              white: theme.colors.secondary,
            }}
            renderPiece={piece => (
              <FastImage
                style={{
                  width: BOARD_SIZE / 8,
                  height: BOARD_SIZE / 8,
                }}
                source={
                  themeChessboardImages?.[theme.name.toLowerCase()]?.[piece]
                }
              />
            )}
            boardSize={BOARD_SIZE}
          />
        </View>
        <Text
          style={{
            color: theme.colors.text,
            fontSize: 24,
            fontFamily: 'CormorantGaramond-Bold',
            textAlign: 'center',
            marginVertical: 16,
          }}>
          {`Active : ${theme.name}`}
        </Text>

        <View style={[styles.container]}>
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
```

---

_**Assistant**_

Let me fix the linter errors in the `ThemeSelectionScreen`:

1. The `navigation` parameter is not used, so we can prefix it with an underscore
2. The `FastImage` source type needs to be adjusted to match the expected type

---

_**Assistant**_

```
import React, {useCallback, useRef} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Text,
} from 'react-native';
import {
  brandThemes,
  Theme,
  themeChessboardImages,
} from '../../../shared/theme/theme';
import {useTheme} from '../../../shared/theme/ThemeContext';
import ThemeItem from '../components/Theme';
import {ScreenWrapper} from '../../../shared/components/ScreenWrapper';
import Chessboard from 'react-native-chessboard';
import FastImage, {Source} from 'react-native-fast-image';

interface ThemeSelectionScreenProps {
  navigation: {
    goBack: () => void;
  };
}

const ThemeSelectionScreen: React.FC<ThemeSelectionScreenProps> = ({
  navigation: _navigation,
}) => {
  const themes = Object.values(brandThemes.default);
  const {theme, setTheme} = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSelectTheme = useCallback(
    (selectedTheme: Theme) => {
      setTheme(selectedTheme);
      scrollViewRef.current?.scrollTo({x: 0, y: 0, animated: true});
      // navigation.goBack();
    },
    [setTheme],
  );

  const renderThemeItem = useCallback(
    ({item, index}: {item: Theme; index: number}) => (
      <ThemeItem
        item={item}
        index={index}
        currentTheme={theme.name}
        onSelect={handleSelectTheme}
      />
    ),
    [theme.name, handleSelectTheme],
  );

  const {width} = useWindowDimensions();
  const BOARD_SIZE = width * 0.6;

  return (
    <ScreenWrapper title="Theme">
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        <Text
          style={{
            color: theme.colors.text,
            fontSize: 24,
            fontFamily: 'CormorantGaramond-Bold',
            textAlign: 'center',
            marginTop: 20,
          }}>
          Board preview
        </Text>
        <View pointerEvents="none" style={[styles.board, {height: BOARD_SIZE}]}>
          <Chessboard
            colors={{
              black: theme.colors.primary,
              white: theme.colors.secondary,
            }}
            renderPiece={piece => (
              <FastImage
                style={{
                  width: BOARD_SIZE / 8,
                  height: BOARD_SIZE / 8,
                }}
                source={
                  themeChessboardImages?.[theme.name.toLowerCase()]?.[piece] as Source
                }
              />
            )}
            boardSize={BOARD_SIZE}
          />
        </View>
        <Text
          style={{
            color: theme.colors.text,
            fontSize: 24,
            fontFamily: 'CormorantGaramond-Bold',
            textAlign: 'center',
            marginVertical: 16,
          }}>
          {`Active : ${theme.name}`}
        </Text>

        <View style={[styles.container]}>
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
```

---

_**Assistant**_

Great! I've made the following changes to fix the theme persistence:

1. Updated `ThemeContext.tsx` to:
   - Load the theme from AsyncStorage when the app starts
   - Save the theme to AsyncStorage whenever it changes
   - Use a single source of truth for theme storage

2. Simplified `ThemeSelectionScreen.tsx` by:
   - Removing duplicate AsyncStorage logic since it's now handled in the context
   - Fixed linter errors related to FastImage source type and unused navigation prop

The theme should now persist across app restarts and be consistent throughout the entire application. The changes maintain all existing functionality while adding proper persistence.

Is there anything specific you'd like me to explain about these changes?

---

_**User**_

At this screen, scrolling feels laggy please fix it. 

---

_**Assistant**_

I notice that the scrolling performance issue might be caused by a few factors in the `ThemeSelectionScreen`:

1. The `FlatList` is nested inside a `ScrollView`, which can cause performance issues
2. The `FlatList` has `scrollEnabled={false}`, which means we're relying on the parent `ScrollView` for scrolling
3. Each theme item might be re-rendering unnecessarily

Let me optimize this by:
1. Removing the nested scroll views
2. Implementing proper list item m

---



---

