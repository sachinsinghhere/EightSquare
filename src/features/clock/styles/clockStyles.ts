import { StyleSheet } from 'react-native';
import { textStyles, combineStyles } from '../../../shared/theme/typography';

export const clockStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    ...combineStyles(
      textStyles.h3,
      textStyles.getSecondaryStyle(textStyles.h3)
    ),
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    ...combineStyles(
      textStyles.bodyMedium,
      textStyles.getSecondaryStyle(textStyles.bodyMedium)
    ),
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    ...textStyles.button,
  },
}); 