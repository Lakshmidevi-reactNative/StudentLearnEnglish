// New code
import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image,
	TextInput,
	FlatList,
	Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	FontAwesome5,
	MaterialCommunityIcons,
	Ionicons,
	Feather,
	AntDesign,
} from "@expo/vector-icons";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { COLORS } from "./constants/Colors";
import { toast } from "sonner-native";
import { useNavigation } from "@react-navigation/native";

// Enhanced mock data for school classes with subjects having assessments and assignments
const schoolClasses = [
	{
		id: 1,
		name: "English 101",
		teacher: "Dr. Sarah Williams",
		subjectCount: 4,
		progress: 68,
		subjects: [
			{
				id: 1,
				name: "Grammar",
				assignments: [
					{
						id: 1,
						title: "Parts of Speech Practice",
						dueDate: "2025-03-15",
						status: "pending",
						type: "Language Practice",
						questions: 15,
						duration: "30 mins",
						preview:
							"This assignment covers nouns, verbs, adjectives, and adverbs usage in sentences.",
					},
					{
						id: 2,
						title: "Tense Formation Exercise",
						dueDate: "2025-03-20",
						status: "pending",
						type: "Typing Practice",
						questions: 20,
						duration: "45 mins",
						preview:
							"Practice forming past, present, and future tenses in various contexts.",
					},
					{
						id: 3,
						title: "Sentence Structure Analysis",
						dueDate: "2025-03-22",
						status: "pending",
						type: "RolePlay Practice",
						questions: 5,
						duration: "60 mins",
						preview:
							"Analyze sentence structures and improve your writing by understanding syntax.",
					},
					{
						id: 11,
						title: "Parts of Speech Practice",
						dueDate: "2025-03-15",
						status: "completed",
						type: "Language Practice",
						questions: 15,
						duration: "30 mins",
						preview:
							"This assignment covers nouns, verbs, adjectives, and adverbs usage in sentences.",
					},
					{
						id: 12,
						title: "Tense Formation Exercise",
						dueDate: "2025-03-20",
						status: "pending",
						type: "Typing Practice",
						questions: 20,
						duration: "45 mins",
						preview:
							"Practice forming past, present, and future tenses in various contexts.",
					},
					{
						id: 13,
						title: "Sentence Structure Analysis",
						dueDate: "2025-03-22",
						status: "pending",
						type: "RolePlay Practice",
						questions: 5,
						duration: "60 mins",
						preview:
							"Analyze sentence structures and improve your writing by understanding syntax.",
					},
				],
				assessments: [
					{
						id: 1,
						title: "Grammar Fundamentals Test",
						date: "2025-03-05",
						status: "completed",
						score: "85%",
						type: "Multiple Choice",
						duration: "60 mins",
						questions: 25,
					},
					{
						id: 2,
						title: "Advanced Syntax Assessment",
						date: "2025-02-25",
						status: "completed",
						score: "92%",
						type: "Mixed Format",
						duration: "90 mins",
						questions: 30,
					},
					{
						id: 3,
						title: "Grammar Rules Application",
						date: "2025-02-15",
						status: "completed",
						score: "78%",
						type: "Paragraph Correction",
						duration: "45 mins",
						questions: 15,
					},
				],
			},
			// More subjects...
		],
	},
	// More classes...
];

