import FastImage from 'react-native-fast-image';

import { StyleSheet, View } from 'react-native'
import React from 'react'
import Chessboard, {
  ChessboardRef,
  ChessboardProps,
} from 'react-native-chessboard';
import {useTheme} from '../theme/ThemeContext';
import { themeChessboardImages } from '../theme/theme';

interface ESChessboardProps extends Omit<ChessboardProps, 'renderPiece'> {
  boardRef?: React.RefObject<ChessboardRef>;
  boardSize: number;
}

const ESChessboard = ({boardRef, boardSize, ...rest} : ESChessboardProps) => {
  const {theme} = useTheme();
  return (
    <View style={[styles.board, {backgroundColor: theme.colors.background,height: boardSize,width: boardSize}]}>
      <Chessboard
        ref={boardRef}
        colors={{
          black: theme.colors.primary,
          white: theme.colors.secondary,
        }}
        boardSize={boardSize}
        renderPiece={piece => (
          <FastImage
            style={{
              width: boardSize / 8,
              height: boardSize / 8,
            }}
            source={themeChessboardImages?.[theme.name.toLowerCase()]?.[piece]}
          />
        )}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default ESChessboard
