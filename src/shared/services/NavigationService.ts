import { NavigationContainerRef, StackActions } from '@react-navigation/native';
import { createRef } from 'react';

export const navigationRef = createRef<NavigationContainerRef<any>>();

class NavigationService {
  private static instance: NavigationService;

  private constructor() {}

  public static getInstance(): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService();
    }
    return NavigationService.instance;
  }

  public navigate(name: string, params?: any) {
    if (navigationRef.current) {
      navigationRef.current.navigate(name, params);
    }
  }

  public push(name: string, params?: any) {
    if (navigationRef.current) {
      navigationRef.current.dispatch(StackActions.push(name, params));
    }
  }

  public goBack() {
    if (navigationRef.current) {
      navigationRef.current.goBack();
    }
  }

  public reset(name: string, params?: any) {
    if (navigationRef.current) {
      navigationRef.current.reset({
        index: 0,
        routes: [{ name, params }],
      });
    }
  }

  public getCurrentRoute() {
    if (navigationRef.current) {
      return navigationRef.current.getCurrentRoute();
    }
    return null;
  }
}

export default NavigationService; 