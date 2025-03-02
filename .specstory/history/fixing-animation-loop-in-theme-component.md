## SpecStory

## Fixing Animation Loop in Theme Component (3/3/2025, 12:36:20 AM)

_**User**_

The themes keep getting animated and goes into a loop can you find the issue and fix it?

---

_**Assistant**_

Let me analyze the code and help fix the animation loop issue. The problem appears to be in the `ThemeItem` component where the animation state keeps updating unnecessarily.

The issue is in the `useEffect` hook that updates the `isSelected` shared value. Currently, it's being triggered whenever `currentTheme` or `item.name` changes, which can cause a continuous animation loop.

Let me fix this by modifying the `ThemeItem` component:

---

_**Assistant**_

```
const ThemeItem = memo(({
  item,
  index,
  currentTheme,
  onSelect,
}: {
  item: Theme;
  index: number;
  currentTheme: string;
  onSelect: (theme: Theme) => void;
}) => {
  const {theme} = useTheme();
  // Initialize with the correct value without using useEffect
  const isSelected = useSharedValue(currentTheme === item.name ? 1 : 0);

// ... existing code ...
```

---

_**Assistant**_



Let me also update the animation logic to properly handle theme changes:

---

_**Assistant**_

```
  const animatedContainerStyle = useAnimatedStyle(() => {
    // Update the shared value when currentTheme changes
    isSelected.value = withTiming(currentTheme === item.name ? 1 : 0);
    
    return {
      backgroundColor: interpolateColor(
        isSelected.value,
        [0, 1],
        ['rgba(0,0,0,0.2)', `${item.colors.primary}80`],
      ),
    };
  });

// ... existing code ...
```

---

_**Assistant**_



I've made two key changes to fix the animation loop issue:

1. Removed the `useEffect` hook that was causing the continuous animation loop by updating the `isSelected` value whenever `currentTheme` or `item.name` changed.

2. Moved the animation logic into the `useAnimatedStyle` hook, which is the proper place to handle these animations. Now the animation will only occur when the theme actually changes, and it will smoothly transition using `withTiming`.

These changes should:
- Stop the continuous animation loop
- Maintain smooth transitions when themes are changed
- Properly handle the initial state of each theme item
- Keep the visual feedback when selecting themes

The animation will now only trigger when you actually select a different theme, rather than continuously looping. Let me know if you notice any other issues with the theme selection behavior!

---

_**User**_

It's still there, can you check the navigation flow too. 

---

_**Assistant**_

I notice a potential issue in the navigation flow. The `ThemeSelectionScreen` appears to be registered in both the `SettingsStack` and the root `AppNavigator`, which could cause navigation conflicts and potentially contribute to the animation loop issue.

Let

---



---

