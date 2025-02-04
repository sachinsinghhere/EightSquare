import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Dimensions, Button} from 'react-native';
import Chessboard, {ChessboardRef} from 'react-native-chessboard';

const {width} = Dimensions.get('window');
const BOARD_SIZE = width - 32; // Full width minus padding

export const ProfileScreen = () => {
  const [fen, setFen] = useState(
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  ); // Initial position

  const chessboardRef = useRef<ChessboardRef>(null);

  const CHESSBOARD_STYLE = {
    Snow: {
      black: '#62B1A8',
      white: '#D9FDF8',
      lastMoveHighlight: 'rgba(255,255,255, 0.5)',
      checkmateHighlight: '#E84855',
      promotionPieceButton: '#FF9B71',
    },
    Sand: {
      black: '#C2B280',
      white: '#F5F5DC',
      lastMoveHighlight: 'rgba(210,180,140, 0.5)',
      checkmateHighlight: '#E84855',
      promotionPieceButton: '#FF9B71',
    },
    Wind: {
      black: '#A8DADC',
      white: '#F1FAEE',
      lastMoveHighlight: 'rgba(233,236,239, 0.5)',
      checkmateHighlight: '#E84855',
      promotionPieceButton: '#FF9B71',
    },
    Casino: {
      black: '#800020',
      white: '#FFD700',
      lastMoveHighlight: 'rgba(255,215,0, 0.5)',
      checkmateHighlight: '#E84855',
      promotionPieceButton: '#FF9B71',
    },
    Night: {
      black: '#000033',
      white: '#000080',
      lastMoveHighlight: 'rgba(25,25,112, 0.5)',
      checkmateHighlight: '#E84855',
      promotionPieceButton: '#FF9B71',
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
      // await chessboardRef.current?.move({from: 'f3', to: 'f7'});
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Chessboard
        ref={chessboardRef}
        // fen={fen}
        onMove={({state}) => {
          console.log(state);
        }}
        colors={CHESSBOARD_STYLE.Snow}
        boardStyle={{
          backgroundColor: 'red',
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
