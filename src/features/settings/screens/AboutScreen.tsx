import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Linking } from 'react-native';
import { ScreenWrapper } from '../../../shared/components/ScreenWrapper';
import { useTheme } from '../../../shared/theme/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppImages } from '../../../assets';

// Create a wrapper component for the Icon to fix TypeScript issues
const IconWrapper = ({ name, size, color, style }: any) => (
  <MaterialCommunityIcons name={name} size={size} color={color} style={style} />
);

const AboutScreen = () => {
  const { theme } = useTheme();

  const appVersion = '1.0.0';
  const inspirationalMessage = `"Chess is not just about kings, queens, and pawns; it's about making smart decisions, learning from mistakes, and growing stronger with every move. Like the game itself, life rewards those who think ahead, stay patient, and never stop learning."`;

  const features = [
    'Interactive chess training modules',
    'Vision training exercises',
    'Blind chess practice',
    'Tactical puzzles collection',
    'Beautiful, customizable themes',
    'Cross-platform compatibility',
  ];

  const credits = [
    {
      name: 'Lichess.org',
      url: 'https://lichess.org/',
      description: 'Free and open-source chess platform',
    },
    {
      name: 'Chess.com',
      url: 'https://www.chess.com/',
      description: 'World\'s leading online chess platform',
    },
    {
      name: 'js-chess-engine',
      url: 'https://www.npmjs.com/package/js-chess-engine',
      description: 'Chess engine for move validation and AI',
    },
    {
      name: 'chess.js',
      url: 'https://www.npmjs.com/package/chess.js/v/0.13.0',
      description: 'Chess game logic and move validation library',
    },
  ];

  return (
    <ScreenWrapper title="About">
      <ScrollView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={AppImages.infinity}
            style={styles.logo}
            resizeMode="contain"
            tintColor={theme.colors.primary}
          />
          <Text
            style={[
              styles.appName,
              {color: theme.colors.text, fontFamily: 'CormorantGaramond-Bold'},
            ]}>
            EightSquare
          </Text>
          <Text
            style={[
              styles.version,
              {color: theme.colors.text, fontFamily: 'Roboto-Regular'},
            ]}>
            Version {appVersion}
          </Text>
        </View>

        <View style={[styles.section, {backgroundColor: theme.colors.card}]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                fontFamily: 'CormorantGaramond-Medium',
              },
            ]}>
            Our Vision
          </Text>
          <Text
            style={[
              styles.inspirationalText,
              {color: theme.colors.text, fontFamily: 'Roboto-Regular'},
            ]}>
            {inspirationalMessage}
          </Text>
        </View>

        <View style={[styles.section, {backgroundColor: theme.colors.card}]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                fontFamily: 'CormorantGaramond-Medium',
              },
            ]}>
            Features
          </Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <IconWrapper
                name="check-circle"
                size={20}
                color={theme.colors.primary}
                style={styles.featureIcon}
              />
              <Text
                style={[
                  styles.featureText,
                  {color: theme.colors.text, fontFamily: 'Roboto-Regular'},
                ]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.section, {backgroundColor: theme.colors.card}]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                fontFamily: 'CormorantGaramond-Medium',
              },
            ]}>
            Credits
          </Text>
          <Text
            style={[
              styles.creditDescription,
              {color: theme.colors.text, fontFamily: 'Roboto-Regular'},
            ]}>
            EightSquare is built upon the following amazing platforms and libraries:
          </Text>
          {credits.map((credit, index) => (
            <View key={index} style={styles.creditItem}>
              <IconWrapper
                name="star"
                size={16}
                color={theme.colors.primary}
                style={styles.creditIcon}
              />
              <View style={styles.creditContent}>
                <Text
                  style={[
                    styles.link,
                    {color: theme.colors.primary, fontFamily: 'Roboto-Regular'},
                  ]}
                  onPress={() => Linking.openURL(credit.url)}>
                  {credit.name}
                </Text>
                <Text
                  style={[
                    styles.creditText,
                    {color: theme.colors.text, fontFamily: 'Roboto-Regular'},
                  ]}>
                  {credit.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.section, {backgroundColor: theme.colors.card}]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                fontFamily: 'CormorantGaramond-Medium',
              },
            ]}>
            Connect With Us
          </Text>
          <Text
            style={[
              styles.link,
              {color: theme.colors.primary, fontFamily: 'Roboto-Regular'},
            ]}
            onPress={() =>
              Linking.openURL(
                'https://github.com/sachinsinghhere/EightSquare.git ',
              )
            }>
            GitHub Repository
          </Text>
          <Text
            style={[
              styles.link,
              {color: theme.colors.primary, fontFamily: 'Roboto-Regular'},
            ]}
            onPress={() => Linking.openURL('mailto:ssingh250999@gmail.com')}>
            Contact Support
          </Text>
        </View>

        <Text
          style={[
            styles.copyright,
            {color: theme.colors.text, fontFamily: 'Roboto-Regular'},
          ]}>
          © 2024 EightSquare. All rights reserved.
        </Text>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    opacity: 0.7,
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  inspirationalText: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  link: {
    fontSize: 14,
    marginBottom: 8,
    textDecorationLine: 'underline',
  },
  copyright: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 24,
    opacity: 0.7,
  },
  creditDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  creditItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  creditIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  creditContent: {
    flex: 1,
  },
  creditText: {
    fontSize: 12,
    opacity: 0.8,
  },
});

export default AboutScreen; 