import React, {useEffect, useCallback, useRef} from 'react';
import {View, FlatList, StyleSheet, useWindowDimensions, Image, ScrollView, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {brandThemes, Theme, themeChessboardImages} from '../../../shared/theme/theme';
import {useTheme} from '../../../shared/theme/ThemeContext';
import ThemeItem from '../components/Theme';
import { ScreenWrapper } from '../../../shared/components/ScreenWrapper';
import Chessboard from 'react-native-chessboard';
import FastImage from 'react-native-fast-image';
interface ThemeSelectionScreenProps {
  navigation: {
    goBack: () => void;
  };
}



const ThemeSelectionScreen: React.FC<ThemeSelectionScreenProps> = ({
  navigation,
}) => {
  const themes = Object.values(brandThemes.default);
  const {theme, setTheme} = useTheme();
   const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('selectedTheme');
        if (storedTheme) {
          const parsedTheme = JSON.parse(storedTheme);
          setTheme(parsedTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, [setTheme]);

  const handleSelectTheme = useCallback(async (selectedTheme: Theme) => {
    try {
      await AsyncStorage.setItem('selectedTheme', JSON.stringify(selectedTheme));
      setTheme(selectedTheme);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      // navigation.goBack();
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, [setTheme]);

  const renderThemeItem = useCallback(({item, index}: {item: Theme; index: number}) => (
    <ThemeItem
      item={item}
      index={index}
      currentTheme={theme.name}
      onSelect={handleSelectTheme}
    />
  ), [theme.name]);

  const {width, height} = useWindowDimensions();
  const BOARD_SIZE = width * 0.60;


  return (
    <ScreenWrapper title="Theme">
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
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
                source={themeChessboardImages?.[theme.name.toLowerCase()]?.[piece]}
              />
            )}
            boardSize={BOARD_SIZE}
          />
        </View>

        <View
          style={[
            styles.container
          ]}>
          <FlatList
            scrollEnabled={false}
            data={themes}
            showsVerticalScrollIndicator={false}
            renderItem={renderThemeItem}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
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
    alignSelf:'center',
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
});

export default ThemeSelectionScreen;
