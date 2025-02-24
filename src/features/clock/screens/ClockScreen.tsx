import React from 'react';
import { View, Text, Button } from 'react-native';
import {clockStyles} from '../styles/clockStyles';
import { useHomeNavigation } from '../hooks/useHomeNavigation';

type ClockScreenProps = {
  // Add any screen-specific props here
};

const ClockScreen: React.FC<ClockScreenProps> = () => {
  const { navigateToDetails } = useHomeNavigation();

  return (
    <View style={clockStyles.container}>
      <Text style={clockStyles.title}>Clock Screen</Text>
      <Button title="Go to Details" onPress={() => navigateToDetails()} />
    </View>
  );
};

export default ClockScreen; 
