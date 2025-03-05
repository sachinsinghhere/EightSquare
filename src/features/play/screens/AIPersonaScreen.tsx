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
import {textStyles, fonts} from '../../../shared/theme/typography';

export interface AIPersona {
  id: string;
  name: string;
  rating: number;
  level: number;
  image: any;
  description: string;
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
  };
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
        name: 'Casual Carl',
        rating: 800,
        level: 0,
        image: require('../../../assets/images/themeBgs/clay.png'),
        description: 'Relaxed player who enjoys casual games',
        personality: {
          style: 'Casual and fun',
          strength: 'Patient teaching',
          weakness: 'Basic mistakes',
        },
        commentary: {
          opening: ["Let's have fun!", "I'm learning too!", "Nice move!"],
          middlegame: ["Hmm, interesting!", "What should I do?", "This is fun!"],
          endgame: ["Almost there!", "Good game!", "I'm improving!"],
          winning: ["Lucky me!", "Well played!", "That was close!"],
          losing: ["Good job!", "I learned something!", "Nice strategy!"],
          draw: ["Fair game!", "Both played well!", "That was fun!"],
        },
        prompts: {
          moveAnalysis: "As a casual player who enjoys learning, analyze this move with basic chess concepts.",
          gameStrategy: "You're playing for fun and learning. Share your thoughts on the position.",
          personalityTraits: "You're friendly, casual, and enjoy the social aspect of chess.",
        },
      },
      {
        id: 'rookie_rachel',
        name: 'Rookie Rachel',
        rating: 1000,
        level: 0,
        image: require('../../../assets/images/themeBgs/clay.png'),
        description: 'Enthusiastic beginner with basic knowledge',
        personality: {
          style: 'Eager to learn',
          strength: 'Quick adaptation',
          weakness: 'Tactical oversights',
        },
        commentary: {
          opening: ["I know this one!", "Basic principles!", "Development first!"],
          middlegame: ["Looking for tactics!", "Should I trade?", "Center control!"],
          endgame: ["Endgame time!", "Kings active!", "Pawns matter!"],
          winning: ["I did it!", "Practice pays off!", "Getting better!"],
          losing: ["Good teaching!", "I see my mistake!", "Next time!"],
          draw: ["Even game!", "Well fought!", "Learning experience!"],
        },
        prompts: {
          moveAnalysis: "As an eager beginner, analyze this move focusing on basic principles.",
          gameStrategy: "You're learning and applying basic chess concepts. Share your thoughts.",
          personalityTraits: "You're enthusiastic, studious, and eager to improve.",
        },
      },
      {
        id: 'patient_pat',
        name: 'Patient Pat',
        rating: 1200,
        level: 0,
        image: require('../../../assets/images/themeBgs/clay.png'),
        description: 'Methodical player focusing on fundamentals',
        personality: {
          style: 'Steady and careful',
          strength: 'Solid basics',
          weakness: 'Missed opportunities',
        },
        commentary: {
          opening: ["Step by step!", "Building slowly!", "Safety first!"],
          middlegame: ["Careful now!", "Let's think...", "No rush!"],
          endgame: ["Steady does it!", "One move at a time!", "Stay focused!"],
          winning: ["Patience paid off!", "Solid play!", "Good foundation!"],
          losing: ["Learning moment!", "Stay positive!", "Next game!"],
          draw: ["Fair result!", "Good effort!", "Steady game!"],
        },
        prompts: {
          moveAnalysis: "As a patient beginner, analyze this move with careful consideration.",
          gameStrategy: "You prefer slow, methodical play. Share your positional thoughts.",
          personalityTraits: "You're patient, methodical, and focused on fundamentals.",
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
        name: 'Tactical Tim',
        rating: 1500,
        level: 2,
        image: require('../../../assets/images/themeBgs/clay.png'),
        description: 'Sharp player looking for combinations',
        personality: {
          style: 'Aggressive tactics',
          strength: 'Finding forks',
          weakness: 'Positional play',
        },
        commentary: {
          opening: ["Attack ready!", "Sharp line!", "Tactical setup!"],
          middlegame: ["See the combo?", "Calculate deep!", "Sacrifice time!"],
          endgame: ["Tactical finish!", "Find the win!", "Precise moves!"],
          winning: ["Tactics win!", "Combo worked!", "Sharp play!"],
          losing: ["Well defended!", "Missed tactic!", "Good calculation!"],
          draw: ["Close fight!", "Tactical draw!", "Complex game!"],
        },
        prompts: {
          moveAnalysis: "As a tactical player, analyze this move focusing on combinations.",
          gameStrategy: "You seek tactical opportunities. Share your aggressive plans.",
          personalityTraits: "You're sharp, calculating, and love combinations.",
        },
      },
      {
        id: 'positional_petra',
        name: 'Positional Petra',
        rating: 1700,
        level: 2,
        image: require('../../../assets/images/themeBgs/clay.png'),
        description: 'Strategic player who values piece placement',
        personality: {
          style: 'Strategic control',
          strength: 'Pawn structure',
          weakness: 'Time pressure',
        },
        commentary: {
          opening: ["Control center!", "Good structure!", "Develop naturally!"],
          middlegame: ["Improve pieces!", "Create weakness!", "Strategic grip!"],
          endgame: ["Convert advantage!", "Better pawns!", "Technical win!"],
          winning: ["Position tells!", "Strategy works!", "Controlled game!"],
          losing: ["Well planned!", "Better structure!", "Strategic loss!"],
          draw: ["Equal position!", "Balanced play!", "Fair structure!"],
        },
        prompts: {
          moveAnalysis: "As a positional player, analyze this move's strategic implications.",
          gameStrategy: "You focus on long-term advantages. Share your strategic assessment.",
          personalityTraits: "You're methodical, strategic, and value position over tactics.",
        },
      },
      {
        id: 'dynamic_diana',
        name: 'Dynamic Diana',
        rating: 1900,
        level: 2,
        image: require('../../../assets/images/themeBgs/clay.png'),
        description: 'Active player who creates complications',
        personality: {
          style: 'Dynamic play',
          strength: 'Initiative',
          weakness: 'Overextending',
        },
        commentary: {
          opening: ["Active pieces!", "Create chaos!", "Dynamic play!"],
          middlegame: ["Keep pressure!", "Force errors!", "Stay active!"],
          endgame: ["Push pawns!", "Active king!", "Create chances!"],
          winning: ["Activity wins!", "Pressure told!", "Dynamic victory!"],
          losing: ["Well controlled!", "Too risky!", "Good defense!"],
          draw: ["Wild game!", "Many chances!", "Active play!"],
        },
        prompts: {
          moveAnalysis: "As a dynamic player, analyze this move's active potential.",
          gameStrategy: "You seek active piece play. Share your dynamic plans.",
          personalityTraits: "You're energetic, creative, and love active positions.",
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
        name: 'Strategic Steve',
        rating: 2100,
        level: 4,
        image: require('../../../assets/images/themeBgs/clay.png'),
        description: 'Deep strategic understanding and planning',
        personality: {
          style: 'Deep strategy',
          strength: 'Long-term play',
          weakness: 'Time management',
        },
        commentary: {
          opening: ["Strategic choice!", "Deep preparation!", "Complex position!"],
          middlegame: ["Multiple plans!", "Strategic battle!", "Create imbalance!"],
          endgame: ["Technical phase!", "Convert advantage!", "Precise technique!"],
          winning: ["Strategy prevails!", "Well executed!", "Clear advantage!"],
          losing: ["Well played!", "Better strategy!", "Instructive game!"],
          draw: ["Complex battle!", "Equal chances!", "Strategic draw!"],
        },
        prompts: {
          moveAnalysis: "As a strategic master, analyze this move's deep implications.",
          gameStrategy: "You understand complex positions. Share your strategic insight.",
          personalityTraits: "You're analytical, deep-thinking, and strategically minded.",
        },
      },
      {
        id: 'attacking_alex',
        name: 'Attacking Alex',
        rating: 2300,
        level: 4,
        image: require('../../../assets/images/themeBgs/clay.png'),
        description: 'Aggressive player who loves sacrifices',
        personality: {
          style: 'Sharp attacks',
          strength: 'Initiative',
          weakness: 'Defense',
        },
        commentary: {
          opening: ["Sharp variation!", "Attack ready!", "Sacrifice coming!"],
          middlegame: ["Attack builds!", "Calculate deep!", "Press advantage!"],
          endgame: ["Convert attack!", "Keep pressure!", "Find knockout!"],
          winning: ["Attack wins!", "Well calculated!", "Perfect execution!"],
          losing: ["Good defense!", "Counter play!", "Well held!"],
          draw: ["Fighting draw!", "Many chances!", "Sharp game!"],
        },
        prompts: {
          moveAnalysis: "As an attacking player, analyze this move's aggressive potential.",
          gameStrategy: "You seek attacking chances. Share your tactical assessment.",
          personalityTraits: "You're aggressive, calculating, and love attacks.",
        },
      },
      {
        id: 'universal_uma',
        name: 'Universal Uma',
        rating: 2500,
        level: 4,
        image: require('../../../assets/images/themeBgs/clay.png'),
        description: 'Complete player with universal style',
        personality: {
          style: 'Universal play',
          strength: 'Adaptability',
          weakness: 'Perfectionism',
        },
        commentary: {
          opening: ["Interesting choice!", "Many plans!", "Complex game!"],
          middlegame: ["Critical position!", "Calculate carefully!", "Key moment!"],
          endgame: ["Technical phase!", "Precise play!", "Convert advantage!"],
          winning: ["Well played!", "Clear plan!", "Good technique!"],
          losing: ["Excellent play!", "Instructive game!", "Well done!"],
          draw: ["Fair result!", "Good fight!", "Complex game!"],
        },
        prompts: {
          moveAnalysis: "As a universal player, provide a complete analysis of this move.",
          gameStrategy: "You understand all aspects of chess. Share your comprehensive view.",
          personalityTraits: "You're well-rounded, adaptable, and deeply knowledgeable.",
        },
      },
    ],
  },
];

