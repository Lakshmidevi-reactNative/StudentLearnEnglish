import React, { useRef } from "react";
import { useTheme } from "../../App";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Animated,
	StatusBar,
	SafeAreaView,
	Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import FeatureCard from "../CommonScreens/FeatureCard";

export default function LearningScreen({ navigation }) {
	const { isDarkMode } = useTheme();
	const scrollY = useRef(new Animated.Value(0)).current;

	const learningFeatures = [
		{
			title: "ListenEng",
			description: "Master listening comprehension",
			icon: "headset",
			color: "#4169E1",
			progress: 85,
			onPress: () => navigation.navigate("ListenEng"),
		},
		{
			title: "SpeakEng",
			description: "Perfect pronunciation & fluency",
			icon: "mic",
			color: "#10B981",
			progress: 70,
			onPress: () => navigation.navigate("SpeakEng"),
		},
		{
			title: "ReadEng",
			description: "Enhance reading skills",
			icon: "menu-book",
			color: "#4c2882",
			progress: 90,
			onPress: () => navigation.navigate("ReadEng"),
		},
		{
			title: "WriteEng",
			description: "Improve writing abilities",
			icon: "create",
			color: "#074799",
			progress: 65,
			onPress: () => navigation.navigate("WriteEng"),
		},
		{
			title: "TypeEng",
			description: "Improve typing abilities",
			icon: "keyboard",
			color: "#F59E0B",
			progress: 65,
			onPress: () => navigation.navigate("TypeEng"),
		},
		{
			title: "PromptEng",
			description: "Practice real conversations",
			icon: "chat",
			color: "#F56565",
			progress: 75,
			onPress: () => navigation.navigate("PromptEng"),
		},
	];

	const resources = [
		{
			title: "Study Materials",
			description: "Access course documents & worksheets",
			icon: "library-books",
			color: isDarkMode ? "#4169E1" : "#2563EB",
		},
		{
			title: "Practice Tests",
			description: "Prepare with sample exercises",
			icon: "assignment",
			color: isDarkMode ? "#10B981" : "#2563EB",
		},
		{
			title: "Video Lessons",
			description: "Watch recorded class sessions",
			icon: "play-circle-fill",
			color: isDarkMode ? "#4c2882" : "#162C8F",
		},
	];

	// Animation values for header
	const HEADER_MAX_HEIGHT = 140;
	const HEADER_MIN_HEIGHT = 60;
	const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

	// Calculate header opacity based on scroll position
	const headerOpacity = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE],
		outputRange: [1, 0],
		extrapolate: "clamp",
	});

	// Calculate sticky header opacity
	const stickyHeaderOpacity = scrollY.interpolate({
		inputRange: [HEADER_SCROLL_DISTANCE - 30, HEADER_SCROLL_DISTANCE],
		outputRange: [0, 1],
		extrapolate: "clamp",
	});

	return (
		<SafeAreaView
			style={[styles.container, isDarkMode && styles.darkContainer]}
		>
			<StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

			{/* Sticky Header */}
			<Animated.View
				style={[
					styles.stickyHeader,
					{ opacity: stickyHeaderOpacity },
					isDarkMode && styles.darkStickyHeader,
				]}
			>
				<View style={styles.placeholder} />
				<Text style={[styles.stickyHeaderTitle, isDarkMode && styles.darkText]}>
					Learning Center
				</Text>
				<View style={styles.placeholder} />
			</Animated.View>

			<Animated.ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: true }
				)}
				scrollEventThrottle={16}
			>
				{/* Animated header */}
				<Animated.View style={{ opacity: headerOpacity }}>
					<LinearGradient
						colors={
							isDarkMode ? ["#1A1A1A", "#2D2D2D"] : ["#012269", "#224ba3"]
						}
						style={styles.header}
					>
						<Text style={styles.headerTitle}>Learn & Practice</Text>
						{/* <View style={styles.statsContainer}>
							<View style={styles.statBox}>
								<MaterialIcons name="timer" size={24} color="#FFD700" />
								<Text style={styles.statNumber}>45</Text>
								<Text style={styles.statLabel}>Minutes Today</Text>
							</View>
							<View style={styles.statDivider} />
							<View style={styles.statBox}>
								<MaterialIcons name="trending-up" size={24} color="#FFD700" />
								<Text style={styles.statNumber}>85%</Text>
								<Text style={styles.statLabel}>Accuracy</Text>
							</View>
						</View> */}
					</LinearGradient>
				</Animated.View>

				<View style={styles.featuresContainer}>
					<Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
						Learning Features
					</Text>
					<View style={styles.featuresGrid}>
						{learningFeatures.map((feature, index) => (
							<TouchableOpacity
								key={index}
								style={[styles.featureCard, isDarkMode && styles.darkCard]}
								onPress={feature.onPress}
							>
								<View style={styles.featureContent}>
									<View
										style={[
											styles.iconContainer,
											{ backgroundColor: `${feature.color}15` },
										]}
									>
										<MaterialIcons
											name={feature.icon}
											size={24}
											color={feature.color}
										/>
									</View>
									<View style={styles.textContainer}>
										<Text
											style={[
												styles.featureTitle,
												isDarkMode && styles.darkText,
											]}
										>
											{feature.title}
										</Text>
										<Text
											style={[
												styles.featureDescription,
												isDarkMode && styles.darkSubText,
											]}
											numberOfLines={2}
										>
											{feature.description}
										</Text>
									</View>
									{/* <View style={styles.progressSection}>
										<View
											style={[
												styles.progressBackground,
												isDarkMode && styles.darkProgressBackground,
											]}
										>
											<View
												style={[
													styles.progressFill,
													{
														width: `${feature.progress}%`,
														backgroundColor: feature.color,
													},
												]}
											/>
										</View>
										<Text
											style={[styles.progressText, { color: feature.color }]}
										>
											{feature.progress}%
										</Text>
									</View> */}
								</View>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{/* <View style={styles.resourcesContainer}>
					<Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
						Student Resources
					</Text>
					<View style={[styles.resourcesList, isDarkMode && styles.darkCard]}>
						{resources.map((resource, index) => (
							<TouchableOpacity
								key={index}
								style={[
									styles.resourceItem,
									isDarkMode && styles.darkCard,
									index < resources.length - 1 && styles.resourceBorder,
								]}
							>
								<View
									style={[
										styles.resourceIcon,
										{ backgroundColor: `${resource.color}15` },
									]}
								>
									<MaterialIcons
										name={resource.icon}
										size={24}
										color={resource.color}
									/>
								</View>
								<View style={styles.resourceContent}>
									<Text
										style={[
											styles.resourceTitle,
											isDarkMode && styles.darkText,
										]}
									>
										{resource.title}
									</Text>
									<Text
										style={[
											styles.resourceDescription,
											isDarkMode && styles.darkSubText,
										]}
									>
										{resource.description}
									</Text>
								</View>
								<MaterialIcons
									name="chevron-right"
									size={24}
									color={isDarkMode ? "#FFFFFF" : "#111827"}
								/>
							</TouchableOpacity>
						))}
					</View>
				</View> */}

				<View style={styles.bottomSpacing} />
			</Animated.ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F9FAFB",
	},
	darkContainer: {
		backgroundColor: "#121212",
	},
	scrollView: {
		flex: 1,
	},
	scrollViewContent: {
		paddingTop: 0,
	},
	stickyHeader: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: Platform.OS === "ios" ? 50 : 100,
		backgroundColor: "rgba(249,250,251,0.97)",
		zIndex: 1000,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0,0,0,0.1)",
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
		elevation: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	darkStickyHeader: {
		backgroundColor: "rgba(18,18,18,0.95)",
		borderBottomColor: "rgba(255,255,255,0.1)",
	},
	stickyHeaderTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#012269",
	},
	placeholder: {
		width: 40,
	},
	darkText: {
		color: "#FFFFFF",
	},
	darkSubText: {
		color: "#A0AEC0",
	},
	bottomSpacing: {
		marginBottom: 30,
		height: 40,
	},
	header: {
		padding: 24,
		paddingTop: Platform.OS === "ios" ? 40 : 60,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
	},
	headerTitle: {
		fontSize: 28,
		fontWeight: "bold",
		color: "white",
		marginBottom: 20,
	},
	statsContainer: {
		flexDirection: "row",
		backgroundColor: "rgba(255,255,255,0.15)",
		borderRadius: 15,
		padding: 15,
	},
	statBox: {
		flex: 1,
		alignItems: "center",
	},
	statDivider: {
		width: 1,
		backgroundColor: "rgba(255,255,255,0.2)",
		marginHorizontal: 15,
	},
	statNumber: {
		color: "white",
		fontSize: 20,
		fontWeight: "bold",
		marginTop: 5,
	},
	statLabel: {
		color: "rgba(255,255,255,0.8)",
		fontSize: 12,
	},
	featuresContainer: {
		padding: 16,
	},
	featuresGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#111827",
		marginBottom: 16,
		paddingLeft: 8,
	},
	featureCard: {
		width: "48%",
		backgroundColor: "white",
		borderRadius: 16,
		marginBottom: 16,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	darkCard: {
		backgroundColor: "#2D2D2D",
	},
	featureContent: {
		padding: 16,
		alignItems: "center",
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 12,
	},
	textContainer: {
		alignItems: "center",
		marginBottom: 12,
	},
	featureTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#111827",
		marginBottom: 4,
		textAlign: "center",
	},
	featureDescription: {
		fontSize: 12,
		color: "#6B7280",
		textAlign: "center",
		lineHeight: 16,
	},
	progressSection: {
		width: "100%",
	},
	progressBackground: {
		height: 4,
		backgroundColor: "#E5E7EB",
		borderRadius: 2,
		overflow: "hidden",
		marginBottom: 4,
	},
	darkProgressBackground: {
		backgroundColor: "rgba(255,255,255,0.1)",
	},
	progressFill: {
		height: "100%",
		borderRadius: 2,
	},
	progressText: {
		fontSize: 11,
		fontWeight: "600",
		textAlign: "right",
	},
	resourcesContainer: {
		padding: 16,
		paddingTop: 0,
	},
	resourcesList: {
		backgroundColor: "white",
		borderRadius: 16,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	resourceItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		backgroundColor: "white",
	},
	resourceBorder: {
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
	},
	resourceIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	resourceContent: {
		flex: 1,
	},
	resourceTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#111827",
		marginBottom: 4,
	},
	resourceDescription: {
		fontSize: 12,
		color: "#6B7280",
		lineHeight: 16,
	},
});
