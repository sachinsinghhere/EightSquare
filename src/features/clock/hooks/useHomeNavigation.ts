import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/routes';
import { ROUTES } from '../../../navigation/routes';
import { useCallback } from 'react';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useHomeNavigation = () => {
  const navigation = useNavigation<NavigationProp>();

  const navigateToDetails = useCallback((id: string = '123') => {
    navigation.navigate(ROUTES.DETAILS, { id });
  }, [navigation]);

  return {
    navigateToDetails,
  };
}; 