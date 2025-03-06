import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image,
	Platform,
	Dimensions,
	StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	MaterialCommunityIcons,
	FontAwesome5,
	Ionicons,
} from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS } from "./constants/Colors";

const { width, height } = Dimensions.get("window");

export default function ResourceDetailScreen() {
	const navigation = useNavigation();
	const route = useRoute<RouteProp<any, string>>();
	const { category, resource } = route.params || {
		category: null,
		resource: null,
	};
	const [isFavorite, setIsFavorite] = useState(false);
	const [currentTab, setCurrentTab] = useState("overview");

	const goBack = () => {
		navigation.goBack();
	};

	const toggleFavorite = () => {
		setIsFavorite(!isFavorite);
	};

	// Example content for the resource
	const resourceContent = {
		overview: `This ${resource.title} resource is designed to help you improve your English ${category.id} skills. It provides comprehensive materials for learners at all levels, from beginners to advanced.

The content is structured to make learning engaging and effective. Each section builds upon previous knowledge, ensuring a smooth learning progression.

Key features of this resource include:
• Carefully curated content by language experts
• Interactive exercises to reinforce learning
• Progress tracking to monitor your improvement
• Downloadable materials for offline study`,

		examples: [
			{
				title: "Beginner Example",
				content:
					"This simple example demonstrates basic concepts and vocabulary that are perfect for beginners.",
				difficulty: "Beginner",
			},
			{
				title: "Intermediate Example",
				content:
					"This example introduces more complex structures and vocabulary for intermediate learners.",
				difficulty: "Intermediate",
			},
			{
				title: "Advanced Example",
				content:
					"This challenging example uses sophisticated language patterns and vocabulary for advanced learners.",
				difficulty: "Advanced",
			},
		],

		exercises: [
			{
				title: "Practice Exercise 1",
				instructions:
					"Complete the following activities to reinforce your understanding of the material.",
				completed: true,
			},
			{
				title: "Practice Exercise 2",
				instructions: "Apply what you've learned in these practical scenarios.",
				completed: false,
			},
			{
				title: "Practice Exercise 3",
				instructions: "Test your mastery with these challenging activities.",
				completed: false,
			},
		],
	};

	const renderTabContent = () => {
		switch (currentTab) {
			case "overview":
				return (
					<Animated.View entering={FadeInDown.duration(400)}>
						<Text style={styles.contentText}>{resourceContent.overview}</Text>
					</Animated.View>
				);

			case "examples":
				return (
					<Animated.View entering={FadeInDown.duration(400)}>
						{resourceContent.examples.map((example, index) => (
							<View key={index} style={styles.exampleCard}>
								<View style={styles.exampleHeader}>
									<Text style={styles.exampleTitle}>{example.title}</Text>
									<View
										style={[
											styles.difficultyBadge,
											{
												backgroundColor:
													example.difficulty === "Beginner"
														? `${COLORS.neonGreen}20`
														: example.difficulty === "Intermediate"
														? `${COLORS.neonBlue}20`
														: `${COLORS.neonPurple}20`,
											},
										]}
									>
										<Text
											style={[
												styles.difficultyText,
												{
													color:
														example.difficulty === "Beginner"
															? COLORS.neonGreen
															: example.difficulty === "Intermediate"
															? COLORS.neonBlue
															: COLORS.neonPurple,
												},
											]}
										>
											{example.difficulty}
										</Text>
									</View>
								</View>
								<Text style={styles.exampleContent}>{example.content}</Text>
								<TouchableOpacity style={styles.practiceButton}>
									<Text style={styles.practiceButtonText}>Practice Now</Text>
								</TouchableOpacity>
							</View>
						))}
					</Animated.View>
				);

			case "exercises":
				return (
					<Animated.View entering={FadeInDown.duration(400)}>
						{resourceContent.exercises.map((exercise, index) => (
							<View key={index} style={styles.exerciseCard}>
								<View style={styles.exerciseHeader}>
									<View style={styles.exerciseTitleContainer}>
										<Text style={styles.exerciseTitle}>{exercise.title}</Text>
										{exercise.completed && (
											<View style={styles.completedBadge}>
												<Text style={styles.completedText}>Completed</Text>
												<Ionicons
													name="checkmark-circle"
													size={16}
													color={COLORS.neonGreen}
												/>
											</View>
										)}
									</View>
								</View>
								<Text style={styles.exerciseInstructions}>
									{exercise.instructions}
								</Text>
								<TouchableOpacity
									style={[
										styles.startExerciseButton,
										exercise.completed ? styles.reviewExerciseButton : {},
									]}
								>
									<Text style={styles.startExerciseButtonText}>
										{exercise.completed ? "Review Again" : "Start Exercise"}
									</Text>
								</TouchableOpacity>
							</View>
						))}
					</Animated.View>
				);

			default:
				return null;
		}
	};

	if (!category || !resource) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>Resource not found</Text>
				<TouchableOpacity onPress={goBack} style={styles.errorButton}>
					<Text style={styles.errorButtonText}>Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

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
					<TouchableOpacity onPress={goBack} style={styles.backButton}>
						<MaterialCommunityIcons
							name="arrow-left"
							size={28}
							color={COLORS.textPrimary}
						/>
					</TouchableOpacity>
					<Text style={styles.headerTitle}>{resource.title}</Text>
					<TouchableOpacity
						onPress={toggleFavorite}
						style={styles.favoriteButton}
					>
						<MaterialCommunityIcons
							name={isFavorite ? "heart" : "heart-outline"}
							size={28}
							color={isFavorite ? COLORS.neonPink : COLORS.textPrimary}
						/>
					</TouchableOpacity>
				</View>

				<ScrollView
					showsVerticalScrollIndicator={false}
					style={styles.scrollView}
				>
					<Animated.View entering={FadeInDown.delay(100).duration(600)}>
						<View style={styles.resourceBanner}>
							<Image
								source={{
									uri: `https://api.a0.dev/assets/image?text=${resource.title}%20english%20learning%20resource&aspect=16:9&seed=${resource.imageSeed}`,
								}}
								style={styles.bannerImage}
							/>
							<LinearGradient
								colors={["transparent", "rgba(11, 16, 51, 0.9)"]}
								style={styles.bannerGradient}
								start={{ x: 0, y: 0 }}
								end={{ x: 0, y: 1 }}
							>
								<View style={styles.bannerContent}>
									<View
										style={[
											styles.categoryBadge,
											{
												backgroundColor: `${category.color}20`,
												borderColor: `${category.color}50`,
											},
										]}
									>
										<FontAwesome5
											name={category.icon}
											size={14}
											color={category.color}
											style={{ marginRight: 6 }}
										/>
										<Text
											style={[styles.categoryText, { color: category.color }]}
										>
											{category.title}
										</Text>
									</View>
								</View>
							</LinearGradient>
						</View>
					</Animated.View>

					<Animated.View entering={FadeInDown.delay(200).duration(600)}>
						<View style={styles.resourceInfo}>
							<Text style={styles.resourceTitle}>{resource.title}</Text>
							<Text style={styles.resourceDescription}>
								{resource.description}
							</Text>

							<View style={styles.statsContainer}>
								<View style={styles.statItem}>
									<MaterialCommunityIcons
										name="eye"
										size={20}
										color={COLORS.textSecondary}
									/>
									<Text style={styles.statValue}>1.2k</Text>
									<Text style={styles.statLabel}>Views</Text>
								</View>
								<View style={styles.statDivider} />
								<View style={styles.statItem}>
									<MaterialCommunityIcons
										name="heart"
										size={20}
										color={COLORS.textSecondary}
									/>
									<Text style={styles.statValue}>326</Text>
									<Text style={styles.statLabel}>Likes</Text>
								</View>
								<View style={styles.statDivider} />
								<View style={styles.statItem}>
									<MaterialCommunityIcons
										name="share"
										size={20}
										color={COLORS.textSecondary}
									/>
									<Text style={styles.statValue}>84</Text>
									<Text style={styles.statLabel}>Shares</Text>
								</View>
							</View>
						</View>
					</Animated.View>

					<View style={styles.tabsContainer}>
						<TouchableOpacity
							style={[
								styles.tabButton,
								currentTab === "overview" ? styles.activeTabButton : {},
							]}
							onPress={() => setCurrentTab("overview")}
						>
							<Text
								style={[
									styles.tabText,
									currentTab === "overview" ? styles.activeTabText : {},
								]}
							>
								Overview
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.tabButton,
								currentTab === "examples" ? styles.activeTabButton : {},
							]}
							onPress={() => setCurrentTab("examples")}
						>
							<Text
								style={[
									styles.tabText,
									currentTab === "examples" ? styles.activeTabText : {},
								]}
							>
								Examples
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.tabButton,
								currentTab === "exercises" ? styles.activeTabButton : {},
							]}
							onPress={() => setCurrentTab("exercises")}
						>
							<Text
								style={[
									styles.tabText,
									currentTab === "exercises" ? styles.activeTabText : {},
								]}
							>
								Exercises
							</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.tabContent}>{renderTabContent()}</View>

					{/* Extra space at bottom for navigation bar */}
					<View style={{ height: 100 }} />
				</ScrollView>
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
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		justifyContent: "center",
		alignItems: "center",
	},
	headerTitle: {
		color: COLORS.textPrimary,
		fontSize: 20,
		fontWeight: "700",
		textShadowColor: COLORS.neonBlue,
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 10,
	},
	favoriteButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		justifyContent: "center",
		alignItems: "center",
	},
	scrollView: {
		flex: 1,
	},
	resourceBanner: {
		height: 200,
		position: "relative",
	},
	bannerImage: {
		width: "100%",
		height: "100%",
	},
	bannerGradient: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: "50%",
		justifyContent: "flex-end",
		padding: 15,
	},
	bannerContent: {
		flexDirection: "row",
		justifyContent: "flex-start",
	},
	categoryBadge: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
		borderWidth: 1,
	},
	categoryText: {
		fontSize: 12,
		fontWeight: "600",
	},
	resourceInfo: {
		padding: 20,
	},
	resourceTitle: {
		color: COLORS.textPrimary,
		fontSize: 24,
		fontWeight: "700",
		marginBottom: 8,
	},
	resourceDescription: {
		color: COLORS.textSecondary,
		fontSize: 16,
		marginBottom: 20,
		lineHeight: 24,
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		backgroundColor: COLORS.cardBg,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
		padding: 15,
	},
	statItem: {
		alignItems: "center",
		flex: 1,
	},
	statValue: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "700",
		marginTop: 4,
	},
	statLabel: {
		color: COLORS.textSecondary,
		fontSize: 12,
		marginTop: 2,
	},
	statDivider: {
		width: 1,
		backgroundColor: COLORS.cardBorder,
		height: "100%",
	},
	tabsContainer: {
		flexDirection: "row",
		marginHorizontal: 20,
		marginTop: 10,
		marginBottom: 20,
		borderRadius: 10,
		backgroundColor: COLORS.cardBg,
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
		padding: 5,
	},
	tabButton: {
		flex: 1,
		paddingVertical: 12,
		alignItems: "center",
		borderRadius: 8,
	},
	activeTabButton: {
		backgroundColor: "rgba(255, 255, 255, 0.1)",
	},
	tabText: {
		color: COLORS.textSecondary,
		fontSize: 14,
		fontWeight: "600",
	},
	activeTabText: {
		color: COLORS.textPrimary,
	},
	tabContent: {
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
	contentText: {
		color: COLORS.textSecondary,
		fontSize: 16,
		lineHeight: 24,
	},
	exampleCard: {
		backgroundColor: COLORS.cardBg,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
		padding: 15,
		marginBottom: 15,
	},
	exampleHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	exampleTitle: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "600",
	},
	difficultyBadge: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
	},
	difficultyText: {
		fontSize: 12,
		fontWeight: "600",
	},
	exampleContent: {
		color: COLORS.textSecondary,
		fontSize: 15,
		lineHeight: 22,
		marginBottom: 15,
	},
	practiceButton: {
		backgroundColor: COLORS.neonBlue,
		borderRadius: 8,
		paddingVertical: 10,
		alignItems: "center",
	},
	practiceButtonText: {
		color: COLORS.textPrimary,
		fontWeight: "600",
	},
	exerciseCard: {
		backgroundColor: COLORS.cardBg,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
		padding: 15,
		marginBottom: 15,
	},
	exerciseHeader: {
		marginBottom: 10,
	},
	exerciseTitleContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	exerciseTitle: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "600",
	},
	completedBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: `${COLORS.neonGreen}15`,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	completedText: {
		color: COLORS.neonGreen,
		fontSize: 12,
		fontWeight: "600",
		marginRight: 4,
	},
	exerciseInstructions: {
		color: COLORS.textSecondary,
		fontSize: 15,
		lineHeight: 22,
		marginBottom: 15,
	},
	startExerciseButton: {
		backgroundColor: COLORS.neonPurple,
		borderRadius: 8,
		paddingVertical: 10,
		alignItems: "center",
	},
	reviewExerciseButton: {
		backgroundColor: `${COLORS.neonGreen}80`,
	},
	startExerciseButtonText: {
		color: COLORS.textPrimary,
		fontWeight: "600",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: COLORS.deepBlue,
		padding: 20,
	},
	errorText: {
		color: COLORS.textPrimary,
		fontSize: 18,
		marginBottom: 20,
	},
	errorButton: {
		backgroundColor: COLORS.neonBlue,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 8,
	},
	errorButtonText: {
		color: COLORS.textPrimary,
		fontWeight: "600",
	},
});
