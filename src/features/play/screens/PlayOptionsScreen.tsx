import React, {useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  Animated,
} from 'react-native';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {ScreenWrapper} from '../../../shared/components/ScreenWrapper';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {PlayStackParamList} from '../../../navigation/stacks/PlayStack';
import {AppImages} from '../../../assets';
import {textStyles} from '../../../shared/theme/typography';

type PlayScreenNavigationProp = NativeStackNavigationProp<
  PlayStackParamList,
  'PlayOptions'
>;

const PlayOptionsScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<PlayScreenNavigationProp>();
  const {width} = useWindowDimensions();

  // Animation values
  const animationValues = useMemo(
    () => ({
      logoScale: new Animated.Value(0),
      titleOpacity: new Animated.Value(0),
      buttonsTranslateY: new Animated.Value(50),
      buttonsOpacity: new Animated.Value(0),
    }),
    [],
  );

  useEffect(() => {
    const {logoScale, titleOpacity, buttonsTranslateY, buttonsOpacity} =
      animationValues;

    // Sequence of animations
    Animated.sequence([
      // Logo scale animation
      Animated.spring(logoScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      // Title fade in
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Buttons slide up and fade in
      Animated.parallel([
        Animated.timing(buttonsTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [animationValues]);

  const handlePlayWithFriend = () => {
    navigation.navigate('ChooseTimer',{playWithFriend: true});
  };

  const handlePlayWithAI = () => {
    navigation.navigate('AIPersona');
  };

  return (
    <ScreenWrapper title="Play Chess" showHeader={false}>
      <View
        style={[styles.container]}>
        <View style={styles.logoContainer}>
          <Animated.View
            style={[{transform: [{scale: animationValues.logoScale}]}]}>
            <Image
              source={AppImages.infinity}
              tintColor={theme.colors.text}
              style={[styles.logo, {width: width * 0.25, height: width * 0.25}]}
              resizeMode="contain"
            />
          </Animated.View>
          <Animated.Text
            style={[
              styles.title,
              textStyles.h1,
              textStyles.getSecondaryStyle(textStyles.h1),
              {color: theme.colors.text, opacity: animationValues.titleOpacity},
            ]}>
            Eight Square
          </Animated.Text>
          <Animated.Text
            style={[
              styles.subtitle,
              textStyles.bodyLarge,
              {color: theme.colors.text, opacity: animationValues.titleOpacity},
            ]}>
            Choose Your Challenge
          </Animated.Text>
        </View>

        <Animated.View
          style={[
            styles.optionsContainer,
            {
              transform: [{translateY: animationValues.buttonsTranslateY}],
              opacity: animationValues.buttonsOpacity,
            },
          ]}>
          <TouchableOpacity
            style={[styles.option, {backgroundColor: theme.colors.primary}]}
            onPress={handlePlayWithFriend}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.optionText,
                textStyles.button,
                {color: theme.colors.background},
              ]}>
              Play with a Friend
            </Text>
            <Text
              style={[
                styles.optionSubtext,
                textStyles.caption,
                {color: theme.colors.background},
              ]}>
              Challenge a friend to a local match
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              styles.aiOption,
              {backgroundColor: theme.colors.secondary},
            ]}
            onPress={handlePlayWithAI}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.optionText,
                textStyles.button,
                {color: theme.colors.background},
              ]}>
              Play with AI
            </Text>
            <Text
              style={[
                styles.optionSubtext,
                textStyles.caption,
                {color: theme.colors.background},
              ]}>
              Test your skills against artificial intelligence
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 16,
  },
  logo: {
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  optionsContainer: {
    width: '100%',
    paddingHorizontal: 16,
    gap: 20,
  },
  option: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  aiOption: {
    shadowColor: '#000',
  },
  optionText: {
    marginBottom: 4,
  },
  optionSubtext: {
    opacity: 0.9,
    textAlign: 'center',
  },
});

export default PlayOptionsScreen;
