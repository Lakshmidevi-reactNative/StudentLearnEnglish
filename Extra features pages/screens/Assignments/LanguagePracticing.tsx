import React, { useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Modal,
	Animated,
	SafeAreaView,
	Alert,
	Platform,
	ActivityIndicator,
	StatusBar,
} from "react-native";
import { Audio } from "expo-av";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useTheme } from "../../App"; // Adjust this import to match your app structure

// Types for the component
interface Question {
	assignment_question_type_id: number;
	question_text: string;
	assignment_question_id: number;
	assignment_question_level: string;
	question_points: number;
}

interface ActivityProgress {
	practiced: Set<number>;
	total: number;
}

// Main component
const LanguagePracticing = ({ navigation, route }) => {
	// Theme context
	const { isDarkMode } = useTheme();

	// State variables
	const [activeTab, setActiveTab] = useState<string>("word");
	const [currentIndex, setCurrentIndex] = useState<{ [key: string]: number }>({
		word: 0,
		sentence: 0,
		paragraph: 0,
	});
	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [activities, setActivities] = useState<{
		word: { words: string[] };
		sentence: { sentences: string[] };
		paragraph: { paragraphs: string[] };
	}>({
		word: { words: [] },
		sentence: { sentences: [] },
		paragraph: { paragraphs: [] },
	});
	const [progress, setProgress] = useState<{
		word: ActivityProgress;
		sentence: ActivityProgress;
		paragraph: ActivityProgress;
	}>({
		word: { practiced: new Set(), total: 0 },
		sentence: { practiced: new Set(), total: 0 },
		paragraph: { practiced: new Set(), total: 0 },
	});
	const [assessmentResults, setAssessmentResults] = useState<{
		overall: number;
		fluency: number;
		accuracy: number;
		integrity: number;
		labStr?: string;
		recStr?: string;
	}>({
		overall: 0,
		fluency: 0,
		accuracy: 0,
		integrity: 0,
	});
	const [showResults, setShowResults] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [recording, setRecording] = useState<Audio.Recording | null>(null);
	const [showCompletionMessage, setShowCompletionMessage] = useState<{
		word: boolean;
		sentence: boolean;
		paragraph: boolean;
	}>({
		word: false,
		sentence: false,
		paragraph: false,
	});
	const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

	const scrollViewRef = useRef<ScrollView>(null);
	const recordingAnimation = useRef(new Animated.Value(1)).current;
	const isRecordingUnloadedRef = useRef<boolean>(false);

	// Audio and permissions setup
	useEffect(() => {
		setupAudio();
		fetchQuestions();

		// Animation loop for recording button
		const pulseAnimation = Animated.loop(
			Animated.sequence([
				Animated.timing(recordingAnimation, {
					toValue: 1.2,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(recordingAnimation, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: true,
				}),
			])
		);

		// Start the animation if recording
		if (isRecording) {
			pulseAnimation.start();
		} else {
			pulseAnimation.stop();
			recordingAnimation.setValue(1);
		}

		return () => {
			pulseAnimation.stop();
			if (recording && !isRecordingUnloadedRef.current) {
				stopRecording();
			}
		};
	}, [isRecording]);

	// Initialize audio permissions
	const setupAudio = async () => {
		try {
			const { status } = await Audio.requestPermissionsAsync();

			if (status !== "granted") {
				Alert.alert(
					"Permission Required",
					"This app needs access to your microphone to record audio.",
					[{ text: "OK" }]
				);
			} else {
				await Audio.setAudioModeAsync({
					allowsRecordingIOS: true,
					playsInSilentModeIOS: true,
					staysActiveInBackground: false,
					interruptionModeIOS: 1,
					interruptionModeAndroid: 1,
					shouldDuckAndroid: true,
					playThroughEarpieceAndroid: false,
				});
			}
		} catch (error) {
			console.error("Error setting up audio:", error);
		}
	};

	// Fetch questions from API
	const fetchQuestions = async () => {
		setLoading(true);
		try {
			// In a real app, uncomment this API call
			// const response = await fetch("http://192.168.29.37:8080/learnengspring/assignment/get-all-question/12082");
			// const data = await response.json();

			// For demonstration, using mock data
			const mockData = {
				data: [
					{
						"201": [
							{
								assignment_question_type_id: 201,
								question_text: "suggest",
								assignment_question_id: 12675,
								assignment_question_level: "A2",
								question_points: 100,
							},
							{
								assignment_question_type_id: 201,
								question_text: "simple",
								assignment_question_id: 12676,
								assignment_question_level: "A2",
								question_points: 100,
							},
							{
								assignment_question_type_id: 201,
								question_text: "stories",
								assignment_question_id: 12677,
								assignment_question_level: "A2",
								question_points: 100,
							},
						],
						"202": [
							{
								assignment_question_type_id: 202,
								question_text:
									"In this collection, we share a whole variety of blogs variety in terms of: Types of blogs.",
								assignment_question_id: 12678,
								assignment_question_level: "B1",
								question_points: 100,
							},
							{
								assignment_question_type_id: 202,
								question_text:
									"Some blogs are made with general-purpose website builders like Squarespace and Wix.",
								assignment_question_id: 12679,
								assignment_question_level: "B1",
								question_points: 100,
							},
							{
								assignment_question_type_id: 202,
								question_text:
									"Lifestyle blogs, photography blogs, company blogs, ecommerce brand blogs, travel blogs.",
								assignment_question_id: 12680,
								assignment_question_level: "B2",
								question_points: 100,
							},
						],
						"203": [
							{
								assignment_question_type_id: 203,
								question_text:
									"In this collection, we share a whole variety of blogs variety in terms of: Types of blogs. All blog designs are simple and comfortable enough that they do not hinder the readers experience. For example, a finance blog will have a simple, austere design to communicate seriousness and clarity.",
								assignment_question_id: 12681,
								assignment_question_level: "B1",
								question_points: 100,
							},
						],
						assignment_id: 12082,
						created_date: "2025-01-16T18:30:00.000+00:00",
					},
				],
				message: "pass",
				timestamp: 1738759126817,
				statusCode: 200,
			};

			const data = mockData;

			// Process the API response
			if (data.data && data.data[0]) {
				const newActivities = {
					word: { words: [] },
					sentence: { sentences: [] },
					paragraph: { paragraphs: [] },
				};

				// Extract questions from each category
				if (data.data[0]["201"]) {
					newActivities.word.words = data.data[0]["201"].map(
						(q) => q.question_text
					);
				}
				if (data.data[0]["202"]) {
					newActivities.sentence.sentences = data.data[0]["202"].map(
						(q) => q.question_text
					);
				}
				if (data.data[0]["203"]) {
					newActivities.paragraph.paragraphs = data.data[0]["203"].map(
						(q) => q.question_text
					);
				}

				setActivities(newActivities);

				// Update progress trackers
				setProgress({
					word: {
						practiced: new Set(),
						total: newActivities.word.words.length,
					},
					sentence: {
						practiced: new Set(),
						total: newActivities.sentence.sentences.length,
					},
					paragraph: {
						practiced: new Set(),
						total: newActivities.paragraph.paragraphs.length,
					},
				});
			}
		} catch (error) {
			Alert.alert("Error", "Failed to fetch assessment data");
			console.error("Error fetching questions:", error);
		} finally {
			setLoading(false);
		}
	};

	// Tab selection handler
	const handleTabSelect = (tabName: string) => {
		setActiveTab(tabName);
		setShowResults(false);

		// Reset any ongoing recording
		if (isRecording) {
			stopRecording();
		}
	};

	// Start recording function
	const startRecording = async () => {
		try {
			// Check permissions again
			const { status } = await Audio.requestPermissionsAsync();
			if (status !== "granted") {
				Alert.alert(
					"Permission Required",
					"This app needs access to your microphone to record audio.",
					[{ text: "OK" }]
				);
				return;
			}

			// Clear any previous recording safely
			if (recording && !isRecordingUnloadedRef.current) {
				try {
					await recording.stopAndUnloadAsync();
				} catch (error) {
					console.log("Recording was already stopped:", error);
				}
			}

			// Reset the unloaded flag
			isRecordingUnloadedRef.current = false;

			setIsRecording(true);
			setShowResults(false);

			// Prepare new recording
			const newRecording = new Audio.Recording();
			await newRecording.prepareToRecordAsync(
				Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
			);
			await newRecording.startAsync();
			setRecording(newRecording);

			// Track this as a practiced item
			const newProgress = { ...progress };
			newProgress[activeTab].practiced.add(currentIndex[activeTab]);
			setProgress(newProgress);
		} catch (error) {
			console.error("Failed to start recording:", error);
			setIsRecording(false);
			Alert.alert("Error", "Failed to start recording");
		}
	};

	// Stop recording function
	const stopRecording = async () => {
		try {
			setIsRecording(false);

			if (recording && !isRecordingUnloadedRef.current) {
				try {
					await recording.stopAndUnloadAsync();
					// Mark recording as unloaded
					isRecordingUnloadedRef.current = true;

					// In a real implementation, we would process the audio file here
					// and send it to a speech recognition service

					// For demo, simulate processing with a delay
					setTimeout(() => {
						// Generate mock assessment scores based on activity type
						let mockScore: any;

						if (activeTab === "word") {
							mockScore = {
								overall: Math.floor(Math.random() * 30) + 70, // 70-100 range
								details: {
									word: [
										{
											lab: activities[activeTab].words[currentIndex[activeTab]],
											rec: activities[activeTab].words[currentIndex[activeTab]],
											stress: [{ ref: 1, char: "stress" }],
											accent: 1,
										},
									],
								},
							};
							processScore(
								mockScore,
								activeTab,
								activities[activeTab].words[currentIndex[activeTab]]
							);
						} else {
							mockScore = {
								overall: Math.floor(Math.random() * 30) + 70, // 70-100 range
								fluency: { overall: Math.floor(Math.random() * 30) + 70 },
								accuracy: Math.floor(Math.random() * 30) + 70,
								integrity: Math.floor(Math.random() * 30) + 70,
							};
							processScore(
								mockScore,
								activeTab,
								activeTab === "sentence"
									? activities.sentence.sentences[currentIndex.sentence]
									: activities.paragraph.paragraphs[currentIndex.paragraph]
							);
						}
					}, 1500);
				} catch (error) {
					console.log("Recording was already unloaded:", error);
					// Continue with the mock assessment logic
					setTimeout(() => {
						let mockScore: any;

						if (activeTab === "word") {
							mockScore = {
								overall: Math.floor(Math.random() * 30) + 70,
								details: {
									word: [
										{
											lab: activities[activeTab].words[currentIndex[activeTab]],
											rec: activities[activeTab].words[currentIndex[activeTab]],
											stress: [{ ref: 1, char: "stress" }],
											accent: 1,
										},
									],
								},
							};
							processScore(
								mockScore,
								activeTab,
								activities[activeTab].words[currentIndex[activeTab]]
							);
						} else {
							mockScore = {
								overall: Math.floor(Math.random() * 30) + 70,
								fluency: { overall: Math.floor(Math.random() * 30) + 70 },
								accuracy: Math.floor(Math.random() * 30) + 70,
								integrity: Math.floor(Math.random() * 30) + 70,
							};
							processScore(
								mockScore,
								activeTab,
								activeTab === "sentence"
									? activities.sentence.sentences[currentIndex.sentence]
									: activities.paragraph.paragraphs[currentIndex.paragraph]
							);
						}
					}, 1500);
				}
			}

			setRecording(null);
		} catch (error) {
			console.error("Failed to stop recording:", error);
			setIsRecording(false);
			Alert.alert("Error", "Failed to process recording");
		}
	};

	// Process the score results
	const processScore = (score: any, activityType: string, refText: string) => {
		// Check if we've reached the end of this activity type
		const isActivityCompleted =
			currentIndex[activityType] >=
			activities[activityType][
				activityType === "word"
					? "words"
					: activityType === "sentence"
					? "sentences"
					: "paragraphs"
			].length -
				1;

		// Format and display the score
		let resultData: any = {
			overall: score.overall,
		};

		if (activityType === "word") {
			// For words, we would normally extract phonetic information
			// This is simplified for the demo
			resultData = {
				...resultData,
				fluency: score.overall,
				accuracy: score.overall,
				integrity: score.overall,
				labStr: "IPA representation",
				recStr: "Student pronunciation",
			};
		} else {
			resultData = {
				...resultData,
				fluency: score.fluency?.overall || 0,
				accuracy: score.accuracy || 0,
				integrity: score.integrity || 0,
			};
		}

		setAssessmentResults(resultData);
		setShowResults(true);

		// Show Next button by updating UI state
		if (isActivityCompleted) {
			// If this was the last item, show completion message
			const newCompletionState = { ...showCompletionMessage };
			newCompletionState[activityType] = true;
			setShowCompletionMessage(newCompletionState);

			// Check if all activities are now complete
			const allCompleted =
				(newCompletionState.word || activities.word.words.length === 0) &&
				(newCompletionState.sentence ||
					activities.sentence.sentences.length === 0) &&
				(newCompletionState.paragraph ||
					activities.paragraph.paragraphs.length === 0);

			if (allCompleted) {
				// Show submit button or auto-submit
				setTimeout(() => {
					setShowSuccessModal(true);
				}, 1000);
			}
		}
	};

	// Handle next button press
	const handleNext = () => {
		const newIndex = { ...currentIndex };
		newIndex[activeTab]++;

		setCurrentIndex(newIndex);
		setShowResults(false);

		// Reset completion message when moving to next item
		if (
			newIndex[activeTab] <
			activities[activeTab][
				activeTab === "word"
					? "words"
					: activeTab === "sentence"
					? "sentences"
					: "paragraphs"
			].length
		) {
			const newCompletionState = { ...showCompletionMessage };
			newCompletionState[activeTab] = false;
			setShowCompletionMessage(newCompletionState);
		}
	};

	// Play text using speech synthesis
	const playText = (text: string) => {
		Speech.stop();
		Speech.speak(text, {
			language: "en-US",
			pitch: 1,
			rate: 0.9,
		});
	};

	// Generate current content based on activity type
	const getCurrentContent = () => {
		switch (activeTab) {
			case "word":
				return activities.word.words[currentIndex.word] || "";
			case "sentence":
				return activities.sentence.sentences[currentIndex.sentence] || "";
			case "paragraph":
				return activities.paragraph.paragraphs[currentIndex.paragraph] || "";
			default:
				return "";
		}
	};

	// Get progress info for current tab
	const getProgressInfo = () => {
		const practiced = progress[activeTab].practiced.size;
		const total = progress[activeTab].total;
		return { practiced, total };
	};

	// Check if we're on the last item of the current activity
	const isLastItem = () => {
		const idx = currentIndex[activeTab];
		const items =
			activeTab === "word"
				? activities.word.words
				: activeTab === "sentence"
				? activities.sentence.sentences
				: activities.paragraph.paragraphs;

		return idx >= items.length - 1;
	};

	// Submit the assessment
	const submitAssessment = () => {
		// In a real app, this would submit the results to a server
		console.log("Assessment submitted");
		setShowSuccessModal(false);

		// Convert Set objects to arrays for navigation state serialization
		const serializedResults = {
			...assessmentResults,
			// Add any other non-serializable data transformations here if needed
		};

		// Navigate to results screen with serialized data
		navigation.navigate("LanguageResult", {
			results: serializedResults,
		});
	};

	// Handle back button
	const handleBackPress = () => {
		navigation.goBack();
	};

	// Render the main content
	if (loading) {
		return (
			<SafeAreaView
				style={[styles.loadingContainer, isDarkMode && styles.darkContainer]}
			>
				<StatusBar
					backgroundColor={isDarkMode ? "#1a1a1a" : "#f8f9fa"}
					barStyle={isDarkMode ? "light-content" : "dark-content"}
				/>
				<ActivityIndicator size="large" color="#1F3BB3" />
				<Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
					Loading assessment...
				</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView
			style={[styles.container, isDarkMode && styles.darkContainer]}
		>
			<StatusBar
				backgroundColor={isDarkMode ? "#1a1a1a" : "#f8f9fa"}
				barStyle={isDarkMode ? "light-content" : "dark-content"}
			/>

			{/* Header */}
			<View style={[styles.header, isDarkMode && styles.headerDark]}>
				<TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
					<Ionicons
						name="arrow-back"
						size={24}
						color={isDarkMode ? "#fff" : "#333"}
					/>
				</TouchableOpacity>
				<Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>
					Language Practice
				</Text>
				<View style={styles.placeholder} />
			</View>

			<ScrollView
				ref={scrollViewRef}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Activity Tabs */}
				<View style={styles.tabContainer}>
					<TouchableOpacity
						style={[styles.tabButton, activeTab === "word" && styles.activeTab]}
						onPress={() => handleTabSelect("word")}
					>
						<Text
							style={[
								styles.tabText,
								activeTab === "word" && styles.activeTabText,
							]}
						>
							Words
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.tabButton,
							activeTab === "sentence" && styles.activeTab,
						]}
						onPress={() => handleTabSelect("sentence")}
					>
						<Text
							style={[
								styles.tabText,
								activeTab === "sentence" && styles.activeTabText,
							]}
						>
							Sentence
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.tabButton,
							activeTab === "paragraph" && styles.activeTab,
						]}
						onPress={() => handleTabSelect("paragraph")}
					>
						<Text
							style={[
								styles.tabText,
								activeTab === "paragraph" && styles.activeTabText,
							]}
						>
							Paragraph
						</Text>
					</TouchableOpacity>
				</View>

				{/* Progress Indicator */}
				<Text style={[styles.progressText, isDarkMode && styles.darkText]}>
					{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Completed:{" "}
					{getProgressInfo().practiced} / {getProgressInfo().total}
				</Text>

				{/* Activity Content */}
				{!showCompletionMessage[activeTab] ? (
					<View
						style={[
							styles.activityContainer,
							isDarkMode && styles.activityContainerDark,
						]}
					>
						<View style={styles.contentBox}>
							<Text style={[styles.contentText, isDarkMode && styles.darkText]}>
								{getCurrentContent()}
							</Text>
							<TouchableOpacity
								style={[
									styles.listenButton,
									isDarkMode && styles.listenButtonDark,
								]}
								onPress={() => playText(getCurrentContent())}
							>
								<FontAwesome
									name="volume-up"
									size={16}
									color={isDarkMode ? "#eee" : "#333"}
								/>
							</TouchableOpacity>
						</View>

						<View style={styles.controlsContainer}>
							{isRecording ? (
								<Animated.View
									style={{ transform: [{ scale: recordingAnimation }] }}
								>
									<TouchableOpacity
										style={[styles.recordButton, styles.recordingButton]}
										onPress={stopRecording}
										disabled={!isRecording}
									>
										<FontAwesome name="stop" size={22} color="#fff" />
									</TouchableOpacity>
								</Animated.View>
							) : (
								<TouchableOpacity
									style={styles.recordButton}
									onPress={startRecording}
									disabled={isRecording}
								>
									<FontAwesome name="microphone" size={22} color="#fff" />
								</TouchableOpacity>
							)}

							{showResults && (
								<TouchableOpacity
									style={styles.nextButton}
									onPress={handleNext}
									disabled={isLastItem()}
								>
									<Text style={styles.nextButtonText}>Next</Text>
									<FontAwesome
										name="arrow-right"
										size={14}
										color="#fff"
										style={styles.nextButtonIcon}
									/>
								</TouchableOpacity>
							)}
						</View>
					</View>
				) : (
					<View
						style={[
							styles.completionContainer,
							isDarkMode && styles.completionContainerDark,
						]}
					>
						<FontAwesome name="check-circle" size={40} color="#28a745" />
						<Text
							style={[
								styles.completionText,
								isDarkMode && { color: "#4ADE80" },
							]}
						>
							Your {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
							Assessment is completed
						</Text>
					</View>
				)}

				{/* Results Display */}
				{showResults && (
					<View
						style={[
							styles.resultsContainer,
							isDarkMode && styles.resultsContainerDark,
						]}
					>
						<Text style={[styles.resultsTitle, isDarkMode && styles.darkText]}>
							Assessment Results
						</Text>

						<View style={styles.resultsGrid}>
							{/* Overall Score */}
							<View
								style={[styles.resultCard, isDarkMode && styles.resultCardDark]}
							>
								<Text
									style={[
										styles.resultCardTitle,
										isDarkMode && { color: "#9CA3AF" },
									]}
								>
									Overall Score
								</Text>
								<Text
									style={[
										styles.resultCardValue,
										isDarkMode && { color: "#60A5FA" },
									]}
								>
									{assessmentResults.overall.toFixed(1)}%
								</Text>
							</View>

							{activeTab === "word" ? (
								// Word-specific results
								<>
									<View
										style={[
											styles.resultCard,
											isDarkMode && styles.resultCardDark,
										]}
									>
										<Text
											style={[
												styles.resultCardTitle,
												isDarkMode && { color: "#9CA3AF" },
											]}
										>
											Standard Pronunciation
										</Text>
										<Text
											style={[
												styles.resultCardValue,
												isDarkMode && { color: "#60A5FA" },
											]}
										>
											{assessmentResults.labStr}
										</Text>
									</View>
									<View
										style={[
											styles.resultCard,
											isDarkMode && styles.resultCardDark,
										]}
									>
										<Text
											style={[
												styles.resultCardTitle,
												isDarkMode && { color: "#9CA3AF" },
											]}
										>
											Your Pronunciation
										</Text>
										<Text
											style={[
												styles.resultCardValue,
												isDarkMode && { color: "#60A5FA" },
											]}
										>
											{assessmentResults.recStr}
										</Text>
									</View>
								</>
							) : (
								// Sentence/Paragraph results
								<>
									<View
										style={[
											styles.resultCard,
											isDarkMode && styles.resultCardDark,
										]}
									>
										<Text
											style={[
												styles.resultCardTitle,
												isDarkMode && { color: "#9CA3AF" },
											]}
										>
											Fluency
										</Text>
										<Text
											style={[
												styles.resultCardValue,
												isDarkMode && { color: "#60A5FA" },
											]}
										>
											{assessmentResults.fluency.toFixed(1)}%
										</Text>
									</View>
									<View
										style={[
											styles.resultCard,
											isDarkMode && styles.resultCardDark,
										]}
									>
										<Text
											style={[
												styles.resultCardTitle,
												isDarkMode && { color: "#9CA3AF" },
											]}
										>
											Accuracy
										</Text>
										<Text
											style={[
												styles.resultCardValue,
												isDarkMode && { color: "#60A5FA" },
											]}
										>
											{assessmentResults.accuracy.toFixed(1)}%
										</Text>
									</View>
									<View
										style={[
											styles.resultCard,
											isDarkMode && styles.resultCardDark,
										]}
									>
										<Text
											style={[
												styles.resultCardTitle,
												isDarkMode && { color: "#9CA3AF" },
											]}
										>
											Integrity
										</Text>
										<Text
											style={[
												styles.resultCardValue,
												isDarkMode && { color: "#60A5FA" },
											]}
										>
											{assessmentResults.integrity.toFixed(1)}%
										</Text>
									</View>
								</>
							)}
						</View>
					</View>
				)}
			</ScrollView>

			{/* Success Modal */}
			<Modal visible={showSuccessModal} transparent={true} animationType="fade">
				<View style={styles.modalOverlay}>
					<View
						style={[styles.modalContent, isDarkMode && styles.modalContentDark]}
					>
						<FontAwesome
							name="check-circle"
							size={50}
							color="#28a745"
							style={styles.modalIcon}
						/>
						<Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
							Assessment Completed Successfully!
						</Text>
						<TouchableOpacity
							style={styles.modalButton}
							onPress={submitAssessment}
						>
							<Text style={styles.modalButtonText}>See Results</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 40,

		flex: 1,
		backgroundColor: "#F8F9FA",
	},
	darkContainer: {
		backgroundColor: "#1F1F1F",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 16,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
		backgroundColor: "#fff",
	},
	headerDark: {
		backgroundColor: "#2D3436",
		borderBottomColor: "#4B5563",
	},
	backButton: {
		padding: 8,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
	},
	placeholder: {
		width: 40,
	},
	scrollContent: {
		paddingBottom: 30,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8f9fa",
	},
	loadingText: {
		marginTop: 10,
		fontSize: 16,
		color: "#666",
	},
	tabContainer: {
		flexDirection: "row",
		justifyContent: "center",
		paddingVertical: 12,
		paddingHorizontal: 8,
	},
	tabButton: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 20,
		marginHorizontal: 4,
		backgroundColor: "#f0f0f0",
	},
	activeTab: {
		backgroundColor: "#1F3BB3",
	},
	tabText: {
		color: "#666",
		fontWeight: "500",
		fontSize: 14,
	},
	activeTabText: {
		color: "#fff",
	},
	progressText: {
		textAlign: "center",
		marginVertical: 12,
		color: "#666",
		fontSize: 13,
	},
	activityContainer: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 16,
		marginHorizontal: 12,
		marginVertical: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	activityContainerDark: {
		backgroundColor: "#2D3436",
	},
	contentBox: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingBottom: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	contentText: {
		flex: 1,
		fontSize: 15,
		lineHeight: 22,
		color: "#333",
	},
	listenButton: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#f0f0f0",
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 8,
	},
	listenButtonDark: {
		backgroundColor: "#4B5563",
	},
	controlsContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		paddingTop: 20,
		position: "relative",
		minHeight: 70,
	},
	recordButton: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: "#1F3BB3",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 3,
	},
	recordingButton: {
		backgroundColor: "#dc3545",
	},
	nextButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#1F3BB3",
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 20,
		position: "absolute",
		right: 0,
	},
	nextButtonText: {
		color: "#fff",
		fontWeight: "500",
		fontSize: 14,
	},
	nextButtonIcon: {
		marginLeft: 4,
	},
	completionContainer: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 20,
		marginHorizontal: 12,
		marginVertical: 12,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	completionContainerDark: {
		backgroundColor: "#2D3436",
	},
	completionText: {
		fontSize: 15,
		fontWeight: "500",
		color: "#28a745",
		marginTop: 10,
		textAlign: "center",
	},
	resultsContainer: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 15,
		marginHorizontal: 12,
		marginTop: 8,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	resultsContainerDark: {
		backgroundColor: "#2D3436",
	},
	resultsTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		textAlign: "center",
		marginBottom: 12,
	},
	resultsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		paddingHorizontal: 5,
	},
	resultCard: {
		width: "48%",
		backgroundColor: "#f8f9fa",
		borderRadius: 8,
		padding: 10,
		marginBottom: 8,
		alignItems: "center",
	},
	resultCardDark: {
		backgroundColor: "#374151",
	},
	resultCardTitle: {
		fontSize: 12,
		color: "#666",
		marginBottom: 4,
		textAlign: "center",
	},
	resultCardValue: {
		fontSize: 18,
		fontWeight: "700",
		color: "#1F3BB3",
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "85%",
		backgroundColor: "white",
		borderRadius: 12,
		padding: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalContentDark: {
		backgroundColor: "#2D3436",
	},
	modalIcon: {
		marginBottom: 15,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "600",
		textAlign: "center",
		marginBottom: 20,
	},
	modalButton: {
		backgroundColor: "#1F3BB3",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 25,
		marginTop: 10,
	},
	modalButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
	darkText: {
		color: "#FFFFFF",
	},
});

export default LanguagePracticing;
