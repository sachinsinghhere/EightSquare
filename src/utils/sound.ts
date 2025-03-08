import SoundPlayer from 'react-native-sound-player';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export const Sounds = {
  move: require('../assets/sound/movePiece.mp3'),
  capture: require('../assets/sound/capture.mp3'),
  check: require('../assets/sound/check.mp3'),
  castle: require('../assets/sound/castle.mp3'),
  gameEnd: require('../assets/sound/gameEnd.mp3'),
};

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

interface ChessMoveSound {
  _from: string;
  _to: string;
  isCapture?: boolean;
  isCheck?: boolean;
  isCastle?: boolean;
  isGameEnd?: boolean;
}

export const playChessSound = async (
  soundType: keyof typeof Sounds,
  withHaptic: boolean = true,
) => {
  try {
    // Play haptic feedback
    if (withHaptic) {
      ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
    }

    // Play sound
    await SoundPlayer.playSoundFile(Sounds[soundType], 'mp3');
  } catch (error) {
    console.warn('Error playing sound:', error);
  }
};

export const playMoveSound = ({
  _from,
  _to,
  isCapture = false,
  isCheck = false,
  isCastle = false,
  isGameEnd = false,
}: ChessMoveSound) => {
  if (isGameEnd) {
    playChessSound('gameEnd');
  } else if (isCheck) {
    playChessSound('check');
  } else if (isCastle) {
    playChessSound('castle');
  } else if (isCapture) {
    playChessSound('capture');
  } else {
    playChessSound('move');
  }
}; 