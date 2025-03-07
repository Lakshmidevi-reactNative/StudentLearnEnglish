import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Animated,
  Alert,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

// Colors matching your web styles
const COLORS = {
  primaryColor: '#1F3BB3',
  accentColor: '#7978E9',
  lightBg: '#f8f9fa',
  borderColor: '#e0e0e0',
  white: '#FFFFFF',
  black: '#333333',
  green: '#4CAF50',
  red: '#dc3545',
  textPrimary: '#333333',
  textSecondary: '#666666',
};

// Mock Chivox SDK for development
const ChivoxSDK = {
  initialized: false,
  
  initialize: function() {
    console.log("Initializing mock Chivox SDK");
    this.initialized = true;
    return Promise.resolve();
  },
  
  record: function(options) {
    console.log("Mock Chivox recording started");
    console.log("Options:", options);
    
    // This would use the actual SDK in production
    return {
      start: () => console.log("Recording started"),
      stop: () => console.log("Recording stopped"),
    };
  },
  
  processAudio: function(audioUri, referenceText) {
    console.log("Processing audio with mock Chivox SDK");
    console.log("Audio URI:", audioUri);
    console.log("Reference text:", referenceText);
    
    // Simulate processing delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a mock score
        const score = {
          result: {
            overall: Math.floor(Math.random() * 100),
            fluency: { overall: Math.floor(Math.random() * 100) },
            pron: Math.floor(Math.random() * 100),
            integrity: Math.floor(Math.random() * 100),
            accuracy: Math.floor(Math.random() * 100),
            details: [
              { lab: "This", rec: "This" },
              { lab: "is", rec: "is" },
              { lab: "a", rec: "a" },
              { lab: "simulated", rec: "simulated" },
              { lab: "response", rec: "response" }
            ]
          },
          audioUrl: audioUri
        };
        
        resolve(score);
      }, 1500);
    });
  }
};

