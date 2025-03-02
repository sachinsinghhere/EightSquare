## SpecStory

## Code Optimization and File Creation (3/3/2025, 1:02:39 AM)

_**User**_

Optimize this file's code and create new ones if needed. 

---

_**Assistant**_

I'll help optimize the `BottomTabs.tsx` file. Let me analyze the code and suggest some improvements.

1. First, I'll search for any related files to understand the full context:

---

_**Assistant**_



---

_**Assistant**_



Based on the code analysis, I can suggest several optimizations to improve the codebase structure, type safety, and maintainability. Here's what I'll do:

1. Create a types file for navigation to centralize all navigation types
2. Extract stack navigators into separate files
3. Create a constants file for screen configurations
4. Optimize the tab navigator configuration
5. Add proper type safety throughout the navigation

Let me implement these changes:

1. First, I'll create a new types file for navigation:

---

_**Assistant**_

```
import { NavigatorScreenParams } from '@react-navigation/native';

export type TrainStackParamList = {
  TrainingModules: undefined;
  PuzzleCategories: undefined;
  Puzzles: { filter: { type: string } };
  VisionTraining: undefined;
  BlindChess: undefined;
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  ThemeSelection: undefined;
  Sound: undefined;
  Notifications: undefined;
  Language: undefined;
  About: undefined;
};

export type ClockStackParamList = {
  Clocks: undefined;
};

export type RootTabParamList = {
  Play: undefined;
  Train: NavigatorScreenParams<TrainStackParamList>;
  Clock: NavigatorScreenParams<ClockStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

export type RootStackParamList = {
  BottomTabs: NavigatorScreenParams<RootTabParamList>;
  ChessTimer: {
    minutes: number;
    increment: number;
  };
};
```

---

_**Assistant**_



2. Now, let's create a constants file for screen configurations:

---

_**Assistant**_

```
import { textStyles } from '../shared/theme/typography';
import { Theme } from '../shared/theme/theme';

export const getStackScreenOptions = (theme: Theme) => ({
  headerShown: true,
  headerShadowVisible: false,
  headerTitleStyle: {
    ...textStyles.h4,
    color: theme.colors.text,
  },
  headerStyle: {
    backgroundColor: theme.colors.background,
  },
  contentStyle: {
    backgroundColor: theme.colors.background,
  },
});

export const getTabNavigatorOptions = (theme: Theme) => ({
  headerShown: false,
  tabBarStyle: {
    backgroundColor: theme.colors.card,
    borderTopColor: theme.colors.border,
  },
  tabBarLabelStyle: {
    ...textStyles.caption,
    color: theme.colors.text,
  },
  tabBarActiveTintColor: theme.colors.primary,
  tabBarInactiveTintColor: theme.colors.text,
});
```

---

_**Assistant**_



3. Let's create separate stack navigator files:

---

_**Assistant**_

```
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChessClockSelection from '../../features/clock/screens/ChessClockSelection';
import { ClockStackParamList } from '../types';
import { useTheme } from '../../shared/theme/ThemeContext';
import { getStackScreenOptions } from '../constants';

const Stack = createNativeStackNavigator<ClockStackParamList>();

export const ClockStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator screenOptions={getStackScreenOptions(theme)}>
      <Stack.Screen
        name="Clocks"
        component={ChessClockSelection}
        options={{title: 'Time Control'}}
      />
    </Stack.Navigator>
  );
};
```

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
import PuzzlesScreen from '../../features/train/screens/PuzzlesScreen';
import VisionTrainingScreen from '../../features/train/screens/VisionTrainingScreen';
import BlindChessScreen from '../../features/train/screens/BlindChessScreen';

const Stack = createNativeStackNavigator<TrainStackParamList>();

