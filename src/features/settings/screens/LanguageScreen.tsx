import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../../shared/components/ScreenWrapper';
import { useTheme } from '../../../shared/theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const LanguageScreen = () => {
  const { theme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
  ];

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
    // TODO: Implement language change logic
  };

  return (
    <ScreenWrapper title="Language">
      <View style={styles.container}>
        <Text style={[styles.description, { color: theme.colors.text, fontFamily: 'Roboto-Regular' }]}>
          Select your preferred language for the app interface. This will change all text and notifications.
        </Text>

        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageItem,
              { backgroundColor: theme.colors.card },
              selectedLanguage === language.code && { borderColor: theme.colors.primary, borderWidth: 2 },
            ]}
            onPress={() => handleLanguageSelect(language.code)}
          >
            <View style={styles.languageInfo}>
              <Text style={[styles.languageName, { color: theme.colors.text, fontFamily: 'CormorantGaramond-Medium' }]}>
                {language.name}
              </Text>
              <Text style={[styles.nativeName, { color: theme.colors.text, fontFamily: 'Roboto-Regular' }]}>
                {language.nativeName}
              </Text>
            </View>
            {selectedLanguage === language.code && (
              <Icon name="check" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        ))}

        <Text style={[styles.note, { color: theme.colors.text, fontFamily: 'Roboto-Regular' }]}>
          More languages will be added in future updates.
        </Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    marginBottom: 2,
  },
  nativeName: {
    fontSize: 13,
    opacity: 0.8,
  },
  note: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 24,
  },
});

export default LanguageScreen; 