export default function RolePlayAttemptScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dialogContainerRef = useRef(null);
  const progressFillAnim = useRef(new Animated.Value(0)).current;
  const recordingTimeoutRef = useRef(null);
  const pulseAnimValue = useRef(new Animated.Value(1)).current;
  
  // Get assignment data from route params
  const { assignmentId = '12322', studentId = '3083' } = route.params || {};
  const springUrl = "https://dev.learnengspring"; // This should be passed or configured
  
  // State variables
  const [conversation, setConversation] = useState([]);
  const [role1, setRole1] = useState('');
  const [role2, setRole2] = useState('');
  const [responseDataQuestions, setResponseDataQuestions] = useState({});
  const [studentResults, setStudentResults] = useState({
    assignment_id: assignmentId,
    student_id: studentId,
    role_play: []
  });
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingPermission, setRecordingPermission] = useState(false);
  const [recording, setRecording] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [recordedAudioMap, setRecordedAudioMap] = useState({});
  const [audio, setAudio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize SDK and fetch data on component mount
  useEffect(() => {
    const initialize = async () => {
      try {
        await ChivoxSDK.initialize();
        await requestAudioPermission();
        await fetchAssignmentData();
        setIsLoading(false);
      } catch (error) {
        console.error("Initialization error:", error);
        setError("Failed to initialize the application. Please try again.");
        setIsLoading(false);
      }
    };
    
    initialize();
    
    // Cleanup function
    return () => {
      stopPlayback();
      cleanupRecording();
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
      Speech.stop();
    };
  }, []);

  // Fetch assignment data from API
  const fetchAssignmentData = async () => {
    try {
      console.log("Fetching assignment data for ID:", assignmentId);
      console.log("API URL:", `${springUrl}/assignment/get-all-question/${assignmentId}`);
      
      // For development, you can use this mock data if API isn't available
      if (process.env.NODE_ENV === 'development' && !process.env.USE_REAL_API) {
        console.log("Using mock data for development");
        
        // Mock data that mimics the API response
        const mockData = {
          data: [
            {
              "204": [
                {
                  assignment_question_id: "1001",
                  question_text: "{teacher:\"Hello, I wanted to discuss your recent assignment. How do you feel about your work on it?\",student:\"I put in a lot of effort, but I'm not sure if I fully understood the requirements for the research section.\"}"
                },
                {
                  assignment_question_id: "1002",
                  question_text: "{teacher:\"I appreciate your effort. The research section needed more primary sources. Could you explain your research approach?\",student:\"I mainly used online articles and books from the library. I see now that I should have included more interviews or survey data.\"}"
                },
                {
                  assignment_question_id: "1003",
                  question_text: "{teacher:\"I'd like to suggest working with a study group for your next assignment. What do you think about that idea?\",student:\"That sounds helpful. I could benefit from discussing ideas with classmates. Do you have any recommendations for forming a group?\"}"
                }
              ]
            }
          ]
        };
        
        processApiResponse(mockData);
        return;
      }
      
      // Real API call
      const response = await axios.get(`${springUrl}/assignment/get-all-question/${assignmentId}`);
      processApiResponse(response.data);
    } catch (error) {
      console.error('Failed to fetch the API:', error);
      setError('Failed to fetch assignment data. Please check your connection and try again.');
    }
  };
  
  // Process the API response data
  const processApiResponse = (responseData) => {
    if (responseData && responseData.data && responseData.data.length > 0) {
      const questionData = responseData.data[0];
      setResponseDataQuestions(questionData);
      
      const questions = questionData["204"]; // Assuming "204" contains the conversation data
      
      if (questions && Array.isArray(questions)) {
        const parsedConversation = [];
        
        for (const question of questions) {
          try {
            const parsedText = parseQuestionText(question.question_text);
            
            if (parsedText) {
              const roles = Object.keys(parsedText);
              
              setRole1(roles[0]);
              setRole2(roles[1]);
              
              const messages = Object.values(parsedText);
              
              const mappedConversation = {};
              roles.forEach((role, index) => {
                mappedConversation[role] = messages[index];
              });
              
              parsedConversation.push(mappedConversation);
            }
          } catch (parseError) {
            console.error("Failed to parse question_text:", question.question_text, parseError);
          }
        }
        
        setConversation(parsedConversation);
        console.log("Dynamic Conversation:", parsedConversation);
      }
    }
  };
  
  // Update progress when currentIndex changes
  useEffect(() => {
    if (conversation.length > 0 && currentIndex >= 0) {
      const progressPercentage = ((currentIndex + 1) / conversation.length) * 100;
      
      Animated.timing(progressFillAnim, {
        toValue: progressPercentage,
        duration: 500,
        useNativeDriver: false,
      }).start();
      
      // Show submit button when all exchanges are completed
      if (currentIndex >= conversation.length - 1 && sessionStarted) {
        handleSessionCompletion();
      }
    }
  }, [currentIndex, conversation.length]);
  
  // Start/stop pulse animation for recording button
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimValue, {
            toValue: 1.1,
            duration: 750,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimValue, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Stop animation
      pulseAnimValue.setValue(1);
      Animated.timing(pulseAnimValue).stop();
    }
    
    return () => {
      Animated.timing(pulseAnimValue).stop();
    };
  }, [isRecording]);
  
  // Parse question text to extract roles and messages
  const parseQuestionText = (questionText) => {
    try {
      // Extract the roles and their messages using the same regex pattern as web
      const matches = questionText.match(/{([^:]+):(".*?"),([^:]+):(".*?")}/);
      
      if (matches && matches.length === 5) {
        const role1 = matches[1].trim();
        const message1 = JSON.parse(matches[2]); // Parse the quoted string
        const role2 = matches[3].trim();
        const message2 = JSON.parse(matches[4]); // Parse the quoted string
        
        const result = {};
        result[role1] = message1;
        result[role2] = message2;
        
        return result;
      }
    } catch (error) {
      console.error("Parse error:", error);
    }
    
    return null;
  };
  
  // Request permission to record audio
  const requestAudioPermission = async () => {
    try {
      console.log("Requesting audio permission");
      const { status } = await Audio.requestPermissionsAsync();
      setRecordingPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'This app needs microphone access to record your responses.',
          [{ text: 'OK' }]
        );
      }
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Failed to get recording permission', error);
    }
  };
  
  // Start recording function
  const startRecording = async () => {
    if (!recordingPermission) {
      await requestAudioPermission();
      if (!recordingPermission) return;
    }
    
    try {
      console.log("Starting recording");
      
      // Configure recording session
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      
      // Prepare recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      
      // Auto stop after 30 seconds
      recordingTimeoutRef.current = setTimeout(() => {
        stopRecording();
      }, 30000);
      
    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert('Error', 'Failed to start recording');
      setIsRecording(false);
    }
  };
  
  // Stop recording function
  const stopRecording = async () => {
    if (!recording) return;
    
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
    }
    
    setIsRecording(false);
    
    try {
      console.log("Stopping recording");
      await recording.stopAndUnloadAsync();
      
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);
      
      // Get reference text for this exchange
      const referenceText = conversation[currentIndex][role2];
      
      // Process the audio with Chivox (or our mock for now)
      const score = await ChivoxSDK.processAudio(uri, referenceText);
      
      // Handle the score results
      handleRecordingComplete(score);
      
      // Reset recording
      setRecording(null);
      
    } catch (error) {
      console.error('Failed to stop recording', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };
  
  // Handle the recording completion and scoring
  const handleRecordingComplete = (score) => {
    if (score.hasOwnProperty("result") && currentIndex < conversation.length) {
      const results = score.result;
      console.log("Recording results:", results);
      
      const questionId = responseDataQuestions["204"][currentIndex].assignment_question_id;
      
      // Update student results
      const updatedResults = { ...studentResults };
      updatedResults.role_play.push({
        question_id: questionId,
        overallScore: results.overall,
        fluency: results.fluency.overall,
        pronunciation: results.pron,
        integrity: results.integrity,
        accuracy: results.accuracy
      });
      
      setStudentResults(updatedResults);
      
      // Store audio URL for this question
      if (score.audioUrl) {
        setRecordedAudioMap(prev => ({
          ...prev,
          [questionId]: generateAudioUrl(score.audioUrl)
        }));
      }
      
      // Show the user's response in the UI
      showRole2Dialog(score);
      
      // Move to next exchange
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      
      // Continue session if there are more exchanges
      if (nextIndex < conversation.length) {
        setTimeout(() => {
          continueSession();
        }, 1000);
      }
    }
  };
  
  // Generate a playable audio URL from the API response
  const generateAudioUrl = (audioUrl) => {
    // For a real Chivox implementation, this would need to convert the URL format
    if (audioUrl.includes(':')) {
      // If it's in the format from your web code: "server:path/file"
      let subUrl = audioUrl.split(":");
      let backUrl = subUrl[1].split("/");
      return 'https://' + subUrl[0] + '/' + backUrl[1] + '.mp3';
    }
    
    // For the mock/local implementation, return as is
    return audioUrl;
  };
  
  // Clean up recording resources
  const cleanupRecording = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
      } catch (error) {
        // Ignore errors on cleanup
      }
      setRecording(null);
    }
  };
  
  // Play audio recording
  const playAudio = async (audioUrl, index) => {
    // Stop any current playback
    await stopPlayback();
    
    try {
      console.log("Playing audio:", audioUrl);
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      
      setAudio(sound);
      setIsPlaying(true);
      setCurrentPlayingIndex(index);
      
      // Listen for playback status updates
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          setCurrentPlayingIndex(null);
        }
      });
      
      // Play the sound
      await sound.playAsync();
      
    } catch (error) {
      console.error('Failed to play audio', error);
      Alert.alert('Error', 'Failed to play audio');
      setIsPlaying(false);
      setCurrentPlayingIndex(null);
    }
  };
  
  // Stop audio playback
  const stopPlayback = async () => {
    if (audio) {
      try {
        await audio.stopAsync();
        await audio.unloadAsync();
      } catch (error) {
        // Ignore errors on cleanup
      }
      setAudio(null);
    }
    setIsPlaying(false);
    setCurrentPlayingIndex(null);
  };
  
  // Text-to-speech function
  const speakText = (text) => {
    // Stop any current speech
    Speech.stop();
    
    // Start new speech
    Speech.speak(text, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9,
      onStart: () => console.log("Speaking started"),
      onDone: () => console.log("Speaking finished"),
      onStopped: () => console.log("Speaking stopped"),
      onError: (error) => console.error("Speaking error:", error),
    });
  };
  
  // Start the roleplay session
  const startSession = () => {
    if (!conversation || conversation.length === 0) {
      Alert.alert('Error', 'No conversation data available. Please try again.');
      return;
    }
    
    console.log("Starting session");
    setSessionStarted(true);
    setMessages([]);
    setCurrentIndex(0);
    continueSession();
  };
  
  // Continue the roleplay session
  const continueSession = () => {
    if (currentIndex >= conversation.length) {
      setSessionStarted(false);
      handleSessionCompletion();
      return;
    }
    if (!conversation[currentIndex] || !conversation[currentIndex][role1]) {
      console.error("Invalid conversation data at index:", currentIndex);
      Alert.alert('Error', 'Invalid conversation data. Please restart the session.');
      return;
    }
    
    // Show the role1 message (e.g., Teacher's message)
    const role1Message = conversation[currentIndex][role1];
    addMessageToDialog(role1Message, role1);
    
    // Automatically speak the role1 message
    speakText(role1Message);
    
    // After a delay, show the role2 message (which user will respond to)
    setTimeout(() => {
      showRole2Dialog();
    }, 2000);
  };
  
  // Add a message to the dialog
  const addMessageToDialog = (text, role) => {
    const newMessage = {
      id: messages.length + 1,
      text: text,
      role: role,
      isUser: false,
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Scroll to bottom
    setTimeout(() => {
      if (dialogContainerRef.current) {
        dialogContainerRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };
  
  // Show the role2 dialog (student's message or response area)
  const showRole2Dialog = (result = null) => {
    if (!result) {
      // If no result provided, this is showing the initial prompt
      const role2Message = conversation[currentIndex][role2];
      addMessageToDialog(role2Message, role2);
    } else {
      // This is showing the result of the user's recording
      try {
        const totalResult = result.result;
        
        // For a real implementation, build a formatted version of the recognized words with color coding
        const formattedText = formatRecognizedWords(totalResult.details);
        
        const newMessage = {
          id: messages.length + 1,
          text: formattedText,
          role: role2,
          isUser: true,
          score: totalResult.overall,
          audioUri: result.audioUrl,
          questionId: responseDataQuestions["204"][currentIndex].assignment_question_id
        };
        
        setMessages(prevMessages => [...prevMessages, newMessage]);
        
        // Scroll to bottom
        setTimeout(() => {
          if (dialogContainerRef.current) {
            dialogContainerRef.current.scrollToEnd({ animated: true });
          }
        }, 100);
      } catch (error) {
        console.error("Error processing recording result:", error);
      }
    }
  };
  
  // Format recognized words for display
  const formatRecognizedWords = (details) => {
    // In a real implementation, this would create HTML with color-coded words
    // For now, we'll return a simple version
    if (!details || !Array.isArray(details)) {
      return "Your response has been recorded.";
    }
    
    // Simple text representation
    return details.map(detail => {
      const lab = detail.lab; // Reference word
      const rec = detail.rec; // Recognized word
      
      if (lab === "#") {
        return '';
      }
      
      if ((rec === "#" || rec === "UNK") && (lab !== "#")) {
        return `[${lab}] `;
      }
      
      if (lab === rec) {
        return `${lab} `;
      } else {
        return `[${lab}] `;
      }
    }).join('').trim();
  };
  
  // Handle session completion
  const handleSessionCompletion = () => {
    setIsSessionComplete(true);
  };
  
  // Submit assignment results to server
  const submitAssignment = async () => {
    try {
      console.log("Submitting results:", studentResults);
      
      // In a real app, send results to server
      const response = await axios.post(
        `${springUrl}/assignment/evaluation-save-score`,
        studentResults,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      console.log("Submit response:", response.data);
      
      // Show completion modal
      setShowSubmitModal(true);
      
      // Automatically navigate back after delay
      setTimeout(() => {
        setShowSubmitModal(false);
        navigation.navigate('student-assessment-roleplay-results', { assignmentId });
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting results:", error);
      Alert.alert('Error', 'Failed to submit assignment results');
    }
  };
  
  // Render a message bubble
  const renderMessage = (message, index) => {
    const isRole1 = message.role === role1;
    const showAudioControls = message.audioUri && message.isUser;
    
    return (
      <View 
        key={`message-${message.id}-${index}`} // Use a combination of id and index for a truly unique key
        style={[
          styles.message,
          isRole1 ? styles.role1Message : styles.role2Message
        ]}
      >
        <View style={styles.messageContent}>
          <Text style={styles.messageRole}>{message.role}</Text>
          <Text style={styles.messageText}>{message.text}</Text>
          
          {message.score !== undefined && (
            <Text style={[
              styles.scoreText,
              message.score < 25 ? styles.badScore : 
              message.score < 70 ? styles.mediumScore : styles.goodScore
            ]}>
              Score: <Text style={styles.scoreBold}>{message.score}%</Text>
            </Text>
          )}
        </View>
        
        <View style={styles.messageButtons}>
          {!message.isUser && (
            <TouchableOpacity 
              style={styles.playButton}
              onPress={() => speakText(message.text)}
            >
              <FontAwesome name="volume-up" size={12} color={COLORS.primaryColor} />
            </TouchableOpacity>
          )}
          
          {showAudioControls && (
            <TouchableOpacity 
              style={[
                styles.listenButton,
                currentPlayingIndex === index && isPlaying && styles.playingButton
              ]}
              onPress={() => {
                if (currentPlayingIndex === index && isPlaying) {
                  stopPlayback();
                } else {
                  playAudio(message.audioUri, index);
                }
              }}
            >
              <FontAwesome 
                name={currentPlayingIndex === index && isPlaying ? "pause" : "headphones"} 
                size={12} 
                color={(currentPlayingIndex === index && isPlaying) ? COLORS.white : COLORS.primaryColor} 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <Text style={styles.loadingText}>Loading assignment...</Text>
      </View>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar style="dark" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.errorButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Main render function
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.black} />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            <Text style={styles.roleTitle}>{role1 ? role1.charAt(0).toUpperCase() + role1.slice(1) : ''}</Text>
            -
            <Text style={styles.roleTitle}>{role2 ? role2.charAt(0).toUpperCase() + role2.slice(1) : ''}</Text>
            {' Role Play'}
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Exchanges:</Text>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>{Math.max(0, currentIndex)}</Text>
          </View>
          <Text style={styles.totalProgress}>/{conversation.length}</Text>
        </View>
      </View>
      
      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View 
          style={[
            styles.progressFill,
            {
              width: progressFillAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%']
              })
            }
          ]}
        />
      </View>
      
      {/* Chat area */}
      <ScrollView 
        ref={dialogContainerRef}
        style={styles.dialogContainer}
        contentContainerStyle={styles.dialogContent}
      >
        {messages.map((message, index) => renderMessage(message, index))}
      </ScrollView>
      
      {/* Footer */}
      <View style={styles.footer}>
        {!sessionStarted && !isSessionComplete ? (
          <TouchableOpacity
            style={styles.startButton}
            onPress={startSession}
          >
            <Text style={styles.startButtonText}>Start Assignment</Text>
          </TouchableOpacity>
        ) : isSessionComplete ? (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={submitAssignment}
          >
            <Text style={styles.submitButtonText}>Submit Assignment</Text>
          </TouchableOpacity>
        ) : (
          <Animated.View
            style={{
              transform: [{ scale: pulseAnimValue }]
            }}
          >
            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordingButton
              ]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <FontAwesome5
                name="microphone"
                size={18}
                color={isRecording ? COLORS.white : COLORS.black}
              />
              <Text style={[
                styles.recordButtonText,
                isRecording && styles.recordingButtonText
              ]}>
                {isRecording ? 'Stop Recording' : 'Record Response'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
      
      {/* Completion Modal */}
      <Modal
        visible={showSubmitModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.completionIcon}>
              <FontAwesome5 name="check-circle" size={50} color={COLORS.green} />
            </View>
            <Text style={styles.completionTitle}>Assignment Completed!</Text>
            <Text style={styles.completionMessage}>
              Great job! You've successfully completed the assignment.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  roleTitle: {
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  progressCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.lightBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primaryColor,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryColor,
  },
  totalProgress: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 5,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 7,
    backgroundColor: COLORS.lightBg,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primaryColor,
    width: 0,
  },
  dialogContainer: {
    flex: 1,
    backgroundColor: COLORS.lightBg,
  },
  dialogContent: {
    padding: 25,
    paddingBottom: 40,
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '75%',
    marginBottom: 15,
    padding: 10,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  role1Message: {
    backgroundColor: '#f0f7ff',
    alignSelf: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primaryColor,
  },
  role2Message: {
    backgroundColor: '#f5f5f5',
    alignSelf: 'flex-end',
    borderRightWidth: 4,
    borderRightColor: COLORS.accentColor,
  },
  messageContent: {
    flex: 1,
    marginRight: 8,
  },
  messageRole: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  scoreText: {
    fontSize: 14,
    marginTop: 5,
  },
  scoreBold: {
    fontWeight: '700',
  },
  goodScore: {
    color: COLORS.green,
  },
  mediumScore: {
    color: '#FFA000', // Amber/Orange color
  },
  badScore: {
    color: COLORS.red,
  },
  messageButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  listenButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  playingButton: {
    backgroundColor: COLORS.primaryColor,
    borderColor: COLORS.primaryColor,
  },
  footer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 25,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: COLORS.primaryColor,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignItems: 'center',
    width: '100%',
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.white,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightBg,
    borderWidth: 1,
    borderColor: '#dee2e6',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    width: '100%',
  },
  recordingButton: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },
  recordButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.black,
  },
  recordingButtonText: {
    color: COLORS.white,
  },
  submitButton: {
    backgroundColor: COLORS.primaryColor,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: Platform.OS === 'ios' ? 'blur(5px)' : undefined,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 15,
    maxWidth: 400,
    width: '80%',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  completionIcon: {
    fontSize: 40,
    color: COLORS.green,
    marginBottom: 5,
  },
  completionTitle: {
    fontSize: 24,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  completionMessage: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 10,
    textAlign: 'center',
  },
  
  // Animation keyframes are handled differently in React Native
  // We use the Animated API instead
  
  // Scale-up animation equivalent to web's scaleUp
  scaleUp: {
    transform: [{ scale: 1.05 }],
  },
  
  // Additional styles for pulse animation (used for recording button)
  // This would typically be implemented with Animated.loop in React Native
  pulse: {
    transform: [{ scale: 1.1 }],
  },
  
  // These are added to support any RTL languages
  rtlContainer: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    textAlign: 'right',
  },
  
  // Additional accessibility styles
  accessibilityFocus: {
    borderWidth: 2,
    borderColor: COLORS.accentColor,
  },
  
  // Loading state styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightBg,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginTop: 10,
  },
  
  // Error state styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightBg,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: 10,
  },
  errorButton: {
    backgroundColor: COLORS.primaryColor,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginTop: 20,
  },
  errorButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.white,
  },
  
  // Message animation styles - to be used with Animated API
  messageAnimationContainer: {
    opacity: 1, // Will be animated
    transform: [{ translateY: 0 }], // Will be animated from 20 to 0
  },
  
  // Button animation styles - to be used with Animated API
  buttonAnimationContainer: {
    transform: [{ scale: 1 }], // Will be animated
  },
  
  // Custom HTML rendering styles for formatted text (like color-coded words)
  formattedTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  correctWord: {
    color: COLORS.green,
    fontWeight: '500',
  },
  incorrectWord: {
    color: COLORS.red,
    fontWeight: '500',
  },
  missingWord: {
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  
  // Additional styles for different screen sizes
  tabletContainer: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
});

// Additional animations that would be created using the Animated API

// Function to create the pulse animation for the recording button
const createPulseAnimation = (value) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: 1.1,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
    ])
  );
};

// Function to create the slide-in animation for messages
const createSlideInAnimation = (value) => {
  return Animated.timing(value, {
    toValue: { x: 0, y: 0 },
    duration: 300,
    useNativeDriver: true,
  });
};

// Function to create the button rotate animation
const createButtonRotateAnimation = (value) => {
  return Animated.timing(value, {
    toValue: 1.1,
    duration: 300,
    useNativeDriver: true,
  });
};

// These animation functions would be used in the component
// For example:
// const pulseAnim = useRef(new Animated.Value(1)).current;
// const startPulseAnimation = () => {
//   createPulseAnimation(pulseAnim).start();
// };