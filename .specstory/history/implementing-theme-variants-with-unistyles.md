## SpecStory

## Implementing Theme Variants with Unistyles (2/22/2025, 9:59:19 PM)

_**User**_

i've created these theme variants for entire app, how it will be more useful and easy to implement with react-native-unistyles. 

Please note I want to use react-native-unistyles throughout the project so build accordingly.

---

_**Assistant**_



---

_**Assistant**_

To implement your theme variants using `react-native-unistyles`, we can create a structured approach that aligns with the best practices for React Native projects. Here’s how you can effectively integrate your themes throughout the application:

### 1. Project Structure
Organize your project according to the feature-first pattern. Here’s a suggested structure:

```
/src
  /features
    /theme
      /components
        - ThemeProvider.tsx
      /hooks
        - useTheme.ts
      /styles
        - themeStyles.ts
      /services
        - themeService.ts
      /screens
        - ThemeScreen.tsx
```

### 2. Create a Theme Provider
You can create a `ThemeProvider` component that uses React Context to provide the current theme to your application. This will allow you to switch themes dynamically.

```typescript
// src/features/theme/components/ThemeProvider.tsx
import React, { createContext, useContext, useState } from 'react';
import { BrandTheme, brandThemes } from '../styles/themeStyles';

const ThemeContext = createContext<{
  theme: BrandTheme;
  setTheme: (theme: keyof typeof brandThemes) => void;
}>({ theme: brandThemes.default, setTheme: () => {} });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<BrandTheme>(brandThemes.default);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

### 3. Create a Hook for Theme Usage
The `useTheme` hook allows components to access the current theme easily.

```typescript
// src/features/theme/hooks/useTheme.ts
import { useContext } from 'react';
import { ThemeContext } from '../components/ThemeProvider';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

### 4. Define Styles Using `react-native-unistyles`
You can create a `themeStyles.ts` file to define styles based on the current theme.

```typescript
// src/features/theme/styles/themeStyles.ts
import { StyleSheet } from 'react-native-unistyles';
import { brandThemes } from './theme';

export const createStyles = (theme: keyof typeof brandThemes) => {
  const currentTheme = brandThemes[theme].colors;

  return StyleSheet.create({
    container: {
      backgroundColor: currentTheme.background,
      flex: 1,
    },
    text: {
      color: currentTheme.text,
    },
    // Add more styles as needed
  });
};
```

### 5. Use the Theme in Your Components
Now you can use the theme in your components by wrapping your app with the `ThemeProvider` and using the `useTheme` hook.

```typescript
// src/App.tsx
import React from 'react';
import { ThemeProvider } from './features/theme/components/ThemeProvider';
import ThemeScreen from './features/theme/screens/ThemeScreen';

const App = () => {
  return (
    <ThemeProvider>
      <ThemeScreen />
    </ThemeProvider>
  );
};

export default App;
```

### 6. Example of a Themed Screen
Here’s how you can create a screen that uses the theme.

```typescript
// src/features/theme/screens/ThemeScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { createStyles } from '../styles/themeStyles';

const ThemeScreen: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Current Theme: {theme}</Text>
      {/* Add buttons or controls to change the theme */}
    </View>
  );
};

export default ThemeScreen;
```

### Conclusion
By following this structure, you can easily implement and switch between your theme variants using `react-native-unistyles`. This approach keeps your code modular, maintainable, and aligned with best practices for React Native development. If you need further assistance with specific implementations or features, feel free to ask!

---

_**User**_

Perfect! now please do the changes accordingly. I've already styles in this feature first pattern please do the changes in it do not create anoher directory/files.

---

_**Assistant**_



---

_**Assistant**_

```
import React, { createContext, useContext, useState } from 'react';
import { BrandTheme, brandThemes } from './themeStyles';

const ThemeContext = createContext<{
  theme: BrandTheme;
  setTheme: (theme: keyof typeof brandThemes) => void;
}>({ theme: brandThemes.default, setTheme: () => {} });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<BrandTheme>(brandThemes.default);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

---

_**Assistant**_



---

_**Assistant**_



---

_**Assistant**_

```
import React, { createContext, useContext, useState } from 'react';
import { BrandTheme, brandThemes } from './theme';

const ThemeContext = createContext<{
  theme: BrandTheme;
  setTheme: (theme: keyof typeof brandThemes) => void;
}>({ theme: brandThemes.default, setTheme: () => {} });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<BrandTheme>(brandThemes.default);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

---

_**Assistant**_

```
const ThemeContext = createContext<{
  theme: BrandTheme;
  setTheme: (theme: keyof typeof brandThemes) => void;
}>({ theme: brandThemes.default, setTheme: (theme) => {} });
```

---

_**Assistant**_

```
const ThemeContext = createContext<{
  theme: BrandTheme;
  setTheme: (theme: keyof typeof brandThemes) => void;
}>({ theme: brandThemes.default, setTheme: (theme) => setTheme(brandThemes[theme]) });
```

---

_**Assistant**_

```
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<BrandTheme>(brandThemes.default);

  const changeTheme = (themeKey: keyof typeof brandThemes) => {
    setTheme(brandThemes[themeKey]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

---

_**Assistant**_

```
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<BrandTheme>(brandThemes.default);

  const changeTheme = (themeKey: keyof typeof brandThemes) => {
    setTheme(brandThemes[themeKey]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

---

_**Assistant**_

It seems that the last edit did not resolve the linter errors. The issue arises from the fact that the `setTheme` function is being referenced before it is defined. Let's correct this by ensuring that the `setTheme` function is properly scoped and used.

I'll redefine the `setTheme` function to avoid any scope issues and ensure it updates the theme correctly. Let's make the necessary adjustments.

---

_**Assistant**_

```
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<BrandTheme>(brandThemes.default);

  const changeTheme = (themeKey: keyof typeof brandThemes) => {
    setTheme(brandThemes[themeKey]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

---

_**Assistant**_

It appears that the last attempt to edit the file did not result in any changes. The linter errors indicate that there are still issues with the `setTheme` function. 

To resolve this, I will ensure that the `setTheme` function is correctly defined and used within the `ThemeProvider` component. Let's make the necessary adjustments again.

---

_**Assistant**_

```
import React, { createContext, useContext, useState } from 'react';
import { BrandTheme, brandThemes } from './theme';

const ThemeContext = createContext<{
  theme: BrandTheme;
  setTheme: (theme: keyof typeof brandThemes) => void;
}>({ theme: brandThemes.default, setTheme: () => {} });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<BrandTheme>(brandThemes.default);

  const changeTheme = (themeKey: keyof typeof brandThemes) => {
    setTheme(brandThemes[themeKey]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

---

_**Assistant**_

```
undefined
```

---

_**Assistant**_



---



---

