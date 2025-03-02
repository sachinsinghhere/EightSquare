import React, {useEffect, memo, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import {Theme, themeImages} from '../../../shared/theme/theme';
import FourChessSquare from '../components/FourChessSquare';
import {useTheme} from '../../../shared/theme/ThemeContext';

const ThemeItem = memo(
  ({
    item,
    index: _index,
    currentTheme,
    onSelect,
  }: {
    item: Theme;
    index: number;
    currentTheme: string;
    onSelect: (theme: Theme) => void;
  }) => {
    const {theme} = useTheme();
    const [isCurrentTheme, setIsCurrentTheme] = useState(currentTheme === item.name);

    useEffect(() => {
      setIsCurrentTheme(currentTheme === item.name);
    }, [currentTheme, item.name]);

    const containerBackgroundColor = `${item.colors.primary}80`
    // const containerBackgroundColor = isCurrentTheme 
    //   ? `${item.colors.primary}95`
    //   : 'rgba(0,0,0,0.2)';

    return (
      <View>
        <TouchableOpacity
          onPress={() => onSelect(item)}
          style={[
            styles.themeCard,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}>
          <Image
            source={themeImages[item.name.toLowerCase()]}
            style={styles.themeImage}
            resizeMode="cover"
          />
          <View
            style={[
              styles.themeItemContainer,
              { backgroundColor: containerBackgroundColor },
            ]}>
            <Text
              style={[
                styles.themeName,
                {
                  // color: isCurrentTheme ? '#FFFFFF' : item.colors.text,
                  color: '#FFFFFF',
                },
              ]}>
              {item.name}
            </Text>
            <View>
              <FourChessSquare
                theme={item.name.toLowerCase()}
                black={item.colors.primary}
                white={item.colors.secondary}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  },
);

export default ThemeItem;

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