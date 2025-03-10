/**
 * @format
 * Application entry point
 * Registers the main App component with React Native
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
