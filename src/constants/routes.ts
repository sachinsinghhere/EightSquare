export const ROUTES = {
  // Stack Routes
  HOME: 'Home',
  DETAILS: 'Details',
  SETTINGS: 'Settings',
  PROFILE: 'Profile',
  
  // Tab Routes
  HOME_TAB: 'HomeTab',
  SETTINGS_TAB: 'SettingsTab',
  PROFILE_TAB: 'ProfileTab',
} as const;

export type RootStackParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.DETAILS]: { id: string };
  [ROUTES.SETTINGS]: undefined;
  [ROUTES.PROFILE]: undefined;
};

export type RootTabParamList = {
  [ROUTES.HOME_TAB]: undefined;
  [ROUTES.SETTINGS_TAB]: undefined;
  [ROUTES.PROFILE_TAB]: undefined;
}; 