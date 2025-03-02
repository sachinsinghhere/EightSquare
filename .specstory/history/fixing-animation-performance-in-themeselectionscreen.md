## SpecStory

## Fixing Animation Performance in ThemeSelectionScreen (3/3/2025, 12:50:28 AM)

_**User**_

This screen items keep getting animated please fix this.

---

_**Assistant**_

I notice that in the `ThemeSelectionScreen.tsx` file, there are some performance optimizations that are commented out in the `FlatList` component. These optimizations can help prevent unnecessary re-renders and animations. Let me enable these optimizations and add a few more to improve the performance.

I'll edit the file to:
1. Uncomment the performance-related props
2. Add `initialNumToRender` to limit initial rendering
3. Add `getItemLayout` for fixed height items to improve performance

Let me make these changes:

---

_**Assistant**_

```
// ... existing code ...
  const keyExtractor = useCallback((item: Theme) => item.name, []);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: 208, // height of item (180) + vertical padding (16) + margin bottom (12)
    offset: 208 * index,
    index,
  }), []);

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <FlatList
        data={themes}
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor}
        renderItem={renderThemeItem}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={4}
        windowSize={3}
        initialNumToRender={4}
        getItemLayout={getItemLayout}
      />
    </View>
// ... existing code ...
```

---

_**Assistant**_



I've made several optimizations to prevent unnecessary animations and improve performance:

1. Uncommented and enabled these performance props:
   - `keyExtractor`: Provides a stable key for each item
   - `removeClippedSubviews`: Detaches off-screen items from the view hierarchy
   - `maxToRenderPerBatch`: Limits the number of items rendered in each batch
   - `windowSize`: Controls how many items are rendered beyond the visible area

2. Added new optimizations:
   - `initialNumToRender={4}`: Limits the initial render to just 4 items
   - `getItemLayout`: Pre-calculates item heights so FlatList doesn't need to measure them dynamically, which can cause layout jumps

These changes should significantly reduce unnecessary animations and improve the overall performance of the theme selection screen. The items should now stay stable and only animate when explicitly triggered by user interaction.

The `getItemLayout` function I added is particularly important as it helps FlatList know the exact dimensions of items beforehand, preventing layout recalculations that can cause unwanted animations. The calculation (208) accounts for:
- 180px for the theme image height
- 16px for vertical padding
- 12px for margin bottom

Let me know if you're still seeing any unwanted animations after these changes!

---

_**User**_

it remains, and this is so frustrating, 

[Reanimated] Reading from `value` during component render. Please ensure that you don't access the `value` property nor use `get` method of a shared value while React is rendering a component.


---

_**Assistant**_

Ah, now I understand the issue better. The error message indicates that there's a Reanimated shared value being accessed during component render, which is causing the animation issues. This typically happens when using Reanimated values directly in render methods.

Let me check the `ThemeItem` component since that's where the animation is likely happening.

---

_**Assistant**_



---

_**Assistant**_



I found the issue. In the `ThemeItem` component, there's a direct comparison with `isSelected.value` in the render method, which is causing the Reanimated warning. Let's fix this by moving the comparison to the `useEffect` and storing the selected state in a regular React state.

---

_**Assistant**_

```
import React, {useEffect, memo, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {Theme, themeImages} from '../../../shared/theme/theme';
import FourChessSquare from '../components/FourChessSquare';
import {useTheme} from '../../../shared/theme/ThemeContext';
import Animated, {
  FadeInDown,
  FadeOutUp,
  ZoomIn,
  ZoomOut,
  withTiming,
  useAnimatedStyle,
  interpolateColor,
  useSharedValue,
} from 'react-native-reanimated';

const ThemeItem = memo(
  ({
    item,
    index: _index,
    currentTheme,
    onSelect,
  }: {
    item: Theme;
    index: number;
    currentTheme: string;
    onSelect: (theme: Theme) => void;
  }) => {
    const {theme} = useTheme();
    const [isCurrentTheme, setIsCurrentTheme] = useState(currentTheme === item.name);
    const isSelected = useSharedValue(isCurrentTheme ? 1 : 0);

    useEffect(() => {
      const newIsSelected = currentTheme === item.name;
      setIsCurrentTheme(newIsSelected);
      isSelected.value = withTiming(newIsSelected ? 1 : 0);
    }, [currentTheme, item.name, isSelected]);

    const animatedContainerStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: interpolateColor(
          isSelected.value,
          [0, 1],
          ['rgba(0,0,0,0.2)', `${item.colors.primary}80`],
        ),
      };
    });

    return (
      <Animated.View
        entering={FadeInDown.delay(1 * 100).springify()}
        exiting={FadeOutUp}>
        <TouchableOpacity
          onPress={() => onSelect(item)}
          style={[
            styles.themeCard,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}>
          <Image
            source={themeImages[item.name.toLowerCase()]}
            style={styles.themeImage}
            resizeMode="cover"
          />
          <Animated.View
            style={[styles.themeItemContainer, animatedContainerStyle]}>
            <Text
              style={[
                styles.themeName,
                {
                  color: isCurrentTheme ? '#FFFFFF' : item.colors.text,
                },
              ]}>
              {item.name}
            </Text>
            <Animated.View
              entering={isCurrentTheme ? ZoomIn : undefined}
              exiting={isCurrentTheme ? ZoomOut : undefined}>
              <FourChessSquare
                theme={item.name.toLowerCase()}
                black={item.colors.primary}
                white={item.colors.secondary}
              />
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

// ... existing code ...
```