// Mock data for private classes
const initialPrivateClasses = [
	{
		id: "pc1",
		name: "Advanced TOEFL Preparation",
		teacher: "Mr. Robert Johnson",
		code: "TOEFL2025",
		students: 18,
		subjects: [
			{
				id: 1,
				name: "TOEFL Reading",
				assignments: [
					{
						id: 1,
						title: "Academic Passage Analysis",
						dueDate: "2025-03-19",
						status: "completed",
						type: "Multiple Choice",
						questions: 14,
						duration: "60 mins",
						preview:
							"Practice analyzing academic passages similar to those on the TOEFL exam.",
					},
					// More assignments...
				],
				assessments: [
					{
						id: 1,
						title: "TOEFL Reading Mock Test",
						date: "2025-03-01",
						status: "completed",
						score: "26/30",
						type: "Multiple Choice",
						duration: "60 mins",
						questions: 30,
					},
					// More assessments...
				],
			},
			// More subjects...
		],
	},
];

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
	},
	header: {
		paddingHorizontal: 20,
		paddingVertical: 15,
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
	tabsContainer: {
		flexDirection: "row",
		marginHorizontal: 20,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		borderRadius: 10,
		padding: 4,
		marginBottom: 15,
	},
	tabButton: {
		flex: 1,
		paddingVertical: 10,
		alignItems: "center",
		borderRadius: 8,
	},
	activeTabButton: {
		backgroundColor: "rgba(255, 255, 255, 0.15)",
	},
	tabText: {
		color: COLORS.textSecondary,
		fontWeight: "600",
	},
	activeTabText: {
		color: COLORS.textPrimary,
	},
	contentContainer: {
		flex: 1,
		paddingHorizontal: 20,
	},
	sectionDescription: {
		color: COLORS.textSecondary,
		fontSize: 14,
		marginBottom: 15,
		textAlign: "center",
	},
	classCard: {
		backgroundColor: "rgba(255, 255, 255, 0.07)",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
		padding: 16,
		marginBottom: 16,
	},
	classHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	className: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "700",
		flex: 1,
	},
	subjectsBadge: {
		backgroundColor: `${COLORS.neonBlue}20`,
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 10,
	},
	subjectsText: {
		color: COLORS.neonBlue,
		fontSize: 12,
		fontWeight: "600",
	},
	privateCodeBadge: {
		backgroundColor: `${COLORS.neonPurple}20`,
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 10,
	},
	privateCodeText: {
		color: COLORS.neonPurple,
		fontSize: 12,
		fontWeight: "600",
	},
	teacherName: {
		color: COLORS.textSecondary,
		fontSize: 14,
		marginBottom: 12,
	},
	progressContainer: {
		marginBottom: 12,
	},
	progressTextContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 6,
	},
	progressLabel: {
		color: COLORS.textSecondary,
		fontSize: 12,
	},
	progressPercentage: {
		color: COLORS.neonGreen,
		fontSize: 12,
		fontWeight: "600",
	},
	progressBar: {
		height: 8,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		borderRadius: 4,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: COLORS.neonGreen,
		borderRadius: 4,
	},
	classFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 8,
	},
	footerItem: {
		flexDirection: "row",
		alignItems: "center",
	},
	footerText: {
		color: COLORS.textSecondary,
		fontSize: 12,
		marginLeft: 5,
	},
	viewClassButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: `${COLORS.neonBlue}15`,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
	},
	viewClassText: {
		color: COLORS.neonBlue,
		fontSize: 12,
		fontWeight: "600",
		marginRight: 4,
	},
	joinClassButton: {
		flexDirection: "row",
		backgroundColor: COLORS.neonBlue,
		borderRadius: 10,
		paddingVertical: 12,
		paddingHorizontal: 16,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	joinClassText: {
		color: COLORS.textPrimary,
		fontWeight: "600",
		marginLeft: 8,
	},
	emptyStateContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 40,
	},
	emptyStateIcon: {
		marginBottom: 15,
		opacity: 0.6,
	},
	emptyStateText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 8,
		textAlign: "center",
	},
	emptyStateSubtext: {
		color: COLORS.textSecondary,
		fontSize: 14,
		textAlign: "center",
	},
	pageHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.1)",
	},
	backButton: {
		padding: 5,
	},
	pageTitle: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "700",
	},
	headerRight: {
		width: 30,
		alignItems: "flex-end",
	},
	subjectSelector: {
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.1)",
	},
	subjectScrollView: {
		paddingHorizontal: 15,
	},
	subjectTab: {
		paddingHorizontal: 15,
		paddingVertical: 8,
		marginRight: 10,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
	},
	activeSubjectTab: {
		backgroundColor: COLORS.neonBlue,
	},
	subjectTabText: {
		color: COLORS.textSecondary,
		fontSize: 14,
		fontWeight: "500",
	},
	activeSubjectTabText: {
		color: COLORS.textPrimary,
		fontWeight: "600",
	},
	contentTypeTabsContainer: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.1)",
	},
	contentTypeTab: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 15,
		borderBottomWidth: 2,
		borderBottomColor: "transparent",
	},
	activeContentTypeTab: {
		borderBottomColor: COLORS.neonBlue,
	},
	contentTypeTabText: {
		color: COLORS.textSecondary,
		fontSize: 14,
		fontWeight: "500",
		marginLeft: 8,
	},
	activeContentTypeTabText: {
		color: COLORS.textPrimary,
	},
	pageContent: {
		padding: 15,
	},
	emptyContentContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 30,
	},
	emptyContentText: {
		color: COLORS.textSecondary,
		fontSize: 16,
		marginTop: 10,
	},
	contentItemCard: {
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.08)",
		padding: 15,
	},
	contentItemHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	contentTypeIcon: {
		width: 40,
		height: 40,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	contentItemTitleContainer: {
		flex: 1,
	},
	contentItemTitle: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 2,
	},
	contentItemType: {
		flexDirection: "row",
		alignItems: "center",
	},
	contentItemTypeText: {
		color: COLORS.textSecondary,
		fontSize: 12,
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		marginLeft: 8,
	},
	statusText: {
		fontSize: 12,
		fontWeight: "600",
	},
	contentItemInfo: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginBottom: 15,
	},
	contentItemInfoRow: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 15,
		marginBottom: 8,
	},
	contentItemInfoText: {
		color: COLORS.textSecondary,
		fontSize: 12,
		marginLeft: 5,
	},
	previewContainer: {
		backgroundColor: "rgba(255, 255, 255, 0.03)",
		borderRadius: 8,
		padding: 12,
		marginBottom: 15,
	},
	previewTitle: {
		color: COLORS.textPrimary,
		fontSize: 14,
		fontWeight: "600",
		marginBottom: 5,
	},
	previewText: {
		color: COLORS.textSecondary,
		fontSize: 13,
		lineHeight: 18,
	},
	contentItemFooter: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	attemptButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: COLORS.neonBlue,
		borderRadius: 8,
		paddingVertical: 8,
		paddingHorizontal: 15,
	},
	attemptButtonText: {
		color: COLORS.textPrimary,
		fontSize: 14,
		fontWeight: "600",
		marginLeft: 5,
	},
	reviewButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: `${COLORS.neonGreen}60`,
		borderRadius: 8,
		paddingVertical: 8,
		paddingHorizontal: 15,
	},
	reviewButtonText: {
		color: COLORS.textPrimary,
		fontSize: 14,
		fontWeight: "600",
		marginLeft: 5,
	},
	// Assessment card specific styles
	assessmentDetailsContainer: {
		marginVertical: 12,
	},
	assessmentDetailsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	assessmentDetailItem: {
		flex: 1,
	},
	assessmentDetailLabel: {
		color: COLORS.textSecondary,
		fontSize: 12,
		marginBottom: 4,
	},
	assessmentDetailValue: {
		color: COLORS.textPrimary,
		fontSize: 14,
		fontWeight: "600",
	},
	divider: {
		height: 1,
		backgroundColor: "rgba(255, 255, 255, 0.08)",
		marginVertical: 10,
	},
	viewResultsButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: `${COLORS.neonPurple}60`,
		borderRadius: 8,
		paddingVertical: 8,
		paddingHorizontal: 15,
	},
	viewResultsText: {
		color: COLORS.textPrimary,
		fontSize: 14,
		fontWeight: "600",
		marginLeft: 5,
	},
	detailGradient: {
		paddingTop: 20,
		paddingBottom: 30,
	},
	detailHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		marginBottom: 10,
	},
	detailContentContainer: {
		alignItems: "center",
		paddingHorizontal: 20,
	},
	detailTypeIcon: {
		width: 60,
		height: 60,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 15,
	},
	detailTitle: {
		color: COLORS.textPrimary,
		fontSize: 20,
		fontWeight: "700",
		textAlign: "center",
		marginBottom: 10,
	},
	detailMetaContainer: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		justifyContent: "center",
		marginBottom: 15,
	},
	detailMetaItem: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 5,
	},
	detailMetaText: {
		color: COLORS.textSecondary,
		fontSize: 12,
		marginLeft: 4,
	},
	detailMetaDot: {
		width: 4,
		height: 4,
		borderRadius: 2,
		backgroundColor: COLORS.textSecondary,
		marginHorizontal: 8,
	},
	detailStatusBadge: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
	},
	detailStatusText: {
		fontSize: 14,
		fontWeight: "600",
	},
	detailModalContent: {
		padding: 20,
		backgroundColor: COLORS.deepBlue,
	},
	detailSection: {
		marginBottom: 25,
	},
	detailSectionTitle: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 10,
	},
	detailDescription: {
		color: COLORS.textSecondary,
		fontSize: 14,
		lineHeight: 22,
	},
	formatContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		borderRadius: 12,
		padding: 15,
	},
	formatIconContainer: {
		width: 44,
		height: 44,
		borderRadius: 8,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 15,
	},
	formatTextContainer: {
		flex: 1,
	},
	formatTitle: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 5,
	},
	formatDescription: {
		color: COLORS.textSecondary,
		fontSize: 13,
	},
	performanceCard: {
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		borderRadius: 12,
		padding: 15,
	},
	performanceHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	performanceTitle: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "600",
	},
	performanceScore: {
		color: COLORS.neonGreen,
		fontSize: 18,
		fontWeight: "700",
	},
	performanceBar: {
		height: 8,
		borderRadius: 4,
		marginBottom: 15,
	},
	performanceFeedback: {
		color: COLORS.textSecondary,
		fontSize: 14,
		lineHeight: 20,
	},
	detailActionContainer: {
		padding: 15,
		borderTopWidth: 1,
		borderTopColor: "rgba(255, 255, 255, 0.1)",
		backgroundColor: COLORS.deepBlue,
	},
	startButton: {
		backgroundColor: COLORS.neonBlue,
		borderRadius: 10,
		paddingVertical: 14,
		alignItems: "center",
	},
	startButtonText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "600",
	},
	reviewDetailButton: {
		backgroundColor: `${COLORS.neonGreen}60`,
		borderRadius: 10,
		paddingVertical: 14,
		alignItems: "center",
	},
	reviewDetailButtonText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "600",
	},
	viewDetailButton: {
		backgroundColor: `${COLORS.neonPurple}60`,
		borderRadius: 10,
		paddingVertical: 14,
		alignItems: "center",
	},
	viewDetailButtonText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "600",
	},
	joinPageContent: {
		padding: 20,
		alignItems: "center",
	},
	joinModalDescription: {
		color: COLORS.textSecondary,
		fontSize: 14,
		lineHeight: 20,
		marginBottom: 20,
		textAlign: "center",
	},
	codeInput: {
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
		borderRadius: 8,
		color: COLORS.textPrimary,
		padding: 12,
		fontSize: 16,
		letterSpacing: 2,
		textAlign: "center",
		width: "100%",
	},
	invalidCodeInput: {
		borderColor: "#FF5252",
	},
	invalidCodeText: {
		color: "#FF5252",
		fontSize: 12,
		marginTop: 5,
		marginBottom: 15,
		alignSelf: "flex-start",
	},
	hintText: {
		color: COLORS.textSecondary,
		fontSize: 12,
		fontStyle: "italic",
		marginTop: 8,
		marginBottom: 20,
	},
	joinButton: {
		backgroundColor: COLORS.neonBlue,
		borderRadius: 10,
		paddingVertical: 12,
		alignItems: "center",
		width: "100%",
	},
	joinButtonText: {
		color: COLORS.textPrimary,
		fontWeight: "600",
		fontSize: 16,
	},
});

