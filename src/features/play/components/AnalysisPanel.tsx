import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { stockfishAnalysis } from '../services/stockFishService';
import { useTheme } from '../../../shared/theme/ThemeContext';
import { textStyles, fonts } from '../../../shared/theme/typography';
import { useNetworkStatus } from '../../../shared/hooks/useNetworkStatus';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface AnalysisResponse {
  success: boolean;
  evaluation?: number;
  mate?: string | null;
  bestmove?: string;
  ponder?: string;
  continuation?: string[];
  error?: string;
}

interface AnalysisPanelProps {
  fen: string;
  onAnalyze?: () => void;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ fen }) => {
  const { theme } = useTheme();
  const { isOnline } = useNetworkStatus();
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!isOnline) {
      setAnalysis({ 
        success: false, 
        error: "Internet connection required for analysis" 
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await stockfishAnalysis(fen);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysis({ 
        success: false, 
        error: 'Analysis failed. Please try again.' 
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getEvaluationText = () => {
    if (!analysis || !analysis.success) return '';
    if (analysis.mate) {
      return `Mate in ${analysis.mate}`;
    }
    if (typeof analysis.evaluation === 'number') {
      const evalNum = analysis.evaluation;
      const color = evalNum > 0.5 ? theme.colors.success : 
                   evalNum < -0.5 ? theme.colors.error : 
                   theme.colors.text;
      return {
        text: evalNum > 0 ? `+${evalNum.toFixed(2)}` : evalNum.toFixed(2),
        color
      };
    }
    return { text: '', color: theme.colors.text };
  };

  const getBestMoveText = () => {
    if (!analysis || !analysis.success || !analysis.bestmove) return '';
    return `Best move: ${analysis.bestmove}${analysis.ponder ? ` (${analysis.ponder})` : ''}`;
  };

  const formatContinuation = (moves: string[]) => {
    return moves.map((move, index) => {
      const moveNumber = Math.floor(index / 2) + 1;
      if (index % 2 === 0) {
        return `${moveNumber}. ${move}`;
      }
      return move;
    }).join(' ');
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.surface}]}>
      <View style={styles.headerContainer}>
        <Text
          style={[
            textStyles.h4,
            {color: theme.colors.text, fontFamily: fonts.primary.semibold},
          ]}>
          Position Analysis
        </Text>
        {!isOnline && (
          <View style={styles.offlineTag}>
            <MaterialIcons
              name="wifi-off"
              size={16}
              color={theme.colors.error}
            />
            <Text style={[styles.offlineText, {color: theme.colors.error}]}>
              Offline
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.analyzeButton,
          {
            backgroundColor: isOnline
              ? theme.colors.primary
              : theme.colors.surfaceVariant,
            opacity: isOnline ? 1 : 0.7,
          },
        ]}
        onPress={handleAnalyze}
        disabled={isAnalyzing || !isOnline}>
        <Text style={[styles.buttonText, {fontFamily: fonts.primary.medium}]}>
          {isAnalyzing ? 'Analyzing...' : 'Analyze Position'}
        </Text>
      </TouchableOpacity>

      {isAnalyzing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={[styles.loadingText, {color: theme.colors.primary}]}>
            Analyzing position...
          </Text>
        </View>
      )}

      {analysis && !isAnalyzing && (
        <View style={styles.resultsContainer}>
          {analysis.error ? (
            <View style={styles.errorContainer}>
              <MaterialIcons
                name="error-outline"
                size={24}
                color={theme.colors.error}
              />
              <Text
                style={[
                  textStyles.bodyMedium,
                  {color: theme.colors.error, marginLeft: 8},
                ]}>
                {analysis.error}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.evaluationContainer}>
                <Text
                  style={[
                    textStyles.h3,
                    {
                      color: getEvaluationText().color,
                      fontFamily: fonts.primary.bold,
                    },
                  ]}>
                  {getEvaluationText().text}
                </Text>
              </View>

              <Text
                style={[
                  textStyles.bodyLarge,
                  {
                    color: theme.colors.text,
                    fontFamily: fonts.primary.semibold,
                    marginTop: 12,
                  },
                ]}>
                {getBestMoveText()}
              </Text>

              {analysis.continuation && analysis.continuation.length > 0 && (
                <View style={styles.continuationContainer}>
                  <Text
                    style={[
                      textStyles.bodyLarge,
                      {
                        color: theme.colors.text,
                        fontFamily: fonts.secondary.medium,
                      },
                    ]}>
                    Suggested line:
                  </Text>
                  <Text
                    style={[
                      textStyles.bodyMedium,
                      {
                        color: theme.colors.text,
                        fontFamily: fonts.primary.regular,
                        marginTop: 4,
                      },
                    ]}>
                    {`${formatContinuation(analysis.continuation)} `}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  offlineTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  offlineText: {
    fontSize: 12,
    marginLeft: 4,
  },
  analyzeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    marginTop: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  resultsContainer: {
    marginTop: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  evaluationContainer: {
    alignItems: 'center',
  },
  continuationContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 8,
  },
}); 