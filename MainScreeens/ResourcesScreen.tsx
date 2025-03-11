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
	FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	MaterialCommunityIcons,
	FontAwesome5,
	Ionicons,
	Feather,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "./constants/Colors";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

export default function ResourcesScreen() {
	const navigation = useNavigation();
	const scrollY = useRef(new Animated.Value(0)).current;
	const [activeCategory, setActiveCategory] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");

	// Header animation values - Adjusted for smoother transition
	const headerHeight = 80; // Reduced from 100
	const headerScale = scrollY.interpolate({
		inputRange: [0, headerHeight],
		outputRange: [1, 0.85],
		extrapolate: "clamp",
	});

	const headerTranslateY = scrollY.interpolate({
		inputRange: [0, headerHeight],
		outputRange: [0, -40], // Reduced from -50
		extrapolate: "clamp",
	});

	const headerFade = scrollY.interpolate({
		inputRange: [0, headerHeight],
		outputRange: [1, 0],
		extrapolate: "clamp",
	});

	// Adjusted sticky header to appear more quickly and smoothly
	const stickyHeaderOpacity = scrollY.interpolate({
		inputRange: [headerHeight - 30, headerHeight - 10], // Adjusted for quicker transition
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
			rating: 4.8,
			downloads: 1250,
		},
		{
			id: 2,
			title: "Business English Guide",
			description:
				"Professional vocabulary and phrases for workplace communication",
			category: "vocabulary",
			imageSeed: 302,
			difficulty: "Intermediate",
			rating: 4.6,
			downloads: 980,
		},
		{
			id: 3,
			title: "Academic Writing Techniques",
			description:
				"Improve your essay writing with academic structures and vocabulary",
			category: "writing",
			imageSeed: 303,
			difficulty: "Advanced",
			rating: 4.9,
			downloads: 745,
		},
		{
			id: 4,
			title: "Podcast Comprehension",
			description:
				"Practice understanding natural speech with popular podcast excerpts",
			category: "listening",
			imageSeed: 304,
			difficulty: "Intermediate",
			rating: 4.7,
			downloads: 1120,
		},
		{
			id: 5,
			title: "Short Stories Collection",
			description: "Engaging short stories with comprehension questions",
			category: "reading",
			imageSeed: 305,
			difficulty: "Beginner",
			rating: 4.5,
			downloads: 2350,
		},
		{
			id: 6,
			title: "Pronunciation Guide",
			description: "Master English sounds and intonation patterns",
			category: "speaking",
			imageSeed: 306,
			difficulty: "Beginner",
			rating: 4.9,
			downloads: 1850,
		},
		{
			id: 7,
			title: "News Reading Practice",
			description: "Current events articles with vocabulary explanations",
			category: "reading",
			imageSeed: 307,
			difficulty: "Intermediate",
			rating: 4.4,
			downloads: 965,
		},
		{
			id: 8,
			title: "Idioms and Expressions",
			description: "Common idioms and their usage in everyday conversation",
			category: "vocabulary",
			imageSeed: 308,
			difficulty: "Intermediate",
			rating: 4.7,
			downloads: 1430,
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

	const renderResourceItem = ({ item }) => {
		const resource = item;
		const category = getCategoryByID(resource.category);

		return (
			<TouchableOpacity
				style={styles.resourceCard}
				onPress={() => handleResourcePress(resource)}
			>
				<View style={styles.resourceImageContainer}>
					<Image
						source={{
							uri: `https://api.a0.dev/assets/image?text=english%20${resource.title}%20learning%20resource&aspect=16:9&seed=${resource.imageSeed}`,
						}}
						style={styles.resourceImage}
					/>
					<LinearGradient
						colors={["transparent", "rgba(0,0,0,0.7)"]}
						style={styles.imageGradient}
						start={{ x: 0, y: 0 }}
						end={{ x: 0, y: 1 }}
					>
						<View
							style={[
								styles.categoryBadge,
								{
									backgroundColor: `${category.color}40`,
									borderColor: category.color,
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
								style={[styles.categoryBadgeText, { color: category.color }]}
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
									)}40`,
									borderColor: `${getDifficultyColor(resource.difficulty)}`,
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
					</LinearGradient>
				</View>

				<View style={styles.resourceContent}>
					<Text style={styles.resourceTitle}>{resource.title}</Text>
					<Text style={styles.resourceDescription} numberOfLines={2}>
						{resource.description}
					</Text>

					<View style={styles.resourceStats}>
						<View style={styles.statItem}>
							<Ionicons name="star" size={16} color={COLORS.neonYellow} />
							<Text style={styles.statText}>{resource.rating}</Text>
						</View>
						<View style={styles.statItem}>
							<Feather name="download" size={14} color={COLORS.textSecondary} />
							<Text style={styles.statText}>{resource.downloads}</Text>
						</View>
					</View>

					<TouchableOpacity
						style={[
							styles.exploreButton,
							{ backgroundColor: `${category.color}30` },
						]}
						onPress={() => handleResourcePress(resource)}
					>
						<Text style={[styles.exploreButtonText, { color: category.color }]}>
							Explore
						</Text>
						<MaterialCommunityIcons
							name="arrow-right"
							size={16}
							color={category.color}
						/>
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		);
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

			{/* Sticky header that appears when scrolling - Optimized size */}
			<Animated.View
				style={[
					styles.stickyHeader,
					{
						opacity: stickyHeaderOpacity,
					},
				]}
			>
				<BlurView intensity={80} tint="dark" style={styles.stickyBlur}>
					<Text style={styles.stickyHeaderTitle}>Resources</Text>
					<TouchableOpacity style={styles.stickySearchButton}>
						<Ionicons name="search" size={20} color={COLORS.textPrimary} />
					</TouchableOpacity>
				</BlurView>
			</Animated.View>

			<SafeAreaView style={styles.safeArea}>
				<Animated.View
					style={[
						styles.header,
						{
							opacity: headerFade,
							transform: [
								{ scale: headerScale },
								{ translateY: headerTranslateY },
							],
						},
					]}
				>
					<View style={styles.headerTextContainer}>
						<Text style={styles.headerTitle}>Learning Resources</Text>
						<Text style={styles.headerSubtitle}>
							Discover materials to enhance your English learning journey
						</Text>
					</View>
					<View style={styles.searchContainer}>
						<Ionicons
							name="search"
							size={20}
							color={COLORS.textSecondary}
							style={styles.searchIcon}
						/>
						<TouchableOpacity style={styles.searchPlaceholder}>
							<Text style={styles.searchPlaceholderText}>
								Search resources...
							</Text>
						</TouchableOpacity>
					</View>
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
					{/* Featured resource */}
					<TouchableOpacity
						style={styles.featuredCard}
						onPress={() => handleResourcePress(resources[0])}
					>
						<Image
							source={{
								uri: `https://api.a0.dev/assets/image?text=featured%20english%20learning%20resource%20showcase&aspect=16:9&seed=300`,
							}}
							style={styles.featuredImage}
						/>
						<LinearGradient
							colors={["transparent", "rgba(0,0,0,0.8)"]}
							style={styles.featuredGradient}
							start={{ x: 0, y: 0 }}
							end={{ x: 0, y: 1 }}
						>
							<View style={styles.featuredContent}>
								<View style={styles.featuredBadge}>
									<Ionicons name="star" size={14} color="#FFF" />
									<Text style={styles.featuredBadgeText}>FEATURED</Text>
								</View>
								<Text style={styles.featuredTitle}>
									Complete English Learning Pack
								</Text>
								<Text style={styles.featuredDescription}>
									All-in-one resource for comprehensive English learning
								</Text>
							</View>
						</LinearGradient>
					</TouchableOpacity>

					{/* Categories horizontal scroll */}
					<View style={styles.categoriesSectionHeader}>
						<Text style={styles.sectionTitle}>Categories</Text>
						<TouchableOpacity>
							<Text style={styles.viewAllText}>View All</Text>
						</TouchableOpacity>
					</View>

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
								<View
									style={[
										styles.categoryIconContainer,
										{
											backgroundColor:
												activeCategory === category.id
													? `${category.color}30`
													: "rgba(255, 255, 255, 0.05)",
										},
									]}
								>
									<FontAwesome5
										name={category.icon}
										size={18}
										color={
											activeCategory === category.id
												? category.color
												: COLORS.textSecondary
										}
									/>
								</View>
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

					{/* Resources section header */}
					<View style={styles.resourcesSectionHeader}>
						<Text style={styles.sectionTitle}>
							{activeCategory === "all"
								? "All Resources"
								: getCategoryByID(activeCategory).title}
						</Text>
						<View style={styles.resourcesCountBadge}>
							<Text style={styles.resourcesCountText}>
								{filteredResources.length}
							</Text>
						</View>
					</View>

					{/* Resources list */}
					<FlatList
						data={filteredResources}
						renderItem={renderResourceItem}
						keyExtractor={(item) => item.id.toString()}
						scrollEnabled={false}
						contentContainerStyle={styles.resourcesList}
					/>

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
		paddingTop: Platform.OS === "ios" ? 5 : 5, // Reduced from 10
		paddingBottom: 15, // Reduced from 20
	},
	headerTextContainer: {
		marginBottom: 10, // Reduced from 15
	},
	headerTitle: {
		color: COLORS.textPrimary,
		fontSize: 26, // Reduced from 28
		fontWeight: "700",
		marginBottom: 4, // Reduced from 8
		textShadowColor: COLORS.neonBlue,
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 10,
	},
	headerSubtitle: {
		color: COLORS.textSecondary,
		fontSize: 14, // Reduced from 16
		lineHeight: 20, // Reduced from 22
		maxWidth: "90%",
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.08)",
		borderRadius: 12,
		paddingHorizontal: 15,
		paddingVertical: 10, // Reduced from 12
		marginTop: 5,
	},
	searchIcon: {
		marginRight: 10,
	},
	searchPlaceholder: {
		flex: 1,
	},
	searchPlaceholderText: {
		color: COLORS.textSecondary,
		fontSize: 15,
	},
	stickyHeader: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 100,
	},
	stickyBlur: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingBottom: 10, // Reduced from 15
		paddingTop: Platform.OS === "ios" ? 45 : 35, // Adjusted for status bar height
	},
	stickyHeaderTitle: {
		color: COLORS.textPrimary,
		fontSize: 18, // Reduced from 20
		fontWeight: "700",
		textShadowColor: COLORS.neonBlue,
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 10,
	},
	stickySearchButton: {
		width: 36, // Reduced from 40
		height: 36, // Reduced from 40
		borderRadius: 18,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		justifyContent: "center",
		alignItems: "center",
	},
	scrollContent: {
		paddingTop: 15, // Reduced from 20
	},
	featuredCard: {
		marginHorizontal: 20,
		borderRadius: 16,
		overflow: "hidden",
		marginBottom: 20, // Reduced from 24
		elevation: 5,
		shadowColor: COLORS.neonBlue,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
	},
	featuredImage: {
		width: "100%",
		height: 180,
	},
	featuredGradient: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: "70%",
		justifyContent: "flex-end",
		padding: 16,
	},
	featuredContent: {
		width: "100%",
	},
	featuredBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: `${COLORS.neonBlue}80`,
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 20,
		alignSelf: "flex-start",
		marginBottom: 10,
	},
	featuredBadgeText: {
		color: COLORS.textPrimary,
		fontSize: 12,
		fontWeight: "700",
		marginLeft: 5,
	},
	featuredTitle: {
		color: COLORS.textPrimary,
		fontSize: 20,
		fontWeight: "700",
		marginBottom: 6,
		textShadowColor: "#000",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 4,
	},
	featuredDescription: {
		color: COLORS.textSecondary,
		fontSize: 14,
		textShadowColor: "#000",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 4,
	},
	categoriesSectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		marginBottom: 10, // Reduced from 12
	},
	sectionTitle: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "700",
	},
	viewAllText: {
		color: COLORS.neonBlue,
		fontSize: 14,
		fontWeight: "600",
	},
	categoriesContainer: {
		marginBottom: 20, // Reduced from 24
	},
	categoriesContent: {
		paddingHorizontal: 15,
	},
	categoryButton: {
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		paddingHorizontal: 15,
		paddingVertical: 15,
		borderRadius: 16,
		marginHorizontal: 5,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.08)",
		width: 100,
	},
	categoryIconContainer: {
		width: 46,
		height: 46,
		borderRadius: 23,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 8,
	},
	categoryText: {
		color: COLORS.textSecondary,
		fontSize: 12,
		fontWeight: "600",
		textAlign: "center",
	},
	resourcesSectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		marginBottom: 15,
	},
	resourcesCountBadge: {
		backgroundColor: COLORS.cardBg,
		borderRadius: 12,
		paddingHorizontal: 8,
		paddingVertical: 4,
		marginLeft: 10,
	},
	resourcesCountText: {
		color: COLORS.textSecondary,
		fontSize: 12,
		fontWeight: "600",
	},
	resourcesList: {
		paddingHorizontal: 20,
	},
	resourceCard: {
		backgroundColor: "rgba(255, 255, 255, 0.07)",
		borderRadius: 16,
		overflow: "hidden",
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.08)",
	},
	resourceImageContainer: {
		position: "relative",
	},
	resourceImage: {
		width: "100%",
		height: 140,
	},
	imageGradient: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 10,
	},
	categoryBadge: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		borderWidth: 1,
	},
	categoryBadgeText: {
		fontSize: 10,
		fontWeight: "700",
	},
	difficultyBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		borderWidth: 1,
	},
	difficultyText: {
		fontSize: 10,
		fontWeight: "700",
	},
	resourceContent: {
		padding: 15,
	},
	resourceTitle: {
		color: COLORS.textPrimary,
		fontSize: 17,
		fontWeight: "700",
		marginBottom: 6,
	},
	resourceDescription: {
		color: COLORS.textSecondary,
		fontSize: 13,
		lineHeight: 18,
		marginBottom: 12,
	},
	resourceStats: {
		flexDirection: "row",
		marginBottom: 12,
	},
	statItem: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 15,
	},
	statText: {
		color: COLORS.textSecondary,
		fontSize: 12,
		marginLeft: 5,
	},
	exploreButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 8,
		borderRadius: 8,
	},
	exploreButtonText: {
		fontWeight: "600",
		marginRight: 5,
	},
});
