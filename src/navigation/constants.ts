import { textStyles } from '../shared/theme/typography';
import { Theme } from '../shared/theme/theme';

export const getStackScreenOptions = (theme: Theme) => ({
  headerShown: false,
  contentStyle: {
    backgroundColor: theme.colors.background,
  },
});

export const getTabNavigatorOptions = (theme: Theme) => ({
  headerShown: false,
  tabBarStyle: {
    backgroundColor: theme.colors.card,
    borderTopColor: theme.colors.border,
  },
  tabBarLabelStyle: {
    ...textStyles.caption,
    color: theme.colors.text,
  },
  tabBarActiveTintColor: theme.colors.primary,
  tabBarInactiveTintColor: theme.colors.text,
}); 