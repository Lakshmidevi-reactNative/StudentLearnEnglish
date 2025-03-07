import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Platform,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { COLORS } from '../constants/Colors';
import { toast } from 'sonner-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Mock practice data - this would come from your API
const PRACTICE_DATA = {
  title: "Economy",
  words: [
    { id: 1, text: "Investment", completed: false },
    { id: 2, text: "Taxation", completed: false },
    { id: 3, text: "Inflation", completed: false }
  ],
  sentences: [
    { id: 1, text: "The economy showed signs of recovery in the third quarter.", completed: false },
    { id: 2, text: "Inflation rates have decreased by two percentage points.", completed: false },
    { id: 3, text: "Financial analysts predict market growth in the coming month.", completed: false }
  ],
  paragraphs: [
    { id: 1, text: "The global economy faces significant challenges with rising inflation and supply chain disruptions. Central banks worldwide are implementing monetary policies to stabilize markets and control inflation rates. Economists predict a gradual recovery over the next fiscal year.", completed: false },
    { id: 2, text: "Investment patterns have shifted dramatically in response to economic uncertainty. Small businesses are seeking alternative funding sources while large corporations build cash reserves. Government stimulus packages continue to influence market dynamics.", completed: false },
    { id: 3, text: "Economic indicators suggest a mixed outlook for international trade. Some sectors show robust growth while others face persistent challenges. Policymakers must balance short-term interventions with long-term sustainability goals.", completed: false }
  ]
};

