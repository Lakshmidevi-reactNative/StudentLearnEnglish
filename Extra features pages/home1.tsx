import React, { useState, useCallback, useMemo } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Image,
	TouchableOpacity,
	useWindowDimensions,
	TextInput,
	Switch,
	Animated,
} from "react-native";
import { useTheme } from "../App";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import {
	createDrawerNavigator,
	DrawerContentScrollView,
} from "@react-navigation/drawer";
import icon from "../assets/icon.png";
import ProfileScreen from "./ProfileScreen";
import QuickAction from "../screens/CommonScreens/QuickAction";

// Create a drawer navigator
const Drawer = createDrawerNavigator();

// Custom Drawer Content Component
const CustomDrawerContent = ({ navigation }) => {
	const { isDarkMode, toggleTheme } = useTheme();

	const navigateToScreen = useCallback(
		(screenName) => {
			navigation.navigate(screenName);
			navigation.closeDrawer();
		},
		[navigation]
	);

	return (
		<View
			style={[
				styles.drawerContent,
				isDarkMode && { backgroundColor: "#1a1a1a" },
			]}
		>
			<View style={styles.drawerHeader}>
				<TouchableOpacity onPress={toggleTheme} style={styles.darkModeButton}>
					<Image
						source={icon}
						style={{
							width: 45,
							height: 45,
							backgroundColor: "#012269",
							alignItems: "center",
							justifyContent: "center",
						}}
					/>
				</TouchableOpacity>
				<Text style={[styles.drawerTitle, isDarkMode && { color: "#fff" }]}>
					LearnEng
				</Text>
			</View>

			<TouchableOpacity
				style={[
					styles.drawerItem,
					isDarkMode && { backgroundColor: "#333", borderColor: "#444" },
				]}
				onPress={() => navigateToScreen("Learn")}
			>
				<MaterialIcons
					name="school"
					size={24}
					color={isDarkMode ? "#FFD700" : "#4A90E2"}
				/>
				<Text style={[styles.drawerItemText, isDarkMode && { color: "#fff" }]}>
					Learn & Practice
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[
					styles.drawerItem,
					isDarkMode && { backgroundColor: "#333", borderColor: "#444" },
				]}
				onPress={() => navigateToScreen("Classes")}
			>
				<MaterialIcons
					name="class"
					size={24}
					color={isDarkMode ? "#FFD700" : "#4A90E2"}
				/>
				<Text style={[styles.drawerItemText, isDarkMode && { color: "#fff" }]}>
					My Classes
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[
					styles.drawerItem,
					isDarkMode && { backgroundColor: "#333", borderColor: "#444" },
				]}
			>
				<MaterialIcons
					name="brightness-6"
					size={24}
					color={isDarkMode ? "#FFD700" : "#4A90E2"}
				/>

				<Text
					style={[
						styles.drawerItemText,
						{ flex: 1 },
						isDarkMode && { color: "#fff" },
					]}
				>
					Dark Mode
				</Text>
				<Switch
					value={isDarkMode}
					onValueChange={toggleTheme}
					trackColor={{ false: "#767577", true: "#4A90E2" }}
					thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
				/>
			</TouchableOpacity>
		</View>
	);
};

// Main component wrapper with drawer
function HomeScreenWrapper() {
	const { isDarkMode } = useTheme();

	const drawerStyle = useMemo(
		() => [styles.drawer, isDarkMode && { backgroundColor: "#1a1a1a" }],
		[isDarkMode]
	);

	return (
		<Drawer.Navigator
			drawerContent={(props) => <CustomDrawerContent {...props} />}
			screenOptions={{
				headerShown: false,
				drawerStyle: drawerStyle,
				drawerType: "front",
				overlayColor: "rgba(0,0,0,0.5)",
			}}
		>
			<Drawer.Screen name="HomeContent" component={HomeScreenContent} />
			<Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
		</Drawer.Navigator>
	);
}

