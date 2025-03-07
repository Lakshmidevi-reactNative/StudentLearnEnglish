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
import { useNavigation, useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { toast } from 'sonner-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { useTheme } from '../constants/ThemeContext';

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
  const { theme, colors, toggleTheme } = useTheme();
  
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

  // Canvas reference for visualizer
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

  // Get color for score - will reflect score level with color intensity
  const getScoreColor = (score) => {
    if (score >= 90) return colors.neonGreen;
    if (score >= 80) return colors.neonBlue;
    if (score >= 70) return colors.neonYellow;
    return colors.neonOrange;
  };

  // Render functions for different tabs
  const renderWordsTab = () => {
    const currentWord = PRACTICE_DATA.words[currentWordIndex];
    const isAllCompleted = wordsCompleted === PRACTICE_DATA.words.length;
    
    if (isAllCompleted) {
      return (
        <Animated.View 
          style={styles.completionContainer}
          entering={FadeIn.duration(500)}
        >
          <MaterialCommunityIcons 
            name="check-circle-outline" 
            size={60} 
            color={colors.neonGreen} 
          />
          <Text style={[styles.completionText, {color: colors.textPrimary}]}>
            Great job! You've completed the words exercise.
          </Text>
          <TouchableOpacity 
            style={[styles.nextSectionButton, {backgroundColor: colors.neonPurple}]}
            onPress={() => setActiveTab('sentences')}
          >
            <Text style={[styles.nextSectionButtonText, {color: colors.textPrimary}]}>
              Continue to Sentences
            </Text>
            <MaterialCommunityIcons 
              name="arrow-right" 
              size={20} 
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        </Animated.View>
      );
    }
    
    return (
      <View style={styles.practiceContainer}>
        <View style={[styles.progressBarContainer, {backgroundColor: 'rgba(255,255,255,0.1)'}]}>
          <View 
            style={[
              styles.progressBar, 
              {
                width: `${(wordsCompleted / PRACTICE_DATA.words.length) * 100}%`,
                backgroundColor: colors.neonBlue
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, {color: colors.textSecondary}]}>
          {wordsCompleted} / {PRACTICE_DATA.words.length} Words
        </Text>
        
        <Animated.View 
          style={[styles.contentCard, {backgroundColor: 'rgba(255,255,255,0.08)'}]}
          entering={FadeInDown.duration(300)}
          key={currentWordIndex}
        >
          <Text style={[styles.practiceText, {color: colors.textPrimary}]}>
            {currentWord.text}
          </Text>
          <TouchableOpacity 
            style={styles.audioButton}
            onPress={playReference}
          >
            <MaterialCommunityIcons 
              name="volume-high" 
              size={24} 
              color={colors.neonBlue} 
            />
          </TouchableOpacity>
        </Animated.View>
        
        <View style={[styles.visualizerContainer, {backgroundColor: 'rgba(255,255,255,0.05)'}]}>
          {isRecording ? (
            <View style={styles.waveContainer}>
              {[...Array(12)].map((_, i) => (
                <Animated.View 
                  key={i} 
                  style={[
                    styles.waveBar, 
                    {
                      height: 10 + Math.random() * 30,
                      backgroundColor: colors.neonPurple
                    }
                  ]} 
                />
              ))}
            </View>
          ) : (
            <Text style={[styles.visualizerPlaceholder, {color: colors.textSecondary}]}>
              {sound ? "Recording saved. Tap the mic to record again." : "Tap the mic button to start recording"}
            </Text>
          )}
        </View>
        
        <View style={styles.controlsContainer}>
          {sound && !isRecording && (
            <TouchableOpacity 
              style={[styles.playButton, {backgroundColor: 'rgba(255,255,255,0.1)'}]}
              onPress={playRecording}
              disabled={isPlaying}
            >
              <MaterialCommunityIcons 
                name={isPlaying ? "pause" : "play"} 
                size={28} 
                color={colors.textPrimary} 
              />
            </TouchableOpacity>
          )}
          
          {!isRecording ? (
            <TouchableOpacity 
              style={[styles.recordButton, {
                backgroundColor: sound ? 'rgba(255,255,255,0.15)' : colors.neonBlue
              }]}
              onPress={startRecording}
            >
              <MaterialCommunityIcons 
                name="microphone" 
                size={28} 
                color={colors.textPrimary} 
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.recordButton, styles.stopButton, {backgroundColor: colors.neonOrange}]}
              onPress={stopRecording}
            >
              <MaterialCommunityIcons 
                name="stop" 
                size={28} 
                color={colors.textPrimary} 
              />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.navigationButton, {
              backgroundColor: sound ? colors.neonBlue : 'rgba(255,255,255,0.1)',
              opacity: sound ? 1 : 0.5
            }]}
            onPress={handleNext}
            disabled={!sound}
          >
            <Text style={[styles.navigationButtonText, {color: colors.textPrimary}]}>Next</Text>
            <MaterialCommunityIcons 
              name="arrow-right" 
              size={22} 
              color={colors.textPrimary} 
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
        <Animated.View 
          style={styles.completionContainer}
          entering={FadeIn.duration(500)}
        >
          <MaterialCommunityIcons 
            name="check-circle-outline" 
            size={60} 
            color={colors.neonGreen} 
          />
          <Text style={[styles.completionText, {color: colors.textPrimary}]}>
            Great job! You've completed the sentence exercise.
          </Text>
          <TouchableOpacity 
            style={[styles.nextSectionButton, {backgroundColor: colors.neonPurple}]}
            onPress={() => setActiveTab('paragraphs')}
          >
            <Text style={[styles.nextSectionButtonText, {color: colors.textPrimary}]}>
              Continue to Paragraphs
            </Text>
            <MaterialCommunityIcons 
              name="arrow-right" 
              size={20} 
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        </Animated.View>
      );
    }
    
    return (
      <View style={styles.practiceContainer}>
        <View style={[styles.progressBarContainer, {backgroundColor: 'rgba(255,255,255,0.1)'}]}>
          <View 
            style={[
              styles.progressBar, 
              {
                width: `${(sentencesCompleted / PRACTICE_DATA.sentences.length) * 100}%`,
                backgroundColor: colors.neonBlue
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, {color: colors.textSecondary}]}>
          {sentencesCompleted} / {PRACTICE_DATA.sentences.length} Sentences
        </Text>
        
        <Animated.View 
          style={[styles.contentCard, {backgroundColor: 'rgba(255,255,255,0.08)'}]}
          entering={FadeInDown.duration(300)}
          key={currentSentenceIndex}
        >
          <Text style={[styles.practiceText, {color: colors.textPrimary}]}>
            {currentSentence.text}
          </Text>
          <TouchableOpacity 
            style={styles.audioButton}
            onPress={playReference}
          >
            <MaterialCommunityIcons 
              name="volume-high" 
              size={24} 
              color={colors.neonBlue} 
            />
          </TouchableOpacity>
        </Animated.View>
        
        <View style={[styles.visualizerContainer, {backgroundColor: 'rgba(255,255,255,0.05)'}]}>
          {isRecording ? (
            <View style={styles.waveContainer}>
              {[...Array(12)].map((_, i) => (
                <Animated.View 
                  key={i} 
                  style={[
                    styles.waveBar, 
                    {
                      height: 10 + Math.random() * 30,
                      backgroundColor: colors.neonPurple
                    }
                  ]} 
                />
              ))}
            </View>
          ) : (
            <Text style={[styles.visualizerPlaceholder, {color: colors.textSecondary}]}>
              {sound ? "Recording saved. Tap the mic to record again." : "Tap the mic button to start recording"}
            </Text>
          )}
        </View>
        
        <View style={styles.controlsContainer}>
          {sound && !isRecording && (
            <TouchableOpacity 
              style={[styles.playButton, {backgroundColor: 'rgba(255,255,255,0.1)'}]}
              onPress={playRecording}
              disabled={isPlaying}
            >
              <MaterialCommunityIcons 
                name={isPlaying ? "pause" : "play"} 
                size={28} 
                color={colors.textPrimary} 
              />
            </TouchableOpacity>
          )}
          
          {!isRecording ? (
            <TouchableOpacity 
              style={[styles.recordButton, {
                backgroundColor: sound ? 'rgba(255,255,255,0.15)' : colors.neonBlue
              }]}
              onPress={startRecording}
            >
              <MaterialCommunityIcons 
                name="microphone" 
                size={28} 
                color={colors.textPrimary} 
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.recordButton, styles.stopButton, {backgroundColor: colors.neonOrange}]}
              onPress={stopRecording}
            >
              <MaterialCommunityIcons 
                name="stop" 
                size={28} 
                color={colors.textPrimary} 
              />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.navigationButton, {
              backgroundColor: sound ? colors.neonBlue : 'rgba(255,255,255,0.1)',
              opacity: sound ? 1 : 0.5
            }]}
            onPress={handleNext}
            disabled={!sound}
          >
            <Text style={[styles.navigationButtonText, {color: colors.textPrimary}]}>Next</Text>
            <MaterialCommunityIcons 
              name="arrow-right" 
              size={22} 
              color={colors.textPrimary} 
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
        <Animated.View 
          style={styles.completionContainer}
          entering={FadeIn.duration(500)}
        >
          <MaterialCommunityIcons 
            name="check-circle-outline" 
            size={60} 
            color={colors.neonGreen} 
          />
          <Text style={[styles.completionText, {color: colors.textPrimary}]}>
            Great job! You've completed all exercises. Ready to view your results?
          </Text>
          <TouchableOpacity 
            style={[styles.nextSectionButton, {backgroundColor: colors.neonPurple}]}
            onPress={() => setShowResults(true)}
          >
            <Text style={[styles.nextSectionButtonText, {color: colors.textPrimary}]}>
              View Results
            </Text>
            <MaterialCommunityIcons 
              name="chart-bar" 
              size={20} 
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        </Animated.View>
      );
    }
    
    return (
      <View style={styles.practiceContainer}>
        <View style={[styles.progressBarContainer, {backgroundColor: 'rgba(255,255,255,0.1)'}]}>
          <View 
            style={[
              styles.progressBar, 
              {
                width: `${(paragraphsCompleted / PRACTICE_DATA.paragraphs.length) * 100}%`,
                backgroundColor: colors.neonBlue
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, {color: colors.textSecondary}]}>
          {paragraphsCompleted} / {PRACTICE_DATA.paragraphs.length} Paragraphs
        </Text>
        
        <Animated.View 
          style={[styles.contentCard, {backgroundColor: 'rgba(255,255,255,0.08)'}]}
          entering={FadeInDown.duration(300)}
          key={currentParagraphIndex}
        >
          <Text style={[styles.practiceText, {color: colors.textPrimary}]}>
            {currentParagraph.text}
          </Text>
          <TouchableOpacity 
            style={styles.audioButton}
            onPress={playReference}
          >
            <MaterialCommunityIcons 
              name="volume-high" 
              size={24} 
              color={colors.neonBlue} 
            />
          </TouchableOpacity>
        </Animated.View>
        
        <View style={[styles.visualizerContainer, {backgroundColor: 'rgba(255,255,255,0.05)'}]}>
          {isRecording ? (
            <View style={styles.waveContainer}>
              {[...Array(12)].map((_, i) => (
                <Animated.View 
                  key={i} 
                  style={[
                    styles.waveBar, 
                    {
                      height: 10 + Math.random() * 30,
                      backgroundColor: colors.neonPurple
                    }
                  ]} 
                />
              ))}
            </View>
          ) : (
            <Text style={[styles.visualizerPlaceholder, {color: colors.textSecondary}]}>
              {sound ? "Recording saved. Tap the mic to record again." : "Tap the mic button to start recording"}
            </Text>
          )}
        </View>
        
        <View style={styles.controlsContainer}>
          {sound && !isRecording && (
            <TouchableOpacity 
              style={[styles.playButton, {backgroundColor: 'rgba(255,255,255,0.1)'}]}
              onPress={playRecording}
              disabled={isPlaying}
            >
              <MaterialCommunityIcons 
                name={isPlaying ? "pause" : "play"} 
                size={28} 
                color={colors.textPrimary} 
              />
            </TouchableOpacity>
          )}
          
          {!isRecording ? (
            <TouchableOpacity 
              style={[styles.recordButton, {
                backgroundColor: sound ? 'rgba(255,255,255,0.15)' : colors.neonBlue
              }]}
              onPress={startRecording}
            >
              <MaterialCommunityIcons 
                name="microphone" 
                size={28} 
                color={colors.textPrimary} 
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.recordButton, styles.stopButton, {backgroundColor: colors.neonOrange}]}
              onPress={stopRecording}
            >
              <MaterialCommunityIcons 
                name="stop" 
                size={28} 
                color={colors.textPrimary} 
              />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.navigationButton, {
              backgroundColor: sound ? colors.neonBlue : 'rgba(255,255,255,0.1)',
              opacity: sound ? 1 : 0.5
            }]}
            onPress={handleNext}
            disabled={!sound}
          >
            <Text style={[styles.navigationButtonText, {color: colors.textPrimary}]}>Next</Text>
            <MaterialCommunityIcons 
              name="arrow-right" 
              size={22} 
              color={colors.textPrimary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderResults = () => {
    // Calculate overall progress
    const totalItems = PRACTICE_DATA.words.length + PRACTICE_DATA.sentences.length + PRACTICE_DATA.paragraphs.length;
    const completedItems = wordsCompleted + sentencesCompleted + paragraphsCompleted;
    const progress = (completedItems / totalItems) * 100;
    
    return (
      <Animated.View 
        style={styles.resultsContainer}
        entering={FadeIn.duration(500)}
      >
        <Text style={[styles.resultsTitle, {color: colors.textPrimary}]}>Performance Summary</Text>
        
        <View style={[styles.progressCircle, {borderColor: 'rgba(255,255,255,0.1)'}]}>
          <Text style={[styles.progressCircleText, {color: colors.textPrimary}]}>
            {scores.overall}%
          </Text>
          <Text style={[styles.progressCircleLabel, {color: colors.textSecondary}]}>
            Overall Score
          </Text>
        </View>
        
        <View style={styles.scoreCardsContainer}>
          {/* Fluency */}
          <View style={[styles.scoreCard, {backgroundColor: 'rgba(255,255,255,0.08)'}]}>
            <View style={styles.scoreCardIcon}>
              <MaterialCommunityIcons 
                name="voice" 
                size={24} 
                color={getScoreColor(scores.fluency)} 
              />
            </View>
            <Text style={[styles.scoreCardTitle, {color: colors.textSecondary}]}>
              Fluency
            </Text>
            <Text style={[styles.scoreCardValue, {color: getScoreColor(scores.fluency)}]}>
              {scores.fluency}%
            </Text>
          </View>
          
          {/* Accuracy */}
          <View style={[styles.scoreCard, {backgroundColor: 'rgba(255,255,255,0.08)'}]}>
            <View style={styles.scoreCardIcon}>
              <MaterialCommunityIcons 
                name="check-circle-outline" 
                size={24} 
                color={getScoreColor(scores.accuracy)} 
              />
            </View>
            <Text style={[styles.scoreCardTitle, {color: colors.textSecondary}]}>
              Accuracy
            </Text>
            <Text style={[styles.scoreCardValue, {color: getScoreColor(scores.accuracy)}]}>
              {scores.accuracy}%
            </Text>
          </View>
          
          {/* Integrity */}
          <View style={[styles.scoreCard, {backgroundColor: 'rgba(255,255,255,0.08)'}]}>
            <View style={styles.scoreCardIcon}>
              <MaterialCommunityIcons 
                name="puzzle-outline" 
                size={24} 
                color={getScoreColor(scores.integrity)} 
              />
            </View>
            <Text style={[styles.scoreCardTitle, {color: colors.textSecondary}]}>
              Integrity
            </Text>
            <Text style={[styles.scoreCardValue, {color: getScoreColor(scores.integrity)}]}>
              {scores.integrity}%
            </Text>
          </View>
        </View>
        
        <View style={[styles.feedbackCard, {backgroundColor: 'rgba(255,255,255,0.05)'}]}>
          <Text style={[styles.feedbackTitle, {color: colors.textPrimary}]}>
            Feedback
          </Text>
          <Text style={[styles.feedbackText, {color: colors.textSecondary}]}>
            Great work! Your pronunciation is clear and your rhythm is natural. 
            Focus on maintaining consistent speed when reading longer paragraphs.
          </Text>
        </View>
        
        <View style={styles.resultButtons}>
          <TouchableOpacity 
            style={[styles.resultButton, styles.retryButton, {backgroundColor: 'rgba(255,255,255,0.1)'}]}
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
            <Text style={[styles.retryButtonText, {color: colors.textPrimary}]}>Try Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.resultButton, styles.completeButton, {backgroundColor: colors.neonGreen}]}
            onPress={() => {
              toast.success("Assignment completed successfully!");
              navigation.goBack();
            }}
          >
            <Text style={[styles.completeButtonText, {color: colors.textPrimary}]}>Complete</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  // Determine gradient colors based on theme
  const gradientColors = theme === 'dark' 
    ? [colors.deepBlue, colors.softPurple]
    : ['#F8F9FA', '#E9ECEF'];

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, {backgroundColor: 'rgba(255, 255, 255, 0.1)'}]}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: colors.textPrimary}]}>Language Practice</Text>
          
          {/* Theme toggle button */}
          <TouchableOpacity 
            style={[styles.themeButton, {backgroundColor: 'rgba(255, 255, 255, 0.1)'}]}
            onPress={toggleTheme}
          >
            <MaterialCommunityIcons 
              name={theme === 'dark' ? 'white-balance-sunny' : 'moon-waning-crescent'} 
              size={22} 
              color={colors.textPrimary} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.titleContainer, {borderBottomColor: 'rgba(255, 255, 255, 0.1)'}]}>
          <Text style={[styles.assignmentTitle, {color: colors.textPrimary}]}>{PRACTICE_DATA.title}</Text>
          <Text style={[styles.assignmentDescription, {color: colors.textSecondary}]}>
            Practice pronunciation and speaking fluency
          </Text>
        </View>
        
        {showResults ? (
          renderResults()
        ) : (
          <View style={styles.content}>
            <View style={[styles.tabsContainer, {borderBottomColor: 'rgba(255, 255, 255, 0.1)'}]}>
              <TouchableOpacity 
                style={[
                  styles.tabButton, 
                  {backgroundColor: activeTab === 'words' 
                    ? colors.neonBlue 
                    : 'rgba(255, 255, 255, 0.1)'
                  }
                ]}
                onPress={() => setActiveTab('words')}
              >
                <Text style={[
                  styles.tabButtonText,
                  {color: activeTab === 'words' 
                    ? colors.textPrimary 
                    : colors.textSecondary
                  }
                ]}>
                  Words
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.tabButton, 
                  {backgroundColor: activeTab === 'sentences' 
                    ? colors.neonBlue 
                    : 'rgba(255, 255, 255, 0.1)'
                  }
                ]}
                onPress={() => setActiveTab('sentences')}
              >
                <Text style={[
                  styles.tabButtonText,
                  {color: activeTab === 'sentences' 
                    ? colors.textPrimary 
                    : colors.textSecondary
                  }
                ]}>
                  Sentences
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.tabButton, 
                  {backgroundColor: activeTab === 'paragraphs' 
                    ? colors.neonBlue 
                    : 'rgba(255, 255, 255, 0.1)'
                  }
                ]}
                onPress={() => setActiveTab('paragraphs')}
              >
                <Text style={[
                  styles.tabButtonText,
                  {color: activeTab === 'paragraphs' 
                    ? colors.textPrimary 
                    : colors.textSecondary
                  }
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