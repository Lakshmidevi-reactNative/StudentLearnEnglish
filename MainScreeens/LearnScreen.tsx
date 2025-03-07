import React from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image,
	Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS } from "./constants/Colors";

const { width } = Dimensions.get("window");

export default function LearnScreen() {
	const navigation = useNavigation();

	const learningOptions = [
		{
			icon: "headset",
			title: "ListenEng",
			color: COLORS.neonBlue,
			description: "Improve your listening skills with audio lessons",
			progress: 85,
			route: "Contents", // Changed to navigate to Contents screen
			redirectType: "listen", // Added param to identify the source
		},
		{
			icon: "microphone",
			title: "SpeakEng",
			color: COLORS.neonPurple,
			description: "Practice pronunciation and conversation",
			progress: 70,
			route: "SpeakEng", // Keeps navigating to SpeakEng directly
		},
		{
			icon: "book-open",
			title: "ReadEng",
			color: COLORS.neonGreen,
			description: "Enhance reading comprehension with diverse texts",
			progress: 90,
			route: "Contents", // Changed to navigate to Contents screen
			redirectType: "read", // Added param to identify the source
		},
		{
			icon: "pencil-alt",
			title: "WriteEng",
			color: COLORS.neonOrange,
			description: "Develop writing skills with guided exercises",
			progress: 65,
			route: "WriteEng", // Keeps navigating to WriteEng directly
		},
		{
			icon: "comment",
			title: "PromptEng",
			color: COLORS.neonPink,
			description: "Practice with AI conversation partners",
			progress: 75,
			route: "PromptEng", // Keeps navigating to PromptEng directly
		},
		{
			icon: "keyboard",
			title: "TypeEng",
			color: COLORS.neonYellow,
			description: "Improve typing speed and accuracy",
			progress: 65,
			route: "Contents", // Changed to navigate to Contents screen
			redirectType: "type", // Added param to identify the source
		},
	];

	// Handle navigation with source type
	const handleNavigation = (option) => {
		if (option.redirectType) {
			// For options that should go to ContentListTemplate
			navigation.navigate(option.route, { sourceType: option.redirectType });
		} else {
			// For options that go directly to their own screens
			navigation.navigate(option.route);
		}
	};

	return (
		<LinearGradient
			colors={[COLORS.deepBlue, COLORS.softPurple]}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>Learn & Practice</Text>
				</View>

				<ScrollView
					showsVerticalScrollIndicator={false}
					style={styles.scrollView}
				>
					<Text style={styles.sectionDescription}>
						Choose a learning activity to improve your English skills
					</Text>

					{learningOptions.map((option, index) => (
						<Animated.View
							key={index}
							entering={FadeInDown.delay(100 + index * 100).duration(600)}
						>
							<TouchableOpacity
								style={styles.activityCard}
								onPress={() => handleNavigation(option)}
							>
								<View
									style={[
										styles.iconContainer,
										{ backgroundColor: `${option.color}20` },
									]}
								>
									<FontAwesome5
										name={option.icon}
										size={28}
										color={option.color}
										style={[styles.glowIcon, { textShadowColor: option.color }]}
									/>
								</View>

								<View style={styles.activityContent}>
									<View style={styles.activityHeader}>
										<Text style={styles.activityTitle}>{option.title}</Text>
										<Text
											style={[
												styles.progressPercentage,
												{ color: option.color },
											]}
										>
											{option.progress}%
										</Text>
									</View>

									<Text style={styles.activityDescription}>
										{option.description}
									</Text>

									<View style={styles.progressContainer}>
										<View
											style={[
												styles.progressBar,
												{ backgroundColor: `${option.color}20` },
											]}
										>
											<View
												style={[
													styles.progressFill,
													{
														width: `${option.progress}%`,
														backgroundColor: option.color,
													},
												]}
											/>
										</View>
									</View>
								</View>
							</TouchableOpacity>
						</Animated.View>
					))}

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
		paddingHorizontal: 20,
		paddingVertical: 15,
		alignItems: "center",
	},
	headerTitle: {
		color: COLORS.textPrimary,
		fontSize: 22,
		fontWeight: "700",
		textShadowColor: COLORS.neonBlue,
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 10,
	},
	scrollView: {
		paddingHorizontal: 20,
	},
	sectionDescription: {
		color: COLORS.textSecondary,
		fontSize: 16,
		marginBottom: 20,
		textAlign: "center",
	},
	activityCard: {
		flexDirection: "row",
		backgroundColor: COLORS.cardBg,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
		padding: 15,
		marginBottom: 16,
		alignItems: "center",
	},
	iconContainer: {
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 15,
	},
	activityContent: {
		flex: 1,
	},
	activityHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 5,
	},
	activityTitle: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "700",
	},
	progressPercentage: {
		fontSize: 14,
		fontWeight: "600",
	},
	activityDescription: {
		color: COLORS.textSecondary,
		fontSize: 14,
		marginBottom: 10,
	},
	progressContainer: {
		width: "100%",
	},
	progressBar: {
		height: 6,
		borderRadius: 3,
		width: "100%",
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		borderRadius: 3,
	},
	glowIcon: {
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 10,
	},
});
