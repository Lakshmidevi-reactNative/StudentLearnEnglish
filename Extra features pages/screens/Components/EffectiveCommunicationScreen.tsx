import React from "react";
import {
	SafeAreaView,
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	StatusBar,
	Dimensions,
	FlatList,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../App";

const EffectiveCommunicationScreen = ({ navigation, route }) => {
	const { isDarkMode } = useTheme();

	// Get resource data from navigation params or use default data
	const resourceData = route.params?.resourceData || {
		title: "Effective Communication",
		description: "Resources for effective communication skills",
	};

	// Get content cards from navigation params or use default data
	const communicationCards = route.params?.contentCards || [
		{
			id: 1,
			title: "Effective Communication 1",
			image: "trending-up",
			source: "https://www.coursera.org/articles/communication-effectiveness",
			date: "12 December",
			level: "A1",
			content:
				"Adobe® Portable Document Format (PDF) is a universal file format that preserves all of the fonts, formatting, colours and graphics of any source document, regardless of the application and platform used to create it.",
		},
		{
			id: 2,
			title: "Effective Communication 2",
			image: "trending-up",
			source: "https://www.coursera.org/articles/communication-effectiveness",
			date: "12 December",
			level: "A1",
			content:
				"Adobe PDF is an ideal format for electronic document distribution as it overcomes the problems commonly encountered with electronic file sharing.",
		},
		{
			id: 3,
			title: "Effective Communication 3",
			image: "trending-up",
			source: "https://www.coursera.org/articles/communication-effectiveness",
			date: "12 December",
			level: "A1",
			content:
				"PDF files always print correctly on any printing device. PDF files always display exactly as created, regardless of fonts, software, and operating systems.",
		},
		{
			id: 4,
			title: "Effective Communication 4",
			image: "trending-up",
			source: "https://www.coursera.org/articles/communication-effectiveness",
			date: "12 December",
			level: "A1",
			content:
				"The free Acrobat Reader is easy to download and can be freely distributed by anyone.",
		},
	];

	// Handler for card press - navigate to ContentViewScreen
	const handleCardPress = (item) => {
		navigation.navigate("ContentView", {
			assignmentData: {
				id: item.id,
				title: item.title,
				type: "Language",
				level: item.level,
				source: "Educational Resources",
				duration: "5:00",
				content: item.content,
			},
		});
	};

	// Render card item
	const renderCard = ({ item }) => (
		<TouchableOpacity
			style={[styles.cardContainer, isDarkMode && styles.cardContainerDark]}
			onPress={() => handleCardPress(item)}
			activeOpacity={0.9}
		>
			<View style={styles.card}>
				<View
					style={[
						styles.cardImageContainer,
						isDarkMode && styles.cardImageContainerDark,
					]}
				>
					<MaterialIcons
						name={item.image || "description"}
						size={50}
						color="#4A90E2"
					/>
				</View>
				<View style={styles.cardBody}>
					<View style={styles.cardHeader}>
						<TouchableOpacity>
							<Text style={[styles.sourceText, isDarkMode && styles.darkText]}>
								Source: Educational <FontAwesome name="link" size={12} />
							</Text>
						</TouchableOpacity>
						<Text style={[styles.dateText, isDarkMode && styles.darkText]}>
							{item.date}
						</Text>
					</View>
					<Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>
						{item.title}
					</Text>
					<View style={[styles.levelBadge, getBadgeStyle(item.level)]}>
						<Text style={styles.levelBadgeText}>Level {item.level}</Text>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);

	// Badge style helper function
	const getBadgeStyle = (level) => {
		switch (level) {
			case "A1":
				return styles.badgeA1;
			case "A2":
				return styles.badgeA2;
			case "B1":
				return styles.badgeB1;
			case "B2":
				return styles.badgeB2;
			case "C1":
				return styles.badgeC1;
			case "C2":
				return styles.badgeC2;
			default:
				return {};
		}
	};

	return (
		<SafeAreaView
			style={[styles.container, isDarkMode && styles.containerDark]}
		>
			<StatusBar
				backgroundColor={isDarkMode ? "#1a1a1a" : "#fff"}
				barStyle={isDarkMode ? "light-content" : "dark-content"}
			/>

			{/* Header */}
			<LinearGradient
				colors={[
					isDarkMode ? "#2D3748" : "#4A90E2",
					isDarkMode ? "#1A202C" : "#357ABD",
				]}
				style={styles.header}
			>
				<View style={styles.navbar}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.backButton}
					>
						<MaterialIcons name="arrow-back" size={24} color="white" />
					</TouchableOpacity>
					<View style={styles.titleContainer}>
						<Text style={styles.headerTitle}>{resourceData.title}</Text>
						<Text style={styles.headerSubtitle}>
							{resourceData.description}
						</Text>
					</View>
					{/* Fixed: Replaced empty View with a View containing a Text component */}
					<View style={{ width: 40 }}>
						<Text style={{ display: "none" }}></Text>
					</View>
				</View>
			</LinearGradient>

			{/* Main Content */}
			<View style={[styles.content, isDarkMode && styles.contentDark]}>
				<FlatList
					data={communicationCards}
					renderItem={renderCard}
					keyExtractor={(item) => item.id.toString()}
					numColumns={2}
					contentContainerStyle={styles.cardGrid}
					showsVerticalScrollIndicator={false}
					columnWrapperStyle={styles.columnWrapper}
				/>
			</View>
		</SafeAreaView>
	);
};

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 2 columns with padding

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	containerDark: {
		backgroundColor: "#1a1a1a",
	},
	darkText: {
		color: "#f8f9fa",
	},
	header: {
		paddingTop: 50, // For status bar
		paddingBottom: 20,
		paddingHorizontal: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 4,
	},
	navbar: {
		flexDirection: "row",
		alignItems: "center",
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(255,255,255,0.2)",
	},
	titleContainer: {
		flex: 1,
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "white",
		textAlign: "center",
	},
	headerSubtitle: {
		fontSize: 14,
		color: "rgba(255,255,255,0.8)",
		marginTop: 4,
		textAlign: "center",
	},
	content: {
		flex: 1,
		padding: 16,
	},
	contentDark: {
		backgroundColor: "#1a1a1a",
	},
	cardGrid: {
		padding: 0,
	},
	columnWrapper: {
		justifyContent: "space-between",
		marginBottom: 16,
	},
	cardContainer: {
		width: cardWidth,
		borderRadius: 8,
		overflow: "hidden",
		backgroundColor: "#fff",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	cardContainerDark: {
		backgroundColor: "#2D3748",
	},
	card: {
		width: "100%",
	},
	cardImageContainer: {
		height: 100,
		backgroundColor: "#EBF5FB",
		justifyContent: "center",
		alignItems: "center",
	},
	cardImageContainerDark: {
		backgroundColor: "#2A4365",
	},
	cardBody: {
		padding: 12,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	sourceText: {
		fontSize: 12,
		color: "#6c757d",
	},
	dateText: {
		fontSize: 12,
		color: "#6c757d",
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 8,
		color: "#333",
	},
	levelBadge: {
		alignSelf: "flex-start",
		paddingVertical: 2,
		paddingHorizontal: 8,
		borderRadius: 4,
	},
	levelBadgeText: {
		fontSize: 12,
		fontWeight: "500",
		color: "#fff",
	},
	// Level badge styles
	badgeA1: {
		backgroundColor: "#8bc34a", // Light green
	},
	badgeA2: {
		backgroundColor: "#4caf50", // Green
	},
	badgeB1: {
		backgroundColor: "#03a9f4", // Light blue
	},
	badgeB2: {
		backgroundColor: "#2196f3", // Blue
	},
	badgeC1: {
		backgroundColor: "#9c27b0", // Purple
	},
	badgeC2: {
		backgroundColor: "#673ab7", // Deep purple
	},
});

export default EffectiveCommunicationScreen;
