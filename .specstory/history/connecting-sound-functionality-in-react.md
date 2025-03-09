## SpecStory

## Connecting Sound Functionality in React (3/9/2025, 10:08:07 PM)

_**User**_

please connect these two things so user can connect the sound from here.

---

_**Assistant**_

I'll help connect the sound settings screen with the actual sound functionality. We need to create a way to manage the sound state globally and use it in both components. I'll use React Context for this purpose.

First, let's create a sound context to manage the sound state:

---

_**Assistant**_

```
import React, { createContext, useContext, useState } from 'react';

interface SoundContextType {
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  return (
    <SoundContext.Provider value={{ isSoundEnabled, setIsSoundEnabled }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSoundSettings = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSoundSettings must be used within a SoundProvider');
  }
  return context;
};
```

---

_**Assistant**_

Now, let's update the SoundSettingsScreen to use this context:

---

_**Assistant**_

```
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { ScreenWrapper } from '../../../shared/components/ScreenWrapper';
import { useTheme } from '../../../shared/theme/ThemeContext';
import { useSoundSettings } from '../../../shared/context/SoundContext';

const SoundSettingsScreen = () => {
  const { theme } = useTheme();
  const { isSoundEnabled, setIsSoundEnabled } = useSoundSettings();

  const settings = [
    {
      title: 'Piece Movement Sound',
      description: 'Play sound when moving pieces',
      value: isSoundEnabled,
      onValueChange: setIsSoundEnabled,
    },
  ];
// ... existing code ...
```

---

_**Assistant**_

Finally, let's update the sounds utility to respect the sound settings:

---

_**Assistant**_

```
import SoundPlayer from 'react-native-sound-player';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

let isSoundEnabled = true;

export const setSoundEnabled = (enabled: boolean) => {
  isSoundEnabled = enabled;
};

export const Sounds = {
// ... existing code ...

export const playChessSound = async (
  soundType: 'move_piece' | 'capture' | 'check' | 'castle' | 'game_end',
  withHaptic: boolean = true,
) => {
  if (!isSoundEnabled) return;
  
  try {
    // Play haptic feedback
    if (withHaptic) {
      // ReactNativeHapticFeedback.trigger('clockTick', hapticOptions);
    }
// ... existing code ...
```

---

_**Assistant**_

Now we need to wrap the app with the SoundProvider and connect the settings to the sound utility. Let's update the App component:

---

_**Assistant**_



---

_**Assistant**_



---

_**Assistant**_

```
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/shared/theme/ThemeContext';
import { NetworkProvider } from './src/shared/context/NetworkContext';
import { SoundProvider } from './src/shared/context/SoundContext';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <NetworkProvider>
        <SoundProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AppNavigator />
          </GestureHandlerRootView>
        </SoundProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
}

export default App;
```

---

_**Assistant**_

Finally, let's update the SoundContext to manage the sound utility:

---

_**Assistant**_

```
import React, { createContext, useContext, useState, useEffect } from 'react';
import { setSoundEnabled } from '../../utils/sounds';

interface SoundContextType {
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  useEffect(() => {
    setSoundEnabled(isSoundEnabled);
  }, [isSoundEnabled]);

  return (
    <SoundContext.Provider value={{ isSoundEnabled, setIsSoundEnabled }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSoundSettings = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSoundSettings must be used within a SoundProvider');
  }
  return context;
};
```

---

_**Assistant**_

I've made several changes to connect the sound settings with the actual sound functionality:

1. Created a new `SoundContext` to manage sound settings globally
2. Updated the `SoundSettingsScreen` to use the sound context instead of local state
3. Modified the sound utility to respect the sound settings
4. Added the `SoundProvider` to the App component
5. Connected the sound context to the sound utility

Now when you toggle the sound switch in the settings screen:
1. The state will be updated in the `SoundContext`
2. The `useEffect` in `SoundProvider` will call `setSoundEnabled`
3. The sound utility will respect this setting when playing sounds

The sound settings will persist as long as the app is running. If you need to persist the sound settings between app launches, we can add AsyncStorage to save and restore the settings. Would you like me to add that functionality as well?

---



---

