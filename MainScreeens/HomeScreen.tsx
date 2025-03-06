import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image,
	Dimensions,
	StatusBar,
	Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	MaterialCommunityIcons,
	FontAwesome5,
	Ionicons,
	MaterialIcons,
} from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS } from "./constants/Colors";
import LearningActivitiesCarousel from "./constants/LearningActivitiesCarousel";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
	// activeTab state is now handled by the tab navigator
	const [greeting, setGreeting] = useState("");
	const navigation = useNavigation();

	useEffect(() => {
		const hours = new Date().getHours();
		if (hours < 12) {
			setGreeting("Good morning");
		} else if (hours < 18) {
			setGreeting("Good afternoon");
		} else {
			setGreeting("Good evening");
		}
	}, []);

	const performanceData = {
		labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		datasets: [
			{
				data: [65, 72, 78, 75, 80, 85, 90],
				color: () => COLORS.neonBlue,
				strokeWidth: 2,
			},
		],
	};

	const skillData = {
		labels: ["Speaking", "Listening", "Reading", "Writing", "Vocab"],
		datasets: [
			{
				data: [70, 85, 65, 75, 80],
				color: () => COLORS.neonPurple,
				strokeWidth: 2,
			},
		],
	};

	const pieData = [
		{
			name: "Speed",
			population: 75,
			color: COLORS.neonBlue,
			legendFontColor: COLORS.textPrimary,
			legendFontSize: 12,
		},
		{
			name: "Accuracy",
			population: 82,
			color: COLORS.neonPurple,
			legendFontColor: COLORS.textPrimary,
			legendFontSize: 12,
		},
		{
			name: "Grammar",
			population: 68,
			color: COLORS.neonGreen,
			legendFontColor: COLORS.textPrimary,
			legendFontSize: 12,
		},
		{
			name: "Vocab",
			population: 73,
			color: COLORS.neonOrange,
			legendFontColor: COLORS.textPrimary,
			legendFontSize: 12,
		},
	];

	const chartConfig = {
		backgroundGradientFrom: "transparent",
		backgroundGradientTo: "transparent",
		decimalPlaces: 0,
		color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
		labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
		style: {
			borderRadius: 16,
		},
		propsForDots: {
			r: "6",
			strokeWidth: "2",
			stroke: COLORS.neonPurple,
		},
	};
	const onMenuPress = () => {
		// Using dispatch with DrawerActions is more reliable
		navigation.dispatch(DrawerActions.openDrawer());
	};

	return (
		<LinearGradient
			colors={[COLORS.deepBlue, COLORS.softPurple]}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			<StatusBar
				barStyle="light-content"
				translucent
				backgroundColor="transparent"
			/>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.header}>
					<TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
						<MaterialIcons
							name="menu"
							size={28}
							color={COLORS.textPrimary}
							style={styles.glowIcon}
						/>
					</TouchableOpacity>
					<View style={styles.headerCenter}>
						<Text style={styles.appTitle}>LearnEng</Text>
					</View>
					<TouchableOpacity
						style={styles.profileButton}
						onPress={() => navigation.navigate("Profile")}
					>
						<Image
							source={{
								uri: "https://api.a0.dev/assets/image?text=portrait%20photo%20of%20a%20young%20female%20student%20with%20a%20friendly%20smile&aspect=1:1&seed=123",
							}}
							style={styles.profileImage}
						/>
						<View style={styles.notificationBadge} />
					</TouchableOpacity>
				</View>
				<ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
					<Animated.View entering={FadeInDown.delay(100).duration(600)}>
						<View style={styles.userInfoSection}>
							<View>
								<Text style={styles.greeting}>{greeting},</Text>
								<Text style={styles.userName}>Sarah</Text>
							</View>
							<View style={styles.levelBadge}>
								<Text style={styles.levelText}>Beginner</Text>
							</View>
						</View>
					</Animated.View>

					<Animated.View entering={FadeInDown.delay(200).duration(600)}>
						<View style={styles.featuredCard}>
							<LinearGradient
								colors={["rgba(176, 38, 255, 0.2)", "rgba(0, 180, 255, 0.2)"]}
								style={styles.featuredGradient}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
							>
								<View style={styles.featuredContent}>
									<View style={styles.featuredTextContainer}>
										<Text style={styles.featuredTitle}>Daily Challenge</Text>
										<Text style={styles.featuredSubtitle}>
											Complete today's learning goal and earn bonus points
										</Text>
										<TouchableOpacity style={styles.featuredButton}>
											<Text style={styles.featuredButtonText}>Start Now</Text>
										</TouchableOpacity>
									</View>
									<View style={styles.featuredImageContainer}>
										<Image
											source={{
												uri: "https://api.a0.dev/assets/image?text=glowing%20holographic%20english%20language%20learning%20icon&aspect=1:1&seed=456",
											}}
											style={styles.featuredImage}
										/>
									</View>
								</View>
							</LinearGradient>
						</View>
					</Animated.View>

					<Animated.View entering={FadeInDown.delay(300).duration(600)}>
						<Text style={styles.sectionTitle}>Learning Activities</Text>

						{/* Replace the grid view with the new carousel component */}
						<LearningActivitiesCarousel />
					</Animated.View>

					<Animated.View entering={FadeInDown.delay(400).duration(600)}>
						<Text style={styles.sectionTitle}>Weekly Performance</Text>
						<View style={styles.chartCard}>
							<LineChart
								data={performanceData}
								width={width - 40}
								height={180}
								chartConfig={chartConfig}
								bezier
								style={styles.chart}
							/>
						</View>
					</Animated.View>

					<Animated.View entering={FadeInDown.delay(500).duration(600)}>
						<Text style={styles.sectionTitle}>Skill Breakdown</Text>
						<View style={styles.chartCard}>
							<BarChart
								data={skillData}
								width={width - 40}
								height={220}
								chartConfig={chartConfig}
								style={styles.chart}
								yAxisSuffix="%"
								fromZero
							/>
						</View>
					</Animated.View>

					<Animated.View entering={FadeInDown.delay(600).duration(600)}>
						<Text style={styles.sectionTitle}>Typing Performance</Text>
						<View style={styles.chartCard}>
							<PieChart
								data={pieData}
								width={width - 40}
								height={200}
								chartConfig={chartConfig}
								accessor="population"
								backgroundColor="transparent"
								paddingLeft="15"
								absolute
								style={styles.chart}
							/>
						</View>
					</Animated.View>

					<Animated.View entering={FadeInDown.delay(700).duration(600)}>
						<Text style={styles.sectionTitle}>Recommended Lessons</Text>

						<View style={styles.recommendedCard}>
							<Image
								source={{
									uri: "https://api.a0.dev/assets/image?text=english%20language%20conversation%20practice%20scene&aspect=16:9&seed=789",
								}}
								style={styles.recommendedImage}
							/>
							<View style={styles.recommendedContent}>
								<Text style={styles.recommendedTitle}>
									Essential Conversations
								</Text>
								<Text style={styles.recommendedSubtitle}>
									Learn everyday English phrases and expressions
								</Text>
								<View style={styles.recommendedMeta}>
									<MaterialCommunityIcons
										name="clock-outline"
										size={14}
										color={COLORS.textSecondary}
									/>
									<Text style={styles.recommendedMetaText}>15 min lesson</Text>
								</View>
							</View>
						</View>

						<View style={styles.recommendedCard}>
							<Image
								source={{
									uri: "https://api.a0.dev/assets/image?text=english%20language%20vocabulary%20practice&aspect=16:9&seed=790",
								}}
								style={styles.recommendedImage}
							/>
							<View style={styles.recommendedContent}>
								<Text style={styles.recommendedTitle}>Vocabulary Builder</Text>
								<Text style={styles.recommendedSubtitle}>
									Expand your word knowledge with interactive exercises
								</Text>
								<View style={styles.recommendedMeta}>
									<MaterialCommunityIcons
										name="clock-outline"
										size={14}
										color={COLORS.textSecondary}
									/>
									<Text style={styles.recommendedMetaText}>10 min lesson</Text>
								</View>
							</View>
						</View>
					</Animated.View>

					{/* Extra space at bottom for navigation bar */}
					<View style={{ height: 100 }} />
				</ScrollView>
				{/* Navigation bar has been moved to AnimatedTabBar component */}
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
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: Platform.OS === "ios" ? 10 : 40,
		paddingBottom: 15,
	},
	menuButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		justifyContent: "center",
		alignItems: "center",
	},
	headerCenter: {
		alignItems: "center",
	},
	appTitle: {
		color: COLORS.textPrimary,
		fontSize: 22,
		fontWeight: "700",
		letterSpacing: 1,
		textShadowColor: COLORS.neonBlue,
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 10,
	},
	userInfoSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	greeting: {
		color: COLORS.textSecondary,
		fontSize: 16,
		fontWeight: "500",
	},
	userName: {
		color: COLORS.textPrimary,
		fontSize: 24,
		fontWeight: "700",
	},
	levelBadge: {
		backgroundColor: "rgba(57, 255, 20, 0.2)",
		paddingHorizontal: 15,
		paddingVertical: 5,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "rgba(57, 255, 20, 0.5)",
	},
	levelText: {
		color: COLORS.neonGreen,
		fontWeight: "600",
	},
	profileButton: {
		position: "relative",
	},
	profileImage: {
		width: 42,
		height: 42,
		borderRadius: 21,
		borderWidth: 2,
		borderColor: COLORS.neonPurple,
	},
	notificationBadge: {
		position: "absolute",
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: COLORS.neonBlue,
		top: 0,
		right: 0,
		borderWidth: 1,
		borderColor: COLORS.deepBlue,
	},
	content: {
		paddingHorizontal: 20,
	},
	featuredCard: {
		marginVertical: 15,
		borderRadius: 20,
		overflow: "hidden",
	},
	featuredGradient: {
		borderRadius: 20,
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
	},
	featuredContent: {
		flexDirection: "row",
		padding: 20,
	},
	featuredTextContainer: {
		flex: 3,
		justifyContent: "center",
	},
	featuredTitle: {
		color: COLORS.textPrimary,
		fontSize: 22,
		fontWeight: "700",
		marginBottom: 8,
	},
	featuredSubtitle: {
		color: COLORS.textSecondary,
		fontSize: 14,
		marginBottom: 15,
		lineHeight: 20,
	},
	featuredButton: {
		backgroundColor: COLORS.neonBlue,
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 30,
		alignSelf: "flex-start",
		shadowColor: COLORS.neonBlue,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
	},
	featuredButtonText: {
		color: COLORS.textPrimary,
		fontWeight: "600",
		fontSize: 14,
	},
	featuredImageContainer: {
		flex: 2,
		alignItems: "flex-end",
		justifyContent: "center",
	},
	featuredImage: {
		width: 100,
		height: 100,
		borderRadius: 20,
	},
	sectionTitle: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "700",
		marginTop: 25,
		marginBottom: 15,
	},
	chartCard: {
		backgroundColor: COLORS.cardBg,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
		padding: 10,
		marginBottom: 10,
		alignItems: "center",
	},
	chart: {
		borderRadius: 16,
		marginVertical: 8,
	},
	recommendedCard: {
		backgroundColor: COLORS.cardBg,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
		overflow: "hidden",
		marginBottom: 20,
	},
	recommendedImage: {
		width: "100%",
		height: 150,
	},
	recommendedContent: {
		padding: 15,
	},
	recommendedTitle: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 6,
	},
	recommendedSubtitle: {
		color: COLORS.textSecondary,
		fontSize: 14,
		marginBottom: 10,
		lineHeight: 20,
	},
	recommendedMeta: {
		flexDirection: "row",
		alignItems: "center",
	},
	recommendedMetaText: {
		color: COLORS.textSecondary,
		fontSize: 12,
		marginLeft: 5,
	},
	glowIcon: {
		textShadowColor: COLORS.neonBlue,
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 10,
	},
});
