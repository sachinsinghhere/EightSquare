import React, { memo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';

interface Star {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
}

const NUM_STARS = 50;
const { width, height } = Dimensions.get('window');

const generateStars = (): Star[] => {
  return Array.from({ length: NUM_STARS }, () => ({
    cx: Math.random() * width,
    cy: Math.random() * height,
    r: Math.random() * 2 + 1,
    opacity: Math.random() * 0.8 + 0.2, // Random opacity between 0.2 and 1
  }));
};

export const GalaxyBackground: React.FC = memo(() => {
  const { theme } = useTheme();
  const stars = React.useMemo(() => generateStars(), []);

  return (
    <Svg style={StyleSheet.absoluteFill}>
      <Defs>
        <RadialGradient id="galaxyGradient" cx="50%" cy="50%" r="50%">
          <Stop
            offset="0%"
            stopColor={theme.colors.background}
            stopOpacity="1"
          />
          <Stop
            offset="100%"
            stopColor={theme.colors.primary}
            stopOpacity="0.1"
          />
        </RadialGradient>
      </Defs>
      <Rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="url(#galaxyGradient)"
      />
      {stars.map((star, index) => (
        <Circle
          key={index}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill={theme.colors.text}
          opacity={star.opacity}
        />
      ))}
    </Svg>
  );
});
