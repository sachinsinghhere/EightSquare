import {ImageSourcePropType} from 'react-native';

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
  | 'earth'
  | 'jupiter'
  | 'mars'
  | 'neptune'
  | 'saturn'
  | 'uranus'
  | 'venus'
  | 'mercury'
  | 'cosmos';

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
  name: 'Cosmos',
  dark: false,
  colors: {
    primary: '#2C3150',
    secondary: '#3B4065',
    background: '#7D8297',
    card: '#B0B5CC',
    text: '#101223',
    border: '#545A85',
    notification: '#FF8C9F',
    error: '#E57373',
    success: '#66D197',
    warning: '#F5C16C',
    surface: '#A4A9C3',
    surfaceVariant: '#8D92B0',
    onSurface: '#1C1E33',
  },
};

export const marsTheme: Theme = {
  name: 'Mars',
  dark: false,
  colors: {
    primary: '#9C2A1F',
    secondary: '#BF5533',
    background: '#E6D0C4',
    card: '#CFA48A',
    text: '#3E241B',
    border: '#733A2B',
    notification: '#B71C1C',
    error: '#922B21',
    success: '#688A40',
    warning: '#FB8C00',
    surface: '#D4B09B',
    surfaceVariant: '#A84F32',
    onSurface: '#4F2F21',
  },
};

export const mercuryTheme: Theme = {
  name: 'Mercury',
  dark: false,
  colors: {
    primary: '#90A4AE',
    secondary: '#CFD8DC',
    background: '#ECEFF1',
    card: '#D6D6D6',
    text: '#424242',
    border: '#9E9E9E',
    notification: '#D32F2F',
    error: '#E57373',
    success: '#81C784',
    warning: '#FFA000',
    surface: '#F5F5F5',
    surfaceVariant: '#BDBDBD',
    onSurface: '#616161',
  },
};
export const neptuneTheme: Theme = {
  name: 'Neptune',
  dark: false,
  colors: {
    primary: '#5A89D6',
    secondary: '#7AA4F0',
    background: '#E3ECFF',
    card: '#C5D8FF',
    text: '#1A1F33',
    border: '#85A8E6',
    notification: '#FF7043',
    error: '#D32F2F',
    success: '#81C784',
    warning: '#FFCA28',
    surface: '#B0CFFF',
    surfaceVariant: '#94B8F2',
    onSurface: '#263A66',
  },
};

export const earthTheme: Theme = {
  name: 'Earth',
  dark: true,
  colors: {
    primary: '#3B4D2E', // Deep forest green
    secondary: '#9C7B55', // Even lighter earthy brown
    background: '#1E241B', // Dark soil brown-green
    card: '#2C3624', // Muted deep green
    text: '#D6CBB8', // Soft sandy beige for readability
    border: '#9F8263', // Lightened tree-bark brown
    notification: '#C97242', // Earthy clay orange
    error: '#A13D2D', // Muted brick red
    success: '#7D8F65', // Desaturated green, like moss
    warning: '#C49A48', // Warm golden-brown
    surface: '#343E2B', // Muted deep green, organic and natural
    surfaceVariant: '#B1916E', // Soft, warm tan-brown
    onSurface: '#E3D7C3', // Soft beige for clarity
  },
};




export const uranusTheme: Theme = {
  name: 'Uranus',
  dark: false,
  colors: {
    primary: '#4DA0B2',
    secondary: '#6FBACD',
    background: '#D1EAF0',
    card: '#A9D6DF',
    text: '#152326',
    border: '#7ABFD2',
    notification: '#F4511E',
    error: '#C62828',
    success: '#4CAF50',
    warning: '#FFB300',
    surface: '#96C6D1',
    surfaceVariant: '#7BAFBC',
    onSurface: '#1E3A42',
  },
};

// For tournament and wood themes, I'll provide chessboard-optimized colors

