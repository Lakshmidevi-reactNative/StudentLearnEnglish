// TypingAssignment.tsx
import React, { useState, useEffect, useRef } from "react";
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	TextInput,
	ScrollView,
	Modal,
	Alert,
	Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../App";
import { toast } from "sonner-native";

const { width } = Dimensions.get("window");

const TEST_DURATION = 30;
const MAX_CHART_POINTS = 30;

const TypingAssignment = ({ route, navigation }) => {
	const { isDarkMode } = useTheme();
	const { assignmentData } = route.params || {};

	// State management
	const [currentMode, setCurrentMode] = useState("words");
	const [isTestActive, setIsTestActive] = useState(false);
	const [currentText, setCurrentText] = useState("");
	const [typedText, setTypedText] = useState("");
	const [currentCharIndex, setCurrentCharIndex] = useState(0);
	const [correctChars, setCorrectChars] = useState(0);
	const [incorrectChars, setIncorrectChars] = useState(0);
	const [startTime, setStartTime] = useState(null);
	const [wpm, setWpm] = useState(0);
	const [showResults, setShowResults] = useState(false);
	const [testCompleted, setTestCompleted] = useState(false);
	const [wpmHistory, setWpmHistory] = useState(
		new Array(MAX_CHART_POINTS).fill(0)
	);

	const inputRef = useRef(null);
	const wpmInterval = useRef(null);

	useEffect(() => {
		if (assignmentData) {
			fetchTestContent();
		}
		return () => {
			if (wpmInterval.current) clearInterval(wpmInterval.current);
		};
	}, [assignmentData]);

	const fetchTestContent = async () => {
		try {
			const response = await fetch(
				"http://192.168.29.37:8080/learnengspring/assignment/get-all-question/12126"
			);
			const data = await response.json();
			if (data?.data?.[0]?.["201"]) {
				const words = data.data[0]["201"].map((item) => item.question_text);
				setCurrentText(words.join(" ") || "Sample typing test content");
			}
		} catch (error) {
			Alert.alert("Error", "Failed to load test content");
			setCurrentText("Sample typing test content");
		}
	};

	const startTest = () => {
		if (!isTestActive && currentText) {
			setIsTestActive(true);
			setStartTime(Date.now());
			startWpmUpdates();
		}
	};

	const startWpmUpdates = () => {
		if (wpmInterval.current) clearInterval(wpmInterval.current);
		wpmInterval.current = setInterval(() => {
			if (startTime) {
				const currentWpm = calculateWpm();
				setWpm(currentWpm);
				updateWpmHistory(currentWpm);
			}
		}, 1000);
	};

	const updateWpmHistory = (currentWpm) => {
		setWpmHistory((prev) => {
			const newHistory = [...prev.slice(1), currentWpm];
			return newHistory;
		});
	};

	const calculateWpm = () => {
		if (!startTime) return 0;
		const timeElapsed = Math.max(1, (Date.now() - startTime) / 1000 / 60);
		return Math.round(correctChars / 5 / timeElapsed);
	};

	const calculateAccuracy = () => {
		const total = correctChars + incorrectChars;
		return total > 0 ? Math.round((correctChars / total) * 100) : 0;
	};

	const handleTextInput = (text) => {
		if (!isTestActive) {
			startTest();
		}

		if (testCompleted) return;

		const lastChar = text.slice(-1);
		const expectedChar = currentText[currentCharIndex];

		if (lastChar === expectedChar) {
			setCorrectChars((prev) => prev + 1);
		} else {
			setIncorrectChars((prev) => prev + 1);
		}

		setCurrentCharIndex((prev) => prev + 1);
		setTypedText(text);

		if (currentCharIndex + 1 >= currentText.length) {
			endTest();
		}
	};

	const endTest = () => {
		clearInterval(wpmInterval.current);
		setIsTestActive(false);
		setTestCompleted(true);
		setShowResults(true);
	};

	const submitResults = async () => {
		try {
			const results = {
				assignment_id: assignmentData?.id || "12126",
				student_id: "3065",
				mode: currentMode,
				words: [
					{
						wpm: calculateWpm(),
						accuracy: calculateAccuracy(),
						time: Math.round((Date.now() - startTime) / 1000),
						characters: `${correctChars}/${
							incorrectChars + correctChars
						}/${incorrectChars}`,
						consistency: calculateConsistency(),
					},
				],
			};

			const response = await fetch(
				"http://192.168.29.37:8080/learnengspring/assignment/evaluation-save-score",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(results),
				}
			);

			if (response.ok) {
				toast.success("Assignment completed successfully!");
				navigation.goBack();
			} else {
				throw new Error("Failed to submit results");
			}
		} catch (error) {
			toast.error("Failed to submit results");
		}
	};

	const calculateConsistency = () => {
		const validWpms = wpmHistory.filter((wpm) => wpm > 0);
		if (validWpms.length < 2) return 100;

		const avg = validWpms.reduce((a, b) => a + b) / validWpms.length;
		const variance =
			validWpms.reduce((a, b) => a + Math.pow(b - avg, 2), 0) /
			validWpms.length;
		const consistency = 100 - Math.min(100, Math.sqrt(variance));
		return Math.round(consistency);
	};

	const restartTest = () => {
		setIsTestActive(false);
		setTypedText("");
		setCurrentCharIndex(0);
		setCorrectChars(0);
		setIncorrectChars(0);
		setWpm(0);
		setStartTime(null);
		setShowResults(false);
		setTestCompleted(false);
		setWpmHistory(new Array(MAX_CHART_POINTS).fill(0));
	};

	return (
		<ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
			<LinearGradient colors={["#012269", "#224ba3"]} style={styles.header}>
				<View style={styles.headerContent}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.backButton}
					>
						<MaterialIcons name="arrow-back" size={24} color="white" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>
						{assignmentData?.title || "Typing Assignment"}
					</Text>
				</View>
			</LinearGradient>

			<View style={styles.content}>
				<View style={styles.statsContainer}>
					<Text style={styles.wpmText}>WPM: {wpm}</Text>
					<Text style={styles.accuracyText}>
						Accuracy: {calculateAccuracy()}%
					</Text>
				</View>

				<View style={styles.typingArea}>
					<Text style={styles.instructionText}>Type the text below:</Text>
					<Text style={styles.sourceText}>{currentText}</Text>
					<TextInput
						ref={inputRef}
						style={styles.input}
						value={typedText}
						onChangeText={handleTextInput}
						autoCorrect={false}
						autoCapitalize="none"
						multiline
						onFocus={startTest}
						editable={!testCompleted}
						placeholder="Start typing here..."
					/>
				</View>

				{testCompleted && (
					<TouchableOpacity style={styles.submitButton} onPress={submitResults}>
						<Text style={styles.submitButtonText}>Submit Results</Text>
					</TouchableOpacity>
				)}
			</View>

			<Modal visible={showResults} animationType="slide" transparent={true}>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Test Results</Text>
						<Text style={styles.resultText}>WPM: {wpm}</Text>
						<Text style={styles.resultText}>
							Accuracy: {calculateAccuracy()}%
						</Text>
						<Text style={styles.resultText}>
							Consistency: {calculateConsistency()}%
						</Text>
						<Text style={styles.resultText}>
							Characters: {correctChars}/{incorrectChars + correctChars}/
							{incorrectChars}
						</Text>
						<View style={styles.modalButtonsContainer}>
							<TouchableOpacity
								style={styles.modalButton}
								onPress={() => setShowResults(false)}
							>
								<Text style={styles.modalButtonText}>Close</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.modalButton, styles.restartButton]}
								onPress={restartTest}
							>
								<Text style={styles.modalButtonText}>Restart</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F7FA",
	},
	darkContainer: {
		backgroundColor: "#1a1a1a",
	},
	header: {
		padding: 20,
		paddingTop: 60,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	backButton: {
		marginRight: 15,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
	content: {
		padding: 20,
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		padding: 15,
		backgroundColor: "white",
		borderRadius: 10,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	wpmText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2563EB",
	},
	accuracyText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2563EB",
	},
	typingArea: {
		backgroundColor: "white",
		borderRadius: 10,
		padding: 15,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	instructionText: {
		fontSize: 16,
		color: "#4A5568",
		marginBottom: 10,
	},
	sourceText: {
		fontSize: 18,
		color: "#4A5568",
		marginBottom: 15,
		lineHeight: 24,
	},
	input: {
		fontSize: 18,
		color: "#2c2e31",
		borderWidth: 1,
		borderColor: "#E2E8F0",
		borderRadius: 8,
		padding: 10,
		minHeight: 100,
		textAlignVertical: "top",
	},
	submitButton: {
		backgroundColor: "#2563EB",
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 20,
	},
	submitButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		backgroundColor: "white",
		padding: 20,
		borderRadius: 12,
		width: width * 0.8,
		alignItems: "center",
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#2563EB",
	},
	resultText: {
		fontSize: 18,
		marginBottom: 10,
		color: "#4A5568",
	},
	modalButtonsContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		width: "100%",
		marginTop: 20,
	},
	modalButton: {
		backgroundColor: "#2563EB",
		padding: 12,
		borderRadius: 8,
		width: "45%",
		alignItems: "center",
	},
	modalButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	restartButton: {
		backgroundColor: "#48BB78",
	},
});

export default TypingAssignment;
