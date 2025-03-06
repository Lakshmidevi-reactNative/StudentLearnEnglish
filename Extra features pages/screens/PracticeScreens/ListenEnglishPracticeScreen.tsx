import React, { useState } from "react";
import { useTheme } from "../../App";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Pressable,
	SafeAreaView,
	StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { toast } from "sonner-native";
import * as Speech from "expo-speech";

export default function ListenEnglishPracticeScreen({ navigation, route }) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMicActive, setIsMicActive] = useState(false);
	const [playbackRate, setPlaybackRate] = useState(0.8);
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [mode, setMode] = useState("word"); // 'word' or 'sentence'
	const [selectedWordType, setSelectedWordType] = useState(null);
	const [showSpeedSlider, setShowSpeedSlider] = useState(false);
	const { isDarkMode } = useTheme();

	const content = {
		title: "Business Meeting Conversation",
		text: "This is a typical business meeting conversation focusing on quarterly results and future projections. The participants discuss key performance indicators, market trends, and strategic planning for the upcoming quarter. Pay attention to formal business vocabulary and professional communication styles.",
		source: "Business English Collection",
		level: "Intermediate",
		duration: "5:30",
		wordTypes: {
			nouns: [
				"meeting",
				"conversation",
				"results",
				"projections",
				"participants",
				"indicators",
				"trends",
				"planning",
				"quarter",
				"vocabulary",
				"styles",
			],
			verbs: ["is", "focusing", "discuss", "pay", "attention"],
			adjectives: [
				"typical",
				"business",
				"quarterly",
				"future",
				"key",
				"performance",
				"strategic",
				"professional",
				"formal",
			],
			adverbs: ["typically", "professionally"],
			pronouns: ["this", "they"],
		},
	};

	// Split text into words and sentences
	const words = content.text.split(" ");
	const sentences = content.text.match(/[^.!?]+[.!?]+/g) || [content.text];

	const handleModeChange = (newMode) => {
		// Only process if there's an actual mode change
		if (mode !== newMode) {
			setMode(newMode);
			setCurrentWordIndex(0);
			setSelectedWordType(null);

			// Stop any current speech when changing modes
			Speech.stop();

			// If currently playing, speak the first item in the new mode
			if (isPlaying) {
				setTimeout(() => {
					const text = newMode === "word" ? words[0] : sentences[0];
					speakWord(text);
				}, 300); // Short delay to ensure UI updates first
			}

			toast(`Switched to ${newMode} mode`);
		}
	};

	const handleWordTypeSelect = (type) => {
		// If the same word type is selected again, deselect it
		if (selectedWordType === type) {
			setSelectedWordType(null);
			toast("Word type deselected");
		} else {
			setSelectedWordType(type);
			toast(`Highlighting ${type}`);

			// Find the first word of this type and select it if possible
			if (mode === "word") {
				const wordTypeList = content.wordTypes[type] || [];
				if (wordTypeList.length > 0) {
					// Find the first occurrence of any word in this category
					const firstIndex = words.findIndex((word) => {
						const cleanWord = word.toLowerCase().replace(/[.,!?]/g, "");
						return wordTypeList.includes(cleanWord);
					});

					if (firstIndex >= 0) {
						setCurrentWordIndex(firstIndex);
						// Don't automatically speak it to avoid overwhelming the user
					}
				}
			}
		}
	};

	const isWordOfType = (word) => {
		if (!selectedWordType) return null;
		const cleanWord = word.toLowerCase().replace(/[.,!?]/g, "");
		return content.wordTypes[selectedWordType]?.includes(cleanWord)
			? highlightStyles[selectedWordType][isDarkMode ? "dark" : "light"]
			: null;
	};

	const handlePlayPause = () => {
		const newPlayingState = !isPlaying;
		setIsPlaying(newPlayingState);

		if (newPlayingState) {
			// Start playback and speak the current word/sentence
			const currentText =
				mode === "word" ? words[currentWordIndex] : sentences[currentWordIndex];

			// Start sequential playback from current position
			speakWord(currentText, true);
			toast(`Starting playback from current position`);
		} else {
			// Stop playback
			Speech.stop();
			toast("Playback paused");
		}
	};

	const highlightStyles = {
		// Word type highlighting colors with good contrast for both themes
		nouns: {
			light: {
				backgroundColor: "#FEF3C7", // Warm yellow that works in light mode
				color: "#92400E", // Dark brown text for contrast
			},
			dark: {
				backgroundColor: "#B45309", // Darker warm tone for dark mode
				color: "#FEF3C7", // Light text for contrast
			},
		},
		verbs: {
			light: {
				backgroundColor: "#DCFCE7", // Light green
				color: "#166534", // Dark green text
			},
			dark: {
				backgroundColor: "#166534", // Dark green
				color: "#DCFCE7", // Light green text
			},
		},
		adjectives: {
			light: {
				backgroundColor: "#E0E7FF", // Light blue
				color: "#3730A3", // Dark blue text
			},
			dark: {
				backgroundColor: "#3730A3", // Dark blue
				color: "#E0E7FF", // Light blue text
			},
		},
		adverbs: {
			light: {
				backgroundColor: "#FCE7F3", // Light pink
				color: "#9D174D", // Dark pink text
			},
			dark: {
				backgroundColor: "#9D174D", // Dark pink
				color: "#FCE7F3", // Light pink text
			},
		},
		pronouns: {
			light: {
				backgroundColor: "#F5F3FF", // Light purple
				color: "#5B21B6", // Dark purple text
			},
			dark: {
				backgroundColor: "#5B21B6", // Dark purple
				color: "#F5F3FF", // Light purple text
			},
		},
	};

	const handleRecord = () => {
		setIsMicActive(!isMicActive);
		toast(isMicActive ? "Recording stopped" : "Recording started...");
	};

	const handleReset = () => {
		// Stop any current playback
		Speech.stop();

		// Reset to first item
		setCurrentWordIndex(0);

		// If playing was on, start speaking from beginning
		const wasPlaying = isPlaying;
		setIsPlaying(false); // Temporarily set to false to avoid double-speak

		setTimeout(() => {
			// If it was playing before reset, restart playback from beginning
			if (wasPlaying) {
				setIsPlaying(true);
				const firstText = mode === "word" ? words[0] : sentences[0];
				speakWord(firstText, true);
				toast("Restarted playback from beginning");
			} else {
				toast("Reset to beginning");
			}
		}, 100);
	};

	const handleSpeedPress = () => {
		setShowSpeedSlider(!showSpeedSlider);
	};

	const handleSpeedChange = (value) => {
		const speed = 0.8 + (value / 100) * 0.7;
		const newRate = Number(speed.toFixed(1));
		setPlaybackRate(newRate);

		// If currently playing, restart speech with new rate
		if (isPlaying) {
			// Brief delay to let state update
			setTimeout(() => {
				const currentText =
					mode === "word"
						? words[currentWordIndex]
						: sentences[currentWordIndex];

				// Restart speech with new rate, maintaining sequential status
				speakWord(currentText, true);
			}, 100);
		}

		toast(`Speed: ${newRate}x`);
	};

	const handleNextWord = (isAutoAdvance = false) => {
		const maxIndex = mode === "word" ? words.length - 1 : sentences.length - 1;
		if (currentWordIndex < maxIndex) {
			const newIndex = currentWordIndex + 1;
			setCurrentWordIndex(newIndex);

			// Get the next text
			const nextText = mode === "word" ? words[newIndex] : sentences[newIndex];

			// If auto-advance during playback, continue sequential playback
			if (isAutoAdvance && isPlaying) {
				speakWord(nextText, true);
			}
			// If manual navigation during playback, speak but don't auto-continue
			else if (isPlaying) {
				speakWord(nextText, false);
			}
		} else if (isPlaying) {
			// If we reached the end, stop playing
			setIsPlaying(false);
			toast("Reached the end of content");
		}
	};

	const handlePreviousWord = () => {
		if (currentWordIndex > 0) {
			const newIndex = currentWordIndex - 1;
			setCurrentWordIndex(newIndex);

			// Get the previous text
			const prevText = mode === "word" ? words[newIndex] : sentences[newIndex];

			// If in playback mode, speak the word but don't auto-continue
			if (isPlaying) {
				speakWord(prevText, false);
			}
		}
	};

	const renderModeButtons = () => (
		<View style={styles.modeButtonsContainer}>
			<TouchableOpacity
				style={[styles.modeButton, mode === "word" && styles.modeButtonActive]}
				onPress={() => handleModeChange("word")}
				activeOpacity={0.7}
			>
				<MaterialIcons
					name="text-fields"
					size={20}
					color={mode === "word" ? "white" : "#4A5568"}
				/>
				<Text
					style={[
						styles.modeButtonText,
						mode === "word" && styles.modeButtonTextActive,
					]}
				>
					Word Mode
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[
					styles.modeButton,
					mode === "sentence" && styles.modeButtonActive,
				]}
				onPress={() => handleModeChange("sentence")}
				activeOpacity={0.7}
			>
				<MaterialIcons
					name="subject"
					size={20}
					color={mode === "sentence" ? "white" : "#4A5568"}
				/>
				<Text
					style={[
						styles.modeButtonText,
						mode === "sentence" && styles.modeButtonTextActive,
					]}
				>
					Sentence Mode
				</Text>
			</TouchableOpacity>
		</View>
	);

	const renderWordTypeButtons = () => (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			style={styles.wordTypeContainer}
			contentContainerStyle={styles.wordTypeContentContainer}
		>
			{Object.entries(content.wordTypes).map(([type, words]) => (
				<TouchableOpacity
					key={type}
					style={[
						styles.wordTypeButton,
						selectedWordType === type && styles.wordTypeButtonActive,
					]}
					onPress={() => handleWordTypeSelect(type)}
					activeOpacity={0.7}
				>
					<Text
						style={[
							styles.wordTypeButtonText,
							selectedWordType === type && styles.wordTypeButtonTextActive,
						]}
					>
						{type.charAt(0).toUpperCase() + type.slice(1)} ({words.length})
					</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	);

	const speakWord = (text, isSequential = false) => {
		// Use Speech API to speak the text
		try {
			Speech.stop(); // Stop any current speech

			// Different speech patterns based on mode
			const speechOptions = {
				rate: playbackRate,
				onDone: () => {
					// Only auto-advance if we're in sequential playback mode
					if (isSequential && isPlaying) {
						handleNextWord(true); // true indicates auto-advance
					}
				},
			};

			// Add slight pause between words in word mode for better clarity
			if (mode === "word") {
				// Words speak slowly with pauses
				speechOptions.pitch = 1.0;
			} else {
				// Sentences speak more naturally as a paragraph
				speechOptions.pitch = 1.0;
			}

			Speech.speak(text, speechOptions);

			// Show shorter toast for longer text
			const displayText =
				text.length > 30 ? text.substring(0, 30) + "..." : text;
			toast(`Speaking: "${displayText}"`);
		} catch (error) {
			console.error("Speech error:", error);
			toast("Error with speech synthesis");
		}
	};

	const handleWordTap = (text, index) => {
		// Stop any existing speech
		Speech.stop();

		// Update the selected index
		setCurrentWordIndex(index);

		// Speak the word but don't auto-continue
		speakWord(text, false);

		// If we were in continuous playback mode, pause it
		// This makes the behavior more intuitive - tap interrupts playback
		if (isPlaying) {
			setIsPlaying(false);
		}
	};

	const renderContent = () => {
		if (mode === "word") {
			return words.map((word, index) => {
				const highlightStyle = isWordOfType(word);
				return (
					<TouchableOpacity
						key={index}
						onPress={() => handleWordTap(word, index)}
						activeOpacity={0.7}
					>
						<Text
							style={[
								styles.word,
								isDarkMode && styles.darkText,
								index === currentWordIndex && {
									backgroundColor: isDarkMode ? "#6B46C1" : "#805AD5",
									color: "white",
									borderRadius: 4,
								},
								highlightStyle && {
									backgroundColor: highlightStyle.backgroundColor,
									color: highlightStyle.color,
									borderRadius: 4,
								},
							]}
						>
							{word}{" "}
						</Text>
					</TouchableOpacity>
				);
			});
		} else {
			return sentences.map((sentence, index) => (
				<TouchableOpacity
					key={index}
					onPress={() => handleWordTap(sentence, index)}
					activeOpacity={0.7}
				>
					<Text
						style={[
							styles.sentence,
							isDarkMode && styles.darkText,
							index === currentWordIndex && {
								backgroundColor: isDarkMode ? "#6B46C1" : "#805AD5",
								color: "white",
								borderRadius: 4,
								padding: 8,
							},
						]}
					>
						{sentence}{" "}
					</Text>
				</TouchableOpacity>
			));
		}
	};

	return (
		<SafeAreaView style={[styles.safeArea, isDarkMode && styles.darkContainer]}>
			<StatusBar backgroundColor="#4A90E2" barStyle="light-content" />

			{/* Compact Header */}
			<View style={styles.headerContainer}>
				<LinearGradient colors={["#4A90E2", "#357ABD"]} style={styles.header}>
					<View style={styles.headerTopRow}>
						<TouchableOpacity
							style={styles.backButton}
							onPress={() => navigation.goBack()}
						>
							<MaterialIcons name="arrow-back" size={22} color="white" />
						</TouchableOpacity>

						<Text style={styles.headerTitle}>ListenEng Practice</Text>

						<View style={styles.levelBadge}>
							<Text style={styles.levelText}>{content.level}</Text>
						</View>
					</View>

					<Text style={styles.contentTitle}>{content.title}</Text>

					<View style={styles.contentMeta}>
						<Text style={styles.sourceText}>Source: {content.source}</Text>
					</View>
				</LinearGradient>
			</View>

			{/* Main Scrollable Content */}
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}
			>
				<View style={styles.mainContent}>
					{renderModeButtons()}
					{mode === "word" && renderWordTypeButtons()}

					<View
						style={[
							styles.textContainer,
							isDarkMode && { backgroundColor: "#2D3748" },
						]}
					>
						<View style={styles.textWrapper}>{renderContent()}</View>
					</View>

				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#F5F7FA",
	},
	darkContainer: {
		backgroundColor: "#1a1a1a",
	},
	headerContainer: {
		zIndex: 1,
	},
	header: {
		paddingTop: 46,
		paddingHorizontal: 16,
		paddingBottom: 16,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	headerTopRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	backButton: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(255,255,255,0.2)",
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "white",
	},
	contentTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "white",
		marginBottom: 8,
	},
	contentMeta: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		gap: 12,
	},
	levelBadge: {
		backgroundColor: "rgba(255,255,255,0.2)",
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 12,
	},
	levelText: {
		color: "white",
		fontSize: 13,
		fontWeight: "600",
	},
	sourceText: {
		color: "rgba(255,255,255,0.8)",
		fontSize: 13,
	},
	durationText: {
		color: "rgba(255,255,255,0.8)",
		fontSize: 13,
	},
	scrollView: {
		flex: 1,
	},
	scrollViewContent: {
		flexGrow: 1,
	},
	mainContent: {
		padding: 16,
		paddingBottom: 16,
	},
	modeButtonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 16,
		gap: 12,
	},
	modeButton: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "#EDF2F7",
		padding: 12,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
	},
	modeButtonActive: {
		backgroundColor: "#4A90E2",
	},
	modeButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#4A5568",
	},
	modeButtonTextActive: {
		color: "white",
	},
	wordTypeContainer: {
		marginBottom: 16,
	},
	wordTypeContentContainer: {
		paddingVertical: 4,
	},
	wordTypeButton: {
		backgroundColor: "#EDF2F7",
		paddingHorizontal: 14,
		paddingVertical: 6,
		borderRadius: 20,
		marginRight: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	wordTypeButtonActive: {
		backgroundColor: "#4A90E2",
	},
	wordTypeButtonText: {
		fontSize: 13,
		color: "#4A5568",
		fontWeight: "500",
	},
	wordTypeButtonTextActive: {
		color: "white",
	},
	textContainer: {
		backgroundColor: "white",
		borderRadius: 15,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	textWrapper: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	word: {
		fontSize: 16,
		lineHeight: 24,
		color: "#2D3748",
		paddingVertical: 2,
		paddingHorizontal: 4,
		marginVertical: 3,
	},
	darkText: {
		color: "#E2E8F0", // Lighter gray for dark mode
	},
	sentence: {
		fontSize: 16,
		lineHeight: 24,
		color: "#2D3748",
		marginBottom: 12,
		paddingVertical: 6,
		paddingHorizontal: 8,
		borderRadius: 8,
	},
	controlPanelContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		borderTopWidth: 1,
		borderTopColor: "rgba(0,0,0,0.05)",
		backgroundColor: "#F5F7FA",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -3 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 10,
		paddingVertical: 12,
		paddingHorizontal: 16,
		paddingBottom: 24, // Extra padding at the bottom
	},
	controlPanel: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 15,
		padding: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	controlButton: {
		alignItems: "center",
		justifyContent: "center",
	},
	resetButton: {
		backgroundColor: "#EDF2F7",
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	speedButton: {
		backgroundColor: "#EBF8FF",
		flexDirection: "row",
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderRadius: 8,
		gap: 6,
	},
	speedButtonText: {
		color: "#4A90E2",
		fontWeight: "600",
		fontSize: 13,
	},
	navigationButton: {
		backgroundColor: "#EBF8FF",
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	navigationButtonPressed: {
		backgroundColor: "#4A90E2",
	},
	playButton: {
		backgroundColor: "#EDF2F7",
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: "center",
		justifyContent: "center",
	},
	activePlayButton: {
		backgroundColor: "#F0FDF4",
	},
	speedSliderContainer: {
		backgroundColor: "white",
		borderRadius: 15,
		padding: 16,
		marginTop: 12,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	speedSliderHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	speedSliderTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#2D3748",
	},
	speedSliderContent: {
		height: 60,
		justifyContent: "center",
	},
	speedMarkers: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	speedMarker: {
		fontSize: 12,
		color: "#4A5568",
	},
	sliderTrack: {
		height: 4,
		backgroundColor: "#EDF2F7",
		borderRadius: 2,
	},
	sliderFill: {
		height: "100%",
		backgroundColor: "#4A90E2",
		borderRadius: 2,
	},
	sliderThumb: {
		position: "absolute",
		top: "50%",
		width: 20,
		height: 20,
		marginTop: -10,
		marginLeft: -10,
		backgroundColor: "white",
		borderRadius: 10,
		borderWidth: 2,
		borderColor: "#4A90E2",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	sliderThumbInner: {
		width: 8,
		height: 8,
		margin: 4,
		borderRadius: 4,
		backgroundColor: "#4A90E2",
	},
	sliderTouchArea: {
		position: "absolute",
		top: -10,
		left: 0,
		right: 0,
		height: 40,
	},
	bottomPadding: {
		height: 80, // Ensures content is visible above sticky controls
	},
});
