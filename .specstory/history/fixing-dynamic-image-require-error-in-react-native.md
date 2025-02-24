## SpecStory

## Fixing Dynamic Image Require Error in React Native (2/23/2025, 10:29:59 AM)

_**User**_

Error: src/features/settings/screens/ThemeSelectionScreen.tsx:Invalid call at line 40: require(`../../../assets/images/themeBgs/${item}.png`)

---

_**Assistant**_

I understand you're encountering an error with the dynamic `require` statement in your ThemeSelectionScreen component. The issue is that React Native's `require` for images needs to be static - it cannot accept template literals or variables. This is a limitation of React Native's bundler.

Let me help you fix this by creating a mapping object for the theme images. I'll modify your file to handle this properly:

I'll first explain what we'll do:
1. Create a mapping object for theme images
2. Use this mapping to reference images statically
3. Fix the TypeScript errors while we're at it

Let me edit the file:

---

_**Assistant**_

```
import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, Image, ImageSourcePropType} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {brandThemes} from '../../../shared/theme/theme';

// Theme images mapping
const themeImages: Record<string, ImageSourcePropType> = {
  ocean: require('../../../assets/images/themeBgs/ocean.png'),
  // Add other theme images here following the same pattern
};

interface ThemeSelectionScreenProps {
  navigation: {
    goBack: () => void;
  };
}

const ThemeSelectionScreen: React.FC<ThemeSelectionScreenProps> = ({navigation}) => {
  const [selectedTheme, setSelectedTheme] = useState('ocean');
  const themes = Object.keys(brandThemes.default);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('selectedTheme');
      if (storedTheme) {
        setSelectedTheme(storedTheme);
      }
    };
    loadTheme();
  }, []);

  const handleSelectTheme = async (theme: string) => {
    setSelectedTheme(theme);
    await AsyncStorage.setItem('selectedTheme', theme);
    navigation.goBack();
  };

  return (
    <View style={{flex: 1}}>
      <Text style={{fontSize: 24, margin: 20}}>Select a Theme</Text>
      <FlatList
        data={themes}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleSelectTheme(item)}>
            <View
              style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
              <Image
                source={themeImages[item] || themeImages.ocean}
                style={{width: 100, height: 100}}
              />
              <Text style={{marginLeft: 20}}>{item}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
// ... existing code ...
```

---

_**Assistant**_



I've made several important changes to fix the issues:

1. Fixed the dynamic `require` issue by creating a `themeImages` mapping object that statically requires all theme images. You'll need to add all your theme images to this mapping following the same pattern.

2. Added proper TypeScript types:
   - Added `ImageSourcePropType` import
   - Created an interface for the screen props
   - Added type annotations for the theme parameter
   - Properly typed the component as `React.FC`

3. Fixed other issues:
   - Uncommented and fixed the `useEffect` hook for loading the stored theme
   - Added the missing `keyExtractor` prop to `FlatList`
   - Removed the unnecessary `onError` handler since we now have a fallback in the source prop
   - Cleaned up the code formatting

To complete this implementation, you'll need to add all your theme images to the `themeImages` mapping. For example, if you have themes like 'forest', 'desert', etc., you would add them like this:

```typescript
const themeImages: Record<string, ImageSourcePropType> = {
  ocean: require('../../../assets/images/themeBgs/ocean.png'),
  forest: require('../../../assets/images/themeBgs/forest.png'),
  desert: require('../../../assets/images/themeBgs/desert.png'),
  // ... add all your themes here
};
```

Let me know if you need help adding the rest of your theme images to the mapping, or if you have any questions about the changes!

---

_**User**_

create a styles object and appliy it from react-native-unistyles.

---

_**Assistant**_

I'll help you create and apply styles using react-native-unistyles. I'll create a styled version of your ThemeSelectionScreen using the UnistylesTheme system.

---

_**Assistant**_

