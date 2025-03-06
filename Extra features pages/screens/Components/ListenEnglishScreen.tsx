import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../../App";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Animated,
	StatusBar,
	Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { toast } from "sonner-native";
import ContentCard from "../CommonScreens/ContentCard";
import UploadModal from "../CommonScreens/UploadModal";

export default function ListenEnglishScreen({ navigation }) {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [contents] = useState([
		{
			id: "1",
			title: "Business Meeting Conversation",
			level: "Intermediate",
			duration: "5:30",
			source: "User Upload",
			date: "2024-02-15",
			category: "Business English",
		},
		{
			id: "2",
			title: "Daily Life at Coffee Shop",
			level: "Beginner",
			duration: "3:45",
			source: "User Upload",
			date: "2024-02-14",
			category: "Casual Conversation",
		},
		{
			id: "3",
			title: "Job Interview Practice",
			level: "Advanced",
			duration: "8:20",
			source: "User Upload",
			date: "2024-02-13",
			category: "Professional",
		},
		{
			id: "43",
			title: "Job Interview Practice",
			level: "Advanced",
			duration: "8:20",
			source: "User Upload",
			date: "2024-02-13",
			category: "Professional",
		},
		{
			id: "33",
			title: "Job Interview Practice",
			level: "Advanced",
			duration: "8:20",
			source: "User Upload",
			date: "2024-02-13",
			category: "Professional",
		},
		{
			id: "13",
			title: "Job Interview Practice",
			level: "Advanced",
			duration: "8:20",
			source: "User Upload",
			date: "2024-02-13",
			category: "Professional",
		},
		{
			id: "23",
			title: "Job Interview Practice",
			level: "Advanced",
			duration: "8:20",
			source: "User Upload",
			date: "2024-02-13",
			category: "Professional",
		},
	]);

	const { isDarkMode } = useTheme();
	const scrollY = useRef(new Animated.Value(0)).current;

	// Animation constants for header - INCREASED HEADER HEIGHTS
	const HEADER_MAX_HEIGHT = 160; // Increased from 140
	const HEADER_MIN_HEIGHT = 70; // Increased from 60
	const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

	const themeStyles = {
		light: {
			bgColor: "#F5F7FA",
			textColor: "#2C3E50",
			cardBg: "#ffffff",
			borderColor: "#e0e0e0",
			headerGradient: ["#4A90E2", "#357ABD"],
			stickyHeaderBg: "rgba(249,250,251,0.97)",
			iconcolor: "#2A8FED",
			viewbg: "rgba(42, 143, 237, 0.1)",
			stickyHeaderTitle: "#4A90E2",
		},
		dark: {
			bgColor: "#1B344E",
			textColor: "#ffffff",
			cardBg: "#1a1a1a",
			borderColor: "#ffffff",
			headerGradient: ["#1a1a1a", "#1a1a1a"],
			stickyHeaderBg: "rgba(27,52,78,0.95)",
			iconcolor: "#2A8FED",
			viewbg: "rgba(174, 186, 195, 0.1)",
			stickyHeaderTitle: "#FFFFFF",
		},
	};

	const currentTheme = themeStyles[isDarkMode ? "dark" : "light"];

	// Animation values
	const headerOpacity = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE],
		outputRange: [1, 0],
		extrapolate: "clamp",
	});

	// Calculate sticky header opacity - IMPROVED TRANSITION
	const stickyHeaderOpacity = scrollY.interpolate({
		inputRange: [HEADER_SCROLL_DISTANCE - 40, HEADER_SCROLL_DISTANCE],
		outputRange: [0, 1],
		extrapolate: "clamp",
	});

	useEffect(() => {
		// Set status bar color to match header
		StatusBar.setBarStyle("light-content");
		if (Platform.OS === "android") {
			StatusBar.setBackgroundColor("transparent");
			StatusBar.setTranslucent(true);
		}
	}, []);

	const handleDelete = (id) => {
		toast("Content deleted successfully");
	};

	const handleView = (id) => {
		try {
			const selectedContent = contents.find((c) => c.id === id);
			if (selectedContent) {
				navigation.navigate("ListenEnglishPractice", {
					contentId: id,
					content: selectedContent,
				});
				toast("Opening listening content... 🎧");
			} else {
				toast("Error: Content not found");
			}
		} catch (error) {
			console.error("Navigation error:", error);
			toast("Error opening content");
		}
	};

	const handleUpload = () => {
		setIsModalVisible(true);
	};

	const handleModalClose = () => {
		setIsModalVisible(false);
	};

	const handleSubmitUpload = () => {
		toast("Content uploaded successfully! 🎉");
		setIsModalVisible(false);
	};

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: currentTheme.bgColor }]}
			edges={["left", "right"]}
		>
			<StatusBar
				barStyle="light-content"
				backgroundColor="transparent"
				translucent
			/>

			{/* Sticky Header - IMPROVED LAYOUT */}
			<Animated.View
				style={[
					styles.stickyHeader,
					{
						backgroundColor: currentTheme.stickyHeaderBg,
						opacity: stickyHeaderOpacity,
						borderBottomColor: isDarkMode
							? "rgba(255,255,255,0.1)"
							: "rgba(0,0,0,0.1)",
					},
				]}
			>
				<View style={styles.stickyHeaderContent}>
					<TouchableOpacity
						style={styles.stickyBackButton}
						onPress={() => navigation.goBack()}
					>
						<MaterialIcons name="arrow-back" size={24} color="white" />
					</TouchableOpacity>
					<Text
						style={[
							styles.stickyHeaderTitle,
							{ color: currentTheme.stickyHeaderTitle },
						]}
					>
						ListenEng
					</Text>
				</View>
			</Animated.View>

			<Animated.ScrollView
				style={styles.scrollView}
				scrollEventThrottle={16}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: true }
				)}
				contentContainerStyle={styles.scrollViewContent}
			>
				<UploadModal
					visible={isModalVisible}
					onClose={handleModalClose}
					onSubmit={handleSubmitUpload}
					iconColor={currentTheme.iconcolor}
					cardColor={currentTheme.cardBg}
					buttonColor={currentTheme.iconcolor}
					textColor={currentTheme.textColor}
				/>

				{/* Main header with gradient background - IMPROVED LAYOUT */}
				<Animated.View style={{ opacity: headerOpacity }}>
					<LinearGradient
						colors={currentTheme.headerGradient}
						style={styles.header}
					>
						<View style={styles.headerContent}>
							<TouchableOpacity
								style={styles.backButton}
								onPress={() => navigation.goBack()}
							>
								<MaterialIcons name="arrow-back" size={26} color="white" />
							</TouchableOpacity>
							<View style={styles.headerTextContainer}>
								<Text style={styles.headerTitle}>ListenEng</Text>
								<Text style={styles.headerSubtitle}>
									Improve your listening skills
								</Text>
							</View>

							<TouchableOpacity style={styles.statsContainer}>
								<MaterialIcons name="headset" size={20} color="#FFD700" />
								<Text style={styles.statNumber}>24</Text>
							</TouchableOpacity>
						</View>
					</LinearGradient>
				</Animated.View>

				<View style={styles.contentSection}>
					<View style={styles.sectionHeader}>
						<Text
							style={[styles.sectionTitle, { color: currentTheme.textColor }]}
						>
							My Contents
						</Text>
						<TouchableOpacity
							style={styles.uploadButton}
							onPress={handleUpload}
						>
							<LinearGradient
								colors={[currentTheme.iconcolor, currentTheme.iconcolor]}
								style={styles.uploadGradient}
							>
								<MaterialIcons name="file-upload" size={20} color="white" />
								<Text style={styles.uploadText}>Upload Content</Text>
							</LinearGradient>
						</TouchableOpacity>
					</View>

					{contents.map((content) => (
						<ContentCard
							key={content.id}
							content={content}
							onView={() => handleView(content.id)}
							onDelete={() => handleDelete(content.id)}
							icon="headset"
							bgcolor={currentTheme.cardBg}
							iconcolor={currentTheme.iconcolor}
							viewbg={currentTheme.viewbg}
							titlecolor={currentTheme.textColor}
						/>
					))}
				</View>

				{/* Bottom spacing */}
				<View style={styles.bottomSpacing} />
			</Animated.ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F7FA",
	},
	scrollView: {
		flex: 1,
	},
	scrollViewContent: {
		paddingTop: 0, // Ensure content starts at the top
	},
	stickyHeader: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: Platform.OS === "ios" ? 65 : 95,
		backgroundColor: "rgba(249,250,251,0.98)",
		zIndex: 1000,
		borderBottomWidth: 1,
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.15,
		shadowRadius: 4,
	},
	stickyHeaderContent: {
		flex: 1,
		flexDirection: "row",
		gap: 20,
		alignContent: "center",
		alignItems: "center",

		paddingHorizontal: 16,
		height: "100%",
	},
	stickyBackButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#4A90E2",
		justifyContent: "center",
		alignItems: "center",
	},
	stickyHeaderTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#4A90E2",
		flex: 1,
		// textAlign: "center",
	},
	stickyStatsContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(74,144,226,0.2)",
		borderRadius: 15,
		padding: 8,
		width: 60,
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "rgba(74,144,226,0.3)",
	},
	stickyStatNumber: {
		color: "#4A90E2",
		fontSize: 14,
		fontWeight: "bold",
		marginLeft: 4,
	},
	header: {
		paddingTop:
			Platform.OS === "ios" ? 50 : (StatusBar.currentHeight || 0) + 20,
		paddingHorizontal: 20,
		paddingBottom: 25,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
		marginBottom: 10,
	},
	headerContent: {
		flexDirection: "row",
		marginBottom: 12,
	},
	headerTextContainer: {
		flexDirection: "column",
		flex: 1,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255,255,255,0.2)",
		justifyContent: "center",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 26,
		fontWeight: "bold",
		color: "white",
		marginLeft: 20,
		// textAlign: "center",
	},
	headerSubtitle: {
		fontSize: 15,
		color: "rgba(255,255,255,0.8)",
		marginTop: 5,
		marginLeft: 20,
	},
	statsContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255,255,255,0.15)",
		borderRadius: 15,
		padding: 10,
		width: 75,
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.3)",
	},
	statNumber: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
		marginLeft: 5,
	},
	contentSection: {
		padding: 16,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
		marginTop: 5, // Added top margin
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2C3E50",
	},
	uploadButton: {
		borderRadius: 25,
		overflow: "hidden",
	},
	uploadGradient: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 10, // Increased padding for better touch target
	},
	uploadText: {
		color: "white",
		fontWeight: "600",
		marginLeft: 8,
	},
	bottomSpacing: {
		height: 40, // Increased bottom spacing
	},
});
