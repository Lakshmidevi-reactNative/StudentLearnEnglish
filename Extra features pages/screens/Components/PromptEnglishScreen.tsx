import React, { useState, useEffect, useContext, useRef } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Animated,
	Dimensions,
	StatusBar,
	Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemeContext } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

type RootStackParamList = {
	Home: undefined;
	PromptEnglish: undefined;
};

type PromptEnglishScreenNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"PromptEnglish"
>;

interface PromptEnglishScreenProps {
	navigation: PromptEnglishScreenNavigationProp;
}

type Mode = "practice" | "test";

const PromptEnglishScreen: React.FC<PromptEnglishScreenProps> = ({
	navigation,
}) => {
	const { isDarkMode } = useContext(ThemeContext);
	const [mode, setMode] = useState<Mode>("practice");
	const [inputText, setInputText] = useState("");
	const [scores, setScores] = useState({ relevance: 0, accuracy: 0 });
	const [currentPrompt, setCurrentPrompt] = useState({
		category: "Current Scenario",
		scenario:
			"Create a prompt that will generate a detailed description of a futuristic city...",
		promptText: "HELOO WORLDS",
	});
	const [currentCharIndex, setCurrentCharIndex] = useState(0);
	const [typingStats, setTypingStats] = useState({
		wpm: 0,
		accuracy: 100,
		correctChars: 0,
		incorrectChars: 0,
	});
	const caretAnim = useState(new Animated.Value(1))[0];
	const scrollY = useRef(new Animated.Value(0)).current;

	// Animation constants for header
	const HEADER_MAX_HEIGHT = 160;
	const HEADER_MIN_HEIGHT = 70;
	const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

	const themeStyles = {
		light: {
			headcolor: "#F56565",
			bgColor: "#ffffff",
			textColor: "#2c2e31",
			subColor: "#F56565",
			cardBg: "#f8f9fa",
			borderColor: "#e0e0e0",
			headerGradient: ["#F56565", "#F56565"],
			stickyHeaderBg: "rgba(249,250,251,0.97)",
			stickyHeaderTitle: "#F56565",
		},
		dark: {
			headcolor: "#1a1a1a",
			bgColor: "#232323",
			textColor: "#ffffff",
			subColor: "#e2b714",
			cardBg: "#2c2c2c",
			borderColor: "#404040",
			headerGradient: ["#1a1a1a", "#1a1a1a"],
			stickyHeaderBg: "rgba(35,35,35,0.95)",
			stickyHeaderTitle: "#FFFFFF",
		},
	};

	const currentTheme = themeStyles[isDarkMode ? "dark" : "light"];

	// Animation values
	const headerOpacity = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE],
		outputRange: [1, 0],
		extrapolate: "clamp",
	});

	// Calculate sticky header opacity
	const stickyHeaderOpacity = scrollY.interpolate({
		inputRange: [HEADER_SCROLL_DISTANCE - 40, HEADER_SCROLL_DISTANCE],
		outputRange: [0, 1],
		extrapolate: "clamp",
	});

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(caretAnim, {
					toValue: 0,
					duration: 800,
					useNativeDriver: true,
				}),
				Animated.timing(caretAnim, {
					toValue: 1,
					duration: 800,
					useNativeDriver: true,
				}),
			])
		).start();

		// Set status bar color to match header
		StatusBar.setBarStyle("light-content");
		if (Platform.OS === "android") {
			StatusBar.setBackgroundColor("transparent");
			StatusBar.setTranslucent(true);
		}
	}, []);

	const handlePracticeInput = (text: string) => {
		const expectedChar = currentPrompt.promptText[currentCharIndex];
		const newChar = text[text.length - 1];

		if (newChar === expectedChar) {
			setTypingStats((prev) => ({
				...prev,
				correctChars: prev.correctChars + 1,
			}));
		} else {
			setTypingStats((prev) => ({
				...prev,
				incorrectChars: prev.incorrectChars + 1,
			}));
		}

		setCurrentCharIndex((prev) => prev + 1);
		setInputText(text);
	};

	const submitTest = async () => {
		const mockResponse = {
			relevance_score: Math.floor(Math.random() * 40) + 60,
			accuracy_score: Math.floor(Math.random() * 40) + 60,
		};
		setScores({
			relevance: mockResponse.relevance_score,
			accuracy: mockResponse.accuracy_score,
		});
	};

	const refreshPage = () => {
		// Reset the practice mode state
		setCurrentCharIndex(0);
		setInputText("");
		setTypingStats({
			wpm: 0,
			accuracy: 100,
			correctChars: 0,
			incorrectChars: 0,
		});

		// Reset the test mode state
		setScores({ relevance: 0, accuracy: 0 });
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

			{/* Sticky Header */}
			<Animated.View
				style={[
					styles.stickyHeader,
					{
						backgroundColor: currentTheme.stickyHeaderBg,
						opacity: stickyHeaderOpacity,
						borderBottomColor: isDarkMode
							? "rgba(255,255,255,0.1)"
							: "rgba(0,0,0,0.1)",
					},
				]}
			>
				<View style={styles.stickyHeaderContent}>
					<TouchableOpacity
						style={styles.stickyBackButton}
						onPress={() => navigation.goBack()}
					>
						<MaterialIcons name="arrow-back" size={24} color="white" />
					</TouchableOpacity>
					<Text
						style={[
							styles.stickyHeaderTitle,
							{ color: currentTheme.stickyHeaderTitle },
						]}
					>
						PromptEng
					</Text>
				</View>
			</Animated.View>

			<Animated.ScrollView
				style={styles.scrollView}
				scrollEventThrottle={16}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: true }
				)}
				contentContainerStyle={styles.scrollViewContent}
			>
				{/* Main header with gradient background */}
				<Animated.View style={{ opacity: headerOpacity }}>
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
							<View style={styles.headerTextContainer}>
								<Text style={styles.headerTitle}>PromptEng</Text>
								<Text style={styles.headerSubtitle}>
									Improve your typing skills
								</Text>
							</View>
						</View>
					</LinearGradient>
				</Animated.View>

				<View
					style={[styles.sidebar, { backgroundColor: currentTheme.cardBg }]}
				>
					<Text
						style={[styles.sidebarTitle, { color: currentTheme.textColor }]}
					>
						Quick Tips
					</Text>
					<View style={styles.tipItem}>
						<Text style={{ color: currentTheme.textColor }}>
							• Be specific with requirements
						</Text>
						<Text style={{ color: currentTheme.textColor }}>
							• Include relevant context
						</Text>
						<Text style={{ color: currentTheme.textColor }}>
							• Define desired outcomes
						</Text>
					</View>
				</View>

				<View style={styles.toggleContainer}>
					<TouchableOpacity
						style={[
							styles.toggleButton,
							mode === "practice" && { backgroundColor: currentTheme.subColor },
						]}
						onPress={() => setMode("practice")}
					>
						<Text
							style={[
								styles.toggleText,
								mode === "practice" && { color: currentTheme.bgColor },
							]}
						>
							Practice Mode
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.toggleButton,
							mode === "test" && { backgroundColor: currentTheme.subColor },
						]}
						onPress={() => setMode("test")}
					>
						<Text
							style={[
								styles.toggleText,
								mode === "test" && { color: currentTheme.bgColor },
							]}
						>
							Test Mode
						</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.mainContainer}>
					<View style={styles.contentContainer}>
						<View
							style={[
								styles.scenarioBox,
								{
									backgroundColor: currentTheme.cardBg,
									borderColor: currentTheme.borderColor,
								},
							]}
						>
							<View style={styles.scenarioHeader}>
								<Text
									style={[styles.category, { color: currentTheme.textColor }]}
								>
									{currentPrompt.category}
								</Text>
								<TouchableOpacity
									style={styles.refreshButton}
									onPress={refreshPage}
								>
									<MaterialIcons
										name="refresh"
										size={20}
										color={currentTheme.subColor}
									/>
								</TouchableOpacity>
							</View>
							<Text
								style={[styles.scenarioText, { color: currentTheme.textColor }]}
							>
								{currentPrompt.scenario}
							</Text>
						</View>

						{mode === "practice" ? (
							<View style={styles.typingContainer}>
								<View
									style={[
										styles.typingArea,
										{ borderColor: currentTheme.borderColor },
									]}
								>
									{currentPrompt.promptText.split("").map((char, index) => (
										<Text
											key={index}
											style={[
												styles.char,
												{
													color:
														index < currentCharIndex
															? char === inputText[index]
																? "#16a34a"
																: "#dc2626"
															: currentTheme.textColor,
												},
											]}
										>
											{char}
										</Text>
									))}
									<Animated.View
										style={[
											styles.caret,
											{
												opacity: caretAnim,
												backgroundColor: currentTheme.subColor,
											},
										]}
									/>
								</View>
								<TextInput
									style={styles.hiddenInput}
									value={inputText}
									onChangeText={handlePracticeInput}
									autoFocus
								/>

								<TouchableOpacity
									style={[
										styles.submitButton,
										{ backgroundColor: currentTheme.subColor },
									]}
									onPress={() => {
										// Calculate final stats
										const totalChars = currentPrompt.promptText.length;
										const correctPercent = Math.round(
											(typingStats.correctChars / totalChars) * 100
										);

										// Update typing stats with final values
										setTypingStats((prev) => ({
											...prev,
											accuracy: correctPercent,
										}));

										// Show completion message or perform other actions
										alert(`Practice completed!\nAccuracy: ${correctPercent}%`);
									}}
								>
									<Text
										style={[styles.submitText, { color: currentTheme.bgColor }]}
									>
										Submit Practice
									</Text>
								</TouchableOpacity>
							</View>
						) : (
							<View>
								<TextInput
									style={[
										styles.testInput,
										{
											backgroundColor: currentTheme.cardBg,
											borderColor: currentTheme.borderColor,
											color: currentTheme.textColor,
										},
									]}
									multiline
									placeholder="Enter your response here..."
									placeholderTextColor={currentTheme.textColor}
									value={inputText}
									onChangeText={setInputText}
								/>
								<TouchableOpacity
									style={[
										styles.submitButton,
										{ backgroundColor: currentTheme.subColor },
									]}
									onPress={submitTest}
								>
									<Text
										style={[styles.submitText, { color: currentTheme.bgColor }]}
									>
										Submit Prompt
									</Text>
								</TouchableOpacity>

								<View style={styles.scoreContainer}>
									<View
										style={[
											styles.scoreCard,
											{ backgroundColor: currentTheme.cardBg },
										]}
									>
										<Text
											style={[
												styles.scoreTitle,
												{ color: currentTheme.textColor },
											]}
										>
											Relevance Score
										</Text>
										<Text
											style={[
												styles.scoreValue,
												{ color: currentTheme.subColor },
											]}
										>
											{scores.relevance}%
										</Text>
									</View>
								</View>
							</View>
						)}
					</View>
				</View>
				{/* Bottom spacing */}
				<View style={styles.bottomSpacing} />
			</Animated.ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F7FA",
	},
	scrollView: {
		flex: 1,
	},
	scrollViewContent: {
		paddingTop: 0, // Ensure content starts at the top
	},
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
		gap: 20,
		alignContent: "center",
		alignItems: "center",
		paddingHorizontal: 16,
		height: "100%",
	},
	stickyBackButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#F56565",
		justifyContent: "center",
		alignItems: "center",
	},
	stickyHeaderTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#F56565",
		flex: 1,
	},
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
		marginBottom: 12,
	},
	headerTextContainer: {
		flexDirection: "column",
		flex: 1,
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
		marginLeft: 20,
	},
	headerSubtitle: {
		fontSize: 15,
		color: "rgba(255,255,255,0.8)",
		marginTop: 5,
		marginLeft: 20,
	},
	statsContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255,255,255,0.15)",
		borderRadius: 15,
		padding: 10,
		width: 75,
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.3)",
	},
	statNumber: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
		marginLeft: 5,
	},
	sidebar: {
		marginHorizontal: 20,
		padding: 25,
		borderRadius: 8,
		marginTop: 20,
	},
	sidebarTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 15,
	},
	tipItem: {
		gap: 8,
	},
	toggleContainer: {
		flexDirection: "row",
		justifyContent: "center",
		paddingVertical: 20,
		gap: 10,
	},
	toggleButton: {
		paddingVertical: 8,
		paddingHorizontal: 20,
		borderRadius: 4,
		borderWidth: 2,
		borderColor: "#e0e0e0",
	},
	toggleText: {
		fontSize: 16,
		fontWeight: "500",
	},
	mainContainer: {
		padding: 20,
	},
	contentContainer: {
		width: "100%",
	},
	scenarioBox: {
		padding: 15,
		borderRadius: 6,
		borderWidth: 1,
		marginBottom: 15,
	},
	scenarioHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	refreshButton: {
		padding: 5,
		borderRadius: 15,
		width: 30,
		height: 30,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.05)",
	},
	category: {
		fontSize: 18,
		fontWeight: "bold",
	},
	scenarioText: {
		fontSize: 16,
	},
	typingContainer: {
		marginVertical: 20,
		position: "relative",
	},
	typingArea: {
		minHeight: 150,
		borderWidth: 1,
		borderRadius: 6,
		padding: 10,
		flexDirection: "row",
		flexWrap: "wrap",
	},
	hiddenInput: {
		position: "absolute",
		opacity: 0,
		height: 0,
	},
	char: {
		fontSize: 16,
		margin: 2,
	},
	caret: {
		width: 2,
		height: 20,
		marginLeft: 4,
	},
	testInput: {
		minHeight: 150,
		borderWidth: 1,
		borderRadius: 6,
		padding: 15,
		fontSize: 16,
		textAlignVertical: "top",
		marginVertical: 10,
	},
	submitButton: {
		padding: 12,
		borderRadius: 4,
		alignItems: "center",
		marginVertical: 20,
	},
	submitText: {
		fontSize: 16,
		fontWeight: "500",
	},
	scoreContainer: {
		flexDirection: "row",
		gap: 10,
		marginBottom: 20,
	},
	scoreCard: {
		flex: 1,
		padding: 15,
		borderRadius: 6,
		alignItems: "center",
	},
	scoreTitle: {
		fontSize: 16,
		marginBottom: 10,
	},
	scoreValue: {
		fontSize: 24,
		fontWeight: "bold",
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "500",
	},
	bottomSpacing: {
		height: 40,
	},
});

export default PromptEnglishScreen;