// Actual HomeScreen content
function HomeScreenContent({ navigation }) {
	const { isDarkMode } = useTheme();
	const [studentName] = useState("Sarah");
	const [studentLevel] = useState("B2");
	const { width } = useWindowDimensions();
	const scrollY = new Animated.Value(0);

	// Chart input states
	const [roleInputs, setRoleInputs] = useState(["85", "65", "75", "90", "80"]);
	const [practiceInputs, setPracticeInputs] = useState([
		"60",
		"75",
		"40",
		"85",
		"70",
	]);
	const [typingInputs, setTypingInputs] = useState([
		"75",
		"80",
		"60",
		"90",
		"40",
	]);

	const currentHour = new Date().getHours();
	const getGreeting = useCallback(() => {
		if (currentHour < 12) return "Good Morning";
		if (currentHour < 18) return "Good Afternoon";
		return "Good Evening";
	}, [currentHour]);

	const stats = useMemo(
		() => ({
			streak: 15,
			assignments: {
				completed: 42,
				total: 48,
			},
			assessments: {
				completed: 20,
				total: 24,
			},
			skills: {
				speaking: 80,
				listening: 85,
				reading: 75,
				writing: 90,
			},
		}),
		[]
	);

	const quickActions = useMemo(
		() => [
			{
				title: "ListenEng",
				icon: "headset",
				color: "#4A90E2",
				screen: "ListenEng",
			},
			{
				title: "SpeakingEng",
				icon: "mic",
				color: "#4ECDC4",
				screen: "SpeakEng",
			},
			{
				title: "ReadEng",
				icon: "menu-book",
				color: "#A776F0",
				screen: "ReadEng",
			},
			{
				title: "WriteEng",
				icon: "create",
				color: "#074799",
				screen: "WriteEng",
			},
		],
		[]
	);

	const handleRoleInputChange = useCallback((text, index) => {
		setRoleInputs((prevInputs) => {
			const newInputs = [...prevInputs];
			newInputs[index] = text;
			return newInputs;
		});
	}, []);

	const handlePracticeInputChange = useCallback((text, index) => {
		setPracticeInputs((prevInputs) => {
			const newInputs = [...prevInputs];
			newInputs[index] = text;
			return newInputs;
		});
	}, []);

	const handleTypingInputChange = useCallback((text, index) => {
		setTypingInputs((prevInputs) => {
			const newInputs = [...prevInputs];
			newInputs[index] = text;
			return newInputs;
		});
	}, []);

	const chartConfig = useMemo(
		() => ({
			backgroundGradientFrom: isDarkMode ? "#2D3436" : "#ffffff",
			backgroundGradientTo: isDarkMode ? "#2D3436" : "#ffffff",
			color: (opacity = 1) =>
				isDarkMode
					? `rgba(255, 255, 255, ${opacity})`
					: `rgba(65, 105, 225, ${opacity})`,
			strokeWidth: 2,
			barPercentage: 0.6,
			decimalPlaces: 0,
		}),
		[isDarkMode]
	);

	const lineChartData = useMemo(
		() => ({
			labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
			datasets: [
				{
					data: roleInputs.map((val) => parseInt(val) || 0),
					color: (opacity = 1) => `rgba(65, 105, 225, ${opacity})`,
					strokeWidth: 2,
				},
			],
			legend: ["Performance %"],
		}),
		[roleInputs]
	);

	const barChartData = useMemo(
		() => ({
			labels: ["Speaking", "Listening", "Reading", "Writing", "Vocab"],
			datasets: [
				{
					data: practiceInputs.map((val) => parseInt(val) || 0),
				},
			],
		}),
		[practiceInputs]
	);

	const pieChartData = useMemo(
		() =>
			typingInputs.map((value, index) => {
				const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFBE0B"];
				const labels = ["Speed", "Accuracy", "Grammar", "Vocabulary", "Style"];
				return {
					name: labels[index],
					score: parseInt(value) || 0,
					color: colors[index],
					legendFontColor: isDarkMode ? "#FFFFFF" : "#2D3436",
					legendFontSize: 12,
				};
			}),
		[typingInputs, isDarkMode]
	);

	return (
		<>
			{/* Sticky Header */}
			<Animated.View
				style={[
					styles.headerTop,
					{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						zIndex: 100,
						backgroundColor: isDarkMode ? "#1a1a1a" : "#fff",
					},
				]}
			>
				<TouchableOpacity
					style={styles.menuButton}
					onPress={() => navigation.openDrawer()}
				>
					<MaterialIcons
						name="menu"
						size={28}
						color={isDarkMode ? "#fff" : "#0A2268"}
					/>
				</TouchableOpacity>
				<Text style={[styles.headernavTitle, isDarkMode && { color: "#fff" }]}>
					Learn <Text style={styles.highlight}>Eng</Text>
				</Text>
				<TouchableOpacity style={styles.notibutton}>
					<MaterialIcons
						name="notifications"
						size={26}
						color={isDarkMode ? "#fff" : "#0A2268"}
					/>
				</TouchableOpacity>
			</Animated.View>

			<Animated.ScrollView
				style={[styles.container, isDarkMode && styles.darkContainer]}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: false }
				)}
				scrollEventThrottle={16}
			>
				{/* Content with padding to account for fixed header */}
				<View style={{ paddingTop: 60 }}>
					{/* Header content with greeting and profile */}
					<View
						style={[
							styles.headerContent,
							isDarkMode && { backgroundColor: "#2D3436" },
						]}
					>
						<View style={styles.greetingContainer}>
							<View style={styles.greetingContent}>
								<View style={styles.goodname}>
									<Text
										style={[styles.greeting, isDarkMode && styles.darkGreeting]}
									>
										{getGreeting()}
									</Text>
									<Text
										style={[styles.name, isDarkMode && styles.darkGreeting]}
									>
										{studentName}
									</Text>
								</View>
								<View style={styles.goodname}>
									<Text
										style={[styles.welcome, isDarkMode && styles.darkGreeting]}
									>
										Welcome to LearnEng
									</Text>
								</View>
								<View style={styles.levelBadge}>
									<MaterialIcons name="school" size={16} color="#fff" />
									<Text style={styles.levelText}>{studentLevel}</Text>
								</View>
							</View>
							<TouchableOpacity
								onPress={() => navigation.navigate("ProfileScreen")}
							>
								<Image
									source={{
										uri: "https://api.a0.dev/assets/image?text=professional%20headshot%20portrait&aspect=1:1",
									}}
									style={styles.profileImage}
								/>
							</TouchableOpacity>
						</View>
					</View>

					{/* Continue Learning */}
					<View
						style={[
							styles.continueLearningContainer,
							isDarkMode && styles.continueLearningContainerDark,
						]}
					>
						<TouchableOpacity style={styles.ContinueLearning}>
							<Text
								style={[
									{ fontSize: 20, fontWeight: "bold", color: "#2D3436" },
									isDarkMode && { color: "#fff" },
								]}
							>
								Continue Learning
							</Text>
							<Text
								style={[
									{ fontSize: 12, fontWeight: "bold", color: "#2D3436" },
									isDarkMode && { color: "#faf6eb" },
								]}
							>
								Continue your Assessments
							</Text>
							<TouchableOpacity style={styles.continuelearningbutton}>
								<MaterialIcons name="play-arrow" size={28} color="white" />
							</TouchableOpacity>
						</TouchableOpacity>
					</View>

					<View style={styles.progressContainer}>
						<Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
							Progress Overview
						</Text>
						<View style={[styles.progressCard, isDarkMode && styles.darkCard]}>
							<View style={styles.streakSection}>
								<MaterialIcons
									name="local-fire-department"
									size={24}
									color="#FF6B6B"
								/>
								<Text
									style={[styles.streakText, isDarkMode && styles.darkText]}
								>
									{stats.streak} Day Streak!
								</Text>
							</View>

							<View style={styles.progressGrid}>
								<View style={styles.progressItem}>
									<CircularProgress
										value={
											(stats.assignments.completed / stats.assignments.total) *
											100
										}
										color="#4ECDC4"
										label="Assignments"
										isDarkMode={isDarkMode}
									/>
								</View>
								<View style={styles.progressItem}>
									<CircularProgress
										value={
											(stats.assessments.completed / stats.assessments.total) *
											100
										}
										color="#FF6B6B"
										label="Assessments"
										isDarkMode={isDarkMode}
									/>
								</View>
							</View>
						</View>
					</View>

					<View style={styles.skillsContainer}>
						<Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
							Language Skills
						</Text>
						<View style={[styles.skillsCard, isDarkMode && styles.darkCard]}>
							{Object.entries(stats.skills).map(([skill, value], index) => (
								<View key={index} style={styles.skillRow}>
									<View style={styles.skillLabelContainer}>
										<Text
											style={[styles.skillLabel, isDarkMode && styles.darkText]}
										>
											{skill.charAt(0).toUpperCase() + skill.slice(1)}
										</Text>
										<Text
											style={[styles.skillValue, isDarkMode && styles.darkText]}
										>
											{value}%
										</Text>
									</View>
									<View style={styles.skillBarContainer}>
										<View
											style={[
												styles.skillBar,
												{
													width: `${value}%`,
													backgroundColor: getSkillColor(skill),
												},
											]}
										/>
									</View>
								</View>
							))}
						</View>
					</View>

					<View style={styles.chartContainer}>
						<Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
							Role Performance
						</Text>
						<View style={[styles.chartCard, isDarkMode && styles.darkCard]}>
							<LineChart
								data={lineChartData}
								width={width - 60}
								height={220}
								chartConfig={chartConfig}
								bezier
								style={{
									borderRadius: 16,
								}}
							/>
							<View style={styles.inputsContainer}>
								{roleInputs.map((input, index) => (
									<TextInput
										key={index}
										style={[styles.chartInput, isDarkMode && styles.darkInput]}
										value={input}
										onChangeText={(text) => handleRoleInputChange(text, index)}
										keyboardType="numeric"
										placeholder={`Week ${index + 1}`}
										placeholderTextColor={isDarkMode ? "#A1A1AA" : "#9CA3AF"}
										maxLength={3}
									/>
								))}
							</View>
						</View>
					</View>

					<View style={styles.chartContainer}>
						<Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
							Language Practice Metrics
						</Text>
						<View style={[styles.chartCard, isDarkMode && styles.darkCard]}>
							<BarChart
								data={barChartData}
								width={width - 60}
								height={220}
								chartConfig={{
									...chartConfig,
									color: (opacity = 1) =>
										isDarkMode
											? `rgba(255, 255, 255, ${opacity})`
											: `rgba(65, 105, 225, ${opacity})`,
								}}
								style={{
									borderRadius: 16,
								}}
								fromZero
							/>
							<View style={styles.inputsContainer}>
								{practiceInputs.map((input, index) => (
									<TextInput
										key={index}
										style={[styles.chartInput, isDarkMode && styles.darkInput]}
										value={input}
										onChangeText={(text) =>
											handlePracticeInputChange(text, index)
										}
										keyboardType="numeric"
										placeholder={barChartData.labels[index]}
										placeholderTextColor={isDarkMode ? "#A1A1AA" : "#9CA3AF"}
										maxLength={3}
									/>
								))}
							</View>
						</View>
					</View>

					<View style={styles.chartContainer}>
						<Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
							Typing Assessment Analytics
						</Text>
						<View style={[styles.chartCard, isDarkMode && styles.darkCard]}>
							<PieChart
								data={pieChartData}
								width={width - 48}
								height={220}
								chartConfig={chartConfig}
								accessor="score"
								backgroundColor="transparent"
								paddingLeft="15"
								absolute
							/>
							<View style={styles.inputsContainer}>
								{typingInputs.map((input, index) => (
									<TextInput
										key={index}
										style={[styles.chartInput, isDarkMode && styles.darkInput]}
										value={input}
										onChangeText={(text) =>
											handleTypingInputChange(text, index)
										}
										keyboardType="numeric"
										placeholder={pieChartData[index].name}
										placeholderTextColor={isDarkMode ? "#A1A1AA" : "#9CA3AF"}
										maxLength={3}
									/>
								))}
							</View>
						</View>
					</View>

					<View style={styles.quickActionsContainer}>
						<Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
							Quick Actions
						</Text>
						<View style={styles.quickActionsGrid}>
							{quickActions.map((action, index) => (
								<QuickAction
									key={index}
									title={action.title}
									icon={action.icon}
									color={action.color}
									isDarkMode={isDarkMode}
									onPress={() => navigation.navigate(action.screen)}
								/>
							))}
						</View>
					</View>
				</View>
			</Animated.ScrollView>
		</>
	);
}