---

_**Assistant**_



I've made several important changes to fix the Reanimated warning and improve the animation behavior:

1. Added a React state to track the current theme selection:
```typescript
const [isCurrentTheme, setIsCurrentTheme] = useState(currentTheme === item.name);
```

2. Simplified the `useEffect` logic to update both the React state and the Reanimated shared value:
```typescript
useEffect(() => {
  const newIsSelected = currentTheme === item.name;
  setIsCurrentTheme(newIsSelected);
  isSelected.value = withTiming(newIsSelected ? 1 : 0);
}, [currentTheme, item.name, isSelected]);
```

3. Replaced all direct comparisons of `currentTheme === item.name` in the render method with the `isCurrentTheme` state variable.

These changes should:
1. Remove the Reanimated warning since we're no longer accessing the shared value during render
2. Keep the animations smooth and working as expected
3. Maintain the same visual behavior but with better performance

The animations should now work without the frustrating warning messages. Let me know if you're still seeing any issues!

---

_**User**_

Nope the issue remains. 

---

_**Assistant**_

Let's try a different approach. The issue might be with the `useAnimatedStyle` hook still accessing the shared value. Let's modify the component to use regular React state for the color interpolation and remove the Reanimated shared value completely.

---

_**Assistant**_

```
import React, {useEffect, memo, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {Theme, themeImages} from '../../../shared/theme/theme';
import FourChessSquare from '../components/FourChessSquare';
import {useTheme} from '../../../shared/theme/ThemeContext';
import Animated, {
  FadeInDown,
  FadeOutUp,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';

const ThemeItem = memo(
  ({
    item,
    index: _index,
    currentTheme,
    onSelect,
  }: {
    item: Theme;
    index: number;
    currentTheme: string;
    onSelect: (theme: Theme) => void;
  }) => {
    const {theme} = useTheme();
    const [isCurrentTheme, setIsCurrentTheme] = useState(currentTheme === item.name);

    useEffect(() => {
      setIsCurrentTheme(currentTheme === item.name);
    }, [currentTheme, item.name]);

    const containerBackgroundColor = isCurrentTheme 
      ? `${item.colors.primary}80`
      : 'rgba(0,0,0,0.2)';

    return (
      <Animated.View
        entering={FadeInDown.delay(1 * 100).springify()}
        exiting={FadeOutUp}>
        <TouchableOpacity
          onPress={() => onSelect(item)}
          style={[
            styles.themeCard,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}>
          <Image
            source={themeImages[item.name.toLowerCase()]}
            style={styles.themeImage}
            resizeMode="cover"
          />
          <Animated.View
            style={[
              styles.themeItemContainer,
              { backgroundColor: containerBackgroundColor },
            ]}>
            <Text
              style={[
                styles.themeName,
                {
                  color: isCurrentTheme ? '#FFFFFF' : item.colors.text,
                },
              ]}>
              {item.name}
            </Text>
            <Animated.View
              entering={isCurrentTheme ? ZoomIn : undefined}
              exiting={isCurrentTheme ? ZoomOut : undefined}>
              <FourChessSquare
                theme={item.name.toLowerCase()}
                black={item.colors.primary}
                white={item.colors.secondary}
              />
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

// ... rest of the styles ...
```

---

_**Assistant**_



I've made several significant changes to remove all Reanimated shared values and workloads:

1. Removed all Reanimated imports except for the basic animation components:
   - Removed `withTiming`
   - Removed `useAnimatedStyle`
   - Removed `interpolateColor`
   - Removed `useSharedValue`

2. Simplified the state management:
   - Now only using React's `useState` for tracking the theme selection
   - Removed the Reanimated shared value completely

3. Replaced the animated style with a simple conditional background color:
   ```typescript
   const containerBackgroundColor = isCurrentTheme 
     ? `${item.colors.primary}80`
     : 'rgba(0,0,0,0.2)';
   ```