export const jupiterTheme: Theme = {
  // Jupiter with pieces
  name: 'Jupiter',
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

export const saturnTheme: Theme = {
  name: 'Saturn',
  dark: false,
  colors: {
    primary: '#A68B5B',
    secondary: '#C2A878',
    background: '#F0E5D2',
    card: '#D6C2A1',
    text: '#4F3A25',
    border: '#8B6E4E',
    notification: '#B53B2C',
    error: '#9B3327',
    success: '#94A76F',
    warning: '#E0A020',
    surface: '#E8D4B8',
    surfaceVariant: '#B5976F',
    onSurface: '#5F442A',
  },
};

export const venusTheme: Theme = {
  name: 'Venus',
  dark: false,
  colors: {
    primary: '#D7A86E',
    secondary: '#E6C199',
    background: '#F5E1C8',
    card: '#E8D2A6',
    text: '#5C3D2E',
    border: '#B38867',
    notification: '#D84315',
    error: '#BF360C',
    success: '#A3C585',
    warning: '#FFB74D',
    surface: '#F0D8B6',
    surfaceVariant: '#D1A87E',
    onSurface: '#6D4C41',
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
    bb: require('../../assets/pieces/cosmos/bb.png'),
    bn: require('../../assets/pieces/cosmos/bn.png'),
    bq: require('../../assets/pieces/cosmos/bq.png'),
    br: require('../../assets/pieces/cosmos/br.png'),
    bp: require('../../assets/pieces/cosmos/bp.png'),
    bk: require('../../assets/pieces/cosmos/bk.png'),
    wb: require('../../assets/pieces/cosmos/wb.png'),
    wn: require('../../assets/pieces/cosmos/wn.png'),
    wq: require('../../assets/pieces/cosmos/wq.png'),
    wr: require('../../assets/pieces/cosmos/wr.png'),
    wp: require('../../assets/pieces/cosmos/wp.png'),
    wk: require('../../assets/pieces/cosmos/wk.png'),
  },
  earth: {
    bb: require('../../assets/pieces/earth/bb.png'),
    bn: require('../../assets/pieces/earth/bn.png'),
    bq: require('../../assets/pieces/earth/bq.png'),
    br: require('../../assets/pieces/earth/br.png'),
    bp: require('../../assets/pieces/earth/bp.png'),
    bk: require('../../assets/pieces/earth/bk.png'),
    wb: require('../../assets/pieces/earth/wb.png'),
    wn: require('../../assets/pieces/earth/wn.png'),
    wq: require('../../assets/pieces/earth/wq.png'),
    wr: require('../../assets/pieces/earth/wr.png'),
    wp: require('../../assets/pieces/earth/wp.png'),
    wk: require('../../assets/pieces/earth/wk.png'),
  },
  jupiter: {
    bb: require('../../assets/pieces/jupiter/bb.png'),
    bn: require('../../assets/pieces/jupiter/bn.png'),
    bq: require('../../assets/pieces/jupiter/bq.png'),
    br: require('../../assets/pieces/jupiter/br.png'),
    bp: require('../../assets/pieces/jupiter/bp.png'),
    bk: require('../../assets/pieces/jupiter/bk.png'),
    wb: require('../../assets/pieces/jupiter/wb.png'),
    wn: require('../../assets/pieces/jupiter/wn.png'),
    wq: require('../../assets/pieces/jupiter/wq.png'),
    wr: require('../../assets/pieces/jupiter/wr.png'),
    wp: require('../../assets/pieces/jupiter/wp.png'),
    wk: require('../../assets/pieces/jupiter/wk.png'),
  },
  mars: {
    bb: require('../../assets/pieces/mars/bb.png'),
    bn: require('../../assets/pieces/mars/bn.png'),
    bq: require('../../assets/pieces/mars/bq.png'),
    br: require('../../assets/pieces/mars/br.png'),
    bp: require('../../assets/pieces/mars/bp.png'),
    bk: require('../../assets/pieces/mars/bk.png'),
    wb: require('../../assets/pieces/mars/wb.png'),
    wn: require('../../assets/pieces/mars/wn.png'),
    wq: require('../../assets/pieces/mars/wq.png'),
    wr: require('../../assets/pieces/mars/wr.png'),
    wp: require('../../assets/pieces/mars/wp.png'),
    wk: require('../../assets/pieces/mars/wk.png'),
  },
  saturn: {
    bb: require('../../assets/pieces/saturn/bb.png'),
    bn: require('../../assets/pieces/saturn/bn.png'),
    bq: require('../../assets/pieces/saturn/bq.png'),
    br: require('../../assets/pieces/saturn/br.png'),
    bp: require('../../assets/pieces/saturn/bp.png'),
    bk: require('../../assets/pieces/saturn/bk.png'),
    wb: require('../../assets/pieces/saturn/wb.png'),
    wn: require('../../assets/pieces/saturn/wn.png'),
    wq: require('../../assets/pieces/saturn/wq.png'),
    wr: require('../../assets/pieces/saturn/wr.png'),
    wp: require('../../assets/pieces/saturn/wp.png'),
    wk: require('../../assets/pieces/saturn/wk.png'),
  },
  uranus: {
    bb: require('../../assets/pieces/uranus/bb.png'),
    bn: require('../../assets/pieces/uranus/bn.png'),
    bq: require('../../assets/pieces/uranus/bq.png'),
    br: require('../../assets/pieces/uranus/br.png'),
    bp: require('../../assets/pieces/uranus/bp.png'),
    bk: require('../../assets/pieces/uranus/bk.png'),
    wb: require('../../assets/pieces/uranus/wb.png'),
    wn: require('../../assets/pieces/uranus/wn.png'),
    wq: require('../../assets/pieces/uranus/wq.png'),
    wr: require('../../assets/pieces/uranus/wr.png'),
    wp: require('../../assets/pieces/uranus/wp.png'),
    wk: require('../../assets/pieces/uranus/wk.png'),
  },
  venus: {
    bb: require('../../assets/pieces/venus/bb.png'),
    bn: require('../../assets/pieces/venus/bn.png'),
    bq: require('../../assets/pieces/venus/bq.png'),
    br: require('../../assets/pieces/venus/br.png'),
    bp: require('../../assets/pieces/venus/bp.png'),
    bk: require('../../assets/pieces/venus/bk.png'),
    wb: require('../../assets/pieces/venus/wb.png'),
    wn: require('../../assets/pieces/venus/wn.png'),
    wq: require('../../assets/pieces/venus/wq.png'),
    wr: require('../../assets/pieces/venus/wr.png'),
    wp: require('../../assets/pieces/venus/wp.png'),
    wk: require('../../assets/pieces/venus/wk.png'),
  },
  neptune: {
    bb: require('../../assets/pieces/neptune/bb.png'),
    bn: require('../../assets/pieces/neptune/bn.png'),
    bq: require('../../assets/pieces/neptune/bq.png'),
    br: require('../../assets/pieces/neptune/br.png'),
    bp: require('../../assets/pieces/neptune/bp.png'),
    bk: require('../../assets/pieces/neptune/bk.png'),
    wb: require('../../assets/pieces/neptune/wb.png'),
    wn: require('../../assets/pieces/neptune/wn.png'),
    wq: require('../../assets/pieces/neptune/wq.png'),
    wr: require('../../assets/pieces/neptune/wr.png'),
    wp: require('../../assets/pieces/neptune/wp.png'),
    wk: require('../../assets/pieces/neptune/wk.png'),
  },
  mercury: {
    bb: require('../../assets/pieces/mercury/bb.png'),
    bn: require('../../assets/pieces/mercury/bn.png'),
    bq: require('../../assets/pieces/mercury/bq.png'),
    br: require('../../assets/pieces/mercury/br.png'),
    bp: require('../../assets/pieces/mercury/bp.png'),
    bk: require('../../assets/pieces/mercury/bk.png'),
    wb: require('../../assets/pieces/mercury/wb.png'),
    wn: require('../../assets/pieces/mercury/wn.png'),
    wq: require('../../assets/pieces/mercury/wq.png'),
    wr: require('../../assets/pieces/mercury/wr.png'),
    wp: require('../../assets/pieces/mercury/wp.png'),
    wk: require('../../assets/pieces/mercury/wk.png'),
  },
};
