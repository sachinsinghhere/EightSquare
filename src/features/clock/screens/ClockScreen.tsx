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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {textStyles, combineStyles} from '../../../shared/theme/typography';

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

const TimeControlCard: React.FC<{
  item: TimeControl;
  index: number;
  onPress: (item: TimeControl) => void;
  scale: Animated.SharedValue<number>;
}> = ({item, index, onPress, scale}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 200)}
      style={[styles.cardContainer, animatedStyle]}
      key={item.name}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(item)}
        activeOpacity={0.9}>
        <Icon name={item.icon} size={32} color="#FFF" />
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ChessClockSelection = () => {
  const navigation = useNavigation();
  const scale = useSharedValue(1);

  const handleTimeControlPress = (timeControl: TimeControl) => {
    scale.value = withSequence(withSpring(0.95), withSpring(1));
    navigation.navigate('ChessTimer', {
      minutes: timeControl.minutes,
      increment: timeControl.increment,
    });
  };

  return (
    <View style={styles.container}>
      <Animated.Text entering={FadeInDown.duration(800)} style={styles.title}>
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
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    ...combineStyles(
      textStyles.h1,
      textStyles.getSecondaryStyle(textStyles.h1)
    ),
    color: '#FFF',
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
    backgroundColor: '#2a2a2a',
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
    color: '#FFF',
    marginTop: 12,
  },
  cardDescription: {
    ...textStyles.bodyMedium,
    color: '#AAA',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ChessClockSelection;
