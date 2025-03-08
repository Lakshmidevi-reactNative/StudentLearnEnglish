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
import {
	useNavigation,
	DrawerActions,
	NavigationProp,
} from "@react-navigation/native";
import { RootStackParamList } from "../types"; // Adjust the import path as necessary
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTheme } from "./constants/ThemeContext";
import LearningActivitiesCarousel from "./constants/LearningActivitiesCarousel";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
	// activeTab state is now handled by the tab navigator
	const [greeting, setGreeting] = useState("");
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const { colors, theme } = useTheme();

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
				color: () => colors.neonBlue,
				strokeWidth: 2,
			},
		],
	};

	const skillData = {
		labels: ["Speaking", "Listening", "Reading", "Writing", "Vocab"],
		datasets: [
			{
				data: [70, 85, 65, 75, 80],
				color: () => colors.neonPurple,
				strokeWidth: 2,
			},
		],
	};

	const pieData = [
		{
			name: "Speed",
			population: 75,
			color: colors.neonBlue,
			legendFontColor: colors.textPrimary,
			legendFontSize: 12,
		},
		{
			name: "Accuracy",
			population: 82,
			color: colors.neonPurple,
			legendFontColor: colors.textPrimary,
			legendFontSize: 12,
		},
		{
			name: "Grammar",
			population: 68,
			color: colors.neonGreen,
			legendFontColor: colors.textPrimary,
			legendFontSize: 12,
		},
		{
			name: "Vocab",
			population: 73,
			color: colors.neonOrange,
			legendFontColor: colors.textPrimary,
			legendFontSize: 12,
		},
	];

	const chartConfig = {
		backgroundGradientFrom: "transparent",
		backgroundGradientTo: "transparent",
		decimalPlaces: 0,
		color: (opacity = 1) =>
			theme === "dark"
				? `rgba(255, 255, 255, ${opacity})`
				: `rgba(0, 0, 0, ${opacity})`,
		labelColor: (opacity = 1) => colors.textPrimary,
		style: {
			borderRadius: 16,
		},
		propsForDots: {
			r: "6",
			strokeWidth: "2",
			stroke: colors.neonPurple,
		},
	};

	const onMenuPress = () => {
		// Using dispatch with DrawerActions is more reliable
		navigation.dispatch(DrawerActions.openDrawer());
	};

	return (
		<LinearGradient
			colors={[colors.deepBlue, colors.softPurple]}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			<StatusBar
				barStyle={theme === "dark" ? "light-content" : "dark-content"}
				translucent
				backgroundColor="transparent"
			/>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.header}>
					<TouchableOpacity
						onPress={onMenuPress}
						style={[
							styles.menuButton,
							{
								backgroundColor:
									theme === "dark"
										? "rgba(255, 255, 255, 0.1)"
										: "rgba(0, 0, 0, 0.05)",
							},
						]}
					>
						<MaterialIcons
							name="menu"
							size={28}
							color={colors.textPrimary}
							style={[styles.glowIcon, { textShadowColor: colors.neonBlue }]}
						/>
					</TouchableOpacity>
					<View style={styles.headerCenter}>
						<Text
							style={[
								styles.appTitle,
								{ color: colors.textPrimary, textShadowColor: colors.neonBlue },
							]}
						>
							LearnEng
						</Text>
					</View>
					<TouchableOpacity
						style={styles.profileButton}
						onPress={() => navigation.navigate("Profile")}
					>
						<Image
							source={{
								uri: "https://api.a0.dev/assets/image?text=portrait%20photo%20of%20a%20young%20female%20student%20with%20a%20friendly%20smile&aspect=1:1&seed=123",
							}}
							style={[styles.profileImage, { borderColor: colors.neonPurple }]}
						/>
						<View
							style={[
								styles.notificationBadge,
								{
									backgroundColor: colors.neonBlue,
									borderColor: colors.deepBlue,
								},
							]}
						/>
					</TouchableOpacity>
				</View>
				<ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
					<Animated.View entering={FadeInDown.delay(100).duration(600)}>
						<View style={styles.userInfoSection}>
							<View>
								<Text
									style={[styles.greeting, { color: colors.textSecondary }]}
								>
									{greeting},
								</Text>
								<Text style={[styles.userName, { color: colors.textPrimary }]}>
									Sarah
								</Text>
							</View>
							<View
								style={[
									styles.levelBadge,
									{
										backgroundColor:
											theme === "dark"
												? "rgba(57, 255, 20, 0.2)"
												: "rgba(57, 255, 20, 0.1)",
										borderColor:
											theme === "dark"
												? "rgba(57, 255, 20, 0.5)"
												: "rgba(57, 255, 20, 0.3)",
									},
								]}
							>
								<Text style={[styles.levelText, { color: colors.neonGreen }]}>
									Beginner
								</Text>
							</View>
						</View>
					</Animated.View>

					<Animated.View entering={FadeInDown.delay(200).duration(600)}>
						<View style={styles.featuredCard}>
							<LinearGradient
								colors={
									theme === "dark"
										? ["rgba(176, 38, 255, 0.2)", "rgba(0, 180, 255, 0.2)"]
										: ["rgba(176, 38, 255, 0.1)", "rgba(0, 133, 204, 0.1)"]
								}
								style={[
									styles.featuredGradient,
									{ borderColor: colors.cardBorder },
								]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
							>
								<View style={styles.featuredContent}>
									<View style={styles.featuredTextContainer}>
										<Text
											style={[
												styles.featuredTitle,
												{ color: colors.textPrimary },
											]}
										>
											Daily Challenge
										</Text>
										<Text
											style={[
												styles.featuredSubtitle,
												{ color: colors.textSecondary },
											]}
										>
											Complete today's learning goal and earn bonus points
										</Text>
										<TouchableOpacity
											style={[
												styles.featuredButton,
												{
													backgroundColor: colors.neonBlue,
													shadowColor: colors.neonBlue,
												},
											]}
										>
											<Text
												style={[
													styles.featuredButtonText,
													{ color: theme === "dark" ? "#FFFFFF" : "#FFFFFF" },
												]}
											>
												Start Now
											</Text>
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
						<Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
							Learning Activities
						</Text>

						{/* Pass theme to the carousel if needed */}
						<LearningActivitiesCarousel />
					</Animated.View>

					<Animated.View entering={FadeInDown.delay(400).duration(600)}>
						<Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
							Weekly Performance
						</Text>
						<View
							style={[
								styles.chartCard,
								{
									backgroundColor: colors.cardBg,
									borderColor: colors.cardBorder,
								},
							]}
						>
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
						<Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
							Skill Breakdown
						</Text>
						<View
							style={[
								styles.chartCard,
								{
									backgroundColor: colors.cardBg,
									borderColor: colors.cardBorder,
								},
							]}
						>
							<BarChart
								data={skillData}
								width={width - 40}
								height={220}
								chartConfig={chartConfig}
								style={styles.chart}
								yAxisSuffix="%"
								yAxisLabel=""
								fromZero
							/>
						</View>
					</Animated.View>

					<Animated.View entering={FadeInDown.delay(600).duration(600)}>
						<Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
							Typing Performance
						</Text>
						<View
							style={[
								styles.chartCard,
								{
									backgroundColor: colors.cardBg,
									borderColor: colors.cardBorder,
								},
							]}
						>
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
						<Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
							Recommended Lessons
						</Text>

						<View
							style={[
								styles.recommendedCard,
								{
									backgroundColor: colors.cardBg,
									borderColor: colors.cardBorder,
								},
							]}
						>
							<Image
								source={{
									uri: "https://api.a0.dev/assets/image?text=english%20language%20conversation%20practice%20scene&aspect=16:9&seed=789",
								}}
								style={styles.recommendedImage}
							/>
							<View style={styles.recommendedContent}>
								<Text
									style={[
										styles.recommendedTitle,
										{ color: colors.textPrimary },
									]}
								>
									Essential Conversations
								</Text>
								<Text
									style={[
										styles.recommendedSubtitle,
										{ color: colors.textSecondary },
									]}
								>
									Learn everyday English phrases and expressions
								</Text>
								<View style={styles.recommendedMeta}>
									<MaterialCommunityIcons
										name="clock-outline"
										size={14}
										color={colors.textSecondary}
									/>
									<Text
										style={[
											styles.recommendedMetaText,
											{ color: colors.textSecondary },
										]}
									>
										15 min lesson
									</Text>
								</View>
							</View>
						</View>

						<View
							style={[
								styles.recommendedCard,
								{
									backgroundColor: colors.cardBg,
									borderColor: colors.cardBorder,
								},
							]}
						>
							<Image
								source={{
									uri: "https://api.a0.dev/assets/image?text=english%20language%20vocabulary%20practice&aspect=16:9&seed=790",
								}}
								style={styles.recommendedImage}
							/>
							<View style={styles.recommendedContent}>
								<Text
									style={[
										styles.recommendedTitle,
										{ color: colors.textPrimary },
									]}
								>
									Vocabulary Builder
								</Text>
								<Text
									style={[
										styles.recommendedSubtitle,
										{ color: colors.textSecondary },
									]}
								>
									Expand your word knowledge with interactive exercises
								</Text>
								<View style={styles.recommendedMeta}>
									<MaterialCommunityIcons
										name="clock-outline"
										size={14}
										color={colors.textSecondary}
									/>
									<Text
										style={[
											styles.recommendedMetaText,
											{ color: colors.textSecondary },
										]}
									>
										10 min lesson
									</Text>
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
		justifyContent: "center",
		alignItems: "center",
	},
	headerCenter: {
		alignItems: "center",
	},
	appTitle: {
		fontSize: 22,
		fontWeight: "700",
		letterSpacing: 1,
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
		fontSize: 16,
		fontWeight: "500",
	},
	userName: {
		fontSize: 24,
		fontWeight: "700",
	},
	levelBadge: {
		paddingHorizontal: 15,
		paddingVertical: 5,
		borderRadius: 20,
		borderWidth: 1,
	},
	levelText: {
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
	},
	notificationBadge: {
		position: "absolute",
		width: 10,
		height: 10,
		borderRadius: 5,
		top: 0,
		right: 0,
		borderWidth: 1,
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
		fontSize: 22,
		fontWeight: "700",
		marginBottom: 8,
	},
	featuredSubtitle: {
		fontSize: 14,
		marginBottom: 15,
		lineHeight: 20,
	},
	featuredButton: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 30,
		alignSelf: "flex-start",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
	},
	featuredButtonText: {
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
		fontSize: 18,
		fontWeight: "700",
		marginTop: 25,
		marginBottom: 15,
	},
	chartCard: {
		borderRadius: 16,
		borderWidth: 1,
		padding: 10,
		marginBottom: 10,
		alignItems: "center",
	},
	chart: {
		borderRadius: 16,
		marginVertical: 8,
	},
	recommendedCard: {
		borderRadius: 16,
		borderWidth: 1,
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
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 6,
	},
	recommendedSubtitle: {
		fontSize: 14,
		marginBottom: 10,
		lineHeight: 20,
	},
	recommendedMeta: {
		flexDirection: "row",
		alignItems: "center",
	},
	recommendedMetaText: {
		fontSize: 12,
		marginLeft: 5,
	},
	glowIcon: {
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 10,
	},
});
