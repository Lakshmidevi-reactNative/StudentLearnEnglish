import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image,
	Modal,
	TextInput,
	FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	FontAwesome5,
	MaterialCommunityIcons,
	Ionicons,
} from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS } from "./constants/Colors";
import { toast } from "sonner-native";

// Mock data for school classes
const schoolClasses = [
	{
		id: 1,
		name: "English 101",
		teacher: "Dr. Sarah Williams",
		subjectCount: 4,
		progress: 68,
		subjects: ["Grammar", "Vocabulary", "Reading", "Listening"],
		assignments: [
			{
				id: 1,
				title: "Weekly Grammar Quiz",
				dueDate: "2025-03-15",
				status: "completed",
			},
			{
				id: 2,
				title: "Reading Comprehension",
				dueDate: "2025-03-20",
				status: "in-progress",
			},
			{
				id: 3,
				title: "Vocabulary Expansion",
				dueDate: "2025-03-22",
				status: "not-started",
			},
		],
		assessments: [
			{ id: 1, title: "Mid-term Exam", date: "2025-04-05", status: "upcoming" },
			{
				id: 2,
				title: "Oral Presentation",
				date: "2025-03-25",
				status: "upcoming",
			},
		],
	},
	{
		id: 2,
		name: "Business Communication",
		teacher: "Prof. Michael Chen",
		subjectCount: 3,
		progress: 42,
		subjects: [
			"Professional Writing",
			"Presentation Skills",
			"Business Etiquette",
		],
		assignments: [
			{
				id: 1,
				title: "Business Email Writing",
				dueDate: "2025-03-18",
				status: "completed",
			},
			{
				id: 2,
				title: "Meeting Minutes Exercise",
				dueDate: "2025-03-24",
				status: "not-started",
			},
		],
		assessments: [
			{
				id: 1,
				title: "Group Presentation",
				date: "2025-04-10",
				status: "upcoming",
			},
		],
	},
	{
		id: 3,
		name: "Conversational English",
		teacher: "Ms. Emily Rodriguez",
		subjectCount: 2,
		progress: 85,
		subjects: ["Everyday Conversation", "Cultural Idioms"],
		assignments: [
			{
				id: 1,
				title: "Dialogue Recording",
				dueDate: "2025-03-16",
				status: "completed",
			},
			{
				id: 2,
				title: "Idiom Usage Practice",
				dueDate: "2025-03-21",
				status: "completed",
			},
		],
		assessments: [
			{
				id: 1,
				title: "Conversation Practice Test",
				date: "2025-03-28",
				status: "upcoming",
			},
		],
	},
];

// Mock data for private classes
const initialPrivateClasses = [
	{
		id: "pc1",
		name: "Advanced TOEFL Preparation",
		teacher: "Mr. Robert Johnson",
		code: "TOEFL2025",
		students: 18,
		assignments: [
			{
				id: 1,
				title: "Practice Test 1",
				dueDate: "2025-03-19",
				status: "completed",
			},
			{
				id: 2,
				title: "Essay Writing",
				dueDate: "2025-03-26",
				status: "not-started",
			},
		],
		assessments: [
			{
				id: 1,
				title: "Mock TOEFL Exam",
				date: "2025-04-15",
				status: "upcoming",
			},
		],
	},
];

