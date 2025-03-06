import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../../App";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	TextInput,
	SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { toast } from "sonner-native";

export default function TypeEnglishPracticeScreen({ navigation }) {
	const [userInput, setUserInput] = useState("");
	const [startTime, setStartTime] = useState(null);
	const [wpm, setWpm] = useState(0);
	const [accuracy, setAccuracy] = useState(100);
	const [isCompleted, setIsCompleted] = useState(false);
	const inputRef = useRef(null);

	const practiceText =
		"The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once. Pangrams are often used to display font samples and test keyboards.";

	useEffect(() => {
		// Auto focus input when screen loads
		inputRef.current?.focus();
	}, []);

	const calculateStats = (input) => {
		const words = input.trim().split(" ").length;
		const characters = input.length;
		const correctChars = [...input].filter(
			(char, i) => char === practiceText[i]
		).length;
		const currentAccuracy = (correctChars / characters) * 100;

		if (startTime) {
			const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
			const currentWpm = Math.round(words / timeElapsed);
			setWpm(currentWpm);
		}

		setAccuracy(Math.round(currentAccuracy));
	};

	const handleInputChange = (text) => {
		if (!startTime) {
			setStartTime(Date.now());
		}

		setUserInput(text);
		calculateStats(text);

		if (text.length === practiceText.length) {
			setIsCompleted(true);
			toast.success("Exercise completed!");
		}
	};

	const handleReset = () => {
		setUserInput("");
		setStartTime(null);
		setWpm(0);
		setAccuracy(100);
		setIsCompleted(false);
		inputRef.current?.focus();
	};

	const { isDarkMode } = useTheme();

	return (
		<SafeAreaView style={[styles.safeArea, isDarkMode && styles.darkContainer]}>
			<LinearGradient colors={["#F6AD55", "#DD6B20"]} style={styles.header}>
				<View style={styles.headerContent}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => navigation.goBack()}
					>
						<MaterialIcons name="arrow-back" size={22} color="white" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Typing Practice</Text>
				</View>

				<View style={styles.statsContainer}>
					<View style={styles.statBox}>
						<MaterialIcons name="speed" size={20} color="#FFD700" />
						<Text style={styles.statNumber}>{wpm}</Text>
						<Text style={styles.statLabel}>WPM</Text>
					</View>
					<View style={styles.statDivider} />
					<View style={styles.statBox}>
						<MaterialIcons name="check-circle" size={20} color="#FFD700" />
						<Text style={styles.statNumber}>{accuracy}%</Text>
						<Text style={styles.statLabel}>Accuracy</Text>
					</View>
				</View>
			</LinearGradient>

			<ScrollView
				style={[styles.container, isDarkMode && styles.darkContainer]}
				contentContainerStyle={styles.scrollContent}
			>
				<View style={styles.content}>
					{/* Practice Text Display */}
					<View
						style={[
							styles.textDisplayContainer,
							isDarkMode && styles.darkCardBg,
						]}
					>
						<Text
							style={[styles.textDisplayTitle, isDarkMode && styles.darkText]}
						>
							Type this text:
						</Text>
						<View style={styles.textDisplay}>
							{practiceText.split("").map((char, index) => (
								<Text
									key={index}
									style={[
										styles.char,
										isDarkMode && styles.darkText,
										index >= userInput.length && styles.charNotTyped,
										index < userInput.length &&
											userInput[index] === char &&
											styles.charCorrect,
										index < userInput.length &&
											userInput[index] !== char &&
											styles.charIncorrect,
									]}
								>
									{char}
								</Text>
							))}
						</View>
					</View>

					{/* Typing Input */}
					<View
						style={[styles.inputContainer, isDarkMode && styles.darkCardBg]}
					>
						<TextInput
							ref={inputRef}
							style={[styles.input, isDarkMode && styles.darkText]}
							multiline
							value={userInput}
							onChangeText={handleInputChange}
							placeholder="Start typing here..."
							placeholderTextColor={isDarkMode ? "#718096" : "#94A3B8"}
							editable={!isCompleted}
						/>
					</View>

					{/* Controls */}
					<View style={styles.controls}>
						<TouchableOpacity
							style={[styles.resetButton, isDarkMode && styles.darkResetButton]}
							onPress={handleReset}
						>
							<MaterialIcons name="refresh" size={22} color="#F6AD55" />
							<Text style={styles.resetButtonText}>Reset</Text>
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
		backgroundColor: "#F8FAFC",
	},
	container: {
		flex: 1,
		backgroundColor: "#F8FAFC",
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
		marginBottom: 12,
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
	statsContainer: {
		flexDirection: "row",
		backgroundColor: "rgba(255,255,255,0.15)",
		borderRadius: 12,
		padding: 12,
		justifyContent: "space-around",
		marginBottom: 5,
	},
	statBox: {
		alignItems: "center",
	},
	statDivider: {
		width: 1,
		backgroundColor: "rgba(255,255,255,0.2)",
		marginHorizontal: 15,
	},
	statNumber: {
		color: "white",
		fontSize: 22,
		fontWeight: "bold",
		marginTop: 3,
	},
	statLabel: {
		color: "rgba(255,255,255,0.8)",
		fontSize: 13,
	},
	content: {
		padding: 20,
	},
	textDisplayContainer: {
		backgroundColor: "white",
		borderRadius: 15,
		padding: 18,
		marginBottom: 18,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	textDisplayTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#2D3748",
		marginBottom: 15,
	},
	textDisplay: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	char: {
		fontSize: 18,
		fontFamily: "monospace",
		marginRight: 1,
	},
	charNotTyped: {
		color: "#94A3B8",
	},
	charCorrect: {
		color: "#48BB78",
	},
	charIncorrect: {
		color: "#EF4444",
		backgroundColor: "#FEE2E2",
	},
	inputContainer: {
		backgroundColor: "white",
		borderRadius: 15,
		padding: 18,
		marginBottom: 18,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	input: {
		fontSize: 18,
		color: "#2D3748",
		minHeight: 100,
		textAlignVertical: "top",
	},
	controls: {
		alignItems: "center",
	},
	resetButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFF5EB",
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#F6AD55",
		shadowColor: "#DD6B20",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	resetButtonText: {
		marginLeft: 8,
		fontSize: 16,
		color: "#F6AD55",
		fontWeight: "600",
	},
	darkContainer: {
		backgroundColor: "#1A202C",
	},
	darkCardBg: {
		backgroundColor: "#2D3748",
	},
	darkText: {
		color: "#E2E8F0",
	},
	darkResetButton: {
		backgroundColor: "#4A5568",
		borderColor: "#F6AD55",
	},
});
