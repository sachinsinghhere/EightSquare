## SpecStory

## Global Internet Connectivity Solution in React Native (3/6/2025, 11:31:11 PM)

_**User**_

I've installed @react-native-community/netinfo
I want to determine if internet is connected or not at any screen and component. Build me a global solution without affecting current implementation.

---

_**Assistant**_

I'll help you create a global network connectivity solution using `@react-native-community/netinfo`. I'll create a custom hook and context to manage network state that can be easily accessed from anywhere in the app.

First, let's create a NetworkContext and provider:

---

_**Assistant**_

```
import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface NetworkContextType {
  isConnected: boolean | null;
  connectionType: string | null;
}

const NetworkContext = createContext<NetworkContextType>({
  isConnected: null,
  connectionType: null,
});

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [networkState, setNetworkState] = useState<NetworkContextType>({
    isConnected: null,
    connectionType: null,
  });

  useEffect(() => {
    // Initial network state check
    NetInfo.fetch().then((state) => {
      setNetworkState({
        isConnected: state.isConnected,
        connectionType: state.type,
      });
    });

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setNetworkState({
        isConnected: state.isConnected,
        connectionType: state.type,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NetworkContext.Provider value={networkState}>
      {children}
    </NetworkContext.Provider>
  );
};
```

---

_**Assistant**_

Now, let's create a custom hook to handle offline states and provide a consistent way to check connectivity:

---

_**Assistant**_

```
import { useNetwork } from '../context/NetworkContext';

interface NetworkStatus {
  isConnected: boolean | null;
  connectionType: string | null;
  isOffline: boolean;
  isOnline: boolean;
}

export const useNetworkStatus = (): NetworkStatus => {
  const networkState = useNetwork();

  return {
    isConnected: networkState.isConnected,
    connectionType: networkState.connectionType,
    isOffline: networkState.isConnected === false,
    isOnline: networkState.isConnected === true,
  };
};
```

---

_**Assistant**_

Now, let's wrap the app with the NetworkProvider. I'll search for the app's root component:

---

_**Assistant**_



---

_**Assistant**_

Let's read the App.tsx file:

---

_**Assistant**_



---

_**Assistant**_

Let's modify the App.tsx file to include our NetworkProvider:

---

_**Assistant**_

```
/**
 * Main App component that serves as the entry point for the application.
 * Sets up theme provider and navigation.
 */
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/shared/theme/ThemeContext';
import { NetworkProvider } from './src/shared/context/NetworkContext';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <NetworkProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppNavigator />
        </GestureHandlerRootView>
      </NetworkProvider>
    </ThemeProvider>
  );
}

export default App;
```

---

_**Assistant**_

Now you have a complete global network connectivity solution! Here's how to use it in any component:

1. Import the hook:
```typescript
import { useNetworkStatus } from '../shared/hooks/useNetworkStatus';
```

2. Use it in your component:
```typescript
const YourComponent = () => {
  const { isOnline, isOffline, connectionType } = useNetworkStatus();

  return (
    <View>
      {isOffline && <Text>You are offline!</Text>}
      {isOnline && <Text>Connected via {connectionType}</Text>}
    </View>
  );
};
```

The solution provides:

1. Real-time network status updates through the `NetworkProvider`
2. Easy access to network state from any component using the `useNetworkStatus` hook
3. Helpful utility properties:
   - `isConnected`: boolean | null (null during initial check)
   - `isOnline`: boolean (true when connected)
   - `isOffline`: boolean (true when disconnected)
   - `connectionType`: string | null (e.g., 'wifi', 'cellular', etc.)

The implementation is non-intrusive and doesn't affect your current code. It just adds the necessary context and hooks to monitor network connectivity globally.

Would you like me to show you an example of how to implement offline detection in any specific screen or component?

---



---

