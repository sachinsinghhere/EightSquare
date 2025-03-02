import React from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {FadeIn} from 'react-native-reanimated';
import Icon from './Icon';

interface CustomHeaderProps {
  onBack?: () => void;
  rightComponent?: React.ReactNode;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  onBack,
  rightComponent,
}) => {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();

  if (!onBack && !rightComponent) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}>
      {onBack && (
        <TouchableOpacity
          onPress={onBack}
          style={[styles.backButton, {backgroundColor: theme.colors.card}]}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon name="chevron-left" size={28} color={theme.colors.text} />
        </TouchableOpacity>
      )}
      {rightComponent && <View style={styles.rightComponent}>{rightComponent}</View>}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    height: 56,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  rightComponent: {
    marginLeft: 'auto',
  },
});

export default CustomHeader; 