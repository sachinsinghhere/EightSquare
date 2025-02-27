import React from 'react';
import {Image, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {themeChessboardImages} from '../../../shared/theme/theme';
import {textStyles} from '../../../shared/theme/typography';

const FourChessSquare = ({black, white, theme}: {black: string; white: string; theme: string}) => {
  const activeThemeChessboardImages = themeChessboardImages[theme];
  const {styles} = useStyles(stylesheet);
  return (
    <View style={styles.chessSquareContainer}>
      <View style={styles.chessRow}>
        <View style={[styles.chessSquare, {backgroundColor: black}]}>
          <Image style={styles.chessPiece} source={activeThemeChessboardImages.bb} />
        </View>
        <View style={[styles.chessSquare, {backgroundColor: white}]}>
          <Image style={styles.chessPiece} source={activeThemeChessboardImages.wp} />
        </View>
      </View>
      <View style={styles.chessRow}>
        <View style={[styles.chessSquare, {backgroundColor: white}]}>
          <Image style={styles.chessPiece} source={activeThemeChessboardImages.wp} />
        </View>
        <View style={[styles.chessSquare, {backgroundColor: black}]}>
          <Image style={styles.chessPiece} source={activeThemeChessboardImages.bn} />
        </View>
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet({
  container: {
    flex: 1,
  },
  themeItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeImage: {
    width: '100%',
    height: 100,
  },
  themeName: {
    position: 'absolute',
    top: 0,
    left: 0,
    ...textStyles.h4,
    padding: 10,
  },
  chessSquareContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    overflow: 'hidden',
  },
  chessRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chessSquare: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chessPiece: {
    width: 25,
    height: 25,
  },
});

export default FourChessSquare;
