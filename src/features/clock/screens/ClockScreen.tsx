import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  FadeInDown,
  FadeInUp,
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {textStyles, combineStyles} from '../../../shared/theme/typography';
import {useTheme} from '../../../shared/theme/ThemeContext';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {PlayStackParamList} from '../../../navigation/stacks/PlayStack';

const {width} = Dimensions.get('window');

interface TimeControl {
  name: string;
  minutes: number;
  increment: number;
  icon: string;
  description: string;
}

const timeControls: TimeControl[] = [
  {
    name: 'Bullet',
    minutes: 1,
    increment: 0,
    icon: 'lightning-bolt',
    description: '1 minute per player',
  },
  {
    name: 'Blitz',
    minutes: 3,
    increment: 2,
    icon: 'timer-sand',
    description: '3 minutes + 2 seconds increment',
  },
  {
    name: 'Rapid',
    minutes: 10,
    increment: 5,
    icon: 'clock-outline',
    description: '10 minutes + 5 seconds increment',
  },
  {
    name: 'Classical',
    minutes: 30,
    increment: 10,
    icon: 'chess-king',
    description: '30 minutes + 10 seconds increment',
  },
];

type ChessClockNavigationProp = NativeStackNavigationProp<PlayStackParamList, 'ChooseTimer'>;

const TimeControlCard: React.FC<{
  item: TimeControl;
  index: number;
  onPress: (item: TimeControl) => void;
  scale: Animated.SharedValue<number>;
  isSelected: boolean;
}> = ({item, index, onPress, scale, isSelected}) => {
  const {theme} = useTheme();
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 200)}
      style={[styles.cardContainer, animatedStyle]}
      key={item.name}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
          },
        ]}
        onPress={() => onPress(item)}
        activeOpacity={0.9}>
        <MaterialCommunityIcons
          name={item.icon}
          size={32}
          color={isSelected ? theme.colors.background : theme.colors.text}
        />
        <Text
          style={[
            styles.cardTitle,
            {color: isSelected ? theme.colors.background : theme.colors.text},
          ]}>
          {item.name}
        </Text>
        <Text
          style={[
            styles.cardDescription,
            {color: isSelected ? theme.colors.background : theme.colors.secondary},
          ]}>
          {item.description}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ChessClockSelection = () => {
  const navigation = useNavigation<ChessClockNavigationProp>();
  const {theme} = useTheme();
  const scale = useSharedValue(1);
  const [selectedControl, setSelectedControl] = React.useState<TimeControl | null>(null);

  const handleTimeControlPress = (timeControl: TimeControl) => {
    scale.value = withSequence(withSpring(0.95), withSpring(1));
    setSelectedControl(timeControl);
    navigation.navigate('Game', {
      minutes: timeControl.minutes,
      increment: timeControl.increment,
    });
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Animated.Text
        entering={FadeInDown.duration(800)}
        style={[styles.title, {color: theme.colors.text}]}>
        Select Time Control
      </Animated.Text>
      <View style={styles.cardsContainer}>
        {timeControls.map((control, index) => (
          <TimeControlCard
            key={control.name}
            item={control}
            index={index}
            onPress={handleTimeControlPress}
            scale={scale}
            isSelected={selectedControl?.name === control.name}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    ...combineStyles(textStyles.h1, textStyles.getSecondaryStyle(textStyles.h1)),
    marginBottom: 30,
    textAlign: 'center',
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
  },
  cardContainer: {
    width: width - 40,
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cardTitle: {
    ...textStyles.h3,
    marginTop: 12,
  },
  cardDescription: {
    ...textStyles.bodyMedium,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ChessClockSelection;
