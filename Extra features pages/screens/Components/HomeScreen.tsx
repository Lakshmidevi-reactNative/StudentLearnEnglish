import React, { useState, useCallback, useMemo, useRef } from "react";
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
	SafeAreaView,
	Platform,
	FlatList,
} from "react-native";
import { useTheme } from "../../App";
import {
	MaterialIcons,
	FontAwesome5,
	MaterialCommunityIcons,
	Ionicons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import {
	createDrawerNavigator,
	DrawerContentScrollView,
} from "@react-navigation/drawer";
import icon from "../assets/icon.png";
import ProfileScreen from "./ProfileScreen";
import QuickAction from "../CommonScreens/QuickAction";

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
				<TouchableOpacity onPress={toggleTheme}>
					<View style={styles.logoContainer}>
						<Text style={styles.logoTextLearn}>Learn</Text>
						<Text style={styles.logoTextEng}>eng</Text>
					</View>
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
				onPress={() => navigateToScreen("Premium")}
			>
				<MaterialCommunityIcons
					name="crown"
					size={24}
					color={isDarkMode ? "#FFD700" : "#4A90E2"}
				/>
				<Text style={[styles.drawerItemText, isDarkMode && { color: "#fff" }]}>
					Purchase
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
	const [studentLevel] = useState("Beginner");
	const { width } = useWindowDimensions();
	const scrollY = useRef(new Animated.Value(0)).current;

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
				title: "SpeakEng",
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
			{
				title: "PromptEng",
				icon: "library-books",
				color: "#FF6B6B",
				screen: "PromptEng",
			},
			{
				title: "TypeEng",
				icon: "spellcheck",
				color: "#FFBE0B",
				screen: "TypeEng",
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
		<SafeAreaView
			style={[
				styles.safeArea,
				{ backgroundColor: isDarkMode ? "#1a1a1a" : "#F8F9FA" },
			]}
		>
			{/* Sticky Header with fixed positioning */}
			<View
				style={[
					styles.headerTop,
					{
						backgroundColor: isDarkMode ? "#1a1a1a" : "#fff",
					},
				]}
			>
				<View style={styles.headerTopLeft}>
					<TouchableOpacity
						style={styles.menuButton}
						onPress={() => navigation.openDrawer()}
					>
						<MaterialIcons
							name="menu"
							size={24}
							color={isDarkMode ? "#fff" : "#0A2268"}
						/>
					</TouchableOpacity>
					<Text
						style={[styles.headernavTitle, isDarkMode && { color: "#fff" }]}
					>
						Learn <Text style={styles.highlight}>Eng</Text>
					</Text>
				</View>
				<View style={styles.headerTopRight}>
					<TouchableOpacity style={styles.notibutton}>
						<MaterialIcons
							name="notifications-none"
							size={24}
							color={isDarkMode ? "#fff" : "#0A2268"}
						/>
					</TouchableOpacity>
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

			<Animated.ScrollView
				style={[styles.container, isDarkMode && styles.darkContainer]}
				contentContainerStyle={styles.contentContainer}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: false }
				)}
				scrollEventThrottle={16}
			>
				{/* Header content with greeting and profile */}
				<View
					style={[
						styles.headerContent,
						isDarkMode && { backgroundColor: "#1F1F1F" },
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
								<Text style={[styles.name, isDarkMode && styles.darkGreeting]}>
									{studentName} !
								</Text>
							</View>
							<Text style={[styles.welcome, isDarkMode && styles.darkGreeting]}>
								Welcome to LearnEng
							</Text>
							<View style={styles.levelBadge}>
								<MaterialIcons name="school" size={24} color="#fff" />
								<Text style={styles.levelText}>{studentLevel}</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Continue Learning */}
				{/* <View
					style={[
						styles.continueLearningContainer,
						isDarkMode && styles.continueLearningContainerDark,
					]}
				>
					<View style={styles.ContinueLearning}>
						<Text
							style={[
								styles.continueLearningTitle,
								isDarkMode && { color: "#fff" },
							]}
						>
							Continue Learning
						</Text>
						<Text
							style={[
								styles.continueLearningSubtitle,
								isDarkMode && { color: "#faf6eb" },
							]}
						>
							Continue your Assessments
						</Text>
						<TouchableOpacity style={styles.continuelearningbutton}>
							<MaterialIcons name="play-arrow" size={24} color="white" />
						</TouchableOpacity>
					</View>
				</View> */}
				<View style={styles.quickActionsContainer}>
					<Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
						Quick Actions
					</Text>
					<View style={styles.carouselContainer}>
						<FlatList
							data={quickActions}
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.carouselContent}
							keyExtractor={(item, index) => index.toString()}
							snapToAlignment="start"
							decelerationRate="fast"
							snapToInterval={(width - 48) / 2.5}
							renderItem={({ item }) => (
								<View
									style={[styles.carouselItem, { width: (width - 64) / 2.5 }]}
								>
									<QuickAction
										title={item.title}
										icon={item.icon}
										color={item.color}
										isDarkMode={isDarkMode}
										onPress={() => navigation.navigate(item.screen)}
									/>
								</View>
							)}
						/>
					</View>
				</View>

				<View style={styles.progressContainer}>
					<Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
						Progress Overview
					</Text>
					<View style={[styles.progressCard, isDarkMode && styles.darkCard]}>
						{/* <View style={styles.streakSection}>
							<MaterialIcons
								name="local-fire-department"
								size={24}
								color="#FF6B6B"
							/>
							<Text style={[styles.streakText, isDarkMode && styles.darkText]}>
								{stats.streak} Day Streak!
							</Text>
						</View> */}

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

				{/* <View style={styles.skillsContainer}>
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
				</View> */}

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
							chartConfig={{
								backgroundColor: "transparent",
								backgroundGradientFrom: isDarkMode ? "#333" : "#f9f9f9",
								backgroundGradientTo: isDarkMode ? "#444" : "#ffffff",
								decimalPlaces: 1,
								color: (opacity = 1) =>
									isDarkMode
										? `rgba(255, 255, 255, ${opacity})`
										: `rgba(0, 0, 0, ${opacity})`,
								style: {
									borderRadius: 16,
								},
								propsForDots: {
									r: "6",
									strokeWidth: "2",
									stroke: isDarkMode ? "#333" : "#fff",
								},
							}}
							accessor="score"
							backgroundColor="transparent"
							paddingLeft="15"
							absolute
						/>
						<View style={styles.inputsContainer}>
							{pieChartData.map((input, index) => (
								<TextInput
									key={index}
									style={[
										styles.chartInput,
										isDarkMode && styles.darkInput,
										{ borderColor: input.color },
									]}
									value={typingInputs[index]}
									onChangeText={(text) => handleTypingInputChange(text, index)}
									keyboardType="numeric"
									placeholder={input.name}
									placeholderTextColor={isDarkMode ? "#A1A1AA" : "#9CA3AF"}
									maxLength={3}
								/>
							))}
						</View>
					</View>
				</View>

				{/* Add bottom padding to ensure content doesn't get hidden behind tab bar */}
				<View style={styles.bottomSpacing} />
			</Animated.ScrollView>
		</SafeAreaView>
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
const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	container: {
		flex: 1,
		backgroundColor: "#F8F9FA",
	},
	contentContainer: {
		paddingTop: 80, // Increased padding to account for fixed header
	},
	bottomSpacing: {
		height: 30, // Increased padding at bottom
	},
	darkContainer: {
		backgroundColor: "#1F1F1F",
	},
	headerTop: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 100,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingTop: Platform.OS === "ios" ? 48 : 36, // Increased for better spacing
		paddingBottom: 12,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
		elevation: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	headerTopRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
	headerTopLeft: {
		flexDirection: "row",
		alignItems: "center",
	},
	headerContent: {
		backgroundColor: "#fff",
		paddingVertical: 16,
		borderRadius: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 2,
		marginHorizontal: 16,
		marginTop: 28,
	},
	menuButton: {
		padding: 8,
	},
	headernavTitle: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#0A2268",
		marginLeft: 8,
	},
	highlight: {
		fontWeight: "bold",
		color: "#FF5722",
	},
	notibutton: {
		padding: 8,
	},
	logoContainer: {
		backgroundColor: "#032168",
		borderRadius: 10,
		padding: 10,
	},
	logoTextLearn: {
		fontSize: 12,
		color: "#C90F2A",
	},
	logoTextEng: {
		fontSize: 16,
		color: "#fff",
		marginTop: -8,
	},
	greetingContainer: {
		paddingHorizontal: 16,
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
		marginBottom: 4,
	},
	darkGreeting: {
		color: "#fff",
	},
	welcome: {
		fontSize: 16,
		color: "#4B5563",
		marginBottom: 8,
		marginLeft: 16,
	},
	greeting: {
		fontSize: 28,
		color: "#6B7280",
		fontWeight: "500",
		marginLeft: 16,
	},
	name: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#1F2937",
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
		marginLeft: 16,
		marginTop: 4,
	},
	levelText: {
		color: "white",
		marginLeft: 6,
		fontSize: 14,
		fontWeight: "600",
	},
	profileImage: {
		width: 40,
		height: 40,
		borderRadius: 20,
		borderWidth: 2,
		borderColor: "rgba(0,0,0,0.1)",
	},
	continueLearningContainer: {
		marginVertical: 16,
		marginHorizontal: 16,
		backgroundColor: "#fff",
		borderRadius: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		padding: 20,
		height: 100,
	},
	continueLearningContainerDark: {
		backgroundColor: "#2D3436",
	},
	ContinueLearning: {
		position: "relative",
		paddingRight: 50, // Space for the play button
	},
	continueLearningTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#2D3436",
		marginBottom: 8,
	},
	continueLearningSubtitle: {
		fontSize: 14,
		color: "#4B5563",
	},
	continuelearningbutton: {
		backgroundColor: "#4A90E2",
		padding: 12,
		borderRadius: 30,
		position: "absolute",
		right: 0,
		top: 10,
	},
	quickActionsContainer: {
		padding: 16,
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#2D3436",
		marginBottom: 16,
		marginLeft: 8,
	},
	carouselContainer: {
		width: "100%",
	},
	carouselContent: {
		paddingLeft: 8,
		paddingRight: 24,
		paddingVertical: 8,
	},
	carouselItem: {
		marginRight: 12,
	},
	actionCard: {
		flex: 1,
		backgroundColor: "white",
		borderRadius: 16,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
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
		padding: 16,
	},
	progressCard: {
		backgroundColor: "white",
		borderRadius: 16,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	streakSection: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
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
		padding: 16,
	},
	skillsCard: {
		backgroundColor: "white",
		borderRadius: 16,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
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
		padding: 16,
		alignItems: "center",
	},
	chartCard: {
		backgroundColor: "white",
		borderRadius: 16,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
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
	// Drawer styles
	drawer: {
		width: 300,
		backgroundColor: "#ffffff",
	},
	drawerContent: {
		flex: 1,
		padding: 24,
		backgroundColor: "#ffffff",
	},
	drawerHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 48,
		marginBottom: 32,
	},
	drawerTitle: {
		marginLeft: 12,
		fontSize: 24,
		fontWeight: "700",
		color: "#333333",
	},
	drawerItem: {
		height: 56,
		paddingHorizontal: 16,
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#F3F4F6",
	},
	drawerItemText: {
		marginLeft: 16,
		fontSize: 16,
		color: "#333333",
		fontWeight: "600",
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
