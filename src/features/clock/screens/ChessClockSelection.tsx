/**
 * Chess Clock Selection Screen
 * Allows users to select time controls for chess games
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../shared/theme/ThemeContext';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { textStyles } from '../../../shared/theme/typography';
import { ScreenWrapper } from '../../../shared/components/ScreenWrapper';

const { width } = Dimensions.get('window');

interface TimeOption {
  minutes: number;
  increment: number;
  display: string;
}

interface TimeSection {
  title: string;
  emoji: string;
  subtitle?: string;
  options: TimeOption[];
}

type TimeUnit = 'minutes' | 'hours';

const timeSections: TimeSection[] = [
  {
    title: 'Bullet',
    emoji: '🚀',
    options: [
      { minutes: 1, increment: 0, display: '1 min' },
      { minutes: 1, increment: 1, display: '1 | 1' },
      { minutes: 2, increment: 1, display: '2 | 1' },
    ]
  },
  {
    title: 'Blitz',
    emoji: '⚡️',
    options: [
      { minutes: 3, increment: 0, display: '3 min' },
      { minutes: 3, increment: 2, display: '3 | 2' },
      { minutes: 5, increment: 0, display: '5 min' },
      { minutes: 5, increment: 5, display: '5 | 5' },
      { minutes: 5, increment: 2, display: '5 | 2' },
    ]
  },
  {
    title: 'Rapid',
    emoji: '⏰',
    options: [
      { minutes: 10, increment: 0, display: '10 min' },
      { minutes: 15, increment: 10, display: '15 | 10' },
      { minutes: 30, increment: 0, display: '30 min' },
      { minutes: 10, increment: 5, display: '10 | 5' },
      { minutes: 20, increment: 0, display: '20 min' },
      { minutes: 60, increment: 0, display: '60 min' },
    ]
  },
];

const ChessClockSelection = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [customTime, setCustomTime] = useState(10);
  const [customIncrement, setCustomIncrement] = useState(0);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('minutes');

  const getMaxTime = (unit: TimeUnit) => {
    return unit === 'hours' ? 4 : 240;
  };

  const convertToMinutes = (value: number, unit: TimeUnit) => {
    return unit === 'hours' ? value * 60 : value;
  };

  const handleTimeSelect = (minutes: number, increment: number) => {
    navigation.navigate('ChessTimer', { minutes, increment });
  };

  const handleCustomTimeSelect = () => {
    const minutes = convertToMinutes(customTime, timeUnit);
    handleTimeSelect(minutes, customIncrement);
  };

  const renderTimeOption = (option: TimeOption) => (
    <TouchableOpacity
      key={option.display}
      style={[
        styles.timeOption,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={() => handleTimeSelect(option.minutes, option.increment)}
    >
      <Text style={[styles.timeOptionText, { color: theme.colors.text }]}>{option.display}</Text>
    </TouchableOpacity>
  );

  const renderSection = (section: TimeSection, index: number) => (
    <Animated.View
      key={section.title}
      entering={FadeInDown.delay(index * 100).springify()}
      style={styles.section}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEmoji}>{section.emoji}</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{section.title}</Text>
      </View>
      <View style={styles.optionsGrid}>
        {section.options.map(renderTimeOption)}
      </View>
    </Animated.View>
  );

  return (
    <ScreenWrapper title="Time Control" showBack={false}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {timeSections.map((section, index) => renderSection(section, index))}

        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={[
            styles.customSection,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>⚙️</Text>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Custom</Text>
          </View>

          <View style={styles.customContent}>
            <Text style={[styles.customLabel, { color: theme.colors.text }]}>
              Initial Time: {customTime} {timeUnit}
            </Text>
            <View style={styles.unitSelector}>
              {(['minutes', 'hours'] as TimeUnit[]).map(unit => (
                <TouchableOpacity
                  key={unit}
                  style={[
                    styles.unitOption,
                    {
                      backgroundColor:
                        timeUnit === unit
                          ? theme.colors.primary
                          : theme.colors.surface,
                    },
                  ]}
                  onPress={() => setTimeUnit(unit)}
                >
                  <Text
                    style={[
                      styles.unitText,
                      {
                        color:
                          timeUnit === unit
                            ? theme.colors.background
                            : theme.colors.text,
                      },
                    ]}
                  >
                    {unit === 'minutes' ? 'min' : 'hr'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={getMaxTime(timeUnit)}
              value={customTime}
              onValueChange={(value) => setCustomTime(Math.round(value))}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.border}
              thumbTintColor={theme.colors.primary}
            />

            <Text style={[styles.customLabel, { color: theme.colors.text }]}>
              Increment: {customIncrement} seconds
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={60}
              value={customIncrement}
              onValueChange={(value) => setCustomIncrement(Math.round(value))}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.border}
              thumbTintColor={theme.colors.primary}
            />

            <TouchableOpacity
              style={[
                styles.startButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={handleCustomTimeSelect}
            >
              <Text
                style={[
                  styles.startButtonText,
                  { color: theme.colors.background },
                ]}
              >
                Start Game
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  sectionTitle: {
    ...textStyles.h4,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -4,
  },
  timeOption: {
    width: (width - 48) / 3,
    height: 48,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  timeOptionText: {
    ...textStyles.button,
  },
  customSection: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  customContent: {
    padding: 16,
  },
  customLabel: {
    ...textStyles.bodyMedium,
    marginBottom: 8,
  },
  unitSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  unitOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  unitText: {
    ...textStyles.button,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 16,
  },
  startButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 8,
  },
  startButtonText: {
    ...textStyles.button,
  },
});

export default ChessClockSelection; 