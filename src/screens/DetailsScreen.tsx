import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../constants/routes';
import { ROUTES } from '../constants/routes';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, typeof ROUTES.DETAILS>;

export const DetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<DetailsScreenRouteProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details Screen</Text>
      <Text>ID: {route.params.id}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
}); 