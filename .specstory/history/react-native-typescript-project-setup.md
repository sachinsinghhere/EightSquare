## SpecStory

## React Native TypeScript Project Setup (04/02/2025, 13:24:17)

_**User**_

This is a react-native-cli project with typescript template, 
Tasks todo : 
- Cleanup App.tsx as it contains starter code.
- Create an src folder 
- Add all kind of navigation to it and do the required modifications. Also please keep all the route names in a constant. 
- Create screens folder in the src to show a screen when the navigation's setup has been completed.



---

_**Assistant**_

I'll help you set up a clean React Native project with proper navigation structure. Let's break this down into steps:

1. First, let me check the current App.tsx content:

---

_**Assistant**_



---

_**Assistant**_



Now, I'll help you set up a proper navigation structure. First, let's install the required navigation dependencies. I'll run the following commands:

---

_**Assistant**_

```
yarn add @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
```

---

_**Assistant**_



Now, let's create the necessary folder structure and files:

---

_**Assistant**_

```
mkdir -p src/screens src/navigation src/constants
```

---

_**Assistant**_



Let's create the necessary files one by one. First, let's create our route constants:

---

_**Assistant**_

```
export const ROUTES = {
  // Stack Routes
  HOME: 'Home',
  DETAILS: 'Details',
  SETTINGS: 'Settings',
  PROFILE: 'Profile',
  
  // Tab Routes
  HOME_TAB: 'HomeTab',
  SETTINGS_TAB: 'SettingsTab',
  PROFILE_TAB: 'ProfileTab',
} as const;

export type RootStackParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.DETAILS]: { id: string };
  [ROUTES.SETTINGS]: undefined;
  [ROUTES.PROFILE]: undefined;
};

export type RootTabParamList = {
  [ROUTES.HOME_TAB]: undefined;
  [ROUTES.SETTINGS_TAB]: undefined;
  [ROUTES.PROFILE_TAB]: undefined;
};
```

---

_**Assistant**_



Now, let's create some basic screens to demonstrate the navigation:

---

_**Assistant**_

```
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../constants/routes';
import { ROUTES } from '../constants/routes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate(ROUTES.DETAILS, { id: '123' })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
```

---

_**Assistant**_







Let's create the Details screen:

---

_**Assistant**_

```
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../constants/routes';
import { ROUTES } from '../constants/routes';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, typeof ROUTES.DETAILS>;

export const DetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<DetailsScreenRouteProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details Screen</Text>
      <Text>ID: {route.params.id}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
```

---

_**Assistant**_







Now, let's set up the navigation configuration:

---

_**Assistant**_

```
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ROUTES, RootStackParamList, RootTabParamList } from '../constants/routes';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailsScreen } from '../screens/DetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
      <Stack.Screen name={ROUTES.DETAILS} component={DetailsScreen} />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name={ROUTES.HOME_TAB} 
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name={ROUTES.SETTINGS_TAB} 
        component={HomeScreen}
        options={{ title: 'Settings' }}
      />
      <Tab.Screen 
        name={ROUTES.PROFILE_TAB} 
        component={HomeScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};
```

---

_**Assistant**_











Finally, let's update the App.tsx to use our navigation setup:

---

_**Assistant**_

```
import React from 'react';
import { StatusBar } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';

function App(): React.JSX.Element {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </>
  );
}

export default App;
```

---

_**Assistant**_



Great! I've completed setting up the navigation structure for your React Native project. Here's what I've done:

1. Created a clean project structure with:
   - `src/` directory
   - `src/screens/` for screen components
   - `src/navigation/` for navigation configuration
   - `src/constants/` for route constants

2. Set up navigation with:
   - Bottom Tab Navigation
   - Stack Navigation within the Home tab
   - Type-safe route names and parameters

3. Created basic screens:
   - HomeScreen with navigation to Details
   - DetailsScreen showing passed parameters
   - Placeholder screens for Settings and Profile tabs

4. Cleaned up App.tsx and implemented the navigation setup

The navigation structure includes:
- Bottom tabs for Home, Settings, and Profile
- Stack navigation in the Home tab that allows navigation to a Details screen
- Type-safe navigation using TypeScript
- Centralized route names in constants

You can now:
1. Navigate between tabs using the bottom tab bar
2. Navigate to the Details screen from the Home screen
3. Pass parameters between screens (demonstrated in the Details screen)

To test the navigation:
1. The app will start at the Home tab
2. Press "Go to Details" to navigate to the Details screen
3. Use the bottom tabs to switch between Home, Settings, and Profile
4. Use the back button or "Go Back" to return to previous screens

Would you like me to add any additional features or make any modifications to the current setup?

---

_**User**_

Do you know about react-native-chessboard? If yes then could you please integrate it? 

After you've done the integration, I would like to see the chessboard on Profile Tab.

---

_**Assistant**_

Yes, I can help you integrate react-native-chessboard! First, let's install the required package:

---

_**Assistant**_

```
yarn add react-native-chessboard
```

---

_**Assistant**_



I notice we need to install some peer dependencies as well:

---

_**Assistant**_

