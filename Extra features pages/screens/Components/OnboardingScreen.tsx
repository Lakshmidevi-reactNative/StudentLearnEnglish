import React, { useState, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ScrollView,
	Animated,
	SafeAreaView,
	StatusBar,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	useWindowDimensions,
	Dimensions,
	ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
	MaterialIcons,
	FontAwesome5,
	MaterialCommunityIcons,
	Ionicons,
} from "@expo/vector-icons";
import PremiumSubscriptionModal from "./PremiumSubscriptionModal"; // Adjust path as needed

// New modern color palette with a more minimalist aesthetic
const COLORS = {
	primary: "#3B82F6", // Blue
	primaryLight: "#93C5FD", // Light Blue
	secondary: "#10B981", // Emerald
	text: "#1E293B", // Slate 800
	textLight: "#64748B", // Slate 500
	background: "#FFFFFF", // White
	surface: "#F8FAFC", // Slate 50
	border: "#E2E8F0", // Slate 200
	accent: "#8B5CF6", // Violet
	success: "#22C55E", // Green
	error: "#EF4444", // Red
	warning: "#F59E0B", // Amber
	dark: "#0F172A", // Slate 900
	white: "#FFFFFF",
};

const { width, height } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
	const { width: windowWidth, height: windowHeight } = useWindowDimensions();
	const [currentScreen, setCurrentScreen] = useState(0);
	const [selectedLevel, setSelectedLevel] = useState(null);
	const [selectedGoals, setSelectedGoals] = useState([]);
	const [classCode, setClassCode] = useState("");
	const [isAnimating, setIsAnimating] = useState(false);
	const [premiumModalVisible, setPremiumModalVisible] = useState(false);

	// Animation values
	const fadeAnim = useRef(new Animated.Value(1)).current;
	const slideAnim = useRef(new Animated.Value(0)).current;

	// Screen data
	const screens = [
		{
			id: "welcome",
			title: "Welcome to LearnEng",
			subtitle: "Let's start your journey",
			description:
				"Personalized English learning with interactive lessons, practice sessions, and Class Works.",
		},
		{
			id: "level",
			title: "Your Proficiency",
			subtitle: "Where are you now?",
			description:
				"Help us personalize your experience by selecting your current level.",
		},
		{
			id: "goals",
			title: "Learning Focus",
			subtitle: "What's important to you?",
			description:
				"Select the areas you'd like to prioritize in your learning journey.",
		},
		{
			id: "join",
			title: "Final Step",
			subtitle: "Join a class or create your account",
			description:
				"Enter your teacher's class code or create your personal account.",
		},
	];

	// Levels data
	const levels = [
		{
			id: "beginner",
			name: "Beginner",
			description: "Little to no prior knowledge",
			icon: "star-outline",
		},
		{
			id: "elementary",
			name: "Elementary",
			description: "Basic phrases and expressions",
			icon: "star-half",
		},
		{
			id: "intermediate",
			name: "Intermediate",
			description: "Can discuss familiar topics",
			icon: "star",
		},
		{
			id: "advanced",
			name: "Advanced",
			description: "Fluent in most situations",
			icon: "stars",
		},
		{
			id: "fluent",
			name: "Near Native",
			description: "Almost like a native speaker",
			icon: "auto-awesome",
		},
	];

	// Goals data with updated colors
	const goals = [
		{
			id: "conversation",
			name: "Conversation",
			description: "Improve your speaking and listening",
			icon: "chat",
			color: "#3B82F6", // Blue
		},
		{
			id: "business",
			name: "Business English",
			description: "For workplace and professional settings",
			icon: "business-center",
			color: "#0EA5E9", // Sky Blue
		},
		{
			id: "travel",
			name: "Travel & Culture",
			description: "Get around in English-speaking countries",
			icon: "flight",
			color: "#F97316", // Orange
		},
		{
			id: "academic",
			name: "Academic English",
			description: "For studying and research purposes",
			icon: "school",
			color: "#8B5CF6", // Violet
		},
		{
			id: "exam",
			name: "Exam Preparation",
			description: "TOEFL, IELTS, Cambridge and more",
			icon: "assignment",
			color: "#EC4899", // Pink
		},
	];

	// Handle screen transition
	const goToScreen = (index) => {
		if (isAnimating) return;

		if (index >= 0 && index < screens.length) {
			setIsAnimating(true);

			// Fade out current screen
			Animated.parallel([
				Animated.timing(fadeAnim, {
					toValue: 0,
					duration: 250,
					useNativeDriver: true,
				}),
				Animated.timing(slideAnim, {
					toValue: index > currentScreen ? -100 : 100,
					duration: 250,
					useNativeDriver: true,
				}),
			]).start(() => {
				setCurrentScreen(index);
				slideAnim.setValue(index > currentScreen ? 100 : -100);

				// Fade in new screen
				Animated.parallel([
					Animated.timing(fadeAnim, {
						toValue: 1,
						duration: 250,
						useNativeDriver: true,
					}),
					Animated.timing(slideAnim, {
						toValue: 0,
						duration: 250,
						useNativeDriver: true,
					}),
				]).start(() => {
					setIsAnimating(false);
				});
			});
		}
	};

	const handleNext = () => {
		if (currentScreen < screens.length - 1) {
			goToScreen(currentScreen + 1);
		} else {
			// Complete onboarding
			navigation.navigate("MainApp", {
				userData: {
					proficiencyLevel: selectedLevel,
					learningGoals: selectedGoals,
					classCode: classCode || null,
				},
			});
		}
	};

	const handleBack = () => {
		if (currentScreen > 0) {
			goToScreen(currentScreen - 1);
		}
	};

	const handleSkip = () => {
		navigation.navigate("MainApp");
	};

	const toggleGoal = (goalId) => {
		if (selectedGoals.includes(goalId)) {
			setSelectedGoals(selectedGoals.filter((id) => id !== goalId));
		} else {
			setSelectedGoals([...selectedGoals, goalId]);
		}
	};

	const premiumlevel = () => {
		setPremiumModalVisible(true);
	};

	// Render welcome screen - completely redesigned
	const renderWelcomeScreen = () => (
		<View style={styles.screenContent}>
			<View style={styles.welcomeImageContainer}>
				<Image
					source={require("../../assets/icon.png")}
					style={styles.welcomeImage}
					resizeMode="contain"
				/>
			</View>

			<View style={styles.welcomeFeatures}>
				{[
					{
						icon: "school",
						text: "Interactive LSRWTP Modules",
						desc: "Tailored to your goals",
					},
					{
						icon: "chat",
						text: "Progress Tracking & Analytics",
						desc: "With AI technology",
					},
					{
						icon: "analytics",
						text: "Complete Assessments and Assignments",
						desc: "See your improvement",
					},
					{
						icon: "emoji-events",
						text: "Learn English From Expert",
						desc: "Make learning fun",
					},
				].map((feature, index) => (
					<View key={index} style={styles.welcomeFeatureItem}>
						<View style={styles.welcomeFeatureIcon}>
							<MaterialIcons
								name={feature.icon}
								size={22}
								color={COLORS.primary}
							/>
						</View>
						<View style={styles.welcomeFeatureTextContainer}>
							<Text style={styles.welcomeFeatureText}>{feature.text}</Text>
							<Text style={styles.welcomeFeatureSubtext}>{feature.desc}</Text>
						</View>
					</View>
				))}
			</View>
		</View>
	);

	// Render level selection screen - redesigned
	const renderLevelScreen = () => (
		<View style={styles.screenContent}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.levelContainer}
			>
				{levels.map((level) => (
					<TouchableOpacity
						key={level.id}
						style={[
							styles.levelCard,
							selectedLevel === level.id && styles.selectedCard,
						]}
						onPress={() => setSelectedLevel(level.id)}
					>
						<View
							style={[
								styles.levelIconContainer,
								selectedLevel === level.id && styles.selectedLevelIconContainer,
							]}
						>
							<MaterialIcons
								name={level.icon}
								size={24}
								color={
									selectedLevel === level.id ? COLORS.white : COLORS.primary
								}
							/>
						</View>

						<View style={styles.levelTextContainer}>
							<Text
								style={[
									styles.levelTitle,
									selectedLevel === level.id && styles.selectedCardText,
								]}
							>
								{level.name}
							</Text>
							<Text
								style={[
									styles.levelDescription,
									selectedLevel === level.id && styles.selectedCardTextLight,
								]}
							>
								{level.description}
							</Text>
						</View>

						<View
							style={[
								styles.levelSelector,
								selectedLevel === level.id && styles.selectedLevelSelector,
							]}
						>
							{selectedLevel === level.id && (
								<MaterialIcons name="check" size={16} color={COLORS.white} />
							)}
						</View>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);

	// Render goals selection screen - redesigned with cards
	const renderGoalsScreen = () => (
		<View style={styles.screenContent}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.goalsContainer}
			>
				<View style={styles.goalCardsWrapper}>
					{goals.map((goal) => (
						<TouchableOpacity
							key={goal.id}
							style={[
								styles.goalCard,
								selectedGoals.includes(goal.id) && styles.selectedGoalCard,
								{
									borderColor: selectedGoals.includes(goal.id)
										? goal.color
										: "transparent",
								},
							]}
							onPress={() => toggleGoal(goal.id)}
						>
							<View
								style={[
									styles.goalIconContainer,
									{
										backgroundColor: selectedGoals.includes(goal.id)
											? goal.color
											: COLORS.surface,
									},
								]}
							>
								<MaterialIcons
									name={goal.icon}
									size={24}
									color={
										selectedGoals.includes(goal.id) ? COLORS.white : goal.color
									}
								/>
							</View>

							<Text style={styles.goalTitle}>{goal.name}</Text>
							<Text style={styles.goalDescription} numberOfLines={2}>
								{goal.description}
							</Text>

							<View
								style={[
									styles.goalCheckbox,
									selectedGoals.includes(goal.id) && {
										backgroundColor: goal.color,
										borderColor: goal.color,
									},
								]}
							>
								{selectedGoals.includes(goal.id) && (
									<MaterialIcons name="check" size={14} color={COLORS.white} />
								)}
							</View>
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>
		</View>
	);

	// Render join screen - redesigned with a more modern look
	const renderJoinScreen = () => (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.screenContent}
		>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.joinContainer}
			>
				<View style={styles.joinOption}>
					<View style={styles.joinOptionHeader}>
						<MaterialIcons name="class" size={22} color={COLORS.primary} />
						<Text style={styles.joinOptionTitle}>Join a Class</Text>
					</View>

					<Text style={styles.joinOptionDescription}>
						Enter the 6-digit code provided by your teacher
					</Text>

					<View style={styles.codeInputContainer}>
						<TextInput
							style={styles.codeInput}
							placeholder="Enter class code"
							placeholderTextColor={COLORS.textLight}
							value={classCode}
							onChangeText={setClassCode}
							maxLength={6}
							keyboardType="number-pad"
						/>

						<TouchableOpacity
							style={[
								styles.joinButton,
								{ opacity: classCode.length === 6 ? 1 : 0.5 },
							]}
							disabled={classCode.length !== 6}
							onPress={() => navigation.navigate("MainApp", { classCode })}
						>
							<Text style={styles.joinButtonText}>Join</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.divider}>
					<View style={styles.dividerLine} />
					<Text style={styles.dividerText}>OR</Text>
					<View style={styles.dividerLine} />
				</View>

				<TouchableOpacity style={styles.premiumOption} onPress={premiumlevel}>
					<LinearGradient
						colors={["#3B82F6", "#8B5CF6"]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						style={styles.premiumGradient}
					>
						<View style={styles.premiumContent}>
							<View style={styles.premiumIconContainer}>
								<MaterialCommunityIcons
									name="crown"
									size={24}
									color={COLORS.white}
								/>
							</View>

							<View style={styles.premiumTextContainer}>
								<Text style={styles.premiumTitle}>Get Premium Access</Text>
								<Text style={styles.premiumDescription}>
									Unlock all features and personalized content
								</Text>
							</View>

							<MaterialIcons
								name="arrow-forward"
								size={24}
								color={COLORS.white}
							/>
						</View>
					</LinearGradient>
				</TouchableOpacity>
			</ScrollView>
		</KeyboardAvoidingView>
	);

	// Render screen based on current index
	const renderCurrentScreen = () => {
		switch (currentScreen) {
			case 0:
				return renderWelcomeScreen();
			case 1:
				return renderLevelScreen();
			case 2:
				return renderGoalsScreen();
			case 3:
				return renderJoinScreen();
			default:
				return null;
		}
	};

	// Get button text based on current screen
	const getButtonText = () => {
		if (currentScreen === screens.length - 1) {
			return "Get Started";
		}

		switch (currentScreen) {
			case 0:
				return "Continue";
			case 1:
				return selectedLevel ? "Continue" : "Select Level";
			case 2:
				return selectedGoals.length > 0 ? "Continue" : "Select Goals";
			default:
				return "Next";
		}
	};

	// Get button disabled state
	const isButtonDisabled = () => {
		switch (currentScreen) {
			case 1:
				return !selectedLevel;
			case 2:
				return selectedGoals.length === 0;
			default:
				return false;
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

			{/* Progress Bar */}
			<View style={styles.progressContainer}>
				{screens.map((_, index) => (
					<View
						key={index}
						style={[styles.progressBarTrack, { flex: 1, marginHorizontal: 3 }]}
					>
						<View
							style={[
								styles.progressBarFill,
								{
									width: index <= currentScreen ? "100%" : "0%",
								},
							]}
						/>
					</View>
				))}
			</View>

			{/* Main scrollable container */}
			<ScrollView
				style={styles.mainScrollView}
				contentContainerStyle={styles.mainScrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Screen Content */}
				<Animated.View
					style={[
						styles.screenWrapper,
						{
							opacity: fadeAnim,
							transform: [{ translateX: slideAnim }],
						},
					]}
				>
					<View style={styles.headerContainer}>
						<Text style={styles.headerTitle}>
							{screens[currentScreen].title}
						</Text>
						<Text style={styles.headerSubtitle}>
							{screens[currentScreen].subtitle}
						</Text>
						<Text style={styles.headerDescription}>
							{screens[currentScreen].description}
						</Text>
					</View>

					{renderCurrentScreen()}
				</Animated.View>
			</ScrollView>

			{/* Navigation Buttons - Fixed at bottom */}
			<View style={styles.navigationContainer}>
				{currentScreen > 0 ? (
					<TouchableOpacity
						style={styles.backButton}
						onPress={handleBack}
						disabled={isAnimating}
					>
						<MaterialIcons
							name="arrow-back-ios"
							size={18}
							color={COLORS.text}
						/>
					</TouchableOpacity>
				) : (
					<View style={styles.emptyBackButton} />
				)}

				<View style={styles.navigationButtonsRight}>
					{currentScreen < screens.length - 1 && (
						<TouchableOpacity
							style={styles.skipButton}
							onPress={handleSkip}
							disabled={isAnimating}
						>
							<Text style={styles.skipText}>Skip</Text>
						</TouchableOpacity>
					)}

					<TouchableOpacity
						style={[
							styles.nextButton,
							isButtonDisabled() && styles.disabledButton,
						]}
						onPress={handleNext}
						disabled={isButtonDisabled() || isAnimating}
					>
						<Text style={styles.nextButtonText}>{getButtonText()}</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Premium Subscription Modal */}
			<PremiumSubscriptionModal
				visible={premiumModalVisible}
				onClose={() => setPremiumModalVisible(false)}
				navigation={navigation}
				userData={{
					proficiencyLevel: selectedLevel,
					learningGoals: selectedGoals,
				}}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 50,
		flex: 1,
		backgroundColor: COLORS.background,
	},
	mainScrollView: {
		flex: 1,
	},
	mainScrollContent: {
		flexGrow: 1,
		paddingBottom: 100, // Space for navigation
	},
	progressContainer: {
		flexDirection: "row",
		paddingHorizontal: 24,
		paddingTop: 16,
		paddingBottom: 12,
	},
	progressBarTrack: {
		height: 4,
		backgroundColor: COLORS.border,
		borderRadius: 2,
		overflow: "hidden",
	},
	progressBarFill: {
		height: "100%",
		backgroundColor: COLORS.primary,
		borderRadius: 2,
	},
	screenWrapper: {
		flex: 1,
		paddingHorizontal: 24,
	},
	headerContainer: {
		marginBottom: 32,
	},
	headerTitle: {
		fontSize: 28,
		fontWeight: "700",
		color: COLORS.text,
		marginBottom: 10,
	},
	headerSubtitle: {
		fontSize: 18,
		fontWeight: "600",
		color: COLORS.primary,
		marginBottom: 12,
	},
	headerDescription: {
		fontSize: 16,
		color: COLORS.textLight,
		lineHeight: 24,
	},
	screenContent: {
		flex: 1,
	},

	// Welcome screen styles - redesigned
	welcomeImageContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 32,
	},
	welcomeImage: {
		width: 160,
		height: 160,
	},
	welcomeFeatures: {
		marginBottom: 24,
	},
	welcomeFeatureItem: {
		flexDirection: "row",
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
		alignItems: "center",
	},
	welcomeFeatureIcon: {
		width: 44,
		height: 44,
		borderRadius: 12,
		backgroundColor: COLORS.surface,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 16,
	},
	welcomeFeatureTextContainer: {
		flex: 1,
	},
	welcomeFeatureText: {
		fontSize: 16,
		fontWeight: "600",
		color: COLORS.text,
		marginBottom: 4,
	},
	welcomeFeatureSubtext: {
		fontSize: 14,
		color: COLORS.textLight,
	},

	// Level screen styles - redesigned
	levelContainer: {
		paddingBottom: 24,
	},
	levelCard: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: COLORS.surface,
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	selectedCard: {
		backgroundColor: COLORS.primary,
		borderColor: COLORS.primary,
	},
	levelIconContainer: {
		width: 48,
		height: 48,
		borderRadius: 12,
		backgroundColor: COLORS.white,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	selectedLevelIconContainer: {
		backgroundColor: COLORS.primaryLight,
	},
	levelTextContainer: {
		flex: 1,
	},
	levelTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: COLORS.text,
		marginBottom: 4,
	},
	levelDescription: {
		fontSize: 14,
		color: COLORS.textLight,
	},
	selectedCardText: {
		color: COLORS.white,
		fontWeight: "600",
	},
	selectedCardTextLight: {
		color: COLORS.white,
		opacity: 0.8,
	},
	levelSelector: {
		width: 24,
		height: 24,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: COLORS.border,
		justifyContent: "center",
		alignItems: "center",
	},
	selectedLevelSelector: {
		backgroundColor: COLORS.primaryLight,
		borderColor: COLORS.primaryLight,
	},

	// Goals screen styles - redesigned with cards
	goalsContainer: {
		paddingBottom: 24,
	},
	goalCardsWrapper: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	goalCard: {
		width: "48%",
		backgroundColor: COLORS.surface,
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
		borderWidth: 2,
		borderColor: "transparent",
		position: "relative",
	},
	selectedGoalCard: {
		backgroundColor: COLORS.white,
	},
	goalIconContainer: {
		width: 48,
		height: 48,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 12,
	},
	goalTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: COLORS.text,
		marginBottom: 4,
	},
	goalDescription: {
		fontSize: 13,
		color: COLORS.textLight,
		lineHeight: 18,
		marginBottom: 12,
		height: 36, // Limit to 2 lines
	},
	goalCheckbox: {
		width: 22,
		height: 22,
		borderRadius: 11,
		borderWidth: 2,
		borderColor: COLORS.border,
		position: "absolute",
		top: 12,
		right: 12,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: COLORS.white,
	},

	// Join screen styles - completely redesigned
	joinContainer: {
		paddingBottom: 24,
	},
	joinOption: {
		backgroundColor: COLORS.surface,
		borderRadius: 16,
		padding: 20,
		marginBottom: 24,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	joinOptionHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	joinOptionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: COLORS.text,
		marginLeft: 10,
	},
	joinOptionDescription: {
		fontSize: 15,
		color: COLORS.textLight,
		marginBottom: 20,
	},
	codeInputContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	codeInput: {
		flex: 1,
		height: 52,
		backgroundColor: COLORS.white,
		borderRadius: 12,
		paddingHorizontal: 16,
		fontSize: 16,
		color: COLORS.text,
		marginRight: 12,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	joinButton: {
		height: 52,
		paddingHorizontal: 24,
		backgroundColor: COLORS.primary,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
	},
	joinButtonText: {
		color: COLORS.white,
		fontSize: 16,
		fontWeight: "600",
	},
	divider: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 24,
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: COLORS.border,
	},
	dividerText: {
		marginHorizontal: 16,
		color: COLORS.textLight,
		fontSize: 14,
	},
	premiumOption: {
		borderRadius: 16,
		overflow: "hidden",
		marginBottom: 16,
	},
	premiumGradient: {
		padding: 20,
	},
	premiumContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	premiumIconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "rgba(255,255,255,0.2)",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	premiumTextContainer: {
		flex: 1,
	},
	premiumTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: COLORS.white,
		marginBottom: 4,
	},
	premiumDescription: {
		fontSize: 14,
		color: COLORS.white,
		opacity: 0.8,
	},

	// Navigation container - fixed at bottom with a cleaner look
	navigationContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 24,
		paddingVertical: 16,
		backgroundColor: COLORS.background,
		borderTopWidth: 1,
		borderTopColor: COLORS.border,
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 12,
		backgroundColor: COLORS.surface,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyBackButton: {
		width: 40,
	},
	navigationButtonsRight: {
		flexDirection: "row",
		alignItems: "center",
	},
	skipButton: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		marginRight: 8,
	},
	skipText: {
		color: COLORS.textLight,
		fontSize: 16,
	},
	nextButton: {
		height: 48,
		paddingHorizontal: 28,
		backgroundColor: COLORS.primary,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
	},
	disabledButton: {
		backgroundColor: COLORS.border,
	},
	nextButtonText: {
		color: COLORS.white,
		fontSize: 16,
		fontWeight: "600",
	},
});

export default OnboardingScreen;
