import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Dimensions, Button, Image} from 'react-native';
import Chessboard, {ChessboardRef} from 'react-native-chessboard';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {themeChessboardImages} from '../../../shared/theme/theme';

const {width} = Dimensions.get('window');
const BOARD_SIZE = width - 32; // Full width minus padding

export const PlayScreen: React.FC = () => {
  const chessboardRef = useRef<ChessboardRef>(null);
  const {theme} = useTheme();

  const CHESSBOARD_STYLE = {
    Snow: {
      black: theme.colors.primary,
      white: theme.colors.secondary,
      lastMoveHighlight: 'rgba(255,255,255, 0.2)',
      checkmateHighlight: theme.colors.error,
      promotionPieceButton: theme.colors.success,
    },
  };

  useEffect(() => {
    (async () => {
      await chessboardRef.current?.move({from: 'e2', to: 'e4'});
      await chessboardRef.current?.move({from: 'e7', to: 'e5'});
      await chessboardRef.current?.move({from: 'd1', to: 'f3'});
      await chessboardRef.current?.move({from: 'a7', to: 'a6'});
      await chessboardRef.current?.move({from: 'f1', to: 'c4'});
      await chessboardRef.current?.move({from: 'a6', to: 'a5'});
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Chessboard
        ref={chessboardRef}
        // fen={fen}
        onMove={({state}: {state: any}) => {
          console.log(state);
        }}
        renderPiece={(piece) => {
          console.log('piece', piece);
          return (
            <Image
              style={{
                width: BOARD_SIZE / 8,
                height: BOARD_SIZE / 8,
              }}
              source={themeChessboardImages[theme.name.toLowerCase()][piece]}
            />
          );
        }}
        colors={CHESSBOARD_STYLE.Snow}
        boardStyle={{
          backgroundColor: theme.colors.background,
          width: BOARD_SIZE,
          height: BOARD_SIZE,
        }}
      />
      <Button
        title="RESET"
        onPress={() => {
          chessboardRef?.current?.resetBoard();
        }}
      />
      <Button title="NEXT" onPress={() => {}} />
      <Button
        title="PREV"
        onPress={() => {
          chessboardRef?.current?.undo();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
