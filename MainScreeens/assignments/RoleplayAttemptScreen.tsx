import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome,
  Ionicons,
  Feather,
} from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";

import { COLORS } from "../constants/Colors";

const { width } = Dimensions.get("window");

// Mock Chivox SDK for development
const ChivoxSDK = {
  initialized: false,
  initialize: function () {
    console.log("Initializing mock Chivox SDK");
    this.initialized = true;
    return Promise.resolve();
  },
  record: function (options) {
    console.log("Mock Chivox recording started");
    return {
      start: () => console.log("Recording started"),
      stop: () => console.log("Recording stopped"),
    };
  },
  processAudio: function (audioUri, referenceText) {
    console.log("Processing audio with mock Chivox SDK");
    return new Promise((resolve) => {
      setTimeout(() => {
        const score = {
          result: {
            overall: Math.floor(Math.random() * 20) + 75,
            fluency: { overall: Math.floor(Math.random() * 100) },
            pron: Math.floor(Math.random() * 100),
            integrity: Math.floor(Math.random() * 100),
            accuracy: Math.floor(Math.random() * 100),
            details: [
              { lab: "This", rec: "This" },
              { lab: "is", rec: "is" },
              { lab: "a", rec: "a" },
              { lab: "simulated", rec: "simulated" },
              { lab: "response", rec: "response" },
            ],
          },
          audioUrl: audioUri,
        };
        resolve(score);
      }, 1500);
    });
  },
};

