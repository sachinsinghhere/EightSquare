import { View, StyleSheet } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';

interface LoaderProps {
  visible: boolean;
  style?: object;
  animationSource?: any;
}

const Loader: React.FC<LoaderProps> = ({ visible, style, animationSource }) => {
  if (!visible) return null;

  return (
    <View style={[styles.container, style]}>
      <LottieView
        source={animationSource || require('../../assets/lotties/chess_loader.json')}
        style={styles.loader}
        autoPlay
        loop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  loader: {
    width: 200,
    height: 200,
  },
});

export default Loader