import React, { useState, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	ScrollView,
	Dimensions,
	Animated,
	StatusBar,
	Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	MaterialCommunityIcons,
	FontAwesome5,
	Ionicons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "./constants/Colors";

const { width, height } = Dimensions.get("window");

export default function ResourcesScreen() {
	const navigation = useNavigation();
	const scrollY = useRef(new Animated.Value(0)).current;
	const [activeCategory, setActiveCategory] = useState("all");

	// Header animation values
	const headerHeight = 150;
	const headerFade = scrollY.interpolate({
		inputRange: [0, headerHeight],
		outputRange: [1, 0],
		extrapolate: "clamp",
	});

	const stickyHeaderOpacity = scrollY.interpolate({
		inputRange: [headerHeight - 20, headerHeight],
		outputRange: [0, 1],
		extrapolate: "clamp",
	});

	// Resource categories with visual attributes
	const categories = [
		{
			id: "all",
			title: "All Resources",
			icon: "apps",
			color: COLORS.neonBlue,
		},
		{
			id: "listening",
			title: "Listening",
			icon: "headset",
			color: COLORS.neonBlue,
		},
		{
			id: "speaking",
			title: "Speaking",
			icon: "microphone",
			color: COLORS.neonPurple,
		},
		{
			id: "reading",
			title: "Reading",
			icon: "book-open",
			color: COLORS.neonGreen,
		},
		{
			id: "writing",
			title: "Writing",
			icon: "pencil-alt",
			color: COLORS.neonOrange,
		},
		{
			id: "vocabulary",
			title: "Vocabulary",
			icon: "language",
			color: COLORS.neonPink,
		},
	];

	// Resource data
	const resources = [
		{
			id: 1,
			title: "Essential Conversations",
			description:
				"Improve your speaking skills with these common conversational phrases",
			category: "speaking",
			imageSeed: 301,
			difficulty: "Beginner",
		},
		{
			id: 2,
			title: "Business English Guide",
			description:
				"Professional vocabulary and phrases for workplace communication",
			category: "vocabulary",
			imageSeed: 302,
			difficulty: "Intermediate",
		},
		{
			id: 3,
			title: "Academic Writing Techniques",
			description:
				"Improve your essay writing with academic structures and vocabulary",
			category: "writing",
			imageSeed: 303,
			difficulty: "Advanced",
		},
		{
			id: 4,
			title: "Podcast Comprehension",
			description:
				"Practice understanding natural speech with popular podcast excerpts",
			category: "listening",
			imageSeed: 304,
			difficulty: "Intermediate",
		},
		{
			id: 5,
			title: "Short Stories Collection",
			description: "Engaging short stories with comprehension questions",
			category: "reading",
			imageSeed: 305,
			difficulty: "Beginner",
		},
		{
			id: 6,
			title: "Pronunciation Guide",
			description: "Master English sounds and intonation patterns",
			category: "speaking",
			imageSeed: 306,
			difficulty: "Beginner",
		},
		{
			id: 7,
			title: "News Reading Practice",
			description: "Current events articles with vocabulary explanations",
			category: "reading",
			imageSeed: 307,
			difficulty: "Intermediate",
		},
		{
			id: 8,
			title: "Idioms and Expressions",
			description: "Common idioms and their usage in everyday conversation",
			category: "vocabulary",
			imageSeed: 308,
			difficulty: "Intermediate",
		},
	];

	const filteredResources =
		activeCategory === "all"
			? resources
			: resources.filter((resource) => resource.category === activeCategory);

	const getCategoryByID = (id) => {
		return categories.find((cat) => cat.id === id);
	};

	const handleResourcePress = (resource) => {
		navigation.navigate("ResourceDetail", {
			resource,
			category: getCategoryByID(resource.category),
		});
	};

	const getDifficultyColor = (difficulty) => {
		switch (difficulty) {
			case "Beginner":
				return COLORS.neonGreen;
			case "Intermediate":
				return COLORS.neonBlue;
			case "Advanced":
				return COLORS.neonPurple;
			default:
				return COLORS.neonBlue;
		}
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

			{/* Sticky header that appears when scrolling */}
			<Animated.View
				style={[
					styles.stickyHeader,
					{
						opacity: stickyHeaderOpacity,
						paddingTop: Platform.OS === "ios" ? 50 : 40,
					},
				]}
			>
				<Text style={styles.stickyHeaderTitle}>Resources</Text>
			</Animated.View>

			<SafeAreaView style={styles.safeArea}>
				<Animated.View style={[styles.header, { opacity: headerFade }]}>
					<Text style={styles.headerTitle}>Student Resources</Text>
					<Text style={styles.headerSubtitle}>
						Discover materials to enhance your English learning journey
					</Text>
				</Animated.View>

				<Animated.ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.scrollContent}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { y: scrollY } } }],
						{ useNativeDriver: true }
					)}
					scrollEventThrottle={16}
				>
					{/* Categories horizontal scroll */}
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						style={styles.categoriesContainer}
						contentContainerStyle={styles.categoriesContent}
					>
						{categories.map((category) => (
							<TouchableOpacity
								key={category.id}
								style={[
									styles.categoryButton,
									activeCategory === category.id && {
										backgroundColor: `${category.color}30`,
										borderColor: category.color,
									},
								]}
								onPress={() => setActiveCategory(category.id)}
							>
								<FontAwesome5
									name={category.icon}
									size={16}
									color={
										activeCategory === category.id
											? category.color
											: COLORS.textSecondary
									}
									style={styles.categoryIcon}
								/>
								<Text
									style={[
										styles.categoryText,
										activeCategory === category.id && { color: category.color },
									]}
								>
									{category.title}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>

					{/* Resources grid */}
					<View style={styles.resourcesContainer}>
						{filteredResources.map((resource) => {
							const category = getCategoryByID(resource.category);

							return (
								<TouchableOpacity
									key={resource.id}
									style={styles.resourceCard}
									onPress={() => handleResourcePress(resource)}
								>
									<Image
										source={{
											uri: `https://api.a0.dev/assets/image?text=english%20${resource.title}%20learning%20resource&aspect=16:9&seed=${resource.imageSeed}`,
										}}
										style={styles.resourceImage}
									/>
									<View style={styles.resourceContent}>
										<View style={styles.resourceMeta}>
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
													size={12}
													color={category.color}
													style={{ marginRight: 5 }}
												/>
												<Text
													style={[
														styles.categoryBadgeText,
														{ color: category.color },
													]}
												>
													{category.title}
												</Text>
											</View>

											<View
												style={[
													styles.difficultyBadge,
													{
														backgroundColor: `${getDifficultyColor(
															resource.difficulty
														)}20`,
														borderColor: `${getDifficultyColor(
															resource.difficulty
														)}50`,
													},
												]}
											>
												<Text
													style={[
														styles.difficultyText,
														{ color: getDifficultyColor(resource.difficulty) },
													]}
												>
													{resource.difficulty}
												</Text>
											</View>
										</View>

										<Text style={styles.resourceTitle}>{resource.title}</Text>
										<Text style={styles.resourceDescription}>
											{resource.description}
										</Text>

										<TouchableOpacity
											style={[
												styles.exploreButton,
												{ backgroundColor: category.color },
											]}
											onPress={() => handleResourcePress(resource)}
										>
											<Text style={styles.exploreButtonText}>
												Explore Resource
											</Text>
										</TouchableOpacity>
									</View>
								</TouchableOpacity>
							);
						})}
					</View>

					{/* Extra space at bottom for navigation bar */}
					<View style={{ height: 100 }} />
				</Animated.ScrollView>
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
		paddingTop: Platform.OS === "ios" ? 10 : 40,
		paddingBottom: 20,
	},
	headerTitle: {
		color: COLORS.textPrimary,
		fontSize: 28,
		fontWeight: "700",
		marginBottom: 8,
		textShadowColor: COLORS.neonBlue,
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 10,
	},
	headerSubtitle: {
		color: COLORS.textSecondary,
		fontSize: 16,
		lineHeight: 22,
		maxWidth: "90%",
	},
	stickyHeader: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		backgroundColor: COLORS.deepBlue,
		zIndex: 100,
		paddingHorizontal: 20,
		paddingBottom: 15,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.cardBorder,
	},
	stickyHeaderTitle: {
		color: COLORS.textPrimary,
		fontSize: 20,
		fontWeight: "700",
		textShadowColor: COLORS.neonBlue,
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 10,
	},
	scrollContent: {
		paddingTop: 20,
	},
	categoriesContainer: {
		marginBottom: 20,
	},
	categoriesContent: {
		paddingHorizontal: 15,
	},
	categoryButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.08)",
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 25,
		marginHorizontal: 5,
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
	},
	categoryIcon: {
		marginRight: 8,
	},
	categoryText: {
		color: COLORS.textSecondary,
		fontSize: 14,
		fontWeight: "500",
	},
	resourcesContainer: {
		paddingHorizontal: 20,
	},
	resourceCard: {
		backgroundColor: COLORS.cardBg,
		borderRadius: 16,
		overflow: "hidden",
		marginBottom: 20,
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
	},
	resourceImage: {
		width: "100%",
		height: 160,
	},
	resourceContent: {
		padding: 15,
	},
	resourceMeta: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	categoryBadge: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 12,
		borderWidth: 1,
	},
	categoryBadgeText: {
		fontSize: 12,
		fontWeight: "600",
	},
	difficultyBadge: {
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 12,
		borderWidth: 1,
	},
	difficultyText: {
		fontSize: 12,
		fontWeight: "600",
	},
	resourceTitle: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 6,
	},
	resourceDescription: {
		color: COLORS.textSecondary,
		fontSize: 14,
		lineHeight: 20,
		marginBottom: 15,
	},
	exploreButton: {
		paddingVertical: 10,
		borderRadius: 8,
		alignItems: "center",
	},
	exploreButtonText: {
		color: COLORS.textPrimary,
		fontWeight: "600",
	},
});