export default function RolePlayAttemptScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dialogContainerRef = useRef(null);
  const recordingTimeoutRef = useRef(null);

  // Animated values
  const pulseScale = useSharedValue(1);
  const progressValue = useSharedValue(0);

  // Get assignment data from route params with default empty object
  const {
    assignment = {},
    assignmentId = "12322",
    studentId = "3083",
  } = route.params || {};
  const springUrl = "https://dev.learnengspring";

  // State variables
  const [conversation, setConversation] = useState([]);
  const [role1, setRole1] = useState("teacher");
  const [role2, setRole2] = useState("student");
  const [responseDataQuestions, setResponseDataQuestions] = useState({});
  const [studentResults, setStudentResults] = useState({
    assignment_id: assignmentId,
    student_id: studentId,
    role_play: [],
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
  const [countdownValue, setCountdownValue] = useState(3); // Changed from 30 to 3

  // Pulse animation for recording button
  useEffect(() => {
    if (isRecording) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 750, easing: Easing.ease }),
          withTiming(1, { duration: 750, easing: Easing.ease })
        ),
        -1,
        false
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 300 });
    }
  }, [isRecording]);

  // Countdown timer for recording (changed to 3 seconds)
  useEffect(() => {
    let interval;
    if (isRecording) {
      let timeLeft = 3; // Changed from 30 to 3
      setCountdownValue(timeLeft);
      interval = setInterval(() => {
        timeLeft -= 1;
        setCountdownValue(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(interval);
          stopRecording();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Initialize and cleanup
  useEffect(() => {
    const initialize = async () => {
      try {
        await ChivoxSDK.initialize();
        const permissionGranted = await requestAudioPermission();
        if (permissionGranted) {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
          });
          console.log("Audio mode configured successfully");
        } else {
          console.warn("Audio mode not configured due to lack of permission");
        }

        if (assignment && assignment.title) {
          prepareMockConversation();
        } else {
          await fetchAssignmentData();
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Initialization error:", error);
        setError("Failed to initialize the application. Please try again.");
        setIsLoading(false);
      }
    };

    initialize();

    return () => {
      stopPlayback();
      cleanupRecording();
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
      Speech.stop();
      if (audio) {
        audio.unloadAsync().catch(() => {});
      }
    };
  }, []);

  // Progress update
  useEffect(() => {
    if (conversation.length > 0 && currentIndex >= 0) {
      const progressPercentage =
        ((currentIndex + 1) / conversation.length) * 100;
      progressValue.value = withTiming(progressPercentage, { duration: 500 });

      if (currentIndex >= conversation.length - 1 && sessionStarted) {
        handleSessionCompletion();
      }
    }
  }, [currentIndex, conversation.length]);

  // Helper functions
  const scrollToBottom = () => {
    if (dialogContainerRef.current) {
      setTimeout(() => {
        dialogContainerRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const prepareMockConversation = () => {
    const mockConversation = [
      {
        teacher:
          "Hello, I wanted to discuss your recent assignment. How do you feel about your work on it?",
        student:
          "I put in a lot of effort, but I'm not sure if I fully understood the requirements for the research section.",
      },
      {
        teacher:
          "I appreciate your effort. The research section needed more primary sources. Could you explain your research approach?",
        student:
          "I mainly used online articles and books from the library. I see now that I should have included more interviews or survey data.",
      },
      {
        teacher:
          "I'd like to suggest working with a study group for your next assignment. What do you think about that idea?",
        student:
          "That sounds helpful. I could benefit from discussing ideas with classmates. Do you have any recommendations for forming a group?",
      },
    ];

    setConversation(mockConversation);
    setResponseDataQuestions({
      "204": mockConversation.map((conv, idx) => ({
        assignment_question_id: `mock-${idx + 1}`,
        question_text: `{teacher:"${conv.teacher}",student:"${conv.student}"}`,
      })),
    });
  };

  const fetchAssignmentData = async () => {
    try {
      console.log("Fetching assignment data for ID:", assignmentId);
      const mockData = {
        data: [
          {
            "204": [
              {
                assignment_question_id: "1001",
                question_text:
                  '{teacher:"Hello, I wanted to discuss your recent assignment. How do you feel about your work on it?",student:"I put in a lot of effort, but I\'m not sure if I fully understood the requirements for the research section."}',
              },
              {
                assignment_question_id: "1002",
                question_text:
                  '{teacher:"I appreciate your effort. The research section needed more primary sources. Could you explain your research approach?",student:"I mainly used online articles and books from the library. I see now that I should have included more interviews or survey data."}',
              },
              {
                assignment_question_id: "1003",
                question_text:
                  '{teacher:"I\'d like to suggest working with a study group for your next assignment. What do you think about that idea?",student:"That sounds helpful. I could benefit from discussing ideas with classmates. Do you have any recommendations for forming a group?"}',
              },
            ],
          },
        ],
      };
      processApiResponse(mockData);
    } catch (error) {
      console.error("Failed to fetch the API:", error);
      setError(
        "Failed to fetch assignment data. Please check your connection and try again."
      );
    }
  };

  const processApiResponse = (responseData) => {
    if (responseData && responseData.data && responseData.data.length > 0) {
      const questionData = responseData.data[0];
      setResponseDataQuestions(questionData);

      const questions = questionData["204"];
      if (questions && Array.isArray(questions)) {
        const parsedConversation = [];
        for (const question of questions) {
          try {
            const parsedText = parseQuestionText(question.question_text);
            if (parsedText) {
              parsedConversation.push(parsedText);
            }
          } catch (parseError) {
            console.error(
              "Failed to parse question_text:",
              question.question_text,
              parseError
            );
          }
        }
        if (parsedConversation.length > 0) {
          const roles = Object.keys(parsedConversation[0]);
          setRole1(roles[0]);
          setRole2(roles[1]);
          setConversation(parsedConversation);
        }
      }
    }
  };

  const parseQuestionText = (questionText) => {
    try {
      const matches = questionText.match(/{([^:]+):(".*?"),([^:]+):(".*?")}/);
      if (matches && matches.length === 5) {
        const role1 = matches[1].trim();
        const message1 = JSON.parse(matches[2]);
        const role2 = matches[3].trim();
        const message2 = JSON.parse(matches[4]);
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

  const requestAudioPermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      const granted = status === "granted";
      setRecordingPermission(granted);
      console.log("Permission status:", granted);
      if (!granted) {
        Alert.alert(
          "Permission Required",
          "This app needs microphone access to record your responses.",
          [{ text: "OK" }]
        );
      }
      return granted;
    } catch (error) {
      console.error("Failed to get recording permission:", error);
      setRecordingPermission(false);
      return false;
    }
  };

  const startRecording = async () => {
    const hasPermission = await requestAudioPermission();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Microphone access is required to record.");
      return;
    }

    await cleanupRecording();

    try {
      const recordingObject = new Audio.Recording();
      console.log("Preparing recording...");
      await recordingObject.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recordingObject);
      setIsRecording(true);

      recordingTimeoutRef.current = setTimeout(() => {
        stopRecording();
      }, 3000); // Changed from 30000 (30s) to 3000 (3s)

      console.log("Starting recording...");
      const status = await recordingObject.getStatusAsync();
      if (status.canRecord) {
        await recordingObject.startAsync();
        console.log("Recording started successfully");
      } else {
        throw new Error("Recording object not ready");
      }
    } catch (error) {
      console.error("Failed to start recording:", error);
      Alert.alert("Error", "Failed to start recording: " + error.message);
      setIsRecording(false);
      await cleanupRecording();
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
    }

    setIsRecording(false);

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording stopped, URI:", uri);
      const referenceText = conversation[currentIndex][role2];
      const score = await ChivoxSDK.processAudio(uri, referenceText);
      handleRecordingComplete(score);
      setRecording(null);
    } catch (error) {
      console.error("Failed to stop recording:", error);
      Alert.alert("Error", "Failed to stop recording");
    }
  };

  const handleRecordingComplete = (score) => {
    if (score.hasOwnProperty("result") && currentIndex < conversation.length) {
      const results = score.result;
      const questionId = responseDataQuestions["204"]
        ? responseDataQuestions["204"][currentIndex].assignment_question_id
        : `mock-${currentIndex + 1}`;

      const updatedResults = { ...studentResults };
      updatedResults.role_play.push({
        question_id: questionId,
        overallScore: results.overall,
        fluency: results.fluency.overall,
        pronunciation: results.pron,
        integrity: results.integrity,
        accuracy: results.accuracy,
      });

      setStudentResults(updatedResults);

      if (score.audioUrl) {
        setRecordedAudioMap((prev) => ({
          ...prev,
          [questionId]: score.audioUrl,
        }));
      }

      showRole2Dialog(score);
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      if (nextIndex < conversation.length) {
        setTimeout(() => {
          continueSession();
        }, 1000);
      }
    }
  };

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

  const playAudio = async (audioUrl, index) => {
    await stopPlayback();
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      setAudio(sound);
      setIsPlaying(true);
      setCurrentPlayingIndex(index);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          setCurrentPlayingIndex(null);
        }
      });

      await sound.playAsync();
    } catch (error) {
      console.error("Failed to play audio:", error);
      Alert.alert("Error", "Failed to play audio");
      setIsPlaying(false);
      setCurrentPlayingIndex(null);
    }
  };

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

  const speakText = (text) => {
    Speech.stop();
    Speech.speak(text, {
      language: "en",
      pitch: 1.0,
      rate: 0.9,
      onStart: () => console.log("Speaking started"),
      onDone: () => console.log("Speaking finished"),
      onStopped: () => console.log("Speaking stopped"),
      onError: (error) => console.error("Speaking error:", error),
    });
  };

  const startSession = () => {
    if (!conversation || conversation.length === 0) {
      Alert.alert("Error", "No conversation data available. Please try again.");
      return;
    }
    setSessionStarted(true);
    setMessages([]);
    setCurrentIndex(0);
    setTimeout(() => {
      continueSession();
    }, 100);
  };

  const continueSession = () => {
    if (currentIndex < 0 || currentIndex >= conversation.length) {
      console.error("Invalid conversation index:", currentIndex);
      if (conversation.length > 0) {
        setCurrentIndex(0);
        return;
      }
      Alert.alert("Error", "No valid conversation data available.");
      return;
    }

    if (!conversation[currentIndex] || !conversation[currentIndex][role1]) {
      console.error("Invalid conversation data at index:", currentIndex);
      Alert.alert("Error", "Invalid conversation data. Please restart the session.");
      return;
    }

    const role1Message = conversation[currentIndex][role1];
    addMessageToDialog(role1Message, role1);
    speakText(role1Message);

    setTimeout(() => {
      showRole2Dialog();
    }, 2000);
  };

  const addMessageToDialog = (text, role) => {
    const newMessage = {
      id: messages.length + 1,
      text: text,
      role: role,
      isUser: false,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    scrollToBottom();
  };

  const showRole2Dialog = (result = null) => {
    if (!result) {
      const role2Message = conversation[currentIndex][role2];
      addMessageToDialog(role2Message, role2);
    } else {
      try {
        const totalResult = result.result;
        const formattedText = formatRecognizedWords(totalResult.details);
        const questionId = responseDataQuestions["204"]
          ? responseDataQuestions["204"][currentIndex].assignment_question_id
          : `mock-${currentIndex + 1}`;

        const newMessage = {
          id: messages.length + 1,
          text: formattedText,
          role: role2,
          isUser: true,
          score: totalResult.overall,
          audioUri: result.audioUrl,
          questionId: questionId,
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        scrollToBottom();
      } catch (error) {
        console.error("Error processing recording result:", error);
      }
    }
  };

  const formatRecognizedWords = (details) => {
    if (!details || !Array.isArray(details)) {
      return "Your response has been recorded.";
    }
    return conversation[currentIndex][role2];
  };

  const handleSessionCompletion = () => {
    setIsSessionComplete(true);
  };

  const submitAssignment = async () => {
    try {
      console.log("Submitting results:", studentResults);
      setShowSubmitModal(true);
      setTimeout(() => {
        setShowSubmitModal(false);
        navigation.goBack();
      }, 3000);
    } catch (error) {
      console.error("Error submitting results:", error);
      Alert.alert("Error", "Failed to submit assignment results");
    }
  };

  // Animation styles
  const recordButtonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const progressBarAnimStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value}%`,
  }));

  const getScoreColor = (score) => {
    if (score >= 80) return COLORS.neonGreen;
    if (score >= 60) return COLORS.neonBlue;
    if (score >= 40) return COLORS.neonOrange;
    return COLORS.neonRed || "#ff4d4d";
  };

  const renderMessage = (message, index) => {
    const isRole1 = message.role === role1;
    const showAudioControls = message.audioUri && message.isUser;

    return (
      <Animated.View
        key={`message-${message.id}-${index}`}
        entering={FadeInDown.delay(100 * index).duration(300)}
        style={[styles.message, isRole1 ? styles.role1Message : styles.role2Message]}
      >
        <View style={styles.messageHeader}>
          <View style={styles.roleNameContainer}>
            <View
              style={[
                styles.roleDot,
                { backgroundColor: isRole1 ? COLORS.neonBlue : COLORS.neonPurple },
              ]}
            />
            <Text style={styles.messageRole}>
              {message.role.charAt(0).toUpperCase() + message.role.slice(1)}
            </Text>
          </View>
          {message.score !== undefined && (
            <View
              style={[
                styles.scoreContainer,
                { backgroundColor: `${getScoreColor(message.score)}20` },
              ]}
            >
              <Text
                style={[styles.scoreText, { color: getScoreColor(message.score) }]}
              >
                {message.score}%
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.messageText}>{message.text}</Text>
        <View style={styles.messageFooter}>
          {showAudioControls && (
            <TouchableOpacity
              style={[
                styles.audioButton,
                currentPlayingIndex === index && isPlaying
                  ? { backgroundColor: COLORS.neonBlue }
                  : { backgroundColor: "rgba(255, 255, 255, 0.1)" },
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
                name={currentPlayingIndex === index && isPlaying ? "pause" : "play"}
                size={14}
                color={
                  currentPlayingIndex === index && isPlaying
                    ? "#fff"
                    : COLORS.textPrimary
                }
              />
              <Text
                style={[
                  styles.audioButtonText,
                  currentPlayingIndex === index && isPlaying
                    ? { color: "#fff" }
                    : { color: COLORS.textPrimary },
                ]}
              >
                {currentPlayingIndex === index && isPlaying
                  ? "Stop"
                  : "Play Recording"}
              </Text>
            </TouchableOpacity>
          )}
          {!message.isUser && (
            <TouchableOpacity
              style={styles.speakButton}
              onPress={() => speakText(message.text)}
            >
              <FontAwesome5 name="volume-up" size={14} color={COLORS.textPrimary} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={[COLORS.deepBlue, COLORS.softPurple]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <StatusBar backgroundColor="transparent" translucent />
          <View style={styles.loadingContainer}>
            <View style={styles.loadingCard}>
              <MaterialCommunityIcons
                name="loading"
                size={50}
                color={COLORS.neonBlue}
                style={{ marginBottom: 20 }}
              />
              <Text style={styles.loadingText}>Loading Role Play Assignment</Text>
              <Text style={styles.loadingSubtext}>
                Setting up your practice session...
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={[COLORS.deepBlue, COLORS.softPurple]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <StatusBar backgroundColor="transparent" translucent />
          <View style={styles.errorContainer}>
            <View style={styles.errorCard}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={50}
                color={COLORS.neonOrange}
                style={{ marginBottom: 20 }}
              />
              <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.errorButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.errorButtonText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.deepBlue, COLORS.softPurple]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Role Play Practice</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={22}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.assignmentInfo}>
          <LinearGradient
            colors={["rgba(0, 180, 255, 0.2)", "rgba(176, 38, 255, 0.2)"]}
            style={styles.assignmentCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.assignmentCardContent}>
              <View style={styles.roleContainer}>
                <View
                  style={[
                    styles.roleBadge,
                    { backgroundColor: `${COLORS.neonBlue}40` },
                  ]}
                >
                  <Text style={[styles.roleText, { color: COLORS.neonBlue }]}>
                    {role1 ? role1.charAt(0).toUpperCase() + role1.slice(1) : "Role 1"}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={16}
                  color={COLORS.textSecondary}
                  style={{ marginHorizontal: 10 }}
                />
                <View
                  style={[
                    styles.roleBadge,
                    { backgroundColor: `${COLORS.neonPurple}40` },
                  ]}
                >
                  <Text style={[styles.roleText, { color: COLORS.neonPurple }]}>
                    {role2 ? role2.charAt(0).toUpperCase() + role2.slice(1) : "Role 2"}
                  </Text>
                </View>
              </View>
              <View style={styles.progressIndicator}>
                <Text style={styles.progressText}>
                  Exchange {Math.max(0, currentIndex)} of {conversation.length}
                </Text>
                <View style={styles.progressBarContainer}>
                  <Animated.View style={[styles.progressBar, progressBarAnimStyle]} />
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
        <ScrollView
          ref={dialogContainerRef}
          style={styles.dialogContainer}
          contentContainerStyle={styles.dialogContent}
          showsVerticalScrollIndicator={false}
        >
          {!sessionStarted && !isSessionComplete && conversation.length > 0 && (
            <Animated.View
              entering={FadeInDown.duration(600)}
              style={styles.instructionCard}
            >
              <LinearGradient
                colors={["rgba(0, 180, 255, 0.2)", "rgba(0, 100, 255, 0.05)"]}
                style={styles.instructionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.instructionIconContainer}>
                  <MaterialCommunityIcons
                    name="microphone"
                    size={36}
                    color={COLORS.neonBlue}
                  />
                </View>
                <Text style={styles.instructionTitle}>Role Play Activity</Text>
                <Text style={styles.instructionText}>
                  In this exercise, you'll practice a conversation between a{" "}
                  <Text style={{ color: COLORS.neonBlue }}>{role1}</Text> and a{" "}
                  <Text style={{ color: COLORS.neonPurple }}>{role2}</Text>.
                </Text>
                <Text style={styles.instructionSubtext}>
                  Listen to the {role1}'s lines, then record your responses as the {role2}.
                </Text>
              </LinearGradient>
            </Animated.View>
          )}
          {messages.map((message, index) => renderMessage(message, index))}
          <View style={{ height: 120 }} />
        </ScrollView>
        <View style={styles.footer}>
          {!sessionStarted && !isSessionComplete ? (
            <TouchableOpacity style={styles.startButton} onPress={startSession}>
              <MaterialCommunityIcons
                name="play-circle-outline"
                size={22}
                color={COLORS.textPrimary}
              />
              <Text style={styles.startButtonText}>Start Practice</Text>
            </TouchableOpacity>
          ) : isSessionComplete ? (
            <TouchableOpacity style={styles.submitButton} onPress={submitAssignment}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={22}
                color={COLORS.textPrimary}
              />
              <Text style={styles.submitButtonText}>Submit Practice</Text>
            </TouchableOpacity>
          ) : (
            <Animated.View style={recordButtonAnimStyle}>
              <TouchableOpacity
                style={[styles.recordButton, isRecording && styles.recordingButton]}
                onPress={isRecording ? stopRecording : startRecording}
                disabled={isRecording && countdownValue > 0}
              >
                {isRecording ? (
                  <>
                    <FontAwesome5
                      name="stop-circle"
                      size={20}
                      color={COLORS.textPrimary}
                    />
                    <Text style={styles.recordButtonText}>
                      Stop Recording {countdownValue ? `(${countdownValue})` : ""}
                    </Text>
                  </>
                ) : (
                  <>
                    <FontAwesome5
                      name="microphone"
                      size={20}
                      color={COLORS.textPrimary}
                    />
                    <Text style={styles.recordButtonText}>Record Your Response</Text>
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </SafeAreaView>
      <Modal visible={showSubmitModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={[COLORS.deepBlue, COLORS.softPurple]}
            style={styles.modalCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.completionIcon}>
              <MaterialCommunityIcons
                name="check-circle"
                size={60}
                color={COLORS.neonGreen}
              />
            </View>
            <Text style={styles.completionTitle}>Practice Complete!</Text>
            <Text style={styles.completionText}>
              Great job! Your role play responses have been submitted successfully.
            </Text>
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 15,
    paddingBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    textShadowColor: COLORS.neonBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerRight: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  assignmentInfo: { paddingHorizontal: 20, paddingBottom: 15 },
  assignmentCard: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  assignmentCardContent: { padding: 15 },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  roleBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  roleText: { fontSize: 14, fontWeight: "600" },
  progressIndicator: { marginTop: 5 },
  progressText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 5,
    textAlign: "center",
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.neonGreen,
    width: "0%",
    borderRadius: 3,
  },
  dialogContainer: { flex: 1 },
  dialogContent: { padding: 20, paddingBottom: 40 },
  instructionCard: { marginBottom: 20, borderRadius: 15, overflow: "hidden" },
  instructionGradient: {
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  instructionIconContainer: { alignItems: "center", marginBottom: 15 },
  instructionTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  instructionText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  instructionSubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
  },
  message: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
    marginBottom: 16,
    maxWidth: "90%",
  },
  role1Message: {
    alignSelf: "flex-start",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.neonBlue,
  },
  role2Message: {
    alignSelf: "flex-end",
    borderRightWidth: 3,
    borderRightColor: COLORS.neonPurple,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  roleNameContainer: { flexDirection: "row", alignItems: "center" },
  roleDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  messageRole: { color: COLORS.textPrimary, fontSize: 16, fontWeight: "700" },
  scoreContainer: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  scoreText: { fontSize: 14, fontWeight: "600" },
  messageText: { color: COLORS.textSecondary, fontSize: 15, lineHeight: 22 },
  messageFooter: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  audioButtonText: { fontSize: 13, fontWeight: "500", marginLeft: 6 },
  speakButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  startButton: {
    backgroundColor: COLORS.neonBlue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
  },
  startButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: COLORS.neonGreen,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
  },
  submitButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  recordButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${COLORS.neonBlue}40`,
    paddingVertical: 14,
    borderRadius: 10,
  },
  recordingButton: { backgroundColor: `${COLORS.neonRed || "#ff4d4d"}40` },
  recordButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    borderRadius: 20,
    padding: 25,
    width: "80%",
    maxWidth: 400,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  completionIcon: { marginBottom: 15 },
  completionTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  completionText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingCard: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    width: "90%",
    maxWidth: 400,
  },
  loadingText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  loadingSubtext: { color: COLORS.textSecondary, fontSize: 14, textAlign: "center" },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  errorCard: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    width: "90%",
    maxWidth: 400,
  },
  errorTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  errorText: { color: COLORS.textSecondary, fontSize: 16, textAlign: "center", marginBottom: 20 },
  errorButton: {
    backgroundColor: COLORS.neonBlue,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  errorButtonText: { color: COLORS.textPrimary, fontSize: 16, fontWeight: "600" },
});