import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Keyboard,
  Alert,
  FlatList,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../constants/Colors';
import { toast } from 'sonner-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Mock data for typing practice
const TYPING_DATA = {
  words: [
    "investment", "taxation"
  ],
  sentences: [
    "The economy showed signs of recovery in the third quarter.",
    "Inflation rates have decreased by two percentage points.",
    "Financial analysts predict market growth in the coming month.",
    "Investors are cautious about putting money into new ventures.",
    "The central bank decided to maintain current interest rates."
  ],
  paragraphs: [
    "The global economy faces significant challenges with rising inflation and supply chain disruptions. Central banks worldwide are implementing monetary policies to stabilize markets and control inflation rates. Economists predict a gradual recovery over the next fiscal year.",
    "Investment patterns have shifted dramatically in response to economic uncertainty. Small businesses are seeking alternative funding sources while large corporations build cash reserves. Government stimulus packages continue to influence market dynamics.",
    "Economic indicators suggest a mixed outlook for international trade. Some sectors show robust growth while others face persistent challenges. Policymakers must balance short-term interventions with long-term sustainability goals."
  ]
};

export default function TypingPracticeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const assignment = route.params?.assignment || null;
  
  // Section state
  const [activeTab, setActiveTab] = useState('words');
  const sectionOrder = ['words', 'sentences', 'paragraphs'];
  const [completedSections, setCompletedSections] = useState({
    words: null,
    sentences: null,
    paragraphs: null
  });
  
  // Text and typing state
  const [typingData, setTypingData] = useState(TYPING_DATA);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [inputText, setInputText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [sectionComplete, setSectionComplete] = useState(false);
  const [allComplete, setAllComplete] = useState(false);
  
  // Timer state
  const [wpm, setWpm] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [consistency, setConsistency] = useState(100);
  const [wpmHistory, setWpmHistory] = useState([]);
  
  // Assignment timer state
  const [assignmentTimeLimit] = useState(route.params?.timeLimit || 15 * 60); // 15 minutes in seconds
  const [remainingTime, setRemainingTime] = useState(assignmentTimeLimit);
  const [isTimeWarning, setIsTimeWarning] = useState(false);
  
  // Refs
  const inputRef = useRef(null);
  const timerInterval = useRef(null);
  const assignmentTimerInterval = useRef(null);
  const sectionResults = useRef({
    words: null,
    sentences: null,
    paragraphs: null
  });
  
  // Initialize the current text
  useEffect(() => {
    // Set a default empty string for currentText
    setCurrentText('');
    
    if (typingData && typingData[activeTab] && typingData[activeTab].length > 0) {
      if (currentItemIndex < typingData[activeTab].length) {
        setCurrentText(typingData[activeTab][currentItemIndex]);
        handleEmptyState(false);
      } else {
        // Reset to first item if index is out of bounds
        setCurrentItemIndex(0);
        setCurrentText(typingData[activeTab][0]);
        handleEmptyState(false);
      }
    } else {
      handleEmptyState(true);
    }
    
    // Reset states when tab changes
    setInputText('');
    setIsActive(false);
    setCorrectChars(0);
    setIncorrectChars(0);
    setWpm(0);
    
    // Check if this section is already completed
    if (completedSections[activeTab]) {
      setSectionComplete(true);
      setWpm(completedSections[activeTab].wpm || 0);
    } else {
      setSectionComplete(false);
    }
  }, [activeTab, currentItemIndex, typingData]);
  
  // Start assignment timer
  useEffect(() => {
    // Start the global assignment timer
    const startAssignmentTimer = () => {
      assignmentTimerInterval.current = setInterval(() => {
        setRemainingTime(prev => {
          const newTime = prev - 1;
          
          // Set warning when less than 1 minute remains
          if (newTime <= 60 && !isTimeWarning) {
            setIsTimeWarning(true);
          }
          
          // Time's up
          if (newTime <= 0) {
            handleTimeUp();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    };
    
    startAssignmentTimer();
    
    return () => {
      clearInterval(assignmentTimerInterval.current);
    };
  }, []);
  
  // Format the time from seconds to MM:SS
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle the text input changes
  const handleTextChange = (text) => {
    if (!isActive) {
      // Start the timer on first input
      setIsActive(true);
      setStartTime(Date.now());
      startWpmTimer();
    }
    
    setInputText(text);
    
    // Calculate correct and incorrect characters
    let correct = 0;
    let incorrect = 0;
    
    for (let i = 0; i < text.length; i++) {
      if (i < currentText.length) {
        if (text[i] === currentText[i]) {
          correct++;
        } else {
          incorrect++;
        }
      } else {
        incorrect++;
      }
    }
    
    setCorrectChars(correct);
    setIncorrectChars(incorrect);
    
    // Check if current item is completed
    if (text.length >= currentText.length) {
      const isTextCorrect = text === currentText;
      
      if (isTextCorrect) {
        // Move to next item or complete section
        if (currentItemIndex < typingData[activeTab].length - 1) {
          setTimeout(() => {
            moveToNextItem();
          }, 500);
        } else {
          completeSection();
        }
      }
    }
  };
  
  // Start the WPM timer
  const startWpmTimer = () => {
    timerInterval.current = setInterval(() => {
      if (startTime) {
        const elapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
        setTimeElapsed(elapsed);
        
        // Calculate WPM: (correct chars / 5) / minutes
        const currentWpm = Math.round((correctChars / 5) / Math.max(0.01, elapsed));
        setWpm(currentWpm);
        
        // Update WPM history for consistency calculation
        setWpmHistory(prev => {
          const newHistory = [...prev, currentWpm].slice(-10); // Keep last 10 readings
          
          // Calculate consistency
          if (newHistory.length >= 2) {
            const avg = newHistory.reduce((a, b) => a + b, 0) / newHistory.length;
            const variance = newHistory.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / newHistory.length;
            const consistencyValue = 100 - Math.min(100, Math.sqrt(variance));
            setConsistency(Math.round(consistencyValue));
          }
          
          return newHistory;
        });
        
        // Calculate accuracy
        const totalAttempts = correctChars + incorrectChars;
        const accuracyValue = totalAttempts > 0 ? Math.round((correctChars / totalAttempts) * 100) : 100;
        setAccuracy(accuracyValue);
      }
    }, 1000);
  };
  
  // Move to the next item in the current section
  const moveToNextItem = () => {
    // Reset state for next item
    setInputText('');
    setCorrectChars(0);
    setIncorrectChars(0);
    
    // Move to next item
    setCurrentItemIndex(prev => prev + 1);
    
    // Maintain the timer and WPM calculation
    // We don't reset startTime here to keep cumulative WPM for the section
  };
  
  // Complete the current section
  const completeSection = () => {
    // Stop the timer
    clearInterval(timerInterval.current);
    
    // Save section results
    const sectionResult = {
      wpm: wpm,
      accuracy: accuracy,
      time: Math.round(timeElapsed * 60), // convert to seconds
      characters: `${correctChars}/${correctChars + incorrectChars}/${incorrectChars}`,
      consistency: consistency
    };
    
    // Update completed sections
    setCompletedSections(prev => ({
      ...prev,
      [activeTab]: sectionResult
    }));
    
    // Store in ref for final submission
    sectionResults.current[activeTab] = sectionResult;
    
    // Show section completion
    setSectionComplete(true);
    
    // Check if all sections are completed
    const allSectionsComplete = sectionOrder.every(section => 
      sectionResults.current[section] !== null || isSectionEmpty(section)
    );
    
    setAllComplete(allSectionsComplete);
  };
  
  // Check if a section is empty
  const isSectionEmpty = (section) => {
    return !typingData[section] || typingData[section].length === 0;
  };
  
  // Handle moving to the next section
  const handleNextSection = () => {
    const currentIndex = sectionOrder.indexOf(activeTab);
    
    if (currentIndex < sectionOrder.length - 1) {
      // Move to next section
      setActiveTab(sectionOrder[currentIndex + 1]);
      setCurrentItemIndex(0);
      setIsActive(false);
      setStartTime(null);
      clearInterval(timerInterval.current);
    }
  };
  
  // Handle time up
  const handleTimeUp = () => {
    // Clear all timers
    clearInterval(timerInterval.current);
    clearInterval(assignmentTimerInterval.current);
    
    // Save current progress if active
    if (isActive) {
      const sectionResult = {
        wpm: wpm,
        accuracy: accuracy,
        time: Math.round(timeElapsed * 60),
        characters: `${correctChars}/${correctChars + incorrectChars}/${incorrectChars}`,
        consistency: consistency
      };
      
      sectionResults.current[activeTab] = sectionResult;
    }
    
    // Calculate overall results
    const results = calculateOverallResults();
    
    // Show alert
    Alert.alert(
      "Time's Up!",
      "Your assessment has been submitted successfully.",
      [
        { 
          text: "OK", 
          onPress: () => {
            // Submit results and navigate back
            submitResults(results);
            navigation.goBack();
          }
        }
      ]
    );
  };
  
  // Calculate overall results
  const calculateOverallResults = () => {
    // Create result object
    const results = {
      student_id: route.params?.studentId || 0,
      assignment_id: route.params?.assignmentId || 0
    };
    
    // Add results for each completed section
    Object.entries(sectionResults.current).forEach(([section, result]) => {
      if (result) {
        results[section] = [result];
      }
    });
    
    // Calculate overall score (average accuracy)
    const completedSections = Object.values(sectionResults.current).filter(r => r !== null);
    
    if (completedSections.length > 0) {
      const avgAccuracy = completedSections.reduce((sum, result) => sum + result.accuracy, 0) / completedSections.length;
      results.overall = Math.round(avgAccuracy * 10) / 10;
    } else {
      results.overall = 0;
    }
    
    return results;
  };
  
  // Submit results to server
  const submitResults = (results) => {
    // In a real app, you would make an API call here
    console.log("Submitting results:", results);
    toast.success("Results submitted successfully");
    
    // For demo purposes, we're just showing a toast and navigating back
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };
  
  // Handle the submit button press
  const handleSubmit = () => {
    const results = calculateOverallResults();
    
    // Show confirmation dialog
    Alert.alert(
      "Submit Results",
      "Are you sure you want to submit your results?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Submit", 
          onPress: () => {
            submitResults(results);
          }
        }
      ]
    );
  };
  
  // Render a character with highlight for matching
  const renderTextCharacter = (char, index) => {
    let style = styles.char;
    
    if (index < inputText.length) {
      if (inputText[index] === char) {
        style = [styles.char, styles.correctChar];
      } else {
        style = [styles.char, styles.incorrectChar];
      }
    }
    
    return (
      <Text key={index} style={style}>
        {char}
      </Text>
    );
  };
  
  // Handle empty state
  const handleEmptyState = (isEmpty) => {
    // If the section is empty, mark it as completed
    if (isEmpty && !completedSections[activeTab]) {
      // Mark as completed with default values
      const emptyResult = {
        wpm: 0,
        accuracy: 100,
        time: 0,
        characters: "0/0/0",
        consistency: 100
      };
      
      setCompletedSections(prev => ({
        ...prev,
        [activeTab]: emptyResult
      }));
      
      sectionResults.current[activeTab] = emptyResult;
      
      // Show next section button if not the last section
      const isLastSection = activeTab === sectionOrder[sectionOrder.length - 1];
      if (!isLastSection) {
        setSectionComplete(true);
      }
      
      // Check if all sections are completed
      const allSectionsComplete = sectionOrder.every(section => 
        sectionResults.current[section] !== null || isSectionEmpty(section)
      );
      
      setAllComplete(allSectionsComplete);
    }
  };
  
  // Render section content
  const renderSectionContent = () => {
    // Check if section is empty
    if (isSectionEmpty(activeTab)) {
      return (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="file-alt" size={48} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>No content available</Text>
          <Text style={styles.emptySubtitle}>There are no items to type in this section</Text>
          
          {activeTab !== sectionOrder[sectionOrder.length - 1] && (
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={handleNextSection}
            >
              <Text style={styles.nextButtonText}>Next Section</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          )}
        </View>
      );
    }
    
    // Check if section is already completed
    if (sectionComplete) {
      return (
        <View style={styles.resultsContainer}>
          <View style={styles.completionHeader}>
            <MaterialCommunityIcons name="check-circle" size={48} color={COLORS.neonGreen} />
            <Text style={styles.completionTitle}>
              Successfully completed the {activeTab} typing test!
            </Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>WPM:</Text>
              <Text style={styles.statValue}>{completedSections[activeTab]?.wpm || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Accuracy:</Text>
              <Text style={styles.statValue}>{completedSections[activeTab]?.accuracy || 0}%</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Time:</Text>
              <Text style={styles.statValue}>{completedSections[activeTab]?.time || 0}s</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Characters:</Text>
              <Text style={styles.statValue}>{completedSections[activeTab]?.characters || "0/0/0"}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Consistency:</Text>
              <Text style={styles.statValue}>{completedSections[activeTab]?.consistency || 0}%</Text>
            </View>
          </View>
          
          {activeTab !== sectionOrder[sectionOrder.length - 1] && (
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={handleNextSection}
            >
              <Text style={styles.nextButtonText}>Next Section</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          )}
        </View>
      );
    }
    
    // Render active typing section
    return (
      <View style={styles.typingContainer}>
        <View style={styles.textDisplay}>
          <View style={styles.charsContainer}>
            {currentText ? currentText.split('').map((char, index) => renderTextCharacter(char, index)) : null}
          </View>
        </View>
        
        <TextInput
          ref={inputRef}
          style={styles.inputField}
          value={inputText}
          onChangeText={handleTextChange}
          placeholder="Start typing here..."
          placeholderTextColor={COLORS.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          multiline={activeTab === 'paragraphs'}
        />
        
        <View style={styles.typingStats}>
          <View style={styles.statPill}>
            <Text style={styles.statPillLabel}>Accuracy:</Text>
            <Text style={styles.statPillValue}>{accuracy}%</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statPillLabel}>Characters:</Text>
            <Text style={styles.statPillValue}>{correctChars}/{correctChars + incorrectChars}</Text>
          </View>
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
          
          <View style={styles.timerContainer}>
            <MaterialCommunityIcons 
              name="clock-outline" 
              size={20} 
              color={isTimeWarning ? COLORS.neonOrange : COLORS.textPrimary} 
            />
            <Text style={[
              styles.timerText,
              isTimeWarning && styles.timerWarning
            ]}>
              {formatTime(remainingTime)}
            </Text>
          </View>
        </View>
        
        <View style={styles.wpmDisplay}>
          <Text style={styles.wpmText}>WPM: {wpm}</Text>
        </View>
        
        <View style={styles.tabsContainer}>
          {sectionOrder.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.activeTabButton,
                completedSections[tab] && styles.completedTabButton
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabButtonText,
                activeTab === tab && styles.activeTabButtonText
              ]}>
                {tab}
              </Text>
              {completedSections[tab] && (
                <MaterialCommunityIcons 
                  name="check" 
                  size={16} 
                  color={COLORS.neonGreen}
                  style={styles.completedIcon} 
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {renderSectionContent()}
        </ScrollView>
        
        {allComplete && (
          <View style={styles.submitContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Results</Text>
            </TouchableOpacity>
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
  timerWarning: {
    color: COLORS.neonOrange,
  },
  wpmDisplay: {
    alignItems: 'center',
    marginVertical: 15,
  },
  wpmText: {
    color: COLORS.neonBlue,
    fontSize: 22,
    fontWeight: '700',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: COLORS.neonBlue,
  },
  completedTabButton: {
    borderWidth: 1,
    borderColor: COLORS.neonGreen,
  },
  tabButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabButtonText: {
    color: COLORS.textPrimary,
  },
  completedIcon: {
    marginLeft: 5,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  typingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  textDisplay: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
  },
  charsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  char: {
    fontSize: 18,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  correctChar: {
    color: '#4caf50', // Green for correct
  },
  incorrectChar: {
    color: '#f44336', // Red for incorrect
  },
  inputField: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    minHeight: 100,
  },
  typingStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  statPill: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  statPillLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginRight: 5,
  },
  statPillValue: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  resultsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 20,
  },
  completionHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  completionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    width: '45%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 5,
  },
  statValue: {
    color: COLORS.neonBlue,
    fontSize: 18,
    fontWeight: '700',
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.neonBlue,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
  nextButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
  },
  submitContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  submitButton: {
    backgroundColor: COLORS.neonGreen,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});