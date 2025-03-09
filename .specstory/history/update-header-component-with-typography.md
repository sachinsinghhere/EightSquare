## SpecStory

## Update Header Component with Typography (3/9/2025, 10:33:35 PM)

_**User**_

use @typography.ts file here. 

---

_**Assistant**_

I'll help you update the `Header.tsx` component to use the typography styles from the typography file. I'll modify the title style to use the predefined text styles.

Let me edit the `Header.tsx` file to import and use the typography styles:

---

_**Assistant**_

```
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { textStyles } from '../theme/typography';
// ... existing code ...
  title: {
    flex: 1,
    textAlign: 'center',
    ...textStyles.getSecondaryStyle(textStyles.h4),
  },
```

---

_**Assistant**_

I've made the following changes to improve the typography in the header:

1. Added an import for `textStyles` from the typography system
2. Updated the title style to use `textStyles.h4` with the secondary font variant (Cormorant Garamond) using the `getSecondaryStyle` helper
3. Removed the manual font settings and replaced them with the typography system's predefined styles

The header title will now use:
- The h4 size (20px)
- The Cormorant Garamond bold font (through the secondary style variant)
- Proper line height (28px) from the typography system
- Maintained the center alignment and flex properties

This change makes the header consistent with the rest of the application's typography system and makes it easier to maintain typography changes in the future.

Would you like me to help you with anything else, such as fixing the MaterialCommunityIcons linter errors?

---



---