export const TrainStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator screenOptions={getStackScreenOptions(theme)}>
      <Stack.Screen
        name="TrainingModules"
        component={TrainingModules}
        options={{title: 'Training'}}
      />
      <Stack.Screen
        name="PuzzleCategories"
        component={PuzzleCategoriesScreen}
        options={{title: 'Categories'}}
      />
      <Stack.Screen
        name="Puzzles"
        component={PuzzlesScreen}
        options={{title: 'Puzzles'}}
      />
      <Stack.Screen
        name="VisionTraining"
        component={VisionTrainingScreen}
        options={{title: 'Vision Training'}}
      />
      <Stack.Screen
        name="BlindChess"
        component={BlindChessScreen}
        options={{title: 'Blind Chess'}}
      />
    </Stack.Navigator>
  );
};
```

---

_**Assistant**_

```
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../types';
import { useTheme } from '../../shared/theme/ThemeContext';
import { getStackScreenOptions } from '../constants';
import SettingsScreen from '../../features/settings/screens/SettingsScreen';
import ThemeSelectionScreen from '../../features/settings/screens/ThemeSelectionScreen';
import SoundSettingsScreen from '../../features/settings/screens/SoundSettingsScreen';
import NotificationsScreen from '../../features/settings/screens/NotificationsScreen';
import LanguageScreen from '../../features/settings/screens/LanguageScreen';
import AboutScreen from '../../features/settings/screens/AboutScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export const SettingsStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator screenOptions={getStackScreenOptions(theme)}>
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{title: 'Settings'}}
      />
      <Stack.Screen
        name="ThemeSelection"
        component={ThemeSelectionScreen}
        options={{title: 'Theme'}}
      />
      <Stack.Screen
        name="Sound"
        component={SoundSettingsScreen}
        options={{title: 'Sound'}}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{title: 'Notifications'}}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{title: 'Language'}}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{title: 'About'}}
      />
    </Stack.Navigator>
  );
};
```

---

_**Assistant**_



4. Finally, let's update the main BottomTabs component to use our new structure:

---

_**Assistant**_

```
import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlayScreen } from '../../features/play/screens/PlayScreen';
import { useTheme } from '../../shared/theme/ThemeContext';
import Icon from '../../shared/components/Icon';
import { RootTabParamList } from '../types';
import { getTabNavigatorOptions } from '../constants';
import { ClockStack } from '../stacks/ClockStack';
import { TrainStack } from '../stacks/TrainStack';
import { SettingsStack } from '../stacks/SettingsStack';

const Tab = createBottomTabNavigator<RootTabParamList>();

