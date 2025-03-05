import React from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

interface TitleLevel {
  title: string;
  description: string;
  rating: string;
}

const chessTitles: TitleLevel[] = [
  {
    title: 'GM',
    description: 'Grandmaster',
    rating: '2500+ FIDE Rating',
  },
  {
    title: 'IM',
    description: 'International Master',
    rating: '2400+ FIDE Rating',
  },
  {
    title: 'FM',
    description: 'FIDE Master',
    rating: '2300+ FIDE Rating',
  },
  {
    title: 'CM',
    description: 'Candidate Master',
    rating: '2200+ FIDE Rating',
  },
  {
    title: 'NM',
    description: 'National Master',
    rating: '2200+ National Rating',
  },
];

export const ChessTitles: React.FC = () => {
  const fadeAnims = React.useRef(chessTitles.map(() => new Animated.Value(0))).current;

  React.useEffect(() => {
    const animations = fadeAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        delay: index * 200,
        useNativeDriver: true,
      })
    );

    Animated.stagger(200, animations).start();
  }, []);

  return (
    <LinearGradient
      colors={['#f0f8ff', '#1a1a2e']}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.header}>Chess Titles</Text>
      </View>
      
      <View style={styles.pyramid}>
        {chessTitles.map((level, index) => (
          <Animated.View
            key={level.title}
            style={[
              styles.level,
              {
                width: `${85 - (index * 5)}%`,
                opacity: fadeAnims[index],
                transform: [{
                  translateY: fadeAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                }],
              },
            ]}
          >
            <View style={styles.cardOutline}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.levelContent}
              >
                <View style={styles.titleContainer}>
                  <Text style={styles.titleMain}>{level.title}</Text>
                  <Text style={styles.titleDesc}>{level.description}</Text>
                </View>
                <Text style={styles.rating}>{level.rating}</Text>
              </LinearGradient>
            </View>
          </Animated.View>
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  pyramid: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 16,
  },
  level: {
    minHeight: 90,
  },
  cardOutline: {
    borderRadius: 16,
    padding: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  levelContent: {
    padding: 16,
    borderRadius: 15,
    backgroundColor: 'rgba(30,30,50,0.95)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleMain: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 12,
  },
  titleDesc: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.9)',
  },
  rating: {
    fontSize: 16,
    color: '#8e9aff',
    marginTop: 4,
  },
});

export default ChessTitles;
