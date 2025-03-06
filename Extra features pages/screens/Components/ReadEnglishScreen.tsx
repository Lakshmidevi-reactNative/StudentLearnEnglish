// ReadEnglishPractice.js - Improved with fixed positioning, functionality and styling
import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Modal,
	StatusBar,
	Platform,
	Dimensions,
	TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { useTheme } from "../../App";
import { useRoute, useNavigation } from "@react-navigation/native";

// Get screen dimensions for positioning
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Dictionary data with part of speech only
const DICTIONARY_DATA = {
	business: "noun",
	case: "noun",
	study: "noun",
	analysis: "noun",
	article: "noun",
	news: "noun",
	story: "noun",
	collection: "noun",
	examine: "verb",
	provide: "verb",
	develop: "verb",
	apply: "verb",
	critically: "adverb",
	structured: "adjective",
	valuable: "adjective",
	theoretical: "adjective",
	practical: "adjective",
	// Add more words as needed
};

// Mock content for the reader
const MOCK_CONTENT = {
	"1": `# Business Case Studies

Business case studies examine real-world business scenarios, challenges, and solutions. They provide valuable insights into decision-making processes, strategic thinking, and problem-solving approaches.

Case studies often follow a structured format:
- Background information
- Problem or challenge identification
- Analysis of possible solutions
- Implementation strategy
- Results and lessons learned

Through careful analysis of these cases, readers can develop critical thinking skills and apply theoretical concepts to practical situations.`,

	"2": `# News Article Analysis

This advanced exercise helps you analyze news articles critically. When reading news, consider these factors:

* Source credibility: Is the publication reputable?
* Headline accuracy: Does it fairly represent the content?
* Language use: Are there emotional or loaded terms?
* Evidence quality: Are claims supported by reliable sources?
* Balance: Are multiple perspectives presented?

By examining these elements, you can become a more discerning consumer of news and information in today's media landscape.`,

	"3": `# Short Story Collection

This collection features simple short stories perfect for beginning English readers. Each story uses basic vocabulary and straightforward sentence structures.

## The Park Visit

Tom went to the park on Sunday. He saw many trees and flowers. Some children were playing with a ball. Tom sat on a bench and read his book. Later, he bought an ice cream. It was a good day at the park.

## My New Friend

Lisa has a new friend at school. Her name is Maya. Maya is from another country. She speaks two languages. Lisa and Maya eat lunch together. They like to draw pictures. Maya teaches Lisa words from her language.`,
};