```
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {brandThemes, Theme} from '../../../shared/theme/theme';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

// Theme images mapping
const themeImages: Record<string, ImageSourcePropType> = {
  ocean: require('../../../assets/images/themeBgs/ocean.png'),
  bubblegum: require('../../../assets/images/themeBgs/bubblegum.png'),
  clay: require('../../../assets/images/themeBgs/clay.png'),
  neon: require('../../../assets/images/themeBgs/neon.png'),
  romantic: require('../../../assets/images/themeBgs/romantic.png'),
  tournament: require('../../../assets/images/themeBgs/tournament.png'),
  wood: require('../../../assets/images/themeBgs/wood.png'),
  winter: require('../../../assets/images/themeBgs/winter.png'),
};

interface ThemeSelectionScreenProps {
  navigation: {
    goBack: () => void;
  };
}

const ThemeSelectionScreen: React.FC<ThemeSelectionScreenProps> = ({
  navigation,
}) => {
  const {styles} = useStyles(stylesheet);
  const [selectedTheme, setSelectedTheme] = useState(brandThemes.default.ocean);
  const themes = Object.values(brandThemes.default);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('selectedTheme');
      if (storedTheme) {
        setSelectedTheme(JSON.parse(storedTheme));
      }
    };
    loadTheme();
  }, []);

  const handleSelectTheme = async (theme: Theme) => {
    setSelectedTheme(theme);
    await AsyncStorage.setItem('selectedTheme', JSON.stringify(theme));
    navigation.goBack();
  };

  const FourChessSquare = ({black, white}: {black: string; white: string}) => {
    return (
      <View style={styles.chessSquareContainer}>
        <View style={styles.chessRow}>
          <View style={[styles.chessSquare, {backgroundColor: black}]} />
          <View style={[styles.chessSquare, {backgroundColor: white}]} />
        </View>
        <View style={styles.chessRow}>
          <View style={[styles.chessSquare, {backgroundColor: white}]} />
          <View style={[styles.chessSquare, {backgroundColor: black}]} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={themes}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({item}: {item: Theme}) => (
          <TouchableOpacity onPress={() => handleSelectTheme(item)}>
            <View style={styles.themeItemContainer}>
              <Image
                source={themeImages[item.name.toLowerCase()]}
                style={styles.themeImage}
              />
              <FourChessSquare black={item.colors.primary} white={item.colors.secondary} />
              <Text
                style={[
                  styles.themeName,
                  {color: item.colors.text},
                ]}>
                {item.name || 'Ocean'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const stylesheet = createStyleSheet({
  container: {
    flex: 1,
  },
  themeItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeImage: {
    width: '100%',
    height: 100,
  },
  themeName: {
    position: 'absolute',
    top: 0,
    left: 0,
    fontWeight: '700',
    fontSize: 22,
    padding: 10,
  },
  chessSquareContainer: {
    position: 'absolute',
    top: 0,
    right: 10,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chessRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chessSquare: {
    width: 35,
    height: 35,
  },
});

export default ThemeSelectionScreen;
```

---

_**Assistant**_



I've made the following changes to implement react-native-unistyles:

1. Added the necessary import for unistyles:
```typescript
import {createStyleSheet, useStyles} from 'react-native-unistyles';
```

2. Created a stylesheet using `createStyleSheet` at the bottom of the file with all the styles organized into logical groups:
- Container styles
- Theme item styles
- Chess square styles
- Text styles

3. Added the styles hook in the component:
```typescript
const {styles} = useStyles(stylesheet);
```

4. Replaced all inline styles with references to the stylesheet

5. For dynamic styles (like colors), I used the array syntax to combine static and dynamic styles:
```typescript
style={[styles.themeName, {color: item.colors.text}]}
```

6. Added some improvements to the styles:
- Added padding to the theme name text for better readability
- Organized the chess square styles into more reusable components
- Maintained all the existing layout and positioning

The code is now more maintainable and follows better styling practices with react-native-unistyles. All the styles are centralized in one place and can be easily modified or themed.

Note: Make sure you have `react-native-unistyles` installed in your project. If you haven't installed it yet, you'll need to run:

```bash
npm install react-native-unistyles
# or
yarn add react-native-unistyles
```

Would you like me to make any adjustments to the styling or add any additional style properties?

---



---