export default function LanguageAttemptScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const assignment = route.params?.assignment || null;
  
  // State for practice mode
  const [activeTab, setActiveTab] = useState('words');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  
  // State for recording
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // State for practice completion
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [sentencesCompleted, setSentencesCompleted] = useState(0);
  const [paragraphsCompleted, setParagraphsCompleted] = useState(0);
  
  // State for results
  const [showResults, setShowResults] = useState(false);
  const [scores, setScores] = useState({
    overall: 0,
    fluency: 0,
    accuracy: 0,
    integrity: 0
  });

  // Canvas reference for visualizer (would need to use a native module in production)
  const visualizerRef = useRef(null);
  
  // Cleanup audio resources when component unmounts
  useEffect(() => {
    return () => {
      if (recording) {
        stopRecording();
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [recording, sound]);

  // Audio recording functions
  const startRecording = async () => {
    try {
      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        toast.error('Microphone permission is required');
        return;
      }
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      
      // Here you would start visualizer in a real implementation
      
    } catch (err) {
      console.error('Failed to start recording', err);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    
    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      
      // In a real app, you would send this recording to your API for analysis
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);
      
      // Simulate getting a score from the API
      simulateScoring();
      
      // Mark current item as completed
      markCurrentItemAsCompleted();
      
      // Create a playback object
      const { sound } = await Audio.Sound.createAsync({ uri });
      setSound(sound);
      
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
      toast.error('Failed to stop recording');
    }
  };

  const playRecording = async () => {
    if (!sound) return;
    
    try {
      setIsPlaying(true);
      await sound.replayAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (err) {
      console.error('Failed to play recording', err);
      toast.error('Failed to play recording');
      setIsPlaying(false);
    }
  };

  const playReference = () => {
    // In a real app, this would play the reference audio
    toast.info('Playing reference audio...');
  };

  // Navigation functions
  const handleNext = () => {
    const currentTab = activeTab;
    
    if (currentTab === 'words') {
      if (currentWordIndex < PRACTICE_DATA.words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
      } else {
        // All words completed
        toast.success('All words completed!');
      }
    } else if (currentTab === 'sentences') {
      if (currentSentenceIndex < PRACTICE_DATA.sentences.length - 1) {
        setCurrentSentenceIndex(currentSentenceIndex + 1);
      } else {
        // All sentences completed
        toast.success('All sentences completed!');
      }
    } else if (currentTab === 'paragraphs') {
      if (currentParagraphIndex < PRACTICE_DATA.paragraphs.length - 1) {
        setCurrentParagraphIndex(currentParagraphIndex + 1);
      } else {
        // All paragraphs completed
        toast.success('All paragraphs completed!');
        // Show results when all exercises are completed
        if (wordsCompleted === PRACTICE_DATA.words.length && 
            sentencesCompleted === PRACTICE_DATA.sentences.length &&
            paragraphsCompleted === PRACTICE_DATA.paragraphs.length) {
          setShowResults(true);
        }
      }
    }
  };

  // Helper functions
  const markCurrentItemAsCompleted = () => {
    const currentTab = activeTab;
    
    if (currentTab === 'words') {
      const newWords = [...PRACTICE_DATA.words];
      newWords[currentWordIndex].completed = true;
      setWordsCompleted(prev => prev + 1);
    } else if (currentTab === 'sentences') {
      const newSentences = [...PRACTICE_DATA.sentences];
      newSentences[currentSentenceIndex].completed = true;
      setSentencesCompleted(prev => prev + 1);
    } else if (currentTab === 'paragraphs') {
      const newParagraphs = [...PRACTICE_DATA.paragraphs];
      newParagraphs[currentParagraphIndex].completed = true;
      setParagraphsCompleted(prev => prev + 1);
    }
  };

  const simulateScoring = () => {
    // Simulate API response with scores
    const newScores = {
      overall: Math.floor(Math.random() * 21) + 80, // 80-100
      fluency: Math.floor(Math.random() * 31) + 70, // 70-100
      accuracy: Math.floor(Math.random() * 26) + 75, // 75-100
      integrity: Math.floor(Math.random() * 31) + 70 // 70-100
    };
    
    setScores(newScores);
  };

  // Render functions for different tabs
  const renderWordsTab = () => {
    const currentWord = PRACTICE_DATA.words[currentWordIndex];
    const isAllCompleted = wordsCompleted === PRACTICE_DATA.words.length;
    
    if (isAllCompleted) {
      return (
        <View style={styles.completionContainer}>
          <MaterialCommunityIcons 
            name="check-circle" 
            size={48} 
            color={COLORS.neonGreen} 
          />
          <Text style={styles.completionText}>
            Great job! You've completed the words exercise.
          </Text>
        </View>
      );
    }
    
    return (
      <View style={styles.practiceContainer}>
        <Text style={styles.progressText}>
          Words Completed: {wordsCompleted} / {PRACTICE_DATA.words.length}
        </Text>
        
        <View style={styles.contentCard}>
          <Text style={styles.practiceText}>{currentWord.text}</Text>
          <TouchableOpacity 
            style={styles.audioButton}
            onPress={playReference}
          >
            <MaterialCommunityIcons 
              name="volume-high" 
              size={20} 
              color={COLORS.neonBlue} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.visualizerContainer}>
          {isRecording && (
            <View style={styles.waveContainer}>
              {[...Array(8)].map((_, i) => (
                <View key={i} style={styles.waveBar} />
              ))}
            </View>
          )}
        </View>
        
        <View style={styles.controlsContainer}>
          {!isRecording ? (
            <TouchableOpacity 
              style={styles.recordButton}
              onPress={startRecording}
            >
              <MaterialCommunityIcons 
                name="microphone" 
                size={28} 
                color={COLORS.textPrimary} 
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.recordButton, styles.stopButton]}
              onPress={stopRecording}
            >
              <MaterialCommunityIcons 
                name="stop" 
                size={28} 
                color={COLORS.textPrimary} 
              />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={handleNext}
          >
            <Text style={styles.navigationButtonText}>Next</Text>
            <MaterialCommunityIcons 
              name="arrow-right" 
              size={20} 
              color={COLORS.textPrimary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSentencesTab = () => {
    const currentSentence = PRACTICE_DATA.sentences[currentSentenceIndex];
    const isAllCompleted = sentencesCompleted === PRACTICE_DATA.sentences.length;
    
    if (isAllCompleted) {
      return (
        <View style={styles.completionContainer}>
          <MaterialCommunityIcons 
            name="check-circle" 
            size={48} 
            color={COLORS.neonGreen} 
          />
          <Text style={styles.completionText}>
            Great job! You've completed the sentence exercise.
          </Text>
        </View>
      );
    }
    
    return (
      <View style={styles.practiceContainer}>
        <Text style={styles.progressText}>
          Sentences Completed: {sentencesCompleted} / {PRACTICE_DATA.sentences.length}
        </Text>
        
        <View style={styles.contentCard}>
          <Text style={styles.practiceText}>{currentSentence.text}</Text>
          <TouchableOpacity 
            style={styles.audioButton}
            onPress={playReference}
          >
            <MaterialCommunityIcons 
              name="volume-high" 
              size={20} 
              color={COLORS.neonBlue} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.visualizerContainer}>
          {isRecording && (
            <View style={styles.waveContainer}>
              {[...Array(8)].map((_, i) => (
                <View key={i} style={styles.waveBar} />
              ))}
            </View>
          )}
        </View>
        
        <View style={styles.controlsContainer}>
          {!isRecording ? (
            <TouchableOpacity 
              style={styles.recordButton}
              onPress={startRecording}
            >
              <MaterialCommunityIcons 
                name="microphone" 
                size={28} 
                color={COLORS.textPrimary} 
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.recordButton, styles.stopButton]}
              onPress={stopRecording}
            >
              <MaterialCommunityIcons 
                name="stop" 
                size={28} 
                color={COLORS.textPrimary} 
              />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={handleNext}
          >
            <Text style={styles.navigationButtonText}>Next</Text>
            <MaterialCommunityIcons 
              name="arrow-right" 
              size={20} 
              color={COLORS.textPrimary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderParagraphsTab = () => {
    const currentParagraph = PRACTICE_DATA.paragraphs[currentParagraphIndex];
    const isAllCompleted = paragraphsCompleted === PRACTICE_DATA.paragraphs.length;
    
    if (isAllCompleted) {
      return (
        <View style={styles.completionContainer}>
          <MaterialCommunityIcons 
            name="check-circle" 
            size={48} 
            color={COLORS.neonGreen} 
          />
          <Text style={styles.completionText}>
            Great job! You've completed the paragraph exercise.
          </Text>
        </View>
      );
    }
    
    return (
      <View style={styles.practiceContainer}>
        <Text style={styles.progressText}>
          Paragraphs Completed: {paragraphsCompleted} / {PRACTICE_DATA.paragraphs.length}
        </Text>
        
        <View style={styles.contentCard}>
          <Text style={styles.practiceText}>{currentParagraph.text}</Text>
          <TouchableOpacity 
            style={styles.audioButton}
            onPress={playReference}
          >
            <MaterialCommunityIcons 
              name="volume-high" 
              size={20} 
              color={COLORS.neonBlue} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.visualizerContainer}>
          {isRecording && (
            <View style={styles.waveContainer}>
              {[...Array(8)].map((_, i) => (
                <View key={i} style={styles.waveBar} />
              ))}
            </View>
          )}
        </View>
        
        <View style={styles.controlsContainer}>
          {!isRecording ? (
            <TouchableOpacity 
              style={styles.recordButton}
              onPress={startRecording}
            >
              <MaterialCommunityIcons 
                name="microphone" 
                size={28} 
                color={COLORS.textPrimary} 
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.recordButton, styles.stopButton]}
              onPress={stopRecording}
            >
              <MaterialCommunityIcons 
                name="stop" 
                size={28} 
                color={COLORS.textPrimary} 
              />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={handleNext}
          >
            <Text style={styles.navigationButtonText}>Next</Text>
            <MaterialCommunityIcons 
              name="arrow-right" 
              size={20} 
              color={COLORS.textPrimary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderResults = () => {
    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Performance Summary</Text>
        
        <View style={styles.scoreCardsContainer}>
          {/* Overall Score */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreCardTitle}>Overall Score</Text>
            <Text style={styles.scoreCardValue}>{scores.overall}%</Text>
          </View>
          
          {/* Fluency */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreCardTitle}>Fluency</Text>
            <Text style={styles.scoreCardValue}>{scores.fluency}%</Text>
          </View>
          
          {/* Accuracy */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreCardTitle}>Accuracy</Text>
            <Text style={styles.scoreCardValue}>{scores.accuracy}%</Text>
          </View>
          
          {/* Integrity */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreCardTitle}>Integrity</Text>
            <Text style={styles.scoreCardValue}>{scores.integrity}%</Text>
          </View>
        </View>
        
        <View style={styles.resultButtons}>
          <TouchableOpacity 
            style={[styles.resultButton, styles.retryButton]}
            onPress={() => {
              setShowResults(false);
              setWordsCompleted(0);
              setSentencesCompleted(0);
              setParagraphsCompleted(0);
              setCurrentWordIndex(0);
              setCurrentSentenceIndex(0);
              setCurrentParagraphIndex(0);
              
              // Reset completed status
              PRACTICE_DATA.words.forEach(word => word.completed = false);
              PRACTICE_DATA.sentences.forEach(sentence => sentence.completed = false);
              PRACTICE_DATA.paragraphs.forEach(paragraph => paragraph.completed = false);
            }}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.resultButton, styles.completeButton]}
            onPress={() => {
              toast.success("Assignment completed successfully!");
              navigation.goBack();
            }}
          >
            <Text style={styles.completeButtonText}>Complete</Text>
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
          <Text style={styles.headerTitle}>Language Practice</Text>
          <View style={styles.spacer}></View>
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.assignmentTitle}>{PRACTICE_DATA.title}</Text>
          <Text style={styles.assignmentDescription}>
            Practice pronunciation and speaking fluency
          </Text>
        </View>
        
        {showResults ? (
          renderResults()
        ) : (
          <View style={styles.content}>
            <View style={styles.tabsContainer}>
              <TouchableOpacity 
                style={[
                  styles.tabButton, 
                  activeTab === 'words' && styles.activeTabButton
                ]}
                onPress={() => setActiveTab('words')}
              >
                <Text style={[
                  styles.tabButtonText,
                  activeTab === 'words' && styles.activeTabButtonText
                ]}>
                  Words
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.tabButton, 
                  activeTab === 'sentences' && styles.activeTabButton
                ]}
                onPress={() => setActiveTab('sentences')}
              >
                <Text style={[
                  styles.tabButtonText,
                  activeTab === 'sentences' && styles.activeTabButtonText
                ]}>
                  Sentences
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.tabButton, 
                  activeTab === 'paragraphs' && styles.activeTabButton
                ]}
                onPress={() => setActiveTab('paragraphs')}
              >
                <Text style={[
                  styles.tabButtonText,
                  activeTab === 'paragraphs' && styles.activeTabButtonText
                ]}>
                  Paragraphs
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.tabContent}
              contentContainerStyle={styles.tabContentContainer}
              showsVerticalScrollIndicator={false}
            >
              {activeTab === 'words' && renderWordsTab()}
              {activeTab === 'sentences' && renderSentencesTab()}
              {activeTab === 'paragraphs' && renderParagraphsTab()}
            </ScrollView>
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
  spacer: {
    width: 40,
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
  },
  content: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeTabButton: {
    backgroundColor: COLORS.neonBlue,
  },
  tabButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabButtonText: {
    color: COLORS.textPrimary,
  },
  tabContent: {
    flex: 1,
  },
  tabContentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  progressText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  practiceContainer: {
    flex: 1,
  },
  contentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  practiceText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    lineHeight: 26,
    flex: 1,
  },
  audioButton: {
    marginLeft: 10,
    padding: 5,
  },
  visualizerContainer: {
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 4,
  },
  waveBar: {
    width: 4,
    height: 20,
    backgroundColor: COLORS.neonBlue,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  recordButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.neonBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  stopButton: {
    backgroundColor: COLORS.neonOrange,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  navigationButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completionText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 15,
  },
  // Results styles
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  resultsTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  scoreCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  scoreCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  scoreCardTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 10,
  },
  scoreCardValue: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  resultButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  resultButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
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
  completeButton: {
    backgroundColor: COLORS.neonGreen,
    marginLeft: 10,
  },
  completeButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});