import React, {useEffect, useCallback} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {brandThemes, Theme} from '../../../shared/theme/theme';
import {useTheme} from '../../../shared/theme/ThemeContext';
import ThemeItem from '../components/Theme';
import { ScreenWrapper } from '../../../shared/components/ScreenWrapper';

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
      navigation.goBack();
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

  return (
    <ScreenWrapper title="Theme">
      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <FlatList
          data={themes}
          showsVerticalScrollIndicator={false}
          renderItem={renderThemeItem}
          contentContainerStyle={styles.listContent}
        />
      </View>
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
  themeImage: {
    width: '100%',
    height: 180,
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
