import React, { useState, useEffect, useRef } from "react";
import {
	SafeAreaView,
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Switch,
	StatusBar,
	Dimensions,
	Animated,
	Platform,
	Modal,
	TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../App";
import { toast } from "sonner-native";
import * as Speech from "expo-speech";

// Simulated backend data
const WORD_POS_DATA = {
	adobe: "noun",
	portable: "adjective",
	document: "noun",
	format: "noun",
	universal: "adjective",
	file: "noun",
	preserves: "verb",
	fonts: "noun",
	formatting: "noun",
	colours: "noun",
	graphics: "noun",
	source: "noun",
	regardless: "adverb",
	application: "noun",
	platform: "noun",
	ideal: "adjective",
	electronic: "adjective",
	distribution: "noun",
	overcomes: "verb",
	problems: "noun",
	commonly: "adverb",
	encountered: "verb",
	sharing: "noun",
	anywhere: "adverb",
	open: "verb",
	need: "verb",
	acrobat: "noun",
	reader: "noun",
	recipients: "noun",
	exactly: "adverb",
	created: "verb",
	lost: "adjective",
	incompatibilities: "noun",
	download: "verb",
	distributed: "verb",
	compact: "adjective",
	smaller: "adjective",
	display: "verb",
	web: "noun",
	pdf: "noun",
	free: "adjective",
	device: "noun",
	create: "verb",
	systems: "noun",
	operating: "adjective",
	software: "noun",
	version: "noun",
	easy: "adjective",
	fast: "adjective",
	page: "noun",
	time: "noun",
};

// Helper function to get color based on accuracy
const getAccuracyColor = (accuracy, isDarkMode) => {
	if (accuracy >= 80) {
		return "#4CAF50"; // Green for good
	} else if (accuracy >= 60) {
		return "#FF9800"; // Orange for average
	} else {
		return "#F44336"; // Red for needs improvement
	}
};

// Word tooltip component
const WordTooltip = ({
	visible,
	word,
	onClose,
	position,
	theme,
	onListen,
	onRecord,
	isPlaying,
	isRecording,
	accuracy,
}) => {
	const partOfSpeech = WORD_POS_DATA[word.toLowerCase()] || "unknown";
	const { width: SCREEN_WIDTH } = Dimensions.get("window");
	const tooltipWidth = 180;
	let tooltipX = position.x - tooltipWidth / 2;

	if (tooltipX < 20) tooltipX = 20;
	if (tooltipX + tooltipWidth > SCREEN_WIDTH - 20) {
		tooltipX = SCREEN_WIDTH - tooltipWidth - 20;
	}

	if (!visible) return null;

	const themeColorBg = theme ? "#2D3748" : "#ffffff";
	const themeColorText = theme ? "#E2E8F0" : "#2D3748";
	const themeColorBorder = theme ? "#4A5568" : "#e0e0e0";
	const accentColor = "#4A90E2";

	return (
		<Modal
			transparent={true}
			visible={visible}
			animationType="fade"
			onRequestClose={onClose}
		>
			<TouchableWithoutFeedback onPress={onClose}>
				<View style={styles.tooltipModalOverlay}>
					<TouchableWithoutFeedback>
						<View
							style={[
								styles.tooltipContainer,
								{
									left: tooltipX,
									top: position.y + 20,
									backgroundColor: themeColorBg,
									borderColor: themeColorBorder,
								},
							]}
						>
							<View style={styles.tooltipHeader}>
								<Text style={[styles.tooltipWord, { color: themeColorText }]}>
									{word}
								</Text>
								<Text style={[styles.tooltipPos, { color: accentColor }]}>
									{partOfSpeech}
								</Text>
								<TouchableOpacity
									style={styles.tooltipCloseButton}
									onPress={onClose}
									hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
								>
									<MaterialIcons
										name="close"
										size={18}
										color={themeColorText}
									/>
								</TouchableOpacity>
							</View>

							{accuracy !== null && (
								<View style={styles.accuracyContainer}>
									<Text
										style={[styles.accuracyText, { color: themeColorText }]}
									>
										Accuracy:
										<Text style={{ color: getAccuracyColor(accuracy, theme) }}>
											{" "}
											{accuracy}%
										</Text>
									</Text>
								</View>
							)}

							<View style={styles.tooltipActions}>
								<TouchableOpacity
									style={[
										styles.tooltipActionButton,
										{
											backgroundColor: isPlaying
												? accentColor
												: "rgba(74, 144, 226, 0.15)",
										},
									]}
									onPress={onListen}
									disabled={isRecording}
								>
									<MaterialIcons
										name="volume-up"
										size={24}
										color={isPlaying ? "white" : accentColor}
									/>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										styles.tooltipActionButton,
										{
											backgroundColor: isRecording
												? "#FF4136"
												: "rgba(255, 65, 54, 0.15)",
										},
									]}
									onPress={onRecord}
									disabled={isPlaying}
								>
									<MaterialIcons
										name="mic"
										size={24}
										color={isRecording ? "white" : "#FF4136"}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

// Practice feedback modal
const PracticeFeedbackModal = ({
	visible,
	onClose,
	accuracy,
	theme,
	currentItem,
}) => {
	if (!visible) return null;

	const themeColorBg = theme ? "#2D3748" : "#ffffff";
	const themeColorText = theme ? "#E2E8F0" : "#2D3748";
	const themeColorBorder = theme ? "#4A5568" : "#e0e0e0";

	let feedbackMessage = "";
	let feedbackColor = "";

	if (accuracy >= 80) {
		feedbackMessage = "Excellent pronunciation!";
		feedbackColor = "#4CAF50";
	} else if (accuracy >= 60) {
		feedbackMessage = "Good effort! Keep practicing.";
		feedbackColor = "#FF9800";
	} else {
		feedbackMessage = "Try again with clearer pronunciation.";
		feedbackColor = "#F44336";
	}

	return (
		<Modal
			transparent={true}
			visible={visible}
			animationType="fade"
			onRequestClose={onClose}
		>
			<TouchableWithoutFeedback onPress={onClose}>
				<View style={styles.tooltipModalOverlay}>
					<TouchableWithoutFeedback>
						<View
							style={[
								styles.feedbackContainer,
								{
									backgroundColor: themeColorBg,
									borderColor: themeColorBorder,
								},
							]}
						>
							<TouchableOpacity
								style={styles.feedbackCloseButton}
								onPress={onClose}
								hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
							>
								<MaterialIcons name="close" size={18} color={themeColorText} />
							</TouchableOpacity>

							<Text style={[styles.feedbackTitle, { color: themeColorText }]}>
								Speech Recognition Results
							</Text>

							<View style={styles.feedbackContent}>
								<Text style={[styles.contentItem, { color: themeColorText }]}>
									Practice item:{" "}
									<Text style={{ fontWeight: "bold" }}>{currentItem}</Text>
								</Text>

								<View
									style={[
										styles.accuracyIndicator,
										{ borderColor: getAccuracyColor(accuracy, theme) },
									]}
								>
									<Text
										style={[
											styles.accuracyValue,
											{ color: getAccuracyColor(accuracy, theme) },
										]}
									>
										{accuracy}%
									</Text>
								</View>

								<Text
									style={[styles.feedbackMessage, { color: feedbackColor }]}
								>
									{feedbackMessage}
								</Text>
							</View>

							<TouchableOpacity
								style={[styles.feedbackButton, { backgroundColor: "#4A90E2" }]}
								onPress={onClose}
							>
								<Text style={styles.feedbackButtonText}>Continue</Text>
							</TouchableOpacity>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const ContentViewScreen = ({ navigation, route }) => {
	const { isDarkMode } = useTheme();
	const [wordMode, setWordMode] = useState(false);
	const [toggleValues, setToggleValues] = useState({
		A1: false,
		A2: false,
		B1: false,
		B2: false,
		C1: false,
		C2: false,
		sentenceA1: false,
		sentenceA2: false,
		sentenceB1: false,
		sentenceB2: false,
		sentenceC1: false,
		sentenceC2: false,
	});
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentItemIndex, setCurrentItemIndex] = useState(0);
	const [selectedWordType, setSelectedWordType] = useState(null);
	const [showCefrFilter, setShowCefrFilter] = useState(false);
	const [isAssignment, setIsAssignment] = useState(true);
	const [tooltipVisible, setTooltipVisible] = useState(false);
	const [selectedWord, setSelectedWord] = useState("");
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
	const [isWordPlaying, setIsWordPlaying] = useState(false);
	const [isWordRecording, setIsWordRecording] = useState(false);
	const [wordAccuracy, setWordAccuracy] = useState(null);
	const [isPracticing, setIsPracticing] = useState(false);
	const [globalAccuracy, setGlobalAccuracy] = useState(null);
	const [showFeedbackModal, setShowFeedbackModal] = useState(false);
	const [cefrVisible, setCefrVisible] = useState(true);

	const speechQueue = useRef([]);
	const currentSpeechIndex = useRef(0);
	const scrollY = useRef(new Animated.Value(0)).current;

	const HEADER_MAX_HEIGHT = 160;
	const HEADER_MIN_HEIGHT = 70;
	const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

	const headerOpacity = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE],
		outputRange: [1, 0],
		extrapolate: "clamp",
	});

	const stickyHeaderOpacity = scrollY.interpolate({
		inputRange: [HEADER_SCROLL_DISTANCE - 40, HEADER_SCROLL_DISTANCE],
		outputRange: [0, 1],
		extrapolate: "clamp",
	});

	const [assignmentData, setAssignmentData] = useState({
		id: 12087,
		title: "Adobe Acrobat PDF Files",
		type: "Language",
		dueDate: "2024-03-15",
		level: "Intermediate",
		source: "Technical Documents",
		duration: "10:00",
	});

	const [content, setContent] = useState({
		title: "Adobe Acrobat PDF Files",
		text: "Adobe® Portable Document Format (PDF) is a universal file format that preserves all of the fonts, formatting, colours and graphics of any source document, regardless of the application and platform used to create it. Adobe PDF is an ideal format for electronic document distribution as it overcomes the problems commonly encountered with electronic file sharing. • Anyone, anywhere can open a PDF file. All you need is the free Adobe Acrobat Reader. Recipients of other file formats sometimes can't open files because they don't have the applications used to create the documents. • PDF files always print correctly on any printing device. • PDF files always display exactly as created, regardless of fonts, software, and operating systems. Fonts, and graphics are not lost due to platform, software, and version incompatibilities. • The free Acrobat Reader is easy to download and can be freely distributed by anyone. • Compact PDF files are smaller than their source files and download a page at a time for fast display on the Web.",
		wordLevels: {
			adobe: "B1",
			portable: "B2",
			document: "A2",
			format: "A2",
			universal: "B1",
			file: "A1",
			preserves: "B2",
			fonts: "B1",
			formatting: "B2",
			colours: "A1",
			graphics: "B1",
			source: "B1",
			regardless: "C1",
			application: "B1",
			platform: "B1",
			ideal: "B1",
			electronic: "B1",
			distribution: "B2",
			overcomes: "B2",
			problems: "A2",
			commonly: "B1",
			encountered: "B2",
			sharing: "A2",
			anywhere: "A2",
			open: "A1",
			need: "A1",
			acrobat: "B1",
			reader: "A2",
			recipients: "B2",
			exactly: "B1",
			created: "A2",
			lost: "A2",
			incompatibilities: "C1",
			download: "A2",
			distributed: "B1",
			compact: "B2",
			smaller: "A1",
			display: "B1",
			web: "A2",
		},
		sentenceLevels: ["B1", "B1", "A2", "A2", "B1", "A2", "B1"],
	});

	const [words, setWords] = useState([]);
	const [sentences, setSentences] = useState([]);

	useEffect(() => {
		StatusBar.setBarStyle("light-content");
		if (Platform.OS === "android") {
			StatusBar.setBackgroundColor("transparent");
			StatusBar.setTranslucent(true);
		}
	}, []);

	useEffect(() => {
		if (content.text) {
			setWords(content.text.replace(/•/g, "").split(/\s+/));
			setSentences(
				content.text
					.split(/[•]/)
					.filter((s) => s.trim().length > 0)
					.map((s) => s.trim())
			);
		}
	}, [content.text]);

	useEffect(() => {
		if (route.params?.assignmentData) {
			setAssignmentData(route.params.assignmentData);

			if (route.params.assignmentData.source === "Educational Resources") {
				setIsAssignment(false);
			}

			if (route.params.assignmentData.content) {
				setContent((prevContent) => ({
					...prevContent,
					text: route.params.assignmentData.content,
					title: route.params.assignmentData.title,
				}));
			}
		}
	}, [route.params]);

	useEffect(() => {
		prepareSpeechQueue();
	}, [words, sentences, wordMode]);

	const prepareSpeechQueue = () => {
		if (wordMode) {
			speechQueue.current = [...words];
		} else {
			speechQueue.current = [...sentences];
		}
		currentSpeechIndex.current = 0;
	};

	const handleToggleChange = (key) => {
		setToggleValues({
			...toggleValues,
			[key]: !toggleValues[key],
		});

		toast(`${key} level ${toggleValues[key] ? "disabled" : "enabled"}`);
	};

	const toggleMode = (mode) => {
		const newMode = mode === "sentence" ? false : true;

		if (wordMode !== newMode) {
			setWordMode(newMode);
			setSelectedWordType(null);
			toast(`Switched to ${mode} mode`);

			Speech.stop();
			setIsPlaying(false);
			setIsPracticing(false);

			setTooltipVisible(false);

			setCurrentItemIndex(0);
			setTimeout(() => prepareSpeechQueue(), 0);
		}
	};

	const goBack = () => {
		Speech.stop();
		navigation.goBack();
	};

	const attemptAssignment = () => {
		Speech.stop();

		switch (assignmentData.type) {
			case "Typing":
				navigation.navigate("TypingAssignment", {
					assignmentData: assignmentData,
					onComplete: (results) => {
						navigation.navigate("TypingResult", { results });
					},
				});
				break;
			case "Language":
				navigation.navigate("LanguagePracticing", {
					assignmentData: assignmentData,
					onComplete: (results) => {
						navigation.navigate("LanguageResult", { results });
					},
				});
				break;
			case "RolePlay":
				navigation.navigate("RolePlay", {
					assignmentData: assignmentData,
					onComplete: (results) => {
						navigation.navigate("RolePlayResult", { results });
					},
				});
				break;
			default:
				toast.error(`Unknown assignment type: ${assignmentData.type}`);
				break;
		}
	};

	const toggleCefrFilter = () => {
		setShowCefrFilter(!showCefrFilter);
	};

	const toggleCefrVisibility = () => {
		setCefrVisible(!cefrVisible);
		toast(`CEFR level indicators ${cefrVisible ? "hidden" : "visible"}`);
	};

	const getWordLevel = (word) => {
		const cleanWord = word.toLowerCase().replace(/[.,!?®'"]/g, "");
		return content.wordLevels[cleanWord] || null;
	};

	const getSentenceLevel = (index) => {
		return content.sentenceLevels[index] || null;
	};

	const shouldShowLevel = (level, isInSentenceMode = false) => {
		const toggleKey = isInSentenceMode ? `sentence${level}` : level;
		return toggleValues[toggleKey];
	};

	const handleWordTypeSelect = (type) => {
		if (selectedWordType === type) {
			setSelectedWordType(null);
			toast("Level filter disabled");
		} else {
			setSelectedWordType(type);
			toast(`Highlighting ${type} level words`);
		}
	};

	const handleWordPress = (word, event) => {
		const cleanWord = word.replace(/[.,!?®'"]/g, "");

		if (cleanWord && cleanWord.trim().length > 0) {
			setIsWordPlaying(false);
			setIsWordRecording(false);
			setWordAccuracy(null);

			setSelectedWord(cleanWord);

			const { pageX, pageY } = event.nativeEvent;
			setTooltipPosition({ x: pageX, y: pageY });
			setTooltipVisible(true);
		}
	};

	const extractWordsFromSentence = (sentence) => {
		return sentence.split(/\s+/);
	};

	const playWordSound = () => {
		if (isWordRecording) return;

		setIsWordPlaying(true);

		try {
			Speech.stop();

			const speechOptions = {
				onDone: () => {
					setIsWordPlaying(false);
				},
			};

			Speech.speak(selectedWord, speechOptions);
			toast(`Speaking: "${selectedWord}"`);
		} catch (error) {
			console.error("Speech error:", error);
			setIsWordPlaying(false);
			toast("Error with speech synthesis");
		}
	};

	const startWordRecording = () => {
		if (isWordPlaying) return;

		setIsWordRecording(true);

		setTimeout(() => {
			setIsWordRecording(false);

			const randomAccuracy = Math.floor(Math.random() * 51) + 50;
			setWordAccuracy(randomAccuracy);

			if (randomAccuracy >= 80) {
				toast(`Excellent pronunciation: ${randomAccuracy}%`);
			} else if (randomAccuracy >= 60) {
				toast(`Good pronunciation: ${randomAccuracy}%`);
			} else {
				toast(`Try again: ${randomAccuracy}%`);
			}
		}, 2000);
	};

	const handlePlayPause = () => {
		const newPlayingState = !isPlaying;
		setIsPlaying(newPlayingState);

		if (isPracticing && newPlayingState) {
			setIsPracticing(false);
		}

		if (newPlayingState) {
			playSpeechSequence();
			toast(`Starting playback`);
		} else {
			Speech.stop();
			toast("Playback paused");
		}
	};

	const handlePracticeToggle = () => {
		const newPracticingState = !isPracticing;
		setIsPracticing(newPracticingState);

		if (isPlaying && newPracticingState) {
			setIsPlaying(false);
			Speech.stop();
		}

		if (newPracticingState) {
			startPracticeSession();
			toast("Speech practice started");
		} else {
			toast("Practice mode stopped");
		}
	};

	const startPracticeSession = () => {
		const currentItem = speechQueue.current[currentItemIndex];

		try {
			Speech.stop();

			const speechOptions = {
				onDone: () => {
					startPracticeRecording();
				},
			};

			Speech.speak(currentItem, speechOptions);
			toast(`Repeat after me: "${currentItem}"`);
		} catch (error) {
			console.error("Speech error:", error);
			setIsPracticing(false);
			toast("Error with speech synthesis");
		}
	};

	const startPracticeRecording = () => {
		toast("Recording... speak now");

		setTimeout(() => {
			const randomAccuracy = Math.floor(Math.random() * 51) + 50;
			setGlobalAccuracy(randomAccuracy);
			setShowFeedbackModal(true);
		}, 3000);
	};

	const handleFeedbackModalClose = () => {
		setShowFeedbackModal(false);

		if (isPracticing) {
			moveToNextItem();
		}
	};

	const moveToNextItem = () => {
		const nextIndex = currentItemIndex + 1;
		if (nextIndex < speechQueue.current.length) {
			setCurrentItemIndex(nextIndex);
			setTimeout(() => {
				if (isPracticing) {
					startPracticeSession();
				}
			}, 500);
		} else {
			setIsPracticing(false);
			toast("Practice complete!");
		}
	};

	const handleReset = () => {
		Speech.stop();
		setIsPracticing(false);

		setCurrentItemIndex(0);
		currentSpeechIndex.current = 0;

		const wasPlaying = isPlaying;
		setIsPlaying(false);

		setTimeout(() => {
			if (wasPlaying) {
				setIsPlaying(true);
				playSpeechSequence();
				toast("Restarted playback from beginning");
			} else {
				toast("Reset to beginning");
			}
		}, 100);
	};

	const playSpeechSequence = () => {
		if (currentSpeechIndex.current >= speechQueue.current.length) {
			setIsPlaying(false);
			toast("Reached the end of content");
			return;
		}

		const currentText = speechQueue.current[currentSpeechIndex.current];
		setCurrentItemIndex(currentSpeechIndex.current);

		try {
			Speech.stop();

			const speechOptions = {
				onStart: () => {
					setCurrentItemIndex(currentSpeechIndex.current);
				},
				onDone: () => {
					if (isPlaying) {
						currentSpeechIndex.current++;
						if (currentSpeechIndex.current < speechQueue.current.length) {
							playSpeechSequence();
						} else {
							setIsPlaying(false);
							toast("Playback complete");
						}
					}
				},
			};

			Speech.speak(currentText, speechOptions);
		} catch (error) {
			console.error("Speech error:", error);
			setIsPlaying(false);
			toast("Error with speech synthesis");
		}
	};

	const handleSentenceTap = (sentence, index) => {
		if (!wordMode) {
			setCurrentItemIndex(index);

			if (isPlaying) {
				setIsPlaying(false);
				Speech.stop();
			}
		}
	};

	const cefrStyles = {
		A1: {
			light: { backgroundColor: "#E9F7EF", color: "#27AE60" },
			dark: { backgroundColor: "#27AE60", color: "#E9F7EF" },
		},
		A2: {
			light: { backgroundColor: "#EBF5FB", color: "#3498DB" },
			dark: { backgroundColor: "#3498DB", color: "#EBF5FB" },
		},
		B1: {
			light: { backgroundColor: "#EAF2F8", color: "#2980B9" },
			dark: { backgroundColor: "#2980B9", color: "#EAF2F8" },
		},
		B2: {
			light: { backgroundColor: "#E8DAEF", color: "#8E44AD" },
			dark: { backgroundColor: "#8E44AD", color: "#E8DAEF" },
		},
		C1: {
			light: { backgroundColor: "#FADBD8", color: "#E74C3C" },
			dark: { backgroundColor: "#E74C3C", color: "#FADBD8" },
		},
		C2: {
			light: { backgroundColor: "#FDEBD0", color: "#F39C12" },
			dark: { backgroundColor: "#F39C12", color: "#FDEBD0" },
		},
	};

	const renderCefrBadge = (level) => {
		if (!level || !cefrVisible) return null;

		const style = cefrStyles[level][isDarkMode ? "dark" : "light"];

		return (
			<View
				style={[styles.cefrBadge, { backgroundColor: style.backgroundColor }]}
			>
				<Text style={[styles.cefrText, { color: style.color }]}>{level}</Text>
			</View>
		);
	};

	const headerColors = isDarkMode
		? ["#1a1a1a", "#1a1a1a"]
		: ["#4A90E2", "#357ABD"];
	const stickyHeaderBg = isDarkMode
		? "rgba(27,52,78,0.95)"
		: "rgba(249,250,251,0.97)";

	return (
		<SafeAreaView
			style={[styles.safeArea, isDarkMode && styles.darkContainer]}
			edges={["left", "right"]}
		>
			<StatusBar
				backgroundColor="transparent"
				barStyle="light-content"
				translucent
			/>

			<Animated.View
				style={[
					styles.stickyHeader,
					{
						backgroundColor: stickyHeaderBg,
						opacity: stickyHeaderOpacity,
						borderBottomColor: isDarkMode
							? "rgba(255,255,255,0.1)"
							: "rgba(0,0,0,0.1)",
					},
				]}
			>
				<View style={styles.stickyHeaderContent}>
					<TouchableOpacity style={styles.stickyBackButton} onPress={goBack}>
						<MaterialIcons
							name="arrow-back"
							size={24}
							color={isDarkMode ? "#FFFFFF" : "#4A90E2"}
						/>
					</TouchableOpacity>
					<Text
						style={[
							styles.stickyHeaderTitle,
							{ color: isDarkMode ? "#FFFFFF" : "#4A90E2" },
						]}
					>
						Content View
					</Text>
				</View>
			</Animated.View>

			<Animated.ScrollView
				style={[styles.mainScrollView, isDarkMode && styles.mainScrollViewDark]}
				contentContainerStyle={styles.mainScrollViewContent}
				scrollEventThrottle={16}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: true }
				)}
			>
				<Animated.View style={{ opacity: headerOpacity }}>
					<LinearGradient colors={headerColors} style={styles.header}>
						<View style={styles.headerContent}>
							<TouchableOpacity style={styles.backButton} onPress={goBack}>
								<MaterialIcons name="arrow-back" size={26} color="white" />
							</TouchableOpacity>

							<View style={styles.headerTextContainer}>
								<Text style={styles.headerTitle}>Content View</Text>
								<Text style={styles.contentTitle}>{content.title}</Text>

								<View style={styles.contentMeta}>
									<Text style={styles.sourceText}>
										Source: {assignmentData.source}
									</Text>
									<Text style={styles.durationText}>
										Duration: {assignmentData.duration}
									</Text>
								</View>
							</View>
						</View>
					</LinearGradient>
				</Animated.View>

				<View style={styles.modeToggleContainer}>
					<TouchableOpacity
						style={[
							styles.modeToggleButton,
							!wordMode && styles.activeToggleButton,
							isDarkMode && styles.modeToggleButtonDark,
						]}
						onPress={() => toggleMode("sentence")}
					>
						<Text
							style={[
								styles.toggleButtonText,
								!wordMode && styles.activeToggleText,
								isDarkMode && styles.darkToggleText,
							]}
						>
							Sentence
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.modeToggleButton,
							wordMode && styles.activeToggleButton,
							isDarkMode && styles.modeToggleButtonDark,
						]}
						onPress={() => toggleMode("word")}
					>
						<Text
							style={[
								styles.toggleButtonText,
								wordMode && styles.activeToggleText,
								isDarkMode && styles.darkToggleText,
							]}
						>
							Word
						</Text>
					</TouchableOpacity>
				</View>

				<View style={[styles.contentBox, isDarkMode && styles.contentBoxDark]}>
					{wordMode ? (
						<View style={styles.wordsContainer}>
							{words.map((word, index) => {
								const level = getWordLevel(word);
								const isLevelHighlighted =
									cefrVisible &&
									level &&
									(selectedWordType === level || shouldShowLevel(level));
								const isCurrentWord =
									index === currentItemIndex && (isPlaying || isPracticing);

								return (
									<TouchableOpacity
										key={index}
										style={styles.wordWrapper}
										onPress={(event) => handleWordPress(word, event)}
										activeOpacity={0.7}
									>
										<Text
											style={[
												styles.word,
												isDarkMode && styles.darkText,
												isLevelHighlighted && {
													backgroundColor:
														cefrStyles[level][isDarkMode ? "dark" : "light"]
															.backgroundColor,
													color:
														cefrStyles[level][isDarkMode ? "dark" : "light"]
															.color,
												},
												isCurrentWord && {
													backgroundColor: isPracticing
														? isDarkMode
															? "#C53030"
															: "#F56565"
														: isDarkMode
														? "#6B46C1"
														: "#805AD5",
													color: "white",
													borderRadius: 4,
													padding: 4,
												},
											]}
										>
											{word}
										</Text>
										{isLevelHighlighted && renderCefrBadge(level)}
									</TouchableOpacity>
								);
							})}
						</View>
					) : (
						<View>
							{sentences.map((sentence, sentenceIndex) => {
								const level = getSentenceLevel(sentenceIndex);
								const isLevelHighlighted =
									cefrVisible &&
									level &&
									(selectedWordType === level || shouldShowLevel(level, true));
								const isCurrentSentence =
									sentenceIndex === currentItemIndex &&
									(isPlaying || isPracticing);

								const sentenceWords = extractWordsFromSentence(sentence);

								return (
									<View
										key={sentenceIndex}
										style={[
											styles.sentenceContainer,
											isLevelHighlighted && {
												borderLeftWidth: 3,
												borderLeftColor:
													cefrStyles[level][isDarkMode ? "dark" : "light"]
														.backgroundColor,
												paddingLeft: 10,
											},
										]}
									>
										<View style={styles.sentenceHeader}>
											{isLevelHighlighted && renderCefrBadge(level)}
										</View>
										<TouchableOpacity
											onPress={() => handleSentenceTap(sentence, sentenceIndex)}
											activeOpacity={0.7}
										>
											<View
												style={[
													styles.sentenceContent,
													isCurrentSentence && {
														backgroundColor: isPracticing
															? isDarkMode
																? "#C53030"
																: "#F56565"
															: isDarkMode
															? "#6B46C1"
															: "#805AD5",
														borderRadius: 4,
														padding: 8,
													},
												]}
											>
												<View style={styles.sentenceWordsContainer}>
													{sentenceWords.map((word, wordIndex) => (
														<TouchableOpacity
															key={`${sentenceIndex}-${wordIndex}`}
															onPress={(event) => handleWordPress(word, event)}
															activeOpacity={0.7}
															style={styles.sentenceWordWrapper}
														>
															<Text
																style={[
																	styles.sentenceWord,
																	isDarkMode && styles.darkText,
																	isCurrentSentence && { color: "white" },
																]}
															>
																{word}
																{wordIndex < sentenceWords.length - 1
																	? " "
																	: ""}
															</Text>
														</TouchableOpacity>
													))}
												</View>
											</View>
										</TouchableOpacity>
									</View>
								);
							})}
						</View>
					)}
				</View>

				<View style={styles.actionButtonsContainer}>
					<TouchableOpacity
						style={styles.cefrFilterButton}
						onPress={toggleCefrFilter}
					>
						<MaterialIcons name="filter-list" size={20} color="#fff" />
						<Text style={styles.buttonText}>CEFR Levels</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.cefrVisibilityButton,
							!cefrVisible && styles.cefrVisibilityButtonDisabled,
						]}
						onPress={toggleCefrVisibility}
					>
						<MaterialIcons
							name={cefrVisible ? "visibility" : "visibility-off"}
							size={20}
							color="#fff"
						/>
						<Text style={styles.buttonText}>
							{cefrVisible ? "Hide CEFR" : "Show CEFR"}
						</Text>
					</TouchableOpacity>

					{isAssignment && (
						<TouchableOpacity
							style={styles.attemptButton}
							onPress={attemptAssignment}
						>
							<MaterialIcons name="play-arrow" size={20} color="#fff" />
							<Text style={styles.buttonText}>Attempt</Text>
						</TouchableOpacity>
					)}
				</View>

				<WordTooltip
					visible={tooltipVisible}
					word={selectedWord}
					onClose={() => setTooltipVisible(false)}
					position={tooltipPosition}
					theme={isDarkMode}
					onListen={playWordSound}
					onRecord={startWordRecording}
					isPlaying={isWordPlaying}
					isRecording={isWordRecording}
					accuracy={wordAccuracy}
				/>

				<PracticeFeedbackModal
					visible={showFeedbackModal}
					onClose={handleFeedbackModalClose}
					accuracy={globalAccuracy}
					theme={isDarkMode}
					currentItem={speechQueue.current[currentItemIndex] || ""}
				/>

				{showCefrFilter && (
					<View
						style={[
							styles.cefrFilterPanel,
							isDarkMode && styles.cefrFilterPanelDark,
						]}
					>
						<View
							style={[
								styles.cefrFilterHeader,
								isDarkMode && styles.darkHeaderBorder,
							]}
						>
							<Text style={[styles.filterTitle, isDarkMode && styles.darkText]}>
								{wordMode ? "Word Level Filter" : "Sentence Level Filter"}
							</Text>
							<TouchableOpacity onPress={toggleCefrFilter}>
								<MaterialIcons
									name="close"
									size={24}
									color={isDarkMode ? "#E2E8F0" : "#4A5568"}
								/>
							</TouchableOpacity>
						</View>

						<View style={styles.levelBreakdown}>
							{["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
								<View key={level} style={styles.switchRow}>
									<View
										style={[
											styles.levelBadge,
											{
												backgroundColor:
													cefrStyles[level][isDarkMode ? "dark" : "light"]
														.backgroundColor,
											},
										]}
									>
										<Text
											style={[
												styles.levelBadgeText,
												{
													color:
														cefrStyles[level][isDarkMode ? "dark" : "light"]
															.color,
												},
											]}
										>
											{level}
										</Text>
										<Text
											style={[
												styles.levelDescription,
												{
													color:
														cefrStyles[level][isDarkMode ? "dark" : "light"]
															.color,
												},
											]}
										>
											{level === "A1"
												? "Beginner"
												: level === "A2"
												? "Elementary"
												: level === "B1"
												? "Intermediate"
												: level === "B2"
												? "Upper Intermediate"
												: level === "C1"
												? "Advanced"
												: "Proficiency"}
										</Text>
									</View>
									<Switch
										value={toggleValues[wordMode ? level : `sentence${level}`]}
										onValueChange={() =>
											handleToggleChange(wordMode ? level : `sentence${level}`)
										}
										trackColor={{
											false: isDarkMode ? "#555" : "#d1d1d1",
											true: cefrStyles[level][isDarkMode ? "dark" : "light"]
												.backgroundColor,
										}}
										thumbColor={isDarkMode ? "#ddd" : "#fff"}
									/>
								</View>
							))}
						</View>
					</View>
				)}

				<View style={styles.bottomSpacing} />
			</Animated.ScrollView>

			<View
				style={[
					styles.controlPanelContainer,
					isDarkMode && { backgroundColor: "#1a1a1a", borderTopColor: "#333" },
				]}
			>
				<View
					style={[
						styles.controlPanel,
						isDarkMode && { backgroundColor: "#2D3748" },
					]}
				>
					<TouchableOpacity
						style={[styles.controlButton, styles.resetButton]}
						onPress={handleReset}
						activeOpacity={0.7}
					>
						<MaterialIcons
							name="refresh"
							size={24}
							color={isDarkMode ? "#E2E8F0" : "#4A5568"}
						/>
						<Text style={[styles.controlText, isDarkMode && styles.darkText]}>
							Restart
						</Text>
					</TouchableOpacity>

					{/* Speaker Button (formerly Play button) */}
					<TouchableOpacity
						style={[
							styles.playButton,
							isPlaying && styles.activePlayButton,
							isDarkMode && styles.darkPlayButton,
							isDarkMode && isPlaying && styles.darkActivePlayButton,
						]}
						onPress={handlePlayPause}
						disabled={isPracticing}
					>
						<MaterialIcons
							name={isPlaying ? "pause" : "volume-up"}
							size={32}
							color={isPlaying ? "#48BB78" : isDarkMode ? "#E2E8F0" : "#4A5568"}
						/>
						<Text
							style={[
								styles.controlText,
								isDarkMode && styles.darkText,
								isPlaying && { color: "#48BB78" },
								isPracticing && { color: isDarkMode ? "#4A5568" : "#A0AEC0" },
							]}
						>
							{isPlaying ? "Pause" : "Listen"}
						</Text>
					</TouchableOpacity>

					{/* Microphone Button (new) */}
					<TouchableOpacity
						style={[
							styles.micButton,
							isPracticing && styles.activeMicButton,
							isDarkMode && styles.darkMicButton,
							isDarkMode && isPracticing && styles.darkActiveMicButton,
						]}
						onPress={handlePracticeToggle}
						disabled={isPlaying}
					>
						<MaterialIcons
							name="mic"
							size={32}
							color={
								isPracticing ? "#F56565" : isDarkMode ? "#E2E8F0" : "#4A5568"
							}
						/>
						<Text
							style={[
								styles.controlText,
								isDarkMode && styles.darkText,
								isPracticing && { color: "#F56565" },
								isPlaying && { color: isDarkMode ? "#4A5568" : "#A0AEC0" },
							]}
						>
							Practice
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};

