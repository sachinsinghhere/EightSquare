import React from 'react';
import { View, Text, Button } from 'react-native';

const SettingsScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings</Text>
      <Button
        title="Change Theme"
        onPress={() => navigation.navigate('ThemeSelection')}
      />
    </View>
  );
};

export default SettingsScreen;
