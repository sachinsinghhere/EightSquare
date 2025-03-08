import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {ScreenWrapper} from '../../../shared/components/ScreenWrapper';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {PlayStackParamList} from '../../../navigation/stacks/PlayStack';

type PlayScreenNavigationProp = NativeStackNavigationProp<PlayStackParamList, 'ChooseTimer'>;

interface TimeControl {
  id: string;
  name: string;
  minutes: number;
  increment: number;
}

const TIME_CONTROLS: TimeControl[] = [
  {id: 'bullet1', name: 'Bullet', minutes: 1, increment: 0},
  {id: 'bullet2', name: 'Bullet + 1', minutes: 1, increment: 1},
  {id: 'blitz3', name: 'Blitz 3', minutes: 3, increment: 0},
  {id: 'blitz5', name: 'Blitz 5', minutes: 5, increment: 0},
  {id: 'rapid10', name: 'Rapid 10', minutes: 10, increment: 0},
  {id: 'rapid15', name: 'Rapid 15+10', minutes: 15, increment: 10},
  {id: 'classical30', name: 'Classical', minutes: 30, increment: 0},
];

const ChooseTimerScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<PlayScreenNavigationProp>();
  const [selectedControl, setSelectedControl] = useState<TimeControl | null>(null);

  const handleTimeControlSelect = (control: TimeControl) => {
    setSelectedControl(control);
  };

  const handleStartGame = () => {
    if (selectedControl) {
      navigation.navigate('Game', {
        minutes: selectedControl.minutes,
        increment: selectedControl.increment,
      });
    }
  };

  return (
    <ScreenWrapper title="Choose Time Control" showBack>
      <View
        style={[
          styles.container,
          {backgroundColor: theme.colors.background},
        ]}>
        <ScrollView style={styles.scrollView}>
          <Text style={[styles.header, {color: theme.colors.text}]}>
            Select Time Control
          </Text>
          <View style={styles.timeControlsContainer}>
            {TIME_CONTROLS.map(control => (
              <TouchableOpacity
                key={control.id}
                style={[
                  styles.timeControl,
                  {
                    backgroundColor:
                      selectedControl?.id === control.id
                        ? theme.colors.primary
                        : theme.colors.surface,
                  },
                ]}
                onPress={() => handleTimeControlSelect(control)}>
                <Text
                  style={[
                    styles.timeControlName,
                    {
                      color:
                        selectedControl?.id === control.id
                          ? theme.colors.background
                          : theme.colors.text,
                    },
                  ]}>
                  {control.name}
                </Text>
                <Text
                  style={[
                    styles.timeControlDetails,
                    {
                      color:
                        selectedControl?.id === control.id
                          ? theme.colors.background
                          : theme.colors.text,
                    },
                  ]}>
                  {control.minutes} min {control.increment > 0 ? `+ ${control.increment}s` : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.startButton,
            {
              backgroundColor: selectedControl
                ? theme.colors.primary
                : theme.colors.surface,
            },
          ]}
          onPress={handleStartGame}
          disabled={!selectedControl}>
          <Text
            style={[
              styles.startButtonText,
              {color: selectedControl ? theme.colors.background : theme.colors.text},
            ]}>
            Start Game
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  timeControlsContainer: {
    gap: 12,
  },
  timeControl: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeControlName: {
    fontSize: 18,
    fontWeight: '600',
  },
  timeControlDetails: {
    fontSize: 16,
  },
  startButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChooseTimerScreen; 