const BottomTabs = () => {
  const { theme } = useTheme();

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <Tab.Navigator screenOptions={getTabNavigatorOptions(theme)}>
        <Tab.Screen
          name="Play"
          component={PlayScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="chess-king" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Train"
          component={TrainStack}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="sword" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Clock"
          component={ClockStack}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="timer" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsStack}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="cog" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default BottomTabs;
```

---

_**Assistant**_



I've made several improvements to optimize the codebase:

1. Created a centralized `types.ts` file that contains all navigation-related types, making it easier to maintain type safety across the app.

2. Extracted stack navigators into separate files under `src/navigation/stacks/`:
   - `ClockStack.tsx`
   - `TrainStack.tsx`
   - `SettingsStack.tsx`

3. Created a `constants.ts` file that contains reusable screen and navigation options, reducing code duplication.

4. Optimized the main `BottomTabs.tsx` component by:
   - Removing nested stack navigator definitions
   - Adding proper TypeScript typing with `RootTabParamList`
   - Using the extracted stack navigators
   - Using centralized configuration from `constants.ts`

The benefits of these changes include:

1. **Better Type Safety**: All navigation is now properly typed, which will catch potential errors at compile time.
2. **Improved Maintainability**: Each stack navigator is in its own file, making it easier to modify and maintain.
3. **Reduced Code Duplication**: Common configurations are now centralized in `constants.ts`.
4. **Better Organization**: The navigation code is now more modular and follows a clear structure.
5. **Easier Testing**: Each stack can be tested independently.
6. **Better Code Splitting**: The code is now split into logical chunks that can be loaded independently.

The changes maintain all existing functionality while making the code more maintainable and type-safe. The navigation structure remains the same, but it's now better organized and more scalable for future additions.

Would you like me to make any additional optimizations or explain any part of the changes in more detail?

---

_**User**_

Wrap each screen with @ScreenWrapper.tsx component and fix the layout issues if occured during this.

---

_**Assistant**_

I'll help wrap each screen with the `ScreenWrapper` component and fix any layout issues. First, let's analyze the current setup and make the necessary changes.

1. First, let's fix the linter error in `ScreenWrapper.tsx` by removing the unused `Platform` import:

---

_**Assistant**_

```
import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
// ... existing code ...
```

---

_**Assistant**_



2. Now, let's update the `constants.ts` to show headers since we'll be using `ScreenWrapper`:

---

_**Assistant**_

```
import { textStyles } from '../shared/theme/typography';
import { Theme } from '../shared/theme/theme';

export const getStackScreenOptions = (theme: Theme) => ({
  headerShown: false,
  contentStyle: {
    backgroundColor: theme.colors.background,
  },
});

export const getTabNavigatorOptions = (theme: Theme) => ({
  headerShown: false,
  tabBarStyle: {
    backgroundColor: theme.colors.card,
    borderTopColor: theme.colors.border,
  },
  tabBarLabelStyle: {
    ...textStyles.caption,
    color: theme.colors.text,
  },
  tabBarActiveTintColor: theme.colors.primary,
  tabBarInactiveTintColor: theme.colors.text,
});
```

---

_**Assistant**_



3. Let's update each stack navigator to wrap their screens with `ScreenWrapper`. Starting with `ClockStack.tsx`:

---

_**Assistant**_

```
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChessClockSelection from '../../features/clock/screens/ChessClockSelection';
import { ClockStackParamList } from '../types';
import { useTheme } from '../../shared/theme/ThemeContext';
import { getStackScreenOptions } from '../constants';
import { ScreenWrapper } from '../../shared/components/ScreenWrapper';

const Stack = createNativeStackNavigator<ClockStackParamList>();

const WrappedChessClockSelection = () => (
  <ScreenWrapper title="Time Control">
    <ChessClockSelection />
  </ScreenWrapper>
);

export const ClockStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator screenOptions={getStackScreenOptions(theme)}>
      <Stack.Screen
        name="Clocks"
        component={WrappedChessClockSelection}
      />
    </Stack.Navigator>
  );
};
```

---

_**Assistant**_





4. Let's update `TrainStack.tsx`:

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
import PuzzlesScreen from '../../features/train/screens/PuzzlesScreen';
import VisionTrainingScreen from '../../features/train/screens/VisionTrainingScreen';
import BlindChessScreen from '../../features/train/screens/BlindChessScreen';
import { ScreenWrapper } from '../../shared/components/ScreenWrapper';

const Stack = createNativeStackNavigator<TrainStackParamList>();

const WrappedTrainingModules = () => (
  <ScreenWrapper title="Training" showBack={false}>
    <TrainingModules />
  </ScreenWrapper>
);

const WrappedPuzzleCategories = () => (
  <ScreenWrapper title="Categories">
    <PuzzleCategoriesScreen />
  </ScreenWrapper>
);

const WrappedPuzzles = () => (
  <ScreenWrapper title="Puzzles">
    <PuzzlesScreen />
  </ScreenWrapper>
);

const WrappedVisionTraining = () => (
  <ScreenWrapper title="Vision Training">
    <VisionTrainingScreen />
  </ScreenWrapper>
);

const WrappedBlindChess = () => (
  <ScreenWrapper title="Blind Chess">
    <BlindChessScreen />
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
        name="Puzzles"
        component={WrappedPuzzles}
      />
      <Stack.Screen
        name="VisionTraining"
        component={WrappedVisionTraining}
      />
      <Stack.Screen
        name="BlindChess"
        component={WrappedBlindChess}
      />
    </Stack.Navigator>
  );
};
```

---

_**Assistant**_





5. Let's update `SettingsStack.tsx`:

---

_**Assistant**_

```
undefined
```

---

_**Assistant**_



---



---

