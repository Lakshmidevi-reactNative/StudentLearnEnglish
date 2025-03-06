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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { toast } from "sonner-native";

export default function ReadEnglishPracticeScreen({ navigation, route }) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMicActive, setIsMicActive] = useState(false);
	const [playbackRate, setPlaybackRate] = useState(0.8);
	const [showSpeedSlider, setShowSpeedSlider] = useState(false);
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [mode, setMode] = useState("word"); // 'word' or 'sentence'
	const [selectedWordType, setSelectedWordType] = useState(null);
	const { isDarkMode } = useTheme();

	const content = {
		title: "Business Case Study",
		text: "In today's rapidly evolving business landscape, companies must adapt to changing consumer preferences and technological advancements. This case study examines how successful organizations navigate digital transformation while maintaining their core values and customer relationships. Through careful analysis of market trends and customer feedback, businesses can develop strategies that balance innovation with tradition.",
		source: "Harvard Business Review",
		level: "Intermediate",
		wordTypes: {
			nouns: [
				"business",
				"landscape",
				"companies",
				"preferences",
				"advancements",
				"study",
				"organizations",
				"transformation",
				"values",
				"relationships",
				"analysis",
				"trends",
				"feedback",
				"strategies",
				"innovation",
				"tradition",
			],
			verbs: [
				"evolving",
				"adapt",
				"examines",
				"navigate",
				"maintaining",
				"develop",
				"balance",
			],
			adjectives: [
				"rapidly",
				"changing",
				"technological",
				"successful",
				"digital",
				"core",
			],
			pronouns: ["this"],
			adverbs: ["today", "careful"],
		},
	};

	// Split text into words and sentences
	const words = content.text.split(" ");
	const sentences = content.text.match(/[^.!?]+[.!?]+/g) || [content.text];

	const handleModeChange = (newMode) => {
		setMode(newMode);
		setCurrentWordIndex(0);
		setSelectedWordType(null);

		// Pause any speaking when changing modes
		if (isPlaying) {
			setIsPlaying(false);
		}

		toast(
			`Switched to ${newMode} mode. ${
				newMode === "word"
					? "Words will speak slowly one by one"
					: "Sentences will speak like a paragraph"
			}`
		);
	};

	const handleWordTypeSelect = (type) => {
		// If currently playing, temporarily pause to avoid confusion
		const wasPlaying = isPlaying;
		if (wasPlaying) {
			setIsPlaying(false);
		}

		setSelectedWordType(selectedWordType === type ? null : type);
		toast(
			selectedWordType === type
				? "Word type deselected"
				: `Highlighting ${type}`
		);

		// In a real implementation, could resume playing if was playing before
	};

	const isWordOfType = (word) => {
		if (!selectedWordType) return null;
		const cleanWord = word.toLowerCase().replace(/[.,!?]/g, "");
		return content.wordTypes[selectedWordType]?.includes(cleanWord)
			? highlightStyles[selectedWordType][isDarkMode ? "dark" : "light"]
			: null;
	};

	const handleSpeak = () => {
		setIsPlaying(!isPlaying);
		toast(
			isPlaying
				? "Paused"
				: `Playing: ${
						mode === "word"
							? words[currentWordIndex]
							: sentences[currentWordIndex]
				  }`
		);

		// In a real implementation, this would use TTS to speak the words/sentences
		// and would have logic to continue through all content based on playbackRate
	};

	const handleMic = () => {
		setIsMicActive(!isMicActive);
		toast(isMicActive ? "Recording stopped" : "Recording started...");
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

	const handleReset = () => {
		setIsPlaying(false);
		setIsMicActive(false);
		setPlaybackRate(0.8);
		setCurrentWordIndex(0);
		toast("Reset to beginning");

		// In a real implementation, this would reset the TTS and start from the beginning
		// if isPlaying is true, it would start speaking from the first word/sentence
	};

	const handleSpeedPress = () => {
		setShowSpeedSlider(!showSpeedSlider);
	};

	const handleSpeedChange = (value) => {
		// Convert slider value (0-100) to speed (0.8-1.5)
		const speed = 0.8 + (value / 100) * 0.7;
		setPlaybackRate(Number(speed.toFixed(1)));

		// In a real implementation, this would update the speech rate of TTS
		const modeDescription =
			mode === "word" ? "Word speaking" : "Sentence speaking";
		toast(`${modeDescription} speed: ${speed.toFixed(1)}x`);
	};

	const handleNextWord = () => {
		const maxIndex = mode === "word" ? words.length - 1 : sentences.length - 1;
		if (currentWordIndex < maxIndex) {
			const newIndex = currentWordIndex + 1;
			setCurrentWordIndex(newIndex);

			// In a real implementation, if isPlaying was true, it would
			// pause current speaking and start speaking the new word/sentence
			if (isPlaying) {
				toast(
					`Playing: ${mode === "word" ? words[newIndex] : sentences[newIndex]}`
				);
			}
		}
	};

	const handlePreviousWord = () => {
		if (currentWordIndex > 0) {
			const newIndex = currentWordIndex - 1;
			setCurrentWordIndex(newIndex);

			// In a real implementation, if isPlaying was true, it would
			// pause current speaking and start speaking the new word/sentence
			if (isPlaying) {
				toast(
					`Playing: ${mode === "word" ? words[newIndex] : sentences[newIndex]}`
				);
			}
		}
	};

	const renderModeButtons = () => (
		<View style={styles.modeButtonsContainer}>
			<TouchableOpacity
				style={[
					styles.modeButton,
					mode === "word" && styles.modeButtonActive,
					isDarkMode && styles.darkModeButton,
					mode === "word" && isDarkMode && styles.darkModeButtonActive,
				]}
				onPress={() => handleModeChange("word")}
				activeOpacity={0.7}
			>
				<MaterialIcons
					name="text-fields"
					size={20}
					color={mode === "word" ? "white" : isDarkMode ? "#A0AEC0" : "#4A5568"}
				/>
				<Text
					style={[
						styles.modeButtonText,
						mode === "word" && styles.modeButtonTextActive,
						isDarkMode && styles.darkText,
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
					isDarkMode && styles.darkModeButton,
					mode === "sentence" && isDarkMode && styles.darkModeButtonActive,
				]}
				onPress={() => handleModeChange("sentence")}
				activeOpacity={0.7}
			>
				<MaterialIcons
					name="subject"
					size={20}
					color={
						mode === "sentence" ? "white" : isDarkMode ? "#A0AEC0" : "#4A5568"
					}
				/>
				<Text
					style={[
						styles.modeButtonText,
						mode === "sentence" && styles.modeButtonTextActive,
						isDarkMode && styles.darkText,
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
						isDarkMode && styles.darkWordTypeButton,
						selectedWordType === type &&
							isDarkMode &&
							styles.darkWordTypeButtonActive,
					]}
					onPress={() => handleWordTypeSelect(type)}
					activeOpacity={0.7}
				>
					<Text
						style={[
							styles.wordTypeButtonText,
							selectedWordType === type && styles.wordTypeButtonTextActive,
							isDarkMode && styles.darkText,
							selectedWordType === type && styles.wordTypeButtonTextActive,
						]}
					>
						{type.charAt(0).toUpperCase() + type.slice(1)} ({words.length})
					</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	);

	const handleWordTap = (index) => {
		setCurrentWordIndex(index);

		// Speak the selected word
		const textToSpeak = mode === "word" ? words[index] : sentences[index];
		toast(`Speaking: ${textToSpeak}`);

		// In a real implementation, this would use TTS to speak the word/sentence
	};

	const renderContent = () => {
		if (mode === "word") {
			return words.map((word, index) => {
				const highlightStyle = isWordOfType(word);
				return (
					<TouchableOpacity
						key={index}
						onPress={() => handleWordTap(index)}
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
					onPress={() => handleWordTap(index)}
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
			<LinearGradient
				colors={["#9F7AEA", "#805AD5"]}
				style={styles.header}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
			>
				<View style={styles.headerContent}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => navigation.goBack()}
					>
						<MaterialIcons name="arrow-back" size={22} color="white" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Reading Practice</Text>
				</View>

				<View style={styles.contentInfo}>
					<Text style={styles.contentTitle}>{content.title}</Text>
					<View style={styles.contentMeta}>
						<View style={styles.levelBadge}>
							<Text style={styles.levelText}>{content.level}</Text>
						</View>
						<Text style={styles.sourceText}>Source: {content.source}</Text>
					</View>
				</View>
			</LinearGradient>

			<ScrollView
				style={[styles.container, isDarkMode && styles.darkContainer]}
				contentContainerStyle={styles.scrollContent}
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

					<View
						style={[
							styles.controlPanel,
							isDarkMode && { backgroundColor: "#2D3748" },
						]}
					>
						<TouchableOpacity
							style={[
								styles.controlButton,
								styles.resetButton,
								isDarkMode && styles.darkResetButton,
							]}
							onPress={handleSpeedPress}
						>
							<MaterialIcons
								name="speed"
								size={22}
								color={isDarkMode ? "#A0AEC0" : "#4A5568"}
							/>
							<Text style={[styles.speedText, isDarkMode && styles.darkText]}>
								{playbackRate}x
							</Text>
						</TouchableOpacity>

						{showSpeedSlider && (
							<View
								style={[
									styles.speedSliderContainer,
									isDarkMode && styles.darkSliderContainer,
								]}
							>
								<View style={styles.speedSliderHeader}>
									<Text
										style={[
											styles.speedSliderTitle,
											isDarkMode && styles.darkText,
										]}
									>
										Adjust Speed
									</Text>
									<TouchableOpacity onPress={() => setShowSpeedSlider(false)}>
										<MaterialIcons
											name="close"
											size={22}
											color={isDarkMode ? "#A0AEC0" : "#4A5568"}
										/>
									</TouchableOpacity>
								</View>

								<View style={styles.speedSliderContent}>
									<View style={styles.speedMarkers}>
										<Text
											style={[
												styles.speedMarker,
												isDarkMode && styles.darkText,
											]}
										>
											0.8x
										</Text>
										<Text
											style={[
												styles.speedMarker,
												isDarkMode && styles.darkText,
											]}
										>
											1.0x
										</Text>
										<Text
											style={[
												styles.speedMarker,
												isDarkMode && styles.darkText,
											]}
										>
											1.2x
										</Text>
										<Text
											style={[
												styles.speedMarker,
												isDarkMode && styles.darkText,
											]}
										>
											1.5x
										</Text>
									</View>

									<View
										style={[
											styles.sliderTrack,
											isDarkMode && styles.darkSliderTrack,
										]}
									>
										<View
											style={[
												styles.sliderFill,
												{ width: `${((playbackRate - 0.8) / 0.7) * 100}%` },
											]}
										/>
									</View>

									<View
										style={[
											styles.sliderThumb,
											{ left: `${((playbackRate - 0.8) / 0.7) * 100}%` },
										]}
									>
										<View style={styles.sliderThumbInner} />
									</View>

									<Pressable
										style={styles.sliderTouchArea}
										onTouchMove={(e) => {
											const { locationX } = e.nativeEvent;
											const width = 280; // Width of slider area
											const percentage = Math.max(
												0,
												Math.min(100, (locationX / width) * 100)
											);
											handleSpeedChange(percentage);
										}}
									/>
								</View>
							</View>
						)}

						<TouchableOpacity
							style={[
								styles.controlButton,
								styles.resetButton,
								isDarkMode && styles.darkResetButton,
							]}
							onPress={handleReset}
						>
							<MaterialIcons
								name="refresh"
								size={22}
								color={isDarkMode ? "#A0AEC0" : "#4A5568"}
							/>
						</TouchableOpacity>

						<Pressable
							style={({ pressed }) => [
								styles.controlButton,
								styles.navigationButton,
								pressed && styles.navigationButtonPressed,
								isDarkMode && styles.darkNavigationButton,
							]}
							onPress={handlePreviousWord}
						>
							<MaterialIcons name="chevron-left" size={26} color="#805AD5" />
						</Pressable>

						<Pressable
							style={({ pressed }) => [
								styles.controlButton,
								styles.navigationButton,
								pressed && styles.navigationButtonPressed,
								isDarkMode && styles.darkNavigationButton,
							]}
							onPress={handleNextWord}
						>
							<MaterialIcons name="chevron-right" size={26} color="#805AD5" />
						</Pressable>

						<TouchableOpacity
							style={[
								styles.controlButton,
								styles.micButton,
								isMicActive && styles.activeMicButton,
								isDarkMode && styles.darkControlButton,
							]}
							onPress={handleMic}
						>
							<MaterialIcons
								name={isMicActive ? "mic" : "mic-none"}
								size={22}
								color={
									isMicActive ? "#EF4444" : isDarkMode ? "#A0AEC0" : "#4A5568"
								}
							/>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								styles.controlButton,
								styles.playButton,
								isPlaying && styles.activePlayButton,
								isDarkMode && styles.darkControlButton,
							]}
							onPress={handleSpeak}
						>
							<MaterialIcons
								name={isPlaying ? "pause" : "volume-up"}
								size={22}
								color={
									isPlaying ? "#48BB78" : isDarkMode ? "#A0AEC0" : "#4A5568"
								}
							/>
							<Text
								style={[
									styles.speakerText,
									isPlaying && styles.activeSpeakerText,
									isDarkMode && styles.darkText,
								]}
							>
								{isPlaying ? "Stop" : "Speak"}
							</Text>
						</TouchableOpacity>
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
	container: {
		flex: 1,
		backgroundColor: "#F5F7FA",
	},
	scrollContent: {
		flexGrow: 1,
	},
	header: {
		padding: 15,
		paddingTop: 46,

		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
		elevation: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.2,
		shadowRadius: 6,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	backButton: {
		marginRight: 12,
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: "rgba(255,255,255,0.2)",
		alignItems: "center",
		justifyContent: "center",
	},
	headerTitle: {
		fontSize: 22,
		fontWeight: "bold",
		color: "white",
	},
	contentInfo: {
		marginTop: 4,
		marginBottom: 4,
	},
	contentTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "white",
		marginBottom: 6,
	},
	contentMeta: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		gap: 8,
	},
	levelBadge: {
		backgroundColor: "rgba(255,255,255,0.2)",
		paddingHorizontal: 10,
		paddingVertical: 3,
		borderRadius: 10,
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
	mainContent: {
		padding: 16,
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
		padding: 10,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		gap: 6,
		elevation: 1,
	},
	modeButtonActive: {
		backgroundColor: "#805AD5",
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
		paddingHorizontal: 4,
	},
	wordTypeButton: {
		backgroundColor: "#EDF2F7",
		paddingHorizontal: 14,
		paddingVertical: 6,
		borderRadius: 18,
		marginRight: 8,
		elevation: 1,
	},
	wordTypeButtonActive: {
		backgroundColor: "#805AD5",
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
	selectedWord: {
		backgroundColor: "#805AD5",
		color: "white",
		borderRadius: 4,
	},
	selectedWordDark: {
		backgroundColor: "#6B46C1",
	},
	selectedSentence: {
		backgroundColor: "#805AD5",
		color: "white",
		borderRadius: 4,
		padding: 8,
	},
	highlightedWord: {
		backgroundColor: "#F5EEFF",
		borderRadius: 4,
	},
	controlPanel: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 15,
		padding: 16,
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
	speedText: {
		fontSize: 12,
		color: "#4A5568",
		marginTop: 2,
	},
	speedSliderContainer: {
		position: "absolute",
		bottom: 90,
		left: 16,
		right: 16,
		backgroundColor: "white",
		borderRadius: 15,
		padding: 16,
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
		backgroundColor: "#805AD5",
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
		borderColor: "#805AD5",
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
		backgroundColor: "#805AD5",
	},
	sliderTouchArea: {
		position: "absolute",
		top: -10,
		left: 0,
		right: 0,
		height: 40,
	},
	navigationButton: {
		backgroundColor: "#F5EEFF",
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#805AD5",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	navigationButtonPressed: {
		backgroundColor: "#805AD5",
	},
	micButton: {
		backgroundColor: "#EDF2F7",
		width: 40,
		height: 40,
		borderRadius: 20,
	},
	activeMicButton: {
		backgroundColor: "#FEE2E2",
	},
	playButton: {
		backgroundColor: "#EDF2F7",
		width: 80,
		height: 40,
		borderRadius: 20,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 5,
	},
	activePlayButton: {
		backgroundColor: "#F0FDF4",
	},
	speakerText: {
		fontSize: 12,
		fontWeight: "500",
		color: "#4A5568",
	},
	activeSpeakerText: {
		color: "#48BB78",
	},
	word: {
		fontSize: 16,
		lineHeight: 24,
		color: "#2D3748",
		paddingVertical: 2,
		paddingHorizontal: 4,
	},
	darkText: {
		color: "#E2E8F0", // Lighter gray for dark mode
	},
	sentence: {
		fontSize: 16,
		lineHeight: 24,
		color: "#2D3748",
		marginBottom: 8,
		paddingVertical: 2,
		paddingHorizontal: 4,
	},
	darkContainer: {
		backgroundColor: "#1A202C",
	},
	darkModeButton: {
		backgroundColor: "#2D3748",
	},
	darkModeButtonActive: {
		backgroundColor: "#6B46C1",
	},
	darkWordTypeButton: {
		backgroundColor: "#2D3748",
	},
	darkWordTypeButtonActive: {
		backgroundColor: "#6B46C1",
	},
	darkResetButton: {
		backgroundColor: "#4A5568",
	},
	darkNavigationButton: {
		backgroundColor: "#4A5568",
	},
	darkControlButton: {
		backgroundColor: "#4A5568",
	},
	darkSliderContainer: {
		backgroundColor: "#2D3748",
	},
	darkSliderTrack: {
		backgroundColor: "#4A5568",
	},
});
