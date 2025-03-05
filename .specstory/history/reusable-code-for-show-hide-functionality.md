## SpecStory

## Reusable Code for Show/Hide Functionality (3/4/2025, 11:29:27 PM)

_**User**_

Make this code reusable at any screen we just need to pass true false it will appear and disappear, you can add more things if you want to.

---

_**Assistant**_

```
/* Remove unused Text import */
-import { View, Text } from 'react-native'
+import { View } from 'react-native'

/* Update component to accept props and conditionally render based on visible prop */
-import React from 'react'
+import React from 'react'

-const Loader = () => {
-  return (
-    <View
-      style={{
-        position: 'absolute',
-        top: 0,
-        left: 0,
-        right: 0,
-        bottom: 0,
-        justifyContent: 'center',
-        alignItems: 'center',
-        backgroundColor: 'rgba(0,0,0,0.5)',
-      }}>
-      <LottieView
-        source={require('../assets/lotties/chess_loader.json')}
-        style={{width: 200, height: 200}}
-        autoPlay
-        loop
-      />
-    </View>
-  );
-}
+interface LoaderProps {
+  visible: boolean;
+  style?: object;
+  animationSource?: any;
+}
+
+const Loader: React.FC<LoaderProps> = ({ visible, style, animationSource }) => {
+  if (!visible) return null;
+
+  return (
+    <View
+      style={[{
+        position: 'absolute',
+        top: 0,
+        left: 0,
+        right: 0,
+        bottom: 0,
+        justifyContent: 'center',
+        alignItems: 'center',
+        backgroundColor: 'rgba(0,0,0,0.5)',
+      }, style]}
+    >
+      <LottieView
+        source={animationSource || require('../assets/lotties/chess_loader.json')}
+        style={{ width: 200, height: 200 }}
+        autoPlay
+        loop
+      />
+    </View>
+  );
+};

```

---

_**Assistant**_

I've updated the Loader component to make it reusable across your screens. You can now control its visibility by passing a boolean via a new prop called "visible". Additionally, I've added optional "style" and "animationSource" props so you can customize the appearance or swap the animation if needed. 

Usage example:

------------------------------------------------
import Loader from 'src/shared/components/Loader';

// In your screen component's render:
return (
  <>
    {/* your other components */}
    <Loader visible={isLoading} style={{ backgroundColor: 'rgba(255,255,255,0.8)' }} />
  </>
);
------------------------------------------------

When you set "visible" to true, the loader will show up; false will hide it.

Let me know if you need further changes!

---

_**User**_

Keep the styles using Stylesheet. 

---

_**Assistant**_

```
undefined
```

---

_**Assistant**_



---



---

