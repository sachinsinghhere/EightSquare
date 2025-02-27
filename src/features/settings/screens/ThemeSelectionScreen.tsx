import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {brandThemes, Theme, themeImages} from '../../../shared/theme/theme';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import FourChessSquare from '../components/FourChessSquare';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {textStyles} from '../../../shared/theme/typography';

interface ThemeSelectionScreenProps {
  navigation: {
    goBack: () => void;
  };
}

const ThemeSelectionScreen: React.FC<ThemeSelectionScreenProps> = ({
  navigation,
}) => {
  const {styles} = useStyles(stylesheet);
  const [selectedTheme, setSelectedTheme] = useState(brandThemes.default.ocean);
  const themes = Object.values(brandThemes.default);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('selectedTheme');
      if (storedTheme) {
        setSelectedTheme(JSON.parse(storedTheme));
      }
    };
    loadTheme();
  }, []);
  const {setTheme} = useTheme();

  const handleSelectTheme = async (theme: Theme) => {
    setSelectedTheme(theme);
    setTheme(theme);
    await AsyncStorage.setItem('selectedTheme', JSON.stringify(theme));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={themes}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({item}: {item: Theme}) => (
          <TouchableOpacity onPress={() => handleSelectTheme(item)}>
            <View>
              <Image
                source={themeImages[item.name.toLowerCase()]}
                style={styles.themeImage}
              />
              <View style={styles.themeItemContainer}>
              <Text style={[styles.themeName, {color: item.colors.text}]}>
                {item.name || 'Ocean'}
              </Text>
              <FourChessSquare
                theme={item.name.toLowerCase()}
                black={item.colors.primary}
                white={item.colors.secondary}
              />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
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
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  themeImage: {
    width: '100%',
    height: 100,
  },
  themeName: {
    // ...textStyles.h4,
    fontFamily: 'CormorantGaramond-Bold',
    fontWeight: '700',
    fontSize: 24,
  },
  chessSquareContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chessRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chessSquare: {
    width: 35,
    height: 35,
  },
});

export default ThemeSelectionScreen;
