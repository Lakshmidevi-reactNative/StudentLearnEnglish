import React, { useState, useRef, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Platform,
	Pressable,
	ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	MaterialCommunityIcons,
	FontAwesome5,
	Ionicons,
	Feather,
	Entypo,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Animated, {
	FadeIn,
	FadeInDown,
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import { COLORS } from "../constants/Colors";
import { toast } from "sonner-native";

// Demo content
const LESSON_CONTENT = {
	title: "Business Meeting Conversation",
	source: "Business English Course",
	difficulty: "Intermediate",
	description:
		"A typical conversation between colleagues discussing project deadlines and responsibilities.",
	text: "Good morning everyone. Thanks for joining this project status meeting. Let's start by reviewing our progress. Sarah, could you please update us on the marketing campaign? Sure, John. We have finalized the social media strategy and created all the necessary visual content. Our team is ready to launch the campaign next Monday. That sounds excellent. Has everyone received the quarterly report I sent yesterday? I noticed some important trends we should discuss. Yes, I've reviewed it. The sales numbers look promising, but I'm concerned about the increasing customer acquisition costs. You've raised a valid point. Perhaps we should allocate more resources to customer retention strategies. Let's schedule a separate meeting to address this specific issue in more detail.",
	words: [
		{ text: "Good", type: "adjective" },
		{ text: "morning", type: "noun" },
		{ text: "everyone", type: "pronoun" },
		{ text: ".", type: "punctuation" },
		{ text: "Thanks", type: "noun" },
		{ text: "for", type: "preposition" },
		{ text: "joining", type: "verb" },
		{ text: "this", type: "determiner" },
		{ text: "project", type: "noun" },
		{ text: "status", type: "noun" },
		{ text: "meeting", type: "noun" },
		{ text: ".", type: "punctuation" },

		{ text: "Let's", type: "contraction" },
		{ text: "start", type: "verb" },
		{ text: "by", type: "preposition" },
		{ text: "reviewing", type: "verb" },
		{ text: "our", type: "pronoun" },
		{ text: "progress", type: "noun" },
		{ text: ".", type: "punctuation" },

		{ text: "Sarah", type: "noun" },
		{ text: ",", type: "punctuation" },
		{ text: "could", type: "modal" },
		{ text: "you", type: "pronoun" },
		{ text: "please", type: "adverb" },
		{ text: "update", type: "verb" },
		{ text: "us", type: "pronoun" },
		{ text: "on", type: "preposition" },
		{ text: "the", type: "determiner" },
		{ text: "marketing", type: "noun" },
		{ text: "campaign", type: "noun" },
		{ text: "?", type: "punctuation" },

		{ text: "Sure", type: "adjective" },
		{ text: ",", type: "punctuation" },
		{ text: "John", type: "noun" },
		{ text: ".", type: "punctuation" },
		{ text: "We", type: "pronoun" },
		{ text: "have", type: "verb" },
		{ text: "finalized", type: "verb" },
		{ text: "the", type: "determiner" },
		{ text: "social", type: "adjective" },
		{ text: "media", type: "noun" },
		{ text: "strategy", type: "noun" },
		{ text: "and", type: "conjunction" },
		{ text: "created", type: "verb" },
		{ text: "all", type: "determiner" },
		{ text: "the", type: "determiner" },
		{ text: "necessary", type: "adjective" },
		{ text: "visual", type: "adjective" },
		{ text: "content", type: "noun" },
		{ text: ".", type: "punctuation" },
	],
	sentences: [
		"Good morning everyone.",
		"Thanks for joining this project status meeting.",
		"Let's start by reviewing our progress.",
		"Sarah, could you please update us on the marketing campaign?",
		"Sure, John.",
		"We have finalized the social media strategy and created all the necessary visual content.",
		"Our team is ready to launch the campaign next Monday.",
		"That sounds excellent.",
		"Has everyone received the quarterly report I sent yesterday?",
		"I noticed some important trends we should discuss.",
		"Yes, I've reviewed it.",
		"The sales numbers look promising, but I'm concerned about the increasing customer acquisition costs.",
		"You've raised a valid point.",
		"Perhaps we should allocate more resources to customer retention strategies.",
		"Let's schedule a separate meeting to address this specific issue in more detail.",
	],
};

// WordType color mapping
const WORD_TYPE_COLORS = {
	noun: {
		light: "#4285F4",
		dark: "#5D9BFF",
	},
	verb: {
		light: "#DB4437",
		dark: "#FF6B5B",
	},
	adjective: {
		light: "#F4B400",
		dark: "#FFCF57",
	},
	adverb: {
		light: "#0F9D58",
		dark: "#47CC8A",
	},
	pronoun: {
		light: "#AB47BC",
		dark: "#CE93D8",
	},
	conjunction: {
		light: "#00ACC1",
		dark: "#64FFDA",
	},
	preposition: {
		light: "#FF7043",
		dark: "#FFAB91",
	},
	determiner: {
		light: "#9E9E9E",
		dark: "#BDBDBD",
	},
	contraction: {
		light: "#D81B60",
		dark: "#F48FB1",
	},
	modal: {
		light: "#3949AB",
		dark: "#7986CB",
	},
	punctuation: {
		light: "#757575",
		dark: "#9E9E9E",
	},
};

export default function ListenEngScreen() {
	const navigation = useNavigation();
	const [mode, setMode] = useState("sentence"); // 'word' or 'sentence'
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [speechRate, setSpeechRate] = useState(1.0);
	const [isDarkMode, setIsDarkMode] = useState(true);
	const [highlightType, setHighlightType] = useState("none"); // 'none', 'noun', 'verb', etc.
	const [showTypes, setShowTypes] = useState(false);

	const scrollViewRef = useRef(null);
	const playTimerRef = useRef(null);
	const highlightScale = useSharedValue(1);

	const currentContent =
		mode === "word" ? LESSON_CONTENT.words : LESSON_CONTENT.sentences;

	// Reset current index when mode changes
	useEffect(() => {
		setCurrentIndex(0);
		if (isPlaying) {
			clearInterval(playTimerRef.current);
			setIsPlaying(false);
		}
	}, [mode]);

	// Handle auto-playback
	useEffect(() => {
		if (isPlaying) {
			playContent();

			// Setup interval for auto-advancing
			playTimerRef.current = setInterval(
				() => {
					setCurrentIndex((prevIndex) => {
						const nextIndex = prevIndex + 1;
						if (nextIndex >= currentContent.length) {
							clearInterval(playTimerRef.current);
							setIsPlaying(false);
							return prevIndex;
						}
						return nextIndex;
					});
				},
				mode === "word" ? 1000 / speechRate : 3000 / speechRate
			);
		} else {
			clearInterval(playTimerRef.current);
		}

		return () => {
			clearInterval(playTimerRef.current);
		};
	}, [isPlaying, currentIndex, mode, speechRate]);

	// Animated style for highlight effect
	const highlightAnimStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: highlightScale.value }],
		};
	});

	const playContent = () => {
		// Trigger highlight animation
		highlightScale.value = withTiming(1.1, { duration: 150 }, () => {
			highlightScale.value = withTiming(1, { duration: 150 });
		});

		// In a real app, this would use Text-to-Speech
		toast.info(`Playing: ${getDisplayText()}`);
	};

	const handlePlayPause = () => {
		setIsPlaying(!isPlaying);
		if (!isPlaying) {
			playContent();
		}
	};

	const handleNext = () => {
		if (currentIndex < currentContent.length - 1) {
			setCurrentIndex(currentIndex + 1);
			if (isPlaying) {
				playContent();
			}
		}
	};

	const handlePrevious = () => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
			if (isPlaying) {
				playContent();
			}
		}
	};

	const handleReset = () => {
		setCurrentIndex(0);
		if (isPlaying) {
			playContent();
		}
	};

	const handleItemPress = (index) => {
		setCurrentIndex(index);
		if (isPlaying) {
			playContent();
		}
	};

	const getColorForType = (type) => {
		const colorSet = WORD_TYPE_COLORS[type] || {
			light: "#000000",
			dark: "#FFFFFF",
		};
		return isDarkMode ? colorSet.dark : colorSet.light;
	};

	const getDisplayText = () => {
		if (mode === "word") {
			return currentContent[currentIndex]?.text || "";
		} else {
			return currentContent[currentIndex] || "";
		}
	};

	const goBack = () => {
		navigation.goBack();
	};

	const toggleHighlightType = (type) => {
		if (highlightType === type) {
			setHighlightType("none");
		} else {
			setHighlightType(type);
		}
	};

	// Format a word with its type
	const getFormattedWord = (word, index) => {
		const isHighlighted =
			highlightType === "none" ||
			word.type === highlightType ||
			(word.type === "punctuation" && word.text !== "." && word.text !== "?");

		const shouldShowSelectedHighlight =
			mode === "word" && currentIndex === index;

		return (
			<TouchableOpacity
				key={`word-${index}`}
				onPress={() => mode === "word" && handleItemPress(index)}
				style={styles.wordContainer}
			>
				<Text
					style={[
						styles.wordText,
						!isHighlighted && styles.wordTextFaded,
						shouldShowSelectedHighlight && styles.currentWord,
						{
							color: shouldShowSelectedHighlight
								? COLORS.textPrimary
								: isHighlighted
								? getColorForType(word.type)
								: isDarkMode
								? "rgba(255,255,255,0.3)"
								: "rgba(0,0,0,0.3)",
						},
					]}
				>
					{word.text}
				</Text>
				{(highlightType !== "none" || showTypes) && isHighlighted && (
					<Text
						style={[styles.wordType, { color: getColorForType(word.type) }]}
					>
						{word.type}
					</Text>
				)}
			</TouchableOpacity>
		);
	};

	// Format sentences with word highlighting
	const getFormattedSentence = (sentence, sentenceIndex) => {
		// In a real app, we would properly parse the sentence into words
		const isCurrent = mode === "sentence" && currentIndex === sentenceIndex;

		return (
			<TouchableOpacity
				key={`sentence-${sentenceIndex}`}
				onPress={() => mode === "sentence" && handleItemPress(sentenceIndex)}
				style={[styles.sentenceContainer, isCurrent && styles.currentSentence]}
			>
				<Text
					style={[styles.sentenceText, isCurrent && styles.currentSentenceText]}
				>
					{sentence}
				</Text>
			</TouchableOpacity>
		);
	};

	// Buttons for each word type highlight
	const renderTypeButtons = () => {
		const types = ["noun", "verb", "adjective", "adverb", "pronoun"];

		return (
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.typesScrollContainer}
			>
				{types.map((type) => (
					<TouchableOpacity
						key={type}
						style={[
							styles.typeButton,
							highlightType === type && {
								backgroundColor: `${getColorForType(type)}50`,
							},
						]}
						onPress={() => toggleHighlightType(type)}
					>
						<Text
							style={[styles.typeButtonText, { color: getColorForType(type) }]}
						>
							{type.charAt(0).toUpperCase() + type.slice(1)}s
						</Text>
					</TouchableOpacity>
				))}
				<TouchableOpacity
					style={styles.typeToggleButton}
					onPress={() => setShowTypes(!showTypes)}
				>
					<Text style={styles.typeToggleText}>
						{showTypes ? "Hide Types" : "Show Types"}
					</Text>
				</TouchableOpacity>
			</ScrollView>
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
					<TouchableOpacity onPress={goBack} style={styles.backButton}>
						<MaterialCommunityIcons
							name="arrow-left"
							size={28}
							color={COLORS.textPrimary}
						/>
					</TouchableOpacity>
					<Text style={styles.headerTitle}>ListenEng 🎧</Text>
					<TouchableOpacity
						style={styles.modeToggleButton}
						onPress={() => setIsDarkMode(!isDarkMode)}
					>
						<Ionicons
							name={isDarkMode ? "sunny" : "moon"}
							size={24}
							color={COLORS.textPrimary}
						/>
					</TouchableOpacity>
				</View>

				<Animated.View
					entering={FadeInDown.delay(100).duration(400)}
					style={styles.lessonInfoCard}
				>
					<View style={styles.lessonInfoHeader}>
						<Text style={styles.lessonTitle}>{LESSON_CONTENT.title}</Text>
						<View style={styles.difficultyBadge}>
							<Text style={styles.difficultyText}>
								{LESSON_CONTENT.difficulty}
							</Text>
						</View>
					</View>
					<Text style={styles.lessonSource}>{LESSON_CONTENT.source}</Text>
					<Text style={styles.lessonDescription}>
						{LESSON_CONTENT.description}
					</Text>
				</Animated.View>

				<View style={styles.modeTabsContainer}>
					<TouchableOpacity
						style={[styles.modeTab, mode === "word" && styles.activeTab]}
						onPress={() => setMode("word")}
					>
						<Text
							style={[
								styles.modeTabText,
								mode === "word" && styles.activeTabText,
							]}
						>
							Word Mode
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.modeTab, mode === "sentence" && styles.activeTab]}
						onPress={() => setMode("sentence")}
					>
						<Text
							style={[
								styles.modeTabText,
								mode === "sentence" && styles.activeTabText,
							]}
						>
							Sentence Mode
						</Text>
					</TouchableOpacity>
				</View>

				{mode === "word" && (
					<View style={styles.wordTypeContainer}>{renderTypeButtons()}</View>
				)}

				<View style={styles.contentContainer}>
					<Animated.View
						style={[styles.highlightContainer, highlightAnimStyle]}
						entering={FadeIn.duration(400)}
					>
						{mode === "word" ? (
							<Text style={styles.displayWord}>{getDisplayText()}</Text>
						) : (
							<Text style={styles.displaySentence}>{getDisplayText()}</Text>
						)}
					</Animated.View>

					<ScrollView
						ref={scrollViewRef}
						style={styles.contentScroll}
						contentContainerStyle={styles.contentScrollInner}
						showsVerticalScrollIndicator={false}
					>
						<View style={styles.wordsContainer}>
							{mode === "word"
								? // Show all words with their types
								  LESSON_CONTENT.words.map((word, index) =>
										getFormattedWord(word, index)
								  )
								: // Show sentences
								  LESSON_CONTENT.sentences.map((sentence, index) =>
										getFormattedSentence(sentence, index)
								  )}
						</View>
					</ScrollView>

					<View style={styles.playbackControlsContainer}>
						<View style={styles.speedControlContainer}>
							<Text style={styles.speedLabel}>
								Speed: {speechRate.toFixed(1)}x
							</Text>
							<Slider
								style={styles.slider}
								minimumValue={0.8}
								maximumValue={1.5}
								step={0.1}
								value={speechRate}
								onValueChange={setSpeechRate}
								minimumTrackTintColor={COLORS.neonBlue}
								maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
								thumbTintColor={COLORS.neonPurple}
							/>
						</View>

						<View style={styles.playControls}>
							<TouchableOpacity
								style={styles.controlButton}
								onPress={handlePrevious}
							>
								<Ionicons
									name="play-skip-back"
									size={24}
									color={COLORS.textPrimary}
								/>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.playPauseButton}
								onPress={handlePlayPause}
							>
								<Ionicons
									name={isPlaying ? "pause" : "play"}
									size={30}
									color={COLORS.textPrimary}
								/>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.controlButton}
								onPress={handleNext}
							>
								<Ionicons
									name="play-skip-forward"
									size={24}
									color={COLORS.textPrimary}
								/>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.controlButton}
								onPress={handleReset}
							>
								<Ionicons name="refresh" size={24} color={COLORS.textPrimary} />
							</TouchableOpacity>
						</View>

						<View style={styles.progressContainer}>
							<Text style={styles.progressText}>
								{currentIndex + 1} of {currentContent.length}
							</Text>
							<View style={styles.progressBar}>
								<View
									style={[
										styles.progressFill,
										{
											width: `${
												((currentIndex + 1) / currentContent.length) * 100
											}%`,
										},
									]}
								/>
							</View>
						</View>
					</View>
				</View>
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
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: Platform.OS === "ios" ? 10 : 40,
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
		fontSize: 22,
		fontWeight: "700",
		textShadowColor: COLORS.neonBlue,
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 10,
	},
	modeToggleButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		justifyContent: "center",
		alignItems: "center",
	},
	lessonInfoCard: {
		backgroundColor: "rgba(255, 255, 255, 0.07)",
		marginHorizontal: 20,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
		padding: 16,
		marginBottom: 16,
	},
	lessonInfoHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	lessonTitle: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "700",
		flex: 1,
	},
	difficultyBadge: {
		backgroundColor: `${COLORS.neonBlue}20`,
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 10,
	},
	difficultyText: {
		color: COLORS.neonBlue,
		fontSize: 12,
		fontWeight: "600",
	},
	lessonSource: {
		color: COLORS.textSecondary,
		fontSize: 14,
		marginBottom: 8,
	},
	lessonDescription: {
		color: COLORS.textSecondary,
		fontSize: 14,
		lineHeight: 20,
	},
	modeTabsContainer: {
		flexDirection: "row",
		marginHorizontal: 20,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		borderRadius: 10,
		padding: 4,
		marginBottom: 15,
	},
	modeTab: {
		flex: 1,
		paddingVertical: 10,
		alignItems: "center",
		borderRadius: 8,
	},
	activeTab: {
		backgroundColor: "rgba(255, 255, 255, 0.15)",
	},
	modeTabText: {
		color: COLORS.textSecondary,
		fontWeight: "600",
	},
	activeTabText: {
		color: COLORS.textPrimary,
	},
	wordTypeContainer: {
		marginHorizontal: 20,
		marginBottom: 15,
	},
	typesScrollContainer: {
		paddingRight: 20,
		paddingBottom: 5,
	},
	typeButton: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 30,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		marginRight: 8,
	},
	typeButtonText: {
		fontWeight: "600",
		fontSize: 12,
	},
	typeToggleButton: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 30,
		backgroundColor: `${COLORS.neonGreen}20`,
		marginRight: 8,
	},
	typeToggleText: {
		fontWeight: "600",
		fontSize: 12,
		color: COLORS.neonGreen,
	},
	contentContainer: {
		flex: 1,
		marginHorizontal: 20,
		backgroundColor: "rgba(255, 255, 255, 0.07)",
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
		overflow: "hidden",
	},
	highlightContainer: {
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		padding: 20,
		alignItems: "center",
		justifyContent: "center",
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.1)",
		minHeight: 100,
	},
	displayWord: {
		color: COLORS.textPrimary,
		fontSize: 32,
		fontWeight: "bold",
		textAlign: "center",
	},
	displaySentence: {
		color: COLORS.textPrimary,
		fontSize: 22,
		fontWeight: "600",
		textAlign: "center",
		lineHeight: 32,
	},
	contentScroll: {
		flex: 1,
	},
	contentScrollInner: {
		padding: 15,
	},
	wordsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
	},
	wordContainer: {
		margin: 4,
		alignItems: "center",
	},
	wordText: {
		fontSize: 16,
		fontWeight: "500",
	},
	wordTextFaded: {
		opacity: 0.5,
	},
	wordType: {
		fontSize: 10,
		marginTop: 2,
	},
	currentWord: {
		backgroundColor: `${COLORS.neonBlue}30`,
		borderRadius: 4,
		padding: 4,
		fontWeight: "bold",
	},
	sentenceContainer: {
		padding: 8,
		marginBottom: 8,
		borderRadius: 8,
	},
	sentenceText: {
		color: COLORS.textSecondary,
		fontSize: 16,
		lineHeight: 24,
	},
	currentSentence: {
		backgroundColor: `${COLORS.neonBlue}30`,
		borderRadius: 8,
	},
	currentSentenceText: {
		color: COLORS.textPrimary,
		fontWeight: "500",
	},
	playbackControlsContainer: {
		padding: 15,
		borderTopWidth: 1,
		borderTopColor: "rgba(255, 255, 255, 0.1)",
	},
	speedControlContainer: {
		marginBottom: 15,
	},
	speedLabel: {
		color: COLORS.textSecondary,
		fontSize: 14,
		marginBottom: 5,
	},
	slider: {
		width: "100%",
		height: 40,
	},
	playControls: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 15,
	},
	controlButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 8,
	},
	playPauseButton: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: COLORS.neonBlue,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 12,
	},
	progressContainer: {
		alignItems: "center",
	},
	progressText: {
		color: COLORS.textSecondary,
		fontSize: 14,
		marginBottom: 5,
	},
	progressBar: {
		width: "100%",
		height: 4,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		borderRadius: 2,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: COLORS.neonPurple,
		borderRadius: 2,
	},
});
