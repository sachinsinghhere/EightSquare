import React, {useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  ImageBackground,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import {useTheme} from '../../../shared/theme/ThemeContext';
import {ScreenWrapper} from '../../../shared/components/ScreenWrapper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {PlayStackParamList} from '../../../navigation/stacks/PlayStack';
import LinearGradient from 'react-native-linear-gradient';
import FlipCard from 'react-native-flip-card';
import Icon from '../../../shared/components/Icon';
import {textStyles} from '../../../shared/theme/typography';
import { Avatars } from '../../../assets';
import {useNetworkStatus} from '../../../shared/hooks/useNetworkStatus';

export interface AIPersona {
  id: string;
  name: string;
  rating: number;
  level: number;
  image: any;
  description: string;
  depth?: number; // Optional depth parameter for engine-based opponents
  personality: {
    style: string;
    strength: string;
    weakness: string;
  };
  commentary: {
    opening: string[];
    middlegame: string[];
    endgame: string[];
    winning: string[];
    losing: string[];
    draw: string[];
  } | ((move: any) => string);
  prompts: {
    moveAnalysis: string;
    gameStrategy: string;
    personalityTraits: string;
  };
}

const DIFFICULTY_LEVELS = [
  {
    name: 'Beginner',
    description: 'Perfect for learning the basics',
    color: '#4CAF50',
    personas: [
      {
        id: 'casual_carl',
        name: 'Carl',
        rating: 800,
        level: 0,
        image: Avatars.avatar_one,
        description: 'Relaxed player who enjoys casual games',
        personality: {
          style: 'Casual and fun',
          strength: 'Patient teaching',
          weakness: 'Basic mistakes',
        },
        commentary: (move: any) => {
          if (move.san.includes('+')) return 'Oh! A check! Nice move!';
          if (move.san.includes('x')) return 'Capturing a piece! Exciting!';
          if (move.san.includes('=')) return 'Promotion! This is exciting!';
          return "Let's have fun! A relaxed move!";
        },
        prompts: {
          moveAnalysis:
            'As a casual player who enjoys learning, analyze this move with basic chess concepts.',
          gameStrategy:
            "You're playing for fun and learning. Share your thoughts on the position.",
          personalityTraits:
            "You're friendly, casual, and enjoy the social aspect of chess.",
        },
      },
      {
        id: 'rookie_rachel',
        name: 'Rachel',
        rating: 1000,
        level: 0,
        image: Avatars.avatar_two,
        description: 'Enthusiastic beginner with basic knowledge',
        personality: {
          style: 'Eager to learn',
          strength: 'Quick adaptation',
          weakness: 'Tactical oversights',
        },
        commentary: (move: any) => {
          if (move.san.includes('+')) return 'I found a check! Feeling smart!';
          if (move.san.includes('x')) return 'Good capture! Material matters!';
          if (move.san.includes('=')) return 'Promoted! Now I feel strong!';
          return 'Piece development is key!';
        },
        prompts: {
          moveAnalysis:
            'As an eager beginner, analyze this move focusing on basic principles.',
          gameStrategy:
            "You're learning and applying basic chess concepts. Share your thoughts.",
          personalityTraits:
            "You're enthusiastic, studious, and eager to improve.",
        },
      },
      {
        id: 'patient_pat',
        name: 'Nexa',
        rating: 1200,
        level: 0,
        image: Avatars.avatar_three,
        description: 'Methodical player focusing on fundamentals',
        personality: {
          style: 'Steady and careful',
          strength: 'Solid basics',
          weakness: 'Missed opportunities',
        },
        commentary: (move: any) => {
          if (move.san.includes('+')) return "Check! Let's proceed carefully.";
          if (move.san.includes('x'))
            return 'Captured material, now stay solid.';
          if (move.san.includes('='))
            return "Promotion secured! Let's convert it.";
          return 'Slow and steady wins the game.';
        },
        prompts: {
          moveAnalysis:
            'As a patient beginner, analyze this move with careful consideration.',
          gameStrategy:
            'You prefer slow, methodical play. Share your positional thoughts.',
          personalityTraits:
            "You're patient, methodical, and focused on fundamentals.",
        },
      },
    ],
  },
  {
    name: 'Intermediate',
    description: 'For players who know the basics',
    color: '#2196F3',
    personas: [
      {
        id: 'tactical_tim',
        name: 'Tim',
        rating: 1500,
        level: 2,
        image: Avatars.avatar_four,
        description: 'Sharp player looking for combinations',
        personality: {
          style: 'Aggressive tactics',
          strength: 'Finding forks',
          weakness: 'Positional play',
        },
        commentary: (move: any) => {
          if (move.san.includes('+')) return 'Tactics in play! Check!';
          if (move.san.includes('x')) return 'Nice capture! Tactical shot!';
          if (move.san.includes('=')) return "Promotion! Let's make it count!";
          if (move.san.includes('O-O')) return 'Castling! Safety first!';
          return 'Setting up a tactical trick!';
        },
        prompts: {
          moveAnalysis:
            'As a tactical player, analyze this move focusing on combinations.',
          gameStrategy:
            'You seek tactical opportunities. Share your aggressive plans.',
          personalityTraits:
            "You're sharp, calculating, and love combinations.",
        },
      },
      {
        id: 'positional_petra',
        name: 'Petra',
        rating: 1700,
        level: 2,
        image: Avatars.avatar_five,
        description: 'Strategic player who values piece placement',
        personality: {
          style: 'Strategic control',
          strength: 'Pawn structure',
          weakness: 'Time pressure',
        },
        commentary: (move: any) => {
          if (move.san.includes('+'))
            return 'Check! Gaining positional control!';
          if (move.san.includes('x')) return 'Capture improves my structure!';
          if (move.san.includes('=')) return 'Pawn promotion! Endgame time.';
          return 'Carefully improving my position.';
        },
        prompts: {
          moveAnalysis:
            "As a positional player, analyze this move's strategic implications.",
          gameStrategy:
            'You focus on long-term advantages. Share your strategic assessment.',
          personalityTraits:
            "You're methodical, strategic, and value position over tactics.",
        },
      },
      {
        id: 'dynamic_diana',
        name: 'Diana',
        rating: 1900,
        level: 2,
        image: Avatars.avatar_six,
        description: 'Active player who creates complications',
        personality: {
          style: 'Dynamic play',
          strength: 'Initiative',
          weakness: 'Overextending',
        },
        commentary: (move: any) => {
          if (move.san.includes('+')) return 'Check! Keep up the pressure!';
          if (move.san.includes('x')) return 'Boom! That piece is gone!';
          if (move.san.includes('='))
            return 'Pawn promoted! Now the real fun begins!';
          return 'Stirring up complications! Chaos is my game!';
        },
        prompts: {
          moveAnalysis:
            "As a dynamic player, analyze this move's active potential.",
          gameStrategy: 'You seek active piece play. Share your dynamic plans.',
          personalityTraits:
            "You're energetic, creative, and love active positions.",
        },
      },
    ],
  },
  {
    name: 'Advanced',
    description: 'Challenge yourself against strong opponents',
    color: '#FF5722',
    personas: [
      {
        id: 'strategic_steve',
        name: 'Steve',
        rating: 2100,
        level: 4,
        image: Avatars.avatar_seven,
        description: 'Deep strategic understanding and planning',
        personality: {
          style: 'Deep strategy',
          strength: 'Long-term play',
          weakness: 'Time management',
        },
        commentary: (move: any) => {
          if (move.san.includes('+'))
            return 'Check! Strategic pressure applied!';
          if (move.san.includes('x'))
            return 'Took control with a strong capture!';
          if (move.san.includes('=')) return 'A well-planned promotion!';
          if (move.san.includes('O-O'))
            return 'King safety established, time for strategy!';
          return 'Positionally sound move, keeping control.';
        },
        prompts: {
          moveAnalysis:
            "As a strategic master, analyze this move's deep implications.",
          gameStrategy:
            'You understand complex positions. Share your strategic insight.',
          personalityTraits:
            "You're analytical, deep-thinking, and strategically minded.",
        },
      },
      {
        id: 'attacking_alex',
        name: 'Zyra',
        rating: 2300,
        level: 4,
        image: Avatars.avatar_eight,
        description: 'Aggressive player who loves sacrifices',
        personality: {
          style: 'Sharp attacks',
          strength: 'Initiative',
          weakness: 'Defense',
        },
        commentary: (move: any) => {
          if (move.san.includes('+')) return 'Check! Attack is heating up!';
          if (move.san.includes('x')) return 'Sacrifices bring victory!';
          if (move.san.includes('='))
            return 'Promotion secures my attacking chances!';
          return 'Time to push for an attack!';
        },
        prompts: {
          moveAnalysis:
            "As an attacking player, analyze this move's aggressive potential.",
          gameStrategy:
            'You seek attacking chances. Share your tactical assessment.',
          personalityTraits:
            "You're aggressive, calculating, and love attacks.",
        },
      },
      {
        id: 'universal_uma',
        name: 'Uma',
        rating: 2500,
        level: 4,
        image: Avatars.avatar_nine,
        description: 'Complete player with universal style',
        personality: {
          style: 'Universal play',
          strength: 'Adaptability',
          weakness: 'Perfectionism',
        },
        commentary: (move: any) => {
          if (move.san.includes('+')) return 'Check! Attack is heating up!';
          if (move.san.includes('x')) return 'Sacrifices bring victory!';
          if (move.san.includes('='))
            return 'Promotion secures my attacking chances!';
          return 'Time to push for an attack!';
        },
        prompts: {
          moveAnalysis:
            'As a universal player, provide a complete analysis of this move.',
          gameStrategy:
            'You understand all aspects of chess. Share your comprehensive view.',
          personalityTraits:
            "You're well-rounded, adaptable, and deeply knowledgeable.",
        },
      },
    ],
  },
  // {
  //   name: 'Engines',
  //   description: 'Play against powerful chess engines (Requires Internet)',
  //   color: '#9C27B0',
  //   requiresInternet: true,
  //   personas: [
  //     {
  //       id: 'stockfish_rapid',
  //       name: 'Stockfish Rapid',
  //       rating: 2800,
  //       level: 12,
  //       depth: 12,
  //       image: Avatars.engine_one, // Using existing avatar for now
  //       description: 'Fast and strong chess engine for rapid games',
  //       personality: {
  //         style: 'Universal calculation',
  //         strength: 'Perfect tactics',
  //         weakness: 'None',
  //       },
  //       commentary: (move: any) => {
  //         if (move.san?.includes('+')) return 'Check! The position is forcing.';
  //         if (move.san?.includes('x')) return 'Material balance shifts.';
  //         if (move.san?.includes('=')) return 'Promotion is decisive.';
  //         if (move.san?.includes('O-O')) return 'Position secured.';
  //         return 'Position evaluated.';
  //       },
  //       prompts: {
  //         moveAnalysis: 'Analyze this position with perfect tactical accuracy.',
  //         gameStrategy: 'Calculate the optimal continuation in this position.',
  //         personalityTraits:
  //           'You are precise, calculating, and tactically perfect.',
  //       },
  //     },
  //     {
  //       id: 'stockfish_deep',
  //       name: 'Stockfish Deep',
  //       rating: 3000,
  //       level: 20,
  //       depth: 20,
  //       image: Avatars.engine_two, // Using existing avatar for now
  //       description: 'Deep calculating chess engine for serious analysis',
  //       personality: {
  //         style: 'Deep calculation',
  //         strength: 'Strategic mastery',
  //         weakness: 'None',
  //       },
  //       commentary: (move: any) => {
  //         if (move.san?.includes('+')) return 'Check. Position is winning.';
  //         if (move.san?.includes('x')) return 'Exchange is necessary.';
  //         if (move.san?.includes('=')) return 'Promotion is inevitable.';
  //         if (move.san?.includes('O-O')) return 'King position optimized.';
  //         return 'Move follows optimal strategy.';
  //       },
  //       prompts: {
  //         moveAnalysis: 'Provide deep strategic analysis of this position.',
  //         gameStrategy: 'Calculate the deepest strategic implications.',
  //         personalityTraits:
  //           'You are deeply analytical and strategically perfect.',
  //       },
  //     },
  //   ],
  // },
];

type PlayScreenNavigationProp = NativeStackNavigationProp<PlayStackParamList, 'AIPersona'>;

type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Engines';

const DifficultyIcon: Record<DifficultyLevel, string> = {
  Beginner: 'star-shooting',
  Intermediate: 'fire',
  Advanced: 'crown',
  Engines: 'chip',
};

export const AIPersonaScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<PlayScreenNavigationProp>();
  const {width} = useWindowDimensions();
  const {isOnline} = useNetworkStatus();
  const cardWidth = width * 0.42;

  const handlePersonaSelect = useCallback((persona: AIPersona) => {
    navigation.navigate('Play', {
      selectedPersona: {
        ...persona,
        commentary: typeof persona.commentary === 'function' ? {
          opening: [],
          middlegame: [],
          endgame: [],
          winning: [],
          losing: [],
          draw: [],
        } : persona.commentary
      }
    });
  }, [navigation]);

  const renderPersonaCard = useCallback((persona: AIPersona) => {
    return (
      <View style={{width: cardWidth, paddingRight: 8}}>
        <FlipCard
          style={styles.flipCard}
          friction={10}
          perspective={1500}
          flipHorizontal={true}
          flipVertical={false}
          clickable={true}
          useNativeDriver={true}
          alignHeight={true}>
          {/* Face Side */}
          <View
            style={[
              styles.cardFace,
              {
                backgroundColor: theme.colors.surface,
                shadowColor: theme.colors.primary,
              },
            ]}>
            <ImageBackground
              source={persona.image}
              style={[
                styles.cardBackground,
                {backgroundColor: theme.colors.surfaceVariant},
              ]}
              imageStyle={styles.cardBackgroundImage}>
              <View style={styles.cardFooter}>
                <LinearGradient
                  colors={[
                    theme.colors.primary + '00',
                    theme.colors.primary + 'F2',
                  ]}
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1.5}}
                  style={styles.footerGradient}
                />
              </View>
            </ImageBackground>
          </View>
          {/* Back Side */}
          <View
            style={[
              styles.cardBack,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.primary + '40',
                shadowColor: theme.colors.primary,
                borderWidth: 1,
              },
            ]}>
            <View style={styles.backContent}>
              <View>
                <Text
                  style={[textStyles.button, {color: theme.colors.primary}]}>
                  {persona.name}
                </Text>
                <Text
                  style={[
                    textStyles.caption,
                    styles.backDescription,
                    {color: theme.colors.text},
                  ]}>
                  {persona.description}
                </Text>
              </View>
              <View style={styles.backTraits}>
                <View style={styles.backTraitItem}>
                  <Icon
                    name="lightning-bolt"
                    size={12}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={[textStyles.caption, {color: theme.colors.text}]}>
                    {persona.personality.strength}
                  </Text>
                </View>
                <View style={styles.backTraitItem}>
                  <Icon
                    name="transfer-down"
                    size={12}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={[textStyles.caption, {color: theme.colors.text}]}>
                    {persona.personality.weakness}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.playButton,
                  {backgroundColor: theme.colors.primary},
                ]}
                onPress={() => handlePersonaSelect(persona)}>
                <Text style={[textStyles.button, styles.playButtonText]}>
                  Play
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </FlipCard>
      </View>
    );
  }, [cardWidth, handlePersonaSelect, theme.colors]);

  const renderSectionHeader = useCallback(({section}: {section: {name: string, description: string}}) => (
    <View style={styles.levelHeader}>
      <View style={styles.levelTitleRow}>
        <Icon 
          name={DifficultyIcon[section.name as DifficultyLevel]} 
          size={28} 
          color={theme.colors.primary} 
        />
        <Text style={[textStyles.h3, {color: theme.colors.primary}]}>
          {section.name}
        </Text>
      </View>
      <Text style={[textStyles.bodyMedium, styles.levelDescription, {color: theme.colors.text}]}>
        {section.description}
      </Text>
    </View>
  ), [theme.colors]);

  const renderItem = useCallback(({item, section}: {item: AIPersona, section: {data: AIPersona[]}}) => {
    if (item === section.data[0]) {
      return (
        <FlatList
          horizontal
          data={section.data}
          keyExtractor={(persona) => persona.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
          decelerationRate="fast"
          snapToInterval={cardWidth + 16}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={3}
          renderItem={({item: persona}) => (
            <View style={{width: cardWidth, paddingRight: 16}}>
              {renderPersonaCard(persona)}
            </View>
          )}
        />
      );
    }
    return null;
  }, [renderPersonaCard, cardWidth]);

  const sections = DIFFICULTY_LEVELS
    .filter(level => !level.requiresInternet || isOnline)
    .map(level => ({
      name: level.name,
      description: level.description,
      data: level.personas,
    }));

  return (
    <ScreenWrapper title="Play with AI" showBack>
      <SectionList
        style={[styles.container]}
        contentContainerStyle={styles.contentContainer}
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={() => <View style={styles.sectionFooter} />}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 24,
  },
  horizontalScroll: {
    flexGrow: 0,
    marginBottom: 8,
  },
  horizontalScrollContent: {
    paddingLeft: 24,
    paddingRight: 4,
  },
  levelHeader: {
    marginBottom: 16,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  levelName: {
    fontSize: 26,
    marginBottom: 4,
    fontFamily: 'CormorantGaramond-Bold',
  },
  levelDescription: {
    opacity: 0.7,
    marginTop: 4,
  },
  sectionFooter: {
    height: 32,
  },
  cardFace: {
    height: 200,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 5,
  },
  cardBack: {
    height: 200,
    width: '100%',
    borderRadius: 20,
    padding: 12,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 5,
  },
  cardBackground: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardBackgroundImage: {
    borderRadius: 20,
    overflow:'hidden',
  },
  cardFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  footerGradient: {
    width: '100%',
    height: 50,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  personaName: {
    paddingLeft: 2,
    width:'60%'
  },
  ratingBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    color: '#FFFFFF',
  },
  backContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  backDescription: {
    marginTop: 4,
    marginBottom: 8,
    lineHeight: 16,
  },
  backTraits: {
    gap: 4,
    marginBottom: 8,
  },
  backTraitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  playButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  playButtonText: {
    color: '#FFFFFF',
  },
  levelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flipCard: {
    width: '100%',
    height: '100%',
    overflow:'hidden',
    borderRadius:20,
  },
}); 