import React, { useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Modal,
	Animated,
	Platform,
	SafeAreaView,
	Alert,
	StatusBar,
} from "react-native";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import * as Permissions from "expo-permissions";

interface Message {
	text: string;
	type: string;
	score?: number;
}

interface Conversation {
	[role1: string]: string;
	[role2: string]: string;
}

interface ScoreResult {
	overall: number;
	fluency: {
		overall: number;
	};
	pron: number;
	integrity: number;
	accuracy: number;
	details: Array<{
		lab: string;
		rec: string;
	}>;
}

interface StudentResult {
	assignment_id: number;
	student_id: number;
	role_play: Array<{
		question_id: number;
		overall_score: number;
		fluency: number;
		pronunciation: number;
		integrity: number;
		accuracy: number;
	}>;
}

const RolePlay = () => {
	// State variables
	const [messages, setMessages] = useState<Message[]>([]);
	const [isRecording, setIsRecording] = useState(false);
	const [sessionStarted, setSessionStarted] = useState(false);
	const [isSessionComplete, setIsSessionComplete] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(-1);
	const [progress, setProgress] = useState(0);
	const [showModal, setShowModal] = useState(false);
	const [currentlyPlayingId, setCurrentlyPlayingId] = useState<number | null>(
		null
	);
	const [recording, setRecording] = useState<Audio.Recording | null>(null);
	const [chivoxAudioUrl, setChivoxAudioUrl] = useState<string | null>(null);
	const scrollViewRef = useRef<ScrollView>(null);
	const progressAnimation = useRef(new Animated.Value(0)).current;

	// Mock data - would be fetched from API in real implementation
	const role1 = "manager";
	const role2 = "lead";

	const [studentResults, setStudentResults] = useState<StudentResult>({
		assignment_id: 12086,
		student_id: 3056,
		role_play: [],
	});

	// Sample conversation data (in a real app, this would come from an API)
	const conversation: Conversation[] = [
		{
			manager:
				"How are we progressing with the current project completion timeline?",
			lead: "We are on track to meet the deadline for the project. All team members are working efficiently and communicating well to stay organized.",
		},
		{
			manager:
				"That's great to hear. Have there been any challenges or obstacles that have come up during the project?",
			lead: "One challenge we encountered was unexpected changes in client requirements midway through the project. This required us to adjust our approach and timeline, but we were able to adapt smoothly.",
		},
		{
			manager:
				"How did the team handle those changes and what strategies did you implement to ensure the project stayed on track?",
			lead: "We held a team meeting to discuss the new requirements and brainstormed solutions together. We prioritized tasks, delegated responsibilities effectively, and communicated proactively with the client to keep everyone updated on the progress. This helped us overcome the challenges and stay aligned towards project completion.",
		},
	];

	useEffect(() => {
		// Initialize audio permissions and setup
		const setupAudio = async () => {
			try {
				// Request audio recording permissions
				const { status } = await Audio.requestPermissionsAsync();

				if (status !== "granted") {
					Alert.alert(
						"Permission Required",
						"This app needs access to your microphone to record audio.",
						[{ text: "OK" }]
					);
				} else {
					// Set audio mode for recording
					await Audio.setAudioModeAsync({
						allowsRecordingIOS: true,
						playsInSilentModeIOS: true,
						staysActiveInBackground: false,
						interruptionModeIOS: 1,
						interruptionModeAndroid: 1,
						shouldDuckAndroid: true,
						playThroughEarpieceAndroid: false,
					});

					console.log("Audio permissions granted and setup complete");
				}
			} catch (error) {
				console.error("Error setting up audio:", error);
				Alert.alert("Error", "Failed to initialize audio recording");
			}
		};

		setupAudio();

		return () => {
			// Cleanup audio resources
			if (recording) {
				recording.stopAndUnloadAsync();
			}

			// Reset audio mode
			Audio.setAudioModeAsync({
				allowsRecordingIOS: false,
				playsInSilentModeIOS: false,
			});
		};
	}, []);

	useEffect(() => {
		// Animate progress bar when progress changes
		Animated.timing(progressAnimation, {
			toValue: progress,
			duration: 300,
			useNativeDriver: false,
		}).start();
	}, [progress, progressAnimation]);

	const startSession = () => {
		if (sessionStarted) return;

		setMessages([]);
		setSessionStarted(true);
		setCurrentIndex(0);
		continueSession(0);
	};

	const continueSession = (index: number) => {
		if (index >= conversation.length) {
			setSessionStarted(false);
			setIsSessionComplete(true);
			return;
		}

		// Show role1 message
		addMessageToDialog(conversation[index][role1], role1);

		// Simulate speaking (in a real app, this would use text-to-speech)
		setTimeout(() => {
			// After role1 speaks, show role2 prompt
			addMessageToDialog(conversation[index][role2], role2);
		}, 1000);

		// Update progress
		const newProgress = ((index + 1) / conversation.length) * 100;
		setProgress(newProgress);
	};

	const addMessageToDialog = (text: string, type: string) => {
		const newMessage: Message = { text, type };
		setMessages((prevMessages) => [...prevMessages, newMessage]);

		// Scroll to bottom of message list
		setTimeout(() => {
			scrollViewRef.current?.scrollToEnd({ animated: true });
		}, 100);
	};

	const startRecording = async () => {
		try {
			// Check permissions again (in case they were revoked)
			const { status } = await Audio.requestPermissionsAsync();
			if (status !== "granted") {
				Alert.alert(
					"Permission Required",
					"This app needs access to your microphone to record audio.",
					[{ text: "OK" }]
				);
				return;
			}

			// Make sure any previous recording is stopped
			if (recording) {
				await recording.stopAndUnloadAsync();
			}

			// Reset recording state
			setIsRecording(true);

			console.log("Recording started");

			// Create and prepare new recording
			const newRecording = new Audio.Recording();
			await newRecording.prepareToRecordAsync(
				Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
			);
			await newRecording.startAsync();
			setRecording(newRecording);
		} catch (error) {
			console.error("Failed to start recording:", error);
			setIsRecording(false);
			Alert.alert("Error", "Failed to start recording. Please try again.");
		}
	};

	const stopRecording = async () => {
		try {
			setIsRecording(false);

			if (!recording) {
				console.warn("No active recording to stop");
				return;
			}

			console.log("Stopping recording...");
			// Stop the recording
			await recording.stopAndUnloadAsync();

			// Get the recorded URI
			const uri = recording.getURI();
			console.log("Recording stopped, uri:", uri);

			// In a real implementation, here you would:
			// 1. Send the audio file to a speech recognition service
			// 2. Process the results and calculate scores
			// 3. Update the UI with the recognition results

			// For this demo, we'll use a simulated result
			setTimeout(() => {
				// Simulate a network delay for the recognition service
				const mockScore = {
					result: {
						overall: 85,
						fluency: { overall: 82 },
						pron: 88,
						integrity: 90,
						accuracy: 80,
						details: [
							{ lab: "We", rec: "We" },
							{ lab: "are", rec: "are" },
							{ lab: "on", rec: "on" },
							{ lab: "track", rec: "track" },
							{ lab: "to", rec: "to" },
							{ lab: "meet", rec: "meet" },
							{ lab: "the", rec: "the" },
							{ lab: "deadline", rec: "deadline" },
						],
					},
				};

				handleRecordingComplete(mockScore);
			}, 1000);

			// Reset recording state
			setRecording(null);
		} catch (error) {
			console.error("Failed to stop recording:", error);
			setIsRecording(false);
			setRecording(null);
			Alert.alert(
				"Error",
				"Failed to process the recording. Please try again."
			);
		}
	};

	const handleRecordingComplete = (score: any) => {
		const results = score.result;

		// Add to student results
		const updatedResults = { ...studentResults };
		updatedResults.role_play.push({
			question_id: 12700 + currentIndex, // Mocked question ID
			overall_score: results.overall,
			fluency: results.fluency.overall,
			pronunciation: results.pron,
			integrity: results.integrity,
			accuracy: results.accuracy,
		});

		setStudentResults(updatedResults);

		// Show result by updating the last message
		showRole2Result(results);

		// Move to next exchange
		const nextIndex = currentIndex + 1;
		setCurrentIndex(nextIndex);

		if (nextIndex < conversation.length) {
			setTimeout(() => {
				continueSession(nextIndex);
			}, 1000);
		} else {
			setIsSessionComplete(true);
		}
	};

	const showRole2Result = (results: ScoreResult) => {
		// In a real implementation, this would update the last role2 message
		// with the recognition results and score
		console.log("Showing result:", results);

		// For this demo, we just log the results
	};

	const speakText = (text: string, id: number) => {
		// Stop current speech if any
		if (currentlyPlayingId !== null) {
			Speech.stop();

			// If the same item was playing, just stop
			if (currentlyPlayingId === id) {
				setCurrentlyPlayingId(null);
				return;
			}
		}

		// Start new speech
		setCurrentlyPlayingId(id);
		Speech.speak(text, {
			language: "en-US",
			onDone: () => {
				setCurrentlyPlayingId(null);
			},
			onError: () => {
				setCurrentlyPlayingId(null);
			},
		});
	};

	const handleSubmit = () => {
		// In a real implementation, this would submit the results to an API
		console.log("Submitting results:", studentResults);
		setShowModal(true);

		// Hide modal after a delay
		setTimeout(() => {
			setShowModal(false);
		}, 3000);
	};

	const renderMessage = (message: Message, index: number) => {
		const isRole1 = message.type === role1;

		return (
			<Animated.View
				key={index}
				style={[
					styles.messageContainer,
					isRole1 ? styles.role1Message : styles.role2Message,
				]}
			>
				<View style={styles.messageContent}>
					<Text style={styles.messageText}>{message.text}</Text>

					{/* Display score if available */}
					{message.score !== undefined && (
						<View style={styles.scoreContainer}>
							<Text style={styles.scoreText}>
								Score: <Text style={styles.scoreValue}>{message.score}%</Text>
							</Text>
						</View>
					)}

					{/* Display role labels */}
					<Text
						style={[
							styles.roleLabel,
							isRole1 ? styles.role1Label : styles.role2Label,
						]}
					>
						{isRole1 ? role1 : role2}
					</Text>
				</View>

				{!isRole1 && (
					<TouchableOpacity
						style={[
							styles.playButton,
							currentlyPlayingId === index && styles.playingButton,
						]}
						onPress={() => speakText(message.text, index)}
					>
						<FontAwesome
							name={currentlyPlayingId === index ? "pause" : "play"}
							size={12}
							color={currentlyPlayingId === index ? "#fff" : "#1F3BB3"}
						/>
					</TouchableOpacity>
				)}
			</Animated.View>
		);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
			<View style={styles.container}>
				<View style={styles.chatContainer}>
					{/* Header */}
					<View style={styles.chatHeader}>
						<View style={styles.headerContent}>
							<Text style={styles.title}>Role Play</Text>
						</View>
						<View style={styles.progressContainer}>
							<Text style={styles.progressText}>Exchanges:</Text>
							<View style={styles.progressCircle}>
								<Text style={styles.progressNumber}>
									{Math.min(currentIndex + 1, conversation.length)}
								</Text>
							</View>
							<Text style={styles.progressTotal}>/{conversation.length}</Text>
						</View>
					</View>

					{/* Progress Bar */}
					<View style={styles.progressBar}>
						<Animated.View
							style={[
								styles.progressFill,
								{
									width: progressAnimation.interpolate({
										inputRange: [0, 100],
										outputRange: ["0%", "100%"],
									}),
								},
							]}
						/>
					</View>

					{/* Message Area */}
					<ScrollView
						ref={scrollViewRef}
						style={styles.dialogContainer}
						contentContainerStyle={styles.dialogContent}
					>
						{messages.map((message, index) => renderMessage(message, index))}
					</ScrollView>

					{/* Footer */}
					<View style={styles.chatFooter}>
						{!isSessionComplete ? (
							<TouchableOpacity
								style={[styles.button, sessionStarted && styles.buttonDisabled]}
								onPress={!sessionStarted ? startSession : undefined}
								disabled={sessionStarted}
							>
								<Text style={styles.buttonText}>Start Assignment</Text>
							</TouchableOpacity>
						) : (
							<TouchableOpacity style={styles.button} onPress={handleSubmit}>
								<Text style={styles.buttonText}>Submit Assignment</Text>
							</TouchableOpacity>
						)}

						{sessionStarted && !isSessionComplete && (
							<TouchableOpacity
								style={[
									styles.recordButton,
									isRecording && styles.recordingButton,
								]}
								onPress={isRecording ? stopRecording : startRecording}
							>
								<FontAwesome
									name={isRecording ? "stop-circle" : "microphone"}
									size={20}
									color={isRecording ? "#fff" : "#000"}
								/>
							</TouchableOpacity>
						)}
					</View>
				</View>

				{/* Completion Modal */}
				<Modal visible={showModal} transparent={true} animationType="fade">
					<View style={styles.modalOverlay}>
						<View style={styles.modalContent}>
							<FontAwesome
								name="check-circle"
								size={40}
								color="#4CAF50"
								style={styles.modalIcon}
							/>
							<Text style={styles.modalTitle}>Assignment Completed!</Text>
							<Text style={styles.modalMessage}>
								Great job! You've successfully completed the assignment.
							</Text>
						</View>
					</View>
				</Modal>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		paddingTop: 40,

		flex: 1,
		backgroundColor: "#f0f2f5",
	},
	container: {
		flex: 1,
		padding: 0,
	},
	chatContainer: {
		flex: 1,
		backgroundColor: "white",
	},
	chatHeader: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#ffffff",
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	title: {
		fontSize: 18,
		color: "#333",
		fontWeight: "600",
	},
	progressContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginLeft: 10,
	},
	progressText: {
		fontSize: 15,
		color: "#333",
	},
	progressCircle: {
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: "#f8f9fa",
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
		borderColor: "#1F3BB3",
	},
	progressNumber: {
		fontWeight: "600",
		color: "#1F3BB3",
		textAlign: "center",
	},
	progressTotal: {
		fontWeight: "500",
		color: "#333",
		marginLeft: 5,
	},
	progressBar: {
		height: 7,
		backgroundColor: "#f8f9fa",
		borderRadius: 4,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: "#1F3BB3",
	},
	dialogContainer: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	dialogContent: {
		padding: 15,
		paddingBottom: 40,
	},
	messageContainer: {
		flexDirection: "row",
		alignItems: "center",
		maxWidth: "80%",
		marginBottom: 15,
		padding: 12,
		borderRadius: 18,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.08,
		shadowRadius: 2,
		elevation: 1,
	},
	role1Message: {
		backgroundColor: "#e6f7ff",
		alignSelf: "flex-start",
		borderBottomLeftRadius: 5,
	},
	role2Message: {
		backgroundColor: "#f0f0f0",
		alignSelf: "flex-end",
		borderBottomRightRadius: 5,
	},
	messageContent: {
		flex: 1,
		marginRight: 8,
	},
	messageText: {
		fontSize: 15,
		lineHeight: 22,
		color: "#333",
		marginBottom: 4,
	},
	roleLabel: {
		fontSize: 11,
		marginTop: 4,
		textTransform: "capitalize",
		opacity: 0.7,
	},
	role1Label: {
		color: "#1F3BB3",
	},
	role2Label: {
		color: "#7978E9",
	},
	scoreContainer: {
		backgroundColor: "rgba(31, 59, 179, 0.1)",
		padding: 4,
		borderRadius: 4,
		marginTop: 4,
		marginBottom: 4,
		alignSelf: "flex-start",
	},
	scoreText: {
		fontSize: 13,
		color: "#333",
	},
	scoreValue: {
		fontWeight: "bold",
		color: "#1F3BB3",
	},
	playingButton: {
		backgroundColor: "#1F3BB3",
	},
	playButton: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: "#ffffff",
		borderWidth: 1,
		borderColor: "#e0e0e0",
		alignItems: "center",
		justifyContent: "center",
	},
	chatFooter: {
		padding: 12,
		borderTopWidth: 1,
		borderTopColor: "#e0e0e0",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "white",
	},
	button: {
		backgroundColor: "#1F3BB3",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	buttonText: {
		color: "white",
		fontSize: 15,
		fontWeight: "600",
		textAlign: "center",
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	recordButton: {
		width: 54,
		height: 54,
		borderRadius: 27,
		backgroundColor: "#f8f9fa",
		borderWidth: 1,
		borderColor: "#dee2e6",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 1,
	},
	recordingButton: {
		backgroundColor: "#dc3545",
		borderWidth: 0,
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		backgroundColor: "white",
		padding: 20,
		borderRadius: 20,
		width: "80%",
		maxWidth: 400,
		alignItems: "center",
	},
	modalIcon: {
		marginBottom: 5,
	},
	modalTitle: {
		fontSize: 24,
		color: "#333",
		marginBottom: 15,
	},
	modalMessage: {
		color: "#666",
		marginBottom: 10,
		textAlign: "center",
	},
});

export default RolePlay;
