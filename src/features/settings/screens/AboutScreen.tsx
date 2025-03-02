import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Linking } from 'react-native';
import { ScreenWrapper } from '../../../shared/components/ScreenWrapper';
import { useTheme } from '../../../shared/theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

  return (
    <ScreenWrapper title="About">
      <ScrollView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/images/themeBgs/bubblegum.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: theme.colors.text, fontFamily: 'CormorantGaramond-Bold' }]}>
            EightSquare
          </Text>
          <Text style={[styles.version, { color: theme.colors.text, fontFamily: 'Roboto-Regular' }]}>
            Version {appVersion}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: 'CormorantGaramond-Medium' }]}>
            Our Vision
          </Text>
          <Text style={[styles.inspirationalText, { color: theme.colors.text, fontFamily: 'Roboto-Regular' }]}>
            {inspirationalMessage}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: 'CormorantGaramond-Medium' }]}>
            Features
          </Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Icon name="check-circle" size={20} color={theme.colors.primary} style={styles.featureIcon} />
              <Text style={[styles.featureText, { color: theme.colors.text, fontFamily: 'Roboto-Regular' }]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: 'CormorantGaramond-Medium' }]}>
            Connect With Us
          </Text>
          <Text
            style={[styles.link, { color: theme.colors.primary, fontFamily: 'Roboto-Regular' }]}
            onPress={() => Linking.openURL('https://github.com/yourusername/eightsquare')}
          >
            GitHub Repository
          </Text>
          <Text
            style={[styles.link, { color: theme.colors.primary, fontFamily: 'Roboto-Regular' }]}
            onPress={() => Linking.openURL('mailto:support@eightsquare.com')}
          >
            Contact Support
          </Text>
        </View>

        <Text style={[styles.copyright, { color: theme.colors.text, fontFamily: 'Roboto-Regular' }]}>
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
});

export default AboutScreen; 