```
yarn add react-native-gesture-handler react-native-reanimated
```

---

_**Assistant**_







Now, let's create a new ProfileScreen component with the chessboard:

---

_**Assistant**_

```
import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Chessboard from 'react-native-chessboard';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width - 32; // Full width minus padding

export const ProfileScreen = () => {
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'); // Initial position

  return (
    <View style={styles.container}>
      <Chessboard
        fen={fen}
        onMove={({ state }) => setFen(state.fen)}
        size={BOARD_SIZE}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
```

---

_**Assistant**_







Let me fix the linter error by updating the Chessboard props according to the package's type definitions:

---

_**Assistant**_

```
import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Chessboard from 'react-native-chessboard';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width - 32; // Full width minus padding

export const ProfileScreen = () => {
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'); // Initial position

  return (
    <View style={styles.container}>
      <Chessboard
        fen={fen}
        onMove={({ state }) => setFen(state.fen)}
        style={{ width: BOARD_SIZE, height: BOARD_SIZE }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
```

---

_**Assistant**_











Let me update the RootNavigator to use our new ProfileScreen:

---

_**Assistant**_

```
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ROUTES, RootStackParamList, RootTabParamList } from '../constants/routes';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
      <Stack.Screen name={ROUTES.DETAILS} component={DetailsScreen} />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name={ROUTES.HOME_TAB} 
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name={ROUTES.SETTINGS_TAB} 
        component={HomeScreen}
        options={{ title: 'Settings' }}
      />
      <Tab.Screen 
        name={ROUTES.PROFILE_TAB} 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};
```

---

_**Assistant**_







Finally, we need to update the babel.config.js to support react-native-reanimated:

---

_**Assistant**_

```
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

---

_**Assistant**_







Now we need to wrap our app with GestureHandlerRootView. Let's update App.tsx:

---

_**Assistant**_

```
import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </GestureHandlerRootView>
  );
}

export default App;
```

---

_**Assistant**_







I've integrated react-native-chessboard into your app! Here's what I've done:

1. Installed required packages:
   - react-native-chessboard
   - react-native-gesture-handler
   - react-native-reanimated

2. Created a new ProfileScreen component with the chessboard
   - The chessboard is responsive and will adjust to the screen width
   - It's set up with the standard initial chess position
   - Moves are tracked using the FEN state

3. Updated the navigation to use the new ProfileScreen in the Profile tab

4. Added necessary configuration:
   - Updated babel.config.js to support react-native-reanimated
   - Wrapped the app with GestureHandlerRootView for gesture support

To see the chessboard:
1. Start/restart your React Native app (restart is needed for the babel config changes)
2. Navigate to the Profile tab using the bottom tab bar
3. You should see a fully functional chessboard where you can:
   - Move pieces by dragging them
   - The board will maintain its state as you navigate between tabs

Note: The chessboard is interactive and follows standard chess rules. You can make moves by dragging pieces, and the board will update accordingly.

Would you like me to add any additional features to the chessboard implementation, such as move history or game controls?

---

_**User**_

Got an error saying [Reanimated] Failed to create a worklet.

---

_**Assistant**_

This error typically occurs when React Native Reanimated isn't properly set up. Let's fix this by following these steps:

1. First, let's make sure we have the latest version of react-native-reanimated:

---

_**Assistant**_

```
yarn add react-native-reanimated@latest
```

---

_**Assistant**_



2. Let's update the babel.config.js to ensure the plugin is properly configured:

---

_**Assistant**_

```
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
  ],
};
```

---

_**Assistant**_







3. We need to add the Reanimated babel plugin before any other plugins, and we need to properly initialize it in the app. Let's update App.tsx:

---

_**Assistant**_

```
import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';
import 'react-native-reanimated';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </GestureHandlerRootView>
  );
}

export default App;
```

---

_**Assistant**_







Now, you'll need to:

1. Clean the build:

---

_**Assistant**_

```
cd ios && pod install && cd .. && yarn start --reset-cache
```

---

_**Assistant**_







2. For Android, you'll need to clean the Android build as well:

---

_**Assistant**_

```
cd android && ./gradlew clean && cd ..
```

---

_**Assistant**_







Let's try to fix the Android build issues by running the following commands:

---

_**Assistant**_

```
cd .. && yarn add react-native-reanimated@3.6.1
```

---

_**Assistant**_











Now let's install the missing peer dependencies:

---

_**Assistant**_

```
yarn add -D @babel/plugin-proposal-nullish-coalescing-operator @babel/plugin-proposal-optional-chaining @babel/plugin-transform-arrow-functions @babel/plugin-transform-shorthand-properties @babel/plugin-transform-template-literals
```

---

_**Assistant**_



---

_**User**_

Add following packages and do pod install. 
- axios
- react-redux
- @react-native-async-storage/async-storage
- redux-persist 
- redux-saga 
- @reduxjs/toolkit
- moment
- lottie-react-native
- react-native-shimmer-placeholder
- react-native-linear-gradient
- @react-native-community/netinfo
- @gorhom/bottom-sheet


---

_**Assistant**_



---



---