const { width, height } = Dimensions.get("window");
const isTablet = width > 768;

const styles = StyleSheet.create({
	// Tooltip styles
	tooltipModalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.3)",
	},
	tooltipContainer: {
		position: "absolute",
		width: 180,
		borderRadius: 12,
		padding: 14,
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
		marginBottom: 12,
	},
	tooltipWord: {
		fontSize: 16,
		fontWeight: "bold",
		marginRight: 8,
		flex: 1,
	},
	tooltipPos: {
		fontSize: 14,
		fontStyle: "italic",
		textTransform: "capitalize",
	},
	tooltipCloseButton: {
		width: 22,
		height: 22,
		borderRadius: 11,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.1)",
		marginLeft: 8,
	},
	accuracyContainer: {
		marginBottom: 12,
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0,0,0,0.1)",
	},
	accuracyText: {
		fontSize: 14,
		textAlign: "center",
	},
	tooltipActions: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	tooltipActionButton: {
		width: 70,
		height: 44,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
	},

	// Practice Feedback Modal styles
	feedbackContainer: {
		width: 300,
		borderRadius: 16,
		padding: 20,
		borderWidth: 1,
		elevation: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		alignSelf: "center",
		marginTop: 100,
	},
	feedbackCloseButton: {
		position: "absolute",
		top: 12,
		right: 12,
		width: 26,
		height: 26,
		borderRadius: 13,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.1)",
	},
	feedbackTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 16,
		textAlign: "center",
	},
	feedbackContent: {
		alignItems: "center",
		marginVertical: 16,
	},
	contentItem: {
		fontSize: 16,
		marginBottom: 16,
		textAlign: "center",
	},
	accuracyIndicator: {
		width: 80,
		height: 80,
		borderRadius: 40,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 4,
		marginVertical: 12,
	},
	accuracyValue: {
		fontSize: 24,
		fontWeight: "bold",
	},
	feedbackMessage: {
		fontSize: 16,
		fontWeight: "500",
		textAlign: "center",
		marginTop: 12,
	},
	feedbackButton: {
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 8,
	},
	feedbackButtonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
	},

	// Main container styles
	safeArea: {
		flex: 1,
		backgroundColor: "#F5F7FA",
	},
	darkContainer: {
		backgroundColor: "#1B344E",
	},
	darkText: {
		color: "#E2E8F0",
	},
	// Sticky Header styles
	stickyHeader: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: Platform.OS === "ios" ? 65 : 95,
		backgroundColor: "rgba(249,250,251,0.98)",
		zIndex: 1000,
		borderBottomWidth: 1,
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.15,
		shadowRadius: 4,
	},
	stickyHeaderContent: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		paddingHorizontal: 16,
		height: "100%",
	},
	stickyBackButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#4A90E2",
		justifyContent: "center",
		alignItems: "center",
	},
	stickyHeaderTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#4A90E2",
		flex: 1,
		marginLeft: 16,
	},
	// Main Header styles
	header: {
		paddingTop:
			Platform.OS === "ios" ? 50 : (StatusBar.currentHeight || 0) + 20,
		paddingHorizontal: 20,
		paddingBottom: 25,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
		marginBottom: 10,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingTop: 10,
	},
	headerTextContainer: {
		flexDirection: "column",
		flex: 1,
		marginLeft: 16,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255,255,255,0.2)",
		justifyContent: "center",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 26,
		fontWeight: "bold",
		color: "white",
		marginBottom: 4,
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
	statsContainer: {
		backgroundColor: "rgba(255,255,255,0.15)",
		borderRadius: 15,
		padding: 10,
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.3)",
		minWidth: 90,
		alignItems: "center",
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
	// ScrollView styles
	mainScrollView: {
		flex: 1,
	},
	mainScrollViewDark: {
		backgroundColor: "#1a1a1a",
	},
	mainScrollViewContent: {
		paddingBottom: 100, // Extra padding for controls
	},
	// Mode Toggle styles
	modeToggleContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginVertical: 16,
		paddingHorizontal: 16,
	},
	modeToggleButton: {
		paddingVertical: 8,
		paddingHorizontal: 20,
		borderRadius: 20,
		backgroundColor: "#f0f0f0",
		marginHorizontal: 8,
	},
	modeToggleButtonDark: {
		backgroundColor: "#4B5563",
	},
	activeToggleButton: {
		backgroundColor: "#4A90E2",
	},
	toggleButtonText: {
		color: "#4A5568",
		fontWeight: "600",
	},
	darkToggleText: {
		color: "#E2E8F0",
	},
	activeToggleText: {
		color: "#fff",
	},
	// Content Box styles
	contentBox: {
		backgroundColor: "#fff",
		borderRadius: 15,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		marginBottom: 16,
		marginHorizontal: 16,
	},
	contentBoxDark: {
		backgroundColor: "#2D3748",
	},
	wordsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	wordWrapper: {
		flexDirection: "column",
		alignItems: "center",
		marginRight: 5,
		marginBottom: 10,
	},
	word: {
		fontSize: 16,
		color: "#2D3748",
		paddingVertical: 2,
		paddingHorizontal: 4,
		marginBottom: 3,
	},
	sentenceContainer: {
		marginBottom: 15,
	},
	sentenceHeader: {
		flexDirection: "row",
		marginBottom: 4,
	},
	sentenceContent: {
		paddingVertical: 6,
		paddingHorizontal: 8,
		borderRadius: 8,
	},
	sentenceWordsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	sentenceWordWrapper: {
		marginVertical: 2,
	},
	sentenceWord: {
		fontSize: 16,
		color: "#2D3748",
		lineHeight: 24,
	},
	// Action Buttons styles
	actionButtonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 16,
		marginHorizontal: 16,
		flexWrap: "wrap",
	},
	cefrFilterButton: {
		backgroundColor: "#3498DB",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 10,
		flex: 1,
		marginRight: 10,
		marginBottom: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 3,
		minWidth: 120,
	},
	cefrVisibilityButton: {
		backgroundColor: "#6B46C1",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 10,
		flex: 1,
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 3,
		minWidth: 120,
	},
	cefrVisibilityButtonDisabled: {
		backgroundColor: "#718096",
	},
	attemptButton: {
		backgroundColor: "#4A90E2",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 10,
		flex: 1,
		marginLeft: 10,
		marginBottom: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 3,
		minWidth: 120,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "600",
		marginLeft: 8,
	},
	// CEFR Filter Panel styles
	cefrFilterPanel: {
		backgroundColor: "#fff",
		borderRadius: 15,
		padding: 16,
		marginBottom: 16,
		marginHorizontal: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	cefrFilterPanelDark: {
		backgroundColor: "#2D3748",
		borderColor: "#4A5568",
	},
	cefrFilterHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
	},
	darkHeaderBorder: {
		borderBottomColor: "#4A5568",
	},
	filterTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#2D3748",
	},
	cefrButtons: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	cefrLevelButton: {
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 10,
		marginBottom: 10,
		width: "48%",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	cefrLevelButtonActive: {
		borderWidth: 2,
		borderColor: "#ffffff",
	},
	cefrLevelText: {
		fontSize: 16,
		fontWeight: "500",
	},
	cefrLevelTextActive: {
		fontWeight: "700",
	},
	levelBreakdown: {
		marginTop: 10,
	},
	switchRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	levelBadge: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 8,
		flex: 1,
	},
	levelBadgeText: {
		fontWeight: "bold",
		fontSize: 16,
		marginRight: 8,
	},
	levelDescription: {
		fontSize: 14,
	},
	cefrBadge: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 10,
		alignSelf: "flex-start",
		marginBottom: 2,
	},
	cefrText: {
		fontSize: 10,
		fontWeight: "bold",
	},
	// Enhanced Control Panel styles with speaker and mic buttons
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
		padding: 10,
	},
	controlText: {
		fontSize: 12,
		marginTop: 5,
		textAlign: "center",
		color: "#4A5568",
		fontWeight: "500",
	},
	resetButton: {
		borderRadius: 10,
		backgroundColor: "rgba(0,0,0,0.05)",
		padding: 10,
	},
	playButton: {
		backgroundColor: "#EDF2F7",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		width: 100,
		height: 70,
		borderRadius: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
	},
	darkPlayButton: {
		backgroundColor: "#2D3748",
	},
	activePlayButton: {
		backgroundColor: "#F0FDF4",
	},
	darkActivePlayButton: {
		backgroundColor: "#065F46",
	},
	// Mic button styles
	micButton: {
		backgroundColor: "#EDF2F7",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		width: 100,
		height: 70,
		borderRadius: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
	},
	darkMicButton: {
		backgroundColor: "#2D3748",
	},
	activeMicButton: {
		backgroundColor: "#FEF2F2",
	},
	darkActiveMicButton: {
		backgroundColor: "#7F1D1D",
	},
	bottomSpacing: {
		height: 40,
	},
	// Responsive adjustments for different screen sizes
	tabletContentBox: {
		padding: isTablet ? 24 : 16,
	},
	tabletWord: {
		fontSize: isTablet ? 18 : 16,
	},
	tabletSentence: {
		fontSize: isTablet ? 18 : 16,
		lineHeight: isTablet ? 28 : 24,
	},
	tabletControl: {
		paddingHorizontal: isTablet ? 24 : 16,
	},
});

export default ContentViewScreen;
