import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../shared/theme/ThemeContext'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { TrainStackParamList } from '../../../navigation/types'
import { ScreenWrapper } from '../../../shared/components/ScreenWrapper'


const VisionTrainingScreen = () => {
  const { theme } = useTheme()
  const navigation = useNavigation<NativeStackNavigationProp<TrainStackParamList>>()

  const modes = [
    {
      title: 'Piece Movement',
      description: 'Practice moving pieces to specific squares',
      icon: '♟️',
      mode: 'pieces' as const
    },
    {
      title: 'Square Recognition',
      description: 'Identify and tap specific squares on the board',
      icon: '🎯',
      mode: 'squares' as const
    }
  ]

  const handleModeSelect = (mode: 'pieces' | 'squares') => {
    if (mode === 'pieces') {
      navigation.navigate('PieceMovement')
    } else {
      navigation.navigate('SquareRecognition')
    }
  }

  return (
  <ScreenWrapper title="Vision Training">

    <SafeAreaView style={[styles.container]}>
      <View style={styles.modesContainer}>
        {modes.map((mode, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.modeCard, { backgroundColor: theme.colors.card }]}
            onPress={() => handleModeSelect(mode.mode)}
          >
            <Text style={styles.modeIcon}>{mode.icon}</Text>
            <View style={styles.modeInfo}>
              <Text style={[styles.modeTitle, { color: theme.colors.text, fontFamily: 'CormorantGaramond-Medium' }]}>{mode.title}</Text>
              <Text style={[styles.modeDescription, { color: theme.colors.text, fontFamily: 'Roboto-Regular' }]}>{mode.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
    </ScreenWrapper>
  )
}

export default VisionTrainingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  modesContainer: {
    padding: 12,
  },
  modeCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modeIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 20,
    marginBottom: 4,
    fontWeight: '500',
  },
  modeDescription: {
    fontSize: 13,
    opacity: 0.8,
  },
  challengeContainer: {
    flex: 1,
  },
  score: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'CormorantGaramond-Bold',
  },
  challenge: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 16,
    fontFamily: 'Roboto-Regular',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: '600',
  }
}) 