// Interactive Text Component with improved word detection
const InteractiveText = ({ text, onWordPress, textStyle }) => {
	// Process the paragraphs
	const renderParagraphs = () => {
		const paragraphs = text.split("\n").filter((p) => p.trim().length > 0);

		return paragraphs.map((paragraph, index) => {
			// Heading
			if (paragraph.startsWith("#")) {
				const level = paragraph.match(/^#+/)[0].length;
				const content = paragraph.replace(/^#+\s/, "");

				const headingStyle = {
					fontSize: 24 - level * 2,
					fontWeight: "bold",
					marginBottom: 10,
					marginTop: 15,
					...textStyle,
				};

				return (
					<Text key={`heading-${index}`} style={headingStyle}>
						{renderClickableWords(content)}
					</Text>
				);
			}

			// List item
			if (paragraph.match(/^[\*\-]\s/)) {
				const content = paragraph.replace(/^[\*\-]\s/, "");

				return (
					<View key={`list-item-${index}`} style={styles.listItem}>
						<Text style={[styles.bulletPoint, textStyle]}>•</Text>
						<Text style={[styles.listItemText, textStyle]}>
							{renderClickableWords(content)}
						</Text>
					</View>
				);
			}

			// Regular paragraph
			return (
				<Text key={`para-${index}`} style={[styles.paragraph, textStyle]}>
					{renderClickableWords(paragraph)}
				</Text>
			);
		});
	};

	// Process the words with improved interactivity
	const renderClickableWords = (paragraph) => {
		const words = paragraph.split(/(\s+)/);

		return words.map((word, index) => {
			// Skip rendering for whitespace
			if (word.trim() === "") {
				return <Text key={`space-${index}`}>{word}</Text>;
			}

			// Extract the actual word without punctuation
			const wordOnly = word.replace(/[^\w']|_/g, "");

			if (wordOnly.length <= 1) {
				// For single letters or punctuation, don't make clickable
				return (
					<Text key={`word-${index}`} style={textStyle}>
						{word}
					</Text>
				);
			}

			return (
				<TouchableOpacity
					key={`word-${index}`}
					onPress={(event) => onWordPress(wordOnly, event.nativeEvent)}
					activeOpacity={0.6}
					style={styles.wordTouchable}
				>
					<Text style={[textStyle, styles.wordText]}>{word}</Text>
				</TouchableOpacity>
			);
		});
	};

	return <View>{renderParagraphs()}</View>;
};

// Simplified Word tooltip component - shows only part of speech
const WordTooltip = ({
	visible,
	word,
	onClose,
	position,
	theme,
	onListen,
	onRecord,
	isWordPlaying,
	isWordRecording,
	wordAccuracy,
}) => {
	// Get part of speech or default
	const partOfSpeech = DICTIONARY_DATA[word.toLowerCase()] || "unknown";

	// Calculate optimal position
	const tooltipWidth = 300;
	let tooltipX = position.x - tooltipWidth / 2;

	// Keep tooltip on screen
	if (tooltipX < 20) tooltipX = 20;
	if (tooltipX + tooltipWidth > SCREEN_WIDTH - 20) {
		tooltipX = SCREEN_WIDTH - tooltipWidth - 20;
	}

	if (!visible) return null;

	return (
		<Modal
			transparent={true}
			visible={visible}
			animationType="fade"
			onRequestClose={onClose}
		>
			<TouchableWithoutFeedback onPress={onClose}>
				<View style={styles.modalOverlay}>
					<TouchableWithoutFeedback>
						<View
							style={[
								styles.tooltipContainer,
								{
									left: tooltipX,
									top: position.y + 20,
									backgroundColor: theme.cardBg,
									borderColor: theme.borderColor,
								},
							]}
						>
							{/* Word and Part of Speech */}
							<View style={styles.tooltipHeader}>
								<Text style={[styles.tooltipWord, { color: theme.textColor }]}>
									{word}
								</Text>
								<Text style={[styles.tooltipPos, { color: theme.iconcolor }]}>
									{partOfSpeech}
								</Text>
								<TouchableOpacity
									style={styles.closeButton}
									onPress={onClose}
									hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
								>
									<MaterialIcons
										name="close"
										size={18}
										color={theme.textColor}
									/>
								</TouchableOpacity>
							</View>

							{/* Word accuracy feedback (if available) */}
							{wordAccuracy !== null && (
								<View style={styles.wordAccuracyContainer}>
									<Text style={{ color: theme.textColor }}>
										Pronunciation accuracy:
										<Text
											style={{ fontWeight: "bold", color: theme.iconcolor }}
										>
											{" "}
											{wordAccuracy}%
										</Text>
									</Text>
								</View>
							)}

							{/* Word-specific controls */}
							<View style={styles.tooltipActions}>
								<TouchableOpacity
									style={[
										styles.actionButton,
										{
											backgroundColor: isWordPlaying
												? theme.iconcolor
												: theme.viewbg,
											opacity: isWordRecording ? 0.5 : 1,
										},
									]}
									onPress={onListen}
									disabled={isWordRecording}
								>
									<MaterialIcons
										name="volume-up"
										size={24}
										color={isWordPlaying ? "white" : theme.iconcolor}
									/>
									<Text
										style={{ color: isWordPlaying ? "white" : theme.textColor }}
									>
										{isWordPlaying ? "Playing..." : "Listen"}
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										styles.actionButton,
										{
											backgroundColor: isWordRecording
												? "#FF4136"
												: theme.viewbg,
											opacity: isWordPlaying ? 0.5 : 1,
										},
									]}
									onPress={onRecord}
									disabled={isWordPlaying}
								>
									<MaterialIcons
										name={isWordRecording ? "mic" : "mic-none"}
										size={24}
										color={isWordRecording ? "white" : theme.iconcolor}
									/>
									<Text
										style={{
											color: isWordRecording ? "white" : theme.textColor,
										}}
									>
										{isWordRecording ? "Recording..." : "Record"}
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

// Custom toast notification component
const ToastNotification = ({ visible, message, theme, onHide }) => {
	useEffect(() => {
		if (visible) {
			const timer = setTimeout(() => {
				onHide();
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [visible, onHide]);

	if (!visible) return null;

	// Determine if it's a recording toast
	const isRecording = message.includes("Recording");
	const icon = isRecording ? (
		<FontAwesome
			name="microphone"
			size={16}
			color={theme.iconcolor}
			style={{ marginRight: 8 }}
		/>
	) : message.includes("accuracy") ? (
		<Ionicons
			name="checkmark-circle"
			size={16}
			color="#4CAF50"
			style={{ marginRight: 8 }}
		/>
	) : (
		<Ionicons
			name="information-circle"
			size={16}
			color={theme.iconcolor}
			style={{ marginRight: 8 }}
		/>
	);

	return (
		<View style={styles.toastContainer}>
			<View
				style={[
					styles.toast,
					{
						backgroundColor: theme.cardBg,
						borderColor: isRecording ? "#FF4136" : theme.borderColor,
						borderLeftWidth: 4,
						borderLeftColor: isRecording
							? "#FF4136"
							: message.includes("accuracy")
							? "#4CAF50"
							: theme.iconcolor,
					},
				]}
			>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					{icon}
					<Text style={{ color: theme.textColor }}>{message}</Text>
				</View>
			</View>
		</View>
	);
};

// Bottom controls component - for entire content
const BottomControls = ({
	theme,
	onSpeaker,
	onMic,
	isContentPlaying,
	isContentRecording,
}) => {
	return (
		<View
			style={[
				styles.bottomControlsContainer,
				{ backgroundColor: theme.cardBg, borderTopColor: theme.borderColor },
			]}
		>
			<TouchableOpacity
				style={[
					styles.bottomButton,
					{
						backgroundColor: isContentPlaying ? theme.iconcolor : theme.viewbg,
						opacity: isContentRecording ? 0.5 : 1,
					},
				]}
				onPress={onSpeaker}
				disabled={isContentRecording}
			>
				<Ionicons
					name="volume-high"
					size={28}
					color={isContentPlaying ? "white" : theme.iconcolor}
				/>
				<Text
					style={[
						styles.bottomButtonText,
						{ color: isContentPlaying ? "white" : theme.textColor },
					]}
				>
					Speaker
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[
					styles.bottomButton,
					{
						backgroundColor: isContentRecording ? "#FF4136" : theme.viewbg,
						opacity: isContentPlaying ? 0.5 : 1,
						borderWidth: 2,
						borderColor: isContentRecording ? "#FF4136" : "transparent",
					},
				]}
				onPress={onMic}
				disabled={isContentPlaying}
			>
				<FontAwesome
					name="microphone"
					size={28}
					color={isContentRecording ? "white" : theme.iconcolor}
				/>
				<Text
					style={[
						styles.bottomButtonText,
						{ color: isContentRecording ? "white" : theme.textColor },
					]}
				>
					Mic
				</Text>
			</TouchableOpacity>
		</View>
	);
};

// Main component
export default function ReadEnglishPractice() {
	const route = useRoute();
	const navigation = useNavigation();
	const { isDarkMode } = useTheme();
	const { contentId, content } = route.params || {
		contentId: "1",
		content: null,
	};

	// State for tooltip
	const [tooltipVisible, setTooltipVisible] = useState(false);
	const [selectedWord, setSelectedWord] = useState("");
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
	const [wordAccuracy, setWordAccuracy] = useState(null);

	// State for word audio
	const [isWordPlaying, setIsWordPlaying] = useState(false);
	const [isWordRecording, setIsWordRecording] = useState(false);

	// State for content audio
	const [isContentPlaying, setIsContentPlaying] = useState(false);
	const [isContentRecording, setIsContentRecording] = useState(false);

	// State for overall accuracy
	const [accuracy, setAccuracy] = useState(null);

	// State for toast notification
	const [toast, setToast] = useState({
		visible: false,
		message: "",
	});

	// State for detailed reading metrics
	const [readingMetrics, setReadingMetrics] = useState({
		wordRecognition: null,
		pronunciation: null,
		fluency: null,
	});

	// Show toast notification
	const showToast = (message) => {
		setToast({
			visible: true,
			message,
		});
	};

	// Hide toast notification
	const hideToast = () => {
		setToast({
			visible: false,
			message: "",
		});
	};

	// Theme styles
	const themeStyles = {
		light: {
			bgColor: "#F5F7FA",
			textColor: "#2C3E50",
			cardBg: "#ffffff",
			borderColor: "#e0e0e0",
			headerGradient: ["#9F7AEA", "#805AD5"],
			iconcolor: "#A776F0",
			viewbg: "rgba(167, 118, 240, 0.1)",
		},
		dark: {
			bgColor: "#0f020f",
			textColor: "#ffffff",
			cardBg: "#1a1a1a",
			borderColor: "#333333",
			headerGradient: ["#1a1a1a", "#1a1a1a"],
			iconcolor: "#A776F0",
			viewbg: "rgba(174, 186, 195, 0.1)",
		},
	};

	const currentTheme = themeStyles[isDarkMode ? "dark" : "light"];
	const contentText = MOCK_CONTENT[contentId];

	// Handle word click
	const handleWordPress = (word, nativeEvent) => {
		if (word && word.trim().length > 0) {
			// Stop any playing word sound or recording when selecting a new word
			if (isWordPlaying) setIsWordPlaying(false);
			if (isWordRecording) setIsWordRecording(false);

			setSelectedWord(word);
			setWordAccuracy(null); // Reset word accuracy when selecting a new word

			// Get position from the touch event
			const { pageX, pageY } = nativeEvent;
			setTooltipPosition({ x: pageX, y: pageY });
			setTooltipVisible(true);
		}
	};

	// ===== WORD AUDIO FUNCTIONS =====

	// Play pronunciation for the selected word - fixed to avoid errors
	const playWordSound = () => {
		// Stop word recording if it's happening
		if (isWordRecording) {
			setIsWordRecording(false);
		}

		// Simulate playing sound
		setIsWordPlaying(true);

		// Automatically stop after 2 seconds
		setTimeout(() => {
			setIsWordPlaying(false);
			showToast(`Pronunciation played for "${selectedWord}"`);
		}, 2000);

		// In a real app, you would use speech synthesis:
		// Speech.speak(selectedWord, { language: 'en' });
	};

	// Start recording word pronunciation with comparison to correct pronunciation
	const startWordRecording = () => {
		// Stop word playback if it's happening
		if (isWordPlaying) {
			setIsWordPlaying(false);
		}

		// Simulate recording
		setIsWordRecording(true);

		// Show recording toast
		showToast(`Recording "${selectedWord}" pronunciation...`);

		// Simulate speech recognition and pronunciation analysis
		setTimeout(() => {
			setIsWordRecording(false);

			// In a real app, this would:
			// 1. Record audio using the device microphone
			// 2. Use speech recognition to identify the spoken word
			// 3. Compare the pronunciation with a reference model
			// 4. Calculate metrics for different aspects of pronunciation:

			// Simulate pronunciation analysis (would be real in production app)
			const phonemeAccuracy = Math.floor(Math.random() * 25) + 70; // 70-95%
			const stressAccuracy = Math.floor(Math.random() * 20) + 75; // 75-95%
			const intonationAccuracy = Math.floor(Math.random() * 15) + 80; // 80-95%

			// Calculate overall pronunciation score
			const overallAccuracy = Math.floor(
				phonemeAccuracy * 0.5 + stressAccuracy * 0.3 + intonationAccuracy * 0.2
			);

			setWordAccuracy(overallAccuracy);

			// Show feedback toast
			showToast(
				`"${selectedWord}" pronunciation: ${overallAccuracy}% accuracy`
			);
		}, 3000);
	};

	// ===== CONTENT AUDIO FUNCTIONS =====

	// Play the entire content - fixed functionality
	const playContentSound = () => {
		// Stop content recording if it's happening
		if (isContentRecording) {
			setIsContentRecording(false);
		}

		// Also stop any word-specific audio if it's playing
		setIsWordPlaying(false);
		setIsWordRecording(false);

		// Close tooltip if open
		setTooltipVisible(false);

		// Simulate playing full content
		setIsContentPlaying(true);

		// Automatically stop after 5 seconds
		setTimeout(() => {
			setIsContentPlaying(false);
			showToast("Content audio playback completed");
		}, 5000);

		// In a real app, you would use speech synthesis for the full text
	};

	// Start recording content reading with accuracy feedback
	const startContentRecording = () => {
		// Stop content playback if it's happening
		if (isContentPlaying) {
			setIsContentPlaying(false);
		}

		// Also stop any word-specific audio if it's playing
		setIsWordPlaying(false);
		setIsWordRecording(false);

		// Close tooltip if open
		setTooltipVisible(false);

		// Simulate recording
		setIsContentRecording(true);

		// Show recording toast
		showToast("Recording your reading... Keep going");

		// Simulate speech-to-text conversion and content comparison
		setTimeout(() => {
			setIsContentRecording(false);

			// This simulates comparing the recorded speech to the expected content
			// In a real app, you would:
			// 1. Convert speech to text using a speech recognition API
			// 2. Compare the resulting text with the original content using algorithms like:
			//    - Levenshtein distance for word accuracy
			//    - Pronunciation scoring using phonetic comparison
			//    - Timing/rhythm analysis

			// Calculate detailed metrics (simulation)
			const wordRecognitionRate = Math.floor(Math.random() * 20) + 75; // 75-95%
			const pronunciationScore = Math.floor(Math.random() * 15) + 80; // 80-95%
			const fluencyScore = Math.floor(Math.random() * 25) + 70; // 70-95%

			// Calculate overall accuracy as weighted average
			const overallAccuracy = Math.floor(
				wordRecognitionRate * 0.4 +
					pronunciationScore * 0.4 +
					fluencyScore * 0.2
			);

			setAccuracy(overallAccuracy);

			// Store detailed metrics in state
			setReadingMetrics({
				wordRecognition: wordRecognitionRate,
				pronunciation: pronunciationScore,
				fluency: fluencyScore,
			});

			// Show detailed feedback toast
			showToast(`Analysis complete: ${overallAccuracy}% accuracy`);
		}, 5000);
	};

	// ===== RESET FUNCTION =====

	// Handle reset functionality
	const handleReset = () => {
		// Stop all audio processes
		setIsWordPlaying(false);
		setIsWordRecording(false);
		setIsContentPlaying(false);
		setIsContentRecording(false);

		// Reset all metrics
		setAccuracy(null);
		setReadingMetrics({
			wordRecognition: null,
			pronunciation: null,
			fluency: null,
		});
		setWordAccuracy(null);

		// Close tooltip if open
		setTooltipVisible(false);

		// Show feedback
		showToast("Reading progress has been reset");
	};

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: currentTheme.bgColor }]}
			edges={["left", "right"]}
		>
			<StatusBar
				barStyle="light-content"
				backgroundColor="transparent"
				translucent
			/>

			{/* Header */}
			<LinearGradient
				colors={currentTheme.headerGradient}
				style={styles.header}
			>
				<View style={styles.headerContent}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => navigation.goBack()}
					>
						<MaterialIcons name="arrow-back" size={26} color="white" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>
						{content?.title || "Reading Practice"}
					</Text>
				</View>
			</LinearGradient>

			{/* Reading content */}
			<ScrollView
				style={styles.contentContainer}
				contentContainerStyle={[
					styles.contentPadding,
					{ paddingBottom: 100 }, // Extra padding for bottom controls
				]}
			>
				<View
					style={[styles.readingCard, { backgroundColor: currentTheme.cardBg }]}
				>
					{/* Reset button moved to top-right of content card */}
					<TouchableOpacity
						style={[
							styles.resetButton,
							{ backgroundColor: currentTheme.viewbg },
						]}
						onPress={handleReset}
					>
						<MaterialIcons
							name="refresh"
							size={22}
							color={currentTheme.iconcolor}
						/>
					</TouchableOpacity>

					{/* Accuracy display when available */}
					{accuracy !== null && (
						<View style={styles.accuracyContainer}>
							<Text
								style={[styles.accuracyText, { color: currentTheme.textColor }]}
							>
								Reading Accuracy:
								<Text style={styles.accuracyValue}> {accuracy}%</Text>
							</Text>
							<View style={styles.accuracyBarContainer}>
								<View
									style={[
										styles.accuracyBarFill,
										{
											width: `${accuracy}%`,
											backgroundColor:
												accuracy > 80
													? "#4CAF50"
													: accuracy > 60
													? "#FFC107"
													: "#F44336",
										},
									]}
								/>
							</View>
							<Text
								style={[styles.accuracyTip, { color: currentTheme.textColor }]}
							>
								{accuracy > 90
									? "Excellent pronunciation!"
									: accuracy > 80
									? "Very good! Keep practicing."
									: accuracy > 70
									? "Good effort. Focus on rhythm."
									: "Keep practicing for better results."}
							</Text>

							{/* Detailed metrics display */}
							{readingMetrics.wordRecognition && (
								<View style={styles.metricsContainer}>
									<View style={styles.metricItem}>
										<Text
											style={[
												styles.metricLabel,
												{ color: currentTheme.textColor },
											]}
										>
											Words
										</Text>
										<Text
											style={[
												styles.metricValue,
												{ color: currentTheme.iconcolor },
											]}
										>
											{readingMetrics.wordRecognition}%
										</Text>
									</View>
									<View style={styles.metricItem}>
										<Text
											style={[
												styles.metricLabel,
												{ color: currentTheme.textColor },
											]}
										>
											Pronunciation
										</Text>
										<Text
											style={[
												styles.metricValue,
												{ color: currentTheme.iconcolor },
											]}
										>
											{readingMetrics.pronunciation}%
										</Text>
									</View>
									<View style={styles.metricItem}>
										<Text
											style={[
												styles.metricLabel,
												{ color: currentTheme.textColor },
											]}
										>
											Fluency
										</Text>
										<Text
											style={[
												styles.metricValue,
												{ color: currentTheme.iconcolor },
											]}
										>
											{readingMetrics.fluency}%
										</Text>
									</View>
								</View>
							)}
						</View>
					)}

					<InteractiveText
						text={contentText}
						onWordPress={handleWordPress}
						textStyle={{ color: currentTheme.textColor }}
					/>
				</View>
			</ScrollView>

			{/* Word tooltip - for specific word */}
			<WordTooltip
				visible={tooltipVisible}
				word={selectedWord}
				onClose={() => setTooltipVisible(false)}
				position={tooltipPosition}
				theme={currentTheme}
				onListen={playWordSound}
				onRecord={startWordRecording}
				isWordPlaying={isWordPlaying}
				isWordRecording={isWordRecording}
				wordAccuracy={wordAccuracy}
			/>

			{/* Toast notification */}
			<ToastNotification
				visible={toast.visible}
				message={toast.message}
				theme={currentTheme}
				onHide={hideToast}
			/>

			{/* Bottom controls - for entire content (Reset button removed) */}
			<BottomControls
				theme={currentTheme}
				onSpeaker={playContentSound}
				onMic={startContentRecording}
				isContentPlaying={isContentPlaying}
				isContentRecording={isContentRecording}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F7FA",
	},
	header: {
		paddingTop:
			Platform.OS === "ios" ? 50 : (StatusBar.currentHeight || 0) + 20,
		paddingHorizontal: 20,
		paddingBottom: 15,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255,255,255,0.2)",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 15,
	},
	headerTitle: {
		fontSize: 22,
		fontWeight: "bold",
		color: "white",
		flex: 1,
	},
	contentContainer: {
		flex: 1,
	},
	contentPadding: {
		padding: 16,
		paddingBottom: 80,
	},
	readingCard: {
		backgroundColor: "white",
		borderRadius: 15,
		padding: 20,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		position: "relative", // For positioning the reset button
	},
	// Reset button moved to content card
	resetButton: {
		position: "absolute",
		top: 12,
		right: 12,
		width: 36,
		height: 36,
		borderRadius: 18,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 10, // Ensure it's above the content
	},
	// Accuracy container
	accuracyContainer: {
		backgroundColor: "rgba(167, 118, 240, 0.1)",
		borderRadius: 8,
		padding: 10,
		marginBottom: 16,
		alignSelf: "flex-start",
	},
	accuracyText: {
		fontSize: 14,
		fontWeight: "500",
	},
	accuracyValue: {
		fontWeight: "bold",
		color: "#A776F0",
	},
	paragraph: {
		marginBottom: 15,
		lineHeight: 24,
		fontSize: 16, // Increased font size for better readability
	},
	wordTouchable: {
		// Visual indicator that word is interactive
		borderBottomWidth: 1,
		borderBottomColor: "rgba(167, 118, 240, 0.15)",
	},
	wordText: {
		paddingHorizontal: 1,
		paddingVertical: 2,
	},
	listItem: {
		flexDirection: "row",
		marginBottom: 12, // Increased spacing
		paddingLeft: 8,
		alignItems: "flex-start", // Better alignment for multi-line items
	},
	bulletPoint: {
		marginRight: 10,
		fontSize: 18, // Larger bullet
		lineHeight: 24,
	},
	listItemText: {
		flex: 1,
		lineHeight: 24,
		fontSize: 16, // Consistent with paragraph
	},

	// Tooltip styles
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	tooltipContainer: {
		position: "absolute",
		width: 300,
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		elevation: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
	},
	tooltipHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	tooltipWord: {
		fontSize: 18,
		fontWeight: "bold",
		marginRight: 10,
	},
	tooltipPos: {
		fontSize: 14,
		fontStyle: "italic",
		flex: 1,
		textTransform: "capitalize",
		opacity: 0.8,
	},
	closeButton: {
		width: 24,
		height: 24,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.1)",
	},
	tooltipActions: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	wordAccuracyContainer: {
		marginBottom: 12,
		padding: 8,
		backgroundColor: "rgba(167, 118, 240, 0.05)",
		borderRadius: 6,
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
		borderRadius: 10,
		width: "48%",
		gap: 6,
	},

	// Accuracy container and bar
	accuracyBarContainer: {
		height: 8,
		backgroundColor: "rgba(0,0,0,0.1)",
		borderRadius: 4,
		marginTop: 8,
		overflow: "hidden",
		width: "100%",
	},
	accuracyBarFill: {
		height: "100%",
		borderRadius: 4,
	},
	accuracyTip: {
		marginTop: 6,
		fontSize: 12,
		fontStyle: "italic",
		opacity: 0.8,
	},
	metricsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 12,
		width: "100%",
		paddingTop: 10,
		borderTopWidth: 1,
		borderTopColor: "rgba(167, 118, 240, 0.2)",
	},
	metricItem: {
		alignItems: "center",
		flex: 1,
	},
	metricLabel: {
		fontSize: 11,
		marginBottom: 2,
		opacity: 0.7,
	},
	metricValue: {
		fontSize: 14,
		fontWeight: "bold",
	},

	// Toast notification styles
	toastContainer: {
		position: "absolute",
		bottom: 80, // Position above the bottom controls
		left: 0,
		right: 0,
		alignItems: "center",
		zIndex: 9999,
	},
	toast: {
		paddingVertical: 12,
		paddingHorizontal: 18,
		borderRadius: 25,
		borderWidth: 1,
		maxWidth: "85%",
		minWidth: "50%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 5,
		alignItems: "center",
	},

	// Bottom controls styles - simplified with 2 buttons
	bottomControlsContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		flexDirection: "row",
		justifyContent: "space-around",
		padding: 15,
		borderTopWidth: 1,
		borderTopColor: "#e0e0e0",
		backgroundColor: "white",
		elevation: 8,
	},
	bottomButton: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 12,
		width: "45%", // Wider buttons with only two
	},
	bottomButtonText: {
		marginTop: 6,
		fontSize: 14,
		fontWeight: "500",
	},
});
