// ClassesScreen.tsx
// ClassesScreen.tsx
import React, { useState, useRef } from "react";
import { useTheme } from "../../App";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image,
	Modal,
	TextInput,
	Animated,
	StatusBar,
	SafeAreaView,
	Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { toast } from "sonner-native";
import AssignmentCard from "../CommonScreens/AssignmentCard";

export default function ClassesScreen({ navigation }) {
	const [selectedClass, setSelectedClass] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [classCode, setClassCode] = useState("");
	const [activeClassType, setActiveClassType] = useState("school");
	const [activeTab, setActiveTab] = useState("assignments");
	const [privateClasses, setPrivateClasses] = useState([]);
	const scrollY = useRef(new Animated.Value(0)).current;
	const { isDarkMode } = useTheme();

	const schoolClasses = [
		{
			id: 1,
			title: "Business English",
			instructor: "Sarah Johnson",
			nextClass: "10:00 AM Today",
			students: 12,
			progress: 65,
			image:
				"https://api.a0.dev/assets/image?text=business%20professional%20teaching%20in%20modern%20classroom&aspect=16:9",
			items: {
				assessments: {
					completed: [
						{
							id: 3,
							title: "Professional Email Templates",
							completedDate: "2024-02-15",
							type: "Typing",
							score: 92,
							feedback: "Excellent work on format and tone!",
						},
					],
				},
				assignments: {
					pending: [
						{
							id: 22,
							title: "Business Vocabulary Quiz",
							dueDate: "2024-02-22",
							type: "Language",
						},
					],
					completed: [
						{
							id: 4,
							title: "Business Terms Research",
							completedDate: "2024-02-16",
							type: "RolePlay",
							score: 88,
							feedback: "Good depth of research",
						},
					],
				},
			},
		},
		{
			id: 32,
			title: "IELTS Preparation",
			instructor: "Michael Brown",
			nextClass: "2:30 PM Tomorrow",
			students: 8,
			progress: 45,
			image:
				"https://api.a0.dev/assets/image?text=students%20studying%20for%20exam%20in%20modern%20classroom&aspect=16:9",
			items: {
				assessments: {
					completed: [
						{
							id: 6,
							title: "RolePlay",
							completedDate: "2024-02-14",
							type: "RolePlay",
							score: 88,
							feedback: "Good structure and arguments",
						},
					],
				},
				assignments: {
					pending: [
						{
							id: 12,
							title: "Advanced Business Writing",
							dueDate: "2024-02-22",
							type: "Typing",
						},
						{
							id: 3,
							title: "Advanced Business RolePlay",
							dueDate: "2024-02-22",
							type: "RolePlay",
						},
						{
							id: 7,
							title: "Advanced Business Language",
							dueDate: "2024-02-22",
							type: "Language",
						},
					],
					completed: [
						{
							id: 4,
							title: "Speed Typing Test",
							completedDate: "2024-02-16",
							type: "Typing",
							score: 88,
							feedback: "Excellent typing speed and accuracy",
						},
						{
							id: 102,
							title: "Advanced Business Writing",
							dueDate: "2024-02-22",
							type: "Typing",
						},
						{
							id: 103,
							title: "Advanced Business RolePlay",
							dueDate: "2024-02-22",
							type: "RolePlay",
						},
						{
							id: 107,
							title: "Advanced Business Language",
							dueDate: "2024-02-22",
							type: "Language",
						},
					],
				},
			},
		},
	];

	// Animation values for header
	const HEADER_MAX_HEIGHT = 140;
	const HEADER_MIN_HEIGHT = 60;
	const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

	// Calculate header opacity based on scroll position
	const headerOpacity = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE],
		outputRange: [1, 0],
		extrapolate: "clamp",
	});

	// Calculate sticky header opacity
	const stickyHeaderOpacity = scrollY.interpolate({
		inputRange: [HEADER_SCROLL_DISTANCE - 30, HEADER_SCROLL_DISTANCE],
		outputRange: [0, 1],
		extrapolate: "clamp",
	});

	const handleClassSelect = (classItem) => {
		setSelectedClass(classItem);
	};

	const handleStartAssignment = (item) => {
		if (item.type === "Typing") {
			navigation.navigate("TypingAssignment", {
				assignmentData: item,
				onComplete: (results) => {
					navigation.navigate("TypingResult", { results });
				},
			});
		} else if (item.type === "Language") {
			navigation.navigate("LanguagePracticing", {
				assignmentData: item,
				onComplete: (results) => {
					navigation.navigate("LanguageResult", { results });
				},
			});
		} else if (item.type === "RolePlay") {
			navigation.navigate("RolePlay", {
				assignmentData: item,
				onComplete: (results) => {
					navigation.navigate("RolePlayResult", { results });
				},
			});
		} else {
			toast.success("Starting...");
		}
	};

	const handlePreviewAssignment = (item) => {
		navigation.navigate("ContentView", { assignmentData: item });
	};

	const handleJoinClass = () => {
		if (classCode.trim()) {
			const newClass = {
				id: privateClasses.length + 1,
				title: `Class ${classCode}`,
				instructor: "Unknown Instructor",
				nextClass: "Time TBD",
				students: 1,
				progress: 0,
				image:
					"https://api.a0.dev/assets/image?text=Private%20Class&aspect=16:9",
				items: {
					assessments: {
						completed: [],
					},
					assignments: {
						pending: [],
						completed: [],
					},
				},
			};
			setPrivateClasses([...privateClasses, newClass]);
			toast.success("Successfully joined new class!");
			setModalVisible(false);
			setClassCode("");
		} else {
			toast.error("Please enter a valid class code");
		}
	};

	const handleViewCompletedAssignment = (item) => {
		if (item.type === "Typing") {
			const typingResults = {
				assignmentTitle: item.title,
				wpm: Math.floor(item.score * 0.8),
				accuracy: item.score,
				completionTime: "4:32",
				errors: Math.floor((100 - item.score) / 5),
				totalCharacters: 1240,
				correctCharacters: Math.floor(1240 * (item.score / 100)),
				strengths: [
					"Consistent typing speed",
					"Good accuracy with business terms",
				],
				improvements: ["Watch for errors in technical terms"],
				grade:
					item.score >= 90
						? "A"
						: item.score >= 80
						? "B"
						: item.score >= 70
						? "C"
						: "D",
				feedback: item.feedback,
			};

			navigation.navigate("TypingResult", { results: typingResults });
		} else if (item.type === "Language") {
			const languageResults = {
				assignmentTitle: item.title,
				score: item.score,
				totalQuestions: 20,
				correctAnswers: Math.floor((item.score / 100) * 20),
				completionTime: "14:25",
				vocabularyStats: {
					business: { correct: 6, total: 6 },
					finance: { correct: Math.floor((item.score / 100) * 5), total: 5 },
					marketing: { correct: Math.floor((item.score / 100) * 5), total: 5 },
					management: { correct: Math.floor((item.score / 100) * 4), total: 4 },
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
					item.score >= 90
						? "A"
						: item.score >= 80
						? "B+"
						: item.score >= 70
						? "C"
						: "D",
				feedback: item.feedback,
			};

			navigation.navigate("LanguageResult", { results: languageResults });
		} else if (item.type === "RolePlay") {
			const rolePlayResults = {
				assignmentTitle: item.title,
				scenario: "Client Negotiation: Software Development Contract",
				role: "Business Development Manager",
				score: item.score,
				duration: "18:45",
				grade:
					item.score >= 90
						? "A"
						: item.score >= 85
						? "A-"
						: item.score >= 80
						? "B+"
						: "B",
				metrics: {
					clientInteraction: Math.floor(item.score + Math.random() * 5),
					businessTerminology: Math.floor(item.score - Math.random() * 5),
					negotiationSkills: Math.floor(item.score + Math.random() * 3),
					problemSolving: Math.floor(item.score - Math.random() * 4),
					flexibleThinking: Math.floor(item.score + Math.random() * 6),
				},
				strengths: [
					"Excellent use of business terminology in context",
					"Strong negotiation skills when discussing contract terms",
				],
				improvements: [
					"Could be more specific when discussing technical requirements",
				],
				feedback: item.feedback,
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
		} else if (item.type === "Writing") {
			const writingResults = {
				assignmentTitle: item.title,
				score: item.score,
				feedback: item.feedback,
				completionTime: "23:15",
				wordCount: 450,
				grammarScore: Math.floor(item.score + Math.random() * 5),
				vocabularyScore: Math.floor(item.score - Math.random() * 5),
				structureScore: Math.floor(item.score + Math.random() * 3),
				grade:
					item.score >= 90
						? "A"
						: item.score >= 80
						? "B"
						: item.score >= 70
						? "C"
						: "D",
				strengths: ["Excellent vocabulary usage", "Well-structured paragraphs"],
				improvements: ["Work on transitions between sections"],
			};

			navigation.navigate("WritingResult", { results: writingResults });
		} else {
			toast.info("Viewing completed assignment...");
		}
	};

	const renderItems = (items, isAssignments) => (
		<View style={styles.itemsContainer}>
			{isAssignments && items.pending && (
				<View style={styles.statusSection}>
					<Text
						style={[styles.statusTitle, isDarkMode && styles.darkStatusTitle]}
					>
						Pending
					</Text>
					{items.pending.length > 0 ? (
						items.pending.map((item) => (
							<AssignmentCard
								key={item.id}
								item={item}
								isPending={true}
								onStartAssignment={handleStartAssignment}
								onViewCompletedAssignment={() => {}}
							/>
						))
					) : (
						<Text
							style={[styles.noItemsText, isDarkMode && styles.darkNoItemsText]}
						>
							No pending items
						</Text>
					)}
				</View>
			)}

			<View style={styles.statusSection}>
				<Text
					style={[styles.statusTitle, isDarkMode && styles.darkStatusTitle]}
				>
					Completed
				</Text>
				{items.completed && items.completed.length > 0 ? (
					items.completed.map((item) => (
						<AssignmentCard
							key={item.id}
							item={item}
							isPending={false}
							onStartAssignment={() => {}}
							onViewCompletedAssignment={handleViewCompletedAssignment}
						/>
					))
				) : (
					<Text
						style={[styles.noItemsText, isDarkMode && styles.darkNoItemsText]}
					>
						No completed items
					</Text>
				)}
			</View>
		</View>
	);

	const renderTabSwitch = () => (
		<View
			style={[
				styles.tabSwitchContainer,
				isDarkMode && styles.darkTabSwitchContainer,
			]}
		>
			<TouchableOpacity
				style={[
					styles.tabSwitch,
					activeTab === "assignments" && styles.activeTabSwitch,
					activeTab === "assignments" &&
						isDarkMode &&
						styles.darkActiveTabSwitch,
				]}
				onPress={() => setActiveTab("assignments")}
			>
				<Text
					style={[
						styles.tabSwitchText,
						activeTab === "assignments" && styles.activeTabSwitchText,
						isDarkMode && styles.darkTabSwitchText,
						activeTab === "assignments" &&
							isDarkMode &&
							styles.darkActiveTabSwitchText,
					]}
				>
					Assignments
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[
					styles.tabSwitch,
					activeTab === "assessments" && styles.activeTabSwitch,
					activeTab === "assessments" &&
						isDarkMode &&
						styles.darkActiveTabSwitch,
				]}
				onPress={() => setActiveTab("assessments")}
			>
				<Text
					style={[
						styles.tabSwitchText,
						activeTab === "assessments" && styles.activeTabSwitchText,
						isDarkMode && styles.darkTabSwitchText,
						activeTab === "assessments" &&
							isDarkMode &&
							styles.darkActiveTabSwitchText,
					]}
				>
					Assessments
				</Text>
			</TouchableOpacity>
		</View>
	);

	const renderClassContent = () => (
		<SafeAreaView
			style={[styles.container, isDarkMode && styles.darkContainer]}
		>
			<StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

			{/* Sticky Header */}
			<Animated.View
				style={[
					styles.stickyHeader,
					{ opacity: stickyHeaderOpacity },
					isDarkMode && styles.darkStickyHeader,
				]}
			>
				<TouchableOpacity
					onPress={() => setSelectedClass(null)}
					style={styles.backButton}
				>
					<MaterialIcons
						name="arrow-back"
						size={24}
						color={isDarkMode ? "#FFFFFF" : "black"}
					/>
				</TouchableOpacity>
				<Text style={[styles.stickyHeaderTitle, isDarkMode && styles.darkText]}>
					{selectedClass.title}
				</Text>
				<View style={styles.placeholder} />
			</Animated.View>

			<Animated.ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: true }
				)}
				scrollEventThrottle={16}
			>
				{/* Main Header with animations */}
				<Animated.View style={{ opacity: headerOpacity }}>
					<LinearGradient
						colors={
							isDarkMode ? ["#1A1A1A", "#2D2D2D"] : ["#012269", "#224ba3"]
						}
						style={styles.header}
					>
						<View style={styles.headerContent}>
							<TouchableOpacity
								onPress={() => setSelectedClass(null)}
								style={styles.backButtonHeader}
							>
								<MaterialIcons name="arrow-back" size={24} color="white" />
							</TouchableOpacity>
							<Text style={styles.headerTitle}>{selectedClass.title}</Text>
						</View>
						<View style={styles.classInfo}>
							<View style={styles.instructorSection}>
								<MaterialIcons name="person" size={20} color="white" />
								<Text style={styles.instructorText}>
									{selectedClass.instructor}
								</Text>
							</View>
							<View style={styles.nextClassSection}>
								<MaterialIcons name="schedule" size={20} color="white" />
								<Text style={styles.nextClassText}>
									{selectedClass.nextClass}
								</Text>
							</View>
						</View>
						<View style={styles.progressSection}>
							<View style={styles.progressHeader}>
								<Text style={styles.progressLabel}>Course Progress</Text>
								<Text style={styles.progressValue}>
									{selectedClass.progress}%
								</Text>
							</View>
							<View style={styles.progressBar}>
								<View
									style={[
										styles.progressFill,
										{ width: `${selectedClass.progress}%` },
									]}
								/>
							</View>
						</View>
					</LinearGradient>
				</Animated.View>

				<View style={[styles.content, isDarkMode && styles.darkContent]}>
					{renderTabSwitch()}
					{renderItems(
						selectedClass.items[activeTab],
						activeTab === "assignments"
					)}
				</View>
				<View style={styles.bottomSpacing} />
			</Animated.ScrollView>
		</SafeAreaView>
	);

	if (selectedClass) {
		return renderClassContent();
	}

	return (
		<SafeAreaView
			style={[styles.container, isDarkMode && styles.darkContainer]}
		>
			<StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

			{/* Sticky Header */}
			<Animated.View
				style={[
					styles.stickyHeader,
					{ opacity: stickyHeaderOpacity },
					isDarkMode && styles.darkStickyHeader,
				]}
			>
				<View style={styles.placeholder} />
				<Text style={[styles.stickyHeaderTitle, isDarkMode && styles.darkText]}>
					My Classes
				</Text>
				<View style={styles.placeholder} />
			</Animated.View>

			<Animated.ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: true }
				)}
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
						<Text style={styles.headerTitle}>My Classes</Text>
						<Text style={styles.headerSubtitle}>Your enrolled courses</Text>
						<View
							style={[
								styles.tabContainer,
								isDarkMode && styles.darkTabContainer,
							]}
						>
							<TouchableOpacity
								style={[
									styles.tab,
									activeClassType === "school" && styles.activeTab,
									activeClassType === "school" &&
										isDarkMode &&
										styles.darkActiveTab,
								]}
								onPress={() => setActiveClassType("school")}
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
									activeClassType === "private" &&
										isDarkMode &&
										styles.darkActiveTab,
								]}
								onPress={() => setActiveClassType("private")}
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
						{activeClassType === "private" && (
							<TouchableOpacity
								style={[styles.button, isDarkMode && styles.darkButton]}
								onPress={() => setModalVisible(true)}
							>
								<Text
									style={[
										styles.buttonText,
										isDarkMode && styles.darkButtonText,
									]}
								>
									+ Join New Class
								</Text>
							</TouchableOpacity>
						)}
					</LinearGradient>
				</Animated.View>

				<View style={styles.classesContainer}>
					{(activeClassType === "school" ? schoolClasses : privateClasses).map(
						(classItem) => (
							<TouchableOpacity
								key={classItem.id}
								style={[styles.classCard, isDarkMode && styles.darkClassCard]}
								onPress={() => handleClassSelect(classItem)}
							>
								<Image
									source={{ uri: classItem.image }}
									style={styles.classImage}
								/>
								<LinearGradient
									colors={
										isDarkMode
											? ["transparent", "rgba(0,0,0,0.9)"]
											: ["transparent", "rgba(0,0,0,0.8)"]
									}
									style={styles.classOverlay}
								>
									<View style={styles.classContent}>
										<Text style={styles.classTitle}>{classItem.title}</Text>
										<View style={styles.classDetails}>
											<View style={styles.detailRow}>
												<MaterialIcons name="person" size={16} color="white" />
												<Text style={styles.detailText}>
													{classItem.instructor}
												</Text>
											</View>
											<View style={styles.detailRow}>
												<MaterialIcons
													name="schedule"
													size={16}
													color="white"
												/>
												<Text style={styles.detailText}>
													{classItem.nextClass}
												</Text>
											</View>
											<View style={styles.detailRow}>
												<MaterialIcons name="groups" size={16} color="white" />
												<Text style={styles.detailText}>
													{classItem.students} Students
												</Text>
											</View>
										</View>
										<View style={styles.progressBar}>
											<View
												style={[
													styles.progressFill,
													{ width: `${classItem.progress}%` },
												]}
											/>
										</View>
										<Text style={styles.progressText}>
											{classItem.progress}% Complete
										</Text>
									</View>
								</LinearGradient>
							</TouchableOpacity>
						)
					)}
				</View>

				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => setModalVisible(false)}
				>
					<View style={styles.modalContainer}>
						<View
							style={[styles.modalView, isDarkMode && styles.darkModalView]}
						>
							<Text
								style={[styles.modalText, isDarkMode && styles.darkModalText]}
							>
								Enter Class Code
							</Text>
							<TextInput
								style={[styles.input, isDarkMode && styles.darkInput]}
								onChangeText={setClassCode}
								value={classCode}
								placeholder="Class Code"
								placeholderTextColor={isDarkMode ? "#999" : "#aaaaaa"}
							/>
							<TouchableOpacity
								style={[styles.joinButton, isDarkMode && styles.darkJoinButton]}
								onPress={handleJoinClass}
							>
								<Text style={styles.joinButtonText}>Join</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.cancelButton}
								onPress={() => setModalVisible(false)}
							>
								<Text style={styles.cancelButtonText}>Cancel</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
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
	stickyHeader: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: Platform.OS === "ios" ? 50 : 100,
		backgroundColor: "rgba(245,247,250,0.97)",
		zIndex: 1000,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0,0,0,0.1)",
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
		elevation: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	darkStickyHeader: {
		backgroundColor: "rgba(26,26,26,0.95)",
		borderBottomColor: "rgba(255,255,255,0.1)",
	},
	backButton: {
		padding: 8,
		marginBottom: 20,
	},
	backButtonHeader: {
		marginRight: 15,
	},
	stickyHeaderTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#012269",
	},
	placeholder: {
		width: 40,
	},
	darkText: {
		color: "#FFFFFF",
	},
	bottomSpacing: {
		height: 30,
	},
	header: {
		padding: 20,
		paddingTop: Platform.OS === "ios" ? 20 : 40,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 15,
	},
	headerTitle: {
		fontSize: 28,
		fontWeight: "bold",
		color: "white",
	},
	headerSubtitle: {
		fontSize: 16,
		color: "rgba(255,255,255,0.8)",
		marginTop: 5,
	},
	classInfo: {
		marginTop: 15,
	},
	instructorSection: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	instructorText: {
		color: "white",
		marginLeft: 8,
		fontSize: 16,
	},
	nextClassSection: {
		flexDirection: "row",
		alignItems: "center",
	},
	nextClassText: {
		color: "white",
		marginLeft: 8,
		fontSize: 16,
	},
	progressSection: {
		marginTop: 20,
	},
	progressHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	progressLabel: {
		color: "white",
		fontSize: 14,
	},
	progressValue: {
		color: "white",
		fontSize: 14,
		fontWeight: "bold",
	},
	progressBar: {
		height: 6,
		backgroundColor: "rgba(255,255,255,0.2)",
		borderRadius: 3,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: "white",
		borderRadius: 3,
	},
	content: {
		padding: 20,
	},
	darkContent: {
		backgroundColor: "#1a1a1a",
	},
	tabSwitchContainer: {
		flexDirection: "row",
		backgroundColor: "#EDF2F7",
		borderRadius: 30,
		padding: 4,
		marginBottom: 20,
	},
	darkTabSwitchContainer: {
		backgroundColor: "#333",
	},
	tabSwitch: {
		flex: 1,
		paddingVertical: 12,
		alignItems: "center",
		borderRadius: 60,
	},
	activeTabSwitch: {
		backgroundColor: "white",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	darkActiveTabSwitch: {
		backgroundColor: "#2a2a2a",
	},
	tabSwitchText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#4A5568",
	},
	darkTabSwitchText: {
		color: "#cbd5e0",
	},
	activeTabSwitchText: {
		color: "#2563EB",
	},
	darkActiveTabSwitchText: {
		color: "#3b82f6",
	},
	itemsContainer: {
		gap: 24,
	},
	statusSection: {
		marginBottom: 16,
	},
	statusTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#4A5568",
		marginBottom: 12,
	},
	darkStatusTitle: {
		color: "#cbd5e0",
	},
	noItemsText: {
		color: "#666",
		fontSize: 16,
		fontStyle: "italic",
		textAlign: "center",
		padding: 12,
	},
	darkNoItemsText: {
		color: "#999",
	},
	tabContainer: {
		marginTop: 30,
		flexDirection: "row",
		marginBottom: 20,
		backgroundColor: "#EDF2F7",
		borderRadius: 62,
		padding: 4,
	},
	darkTabContainer: {
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
	classesContainer: {
		padding: 20,
		gap: 20,
	},
	classCard: {
		borderRadius: 20,
		overflow: "hidden",
		height: 240,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 5,
	},
	darkClassCard: {
		shadowColor: "#000",
		shadowOpacity: 0.4,
	},
	classImage: {
		width: "100%",
		height: "100%",
	},
	classOverlay: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		padding: 20,
	},
	classContent: {
		gap: 8,
	},
	classTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
	classDetails: {
		gap: 8,
	},
	detailRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	detailText: {
		color: "white",
		fontSize: 14,
	},
	button: {
		backgroundColor: "white",
		padding: 15,
		borderRadius: 10,
		margin: 20,
		alignItems: "center",
	},
	darkButton: {
		backgroundColor: "#2a2a2a",
	},
	buttonText: {
		color: "black",
		fontSize: 16,
	},
	darkButtonText: {
		color: "white",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalView: {
		width: 300,
		backgroundColor: "white",
		borderRadius: 12,
		padding: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.3,
		shadowRadius: 10,
		elevation: 8,
	},
	darkModalView: {
		backgroundColor: "#2a2a2a",
		shadowOpacity: 0.5,
	},
	modalText: {
		marginBottom: 20,
		textAlign: "center",
		fontSize: 20,
		fontWeight: "600",
		color: "#2c3e50",
	},
	darkModalText: {
		color: "#ffffff",
	},
	input: {
		height: 45,
		borderColor: "#3498db",
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 20,
		paddingLeft: 15,
		width: "90%",
		backgroundColor: "#ecf0f1",
	},
	darkInput: {
		backgroundColor: "#333",
		borderColor: "#3b82f6",
		color: "white",
	},
	joinButton: {
		backgroundColor: "#1f3bb3",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: "center",
		marginBottom: 10,
		width: "80%",
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.3,
		shadowRadius: 4,
	},
	darkJoinButton: {
		backgroundColor: "#3b82f6",
	},
	joinButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	cancelButton: {
		backgroundColor: "#FF6F6F",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: "center",
		width: "80%",
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.3,
		shadowRadius: 4,
	},
	cancelButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	progressText: {
		color: "white",
		fontSize: 14,
		marginTop: 4,
	},
});
