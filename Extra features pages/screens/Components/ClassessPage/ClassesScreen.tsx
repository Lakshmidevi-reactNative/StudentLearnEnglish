// ClassesScreen.tsx
import React, {
	useState,
	useRef,
	useCallback,
	useMemo,
	useEffect,
} from "react";
import { useTheme } from "../../../App";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Animated,
	StatusBar,
	SafeAreaView,
	Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { toast } from "sonner-native";
import ClassDetail from "./ClassDetail";
import SchoolClasses from "./SchoolClassess";
import PrivateClasses from "./PrivateClasses";
import StickyHeader from "./StickyHeader";
import { MaterialIcons } from "@expo/vector-icons";

// Define constants outside the component
const HEADER_MAX_HEIGHT = 140;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// Define types for better type safety
interface AssignmentItem {
	id: number;
	type: string;
	title: string;
	score?: number;
	feedback?: string;
	dueDate?: string;
	completedDate?: string;
}

interface NavigationProps {
	navigate: (route: string, params?: any) => void;
}

export default function ClassesScreen({
	navigation,
}: {
	navigation: NavigationProps;
}) {
	const [selectedClass, setSelectedClass] = useState(null);
	const [activeClassType, setActiveClassType] = useState("school");
	const scrollY = useRef(new Animated.Value(0)).current;
	const { isDarkMode } = useTheme();

	// Memoize animated values to prevent unnecessary recalculations
	const headerOpacity = useMemo(() => {
		return scrollY.interpolate({
			inputRange: [0, HEADER_SCROLL_DISTANCE],
			outputRange: [1, 0],
			extrapolate: "clamp",
		});
	}, [scrollY]);

	const stickyHeaderOpacity = useMemo(() => {
		return scrollY.interpolate({
			inputRange: [HEADER_SCROLL_DISTANCE - 30, HEADER_SCROLL_DISTANCE],
			outputRange: [0, 1],
			extrapolate: "clamp",
		});
	}, [scrollY]);

	// Memoize scroll event to prevent unnecessary rerenders
	const handleScroll = useMemo(() => {
		return Animated.event(
			[{ nativeEvent: { contentOffset: { y: scrollY } } }],
			{ useNativeDriver: true }
		);
	}, [scrollY]);

	// Use useCallback for event handlers to prevent unnecessary rerenders
	const handleClassSelect = useCallback((classItem) => {
		setSelectedClass(classItem);
	}, []);

	const handleTabChange = useCallback((type: string) => {
		setActiveClassType(type);
	}, []);

	const handleStartAssignment = useCallback(
		(item: AssignmentItem) => {
			const navigateWithCallback = (route: string) => {
				navigation.navigate(route, {
					assignmentData: item,
					onComplete: (results: any) => {
						navigation.navigate(`${item.type}Result`, { results });
					},
				});
			};

			switch (item.type) {
				case "Typing":
					navigateWithCallback("TypingAssignment");
					break;
				case "Language":
					navigateWithCallback("LanguagePracticing");
					break;
				case "RolePlay":
					navigateWithCallback("RolePlay");
					break;
				default:
					toast.success("Starting...");
			}
		},
		[navigation]
	);

	const handleViewCompletedAssignment = useCallback(
		(item: AssignmentItem) => {
			const score = item.score || 0;
			const feedback = item.feedback || "";

			switch (item.type) {
				case "Typing": {
					const typingResults = {
						assignmentTitle: item.title,
						wpm: Math.floor(score * 0.8),
						accuracy: score,
						completionTime: "4:32",
						errors: Math.floor((100 - score) / 5),
						totalCharacters: 1240,
						correctCharacters: Math.floor(1240 * (score / 100)),
						strengths: [
							"Consistent typing speed",
							"Good accuracy with business terms",
						],
						improvements: ["Watch for errors in technical terms"],
						grade:
							score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "D",
						feedback,
					};
					navigation.navigate("TypingResult", { results: typingResults });
					break;
				}
				case "Language": {
					const languageResults = {
						assignmentTitle: item.title,
						score,
						totalQuestions: 20,
						correctAnswers: Math.floor((score / 100) * 20),
						completionTime: "14:25",
						vocabularyStats: {
							business: { correct: 6, total: 6 },
							finance: { correct: Math.floor((score / 100) * 5), total: 5 },
							marketing: { correct: Math.floor((score / 100) * 5), total: 5 },
							management: { correct: Math.floor((score / 100) * 4), total: 4 },
						},
						commonMistakes: [
							{
								term: "ROI",
								userAnswer: "Return on Investment",
								correctAnswer: "Return on Investment",
								isCorrect: true,
							},
							{
								term: "KPI",
								userAnswer: "Key Performance Index",
								correctAnswer: "Key Performance Indicator",
								isCorrect: false,
							},
						],
						grade:
							score >= 90 ? "A" : score >= 80 ? "B+" : score >= 70 ? "C" : "D",
						feedback,
					};
					navigation.navigate("LanguageResult", { results: languageResults });
					break;
				}
				case "RolePlay": {
					const rolePlayResults = {
						assignmentTitle: item.title,
						scenario: "Client Negotiation: Software Development Contract",
						role: "Business Development Manager",
						score,
						duration: "18:45",
						grade:
							score >= 90 ? "A" : score >= 85 ? "A-" : score >= 80 ? "B+" : "B",
						metrics: {
							clientInteraction: Math.floor(score + Math.random() * 5),
							businessTerminology: Math.floor(score - Math.random() * 5),
							negotiationSkills: Math.floor(score + Math.random() * 3),
							problemSolving: Math.floor(score - Math.random() * 4),
							flexibleThinking: Math.floor(score + Math.random() * 6),
						},
						strengths: [
							"Excellent use of business terminology in context",
							"Strong negotiation skills when discussing contract terms",
						],
						improvements: [
							"Could be more specific when discussing technical requirements",
						],
						feedback,
						transcript: [
							{
								speaker: "Client",
								text: "We're concerned about the timeline for this project. Six months seems too long for what we need.",
							},
							{
								speaker: "You",
								text: "I understand your concerns about the timeline. The six-month schedule includes thorough quality assurance testing and a phased deployment to minimize disruption to your operations.",
							},
						],
					};
					navigation.navigate("RolePlayResult", { results: rolePlayResults });
					break;
				}
				case "Writing": {
					const writingResults = {
						assignmentTitle: item.title,
						score,
						feedback,
						completionTime: "23:15",
						wordCount: 450,
						grammarScore: Math.floor(score + Math.random() * 5),
						vocabularyScore: Math.floor(score - Math.random() * 5),
						structureScore: Math.floor(score + Math.random() * 3),
						grade:
							score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "D",
						strengths: [
							"Excellent vocabulary usage",
							"Well-structured paragraphs",
						],
						improvements: ["Work on transitions between sections"],
					};
					navigation.navigate("WritingResult", { results: writingResults });
					break;
				}
				default:
					toast.info("Viewing completed assignment...");
			}
		},
		[navigation]
	);

	// Render the class detail view if a class is selected
	if (selectedClass) {
		return (
			<ClassDetail
				selectedClass={selectedClass}
				setSelectedClass={setSelectedClass}
				scrollY={scrollY}
				stickyHeaderOpacity={stickyHeaderOpacity}
				headerOpacity={headerOpacity}
				handleStartAssignment={handleStartAssignment}
				handleViewCompletedAssignment={handleViewCompletedAssignment}
			/>
		);
	}

	// Extract the tab rendering logic for better readability
	const renderTabs = () => (
		<View style={styles.tabContainer}>
			<View style={[styles.tabSelector, isDarkMode && styles.darkTabSelector]}>
				<TouchableOpacity
					style={[
						styles.tab,
						activeClassType === "school" && styles.activeTab,
						activeClassType === "school" && isDarkMode && styles.darkActiveTab,
					]}
					onPress={() => handleTabChange("school")}
				>
					<Text
						style={[
							styles.tabText,
							activeClassType === "school" && styles.activeTabText,
							isDarkMode && styles.darkTabText,
							activeClassType === "school" &&
								isDarkMode &&
								styles.darkActiveTabText,
						]}
					>
						School Classes
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.tab,
						activeClassType === "private" && styles.activeTab,
						activeClassType === "private" && isDarkMode && styles.darkActiveTab,
					]}
					onPress={() => handleTabChange("private")}
				>
					<Text
						style={[
							styles.tabText,
							activeClassType === "private" && styles.activeTabText,
							isDarkMode && styles.darkTabText,
							activeClassType === "private" &&
								isDarkMode &&
								styles.darkActiveTabText,
						]}
					>
						Private Classes
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<SafeAreaView
			style={[styles.container, isDarkMode && styles.darkContainer]}
		>
			<StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

			{/* Sticky Header */}
			<StickyHeader
				title="My Classes"
				stickyHeaderOpacity={stickyHeaderOpacity}
				isDarkMode={isDarkMode}
			/>

			<Animated.ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}
				onScroll={handleScroll}
				scrollEventThrottle={16}
			>
				{/* Animated header */}
				<Animated.View style={{ opacity: headerOpacity }}>
					<LinearGradient
						colors={
							isDarkMode ? ["#1A1A1A", "#2D2D2D"] : ["#012269", "#224ba3"]
						}
						style={styles.header}
					>
						<View style={styles.headerTitleContainer}>
							<Text style={styles.headerTitle}>My Classes</Text>
						</View>
						{renderTabs()}
					</LinearGradient>
				</Animated.View>

				{/* Content based on selected tab */}
				{activeClassType === "school" ? (
					<SchoolClasses
						handleClassSelect={handleClassSelect}
						isDarkMode={isDarkMode}
					/>
				) : (
					<PrivateClasses
						handleClassSelect={handleClassSelect}
						isDarkMode={isDarkMode}
					/>
				)}

				<View style={styles.bottomSpacing} />
			</Animated.ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F7FA",
	},
	darkContainer: {
		backgroundColor: "#1a1a1a",
	},
	scrollView: {
		flex: 1,
	},
	scrollViewContent: {
		paddingTop: 0,
	},
	header: {
		top: 0,
		padding: 20,
		paddingTop: Platform.OS === "ios" ? 20 : 40,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
	},
	headerTitleContainer: {
		flexDirection: "row",
		marginLeft: 10,
		marginTop: 20,
		gap: 6,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "white",
		alignItems: "center",
	},
	tabContainer: {
		marginTop: 30,
		marginBottom: 20,
		alignItems: "center",
	},
	tabSelector: {
		flexDirection: "row",
		backgroundColor: "#EDF2F7",
		borderRadius: 62,
		padding: 4,
		width: "100%",
	},
	darkTabSelector: {
		backgroundColor: "#333",
	},
	tab: {
		flex: 1,
		paddingVertical: 12,
		alignItems: "center",
		borderRadius: 68,
	},
	activeTab: {
		backgroundColor: "white",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	darkActiveTab: {
		backgroundColor: "#2a2a2a",
	},
	tabText: {
		color: "#4A5568",
		fontWeight: "600",
	},
	darkTabText: {
		color: "#cbd5e0",
	},
	activeTabText: {
		color: "#2563EB",
	},
	darkActiveTabText: {
		color: "#3b82f6",
	},
	bottomSpacing: {
		height: 30,
	},
});
