import React, {useCallback, useMemo} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  Text,
  ListRenderItem,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  brandThemes,
  Theme,
  themeChessboardImages,
} from '../../../shared/theme/theme';
import {useTheme} from '../../../shared/theme/ThemeContext';
import ThemeItem from '../components/Theme';
import {ScreenWrapper} from '../../../shared/components/ScreenWrapper';
import Chessboard from 'react-native-chessboard';
import FastImage, {Source} from 'react-native-fast-image';

interface ThemeSelectionScreenProps {
  navigation: {
    goBack: () => void;
  };
}

interface Styles {
  container: ViewStyle;
  listContent: ViewStyle;
  themeCard: ViewStyle;
  board: ViewStyle;
  themeItemContainer: ViewStyle;
  themeName: TextStyle;
  headerText: TextStyle;
  activeTheme: TextStyle;
}

const ThemeSelectionScreen: React.FC<ThemeSelectionScreenProps> = ({
  navigation: _navigation,
}) => {
  const themes = useMemo(() => Object.values(brandThemes.default), []);
  const {theme, setTheme} = useTheme();

  const handleSelectTheme = useCallback(
    (selectedTheme: Theme) => {
      setTheme(selectedTheme);
    },
    [setTheme],
  );

  const renderThemeItem: ListRenderItem<Theme> = useCallback(
    ({item, index}) => (
      <ThemeItem
        item={item}
        index={index}
        currentTheme={theme.name}
        onSelect={handleSelectTheme}
      />
    ),
    [theme.name, handleSelectTheme],
  );

  const {width} = useWindowDimensions();
  const BOARD_SIZE = width * 0.6;

  const ListHeaderComponent = useCallback(() => (
    <>
      <Text style={[styles.headerText, {color: theme.colors.text}]}>
        Board preview
      </Text>
      <View pointerEvents="none" style={[styles.board, {height: BOARD_SIZE}]}>
        <Chessboard
          colors={{
            black: theme.colors.primary,
            white: theme.colors.secondary,
          }}
          renderPiece={piece => (
            <FastImage
              style={{
                width: BOARD_SIZE / 8,
                height: BOARD_SIZE / 8,
              }}
              source={
                themeChessboardImages?.[theme.name.toLowerCase()]?.[piece] as Source
              }
            />
          )}
          boardSize={BOARD_SIZE}
        />
      </View>
      <Text style={[styles.headerText, styles.activeTheme, {color: theme.colors.text}]}>
        {`Active : ${theme.name}`}
      </Text>
    </>
  ), [BOARD_SIZE, theme.colors.primary, theme.colors.secondary, theme.colors.text, theme.name]);

  return (
    <ScreenWrapper title="Theme">
      <FlatList
        data={themes}
        renderItem={renderThemeItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeaderComponent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        windowSize={5}
        maxToRenderPerBatch={5}
        initialNumToRender={4}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  themeCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  board: {
    alignSelf: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 16,
  },
  themeItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  themeName: {
    fontFamily: 'CormorantGaramond-Bold',
    fontSize: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'CormorantGaramond-Bold',
    textAlign: 'center',
    marginTop: 20,
  },
  activeTheme: {
    marginVertical: 16,
  },
});

export default ThemeSelectionScreen;
