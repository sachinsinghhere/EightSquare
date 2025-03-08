import { ImageSourcePropType } from 'react-native';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
  surface: string;
  surfaceVariant: string;
  onSurface: string;
}

export interface Theme {
  name: string;
  dark: boolean;
  colors: ThemeColors;
}

export type ThemeVariant = 'earth' | 'jupiter' | 'mars' | 'neptune' | 'saturn' | 'uranus' | 'venus' | 'mercury' | 'cosmos';

export interface BrandTheme {
  earth: Theme;
  jupiter: Theme;
  mars: Theme;
  neptune: Theme;
  saturn: Theme;
  uranus: Theme;
  venus: Theme;
  mercury: Theme;
  cosmos: Theme;
}

export const cosmosTheme: Theme = {
  name: 'cosmos',
  dark: true,
  colors: {
    primary: '#0D0F1F', // Deep navy-black, rich & immersive
    secondary: '#1B1E36', // Muted twilight blue for depth
    background: '#090B10', // Almost black, but soft
    card: '#141826', // Soft, dark blue-gray for elevated surfaces
    text: '#D1D5E4', // Misty white-blue, crisp but not harsh
    border: '#262A40', // Slightly lighter than card for gentle contrast
    notification: '#FF6B81', // Soft neon red-pink (not overpowering)
    error: '#F05454', // Vivid coral-red for errors
    success: '#4ADE80', // Soft but lively green
    warning: '#E9A23B', // Warm golden amber for alerts
    surface: '#171A2F', // Slightly raised background for panels
    surfaceVariant: '#22253F', // A step lighter for contrast
    onSurface: '#E3E6F3', // Smooth off-white for legibility
  },
};
export const marsTheme: Theme = {
  name: 'mars',
  dark: true,
  colors: {
    primary: '#0D0F1F', // Deep navy-black, rich & immersive
    secondary: '#1B1E36', // Muted twilight blue for depth
    background: '#090B10', // Almost black, but soft
    card: '#141826', // Soft, dark blue-gray for elevated surfaces
    text: '#D1D5E4', // Misty white-blue, crisp but not harsh
    border: '#262A40', // Slightly lighter than card for gentle contrast
    notification: '#FF6B81', // Soft neon red-pink (not overpowering)
    error: '#F05454', // Vivid coral-red for errors
    success: '#4ADE80', // Soft but lively green
    warning: '#E9A23B', // Warm golden amber for alerts
    surface: '#171A2F', // Slightly raised background for panels
    surfaceVariant: '#22253F', // A step lighter for contrast
    onSurface: '#E3E6F3', // Smooth off-white for legibility
  },
};





export const mercuryTheme: Theme = {
  name: 'mercury',
  dark: false,
  colors: {
    primary: '#E91E63', // Pink
    secondary: '#F48FB1', // Lighter pink
    background: '#FCE4EC', // Very light pink
    card: '#FFFFFF',
    text: '#37474F',
    border: '#E1BEE7',
    notification: '#D32F2F',
    error: '#D32F2F',
    success: '#4CAF50',
    warning: '#FF9800',
    surface: '#FFFFFF',
    surfaceVariant: '#F8BBD0', // Slightly darker pink
    onSurface: '#37474F',
  },
};

export const neptuneTheme: Theme = {
  name: 'neptune',
  dark: true,
  colors: {
    primary: '#A1887F', // A muted brown
    secondary: '#D7CCC8', // A light tan
    background: '#3E2723', // Dark brown
    card: '#5D4037', // Medium brown
    text: '#CFD8DC', // Light grayish blue
    border: '#795548',
    notification: '#E64A19',
    error: '#E64A19',
    success: '#8BC34A',
    warning: '#FF8F00',
    surface: '#5D4037',
    surfaceVariant: '#6D4C41', // Slightly lighter brown
    onSurface: '#CFD8DC',
  },
};