type PlayScreenNavigationProp = NativeStackNavigationProp<PlayStackParamList, 'AIPersona'>;

type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

const DifficultyIcon: Record<DifficultyLevel, string> = {
  Beginner: 'star-shooting',
  Intermediate: 'fire',
  Advanced: 'crown',
};

export const AIPersonaScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<PlayScreenNavigationProp>();
  const {width} = useWindowDimensions();
  const cardWidth = width * 0.42; // Reduced to 42% of screen width

  const handlePersonaSelect = useCallback((persona: AIPersona) => {
    navigation.navigate('Play', {selectedPersona: persona});
  }, [navigation]);

  const renderPersonaCard = useCallback((persona: AIPersona) => {
    return (
      <View style={{width: cardWidth, paddingRight: 8}}>
        <FlipCard
          style={styles.flipCard}
          friction={20}
          perspective={2000}
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
              style={styles.cardBackground}
              imageStyle={styles.cardBackgroundImage}>
              <LinearGradient
                colors={[
                  theme.colors.surface + 'F2',
                  theme.colors.surface + '00',
                ]}
                start={{x: 0.1, y: 0}}
                end={{x: 0.9, y: 0.95}}
                style={styles.cardGradient}>
              </LinearGradient>
              <View style={styles.cardFooter}>
                <LinearGradient
                  colors={[
                    theme.colors.surface + '00',
                    theme.colors.surface + 'F2',
                  ]}
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
                  style={styles.footerGradient}>
                  <View style={styles.footerContent}>
                    <Text
                      style={[
                        textStyles.h5,
                        styles.personaName,
                        {color: theme.colors.text},
                      ]}>
                      {persona.name}
                    </Text>
                    <View
                      style={[
                        styles.ratingBadge,
                        {backgroundColor: theme.colors.primary},
                      ]}>
                      <Text style={[textStyles.caption, styles.ratingText]}>
                        {persona.rating}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
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

  const sections = DIFFICULTY_LEVELS.map(level => ({
    name: level.name,
    description: level.description,
    data: level.personas,
  }));

  return (
    <ScreenWrapper title="Play" showBack={false}>
      <SectionList
        style={[styles.container, {backgroundColor: theme.colors.background}]}
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
    height: 180,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 5,
  },
  cardBack: {
    height: 180,
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
  },
  cardGradient: {
    flex: 1,
    position:'absolute',
    padding: 14,
    justifyContent: 'flex-start',
    borderRadius: 20,
    overflow: 'hidden',
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
    padding: 12,
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
    borderRadius:20
  },
}); 