export default function ClassesScreen() {
	const [activeTab, setActiveTab] = useState("school");
	const [selectedClass, setSelectedClass] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
	const [classCode, setClassCode] = useState("");
	const [privateClasses, setPrivateClasses] = useState(initialPrivateClasses);
	const [isValidCode, setIsValidCode] = useState(true);

	const handleClassPress = (classItem) => {
		setSelectedClass(classItem);
		setIsModalVisible(true);
	};

	const closeModal = () => {
		setIsModalVisible(false);
		setSelectedClass(null);
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
			setIsJoinModalVisible(false);
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
				assignments: [
					{
						id: 1,
						title: "Writing Task 1 Practice",
						dueDate: "2025-03-25",
						status: "not-started",
					},
					{
						id: 2,
						title: "Speaking Part 2 Preparation",
						dueDate: "2025-03-28",
						status: "not-started",
					},
				],
				assessments: [
					{
						id: 1,
						title: "IELTS Mock Test",
						date: "2025-04-10",
						status: "upcoming",
					},
				],
			};

			setPrivateClasses([...privateClasses, newClass]);
			toast.success("Successfully joined IELTS Preparation Master Class");
			setIsJoinModalVisible(false);
			setClassCode("");
		} else {
			setIsValidCode(false);
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "completed":
				return COLORS.neonGreen;
			case "in-progress":
				return COLORS.neonBlue;
			case "not-started":
			case "upcoming":
				return COLORS.neonOrange;
			default:
				return COLORS.textSecondary;
		}
	};

	const renderAssignmentItem = ({ item }) => (
		<View style={styles.assignmentItem}>
			<View style={styles.assignmentHeader}>
				<Text style={styles.assignmentTitle}>{item.title}</Text>
				<View
					style={[
						styles.statusBadge,
						{ backgroundColor: `${getStatusColor(item.status)}20` },
					]}
				>
					<Text
						style={[styles.statusText, { color: getStatusColor(item.status) }]}
					>
						{item.status === "in-progress"
							? "In Progress"
							: item.status === "not-started"
							? "Not Started"
							: item.status === "upcoming"
							? "Upcoming"
							: "Completed"}
					</Text>
				</View>
			</View>
			<View style={styles.assignmentMeta}>
				<MaterialCommunityIcons
					name="calendar"
					size={14}
					color={COLORS.textSecondary}
				/>
				<Text style={styles.assignmentDate}>
					Due:{" "}
					{new Date(item.dueDate).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})}
				</Text>
			</View>
		</View>
	);

	const renderAssessmentItem = ({ item }) => (
		<View style={styles.assignmentItem}>
			<View style={styles.assignmentHeader}>
				<Text style={styles.assignmentTitle}>{item.title}</Text>
				<View
					style={[
						styles.statusBadge,
						{ backgroundColor: `${getStatusColor(item.status)}20` },
					]}
				>
					<Text
						style={[styles.statusText, { color: getStatusColor(item.status) }]}
					>
						{item.status === "upcoming" ? "Upcoming" : "Completed"}
					</Text>
				</View>
			</View>
			<View style={styles.assignmentMeta}>
				<MaterialCommunityIcons
					name="calendar"
					size={14}
					color={COLORS.textSecondary}
				/>
				<Text style={styles.assignmentDate}>
					Date:{" "}
					{new Date(item.date).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})}
				</Text>
			</View>
		</View>
	);

	return (
		<LinearGradient
			colors={[COLORS.deepBlue, COLORS.softPurple]}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			<SafeAreaView style={styles.safeArea}>
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
								Your enrolled school classes and their assignments
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
													{classItem.assignments.length} assignments
												</Text>
											</View>
											<View style={styles.footerItem}>
												<MaterialCommunityIcons
													name="clipboard-check"
													size={16}
													color={COLORS.neonPurple}
												/>
												<Text style={styles.footerText}>
													{classItem.assessments.length} assessments
												</Text>
											</View>
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
								onPress={() => setIsJoinModalVisible(true)}
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
												<View style={styles.footerItem}>
													<MaterialCommunityIcons
														name="clipboard-check"
														size={16}
														color={COLORS.neonPurple}
													/>
													<Text style={styles.footerText}>
														{classItem.assignments.length +
															classItem.assessments.length}{" "}
														tasks
													</Text>
												</View>
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

				{/* Class Detail Modal */}
				<Modal
					visible={isModalVisible}
					transparent={true}
					animationType="slide"
					onRequestClose={closeModal}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContainer}>
							<View style={styles.modalHeader}>
								<Text style={styles.modalTitle}>{selectedClass?.name}</Text>
								<TouchableOpacity onPress={closeModal}>
									<Ionicons name="close" size={24} color={COLORS.textPrimary} />
								</TouchableOpacity>
							</View>

							<ScrollView style={styles.modalContent}>
								<View style={styles.detailsSection}>
									<Text style={styles.detailLabel}>Teacher</Text>
									<Text style={styles.detailValue}>
										{selectedClass?.teacher}
									</Text>
								</View>

								{selectedClass?.code && (
									<View style={styles.detailsSection}>
										<Text style={styles.detailLabel}>Class Code</Text>
										<View style={styles.codeContainer}>
											<Text style={styles.codeValue}>
												{selectedClass?.code}
											</Text>
											<TouchableOpacity
												style={styles.copyButton}
												onPress={() => {
													// In a real app, this would copy to clipboard
													toast.success("Class code copied to clipboard");
												}}
											>
												<MaterialCommunityIcons
													name="content-copy"
													size={18}
													color={COLORS.neonBlue}
												/>
											</TouchableOpacity>
										</View>
									</View>
								)}

								{selectedClass?.subjects && (
									<View style={styles.detailsSection}>
										<Text style={styles.detailLabel}>Subjects</Text>
										<View style={styles.subjectsContainer}>
											{selectedClass.subjects.map((subject, index) => (
												<View key={index} style={styles.subjectBadge}>
													<Text style={styles.subjectText}>{subject}</Text>
												</View>
											))}
										</View>
									</View>
								)}

								<View style={styles.sectionDivider} />

								<Text style={styles.sectionTitle}>Assignments</Text>
								{selectedClass?.assignments.length > 0 ? (
									<FlatList
										data={selectedClass.assignments}
										renderItem={renderAssignmentItem}
										keyExtractor={(item) => `assignment-${item.id}`}
										scrollEnabled={false}
									/>
								) : (
									<Text style={styles.noContentText}>No assignments yet</Text>
								)}

								<View style={styles.sectionDivider} />

								<Text style={styles.sectionTitle}>Assessments</Text>
								{selectedClass?.assessments.length > 0 ? (
									<FlatList
										data={selectedClass.assessments}
										renderItem={renderAssessmentItem}
										keyExtractor={(item) => `assessment-${item.id}`}
										scrollEnabled={false}
									/>
								) : (
									<Text style={styles.noContentText}>No assessments yet</Text>
								)}
							</ScrollView>
						</View>
					</View>
				</Modal>

				{/* Join Class Modal */}
				<Modal
					visible={isJoinModalVisible}
					transparent={true}
					animationType="fade"
					onRequestClose={() => setIsJoinModalVisible(false)}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.joinModalContainer}>
							<View style={styles.modalHeader}>
								<Text style={styles.modalTitle}>Join a Private Class</Text>
								<TouchableOpacity
									onPress={() => {
										setIsJoinModalVisible(false);
										setClassCode("");
										setIsValidCode(true);
									}}
								>
									<Ionicons name="close" size={24} color={COLORS.textPrimary} />
								</TouchableOpacity>
							</View>

							<Text style={styles.joinModalDescription}>
								Enter the class code provided by your teacher to join a private
								class
							</Text>

							<TextInput
								style={[
									styles.codeInput,
									!isValidCode && styles.invalidCodeInput,
								]}
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

							<TouchableOpacity
								style={styles.joinButton}
								onPress={handleJoinClass}
							>
								<Text style={styles.joinButtonText}>Join Class</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</SafeAreaView>
		</LinearGradient>
	);
}

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
		marginTop: 4,
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
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		backgroundColor: COLORS.deepBlue,
		borderRadius: 16,
		width: "90%",
		maxHeight: "80%",
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
	},
	joinModalContainer: {
		backgroundColor: COLORS.deepBlue,
		borderRadius: 16,
		width: "90%",
		padding: 20,
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: COLORS.cardBorder,
		paddingHorizontal: 20,
		paddingVertical: 15,
	},
	modalTitle: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "700",
	},
	modalContent: {
		padding: 20,
	},
	detailsSection: {
		marginBottom: 15,
	},
	detailLabel: {
		color: COLORS.textSecondary,
		fontSize: 14,
		marginBottom: 5,
	},
	detailValue: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "500",
	},
	codeContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	codeValue: {
		color: COLORS.neonPurple,
		fontSize: 16,
		fontWeight: "700",
		letterSpacing: 1,
	},
	copyButton: {
		marginLeft: 10,
		padding: 5,
	},
	subjectsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginTop: 5,
	},
	subjectBadge: {
		backgroundColor: `${COLORS.neonBlue}15`,
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 20,
		marginRight: 8,
		marginBottom: 8,
	},
	subjectText: {
		color: COLORS.neonBlue,
		fontSize: 13,
	},
	sectionDivider: {
		height: 1,
		backgroundColor: COLORS.cardBorder,
		marginVertical: 15,
	},
	sectionTitle: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 15,
	},
	assignmentItem: {
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		borderRadius: 10,
		padding: 15,
		marginBottom: 10,
	},
	assignmentHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	assignmentTitle: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "600",
		flex: 1,
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	statusText: {
		fontSize: 12,
		fontWeight: "600",
	},
	assignmentMeta: {
		flexDirection: "row",
		alignItems: "center",
	},
	assignmentDate: {
		color: COLORS.textSecondary,
		fontSize: 13,
		marginLeft: 5,
	},
	noContentText: {
		color: COLORS.textSecondary,
		fontStyle: "italic",
		textAlign: "center",
		marginBottom: 15,
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
		borderColor: COLORS.cardBorder,
		borderRadius: 8,
		color: COLORS.textPrimary,
		padding: 12,
		fontSize: 16,
		letterSpacing: 2,
		textAlign: "center",
	},
	invalidCodeInput: {
		borderColor: "#FF5252",
	},
	invalidCodeText: {
		color: "#FF5252",
		fontSize: 12,
		marginTop: 5,
		marginBottom: 15,
	},
	hintText: {
		color: COLORS.textSecondary,
		fontSize: 12,
		fontStyle: "italic",
		marginTop: 8,
		textAlign: "center",
	},
	joinButton: {
		backgroundColor: COLORS.neonBlue,
		borderRadius: 10,
		paddingVertical: 12,
		alignItems: "center",
		marginTop: 20,
	},
	joinButtonText: {
		color: COLORS.textPrimary,
		fontWeight: "600",
		fontSize: 16,
	},
});
