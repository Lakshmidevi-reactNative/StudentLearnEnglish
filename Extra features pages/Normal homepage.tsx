import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Image,
	TouchableOpacity,
	useWindowDimensions,
	TextInput,
} from "react-native";
import { useTheme } from "../App";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { ProgressCircle } from "react-native-svg-charts";

export default function HomeScreen({ navigation }) {
	const { isDarkMode } = useTheme();
	const [studentName] = useState("Sarah");
	const [studentLevel] = useState("B2");
	const { width } = useWindowDimensions();

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
	const getGreeting = () => {
		if (currentHour < 12) return "Good Morning";
		if (currentHour < 18) return "Good Afternoon";
		return "Good Evening";
	};

	const stats = {
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
	};

	const quickActions = [
		{
			title: "ListenEng",
			icon: "headset",
			color: "#FF6B6B",
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
			color: "#45B7D1",
			screen: "ReadEng",
		},
		{
			title: "WriteEng",
			icon: "create",
			color: "#96CEB4",
			screen: "WriteEng",
		},
	];

	const handleRoleInputChange = (text, index) => {
		const newInputs = [...roleInputs];
		newInputs[index] = text;
		setRoleInputs(newInputs);
	};

	const handlePracticeInputChange = (text, index) => {
		const newInputs = [...practiceInputs];
		newInputs[index] = text;
		setPracticeInputs(newInputs);
	};

	const handleTypingInputChange = (text, index) => {
		const newInputs = [...typingInputs];
		newInputs[index] = text;
		setTypingInputs(newInputs);
	};

	const chartConfig = {
		backgroundGradientFrom: isDarkMode ? "#2D3436" : "#ffffff",
		backgroundGradientTo: isDarkMode ? "#2D3436" : "#ffffff",
		color: (opacity = 1) =>
			isDarkMode
				? `rgba(255, 255, 255, ${opacity})`
				: `rgba(255, 107, 107, ${opacity})`,
		strokeWidth: 2,
		barPercentage: 0.6,
		decimalPlaces: 0,
	};

	const lineChartData = {
		labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
		datasets: [
			{
				data: roleInputs.map((val) => parseInt(val) || 0),
				color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
				strokeWidth: 2,
			},
		],
		legend: ["Performance %"],
	};

	const barChartData = {
		labels: ["Speaking", "Listening", "Reading", "Writing", "Vocab"],
		datasets: [
			{
				data: practiceInputs.map((val) => parseInt(val) || 0),
			},
		],
	};

	const pieChartData = typingInputs.map((value, index) => {
		const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFBE0B"];
		const labels = ["Speed", "Accuracy", "Grammar", "Vocabulary", "Style"];
		return {
			name: labels[index],
			score: parseInt(value) || 0,
			color: colors[index],
			legendFontColor: isDarkMode ? "#FFFFFF" : "#2D3436",
			legendFontSize: 12,
		};
	});

	return (
		<ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
			<LinearGradient
				colors={isDarkMode ? ["#2D3436", "#1F1F1F"] : ["#FF6B6B", "#FF8787"]}
				style={styles.header}
			>
				<View style={styles.headerTop}>
					<TouchableOpacity
						style={styles.menuButton}
						onPress={() => navigation.openDrawer()}
					>
						<MaterialIcons name="menu" size={28} color="white" />
					</TouchableOpacity>
				</View>

				<View style={styles.greetingContainer}>
					<View style={styles.greetingContent}>
						<Text style={styles.greeting}>{getGreeting()}</Text>
						<Text style={styles.name}>{studentName}</Text>
						<View style={styles.levelBadge}>
							<MaterialIcons name="school" size={16} color="#FFE0E0" />
							<Text style={styles.levelText}>{studentLevel}</Text>
						</View>
					</View>
					<Image
						source={{
							uri: "https://api.a0.dev/assets/image?text=professional%20headshot%20portrait&aspect=1:1",
						}}
						style={styles.profileImage}
					/>
				</View>
			</LinearGradient>

			<View style={styles.quickActionsContainer}>
				<Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
					Quick Actions
				</Text>
				<View style={styles.quickActionsGrid}>
					{quickActions.map((action, index) => (
						<TouchableOpacity
							key={index}
							style={[styles.actionCard, isDarkMode && styles.darkCard]}
							onPress={() => navigation.navigate(action.screen)}
						>
							<LinearGradient
								colors={[`${action.color}15`, `${action.color}05`]}
								style={styles.actionGradient}
							>
								<View
									style={[
										styles.iconContainer,
										{ backgroundColor: `${action.color}30` },
									]}
								>
									<MaterialIcons
										name={action.icon}
										size={24}
										color={action.color}
									/>
								</View>
								<Text
									style={[styles.actionTitle, isDarkMode && styles.darkText]}
								>
									{action.title}
								</Text>
							</LinearGradient>
						</TouchableOpacity>
					))}
				</View>
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
						<Text style={[styles.streakText, isDarkMode && styles.darkText]}>
							{stats.streak} Day Streak!
						</Text>
					</View>

					<View style={styles.progressGrid}>
						<View style={styles.progressItem}>
							<CircularProgress
								value={90}
								color="#4ECDC4"
								label="Assignments"
								isDarkMode={isDarkMode}
							/>
						</View>
						<View style={styles.progressItem}>
							<CircularProgress
								value={
									(stats.assessments.completed / stats.assessments.total) * 100
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
									: `rgba(255, 107, 107, ${opacity})`,
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
								onChangeText={(text) => handlePracticeInputChange(text, index)}
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
								onChangeText={(text) => handleTypingInputChange(text, index)}
								keyboardType="numeric"
								placeholder={pieChartData[index].name}
								placeholderTextColor={isDarkMode ? "#A1A1AA" : "#9CA3AF"}
								maxLength={3}
							/>
						))}
					</View>
				</View>
			</View>
		</ScrollView>
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8F9FA",
	},
	darkContainer: {
		backgroundColor: "#1F1F1F",
	},
	header: {
		padding: 24,
		paddingTop: 60,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
		marginBottom: 8,
	},
	headerTop: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	menuButton: {
		padding: 10,
		borderRadius: 12,
		backgroundColor: "rgba(255,255,255,0.2)",
	},
	greetingContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	greetingContent: {
		flex: 1,
	},
	greeting: {
		fontSize: 28,
		color: "rgba(255,255,255,0.9)",
		fontWeight: "500",
	},
	name: {
		fontSize: 26,
		fontWeight: "bold",
		color: "white",
		marginTop: 4,
	},
	levelBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255,255,255,0.15)",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
		alignSelf: "flex-start",
		marginTop: 12,
	},
	levelText: {
		color: "white",
		marginLeft: 6,
		fontSize: 14,
		fontWeight: "600",
	},
	profileImage: {
		width: 70,
		height: 70,
		borderRadius: 35,
		borderWidth: 3,
		borderColor: "rgba(255,255,255,0.4)",
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
});