export const earthTheme: Theme = {
  name: 'earth',
  dark: true,
  colors: {
    primary: '#64DD17', // Bright green
    secondary: '#B2FF59', // Lime green
    background: '#1B5E20', // Dark green
    card: '#2E7D32', // Medium green
    text: '#EEFF41', // Yellow
    border: '#689F38',
    notification: '#D50000',
    error: '#D50000',
    success: '#AEEA00',
    warning: '#FFD600',
    surface: '#2E7D32',
    surfaceVariant: '#33691E', // Slightly darker green
    onSurface: '#EEFF41',
  },
};

export const uranusTheme: Theme = {
  name: 'uranus',
  dark: false,
  colors: {
    primary: '#F06292', // Rose
    secondary: '#F8BBD0', // Light rose
    background: '#FCE4EC', // Very light rose
    card: '#FFFFFF',
    text: '#4A148C', // Dark purple
    border: '#CE93D8',
    notification: '#E91E63',
    error: '#E91E63',
    success: '#81C784',
    warning: '#FFB74D',
    surface: '#FFFFFF',
    surfaceVariant: '#F3E5F5', // Even lighter rose
    onSurface: '#4A148C',
  },
};

// For tournament and wood themes, I'll provide chessboard-optimized colors

export const jupiterTheme: Theme = {
  // Jupiter with pieces
  name: 'jupiter',
  dark: false,
  colors: {
    primary: '#C68C53', // Light square - A light, natural wood color
    secondary: '#8B4513', // Dark square - A rich, dark wood color
    background: '#F5F5DC', // Beige, for overall calmness
    card: '#FFFFFF',
    text: '#212121',
    border: '#A1887F',
    notification: '#D32F2F',
    error: '#D32F2F',
    success: '#388E3C',
    warning: '#FB8C00',
    surface: '#FFFFFF',
    surfaceVariant: '#E0E0E0',
    onSurface: '#212121',
  },
};

export const saturnTheme: Theme = { // saturn
  name: 'saturn',
  dark: false,
  colors: {
    primary: '#E0C2A3', // Light square - A lighter, more refined wood color
    secondary: '#A0785A', // Dark square - A slightly less intense dark wood
    background: '#F8F0E3', // Off-white, for a softer feel
    card: '#FFFFFF',
    text: '#212121',
    border: '#BCAAA4',
    notification: '#D32F2F',
    error: '#D32F2F',
    success: '#388E3C',
    warning: '#FB8C00',
    surface: '#FFFFFF',
    surfaceVariant: '#ECEFF1',
    onSurface: '#212121',
  },
};

export const venusTheme: Theme = {
  name: 'venus',
  dark: true,
  colors: {
    primary: '#B3E5FC', // Light blue
    secondary: '#81D4FA', // A bit darker blue
    background: '#01579B', // Dark blue
    card: '#29B6F6', // Light blue
    text: '#FFFFFF', // White
    border: '#0277BD',
    notification: '#FFAB91',
    error: '#FFAB91',
    success: '#A5D6A7',
    warning: '#FFCC80',
    surface: '#29B6F6',
    surfaceVariant: '#0288D1', // Slightly darker blue
    onSurface: '#FFFFFF',
  },
};

export const brandThemes: Record<string, BrandTheme> = {
  default: {
    cosmos: cosmosTheme,
    mercury: mercuryTheme,
    venus: venusTheme,
    earth: earthTheme,
    mars: marsTheme,
    jupiter: jupiterTheme,
    saturn: saturnTheme,
    uranus: uranusTheme,
    neptune: neptuneTheme,
  },
};

// Theme images mapping
export const themeImages: Record<string, ImageSourcePropType> = {
  earth: require('../../assets/images/planets/earth.jpeg'),
  jupiter: require('../../assets/images/planets/jupiter.jpeg'),
  mars: require('../../assets/images/planets/mars.jpeg'),
  neptune: require('../../assets/images/planets/neptune.jpeg'),
  saturn: require('../../assets/images/planets/saturn.jpeg'),
  uranus: require('../../assets/images/planets/uranus.jpeg'),
  venus: require('../../assets/images/planets/venus.jpeg'),
  mercury: require('../../assets/images/planets/mercury.jpeg'),
  cosmos: require('../../assets/images/planets/cosmos.jpeg'),
};

