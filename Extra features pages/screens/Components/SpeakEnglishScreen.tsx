import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../App";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	StatusBar,
	Animated,
	Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { toast } from "sonner-native";
import * as Speech from "expo-speech";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
	Home: undefined;
	SpeakEnglish: undefined;
};

type SpeakEnglishScreenNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"SpeakEnglish"
>;

interface SpeakEnglishScreenProps {
	navigation: SpeakEnglishScreenNavigationProp;
}

const SpeakEnglishScreen: React.FC<SpeakEnglishScreenProps> = ({
	navigation,
}) => {
	const { isDarkMode } = useTheme();
	const [isRecording, setIsRecording] = useState(false);
	const [recordedText, setRecordedText] = useState("");
	const [accuracy, setAccuracy] = useState(0);
	const [currentPhrase, setCurrentPhrase] = useState(
		"Hello, how are you today?"
	);
	const scrollY = useRef(new Animated.Value(0)).current;

	// Animation constants for header - INCREASED HEADER HEIGHTS to match ListenEnglishScreen
	const HEADER_MAX_HEIGHT = 160;
	const HEADER_MIN_HEIGHT = 70;
	const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

	const themeStyles = {
		light: {
			headcolor: "#48BB78",
			bgColor: "#F5F7FA",
			textColor: "#2c2e31",
			subColor: "#48BB78",
			cardBg: "#ffffff",
			borderColor: "#e0e0e0",
			headerGradient: ["#48BB78", "#48BB78"],
			stickyHeaderBg: "rgba(249,250,251,0.97)",
			stickyHeaderTitle: "#48BB78",
		},
		dark: {
			headcolor: "#1a1a1a",
			bgColor: "#232323",
			textColor: "#ffffff",
			subColor: "#48BB78",
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

	// Calculate sticky header opacity - IMPROVED TRANSITION
	const stickyHeaderOpacity = scrollY.interpolate({
		inputRange: [HEADER_SCROLL_DISTANCE - 40, HEADER_SCROLL_DISTANCE],
		outputRange: [0, 1],
		extrapolate: "clamp",
	});

	useEffect(() => {
		// Set status bar color to match header
		StatusBar.setBarStyle("light-content");
		if (Platform.OS === "android") {
			StatusBar.setBackgroundColor("transparent");
			StatusBar.setTranslucent(true);
		}
	}, []);

	const calculateAccuracy = (spoken: string, target: string) => {
		const spokenWords = spoken.toLowerCase().split(" ");
		const targetWords = target.toLowerCase().split(" ");

		let matchedWords = 0;
		targetWords.forEach((targetWord) => {
			if (spokenWords.includes(targetWord)) {
				matchedWords++;
			}
		});

		return Math.round((matchedWords / targetWords.length) * 100);
	};

	const startRecording = async () => {
		try {
			setIsRecording(true);
			toast('Recording started... Please speak: "' + currentPhrase + '"');

			// Simulated recording for demo
			setTimeout(() => {
				const simulatedSpokenText = "Hello, how are you doing today";
				setRecordedText(simulatedSpokenText);

				const accuracyScore = calculateAccuracy(
					simulatedSpokenText,
					currentPhrase
				);
				setAccuracy(accuracyScore);

				setIsRecording(false);
				toast(`Recording completed! Accuracy: ${accuracyScore}%`);
			}, 3000);
		} catch (error) {
			console.error(error);
			toast("Error starting recording");
			setIsRecording(false);
		}
	};

	const handleReset = () => {
		setRecordedText("");
		setAccuracy(0);
		const phrases = [
			"Hello, how are you today?",
			"The weather is beautiful.",
			"I love learning English.",
			"What time is the meeting?",
			"Could you please repeat that?",
		];
		setCurrentPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
		toast("Recording reset! New phrase ready.");
	};

	return (
		<SafeAreaView
			style={[styles.safeArea, { backgroundColor: currentTheme.bgColor }]}
			edges={["left", "right"]}
		>
			<StatusBar
				backgroundColor="transparent"
				barStyle="light-content"
				translucent
			/>

			{/* Sticky Header - Updated to match ListenEnglishScreen */}
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
						SpeakEng
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
				{/* Main header with gradient background - Updated to match ListenEnglishScreen */}
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
								<Text style={styles.headerTitle}>SpeakEng</Text>
								<Text style={styles.headerSubtitle}>
									Perfect your pronunciation and fluency
								</Text>
							</View>

							<View style={styles.accuracyBadge}>
								<Text style={styles.accuracyText}>{accuracy}%</Text>
							</View>
						</View>
					</LinearGradient>
				</Animated.View>

				{/* Main Content */}
				<View style={styles.mainContent}>
					<View
						style={[
							styles.phraseContainer,
							{
								backgroundColor: currentTheme.cardBg,
								borderColor: currentTheme.borderColor,
							},
						]}
					>
						<Text
							style={[styles.phraseTitle, { color: currentTheme.textColor }]}
						>
							Please say:
						</Text>
						<Text style={[styles.phraseText, { color: currentTheme.subColor }]}>
							{currentPhrase}
						</Text>
					</View>

					<View
						style={[
							styles.transcriptContainer,
							{
								backgroundColor: currentTheme.cardBg,
								borderColor: currentTheme.borderColor,
							},
						]}
					>
						<Text
							style={[
								styles.transcriptTitle,
								{ color: currentTheme.textColor },
							]}
						>
							Your Speech:
						</Text>
						<Text
							style={[styles.transcriptText, { color: currentTheme.textColor }]}
						>
							{recordedText || "Your recorded text will appear here..."}
						</Text>
					</View>

					{isRecording && (
						<View
							style={[
								styles.recordingStatus,
								{
									backgroundColor: isDarkMode ? "#442c2c" : "#FEE2E2",
								},
							]}
						>
							<MaterialIcons name="mic" size={24} color="#EF4444" />
							<Text
								style={[
									styles.recordingStatusText,
									{
										color: isDarkMode ? "#ff6b6b" : "#EF4444",
									},
								]}
							>
								Recording in progress...
							</Text>
						</View>
					)}

					{recordedText && (
						<TouchableOpacity
							style={[
								styles.resetButton,
								{
									backgroundColor: isDarkMode ? "#2c2c2c" : "#EDF2F7",
								},
							]}
							onPress={handleReset}
						>
							<MaterialIcons
								name="refresh"
								size={24}
								color={currentTheme.textColor}
							/>
							<Text
								style={[
									styles.resetButtonText,
									{ color: currentTheme.textColor },
								]}
							>
								Reset
							</Text>
						</TouchableOpacity>
					)}

					{/* Add padding at the bottom to ensure content is visible above the sticky button */}
					<View style={styles.bottomPadding} />
				</View>
			</Animated.ScrollView>

			{/* Sticky Recording Button */}
			<View
				style={[
					styles.stickyButtonContainer,
					{ backgroundColor: currentTheme.bgColor },
				]}
			>
				<TouchableOpacity
					style={[
						styles.recordButton,
						{
							backgroundColor: isDarkMode ? "#2c3b2c" : "#F0FDF4",
							borderColor: currentTheme.subColor,
						},
						isRecording && {
							backgroundColor: isDarkMode ? "#3b2c2c" : "#FEF2F2",
							borderColor: "#EF4444",
						},
					]}
					onPress={isRecording ? () => {} : startRecording}
					disabled={isRecording}
				>
					<MaterialIcons
						name={isRecording ? "stop" : "mic"}
						size={28}
						color={isRecording ? "#EF4444" : currentTheme.subColor}
					/>
					<Text
						style={[
							styles.recordButtonText,
							{ color: isRecording ? "#EF4444" : currentTheme.subColor },
						]}
					>
						{isRecording ? "Recording..." : "Start Recording"}
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
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
		backgroundColor: "#48BB78",
		justifyContent: "center",
		alignItems: "center",
	},
	stickyHeaderTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#48BB78",
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
	accuracyBadge: {
		backgroundColor: "rgba(255,255,255,0.15)",
		borderRadius: 15,
		padding: 10,
		width: 75,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.3)",
	},
	accuracyText: {
		color: "#FFD700",
		fontSize: 16,
		fontWeight: "bold",
	},
	mainContent: {
		padding: 16,
	},
	phraseContainer: {
		backgroundColor: "#EDF2F7",
		borderRadius: 15,
		padding: 16,
		width: "100%",
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	phraseTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#2D3748",
		marginBottom: 8,
	},
	phraseText: {
		fontSize: 18,
		color: "#48BB78",
		fontWeight: "600",
		lineHeight: 24,
	},
	transcriptContainer: {
		backgroundColor: "white",
		borderRadius: 15,
		padding: 16,
		width: "100%",
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		minHeight: 120,
	},
	transcriptTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#2D3748",
		marginBottom: 8,
	},
	transcriptText: {
		fontSize: 16,
		color: "#4A5568",
		lineHeight: 24,
	},
	recordingStatus: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FEE2E2",
		padding: 10,
		borderRadius: 10,
		marginBottom: 16,
	},
	recordingStatusText: {
		marginLeft: 8,
		color: "#EF4444",
		fontWeight: "600",
	},
	resetButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#EDF2F7",
		padding: 12,
		borderRadius: 12,
		alignSelf: "center",
	},
	resetButtonText: {
		marginLeft: 8,
		fontSize: 16,
		color: "#4A5568",
		fontWeight: "500",
	},
	stickyButtonContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		padding: 16,
		paddingBottom: 24, // Extra padding at the bottom for better spacing
		borderTopWidth: 1,
		borderTopColor: "rgba(0,0,0,0.05)",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -3 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 10,
	},
	recordButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#F0FDF4",
		padding: 16,
		borderRadius: 15,
		borderWidth: 2,
		borderColor: "#48BB78",
	},
	recordButtonText: {
		marginLeft: 10,
		fontSize: 16,
		fontWeight: "600",
		color: "#48BB78",
	},
	bottomPadding: {
		height: 80, // Ensure content is visible above the sticky button
	},
});

export default SpeakEnglishScreen;
