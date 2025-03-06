import React, { useState } from "react";
import {
	SafeAreaView,
	View,
	Text,
	StyleSheet,
	ScrollView,
	Image,
	TouchableOpacity,
	Modal,
	TextInput,
	FlatList,
	Dimensions,
	StatusBar,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const RoleplayResult = ({ navigation }) => {
	const [menuVisible, setMenuVisible] = useState(false);
	const [classModalVisible, setClassModalVisible] = useState(false);
	const [newClassName, setNewClassName] = useState("");
	const [resourcesExpanded, setResourcesExpanded] = useState(false);

	// Mock data for the student responses (unchanged)
	const responseData = [
		{
			id: "1",
			dialogue:
				"We are on track to meet the deadline for the project. All team members are working efficiently and communicating well to stay organized.",
			fluency: 88,
			pronunciation: 56,
			integrity: 86,
			accuracy: 83,
			overall: 78,
		},
		{
			id: "2",
			dialogue:
				"One challenge we encountered was unexpected changes in client requirements midway through the project. This required us to adjust our approach and timeline, but we were able to adapt smoothly.",
			fluency: 77,
			pronunciation: 65,
			integrity: 77,
			accuracy: 70,
			overall: 69,
		},
		{
			id: "3",
			dialogue:
				"We held a team meeting to discuss the new requirements and brainstormed solutions together. We prioritized tasks, delegated responsibilities effectively, and communicated proactively with the client to keep everyone updated on the progress. This helped us overcome the challenges and stay aligned towards project completion.",
			fluency: 50,
			pronunciation: 67,
			integrity: 40,
			accuracy: 66,
			overall: 50,
		},
	];

	const resourceItems = [
		{ id: "1", title: "Trending Now", route: "EffectiveCommunication" },
		{ id: "2", title: "Skill-Based Reading", route: "ClassroomCommunication" },
		{ id: "3", title: "Career Readiness", route: "InteractiveStrategies" },
		{ id: "4", title: "Money Management", route: "ProfessionalDevelopment" },
		{ id: "5", title: "Civic Awareness", route: "SubjectSpecific" },
		{ id: "6", title: "Wellness Resources", route: "FeedbackSkills" },
		{ id: "7", title: "Healthcare Insights", route: "ParentEngagement" },
		{ id: "8", title: "Tech Savvy", route: "CulturalSensitivity" },
		{ id: "9", title: "More Resources", route: "DigitalTeaching" },
	];

	const toggleSidebar = () => {
		setMenuVisible(!menuVisible);
	};

	const closeMenu = () => {
		setMenuVisible(false);
	};

	const renderResponseItem = ({ item }) => (
		<View style={styles.responseItem}>
			<Text style={styles.dialogueText} numberOfLines={3} ellipsizeMode="tail">
				{item.dialogue}
			</Text>
			<View style={styles.scoresContainer}>
				<ScoreItem label="Fluency" score={item.fluency} />
				<ScoreItem label="Pronunciation" score={item.pronunciation} />
				<ScoreItem label="Integrity" score={item.integrity} />
				<ScoreItem label="Accuracy" score={item.accuracy} />
				<ScoreItem label="Overall" score={item.overall} />
			</View>
		</View>
	);

	const ScoreItem = ({ label, score }) => {
		// Determine color based on score
		const getScoreColor = (score) => {
			if (score >= 80) return "#4CAF50"; // Green
			if (score >= 60) return "#FFC107"; // Yellow
			return "#F44336"; // Red
		};

		return (
			<View style={styles.scoreItem}>
				<Text style={styles.scoreLabel}>{label}</Text>
				<View
					style={[
						styles.scoreCircle,
						{ backgroundColor: getScoreColor(score) },
					]}
				>
					<Text style={styles.scoreValue}>{score}</Text>
				</View>
			</View>
		);
	};

	const renderResourceItem = ({ item }) => (
		<TouchableOpacity
			style={styles.resourceItem}
			onPress={() => navigation.navigate(item.route)}
		>
			<Text style={styles.resourceText}>{item.title}</Text>
		</TouchableOpacity>
	);

	const SideMenu = () => (
		<Modal
			animationType="slide"
			transparent={true}
			visible={menuVisible}
			onRequestClose={closeMenu}
		>
			<TouchableOpacity
				style={styles.modalOverlay}
				activeOpacity={1}
				onPress={closeMenu}
			>
				<View style={styles.sideMenuContainer}>
					<ScrollView
						style={styles.menuScroll}
						showsVerticalScrollIndicator={false}
					>
						<View style={styles.menuHeader}>
							<Image
								source={require("../../assets/icon.png")}
								style={styles.menuLogo}
							/>
							<TouchableOpacity
								onPress={closeMenu}
								style={styles.closeMenuButton}
							>
								<Ionicons name="close" size={24} color="#000" />
							</TouchableOpacity>
						</View>

						<View style={styles.menuSection}>
							<Text style={styles.menuCategory}>Dashboard</Text>

							<TouchableOpacity
								style={styles.menuItem}
								onPress={() => {
									navigation.navigate("ManageStudents");
									closeMenu();
								}}
							>
								<Text style={styles.menuText}>Grade 9 - A</Text>
							</TouchableOpacity>

							<TouchableOpacity style={styles.menuItem}>
								<Text style={styles.menuText}>Grade 9 - B</Text>
							</TouchableOpacity>
						</View>

						<TouchableOpacity
							style={styles.menuSection}
							onPress={() => navigation.navigate("Content")}
						>
							<Text style={styles.menuCategory}>My Resources</Text>
						</TouchableOpacity>

						<View style={styles.menuSection}>
							<TouchableOpacity
								onPress={() => setResourcesExpanded(!resourcesExpanded)}
							>
								<View style={styles.expandableHeader}>
									<Text style={styles.menuCategory}>
										Explore Teaching Resources
									</Text>
									<Ionicons
										name={resourcesExpanded ? "chevron-up" : "chevron-down"}
										size={18}
										color="#000"
									/>
								</View>
							</TouchableOpacity>

							{resourcesExpanded && (
								<View style={styles.expandedResources}>
									{resourceItems.map((item) => (
										<TouchableOpacity
											key={item.id}
											style={styles.resourceItem}
											onPress={() => {
												navigation.navigate(item.route);
												closeMenu();
											}}
										>
											<Text style={styles.resourceText}>{item.title}</Text>
										</TouchableOpacity>
									))}
								</View>
							)}
						</View>
					</ScrollView>

					<TouchableOpacity
						style={styles.profileContainer}
						onPress={() => {
							navigation.navigate("Profile");
							closeMenu();
						}}
					>
						<Image
							source={require("../../assets/icon.png")}
							style={styles.profileImage}
						/>
						<Text style={styles.profileName}>Allen Moreno</Text>
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		</Modal>
	);

	const AddClassModal = () => (
		<Modal
			animationType="fade"
			transparent={true}
			visible={classModalVisible}
			onRequestClose={() => setClassModalVisible(false)}
		>
			<View style={styles.modalCenteredView}>
				<View style={styles.modalView}>
					<TouchableOpacity
						style={styles.closeButton}
						onPress={() => setClassModalVisible(false)}
					>
						<Ionicons name="close" size={24} color="#000" />
					</TouchableOpacity>

					<View style={styles.userIconContainer}>
						<FontAwesome5 name="user" size={24} color="#fff" />
					</View>

					<Text style={styles.modalTitle}>Name Your class</Text>

					<TextInput
						style={styles.modalInput}
						placeholder="Enter Class Name"
						value={newClassName}
						onChangeText={setNewClassName}
					/>

					<TouchableOpacity
						style={styles.createButton}
						onPress={() => {
							// Logic to add new class
							setClassModalVisible(false);
							setNewClassName("");
						}}
					>
						<Text style={styles.createButtonText}>Create</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar backgroundColor="#fff" barStyle="dark-content" />

			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
					<Ionicons name="menu" size={24} color="#000" />
				</TouchableOpacity>

				<View style={styles.headerContent}>
					<View style={styles.navigationLinks}>
						<TouchableOpacity
							style={styles.backButton}
							onPress={() => navigation.goBack()}
						>
							<Ionicons name="chevron-back" size={24} color="#6c757d" />
						</TouchableOpacity>

						<Text style={styles.headerTitle}>Grade 9 - A</Text>

						<View style={styles.headerDivider} />

						<TouchableOpacity style={styles.backButton}>
							<Ionicons name="chevron-back" size={20} color="#6c757d" />
						</TouchableOpacity>

						<Text style={styles.headerSubtitle}>Assignments</Text>
					</View>
				</View>
			</View>

			{/* Main Content */}
			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.contentContainer}>
					<Text style={styles.sectionTitle}>Add</Text>

					<View style={styles.responseTable}>
						<FlatList
							data={responseData}
							renderItem={renderResponseItem}
							keyExtractor={(item) => item.id}
							scrollEnabled={false}
						/>
					</View>
				</View>
			</ScrollView>

			{/* Side Menu */}
			<SideMenu />

			{/* Add Class Modal */}
			<AddClassModal />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 15,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
		backgroundColor: "#fff",
		elevation: 2,
	},
	menuButton: {
		padding: 5,
	},
	headerContent: {
		flex: 1,
		marginLeft: 10,
	},
	navigationLinks: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
	},
	backButton: {
		padding: 5,
	},
	headerTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#000",
	},
	headerDivider: {
		width: 1,
		height: 20,
		backgroundColor: "#e0e0e0",
		marginHorizontal: 8,
	},
	headerSubtitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#000",
	},
	content: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	contentContainer: {
		padding: 15,
		paddingBottom: 30,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 15,
		color: "#000",
	},
	responseTable: {
		backgroundColor: "#fff",
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		overflow: "hidden",
	},
	responseItem: {
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	dialogueText: {
		fontSize: 14,
		lineHeight: 20,
		color: "#333",
		marginBottom: 12,
	},
	scoresContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		flexWrap: "wrap",
		marginTop: 5,
	},
	scoreItem: {
		alignItems: "center",
		marginVertical: 5,
		width: width / 5 - 15,
	},
	scoreLabel: {
		fontSize: 12,
		color: "#6c757d",
		marginBottom: 5,
		textAlign: "center",
	},
	scoreCircle: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		elevation: 2,
	},
	scoreValue: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 14,
	},
	// Side Menu Styles
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	sideMenuContainer: {
		width: "80%",
		backgroundColor: "#fff",
		height: "100%",
		shadowColor: "#000",
		shadowOffset: { width: 4, height: 0 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	menuScroll: {
		flex: 1,
		padding: 20,
	},
	menuHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 25,
		paddingBottom: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	closeMenuButton: {
		padding: 5,
	},
	menuLogo: {
		width: 100,
		height: 30,
		resizeMode: "contain",
	},
	menuSection: {
		marginBottom: 20,
	},
	menuCategory: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#000",
		marginBottom: 12,
	},
	menuItem: {
		paddingVertical: 12,
		paddingHorizontal: 5,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	menuText: {
		fontSize: 14,
		color: "#333",
	},
	expandableHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 5,
	},
	expandedResources: {
		backgroundColor: "#F4F5F7",
		borderRadius: 8,
		padding: 8,
		marginTop: 8,
	},
	resourceItem: {
		paddingVertical: 12,
		paddingHorizontal: 8,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0,0,0,0.05)",
	},
	resourceText: {
		fontSize: 14,
		color: "#333",
	},
	profileContainer: {
		flexDirection: "row",
		alignItems: "center",
		padding: 15,
		borderTopWidth: 1,
		borderTopColor: "#e0e0e0",
		backgroundColor: "#f9f9f9",
	},
	profileImage: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 12,
	},
	profileName: {
		fontSize: 15,
		fontWeight: "bold",
		color: "#000",
	},
	// Modal Styles
	modalCenteredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalView: {
		width: "85%",
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 25,
		paddingTop: 30,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	closeButton: {
		position: "absolute",
		top: 12,
		right: 12,
		padding: 5,
	},
	userIconContainer: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: "#4B49AC",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
		elevation: 3,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#333",
	},
	modalInput: {
		width: "100%",
		borderWidth: 1,
		borderColor: "#e0e0e0",
		borderRadius: 8,
		padding: 12,
		marginBottom: 25,
		fontSize: 16,
	},
	createButton: {
		backgroundColor: "#4B49AC",
		paddingVertical: 12,
		paddingHorizontal: 30,
		borderRadius: 8,
		elevation: 2,
	},
	createButtonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
});

export default RoleplayResult;
