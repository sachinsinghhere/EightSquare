import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import Icon from './Icon';
import {useTheme} from '../theme/ThemeContext';
import {textStyles} from '../theme/typography';

interface AccordionProps {
  title: string;
  description: string;
  emoji: string;
  items: Array<{label: string; count: number; solvedCount: number}>;
  onSelectItem: (item: string) => void;
  isSearchable?: boolean;
}

export const Accordion = ({
  title,
  description,
  emoji,
  items,
  onSelectItem,
  isSearchable = true,
}: AccordionProps) => {
  const {theme} = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const heightValue = useSharedValue(0);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
    heightValue.value = withTiming(isExpanded ? 0 : 1, {
      duration: 300,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: heightValue.value === 0 ? 0 : 'auto',
      opacity: heightValue.value,
      overflow: 'hidden',
    };
  });

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleAccordion}
        activeOpacity={0.7}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.titleContainer}>
          <Text style={[textStyles.h4, {color: theme.colors.text}]}>
            {title}
          </Text>
          <Text
            style={[
              textStyles.bodyMedium,
              styles.description,
              {color: theme.colors.text},
            ]}>
            {description}
          </Text>
        </View>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={theme.colors.text}
        />
      </TouchableOpacity>

      <Animated.View style={[styles.content, animatedStyle]}>
        {isSearchable && (
          <View
            style={[
              styles.searchContainer,
              {backgroundColor: theme.colors.background},
            ]}>
            <Icon name="magnify" size={20} color={theme.colors.text} />
            <TextInput
              style={[styles.searchInput, {color: theme.colors.text}]}
              placeholder="Search..."
              placeholderTextColor={theme.colors.text + '80'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        )}

        <ScrollView
          style={styles.itemsContainer}
          showsVerticalScrollIndicator={false}>
          {filteredItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.item,
                {backgroundColor: theme.colors.background},
              ]}
              onPress={() => onSelectItem(item.label)}>
              <Text 
                style={[
                  textStyles.bodyMedium, 
                  {color: theme.colors.text, flex: 1, marginRight: 8}
                ]}>
                {item.label}
              </Text>
              <View style={styles.countContainer}>
                <Text
                  style={[
                    textStyles.bodySmall,
                    {color: theme.colors.success},
                  ]}>
                  {item.solvedCount}
                </Text>
                <Text
                  style={[
                    textStyles.bodySmall,
                    {color: theme.colors.text + '80'},
                  ]}>
                  /{item.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 32,
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  description: {
    marginTop: 4,
    opacity: 0.8,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  itemsContainer: {
    maxHeight: 200,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 