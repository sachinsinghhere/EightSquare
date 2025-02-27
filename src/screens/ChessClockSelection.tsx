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
import { useTheme } from '../shared/theme/ThemeContext';
import Animated, { FadeIn } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { textStyles, combineStyles } from '../shared/theme/typography';

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
  const {theme} = useTheme();
  const [customTime, setCustomTime] = useState(10);
  const [customIncrement, setCustomIncrement] = useState(0);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('minutes');

  const getMaxTime = (unit: TimeUnit) => {
    switch (unit) {
      case 'hours':
        return 4;
      case 'minutes':
        return 240;
    }
  };

  const convertToMinutes = (value: number, unit: TimeUnit) => {
    switch (unit) {
      case 'hours':
        return value * 60;
      case 'minutes':
        return value;
    }
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
      style={[styles.timeOption, { backgroundColor: theme.colors.background }]}
      onPress={() => handleTimeSelect(option.minutes, option.increment)}
    >
      <Text style={[styles.timeOptionText, { color: theme.colors.text }]}>{option.display}</Text>
    </TouchableOpacity>
  );

  const renderSection = (section: TimeSection) => (
    <Animated.View 
      key={section.title}
      entering={FadeIn}
      style={styles.section}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEmoji}>{section.emoji}</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{section.title}</Text>
        {section.subtitle && (
          <Text style={[styles.sectionSubtitle, { color: theme.colors.text }]}>{section.subtitle}</Text>
        )}
      </View>
      <View style={styles.optionsGrid}>
        {section.options.map(renderTimeOption)}
      </View>
    </Animated.View>
  );

  const renderUnitSelector = () => (
    <View style={styles.unitSelector}>
      <TouchableOpacity
        style={[
          styles.unitOption,
          timeUnit === 'minutes' && { backgroundColor: theme.colors.primary },
        ]}
        onPress={() => setTimeUnit('minutes')}
      >
        <Text style={[
          styles.unitText,
          { color: timeUnit === 'minutes' ? theme.colors.background : theme.colors.text },
        ]}>min</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.unitOption,
          timeUnit === 'hours' && { backgroundColor: theme.colors.primary },
        ]}
        onPress={() => setTimeUnit('hours')}
      >
        <Text style={[
          styles.unitText,
          { color: timeUnit === 'hours' ? theme.colors.background : theme.colors.text },
        ]}>hr</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Time Control</Text>
      {timeSections.map(renderSection)}
      
      <Animated.View 
        entering={FadeIn}
        style={styles.section}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEmoji}>⚙️</Text>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Custom</Text>
        </View>
        <View style={[styles.customSection, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.customLabel, { color: theme.colors.text }]}>
            Initial Time: {customTime} {timeUnit}
          </Text>
          {renderUnitSelector()}
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
            Increment (seconds): {customIncrement}
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
            style={[styles.selectButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleCustomTimeSelect}
          >
            <Text style={[styles.selectButtonText, { color: theme.colors.background }]}>Start Game</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    ...combineStyles(
      textStyles.h2,
      textStyles.getSecondaryStyle(textStyles.h2)
    ),
    textAlign: 'center',
    marginVertical: 20,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionEmoji: {
    ...textStyles.h3,
    marginRight: 8,
  },
  sectionTitle: {
    ...textStyles.h4,
  },
  sectionSubtitle: {
    ...textStyles.caption,
    marginLeft: 8,
    alignSelf: 'flex-end',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: (width - 48) / 3,
    alignItems: 'center',
  },
  timeOptionText: {
    ...textStyles.bodyMedium,
  },
  customSection: {
    padding: 16,
    borderRadius: 12,
  },
  customLabel: {
    ...textStyles.bodyMedium,
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 16,
  },
  unitSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  unitOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  unitText: {
    ...textStyles.caption,
  },
  selectButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  selectButtonText: {
    ...textStyles.button,
  },
});

export default ChessClockSelection; 