const CircularProgress = ({ value, color, label, isDarkMode }) => (
	<View style={styles.circularProgress}>
		<View style={[styles.progressCircle, { borderColor: color }]}>
			<Text style={[styles.progressValue, isDarkMode && styles.darkText]}>
				{Math.round(value)}%
			</Text>
		</View>
		<Text style={[styles.progressLabel, isDarkMode && styles.darkText]}>
			{label}
		</Text>
	</View>
);

const getSkillColor = (skill) => {
	const colors = {
		speaking: "#FF6B6B",
		listening: "#4ECDC4",
		reading: "#45B7D1",
		writing: "#96CEB4",
	};
	return colors[skill];
};

// Export the wrapper as the main component
export default HomeScreenWrapper;

// Extended styles including drawer styles from App.tsx
const styles = StyleSheet.create({
	container: {
		paddingTop: 60,
		flex: 1,
		backgroundColor: "#F8F9FA",
	},
	darkContainer: {
		backgroundColor: "#1F1F1F",
	},
	headerTop: {
		paddingTop: 46,
		paddingVertical: 16,

		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		// height: 60,
		paddingHorizontal: 16,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	headerContent: {
		marginHorizontal: 20,
		backgroundColor: "#fff",
		paddingBottom: 16,
		borderRadius: 10,
		shadowColor: "#000",
	},
	menuButton: {
		padding: 8,
	},
	headernavTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#0A2268",
	},
	highlight: {
		fontWeight: "bold",
		color: "#FF5722",
	},
	notibutton: {
		padding: 8,
	},
	greetingContainer: {
		paddingHorizontal: 20,
		paddingTop: 16,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	greetingContent: {
		flex: 1,
	},
	goodname: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		marginBottom: 4,
	},
	darkGreeting: {
		color: "#fff",
	},
	welcome: {
		fontSize: 16,
		color: "grey",
		marginVertical: 8,
	},
	greeting: {
		fontSize: 20,
		color: "grey",
		fontWeight: "500",
	},
	name: {
		fontSize: 20,
		fontWeight: "bold",
		color: "black",
		marginLeft: 8,
	},
	levelBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#0A2268",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
		alignSelf: "flex-start",
		marginTop: 10,
	},
	levelText: {
		color: "white",
		marginLeft: 6,
		fontSize: 14,
		fontWeight: "600",
	},
	profileImage: {
		width: 56,
		height: 56,
		borderRadius: 28,
		borderWidth: 2,
		borderColor: "rgba(0,0,0,0.1)",
	},
	continueLearningContainer: {
		paddingTop: 24,
		margin: 20,
		backgroundColor: "#fff",
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
		height: 100,
	},
	continueLearningContainerDark: {
		backgroundColor: "#2D3436",
		color: "#fff",
	},
	continuelearningbutton: {
		backgroundColor: "grey",
		padding: 8,
		borderRadius: 50,
		position: "absolute",
		right: 0,
	},
	ContinueLearning: {
		marginHorizontal: 20,
		gap: 10,
	},
	quickActionsContainer: {
		padding: 24,
		paddingBottom: 12,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#2D3436",
		marginBottom: 16,
	},
	quickActionsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 16,
	},
	actionCard: {
		flex: 1,
		minWidth: "45%",
		backgroundColor: "white",
		borderRadius: 16,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
	},
	actionGradient: {
		padding: 16,
		alignItems: "center",
		height: 120,
		justifyContent: "center",
	},
	iconContainer: {
		width: 56,
		height: 56,
		borderRadius: 28,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 12,
	},
	actionTitle: {
		fontSize: 15,
		fontWeight: "600",
		color: "#2D3436",
		textAlign: "center",
	},
	progressContainer: {
		padding: 24,
		paddingTop: 12,
		paddingBottom: 12,
	},
	progressCard: {
		backgroundColor: "white",
		borderRadius: 16,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
	},
	streakSection: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 24,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#F3F4F6",
	},
	streakText: {
		marginLeft: 10,
		fontSize: 16,
		fontWeight: "600",
		color: "#2D3436",
	},
	progressGrid: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	progressItem: {
		alignItems: "center",
	},
	circularProgress: {
		alignItems: "center",
	},
	progressCircle: {
		width: 86,
		height: 86,
		borderRadius: 43,
		borderWidth: 8,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
	},
	progressValue: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2D3436",
	},
	progressLabel: {
		fontSize: 14,
		color: "#4B5563",
		fontWeight: "500",
	},
	skillsContainer: {
		padding: 24,
		paddingTop: 12,
		paddingBottom: 12,
	},
	skillsCard: {
		backgroundColor: "white",
		borderRadius: 16,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
	},
	skillRow: {
		marginBottom: 16,
	},
	skillLabelContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	skillLabel: {
		fontSize: 14,
		color: "#4B5563",
		fontWeight: "500",
	},
	skillValue: {
		fontSize: 14,
		color: "#2D3436",
		fontWeight: "600",
	},
	skillBarContainer: {
		height: 8,
		backgroundColor: "#F3F4F6",
		borderRadius: 4,
		overflow: "hidden",
	},
	skillBar: {
		height: "100%",
		borderRadius: 4,
	},
	chartContainer: {
		padding: 24,
		paddingTop: 16,
		paddingBottom: 16,
		alignItems: "center",
	},
	chartCard: {
		backgroundColor: "white",
		borderRadius: 16,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
		alignItems: "center",
		width: "100%",
	},
	inputsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		width: "100%",
		marginTop: 16,
		paddingHorizontal: 4,
	},
	chartInput: {
		backgroundColor: "#F3F4F6",
		borderRadius: 8,
		padding: 8,
		marginBottom: 12,
		width: "18%",
		textAlign: "center",
		color: "#2D3436",
		fontSize: 14,
	},
	darkCard: {
		backgroundColor: "#2D3436",
	},
	darkText: {
		color: "#FFFFFF",
	},
	darkInput: {
		backgroundColor: "#3F3F46",
		color: "#FFFFFF",
	},
	// Drawer styles from App.tsx
	drawer: {
		width: 300,
		backgroundColor: "#ffffff",
	},
	drawerContent: {
		flex: 1,
		paddingHorizontal: 24,
		padding: 24,
		backgroundColor: "#ffffff",
	},
	drawerHeader: {
		flexDirection: "row",
		marginTop: 50,
		marginBottom: 35,
	},
	drawerTitle: {
		marginTop: 10,
		marginLeft: 10,
		fontSize: 24,
		fontWeight: "700",
		color: "#333333",
		letterSpacing: 0.5,
	},
	darkModeButton: {
		padding: 10,
		height: 50,
		width: 50,
		borderRadius: 5,
		backgroundColor: "#1B3978",
		alignItems: "center",
		justifyContent: "center",
	},
	drawerItem: {
		height: 60,
		paddingLeft: 8,
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 16,
		marginBottom: 8,
		borderRadius: 12,
		backgroundColor: "#ffffff",
		borderWidth: 1,
		borderColor: "#ffffff",
	},
	drawerItemText: {
		marginLeft: 16,
		fontSize: 16,
		color: "#333333",
		fontWeight: "600",
		letterSpacing: 0.3,
	},
	tabBar: {
		backgroundColor: "#ffffff",
		borderTopWidth: 1,
		borderTopColor: "#e0e0e0",
		height: 65,
		paddingBottom: 8,
		elevation: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
	},
	tabBarDark: {
		backgroundColor: "#000000",
		borderTopColor: "#000000",
	},
	tabBarLabel: {
		fontSize: 12,
		fontWeight: "600",
		marginTop: -2,
		letterSpacing: 0.2,
	},
});
