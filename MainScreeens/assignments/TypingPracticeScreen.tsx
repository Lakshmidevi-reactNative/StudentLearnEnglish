import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Platform,
  Dimensions,
  ScrollView,
  Keyboard,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { COLORS } from '../constants/Colors';
import { toast } from 'sonner-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Mock typing practice content data
const TYPING_CONTENT = {
  title: "Business Email Composition",
  description: "Practice typing professional business emails with correct formatting and vocabulary.",
  difficulty: "Intermediate",
  content: `Dear Mr. Johnson,

I hope this email finds you well. I am writing to follow up on our meeting last week regarding the marketing campaign for our new product line.

As discussed, our team has prepared a detailed proposal outlining the marketing strategy, budget allocation, and timeline. You will find the document attached to this email for your review.

We would greatly appreciate your feedback on the proposal, particularly regarding the social media component of the campaign. If you have any questions or need clarification on any points, please do not hesitate to contact me.

Thank you for your time and consideration. I look forward to hearing from you soon.

Best regards,
Sarah Williams
Marketing Manager`,
  keywords: [
    "follow up", "proposal", "marketing campaign", "budget allocation", 
    "timeline", "social media", "feedback", "clarification"
  ]
};

export default function TypingPracticeScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<any, string>>();
  const assignment = route.params?.assignment || null;
  
  const [text, setText] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timer, setTimer] = useState(0);
  const [typingStats, setTypingStats] = useState({
    wpm: 0,
    accuracy: 0,
    errors: 0,
    keystrokes: 0
  });
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [wordHighlights, setWordHighlights] = useState([]);
  
  const contentLines = TYPING_CONTENT.content.split('\n');
  const textInputRef = useRef(null);
  const timerRef = useRef(null);
  const scrollViewRef = useRef(null);
  
  // This effect manages the timer when typing is started
  useEffect(() => {
    if (isStarted && !isCompleted) {
      timerRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isStarted, isCompleted]);
  
  // Process typing progress
  useEffect(() => {
    if (isStarted && text.length > 0) {
      // Check each typed character against the original content
      const targetContent = TYPING_CONTENT.content;
      let errorCount = 0;
      
      for (let i = 0; i < Math.min(text.length, targetContent.length); i++) {
        if (text[i] !== targetContent[i]) {
          errorCount++;
        }
      }
      
      // Calculate accuracy
      const totalChars = text.length;
      const correctChars = totalChars - errorCount;
      const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;
      
      // Calculate WPM (Words Per Minute)
      // Average word length is considered 5 characters
      const elapsedMinutes = timer / 60;
      const wordCount = text.length / 5;
      const wpm = elapsedMinutes > 0 ? wordCount / elapsedMinutes : 0;
      
      // Update typing stats
      setTypingStats({
        wpm: Math.round(wpm),
        accuracy: Math.round(accuracy),
        errors: errorCount,
        keystrokes: totalChars
      });
      
      // Calculate the current line being typed
      const textUpToNow = text.substring(0, text.length);
      const lineBreaks = (textUpToNow.match(/\n/g) || []).length;
      setCurrentLineIndex(lineBreaks);
      
      // Check if typing is complete
      if (text.length >= targetContent.length) {
        handleComplete();
      }
      
      // Highlight keywords
      const typedWords = text.split(/\s+/);
      const highlights = [];
      
      TYPING_CONTENT.keywords.forEach(keyword => {
        const parts = keyword.split(' ');
        const regex = new RegExp(parts.join('\\s+'), 'gi');
        let match;
        
        while ((match = regex.exec(text)) !== null) {
          highlights.push({
            start: match.index,
            end: match.index + match[0].length,
            keyword: keyword
          });
        }
      });
      
      setWordHighlights(highlights);
    }
  }, [text, timer, isStarted]);
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Start typing practice
  const handleStart = () => {
    setIsStarted(true);
    setStartTime(Date.now());
    setText('');
    setTimer(0);
    setTypingStats({
      wpm: 0,
      accuracy: 0,
      errors: 0,
      keystrokes: 0
    });
    
    // Focus on the text input
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };
  
  // Complete typing practice
  const handleComplete = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      setEndTime(Date.now());
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Hide keyboard
      Keyboard.dismiss();
      
      toast.success("Typing practice completed!");
    }
  };
  
  // Restart typing practice
  const handleRestart = () => {
    setIsStarted(false);
    setIsCompleted(false);
    setText('');
    setTimer(0);
    setEndTime(null);
    setStartTime(null);
    setTypingStats({
      wpm: 0,
      accuracy: 0,
      errors: 0,
      keystrokes: 0
    });
    setShowKeyboard(false);
  };  // Submit typing practice results
  const handleSubmit = () => {
    toast.success("Typing practice results submitted!");
    navigation.goBack();
  };
  
  // Render typing content with highlighting
  const renderHighlightedContent = () => {
    // If not started, show the full content with highlighted keywords
    if (!isStarted) {
      return (
        <Text style={styles.contentText}>
          {TYPING_CONTENT.content}
        </Text>
      );
    }
    
    // When typing, highlight current line and keywords
    return (
      <View style={styles.typingContentContainer}>
        {contentLines.map((line, index) => (
          <View key={index} style={styles.contentLine}>
            <Text style={[
              styles.contentText,
              index === currentLineIndex && styles.activeLine,
              index < currentLineIndex && styles.completedLine
            ]}>
              {line}
            </Text>
          </View>
        ))}
      </View>
    );
  };
  
  // Render results screen when typing is completed
  const renderResults = () => {
    const totalTime = endTime && startTime ? ((endTime - startTime) / 1000).toFixed(1) : 0;
    
    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Typing Practice Results</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="speedometer" size={24} color={COLORS.neonBlue} />
            <Text style={styles.statValue}>{typingStats.wpm}</Text>
            <Text style={styles.statLabel}>WPM</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="check-circle" size={24} color={COLORS.neonGreen} />
            <Text style={styles.statValue}>{typingStats.accuracy}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="clock-outline" size={24} color={COLORS.neonPurple} />
            <Text style={styles.statValue}>{totalTime}s</Text>
            <Text style={styles.statLabel}>Time</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="keyboard" size={24} color={COLORS.neonOrange} />
            <Text style={styles.statValue}>{typingStats.keystrokes}</Text>
            <Text style={styles.statLabel}>Keystrokes</Text>
          </View>
        </View>
        
        <View style={styles.medalContainer}>
          {typingStats.wpm >= 60 ? (
            <View style={[styles.medal, styles.goldMedal]}>
              <MaterialCommunityIcons name="medal" size={40} color="#FFD700" />
              <Text style={styles.medalLabel}>Gold</Text>
            </View>
          ) : typingStats.wpm >= 40 ? (
            <View style={[styles.medal, styles.silverMedal]}>
              <MaterialCommunityIcons name="medal" size={40} color="#C0C0C0" />
              <Text style={styles.medalLabel}>Silver</Text>
            </View>
          ) : (
            <View style={[styles.medal, styles.bronzeMedal]}>
              <MaterialCommunityIcons name="medal" size={40} color="#CD7F32" />
              <Text style={styles.medalLabel}>Bronze</Text>
            </View>
          )}
          
          <View style={styles.medalTextContainer}>
            <Text style={styles.medalTitle}>
              {typingStats.wpm >= 60 ? 'Excellent Typing!' : 
                typingStats.wpm >= 40 ? 'Good Typing Skills!' : 
                'Keep Practicing!'}
            </Text>
            <Text style={styles.medalDescription}>
              {typingStats.wpm >= 60 ? 'You type faster than 85% of users.' : 
                typingStats.wpm >= 40 ? 'You type faster than 60% of users.' : 
                'With more practice, you can improve your typing speed.'}
            </Text>
          </View>
        </View>
        
        <View style={styles.keywordsContainer}>
          <Text style={styles.keywordsTitle}>Business Keywords Used:</Text>
          <View style={styles.keywordsList}>
            {TYPING_CONTENT.keywords.map((keyword, index) => {
              // Check if keyword was typed correctly
              const keywordRegex = new RegExp(keyword, 'i');
              const wasTyped = keywordRegex.test(text);
              
              return (
                <View 
                  key={index} 
                  style={[
                    styles.keywordBadge,
                    wasTyped ? styles.keywordBadgeTyped : styles.keywordBadgeMissed
                  ]}
                >
                  <Text style={styles.keywordText}>{keyword}</Text>
                  {wasTyped ? (
                    <MaterialCommunityIcons name="check" size={16} color={COLORS.neonGreen} />
                  ) : (
                    <MaterialCommunityIcons name="close" size={16} color={COLORS.neonOrange} />
                  )}
                </View>
              );
            })}
          </View>
        </View>
        
        <View style={styles.resultButtons}>
          <TouchableOpacity 
            style={[styles.resultButton, styles.retryButton]}
            onPress={handleRestart}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.resultButton, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit Results</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[COLORS.deepBlue, COLORS.softPurple]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Typing Practice</Text>
          {isStarted && !isCompleted && (
            <View style={styles.timerContainer}>
              <MaterialCommunityIcons name="clock-outline" size={20} color={COLORS.textPrimary} />
              <Text style={styles.timerText}>{formatTime(timer)}</Text>
            </View>
          )}
          {!isStarted && (
            <View style={{width: 80}} />
          )}
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.assignmentTitle}>{assignment?.title || TYPING_CONTENT.title}</Text>
          <Text style={styles.assignmentDescription}>
            {assignment?.preview || TYPING_CONTENT.description}
          </Text>
          
          <View style={styles.difficultyContainer}>
            <Text style={styles.difficultyLabel}>Difficulty:</Text>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{TYPING_CONTENT.difficulty}</Text>
            </View>
          </View>
        </View>
        
        {isCompleted ? (
          // Results view when typing is completed
          renderResults()
        ) : (
          // Typing practice view
          <View style={styles.contentContainer}>
            <ScrollView 
              style={styles.contentScroller} 
              contentContainerStyle={styles.contentScrollerInner}
              ref={scrollViewRef}
              showsVerticalScrollIndicator={true}
            >
              {renderHighlightedContent()}
            </ScrollView>
            
            {isStarted ? (
              <View style={styles.typingContainer}>
                <View style={styles.statsBar}>
                  <View style={styles.statItem}>
                    <Text style={styles.statItemLabel}>WPM</Text>
                    <Text style={styles.statItemValue}>{typingStats.wpm}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statItemLabel}>Accuracy</Text>
                    <Text style={styles.statItemValue}>{typingStats.accuracy}%</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statItemLabel}>Time</Text>
                    <Text style={styles.statItemValue}>{formatTime(timer)}</Text>
                  </View>
                </View>
                
                <TextInput
                  ref={textInputRef}
                  style={styles.typingInput}
                  multiline
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={text}
                  onChangeText={setText}
                  onFocus={() => setShowKeyboard(true)}
                  onBlur={() => setShowKeyboard(false)}
                  placeholder="Start typing here..."
                  placeholderTextColor={COLORS.textSecondary}
                />
                
                <TouchableOpacity 
                  style={styles.stopButton}
                  onPress={handleComplete}
                >
                  <Text style={styles.stopButtonText}>Complete Practice</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.startContainer}>
                <View style={styles.keywordsPreview}>
                  <Text style={styles.keywordsPreviewTitle}>Business Keywords to Practice:</Text>
                  <View style={styles.keywordsPreviewList}>
                    {TYPING_CONTENT.keywords.map((keyword, index) => (
                      <View key={index} style={styles.keywordPreviewBadge}>
                        <Text style={styles.keywordPreviewText}>{keyword}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                
                <View style={styles.instructionsContainer}>
                  <View style={styles.instructionItem}>
                    <MaterialCommunityIcons name="keyboard" size={24} color={COLORS.neonBlue} />
                    <Text style={styles.instructionText}>Type the complete text accurately</Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <MaterialCommunityIcons name="timer-outline" size={24} color={COLORS.neonPurple} />
                    <Text style={styles.instructionText}>Focus on speed while maintaining accuracy</Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <MaterialCommunityIcons name="lightbulb-on" size={24} color={COLORS.neonGreen} />
                    <Text style={styles.instructionText}>Pay attention to proper formatting</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.startButton}
                  onPress={handleStart}
                >
                  <Text style={styles.startButtonText}>Start Typing Practice</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  timerText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  assignmentTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
  },
  assignmentDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginRight: 5,
  },
  difficultyBadge: {
    backgroundColor: `${COLORS.neonBlue}20`,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  difficultyText: {
    color: COLORS.neonBlue,
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  contentScroller: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 20,
  },
  contentScrollerInner: {
    padding: 15,
  },
  typingContentContainer: {
    width: '100%',
  },
  contentLine: {
    marginBottom: 5,
  },
  contentText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  activeLine: {
    backgroundColor: `${COLORS.neonBlue}20`,
    fontWeight: '700',
    color: COLORS.neonBlue,
  },
  completedLine: {
    color: COLORS.textSecondary,
  },
  typingContainer: {
    width: '100%',
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statItemLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 3,
  },
  statItemValue: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 10,
  },
  typingInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 15,
    minHeight: 100,
    color: COLORS.textPrimary,
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 24,
    textAlignVertical: 'top',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  stopButton: {
    backgroundColor: COLORS.neonOrange,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  stopButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  keywordsPreview: {
    marginBottom: 20,
  },
  keywordsPreviewTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  keywordsPreviewList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keywordPreviewBadge: {
    backgroundColor: `${COLORS.neonPurple}20`,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    margin: 3,
  },
  keywordPreviewText: {
    color: COLORS.neonPurple,
    fontSize: 12,
    fontWeight: '600',
  },
  instructionsContainer: {
    marginBottom: 30,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  instructionText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    marginLeft: 15,
  },
  startButton: {
    backgroundColor: COLORS.neonGreen,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  startButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  resultsTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 5,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  medalContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  medal: {
    alignItems: 'center',
    marginRight: 15,
  },
  goldMedal: {
    // Specific styling for gold medal if needed
  },
  silverMedal: {
    // Specific styling for silver medal if needed
  },
  bronzeMedal: {
    // Specific styling for bronze medal if needed
  },
  medalLabel: {
    color: COLORS.textPrimary,
    fontSize: 12,
    marginTop: 5,
  },
  medalTextContainer: {
    flex: 1,
  },
  medalTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },
  medalDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  keywordsContainer: {
    marginBottom: 20,
  },
  keywordsTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keywordBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    margin: 3,
  },
  keywordBadgeTyped: {
    backgroundColor: `${COLORS.neonGreen}20`,
  },
  keywordBadgeMissed: {
    backgroundColor: `${COLORS.neonOrange}20`,
  },
  keywordText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    marginRight: 5,
  },
  resultButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 10,
  },
  retryButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: COLORS.neonGreen,
    marginLeft: 10,
  },
  submitButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});