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

export type ThemeVariant =
  | 'ocean'
  | 'bubblegum'
  | 'clay'
  | 'neon'
  | 'romantic'
  | 'tournament'
  | 'wood'
  | 'winter';

export interface BrandTheme {
  ocean: Theme;
  bubblegum: Theme;
  clay: Theme;
  neon: Theme;
  romantic: Theme;
  tournament: Theme;
  wood: Theme;
  winter: Theme;
}

export const oceanTheme: Theme = {
  name: 'Ocean',
  dark: false,
  colors: {
    primary: '#29ABE2', // A calming blue
    secondary: '#72DDF7', // A lighter blue
    background: '#E0F7FA', // Very light cyan
    card: '#FFFFFF',
    text: '#37474F', // Dark grayish blue
    border: '#B0BEC5',
    notification: '#EF5350',
    error: '#EF5350',
    success: '#66BB6A',
    warning: '#FFA726',
    surface: '#FFFFFF',
    surfaceVariant: '#E1F5FE', // Even lighter cyan
    onSurface: '#37474F',
  },
};

export const bubblegumTheme: Theme = {
  name: 'Bubblegum',
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

export const clayTheme: Theme = {
  name: 'Clay',
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

export const neonTheme: Theme = {
  name: 'Neon',
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

export const romanticTheme: Theme = {
  name: 'Romantic',
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

export const tournamentTheme: Theme = {
  name: 'Tournament',
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

export const woodTheme: Theme = {
  name: 'Wood',
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

export const winterTheme: Theme = {
  name: 'Winter',
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
    ocean: oceanTheme,
    bubblegum: bubblegumTheme,
    clay: clayTheme,
    neon: neonTheme,
    romantic: romanticTheme,
    tournament: tournamentTheme,
    wood: woodTheme,
    winter: winterTheme,
  },
};
// Theme images mapping
export const themeImages: Record<string, ImageSourcePropType> = {
  ocean: require('../../assets/images/themeBgs/ocean.png'),
  bubblegum: require('../../assets/images/themeBgs/bubblegum.png'),
  clay: require('../../assets/images/themeBgs/clay.png'),
  neon: require('../../assets/images/themeBgs/neon.png'),
  romantic: require('../../assets/images/themeBgs/romantic.png'),
  tournament: require('../../assets/images/themeBgs/tournament.png'),
  wood: require('../../assets/images/themeBgs/wood.png'),
  winter: require('../../assets/images/themeBgs/winter.png'),
};

// Theme chessboard images mapping
export const themeChessboardImages: Record<string, Record<string, ImageSourcePropType>> = {
  ocean: {
    bb: require('../../assets/pieces/Ocean/bb.png'),
    bn: require('../../assets/pieces/Ocean/bn.png'),
    bq: require('../../assets/pieces/Ocean/bq.png'),
    br: require('../../assets/pieces/Ocean/br.png'),
    bp: require('../../assets/pieces/Ocean/bp.png'),
    bk: require('../../assets/pieces/Ocean/bk.png'),
    wb: require('../../assets/pieces/Ocean/wb.png'),
    wn: require('../../assets/pieces/Ocean/wn.png'),
    wq: require('../../assets/pieces/Ocean/wq.png'),
    wr: require('../../assets/pieces/Ocean/wr.png'),
    wp: require('../../assets/pieces/Ocean/wp.png'),
    wk: require('../../assets/pieces/Ocean/wk.png'),
  },
  bubblegum: {
    bb: require('../../assets/pieces/Bubblegum/bb.png'),
    bn: require('../../assets/pieces/Bubblegum/bn.png'),
    bq: require('../../assets/pieces/Bubblegum/bq.png'),
    br: require('../../assets/pieces/Bubblegum/br.png'),
    bp: require('../../assets/pieces/Bubblegum/bp.png'),
    bk: require('../../assets/pieces/Bubblegum/bk.png'),
    wb: require('../../assets/pieces/Bubblegum/wb.png'),
    wn: require('../../assets/pieces/Bubblegum/wn.png'),
    wq: require('../../assets/pieces/Bubblegum/wq.png'),
    wr: require('../../assets/pieces/Bubblegum/wr.png'),
    wp: require('../../assets/pieces/Bubblegum/wp.png'),
    wk: require('../../assets/pieces/Bubblegum/wk.png'),
  },
  clay: {
    bb: require('../../assets/pieces/Clay/bb.png'),
    bn: require('../../assets/pieces/Clay/bn.png'),
    bq: require('../../assets/pieces/Clay/bq.png'),
    br: require('../../assets/pieces/Clay/br.png'),
    bp: require('../../assets/pieces/Clay/bp.png'),
    bk: require('../../assets/pieces/Clay/bk.png'),
    wb: require('../../assets/pieces/Clay/wb.png'),
    wn: require('../../assets/pieces/Clay/wn.png'),
    wq: require('../../assets/pieces/Clay/wq.png'),
    wr: require('../../assets/pieces/Clay/wr.png'),
    wp: require('../../assets/pieces/Clay/wp.png'),
    wk: require('../../assets/pieces/Clay/wk.png'),
  },
  neon: {
    bb: require('../../assets/pieces/Neon/bb.png'),
    bn: require('../../assets/pieces/Neon/bn.png'),
    bq: require('../../assets/pieces/Neon/bq.png'),
    br: require('../../assets/pieces/Neon/br.png'),
    bp: require('../../assets/pieces/Neon/bp.png'),
    bk: require('../../assets/pieces/Neon/bk.png'),
    wb: require('../../assets/pieces/Neon/wb.png'),
    wn: require('../../assets/pieces/Neon/wn.png'),
    wq: require('../../assets/pieces/Neon/wq.png'),
    wr: require('../../assets/pieces/Neon/wr.png'),
    wp: require('../../assets/pieces/Neon/wp.png'),
    wk: require('../../assets/pieces/Neon/wk.png'),
  },
  romantic: {
    bb: require('../../assets/pieces/Romantic/bb.png'),
    bn: require('../../assets/pieces/Romantic/bn.png'),
    bq: require('../../assets/pieces/Romantic/bq.png'),
    br: require('../../assets/pieces/Romantic/br.png'),
    bp: require('../../assets/pieces/Romantic/bp.png'),
    bk: require('../../assets/pieces/Romantic/bk.png'),
    wb: require('../../assets/pieces/Romantic/wb.png'),
    wn: require('../../assets/pieces/Romantic/wn.png'),
    wq: require('../../assets/pieces/Romantic/wq.png'),
    wr: require('../../assets/pieces/Romantic/wr.png'),
    wp: require('../../assets/pieces/Romantic/wp.png'),
    wk: require('../../assets/pieces/Romantic/wk.png'),
  },
  tournament: {
    bb: require('../../assets/pieces/Tournament/bb.png'),
    bn: require('../../assets/pieces/Tournament/bn.png'),
    bq: require('../../assets/pieces/Tournament/bq.png'),
    br: require('../../assets/pieces/Tournament/br.png'),
    bp: require('../../assets/pieces/Tournament/bp.png'),
    bk: require('../../assets/pieces/Tournament/bk.png'),
    wb: require('../../assets/pieces/Tournament/wb.png'),
    wn: require('../../assets/pieces/Tournament/wn.png'),
    wq: require('../../assets/pieces/Tournament/wq.png'),
    wr: require('../../assets/pieces/Tournament/wr.png'),
    wp: require('../../assets/pieces/Tournament/wp.png'),
    wk: require('../../assets/pieces/Tournament/wk.png'),
  },
  wood: {
    bb: require('../../assets/pieces/Wood/bb.png'),
    bn: require('../../assets/pieces/Wood/bn.png'),
    bq: require('../../assets/pieces/Wood/bq.png'),
    br: require('../../assets/pieces/Wood/br.png'),
    bp: require('../../assets/pieces/Wood/bp.png'),
    bk: require('../../assets/pieces/Wood/bk.png'),
    wb: require('../../assets/pieces/Wood/wb.png'),
    wn: require('../../assets/pieces/Wood/wn.png'),
    wq: require('../../assets/pieces/Wood/wq.png'),
    wr: require('../../assets/pieces/Wood/wr.png'),
    wp: require('../../assets/pieces/Wood/wp.png'),
    wk: require('../../assets/pieces/Wood/wk.png'),
  },
  winter: {
    bb: require('../../assets/pieces/Winter/bb.png'),
    bn: require('../../assets/pieces/Winter/bn.png'),
    bq: require('../../assets/pieces/Winter/bq.png'),
    br: require('../../assets/pieces/Winter/br.png'),
    bp: require('../../assets/pieces/Winter/bp.png'),
    bk: require('../../assets/pieces/Winter/bk.png'),
    wb: require('../../assets/pieces/Winter/wb.png'),
    wn: require('../../assets/pieces/Winter/wn.png'),
    wq: require('../../assets/pieces/Winter/wq.png'),
    wr: require('../../assets/pieces/Winter/wr.png'),
    wp: require('../../assets/pieces/Winter/wp.png'),
    wk: require('../../assets/pieces/Winter/wk.png'),
  },
};

