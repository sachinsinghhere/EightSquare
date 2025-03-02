import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {themeChessboardImages} from '../../../shared/theme/theme';

interface FourChessSquareProps {
  black: string;
  white: string;
  theme: string;
}

const FourChessSquare: React.FC<FourChessSquareProps> = ({
  black,
  white,
  theme,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.chessRow}>
        <View style={[styles.chessSquare, {backgroundColor: black}]}>
          <Image
            source={themeChessboardImages[theme]?.blackRook}
            style={styles.chessPiece}
          />
        </View>
        <View style={[styles.chessSquare, {backgroundColor: white}]}>
          <Image
            source={themeChessboardImages[theme]?.blackKnight}
            style={styles.chessPiece}
          />
        </View>
      </View>
      <View style={styles.chessRow}>
        <View style={[styles.chessSquare, {backgroundColor: white}]}>
          <Image
            source={themeChessboardImages[theme]?.blackBishop}
            style={styles.chessPiece}
          />
        </View>
        <View style={[styles.chessSquare, {backgroundColor: black}]}>
          <Image
            source={themeChessboardImages[theme]?.blackQueen}
            style={styles.chessPiece}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chessRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chessSquare: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chessPiece: {
    width: 15,
    height: 15,
  },
});

export default FourChessSquare;