export const themeChessboardImages: Record<
  string,
  Record<string, ImageSourcePropType>
> = {
  cosmos: {
    bb: require('../../assets/pieces1/cosmos/bb.png'),
    bn: require('../../assets/pieces1/cosmos/bn.png'),
    bq: require('../../assets/pieces1/cosmos/bq.png'),
    br: require('../../assets/pieces1/cosmos/br.png'),
    bp: require('../../assets/pieces1/cosmos/bp.png'),
    bk: require('../../assets/pieces1/cosmos/bk.png'),
    wb: require('../../assets/pieces1/cosmos/wb.png'),
    wn: require('../../assets/pieces1/cosmos/wn.png'),
    wq: require('../../assets/pieces1/cosmos/wq.png'),
    wr: require('../../assets/pieces1/cosmos/wr.png'),
    wp: require('../../assets/pieces1/cosmos/wp.png'),
    wk: require('../../assets/pieces1/cosmos/wk.png'),
  },
  earth: {
    bb: require('../../assets/pieces1/earth/bb.png'),
    bn: require('../../assets/pieces1/earth/bn.png'),
    bq: require('../../assets/pieces1/earth/bq.png'),
    br: require('../../assets/pieces1/earth/br.png'),
    bp: require('../../assets/pieces1/earth/bp.png'),
    bk: require('../../assets/pieces1/earth/bk.png'),
    wb: require('../../assets/pieces1/earth/wb.png'),
    wn: require('../../assets/pieces1/earth/wn.png'),
    wq: require('../../assets/pieces1/earth/wq.png'),
    wr: require('../../assets/pieces1/earth/wr.png'),
    wp: require('../../assets/pieces1/earth/wp.png'),
    wk: require('../../assets/pieces1/earth/wk.png'),
  },
  jupiter: {
    bb: require('../../assets/pieces1/jupiter/bb.png'),
    bn: require('../../assets/pieces1/jupiter/bn.png'),
    bq: require('../../assets/pieces1/jupiter/bq.png'),
    br: require('../../assets/pieces1/jupiter/br.png'),
    bp: require('../../assets/pieces1/jupiter/bp.png'),
    bk: require('../../assets/pieces1/jupiter/bk.png'),
    wb: require('../../assets/pieces1/jupiter/wb.png'),
    wn: require('../../assets/pieces1/jupiter/wn.png'),
    wq: require('../../assets/pieces1/jupiter/wq.png'),
    wr: require('../../assets/pieces1/jupiter/wr.png'),
    wp: require('../../assets/pieces1/jupiter/wp.png'),
    wk: require('../../assets/pieces1/jupiter/wk.png'),
  },
  mars: {
    bb: require('../../assets/pieces1/mars/bb.png'),
    bn: require('../../assets/pieces1/mars/bn.png'),
    bq: require('../../assets/pieces1/mars/bq.png'),
    br: require('../../assets/pieces1/mars/br.png'),
    bp: require('../../assets/pieces1/mars/bp.png'),
    bk: require('../../assets/pieces1/mars/bk.png'),
    wb: require('../../assets/pieces1/mars/wb.png'),
    wn: require('../../assets/pieces1/mars/wn.png'),
    wq: require('../../assets/pieces1/mars/wq.png'),
    wr: require('../../assets/pieces1/mars/wr.png'),
    wp: require('../../assets/pieces1/mars/wp.png'),
    wk: require('../../assets/pieces1/mars/wk.png'),
  },
  saturn: {
    bb: require('../../assets/pieces1/saturn/bb.png'),
    bn: require('../../assets/pieces1/saturn/bn.png'),
    bq: require('../../assets/pieces1/saturn/bq.png'),
    br: require('../../assets/pieces1/saturn/br.png'),
    bp: require('../../assets/pieces1/saturn/bp.png'),
    bk: require('../../assets/pieces1/saturn/bk.png'),
    wb: require('../../assets/pieces1/saturn/wb.png'),
    wn: require('../../assets/pieces1/saturn/wn.png'),
    wq: require('../../assets/pieces1/saturn/wq.png'),
    wr: require('../../assets/pieces1/saturn/wr.png'),
    wp: require('../../assets/pieces1/saturn/wp.png'),
    wk: require('../../assets/pieces1/saturn/wk.png'),
  },
  uranus: {
    bb: require('../../assets/pieces1/uranus/bb.png'),
    bn: require('../../assets/pieces1/uranus/bn.png'),
    bq: require('../../assets/pieces1/uranus/bq.png'),
    br: require('../../assets/pieces1/uranus/br.png'),
    bp: require('../../assets/pieces1/uranus/bp.png'),
    bk: require('../../assets/pieces1/uranus/bk.png'),
    wb: require('../../assets/pieces1/uranus/wb.png'),
    wn: require('../../assets/pieces1/uranus/wn.png'),
    wq: require('../../assets/pieces1/uranus/wq.png'),
    wr: require('../../assets/pieces1/uranus/wr.png'),
    wp: require('../../assets/pieces1/uranus/wp.png'),
    wk: require('../../assets/pieces1/uranus/wk.png'),
  },
  venus: {
    bb: require('../../assets/pieces1/venus/bb.png'),
    bn: require('../../assets/pieces1/venus/bn.png'),
    bq: require('../../assets/pieces1/venus/bq.png'),
    br: require('../../assets/pieces1/venus/br.png'),
    bp: require('../../assets/pieces1/venus/bp.png'),
    bk: require('../../assets/pieces1/venus/bk.png'),
    wb: require('../../assets/pieces1/venus/wb.png'),
    wn: require('../../assets/pieces1/venus/wn.png'),
    wq: require('../../assets/pieces1/venus/wq.png'),
    wr: require('../../assets/pieces1/venus/wr.png'),
    wp: require('../../assets/pieces1/venus/wp.png'),
    wk: require('../../assets/pieces1/venus/wk.png'),
  },
  neptune: {
    bb: require('../../assets/pieces1/neptune/bb.png'),
    bn: require('../../assets/pieces1/neptune/bn.png'),
    bq: require('../../assets/pieces1/neptune/bq.png'),
    br: require('../../assets/pieces1/neptune/br.png'),
    bp: require('../../assets/pieces1/neptune/bp.png'),
    bk: require('../../assets/pieces1/neptune/bk.png'),
    wb: require('../../assets/pieces1/neptune/wb.png'),
    wn: require('../../assets/pieces1/neptune/wn.png'),
    wq: require('../../assets/pieces1/neptune/wq.png'),
    wr: require('../../assets/pieces1/neptune/wr.png'),
    wp: require('../../assets/pieces1/neptune/wp.png'),
    wk: require('../../assets/pieces1/neptune/wk.png'),
  },
  mercury: {
    bb: require('../../assets/pieces1/mercury/bb.png'),
    bn: require('../../assets/pieces1/mercury/bn.png'),
    bq: require('../../assets/pieces1/mercury/bq.png'),
    br: require('../../assets/pieces1/mercury/br.png'),
    bp: require('../../assets/pieces1/mercury/bp.png'),
    bk: require('../../assets/pieces1/mercury/bk.png'),
    wb: require('../../assets/pieces1/mercury/wb.png'),
    wn: require('../../assets/pieces1/mercury/wn.png'),
    wq: require('../../assets/pieces1/mercury/wq.png'),
    wr: require('../../assets/pieces1/mercury/wr.png'),
    wp: require('../../assets/pieces1/mercury/wp.png'),
    wk: require('../../assets/pieces1/mercury/wk.png'),
  },
};