export default function ClassesScreen() {
	const [activeTab, setActiveTab] = useState("school");
	const [selectedClass, setSelectedClass] = useState(null);
	const [selectedSubject, setSelectedSubject] = useState(null);
	const [selectedContentType, setSelectedContentType] = useState("assignments"); // 'assignments' or 'assessments'
	const [currentPage, setCurrentPage] = useState("classes"); // 'classes', 'assessments', 'detail'
	const [selectedContentItem, setSelectedContentItem] = useState(null);
	const [classCode, setClassCode] = useState("");
	const [privateClasses, setPrivateClasses] = useState(initialPrivateClasses);
	const [isValidCode, setIsValidCode] = useState(true);
	const [isJoinPageVisible, setIsJoinPageVisible] = useState(false);

	const handleClassPress = (classItem) => {
		setSelectedClass(classItem);
		// Choose the first subject by default
		setSelectedSubject(classItem.subjects[0]);
		setCurrentPage("assessments");
	};

	const navigateBack = () => {
		if (currentPage === "detail") {
			setCurrentPage("assessments");
		} else if (currentPage === "assessments") {
			setCurrentPage("classes");
			setSelectedClass(null);
			setSelectedSubject(null);
		} else if (isJoinPageVisible) {
			setIsJoinPageVisible(false);
		}
	};

	const handleSubjectChange = (subject) => {
		setSelectedSubject(subject);
	};

	const handleContentItemPress = (item) => {
		setSelectedContentItem(item);
		setCurrentPage("detail");
	};  const navigation = useNavigation();
  
  const handleAttemptAssignment = (item) => {
    // Navigate to the appropriate assignment screen based on type
    if (item.type === "RolePlay Practice") {
      navigation.navigate("RoleplayAttempt", { assignment: item });
    } else if (item.type === "Language Practice") {
      navigation.navigate("LanguageAttempt", { assignment: item });
    } else if (item.type === "Typing Practice") {
      navigation.navigate("TypingPractice", { assignment: item });
    } else {
      // Fallback for other types
      toast.success(`Starting assignment: ${item.title}`);
    }
  };

	const handleJoinClass = () => {
		// Simple validation - in a real app this would check against a database
		if (classCode.trim() === "") {
			setIsValidCode(false);
			return;
		}

		// Check if already joined (prevent duplicates)
		const alreadyJoined = privateClasses.some((pc) => pc.code === classCode);
		if (alreadyJoined) {
			toast.error("You already joined this class");
			setIsJoinPageVisible(false);
			setClassCode("");
			return;
		}

		// For demo purposes, add a "new" class when a valid code is entered
		if (classCode === "IELTS2025") {
			const newClass = {
				id: `pc${privateClasses.length + 1}`,
				name: "IELTS Preparation Master Class",
				teacher: "Ms. Sophia Lee",
				code: "IELTS2025",
				students: 12,
				subjects: [
					{
						id: 1,
						name: "IELTS Writing",
						assignments: [
							{
								id: 1,
								title: "Writing Task 1 Practice",
								dueDate: "2025-03-25",
								status: "pending",
								type: "Essay",
								questions: 1,
								duration: "30 mins",
								preview:
									"Practice describing graphs, charts, and processes in an academic context.",
							},
							// More assignments...
						],
						assessments: [
							{
								id: 1,
								title: "IELTS Writing Mock Test",
								date: "2025-03-01",
								status: "completed",
								score: "7.0",
								type: "Essays",
								duration: "60 mins",
								questions: 2,
							},
							// More assessments...
						],
					},
					// More subjects...
				],
			};

			setPrivateClasses([...privateClasses, newClass]);
			toast.success("Successfully joined IELTS Preparation Master Class");
			setIsJoinPageVisible(false);
			setClassCode("");
		} else {
			setIsValidCode(false);
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "Completed":
				return COLORS.neonGreen;
			case "In Progress":
				return COLORS.neonBlue;
			case "Not Started":
			case "Upcoming":
			case "Pending":
				return COLORS.neonOrange;
			default:
				return COLORS.textSecondary;
		}
	};

	const getContentTypeIcon = (type) => {
		switch (type.toLowerCase()) {
			case "multiple choice":
				return "format-list-bulleted";
			case "essay":
				return "text-box-outline";
			case "fill in the blanks":
				return "form-textbox";
			case "matching":
				return "arrow-left-right";
			case "audio recording":
			case "oral interview":
				return "microphone";
			case "video submission":
				return "video";
			case "practical":
				return "hammer";
			case "case analysis":
				return "magnify";
			case "research assignment":
				return "book-search";
			case "role play":
				return "account-group";
			case "timed reading":
				return "timer-outline";
			default:
				return "file-document-outline";
		}
	};

	const renderAssignmentItem = ({ item }) => (
		<TouchableOpacity
			style={styles.contentItemCard}
			onPress={() => handleContentItemPress(item)}
		>
			<View style={styles.contentItemHeader}>
				<View
					style={[
						styles.contentTypeIcon,
						{ backgroundColor: `${COLORS.neonBlue}20` },
					]}
				>
					<MaterialCommunityIcons
						name={getContentTypeIcon(item.type)}
						size={20}
						color={COLORS.neonBlue}
					/>
				</View>
				<View style={styles.contentItemTitleContainer}>
					<Text style={styles.contentItemTitle}>{item.title}</Text>
					<View style={styles.contentItemType}>
						<Text style={styles.contentItemTypeText}>{item.type}</Text>
					</View>
				</View>
				<View
					style={[
						styles.statusBadge,
						{ backgroundColor: `${getStatusColor(item.status)}20` },
					]}
				>
					<Text
						style={[styles.statusText, { color: getStatusColor(item.status) }]}
					>
						{item.status}
					</Text>
				</View>
			</View>

			<View style={styles.contentItemInfo}>
				<View style={styles.contentItemInfoRow}>
					<MaterialCommunityIcons
						name="calendar"
						size={14}
						color={COLORS.textSecondary}
					/>
					<Text style={styles.contentItemInfoText}>
						Due:{" "}
						{new Date(item.dueDate).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
						})}
					</Text>
				</View>
				<View style={styles.contentItemInfoRow}>
					<MaterialCommunityIcons
						name="clock-outline"
						size={14}
						color={COLORS.textSecondary}
					/>
					<Text style={styles.contentItemInfoText}>{item.duration}</Text>
				</View>
				<View style={styles.contentItemInfoRow}>
					<MaterialCommunityIcons
						name="format-list-numbered"
						size={14}
						color={COLORS.textSecondary}
					/>
					<Text style={styles.contentItemInfoText}>
						{item.questions} question{item.questions !== 1 ? "s" : ""}
					</Text>
				</View>
			</View>

			{item.preview && (
				<View style={styles.previewContainer}>
					<Text style={styles.previewTitle}>Preview</Text>
					<Text style={styles.previewText}>{item.preview}</Text>
				</View>
			)}

			<View style={styles.contentItemFooter}>
				{item.status === "pending" ? (
					<TouchableOpacity
						style={styles.attemptButton}
						onPress={() => handleAttemptAssignment(item)}
					>
						<Text style={styles.attemptButtonText}>Attempt Now</Text>
					</TouchableOpacity>
				) : (					<TouchableOpacity 
            style={styles.reviewButton}
            onPress={() => handleContentItemPress(item)}
          >
						<Text style={styles.reviewButtonText}>Review</Text>
					</TouchableOpacity>
				)}
			</View>
		</TouchableOpacity>
	);

	const renderAssessmentItem = ({ item }) => (
		<TouchableOpacity
			style={styles.contentItemCard}
			onPress={() => handleContentItemPress(item)}
		>
			<View style={styles.contentItemHeader}>
				<View
					style={[
						styles.contentTypeIcon,
						{ backgroundColor: `${COLORS.neonPurple}20` },
					]}
				>
					<MaterialCommunityIcons
						name={getContentTypeIcon(item.type)}
						size={20}
						color={COLORS.neonPurple}
					/>
				</View>
				<View style={styles.contentItemTitleContainer}>
					<Text style={styles.contentItemTitle}>{item.title}</Text>
					<View style={styles.contentItemType}>
						<Text style={styles.contentItemTypeText}>{item.type}</Text>
					</View>
				</View>
				<View
					style={[
						styles.statusBadge,
						{ backgroundColor: `${getStatusColor(item.status)}20` },
					]}
				>
					<Text
						style={[styles.statusText, { color: getStatusColor(item.status) }]}
					>
						{item.status}
					</Text>
				</View>
			</View>

			<View style={styles.assessmentDetailsContainer}>
				<View style={styles.assessmentDetailsRow}>
					<View style={styles.assessmentDetailItem}>
						<Text style={styles.assessmentDetailLabel}>Mode</Text>
						<Text style={styles.assessmentDetailValue}>
							{item.mode || "Online"}
						</Text>
					</View>

					<View style={styles.assessmentDetailItem}>
						<Text style={styles.assessmentDetailLabel}>Date</Text>
						<Text style={styles.assessmentDetailValue}>
							{new Date(item.date).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
							})}
						</Text>
					</View>

					<View style={styles.assessmentDetailItem}>
						<Text style={styles.assessmentDetailLabel}>Score</Text>
						<Text
							style={[
								styles.assessmentDetailValue,
								{ color: COLORS.neonGreen },
							]}
						>
							{item.score}
						</Text>
					</View>
				</View>
			</View>

			<View style={styles.divider} />

			<View style={styles.contentItemFooter}>
				<TouchableOpacity style={styles.viewResultsButton}>
					<MaterialCommunityIcons
						name="file-document-outline"
						size={16}
						color={COLORS.textPrimary}
					/>
					<Text style={styles.viewResultsText}>View Results</Text>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);

	// Render the Classes List
	const renderClassesPage = () => (
		<>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>My Classes</Text>
			</View>

			<View style={styles.tabsContainer}>
				<TouchableOpacity
					style={[
						styles.tabButton,
						activeTab === "school" && styles.activeTabButton,
					]}
					onPress={() => setActiveTab("school")}
				>
					<Text
						style={[
							styles.tabText,
							activeTab === "school" && styles.activeTabText,
						]}
					>
						School Classes
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.tabButton,
						activeTab === "private" && styles.activeTabButton,
					]}
					onPress={() => setActiveTab("private")}
				>
					<Text
						style={[
							styles.tabText,
							activeTab === "private" && styles.activeTabText,
						]}
					>
						Private Classes
					</Text>
				</TouchableOpacity>
			</View>

			<ScrollView
				style={styles.contentContainer}
				showsVerticalScrollIndicator={false}
			>
				{activeTab === "school" ? (
					<View>
						<Text style={styles.sectionDescription}>
							Your enrolled school classes and their subjects
						</Text>

						{schoolClasses.map((classItem, index) => (
							<Animated.View
								key={classItem.id}
								entering={FadeInDown.delay(100 * index).duration(400)}
							>
								<TouchableOpacity
									style={styles.classCard}
									onPress={() => handleClassPress(classItem)}
								>
									<View style={styles.classHeader}>
										<Text style={styles.className}>{classItem.name}</Text>
										<View style={styles.subjectsBadge}>
											<Text style={styles.subjectsText}>
												{classItem.subjectCount} subjects
											</Text>
										</View>
									</View>

									<Text style={styles.teacherName}>
										Teacher: {classItem.teacher}
									</Text>

									<View style={styles.progressContainer}>
										<View style={styles.progressTextContainer}>
											<Text style={styles.progressLabel}>Progress</Text>
											<Text style={styles.progressPercentage}>
												{classItem.progress}%
											</Text>
										</View>
										<View style={styles.progressBar}>
											<View
												style={[
													styles.progressFill,
													{ width: `${classItem.progress}%` },
												]}
											/>
										</View>
									</View>

									<View style={styles.classFooter}>
										<View style={styles.footerItem}>
											<MaterialCommunityIcons
												name="book-open-variant"
												size={16}
												color={COLORS.neonBlue}
											/>
											<Text style={styles.footerText}>
												{classItem.subjects.length} subjects
											</Text>
										</View>
										<TouchableOpacity
											style={styles.viewClassButton}
											onPress={() => handleClassPress(classItem)}
										>
											<Text style={styles.viewClassText}>View Assessments</Text>
											<MaterialCommunityIcons
												name="chevron-right"
												size={16}
												color={COLORS.neonBlue}
											/>
										</TouchableOpacity>
									</View>
								</TouchableOpacity>
							</Animated.View>
						))}
					</View>
				) : (
					<View>
						<Text style={styles.sectionDescription}>
							Private classes you've joined with class codes
						</Text>

						<TouchableOpacity
							style={styles.joinClassButton}
							onPress={() => setIsJoinPageVisible(true)}
						>
							<MaterialCommunityIcons
								name="plus"
								size={20}
								color={COLORS.textPrimary}
							/>
							<Text style={styles.joinClassText}>Join a Private Class</Text>
						</TouchableOpacity>

						{privateClasses.length > 0 ? (
							privateClasses.map((classItem, index) => (
								<Animated.View
									key={classItem.id}
									entering={FadeInDown.delay(100 * index).duration(400)}
								>
									<TouchableOpacity
										style={styles.classCard}
										onPress={() => handleClassPress(classItem)}
									>
										<View style={styles.classHeader}>
											<Text style={styles.className}>{classItem.name}</Text>
											<View style={styles.privateCodeBadge}>
												<Text style={styles.privateCodeText}>
													{classItem.code}
												</Text>
											</View>
										</View>

										<Text style={styles.teacherName}>
											Teacher: {classItem.teacher}
										</Text>

										<View style={styles.classFooter}>
											<View style={styles.footerItem}>
												<MaterialCommunityIcons
													name="account-group"
													size={16}
													color={COLORS.neonBlue}
												/>
												<Text style={styles.footerText}>
													{classItem.students} students
												</Text>
											</View>
											<TouchableOpacity
												style={styles.viewClassButton}
												onPress={() => handleClassPress(classItem)}
											>
												<Text style={styles.viewClassText}>
													View Assessments
												</Text>
												<MaterialCommunityIcons
													name="chevron-right"
													size={16}
													color={COLORS.neonBlue}
												/>
											</TouchableOpacity>
										</View>
									</TouchableOpacity>
								</Animated.View>
							))
						) : (
							<View style={styles.emptyStateContainer}>
								<MaterialCommunityIcons
									name="school"
									size={60}
									color={COLORS.textSecondary}
									style={styles.emptyStateIcon}
								/>
								<Text style={styles.emptyStateText}>
									You haven't joined any private classes yet
								</Text>
								<Text style={styles.emptyStateSubtext}>
									Use a class code to join a private class
								</Text>
							</View>
						)}
					</View>
				)}

				{/* Extra space at bottom for navigation bar */}
				<View style={{ height: 100 }} />
			</ScrollView>
		</>
	);

	// Render the Assessments Page
	const renderAssessmentsPage = () => (
		<>
			<View style={styles.pageHeader}>
				<TouchableOpacity onPress={navigateBack} style={styles.backButton}>
					<Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
				</TouchableOpacity>
				<Text style={styles.pageTitle}>{selectedClass?.name}</Text>
				<View style={styles.headerRight}>
					<TouchableOpacity>
						<MaterialCommunityIcons
							name="dots-vertical"
							size={22}
							color={COLORS.textPrimary}
						/>
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.subjectSelector}>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.subjectScrollView}
				>
					{selectedClass?.subjects.map((subject) => (
						<TouchableOpacity
							key={`subject-${subject.id}`}
							style={[
								styles.subjectTab,
								selectedSubject?.id === subject.id && styles.activeSubjectTab,
							]}
							onPress={() => handleSubjectChange(subject)}
						>
							<Text
								style={[
									styles.subjectTabText,
									selectedSubject?.id === subject.id &&
										styles.activeSubjectTabText,
								]}
							>
								{subject.name}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>

			<View style={styles.contentTypeTabsContainer}>
				<TouchableOpacity
					style={[
						styles.contentTypeTab,
						selectedContentType === "assignments" &&
							styles.activeContentTypeTab,
					]}
					onPress={() => setSelectedContentType("assignments")}
				>
					<MaterialCommunityIcons
						name="clipboard-text"
						size={20}
						color={
							selectedContentType === "assignments"
								? COLORS.textPrimary
								: COLORS.textSecondary
						}
					/>
					<Text
						style={[
							styles.contentTypeTabText,
							selectedContentType === "assignments" &&
								styles.activeContentTypeTabText,
						]}
					>
						Assignments
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.contentTypeTab,
						selectedContentType === "assessments" &&
							styles.activeContentTypeTab,
					]}
					onPress={() => setSelectedContentType("assessments")}
				>
					<MaterialCommunityIcons
						name="clipboard-check"
						size={20}
						color={
							selectedContentType === "assessments"
								? COLORS.textPrimary
								: COLORS.textSecondary
						}
					/>
					<Text
						style={[
							styles.contentTypeTabText,
							selectedContentType === "assessments" &&
								styles.activeContentTypeTabText,
						]}
					>
						Assessments
					</Text>
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.pageContent}>
				{selectedContentType === "assignments" ? (
					selectedSubject?.assignments?.length > 0 ? (
						selectedSubject.assignments.map((item, index) => (
							<Animated.View
								key={`assignment-${item.id}`}
								entering={FadeIn.delay(100 * index).duration(300)}
								style={{ marginBottom: 15 }}
							>
								{renderAssignmentItem({ item })}
							</Animated.View>
						))
					) : (
						<View style={styles.emptyContentContainer}>
							<MaterialCommunityIcons
								name="clipboard-text"
								size={50}
								color={COLORS.textSecondary}
							/>
							<Text style={styles.emptyContentText}>
								No assignments available yet
							</Text>
						</View>
					)
				) : selectedSubject?.assessments?.length > 0 ? (
					selectedSubject.assessments.map((item, index) => (
						<Animated.View
							key={`assessment-${item.id}`}
							entering={FadeIn.delay(100 * index).duration(300)}
							style={{ marginBottom: 15 }}
						>
							{renderAssessmentItem({ item })}
						</Animated.View>
					))
				) : (
					<View style={styles.emptyContentContainer}>
						<MaterialCommunityIcons
							name="clipboard-check"
							size={50}
							color={COLORS.textSecondary}
						/>
						<Text style={styles.emptyContentText}>
							No assessments available yet
						</Text>
					</View>
				)}

				{/* Extra space at bottom */}
				<View style={{ height: 20 }} />
			</ScrollView>
		</>
	);

	// Render the Detail Page
	const renderDetailPage = () => (
		<>
			<LinearGradient
				colors={[
					selectedContentType === "assignments"
						? "rgba(0, 180, 255, 0.3)"
						: "rgba(176, 38, 255, 0.3)",
					"rgba(11, 16, 51, 0.9)",
				]}
				style={styles.detailGradient}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 0.6 }}
			>
				<View style={styles.detailHeader}>
					<TouchableOpacity onPress={navigateBack} style={styles.backButton}>
						<Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
					</TouchableOpacity>
					<View style={styles.headerRight}>
						<TouchableOpacity>
							<MaterialCommunityIcons
								name="dots-vertical"
								size={22}
								color={COLORS.textPrimary}
							/>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.detailContentContainer}>
					<View
						style={[
							styles.detailTypeIcon,
							{
								backgroundColor:
									selectedContentType === "assignments"
										? `${COLORS.neonBlue}30`
										: `${COLORS.neonPurple}30`,
							},
						]}
					>
						<MaterialCommunityIcons
							name={getContentTypeIcon(selectedContentItem?.type || "")}
							size={32}
							color={
								selectedContentType === "assignments"
									? COLORS.neonBlue
									: COLORS.neonPurple
							}
						/>
					</View>

					<Text style={styles.detailTitle}>{selectedContentItem?.title}</Text>

					<View style={styles.detailMetaContainer}>
						<View style={styles.detailMetaItem}>
							<MaterialCommunityIcons
								name="clock-outline"
								size={16}
								color={COLORS.textSecondary}
							/>
							<Text style={styles.detailMetaText}>
								{selectedContentItem?.duration}
							</Text>
						</View>
						<View style={styles.detailMetaDot} />
						<View style={styles.detailMetaItem}>
							<MaterialCommunityIcons
								name="format-list-numbered"
								size={16}
								color={COLORS.textSecondary}
							/>
							<Text style={styles.detailMetaText}>
								{selectedContentItem?.questions} question
								{selectedContentItem?.questions !== 1 ? "s" : ""}
							</Text>
						</View>
						<View style={styles.detailMetaDot} />
						<View style={styles.detailMetaItem}>
							<MaterialCommunityIcons
								name={
									selectedContentType === "assignments"
										? "calendar"
										: "trophy-award"
								}
								size={16}
								color={COLORS.textSecondary}
							/>
							<Text style={styles.detailMetaText}>
								{selectedContentType === "assignments"
									? `Due: ${new Date(
											selectedContentItem?.dueDate
									  ).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
									  })}`
									: selectedContentItem?.score}
							</Text>
						</View>
					</View>

					<View
						style={[
							styles.detailStatusBadge,
							{
								backgroundColor:
									selectedContentType === "assignments"
										? `${getStatusColor(selectedContentItem?.status)}20`
										: `${COLORS.neonGreen}20`,
							},
						]}
					>
						<Text
							style={[
								styles.detailStatusText,
								{
									color:
										selectedContentType === "assignments"
											? getStatusColor(selectedContentItem?.status)
											: COLORS.neonGreen,
								},
							]}
						>
							{selectedContentType === "assignments"
								? selectedContentItem?.status === "pending"
									? "Pending"
									: "Completed"
								: "Completed"}
						</Text>
					</View>
				</View>
			</LinearGradient>

			<ScrollView style={styles.detailModalContent}>
				<View style={styles.detailSection}>
					<Text style={styles.detailSectionTitle}>Description</Text>
					{selectedContentType === "assignments" ? (
						<Text style={styles.detailDescription}>
							{selectedContentItem?.preview}
						</Text>
					) : (
						<Text style={styles.detailDescription}>
							This assessment evaluates your understanding of key concepts and
							skills in {selectedSubject?.name}. Review your results to identify
							areas for improvement.
						</Text>
					)}
				</View>

				<View style={styles.detailSection}>
					<Text style={styles.detailSectionTitle}>Format</Text>
					<View style={styles.formatContainer}>
						<View style={styles.formatIconContainer}>
							<MaterialCommunityIcons
								name={getContentTypeIcon(selectedContentItem?.type || "")}
								size={24}
								color={
									selectedContentType === "assignments"
										? COLORS.neonBlue
										: COLORS.neonPurple
								}
							/>
						</View>
						<View style={styles.formatTextContainer}>
							<Text style={styles.formatTitle}>
								{selectedContentItem?.type}
							</Text>
							<Text style={styles.formatDescription}>
								{selectedContentItem?.questions} question
								{selectedContentItem?.questions !== 1 ? "s" : ""} •{" "}
								{selectedContentItem?.duration}
							</Text>
						</View>
					</View>
				</View>

				{selectedContentType === "assessments" && (
					<View style={styles.detailSection}>
						<Text style={styles.detailSectionTitle}>Your Performance</Text>
						<View style={styles.performanceCard}>
							<View style={styles.performanceHeader}>
								<Text style={styles.performanceTitle}>Score</Text>
								<Text style={styles.performanceScore}>
									{selectedContentItem?.score}
								</Text>
							</View>
							<LinearGradient
								colors={[COLORS.neonGreen, COLORS.neonBlue]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
								style={styles.performanceBar}
							/>
							<Text style={styles.performanceFeedback}>
								Excellent work! You demonstrated a strong understanding of the
								material.
							</Text>
						</View>
					</View>
				)}

				<View style={{ height: 100 }} />
			</ScrollView>

			<View style={styles.detailActionContainer}>
				{selectedContentType === "assignments" ? (
					selectedContentItem?.status === "pending" ? (
						<TouchableOpacity
							style={styles.startButton}
							onPress={() => handleAttemptAssignment(selectedContentItem)}
						>
							<Text style={styles.startButtonText}>Start Assignment</Text>
						</TouchableOpacity>
					) : (						<TouchableOpacity 
              style={styles.reviewDetailButton}
              onPress={() => toast.info("Reviewing previous submission...")}
            >
							<Text style={styles.reviewDetailButtonText}>
								Review Submission
							</Text>
						</TouchableOpacity>
					)
				) : (					<TouchableOpacity 
            style={styles.viewDetailButton}
            onPress={() => toast.info("Viewing detailed assessment results...")}
          >
						<Text style={styles.viewDetailButtonText}>
							View Detailed Results
						</Text>
					</TouchableOpacity>
				)}
			</View>
		</>
	);

	// Render the Join Class Page
	const renderJoinClassPage = () => (
		<>
			<View style={styles.pageHeader}>
				<TouchableOpacity onPress={navigateBack} style={styles.backButton}>
					<Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
				</TouchableOpacity>
				<Text style={styles.pageTitle}>Join a Private Class</Text>
				<View style={styles.headerRight} />
			</View>

			<View style={styles.joinPageContent}>
				<Text style={styles.joinModalDescription}>
					Enter the class code provided by your teacher to join a private class
				</Text>

				<TextInput
					style={[styles.codeInput, !isValidCode && styles.invalidCodeInput]}
					placeholder="Enter class code"
					placeholderTextColor={COLORS.textSecondary}
					value={classCode}
					onChangeText={(text) => {
						setClassCode(text.toUpperCase());
						setIsValidCode(true);
					}}
					autoCapitalize="characters"
				/>

				{!isValidCode && (
					<Text style={styles.invalidCodeText}>
						Invalid class code. Please check and try again.
					</Text>
				)}

				<Text style={styles.hintText}>
					Try using code "IELTS2025" for a demo
				</Text>

				<TouchableOpacity style={styles.joinButton} onPress={handleJoinClass}>
					<Text style={styles.joinButtonText}>Join Class</Text>
				</TouchableOpacity>
			</View>
		</>
	);

	return (
		<LinearGradient
			colors={[COLORS.deepBlue, COLORS.softPurple]}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			<SafeAreaView style={styles.safeArea}>
				{currentPage === "classes" && !isJoinPageVisible && renderClassesPage()}
				{currentPage === "assessments" && renderAssessmentsPage()}
				{currentPage === "detail" && renderDetailPage()}
				{isJoinPageVisible && renderJoinClassPage()}
			</SafeAreaView>
		</LinearGradient>
	);
}
