import SoundPlayer from 'react-native-sound-player';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

let isSoundEnabled = true;

export const setSoundEnabled = (enabled: boolean) => {
  isSoundEnabled = enabled;
};

export const Sounds = {
  move_piece: require('../assets/sound/move_piece.mp3'),
  capture: require('../assets/sound/capture.mp3'),
  check: require('../assets/sound/check.mp3'),
  castle: require('../assets/sound/castle.mp3'),
  game_end: require('../assets/sound/game_end.mp3'),
};

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const playChessSound = async (
  soundType: 'move_piece' | 'capture' | 'check' | 'castle' | 'game_end',
  withHaptic: boolean = true,
) => {
  if (!isSoundEnabled) return;
  
  try {
    // Play haptic feedback
    if (withHaptic) {
      // ReactNativeHapticFeedback.trigger('clockTick', hapticOptions);
    }

    switch (soundType) {
      case 'move_piece':
        await SoundPlayer.playAsset(Sounds.move_piece);
        break;
      case 'capture':
        await SoundPlayer.playAsset(Sounds.capture);
        break;
      case 'check':
        await SoundPlayer.playAsset(Sounds.check);
        break;
      case 'castle':
        await SoundPlayer.playAsset(Sounds.castle);
        break;
      case 'game_end':
        await SoundPlayer.playAsset(Sounds.game_end);
        break;
      default:
        break;
    }
  } catch (error) {
    console.warn('Error playing sound:', error);
  }
};

interface ChessMove {
  color: 'w' | 'b';
  from: string;
  to: string;
  flags?: string;
  piece: string;
  san: string;
}

export interface ChessState {
  in_check: boolean;
  in_checkmate: boolean;
  in_draw: boolean;
  in_stalemate: boolean;
  in_threefold_repetition: boolean;
  insufficient_material: boolean;
  game_over: boolean;
  fen: string;
  in_promotion: boolean;
}

export const playMoveSound = (
  move: ChessMove,
  state: ChessState,
) => {

  console.log('move --> ', move);
  console.log('state --> ', state);
  // Determine the move type based on state and move flags
  const getMoveType = () => {
    if (state.game_over || state.in_checkmate || state.in_draw || state.in_stalemate) {
      return 'gameEnd';
    }
    if (state.in_check) {
      return 'check';
    }
    
    // Check if flags exist before checking includes
    if (move.flags) {
      if (move.flags.includes('O')) {
        return 'castle';
      }
      if (move.flags.includes('x')) {
        return 'capture';
      }
    }
    
    return 'move';
  };

  const moveType = getMoveType();

  switch (moveType) {
    case 'gameEnd':
      playChessSound('game_end');
      break;
    case 'check':
      playChessSound('check');
      break;
    case 'castle':
      playChessSound('castle');
      break;
    case 'capture':
      playChessSound('capture');
      break;
    case 'move':
    default:
      playChessSound('move_piece');
      break;
  }
}; 