import React, { useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	SafeAreaView,
	Modal,
	StatusBar,
	Alert,
	TextInput,
	Animated,
	Dimensions,
} from "react-native";
import {
	FontAwesome5,
	Ionicons,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import axios from "axios";

interface TestItem {
	assignment_question_type_id: number;
	question_text: string;
	assignment_question_id: number;
	assignment_question_level: string;
	question_points: number;
}

interface SectionData {
	[key: string]: TestItem[];
}

interface ApiResponse {
	data: Array<{
		assignment_id: number;
		[key: string]: any;
	}>;
	message: string;
	statusCode: number;
}

interface TestResult {
	mode: string;
	wpm: number;
	accuracy: number;
	time: number;
	characters: string;
	consistency: number;
}

const { width } = Dimensions.get("window");

const TypingAssignment = ({ navigation, route }: any) => {
	// Constants
	const CHART_UPDATE_INTERVAL = 500; // Increased validation speed by reducing interval from 1000ms to 500ms
	const MAX_CHART_POINTS = 30;
	const AFK_TIMEOUT = 10000;
	const BASE_URL = "http://192.168.29.37:8080/learnengspring";
	const STUDENT_ID = "3065";
	const ASSIGNMENT_ID = "12082";

	// Section order
	const sectionOrder = ["words", "sentences", "paragraphs"];

	// Animation values
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.95)).current;

	// State and refs
	const [theme, setTheme] = useState("light");
	const [isLoading, setIsLoading] = useState(true);
	const [testTexts, setTestTexts] = useState<{ [key: string]: string[] }>({});
	const [currentTestMode, setCurrentTestMode] = useState("words");
	const [currentItems, setCurrentItems] = useState<string[]>([]);
	const [currentItemIndex, setCurrentItemIndex] = useState(0);
	const [testText, setTestText] = useState("");
	const [isTestActive, setIsTestActive] = useState(false);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [currentCharIndex, setCurrentCharIndex] = useState(0);
	const [correctChars, setCorrectChars] = useState(0);
	const [incorrectChars, setIncorrectChars] = useState(0);
	const [wpmHistory, setWpmHistory] = useState<number[]>(
		new Array(MAX_CHART_POINTS).fill(0)
	);
	const [currentWpm, setCurrentWpm] = useState(0);
	const [completedTests, setCompletedTests] = useState<{ [key: string]: any }>({
		words: null,
		sentences: null,
		paragraphs: null,
	});
	const [testResults, setTestResults] = useState<TestResult[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [showImmediateResultsView, setShowImmediateResultsView] =
		useState(false);
	const [showNextButton, setShowNextButton] = useState(false);
	const [showSubmitButton, setShowSubmitButton] = useState(false);
	const [showEmptyState, setShowEmptyState] = useState(false);
	const [textInputValue, setTextInputValue] = useState("");
	const [feedback, setFeedback] = useState({
		visible: false,
		message: "",
		type: "info",
	});
	const [progressPercent, setProgressPercent] = useState(0);

	// Refs
	const timerRef = useRef<number | null>(null);
	const afkTimeoutRef = useRef<number | null>(null);
	const textInputRef = useRef<TextInput>(null);
	const scrollViewRef = useRef<ScrollView>(null);

	// Initialize test
	useEffect(() => {
		fetchTestData();

		// Animate component mounting
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 600,
				useNativeDriver: true,
			}),
			Animated.timing(scaleAnim, {
				toValue: 1,
				duration: 600,
				useNativeDriver: true,
			}),
		]).start();
	}, []);

	// Effect for changing test mode
	useEffect(() => {
		if (Object.keys(testTexts).length > 0) {
			resetTestState();

			// Animate mode change
			Animated.sequence([
				Animated.timing(fadeAnim, {
					toValue: 0.5,
					duration: 150,
					useNativeDriver: true,
				}),
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();
		}
	}, [currentTestMode, testTexts]);

	// Focus effect
	useEffect(() => {
		// Focus on the text input when the component mounts or test mode changes
		if (
			textInputRef.current &&
			!showEmptyState &&
			!completedTests[currentTestMode]
		) {
			setTimeout(() => {
				textInputRef.current?.focus();
			}, 500);
		}
	}, [currentTestMode, showEmptyState, completedTests]);

	// Check for test completion effect
	useEffect(() => {
		if (currentCharIndex >= testText?.length && isTestActive && testText) {
			moveToNextItem();
		}

		// Update progress percentage
		if (currentItems.length > 0 && testText) {
			const totalChars = currentItems.reduce(
				(sum, item) => sum + (item?.length || 0),
				0
			);
			const prevItemsChars = currentItems
				.slice(0, currentItemIndex)
				.reduce((sum, item) => sum + (item?.length || 0), 0);

			const progress = ((prevItemsChars + currentCharIndex) / totalChars) * 100;
			setProgressPercent(Math.min(progress, 100));
		}
	}, [
		currentCharIndex,
		testText,
		isTestActive,
		currentItemIndex,
		currentItems,
	]);

	// WPM update effect - Added to fix WPM speed meter
	useEffect(() => {
		if (isTestActive && startTime) {
			// Start WPM updates when test is active
			startWpmUpdates();
		}

		return () => {
			// Clean up timer when component unmounts or test becomes inactive
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, [isTestActive, startTime]);

	// Handle text input change
	const handleTextInputChange = (text: string) => {
		// Only process the last character typed
		if (text.length > textInputValue.length) {
			const lastChar = text[text.length - 1];
			handleKeyPress(lastChar);
		}

		// Keep the text input clear to avoid visual feedback
		setTextInputValue("");
	};

	// Focus on text input when typing area is tapped
	const focusTextInput = () => {
		if (
			textInputRef.current &&
			!completedTests[currentTestMode] &&
			!showEmptyState
		) {
			textInputRef.current.focus();

			// Show a visual feedback for the focus action
			showFeedback("Keyboard active", "info");
		}
	};

	// Show temporary feedback message
	const showFeedback = (message: string, type: string) => {
		setFeedback({ visible: true, message, type });
		setTimeout(() => {
			setFeedback((prev) => ({ ...prev, visible: false }));
		}, 2000);
	};

	// Fetch test data using Axios
	const fetchTestData = async () => {
		try {
			setIsLoading(true);

			// Using axios instead of fetch
			const response = await axios.get(
				`${BASE_URL}/assignment/get-all-question/${ASSIGNMENT_ID}`
			);
			const apiData: ApiResponse = response.data;

			const parsedTexts = parseApiResponse(apiData);
			setTestTexts(parsedTexts);
			setCurrentItems(parsedTexts["words"] || []);
			setTestText(parsedTexts["words"]?.[0] || "");

			setIsLoading(false);
		} catch (error) {
			console.error("Failed to fetch test data:", error);
			Alert.alert("Error", "Failed to load typing test data");
			setIsLoading(false);
		}
	};

	// Parse API response
	const parseApiResponse = (response: ApiResponse) => {
		if (!response?.data?.[0]) {
			return { words: [], sentences: [], paragraphs: [] };
		}

		const data = response.data[0];
		const result: { [key: string]: string[] } = {};

		if (data["201"]) {
			result.words = data["201"].map((item) => item.question_text);
		}

		if (data["202"]) {
			result.sentences = data["202"].map((item) => item.question_text);
		}

		if (data["203"]) {
			result.paragraphs = data["203"].map((item) => item.question_text);
		}

		return result;
	};

	// Reset test state
	const resetTestState = () => {
		if (timerRef.current) clearInterval(timerRef.current);
		if (afkTimeoutRef.current) clearTimeout(afkTimeoutRef.current);

		const items = testTexts[currentTestMode] || [];
		setCurrentItems(items);
		setCurrentItemIndex(0);
		setTestText(items[0] || "");
		setCurrentCharIndex(0);
		setCorrectChars(0);
		setIncorrectChars(0);
		setIsTestActive(false);
		setCurrentWpm(0);
		setTextInputValue("");
		setProgressPercent(0);
		setWpmHistory(new Array(MAX_CHART_POINTS).fill(0)); // Reset WPM history

		// Check for empty sections
		if (items.length === 0) {
			setShowEmptyState(true);
			if (!completedTests[currentTestMode]) {
				markSectionAsCompleted(currentTestMode);
			}
		} else {
			setShowEmptyState(false);
		}

		// Check if this section was already completed
		if (completedTests[currentTestMode]) {
			setShowImmediateResultsView(true);
		} else {
			setShowImmediateResultsView(false);
			// Focus the text input after a slight delay to ensure layout is complete
			setTimeout(() => {
				if (textInputRef.current) {
					textInputRef.current.focus();
				}
			}, 300);
		}

		checkAllSectionsCompleted();
	};

	// Start the typing test
	const startTest = () => {
		if (isTestActive || completedTests[currentTestMode]) return;

		setIsTestActive(true);
		setStartTime(Date.now());
		setShowImmediateResultsView(false);

		// Small animation to indicate test has started
		Animated.sequence([
			Animated.timing(scaleAnim, {
				toValue: 1.03,
				duration: 150,
				useNativeDriver: true,
			}),
			Animated.timing(scaleAnim, {
				toValue: 1,
				duration: 150,
				useNativeDriver: true,
			}),
		]).start();

		// Start WPM updates
		startWpmUpdates();

		// Show a feedback message
		showFeedback("Test started!", "success");
	};

	// Start WPM updates
	const startWpmUpdates = () => {
		if (timerRef.current) clearInterval(timerRef.current);

		timerRef.current = setInterval(() => {
			if (isTestActive && startTime) {
				const wpm = calculateWpm();
				setCurrentWpm(wpm);

				// Update WPM history
				setWpmHistory((prev) => {
					const newHistory = [...prev];
					newHistory.shift();
					newHistory.push(wpm);
					return newHistory;
				});
			}
		}, CHART_UPDATE_INTERVAL) as unknown as number;
	};

	// Calculate WPM
	const calculateWpm = () => {
		if (!startTime) return 0;
		const timeElapsed = Math.max(1, (Date.now() - startTime) / 1000 / 60);
		return Math.round(correctChars / 5 / timeElapsed);
	};

	// Calculate accuracy
	const calculateAccuracy = () => {
		const totalAttempts = correctChars + incorrectChars;
		return totalAttempts > 0
			? Math.round((correctChars / totalAttempts) * 100)
			: 0;
	};

	// Calculate consistency
	const calculateConsistency = () => {
		const wpmValues = wpmHistory.filter((wpm) => wpm > 0);
		if (wpmValues.length < 2) return 0;

		const avg = wpmValues.reduce((a, b) => a + b) / wpmValues.length;
		const variance =
			wpmValues.reduce((a, b) => a + Math.pow(b - avg, 2), 0) /
			wpmValues.length;
		const consistency = 100 - Math.min(100, Math.sqrt(variance));

		return Math.round(consistency);
	};

	// Handle key press
	const handleKeyPress = (key: string) => {
		// Don't process if there's no content
		if (!currentItems || currentItems.length === 0 || showEmptyState) {
			return;
		}

		// Don't allow typing if test is completed for this mode
		if (completedTests[currentTestMode]) {
			return;
		}

		// Start test if not active
		if (!isTestActive) {
			startTest();
		}

		const expectedChar = testText[currentCharIndex];
		if (!expectedChar) return;

		// Compare typed character with expected character
		if (key === expectedChar) {
			setCorrectChars((prev) => prev + 1);
			setCurrentCharIndex((prev) => prev + 1);
		} else {
			setIncorrectChars((prev) => prev + 1);
			setCurrentCharIndex((prev) => prev + 1);

			// Visual feedback for error
			Animated.sequence([
				Animated.timing(scaleAnim, {
					toValue: 0.98,
					duration: 50,
					useNativeDriver: true,
				}),
				Animated.timing(scaleAnim, {
					toValue: 1,
					duration: 50,
					useNativeDriver: true,
				}),
			]).start();
		}

		// Auto scroll if needed for longer texts (especially in sentence and paragraph modes)
		if (scrollViewRef.current && currentTestMode !== "words") {
			// Determine if we need to scroll based on character position
			// This is especially important for sentence and paragraph modes
			if (currentCharIndex > 0 && currentCharIndex % 20 === 0) {
				scrollViewRef.current.scrollTo({
					y: currentCharIndex * 1.5,
					animated: true,
				});
			}
		}

		// Check if current item is completed
		if (currentCharIndex + 1 >= testText.length) {
			moveToNextItem();
		}
	};

	// Move to next item
	const moveToNextItem = () => {
		const nextIndex = currentItemIndex + 1;

		if (nextIndex < currentItems.length) {
			// Animate the transition
			Animated.sequence([
				Animated.timing(fadeAnim, {
					toValue: 0.5,
					duration: 150,
					useNativeDriver: true,
				}),
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();

			setCurrentItemIndex(nextIndex);
			setTestText(currentItems[nextIndex] || "");
			setCurrentCharIndex(0);

			// Reset scroll position for new text
			if (scrollViewRef.current) {
				scrollViewRef.current.scrollTo({ y: 0, animated: true });
			}

			// Show feedback
			showFeedback("Great! Next item loaded", "success");
		} else {
			endTest();
		}
	};

	// End test
	const endTest = () => {
		setIsTestActive(false);
		if (timerRef.current) clearInterval(timerRef.current);
		if (afkTimeoutRef.current) clearTimeout(afkTimeoutRef.current);

		// Mark current section as completed
		markSectionAsCompleted(currentTestMode);

		// Show immediate results
		setShowImmediateResultsView(true);

		// Show next section button
		setShowNextButton(true);

		// Check if all sections are completed
		checkAllSectionsCompleted();

		// Show feedback
		showFeedback("Section completed!", "success");

		// Celebration animation
		Animated.sequence([
			Animated.timing(scaleAnim, {
				toValue: 1.1,
				duration: 200,
				useNativeDriver: true,
			}),
			Animated.timing(scaleAnim, {
				toValue: 1,
				duration: 200,
				useNativeDriver: true,
			}),
		]).start();
	};

	// Mark section as completed
	const markSectionAsCompleted = (mode: string) => {
		if (isSectionEmpty(mode)) {
			// For empty sections, mark with default values
			const results = {
				wpm: 0,
				accuracy: 0,
				time: 0,
				characters: "0/0/0",
				consistency: 0,
			};

			setCompletedTests((prev) => ({
				...prev,
				[mode]: results,
			}));

			// Only add to testResults if not already added
			if (!testResults.some((result) => result.mode === mode)) {
				setTestResults((prev) => [...prev, { mode, ...results }]);
			}
		} else if (!completedTests[mode]) {
			// For completed sections with content
			const results = {
				wpm: calculateWpm(),
				accuracy: calculateAccuracy(),
				time: Math.round(startTime ? (Date.now() - startTime) / 1000 : 0),
				characters: `${correctChars}/${
					incorrectChars + correctChars
				}/${incorrectChars}`,
				consistency: calculateConsistency(),
			};

			setCompletedTests((prev) => ({
				...prev,
				[mode]: results,
			}));

			setTestResults((prev) => [...prev, { mode, ...results }]);
		}
	};

	// Check if a section is empty
	const isSectionEmpty = (mode: string) => {
		return !testTexts[mode] || testTexts[mode].length === 0;
	};

	// Check if all sections are completed
	const checkAllSectionsCompleted = () => {
		const allCompleted = sectionOrder.every(
			(mode) => completedTests[mode] !== null || isSectionEmpty(mode)
		);

		const isLastSection =
			currentTestMode === sectionOrder[sectionOrder.length - 1];

		// Show submit button if all sections are completed and we're on the last section
		setShowSubmitButton(allCompleted && isLastSection);

		// Show next button if not on last section and current section is completed
		setShowNextButton(
			!isLastSection && completedTests[currentTestMode] !== null
		);
	};

	// Move to next section
	const moveToNextSection = () => {
		const currentIndex = sectionOrder.indexOf(currentTestMode);
		const nextIndex = currentIndex + 1;

		// Mark current section as completed if not already
		if (!completedTests[currentTestMode]) {
			markSectionAsCompleted(currentTestMode);
		}

		// Check if there are more sections
		if (nextIndex < sectionOrder.length) {
			setShowNextButton(false);
			setShowSubmitButton(false);
			setCurrentTestMode(sectionOrder[nextIndex]);

			// Show feedback
			showFeedback(`Moving to ${sectionOrder[nextIndex]} section`, "info");
		}

		// Check if all sections are completed
		checkAllSectionsCompleted();
	};

	// Submit results with Axios
	const submitResults = async () => {
		try {
			// Group results by mode
			const groupedResults = testResults.reduce((acc, result) => {
				if (!acc[result.mode]) {
					acc[result.mode] = [];
				}
				acc[result.mode].push({
					wpm: result.wpm,
					accuracy: result.accuracy,
					time: result.time,
					characters: result.characters,
					consistency: result.consistency,
				});
				return acc;
			}, {} as any);

			// Calculate overall score
			const availableTests = testResults.length;
			const averageAccuracy =
				availableTests > 0
					? testResults.reduce((sum, result) => sum + result.accuracy, 0) /
					  availableTests
					: 0;

			const formattedData = {
				student_id: STUDENT_ID,
				assignment_id: ASSIGNMENT_ID,
				...groupedResults,
				overall: Math.round(averageAccuracy * 10) / 10,
			};

			// Show completion modal first
			setIsModalVisible(true);

			// Submit data to API using Axios
			const response = await axios.post(
				`${BASE_URL}/assignment/evaluation-save-score`,
				formattedData,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			console.log("Submission response:", response.data);

			// Close modal after 3 seconds
			setTimeout(() => {
				setIsModalVisible(false);
				setShowSubmitButton(false);
				if (navigation && navigation.goBack) {
					navigation.goBack(); // Return to previous screen after submission
				}
			}, 3000);
		} catch (error) {
			console.error("Error submitting results:", error);
			Alert.alert("Error", "Failed to submit your test results");
			setIsModalVisible(false);
		}
	};

	// Handle back button
	const handleBackPress = () => {
		if (navigation && navigation.goBack) {
			navigation.goBack();
		}
	};

	// Toggle theme
	const toggleTheme = () => {
		setTheme((prev) => (prev === "light" ? "dark" : "light"));
	};

	// Render characters with improved visual highlighting
	const renderCharacters = () => {
		if (!testText) return null;

		// Calculate the start of current correct/incorrect counters for this item
		// This ensures proper highlighting when moving between multiple text items
		const charactersTypedInPreviousItems = currentItems
			.slice(0, currentItemIndex)
			.reduce((sum, item) => sum + (item?.length || 0), 0);

		return testText.split("").map((char, index) => {
			let style = [styles.char];
			let isCurrent = index === currentCharIndex;

			if (index < currentCharIndex) {
				// Check if this character was typed correctly
				const isCorrect = index < correctChars - charactersTypedInPreviousItems;
				if (isCorrect) {
					style.push(styles.correctChar);
				} else {
					style.push(styles.incorrectChar);
				}
			} else if (isCurrent) {
				// Current character has a blinking cursor effect
				style.push(styles.currentChar);
			}

			// Special treatment for spaces to make them more visible
			if (char === " ") {
				return (
					<View key={index} style={[style, styles.spaceChar]}>
						{isCurrent && <View style={styles.cursor} />}
					</View>
				);
			}

			return (
				<Text key={index} style={style}>
					{char}
					{isCurrent && <View style={styles.cursor} />}
				</Text>
			);
		});
	};

	// Render empty state
	const renderEmptyState = () => (
		<View style={styles.emptyState}>
			<FontAwesome5
				name="pencil-alt"
				size={48}
				color={theme === "light" ? "#1F3BB3" : "#e2b714"}
			/>
			<Text style={styles.emptyStateMessage}>No content available</Text>
			<Text style={styles.emptyStateDescription}>
				There are no items to type in this section
			</Text>
		</View>
	);

	// Render immediate results with improved stats display
	const renderImmediateResults = () => {
		const results = completedTests[currentTestMode];
		if (!results) return null;

		return (
			<Animated.View
				style={[
					styles.immediateResults,
					{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
				]}
			>
				<View style={styles.resultHeaderRow}>
					<FontAwesome5
						name="trophy"
						size={24}
						color="#FFD700"
						style={styles.trophyIcon}
					/>
					<Text style={styles.completionMessage}>
						{currentTestMode.charAt(0).toUpperCase() + currentTestMode.slice(1)}{" "}
						Test Completed!
					</Text>
				</View>

				<View style={styles.statsGrid}>
					<View style={styles.statCard}>
						<MaterialCommunityIcons
							name="speedometer"
							size={24}
							color="#1F3BB3"
						/>
						<Text style={styles.statValue}>{results.wpm}</Text>
						<Text style={styles.statLabel}>WPM</Text>
					</View>

					<View style={styles.statCard}>
						<MaterialCommunityIcons name="target" size={24} color="#4CAF50" />
						<Text style={styles.statValue}>{results.accuracy}%</Text>
						<Text style={styles.statLabel}>Accuracy</Text>
					</View>

					<View style={styles.statCard}>
						<MaterialCommunityIcons
							name="timer-outline"
							size={24}
							color="#FF9800"
						/>
						<Text style={styles.statValue}>{results.time}s</Text>
						<Text style={styles.statLabel}>Time</Text>
					</View>

					<View style={styles.statCard}>
						<MaterialCommunityIcons
							name="keyboard-outline"
							size={24}
							color="#9C27B0"
						/>
						<Text style={styles.statValue}>
							{results.characters.split("/")[0]}
						</Text>
						<Text style={styles.statLabel}>Characters</Text>
					</View>

					<View style={styles.statCard}>
						<MaterialCommunityIcons
							name="chart-line"
							size={24}
							color="#2196F3"
						/>
						<Text style={styles.statValue}>{results.consistency}%</Text>
						<Text style={styles.statLabel}>Consistency</Text>
					</View>
				</View>
			</Animated.View>
		);
	};

	// Main render
	return (
		<SafeAreaView
			style={[styles.container, theme === "dark" && styles.containerDark]}
		>
			<StatusBar
				barStyle={theme === "light" ? "dark-content" : "light-content"}
			/>
			{/* Header */}
			<View style={[styles.header, theme === "dark" && styles.headerDark]}>
				<TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
					<Ionicons
						name="arrow-back"
						size={24}
						color={theme === "dark" ? "#fff" : "#333"}
					/>
				</TouchableOpacity>

				<View style={styles.headerTitleContainer}>
					<Text
						style={[
							styles.headerTitle,
							theme === "dark" && { color: "#FFFFFF" },
						]}
					>
						Typing Practice
					</Text>
					<Text style={styles.headerSubtitle}>
						Improve your speed and accuracy
					</Text>
				</View>

				<TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
					<Ionicons
						name={theme === "light" ? "moon" : "sunny"}
						size={24}
						color={theme === "dark" ? "#FFF" : "#333"}
					/>
				</TouchableOpacity>
			</View>
			{/* Progress Bar */}
			<View style={styles.progressBarContainer}>
				<View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
			</View>
			{/* WPM Display */}
			{/* // In your main render function, replace the existing WPM Display section */}
			{/* with this: */}
			{/* WPM Display */}
			<View style={styles.wpmDisplay}>
				<Animated.View
					style={[styles.wpmCard, { transform: [{ scale: scaleAnim }] }]}
				>
					<MaterialCommunityIcons
						name="speedometer"
						size={28}
						color={theme === "light" ? "#1F3BB3" : "#e2b714"}
					/>
					<Text
						style={[styles.wpmText, theme === "dark" && styles.wpmTextDark]}
					>
						{currentWpm}
					</Text>
					<Text style={styles.wpmLabel}>WPM</Text>
				</Animated.View>
			</View>
			{/* Mode Selection Tabs */}
			<View style={styles.modeTabsContainer}>
				{sectionOrder.map((mode) => (
					<TouchableOpacity
						key={mode}
						style={[
							styles.modeTab,
							currentTestMode === mode && styles.activeModeTab,
							completedTests[mode] && styles.completedModeTab,
							theme === "dark" && styles.modeTabDark,
							currentTestMode === mode &&
								theme === "dark" &&
								styles.activeModeTabDark,
						]}
						onPress={() => setCurrentTestMode(mode)}
					>
						<View style={styles.modeTabContent}>
							{completedTests[mode] && (
								<FontAwesome5
									name="check-circle"
									size={14}
									color={theme === "light" ? "#4CAF50" : "#81C784"}
									style={styles.completedIcon}
								/>
							)}
							<Text
								style={[
									styles.modeTabText,
									currentTestMode === mode && styles.activeModeTabText,
									theme === "dark" && styles.modeTabTextDark,
								]}
							>
								{mode.charAt(0).toUpperCase() + mode.slice(1)}
							</Text>
						</View>

						{/* Indicator for active tab */}
						{currentTestMode === mode && (
							<View
								style={[
									styles.activeIndicator,
									theme === "dark" && styles.activeIndicatorDark,
								]}
							/>
						)}
					</TouchableOpacity>
				))}
			</View>
			{/* Feedback Toast */}
			{feedback.visible && (
				<Animated.View
					style={[
						styles.feedbackToast,
						feedback.type === "success" && styles.successToast,
						feedback.type === "error" && styles.errorToast,
						{ opacity: fadeAnim },
					]}
				>
					<Text style={styles.feedbackText}>{feedback.message}</Text>
				</Animated.View>
			)}
			{/* Typing Area */}
			<Animated.View
				style={[
					styles.typingAreaContainer,
					{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
					theme === "dark" && styles.typingAreaContainerDark,
				]}
			>
				{!showImmediateResultsView ? (
					<TouchableOpacity
						activeOpacity={0.95}
						style={styles.typingArea}
						onPress={focusTextInput}
					>
						{showEmptyState ? (
							renderEmptyState()
						) : (
							<ScrollView
								ref={scrollViewRef}
								contentContainerStyle={styles.textContainer}
								showsVerticalScrollIndicator={true}
							>
								{/* Item Counter for Multiple Items */}
								{currentItems.length > 1 && (
									<View style={styles.itemCounter}>
										<Text style={styles.itemCounterText}>
											{currentItemIndex + 1} / {currentItems.length}
										</Text>
									</View>
								)}

								<View
									style={[
										styles.wordsContainer,
										theme === "dark" && styles.wordsContainerDark,
										currentTestMode === "sentences" && styles.sentenceContainer,
										currentTestMode === "paragraphs" &&
											styles.paragraphContainer,
									]}
								>
									{renderCharacters()}
								</View>

								{/* Invisible TextInput for keyboard input */}
								<TextInput
									ref={textInputRef}
									style={styles.hiddenTextInput}
									value={textInputValue}
									onChangeText={handleTextInputChange}
									autoCapitalize="none"
									autoCorrect={false}
									spellCheck={false}
									keyboardType="default"
									blurOnSubmit={false}
								/>

								{/* Keyboard activation button removed as requested */}
							</ScrollView>
						)}
					</TouchableOpacity>
				) : (
					renderImmediateResults()
				)}
			</Animated.View>
			{/* Control Buttons */}
			<View style={styles.controlButtonsContainer}>
				{/* Next Section Button */}
				{showNextButton && (
					<TouchableOpacity
						style={[
							styles.nextSectionBtn,
							theme === "dark" && styles.nextSectionBtnDark,
						]}
						onPress={moveToNextSection}
					>
						<Text style={styles.nextSectionBtnText}>Next Section</Text>
						<Ionicons name="arrow-forward" size={20} color="#FFF" />
					</TouchableOpacity>
				)}

				{/* Submit Button */}
				{showSubmitButton && (
					<TouchableOpacity
						style={[styles.submitBtn, theme === "dark" && styles.submitBtnDark]}
						onPress={submitResults}
					>
						<Text style={styles.submitBtnText}>Submit Results</Text>
						<Ionicons name="checkmark-circle" size={20} color="#FFF" />
					</TouchableOpacity>
				)}
			</View>
			{/* Completion Modal */}
			<Modal visible={isModalVisible} transparent={true} animationType="fade">
				<View style={styles.modalOverlay}>
					<Animated.View
						style={[styles.modalContent, { transform: [{ scale: scaleAnim }] }]}
					>
						<View style={styles.completionIconContainer}>
							<FontAwesome5 name="trophy" size={50} color="#FFD700" />
						</View>
						<Text style={styles.completionTitle}>Assignment Completed!</Text>
						<Text style={styles.completionMessage}>
							Great job! Your results have been submitted successfully.
						</Text>

						{/* Show overall stats in modal */}
						<View style={styles.modalStatsContainer}>
							{testResults.map((result, index) => (
								<View key={index} style={styles.modalStatItem}>
									<Text style={styles.modalStatMode}>
										{result.mode.charAt(0).toUpperCase() + result.mode.slice(1)}
										:
									</Text>
									<Text style={styles.modalStatValue}>
										{result.wpm} WPM, {result.accuracy}% accuracy
									</Text>
								</View>
							))}
						</View>
					</Animated.View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		// paddingTop: 30,
		flex: 1,
		backgroundColor: "#F5F7FF",
	},
	containerDark: {
		backgroundColor: "#1A1A2E",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 16,
		paddingHorizontal: 16,
		backgroundColor: "#FFFFFF",
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
	},
	headerDark: {
		backgroundColor: "#16213E",
		borderBottomColor: "#252A45",
	},
	headerTitleContainer: {
		paddingTop: 30,
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#1F3BB3",
	},
	headerSubtitle: {
		fontSize: 12,
		color: "#64748B",
		marginTop: 2,
	},
	backButton: {
		padding: 6,
		borderRadius: 58,
		backgroundColor: "rgba(0,0,0,0.05)",
	},
	themeToggle: {
		padding: 8,
		borderRadius: 8,
		backgroundColor: "rgba(0,0,0,0.05)",
	},
	progressBarContainer: {
		height: 4,
		backgroundColor: "#E2E8F0",
		width: "100%",
		overflow: "hidden",
	},
	progressBar: {
		height: "100%",
		backgroundColor: "#1F3BB3",
	},
	wpmDisplay: {
		alignItems: "center",
		marginVertical: 16,
	},
	wpmCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 12,
		alignItems: "center",
		width: 120,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	wpmText: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#1F3BB3",
		marginVertical: 4,
	},
	wpmTextDark: {
		color: "#e2b714",
	},
	wpmLabel: {
		fontSize: 12,
		color: "#64748B",
		fontWeight: "500",
	},
	modeTabsContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginHorizontal: 16,
		marginBottom: 16,
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
	},
	modeTab: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 12,
		position: "relative",
	},
	modeTabDark: {
		backgroundColor: "#16213E",
	},
	activeModeTab: {
		backgroundColor: "rgba(31, 59, 179, 0.08)",
	},
	activeModeTabDark: {
		backgroundColor: "rgba(226, 183, 20, 0.15)",
	},
	completedModeTab: {
		backgroundColor: "rgba(76, 175, 80, 0.05)",
	},
	modeTabContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	modeTabText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#64748B",
	},
	activeModeTabText: {
		color: "#1F3BB3",
		fontWeight: "700",
	},
	modeTabTextDark: {
		color: "#94A3B8",
	},
	completedIcon: {
		marginRight: 6,
	},
	activeIndicator: {
		position: "absolute",
		bottom: 0,
		height: 3,
		width: "40%",
		backgroundColor: "#1F3BB3",
		borderRadius: 3,
	},
	activeIndicatorDark: {
		backgroundColor: "#e2b714",
	},
	feedbackToast: {
		position: "absolute",
		top: 90,
		alignSelf: "center",
		backgroundColor: "#334155",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 20,
		zIndex: 10,
	},
	successToast: {
		backgroundColor: "#10B981",
	},
	errorToast: {
		backgroundColor: "#EF4444",
	},
	feedbackText: {
		color: "#FFFFFF",
		fontWeight: "600",
	},
	typingAreaContainer: {
		flex: 1,
		marginHorizontal: 16,
		marginBottom: 16,
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	typingAreaContainerDark: {
		backgroundColor: "#16213E",
	},
	typingArea: {
		flex: 1,
		padding: 16,
	},
	textContainer: {
		paddingBottom: 40,
	},
	itemCounter: {
		alignSelf: "center",
		backgroundColor: "rgba(31, 59, 179, 0.1)",
		paddingVertical: 4,
		paddingHorizontal: 12,
		borderRadius: 12,
		marginBottom: 12,
	},
	itemCounterText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#1F3BB3",
	},
	wordsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		padding: 16,
		borderRadius: 12,
		backgroundColor: "#F8FAFC",
		minHeight: 120,
	},
	wordsContainerDark: {
		backgroundColor: "#0F172A",
	},
	sentenceContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		padding: 16,
	},
	paragraphContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		padding: 16,
	},
	char: {
		fontSize: 22,
		fontFamily: "Roboto", // Changed font style from monospace
		color: "#64748B",
		height: 30,
		textAlignVertical: "center",
	},
	correctChar: {
		color: "#10B981",
		fontWeight: "500",
	},
	incorrectChar: {
		color: "#EF4444",
		fontWeight: "500",
	},
	currentChar: {
		backgroundColor: "rgba(31, 59, 179, 0.1)",
		borderRadius: 2,
	},
	spaceChar: {
		width: 12,
		height: 30,
		borderBottomWidth: 2,
		borderBottomColor: "#CBD5E1",
		marginHorizontal: 2,
	},
	cursor: {
		position: "absolute",
		height: "80%",
		width: 2,
		backgroundColor: "#1F3BB3",
		left: "100%",
	},
	hiddenTextInput: {
		position: "absolute",
		opacity: 0,
		height: 0,
	},
	keyboardInstructions: {
		marginTop: 20,
		padding: 16,
		backgroundColor: "rgba(31, 59, 179, 0.05)",
		borderRadius: 12,
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "center",
	},
	keyboardInstructionsDark: {
		backgroundColor: "rgba(226, 183, 20, 0.1)",
	},
	instructionText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1F3BB3",
		marginLeft: 8,
	},
	instructionTextDark: {
		color: "#e2b714",
	},
	instructionTextDark: {
		color: "#e2b714",
	},
	emptyState: {
		alignItems: "center",
		justifyContent: "center",
		padding: 40,
		flex: 1,
	},
	emptyStateMessage: {
		fontSize: 20,
		fontWeight: "700",
		marginTop: 16,
		color: "#1F3BB3",
	},
	emptyStateDescription: {
		fontSize: 16,
		marginTop: 8,
		color: "#64748B",
		textAlign: "center",
	},
	immediateResults: {
		padding: 16,
		flex: 1,
	},
	resultHeaderRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	trophyIcon: {
		marginRight: 8,
	},
	completionMessage: {
		textAlign: "center",
		fontSize: 20,
		fontWeight: "700",
		color: "#1F3BB3",
	},
	statsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	statCard: {
		backgroundColor: "#F8FAFC",
		width: "48%",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	statLabel: {
		fontSize: 12,
		color: "#64748B",
		marginTop: 4,
		fontWeight: "500",
	},
	statValue: {
		fontSize: 24,
		fontWeight: "700",
		color: "#1F3BB3",
		marginTop: 8,
	},
	controlButtonsContainer: {
		paddingHorizontal: 16,
		paddingBottom: 16,
		flexDirection: "row",
		justifyContent: "center",
	},
	nextSectionBtn: {
		backgroundColor: "#1F3BB3",
		paddingVertical: 14,
		paddingHorizontal: 24,
		borderRadius: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		minWidth: 180,
		shadowColor: "#1F3BB3",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 4,
	},
	nextSectionBtnDark: {
		backgroundColor: "#e2b714",
		shadowColor: "#e2b714",
	},
	nextSectionBtnText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "700",
		marginRight: 8,
	},
	submitBtn: {
		backgroundColor: "#10B981",
		paddingVertical: 14,
		paddingHorizontal: 24,
		borderRadius: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		minWidth: 180,
		shadowColor: "#10B981",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 4,
	},
	submitBtnDark: {
		backgroundColor: "#059669",
		shadowColor: "#059669",
	},
	submitBtnText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "700",
		marginRight: 8,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(15, 23, 42, 0.75)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		backgroundColor: "#FFFFFF",
		padding: 24,
		borderRadius: 20,
		width: "85%",
		maxWidth: 400,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.25,
		shadowRadius: 20,
		elevation: 10,
	},
	completionIconContainer: {
		backgroundColor: "rgba(255, 215, 0, 0.15)",
		padding: 16,
		borderRadius: 50,
		marginBottom: 16,
	},
	completionTitle: {
		fontSize: 24,
		fontWeight: "800",
		marginBottom: 12,
		color: "#1F3BB3",
	},
	modalStatsContainer: {
		backgroundColor: "#F8FAFC",
		width: "100%",
		padding: 16,
		borderRadius: 12,
		marginTop: 16,
	},
	modalStatItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	modalStatMode: {
		fontWeight: "600",
		color: "#64748B",
	},
	modalStatValue: {
		fontWeight: "700",
		color: "#1F3BB3",
	},
});

export default TypingAssignment;