4. Applied the background color directly to the view's style:
   ```typescript
   style={[
     styles.themeItemContainer,
     { backgroundColor: containerBackgroundColor },
   ]}
   ```

This change removes all potential sources of the Reanimated warning while maintaining the visual appearance. The color change will now happen instantly instead of interpolating, but the entering/exiting animations will still work as before.

The warning should now be completely gone. Let me know if you're still seeing any issues!

---

_**User**_

it remains, okay, let's remove the animation thing and keep the rest of the things.

---

_**Assistant**_

I'll remove all Reanimated animations while keeping the basic functionality and styling intact.

---

_**Assistant**_

```
import React, {useEffect, memo, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import {Theme, themeImages} from '../../../shared/theme/theme';
import FourChessSquare from '../components/FourChessSquare';
import {useTheme} from '../../../shared/theme/ThemeContext';

const ThemeItem = memo(
  ({
    item,
    index: _index,
    currentTheme,
    onSelect,
  }: {
    item: Theme;
    index: number;
    currentTheme: string;
    onSelect: (theme: Theme) => void;
  }) => {
    const {theme} = useTheme();
    const [isCurrentTheme, setIsCurrentTheme] = useState(currentTheme === item.name);

    useEffect(() => {
      setIsCurrentTheme(currentTheme === item.name);
    }, [currentTheme, item.name]);

    const containerBackgroundColor = isCurrentTheme 
      ? `${item.colors.primary}80`
      : 'rgba(0,0,0,0.2)';

    return (
      <View>
        <TouchableOpacity
          onPress={() => onSelect(item)}
          style={[
            styles.themeCard,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}>
          <Image
            source={themeImages[item.name.toLowerCase()]}
            style={styles.themeImage}
            resizeMode="cover"
          />
          <View
            style={[
              styles.themeItemContainer,
              { backgroundColor: containerBackgroundColor },
            ]}>
            <Text
              style={[
                styles.themeName,
                {
                  color: isCurrentTheme ? '#FFFFFF' : item.colors.text,
                },
              ]}>
              {item.name}
            </Text>
            <View>
              <FourChessSquare
                theme={item.name.toLowerCase()}
                black={item.colors.primary}
                white={item.colors.secondary}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  },
);

export default ThemeItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  themeCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  themeItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  themeImage: {
    width: '100%',
    height: 180,
  },
  themeName: {
    fontFamily: 'CormorantGaramond-Bold',
    fontSize: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
});
```

---

_**Assistant**_



I've made the following changes:

1. Removed all Reanimated imports and dependencies
2. Replaced all `Animated.View` components with regular React Native `View` components
3. Removed all animation-related props (entering, exiting, etc.)
4. Kept all the styling, theme changes, and core functionality intact

The component should now work without any animations and without the Reanimated warning. The theme selection and visual appearance will remain the same, just without the animated transitions. Let me know if you're still seeing any issues!

---

_**User**_

Nahh the issue remains, can you look closely all the mentioned files once again

---

_**Assistant**_

Let me check the navigation stack and theme selection flow more carefully. I notice that the warning is about reading a Reanimated value during component render, and looking at the navigation setup, I see that theme changes might be causing re-renders across the navigation stack.

Let's check the ThemeContext and theme files:

---

_**Assistant**_



---

_**Assistant**_



Let me also check the FourChessSquare component since it might be using Reanimated:

---

_**Assistant**_



---

_**Assistant**_



Let me check the ThemeSelectionScreen component since that's where the theme selection happens:

---

_**Assistant**_



---

_**Assistant**_



I found it! The issue is in the `ThemeSelectionScreen.tsx`. The `requestAnimationFrame` is causing the Reanimated warning because it's being used during a state update. Let's modify the theme selection flow to avoid this:

---

_**Assistant**_

```
import React, {useEffect, useCallback} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {brandThemes, Theme} from '../../../shared/theme/theme';
import {useTheme} from '../../../shared/theme/ThemeContext';
import ThemeItem from '../components/Theme';

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
      // Remove requestAnimationFrame and directly navigate
      navigation.goBack();
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, [navigation, setTheme]);

  const renderThemeItem = useCallback(({item, index}: {item: Theme; index: number}) => (
    <ThemeItem
      item={item}
      index={index}
      currentTheme={theme.name}
      onSelect={handleSelectTheme}
    />
  ), [theme.name, handleSelectTheme]);

  const keyExtractor = useCallback((item: Theme) => item.name, []);

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <FlatList
        data={themes}
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor}
        renderItem={renderThemeItem}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={4}
        windowSize={3}
        initialNumToRender={4}
      />
    </View>
  );
};

// ... rest of the styles ...
```

---

_**Assistant**_



Let me try again with the correct file path:

---

_**Assistant**_

```
undefined
```

---

_**Assistant**_



---



---

