import {TextStyle} from 'react-native';

// Simple font family configuration
export const fonts = {
  primary: {
    regular: 'ProzaLibre-Regular',
    medium: 'ProzaLibre-Medium',
    semibold: 'ProzaLibre-SemiBold',
    bold: 'ProzaLibre-Bold',
  },
  secondary: {
    regular: 'CormorantGaramond-Regular',
    medium: 'CormorantGaramond-Medium',
    semibold: 'CormorantGaramond-SemiBold',
    bold: 'CormorantGaramond-Bold',
  },
};

// Predefined text styles that can be used directly
export const textStyles = {
  // Headings
  h1: {
    fontSize: 36,
    fontFamily: fonts.primary.bold,
    lineHeight: 44,
  },
  h2: {
    fontSize: 30,
    fontFamily: fonts.primary.bold,
    lineHeight: 38,
  },
  h3: {
    fontSize: 24,
    fontFamily: fonts.primary.bold,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontFamily: fonts.primary.bold,
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontFamily: fonts.primary.bold,
    lineHeight: 26,
  },

  // Body text
  bodyLarge: {
    fontSize: 18,
    fontFamily: fonts.primary.regular,
    lineHeight: 28,
  },
  bodyMedium: {
    fontSize: 16,
    fontFamily: fonts.primary.regular,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontFamily: fonts.primary.regular,
    lineHeight: 20,
  },

  // Special styles
  button: {
    fontSize: 16,
    fontFamily: fonts.primary.medium,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    fontFamily: fonts.primary.regular,
    lineHeight: 16,
  },

  // Helper function to get secondary font variant
  getSecondaryStyle: (style: TextStyle): TextStyle => ({
    ...style,
    fontFamily: style.fontFamily?.replace('ProzaLibre', 'CormorantGaramond'),
  }),
} as const;

// Simple helper to combine styles
export const combineStyles = (...styles: TextStyle[]): TextStyle => {
  return Object.assign({}, ...styles);
};

export type TextStyles = typeof textStyles;
