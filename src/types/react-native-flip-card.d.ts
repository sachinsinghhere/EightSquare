declare module 'react-native-flip-card' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';

  export interface FlipCardProps {
    style?: ViewStyle;
    friction?: number;
    perspective?: number;
    flipHorizontal?: boolean;
    flipVertical?: boolean;
    flip?: boolean;
    clickable?: boolean;
    onFlipStart?: (isFlipStart: boolean) => void;
    onFlipEnd?: (isFlipEnd: boolean) => void;
    alignHeight?: boolean;
    alignWidth?: boolean;
    useNativeDriver?: boolean;
    children: React.ReactNode[];
  }

  export default class FlipCard extends Component<FlipCardProps> {}
} 