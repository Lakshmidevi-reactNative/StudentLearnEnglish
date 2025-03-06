import React, { useState, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Animated,
	StatusBar,
	SafeAreaView,
	Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../App";
import { LinearGradient } from "expo-linear-gradient";

const StudentResources = () => {
	const navigation = useNavigation();
	const { isDarkMode } = useTheme();
	const scrollY = useRef(new Animated.Value(0)).current;

	// Sample resource data with content for each resource
	const resources = [
		{
			id: "1",
			title: "Trending Now",
			description: "Latest educational content and resources",
			content:
				"Trending Now features the most popular and current educational resources and content. This section highlights educational trends, new teaching methodologies, and learning materials that are gaining popularity among students and educators alike. Stay updated with the latest educational innovations and resources to enhance your learning experience.",
			icon: "trending-up",
			color: "#4A90E2",
		},
		{
			id: "2",
			title: "Skill-Based Reading",
			description: "Resources to improve reading comprehension",
			content:
				"Skill-Based Reading offers comprehensive resources designed to enhance your reading skills and comprehension abilities. This collection includes various reading materials organized by difficulty levels, exercises to improve vocabulary, and techniques to boost comprehension. Whether you're looking to improve basic reading skills or advance to complex literature analysis, these resources provide structured guidance for skill development.",
			icon: "menu-book",
			color: "#4c2882",
		},
		{
			id: "3",
			title: "Career Readiness",
			description: "Prepare for your professional journey",
			content:
				"Career Readiness provides tools and resources to help you prepare for your professional journey. From resume building and interview preparation to industry insights and job market trends, this section is designed to bridge the gap between academic learning and workplace requirements. Explore resources on professional etiquette, workplace communication, and essential skills valued by employers across different industries.",
			icon: "work",
			color: "#10B981",
		},
		{
			id: "4",
			title: "Civic Awareness",
			description: "Understanding society and civic responsibilities",
			content:
				"Civic Awareness resources help you understand societal structures, governance systems, and your role as a responsible citizen. This section covers topics like democratic processes, constitutional rights, environmental responsibility, and community engagement. Stay informed about current civic issues and discover how you can contribute positively to society while developing a deeper understanding of the social, political, and economic factors shaping our world.",
			icon: "account-balance",
			color: "#F59E0B",
		},
		{
			id: "5",
			title: "Wellness Resources",
			description: "Support for physical and mental well-being",
			content:
				"Wellness Resources offers comprehensive support for maintaining physical and mental well-being during your educational journey. This collection includes resources on stress management, mindfulness practices, physical fitness, nutrition guidance, and mental health support. Learn strategies to maintain a healthy work-life balance, recognize early signs of burnout, and develop resilience to navigate the challenges of academic life while prioritizing your overall wellness.",
			icon: "favorite",
			color: "#F56565",
		},
		{
			id: "6",
			title: "Healthcare Insights",
			description: "Information on health and healthcare systems",
			content:
				"Healthcare Insights provides valuable information on health topics, medical advances, and healthcare systems. This resource covers basic healthcare knowledge, disease prevention, healthcare rights, insurance information, and medical terminology. Stay informed about important health topics and gain a better understanding of how to navigate healthcare systems effectively for yourself and others.",
			icon: "local-hospital",
			color: "#074799",
		},
		{
			id: "7",
			title: "Tech Savvy",
			description: "Digital literacy and technology resources",
			content:
				"Tech Savvy resources help you develop digital literacy and stay current with technological advancements. Learn about essential digital tools, online safety, basic coding concepts, and emerging technologies that are reshaping education and work environments. This section offers practical guides for using various educational technologies and platforms to enhance your learning experience in today's digital world.",
			icon: "devices",
			color: "#45B7D1",
		},
		{
			id: "8",
			title: "Pronunciation",
			description: "Resources to improve English pronunciation",
			content:
				"The Pronunciation section offers specialized resources to help you perfect your English speaking skills. It includes phonetic guides, audio examples of correct pronunciation, common pronunciation challenges for non-native speakers, and practice exercises organized by difficulty level. Use these resources to improve your accent, intonation, rhythm, and overall spoken clarity in both casual and formal communication contexts.",
			icon: "record-voice-over",
			color: "#FFBE0B",
		},
	];

	const handleCardPress = (resource) => {
		// Navigate to EffectiveCommunicationScreen with the resource data
		navigation.navigate("EffectiveCommunication", {
			resourceData: resource,
			contentCards: [
				{
					id: 1,
					title: `${resource.title} Basics`,
					image: resource.icon,
					source: "Educational Resources",
					date: new Date().toDateString(),
					level: "A1",
					content: resource.content,
				},
				{
					id: 2,
					title: `${resource.title} Advanced`,
					image: resource.icon,
					source: "Educational Resources",
					date: new Date().toDateString(),
					level: "B1",
					content: `Advanced ${resource.content}`,
				},
				{
					id: 3,
					title: `${resource.title} Examples`,
					image: resource.icon,
					source: "Educational Resources",
					date: new Date().toDateString(),
					level: "A2",
					content: `Practical examples for ${resource.title.toLowerCase()}: ${
						resource.content
					}`,
				},
				{
					id: 4,
					title: `${resource.title} Activities`,
					image: resource.icon,
					source: "Educational Resources",
					date: new Date().toDateString(),
					level: "B2",
					content: `Interactive activities for practicing ${resource.title.toLowerCase()}: ${
						resource.content
					}`,
				},
			],
		});
	};

	// Calculate header opacity based on scroll position
	const HEADER_MAX_HEIGHT = 140; // Reduced header height
	const HEADER_MIN_HEIGHT = 60;
	const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

	// Animation values
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
			style={[styles.mainContainer, isDarkMode && styles.darkContainer]}
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
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => navigation.goBack()}
				>
					<MaterialIcons
						name="arrow-back"
						size={24}
						color={isDarkMode ? "#FFFFFF" : "black"}
					/>
				</TouchableOpacity>
				<Text style={[styles.stickyHeaderTitle, isDarkMode && styles.darkText]}>
					Student Resources
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
				{/* Compact Header with gradient background */}
				<Animated.View style={{ opacity: headerOpacity }}>
					<LinearGradient
						colors={
							isDarkMode ? ["#1A1A1A", "#2D2D2D"] : ["#012269", "#224ba3"]
						}
						style={styles.header}
					>
						<Text style={styles.headerTitle}>Student Resources</Text>
						<View style={styles.headerRow}>
							<Text style={styles.headerSubtitle}>
								Educational materials to help you succeed
							</Text>
							<View style={styles.statsContainer}>
								<MaterialIcons name="library-books" size={20} color="#FFD700" />
								<Text style={styles.statNumber}>{resources.length}</Text>
							</View>
						</View>
					</LinearGradient>
				</Animated.View>

				<View style={styles.resourcesContainer}>
					<Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
						Browse Resources
					</Text>

					<View style={styles.resourcesGrid}>
						{resources.map((resource) => (
							<TouchableOpacity
								key={resource.id}
								style={[styles.resourceCard, isDarkMode && styles.darkCard]}
								onPress={() => handleCardPress(resource)}
							>
								<View style={styles.cardContent}>
									<View
										style={[
											styles.iconContainer,
											{ backgroundColor: `${resource.color}15` },
										]}
									>
										<MaterialIcons
											name={resource.icon}
											size={24}
											color={resource.color}
										/>
									</View>

									<View style={styles.textContainer}>
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
											numberOfLines={2}
										>
											{resource.description}
										</Text>
									</View>

									<MaterialIcons
										name="chevron-right"
										size={24}
										color={isDarkMode ? "#FFFFFF80" : "#6B7280"}
										style={styles.arrowIcon}
									/>
								</View>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{/* Bottom spacing */}
				<View style={styles.bottomSpacing} />
			</Animated.ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	mainContainer: {
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
	header: {
		padding: 16,
		paddingTop: Platform.OS === "ios" ? 20 : 40,
		paddingBottom: 16,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		marginBottom: 8,
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
		marginBottom: 8,
	},
	headerSubtitle: {
		fontSize: 14,
		color: "rgba(255,255,255,0.8)",
		flex: 1,
	},
	statsContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255,255,255,0.15)",
		borderRadius: 10,
		padding: 8,
		width: 80,
		justifyContent: "center",
	},
	statNumber: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
		marginLeft: 5,
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
	backButton: {
		// borderColor: "black",
		// borderWidth: 2,
		marginBottom: 20,
		padding: 8,
	},
	stickyHeaderTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#012269",
	},
	placeholder: {
		width: 40,
	},
	resourcesContainer: {
		padding: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#111827",
		marginBottom: 16,
		paddingLeft: 8,
	},
	darkText: {
		color: "#FFFFFF",
	},
	darkSubText: {
		color: "#A0AEC0",
	},
	resourcesGrid: {
		gap: 12,
	},
	resourceCard: {
		backgroundColor: "white",
		borderRadius: 16,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
		marginBottom: 4,
	},
	darkCard: {
		backgroundColor: "#2D2D2D",
	},
	cardContent: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	textContainer: {
		flex: 1,
	},
	resourceTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#111827",
		marginBottom: 4,
	},
	resourceDescription: {
		fontSize: 14,
		color: "#6B7280",
		lineHeight: 20,
	},
	arrowIcon: {
		marginLeft: 8,
	},
	bottomSpacing: {
		height: 30,
	},
});

export default StudentResources;
