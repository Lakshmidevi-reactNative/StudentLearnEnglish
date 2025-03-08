import React, { useState, useRef, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	FlatList,
	Dimensions,
	Image,
	SafeAreaView,
	StatusBar,
	TextInput,
	ScrollView,
} from "react-native";
import { useTheme } from "../constants/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import getAuthColors from "./AuthColors";

const { width, height } = Dimensions.get("window");

// Language options for mother tongue selection
const LANGUAGES = [
	"Hindi",
	"Bengali",
	"Telugu",
	"Marathi",
	"Tamil",
	"Urdu",
	"Gujarati",
	"Kannada",
	"Odia",
	"Punjabi",
	"Malayalam",
	"Arabic",
	"Spanish",
	"French",
	"German",
	"Chinese",
	"Japanese",
	"Korean",
	"Russian",
	"Portuguese",
	"Other",
];

// English proficiency levels
const LEVELS = [
	{
		id: "beginner",
		label: "Beginner",
		description: "I know a few words and phrases",
	},
	{
		id: "lower_intermediate",
		label: "Lower Intermediate",
		description: "I can have simple conversations",
	},
	{
		id: "intermediate",
		label: "Intermediate",
		description: "I can express myself on many topics",
	},
	{
		id: "upper_intermediate",
		label: "Upper Intermediate",
		description: "I can communicate fluently with few errors",
	},
	{
		id: "advanced",
		label: "Advanced",
		description: "I'm nearly fluent in English",
	},
];

// Learning goals
const GOALS = [
	{ id: "education", icon: "school", label: "Support my education" },
	{ id: "career", icon: "business", label: "Boost my career" },
	{ id: "connect", icon: "people", label: "Connect with people" },
	{ id: "travel", icon: "airplane", label: "Prepare to travel" },
	{ id: "relocate", icon: "map", label: "Move to another country" },
];

// Education levels
const EDUCATION_LEVELS = [
	{
		id: "school",
		label: "School",
		description: "Primary or secondary education",
	},
	{
		id: "intermediate",
		label: "Intermediate",
		description: "Junior college or high school",
	},
	{
		id: "undergraduate",
		label: "Undergraduate",
		description: "Bachelor's degree",
	},
	{ id: "graduate", label: "Graduate", description: "Master's degree" },
	{
		id: "postgraduate",
		label: "Postgraduate",
		description: "Doctorate or PhD",
	},
	{
		id: "professional",
		label: "Professional",
		description: "Professional certification or training",
	},
];

// Regions for travel or relocation
const REGIONS = [
	{ id: "usa", label: "United States", flag: "🇺🇸" },
	{ id: "uk", label: "United Kingdom", flag: "🇬🇧" },
	{ id: "canada", label: "Canada", flag: "🇨🇦" },
	{ id: "australia", label: "Australia", flag: "🇦🇺" },
	{ id: "newzealand", label: "New Zealand", flag: "🇳🇿" },
	{ id: "europe", label: "Europe", flag: "🇪🇺" },
	{ id: "asia", label: "Asia", flag: "🌏" },
	{ id: "other", label: "Other Regions", flag: "🌍" },
];

// User reviews for career and connection goals
const USER_REVIEWS = [
	{
		id: 1,
		name: "Sarah K.",
		role: "Software Engineer",
		rating: 5,
		review:
			"LearnEng helped me improve my technical English, which was crucial for my job interviews with international companies.",
		photo: require("../../assets/icon.png"), // Replace with actual photo
		goal: "career",
	},
	{
		id: 2,
		name: "Michael T.",
		role: "Marketing Manager",
		rating: 5,
		review:
			"The business English modules were exactly what I needed to boost my confidence in meetings with global clients.",
		photo: require("../../assets/icon.png"), // Replace with actual photo
		goal: "career",
	},
	{
		id: 3,
		name: "Raj P.",
		role: "International Student",
		rating: 5,
		review:
			"I've made friends from all over the world thanks to the conversation practice in LearnEng.",
		photo: require("../../assets/icon.png"), // Replace with actual photo
		goal: "connect",
	},
	{
		id: 4,
		name: "Elena M.",
		role: "Travel Enthusiast",
		rating: 4,
		review:
			"The app's social features helped me connect with locals before my trip abroad. Made my travels so much more authentic!",
		photo: require("../../assets/icon.png"), // Replace with actual photo
		goal: "connect",
	},
];

const OnboardingScreen = ({ navigation, route }) => {
	const { theme, colors } = useTheme();
	const isDarkMode = theme === "dark";
	const authColors = getAuthColors(isDarkMode);

	// Get user's name from signup page
	const userName = route?.params?.firstName || "there";

	// ===== IMPORTANT CHANGES BEGIN =====
	// We need to generate all possible phases up front instead of dynamically adding them
	// Create array of ALL possible screen indices
	const ALL_PHASES = [0, 1, 2, 3, 4, 5, 6, 7];

	// State to track which phases are active and visible in the flow
	const [activePhases, setActivePhases] = useState([0, 1, 2, 3]);
	const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
	// ===== IMPORTANT CHANGES END =====

	const [motherTongue, setMotherTongue] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedLevel, setSelectedLevel] = useState(null);
	const [selectedGoals, setSelectedGoals] = useState([]);
	const [educationLevel, setEducationLevel] = useState(null);
	const [selectedRegion, setSelectedRegion] = useState(null);
	const flatListRef = useRef(null);

	// Filter languages based on search query
	const filteredLanguages = LANGUAGES.filter((lang) =>
		lang.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Toggle goal selection
	const toggleGoal = (goalId) => {
		if (selectedGoals.includes(goalId)) {
			setSelectedGoals(selectedGoals.filter((id) => id !== goalId));
		} else {
			setSelectedGoals([...selectedGoals, goalId]);
		}
	};

	// Filter reviews based on selected goals
	const filteredReviews = USER_REVIEWS.filter((review) =>
		selectedGoals.includes(review.goal)
	);

	// Effect to update active phases based on selected goals
	useEffect(() => {
		let newActivePhases = [0, 1, 2, 3]; // Base phases

		if (selectedGoals.includes("education")) {
			// Add education level phase
			newActivePhases.push(4);
		}

		if (selectedGoals.includes("career") || selectedGoals.includes("connect")) {
			// Add reviews phase
			newActivePhases.push(5);
		}

		if (
			selectedGoals.includes("travel") ||
			selectedGoals.includes("relocate")
		) {
			// Add region selection phase
			newActivePhases.push(6);
		}

		// Add final phase
		newActivePhases.push(7);

		// Update active phases
		setActivePhases(newActivePhases);
	}, [selectedGoals]);

	// ===== IMPORTANT CHANGES BEGIN =====
	// Get the current screen index based on the phase index in activePhases
	const currentScreen = activePhases[currentPhaseIndex];

	const handleNext = () => {
		// Check if there is a next phase in our active phases
		if (currentPhaseIndex < activePhases.length - 1) {
			// Only increment the phase index, not the screen index
			setCurrentPhaseIndex(currentPhaseIndex + 1);
		} else {
			// Last phase - go to main app
			navigation.replace("Main");
		}
	};

	const handlePrevious = () => {
		if (currentPhaseIndex > 0) {
			setCurrentPhaseIndex(currentPhaseIndex - 1);
		}
	};
	// ===== IMPORTANT CHANGES END =====

	const handleSkip = () => {
		// Skip onboarding and go directly to main app
		navigation.replace("Main");
	};

	// Render welcome phase
	const renderWelcome = () => (
		<View style={styles.phaseContainer}>
			<Image
				source={require("../../assets/icon.png")}
				style={styles.welcomeImage}
				resizeMode="contain"
			/>
			<Text style={[styles.welcomeTitle, { color: authColors.titleText }]}>
				Welcome, {userName}!
			</Text>
			<Text
				style={[styles.welcomeSubtitle, { color: authColors.secondaryText }]}
			>
				We're excited to have you join LearnEng. Let's personalize your learning
				experience.
			</Text>

			<View style={styles.featuresContainer}>
				<View style={styles.featureItem}>
					<View style={[styles.featureIcon, { backgroundColor: "#4A90E220" }]}>
						<Ionicons name="book" size={24} color="#4A90E2" />
					</View>
					<View style={styles.featureTextContainer}>
						<Text
							style={[styles.featureTitle, { color: authColors.primaryText }]}
						>
							Personalized Learning
						</Text>
						<Text
							style={[styles.featureDesc, { color: authColors.secondaryText }]}
						>
							Lessons tailored to your level and goals
						</Text>
					</View>
				</View>

				<View style={styles.featureItem}>
					<View style={[styles.featureIcon, { backgroundColor: "#9B59B620" }]}>
						<Ionicons name="mic" size={24} color="#9B59B6" />
					</View>
					<View style={styles.featureTextContainer}>
						<Text
							style={[styles.featureTitle, { color: authColors.primaryText }]}
						>
							Practice Speaking
						</Text>
						<Text
							style={[styles.featureDesc, { color: authColors.secondaryText }]}
						>
							Improve your pronunciation and fluency
						</Text>
					</View>
				</View>

				<View style={styles.featureItem}>
					<View style={[styles.featureIcon, { backgroundColor: "#2ECC7120" }]}>
						<Ionicons name="stats-chart" size={24} color="#2ECC71" />
					</View>
					<View style={styles.featureTextContainer}>
						<Text
							style={[styles.featureTitle, { color: authColors.primaryText }]}
						>
							Track Progress
						</Text>
						<Text
							style={[styles.featureDesc, { color: authColors.secondaryText }]}
						>
							See your improvement over time
						</Text>
					</View>
				</View>
			</View>
		</View>
	);

	// Render mother tongue selection phase
	const renderMotherTongue = () => (
		<View style={styles.phaseContainer}>
			<Text style={[styles.phaseTitle, { color: authColors.titleText }]}>
				What's your mother tongue?
			</Text>
			<Text style={[styles.phaseSubtitle, { color: authColors.secondaryText }]}>
				This helps us tailor lessons to address common challenges for speakers
				of your language.
			</Text>

			<View style={styles.searchContainer}>
				<View
					style={[
						styles.searchWrapper,
						{
							backgroundColor: authColors.inputBackground,
							borderColor: authColors.inputBorder,
						},
					]}
				>
					<Ionicons
						name="search"
						size={20}
						color={authColors.icon}
						style={styles.searchIcon}
					/>
					<TextInput
						style={[styles.searchInput, { color: authColors.primaryText }]}
						placeholder="Search languages..."
						placeholderTextColor={authColors.placeholder}
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
					{searchQuery ? (
						<TouchableOpacity onPress={() => setSearchQuery("")}>
							<Ionicons
								name="close-circle"
								size={20}
								color={authColors.icon}
								style={styles.clearIcon}
							/>
						</TouchableOpacity>
					) : null}
				</View>
			</View>

			<ScrollView style={styles.languageList}>
				{filteredLanguages.map((language) => (
					<TouchableOpacity
						key={language}
						style={[
							styles.languageItem,
							motherTongue === language && {
								backgroundColor: `${authColors.primaryButton}20`,
								borderColor: authColors.primaryButton,
							},
						]}
						onPress={() => setMotherTongue(language)}
					>
						<Text
							style={[
								styles.languageText,
								{ color: authColors.primaryText },
								motherTongue === language && {
									color: authColors.primaryButton,
									fontWeight: "600",
								},
							]}
						>
							{language}
						</Text>
						{motherTongue === language && (
							<Ionicons
								name="checkmark-circle"
								size={22}
								color={authColors.primaryButton}
							/>
						)}
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);

	// Render English level selection phase
	const renderEnglishLevel = () => (
		<View style={styles.phaseContainer}>
			<Text style={[styles.phaseTitle, { color: authColors.titleText }]}>
				What's your English level?
			</Text>
			<Text style={[styles.phaseSubtitle, { color: authColors.secondaryText }]}>
				Select the option that best describes your current proficiency.
			</Text>

			<View style={styles.levelList}>
				{LEVELS.map((level) => (
					<TouchableOpacity
						key={level.id}
						style={[
							styles.levelItem,
							selectedLevel === level.id && {
								backgroundColor: `${authColors.primaryButton}20`,
								borderColor: authColors.primaryButton,
							},
						]}
						onPress={() => setSelectedLevel(level.id)}
					>
						<View style={styles.levelHeader}>
							<Text
								style={[
									styles.levelTitle,
									{ color: authColors.primaryText },
									selectedLevel === level.id && {
										color: authColors.primaryButton,
									},
								]}
							>
								{level.label}
							</Text>
							{selectedLevel === level.id && (
								<Ionicons
									name="checkmark-circle"
									size={22}
									color={authColors.primaryButton}
								/>
							)}
						</View>
						<Text
							style={[styles.levelDesc, { color: authColors.secondaryText }]}
						>
							{level.description}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);

	// Render goals selection phase
	const renderGoals = () => (
		<View style={styles.phaseContainer}>
			<Text style={[styles.phaseTitle, { color: authColors.titleText }]}>
				Why are you learning English?
			</Text>
			<Text style={[styles.phaseSubtitle, { color: authColors.secondaryText }]}>
				Select all that apply. This helps us recommend the most relevant
				content.
			</Text>

			<View style={styles.goalsList}>
				{GOALS.map((goal) => (
					<TouchableOpacity
						key={goal.id}
						style={[
							styles.goalItem,
							selectedGoals.includes(goal.id) && {
								backgroundColor: `${authColors.primaryButton}20`,
								borderColor: authColors.primaryButton,
							},
						]}
						onPress={() => toggleGoal(goal.id)}
					>
						<View
							style={[
								styles.goalIcon,
								selectedGoals.includes(goal.id)
									? { backgroundColor: authColors.primaryButton }
									: { backgroundColor: authColors.divider },
							]}
						>
							<Ionicons name={goal.icon} size={24} color="#FFFFFF" />
						</View>
						<Text
							style={[
								styles.goalText,
								{ color: authColors.primaryText },
								selectedGoals.includes(goal.id) && {
									color: authColors.primaryButton,
									fontWeight: "600",
								},
							]}
						>
							{goal.label}
						</Text>
						{selectedGoals.includes(goal.id) && (
							<Ionicons
								name="checkmark-circle"
								size={22}
								color={authColors.primaryButton}
								style={styles.goalCheck}
							/>
						)}
					</TouchableOpacity>
				))}
			</View>
		</View>
	);

	// Render education level selection (conditional phase)
	const renderEducationLevel = () => (
		<View style={styles.phaseContainer}>
			<Text style={[styles.phaseTitle, { color: authColors.titleText }]}>
				What's your current education level?
			</Text>
			<Text style={[styles.phaseSubtitle, { color: authColors.secondaryText }]}>
				We'll recommend content relevant to your academic needs.
			</Text>

			<View style={styles.levelList}>
				{EDUCATION_LEVELS.map((level) => (
					<TouchableOpacity
						key={level.id}
						style={[
							styles.levelItem,
							educationLevel === level.id && {
								backgroundColor: `${authColors.primaryButton}20`,
								borderColor: authColors.primaryButton,
							},
						]}
						onPress={() => setEducationLevel(level.id)}
					>
						<View style={styles.levelHeader}>
							<Text
								style={[
									styles.levelTitle,
									{ color: authColors.primaryText },
									educationLevel === level.id && {
										color: authColors.primaryButton,
									},
								]}
							>
								{level.label}
							</Text>
							{educationLevel === level.id && (
								<Ionicons
									name="checkmark-circle"
									size={22}
									color={authColors.primaryButton}
								/>
							)}
						</View>
						<Text
							style={[styles.levelDesc, { color: authColors.secondaryText }]}
						>
							{level.description}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);

	// Render user reviews (conditional phase)
	const renderReviews = () => (
		<View style={styles.phaseContainer}>
			<Text style={[styles.phaseTitle, { color: authColors.titleText }]}>
				Success Stories from LearnEng
			</Text>
			<Text style={[styles.phaseSubtitle, { color: authColors.secondaryText }]}>
				See how others achieved their goals with LearnEng.
			</Text>

			<ScrollView style={styles.reviewsList}>
				{filteredReviews.map((review) => (
					<View
						key={review.id}
						style={[
							styles.reviewCard,
							{ backgroundColor: authColors.cardBackground },
						]}
					>
						<View style={styles.reviewHeader}>
							<Image source={review.photo} style={styles.reviewerPhoto} />
							<View style={styles.reviewerInfo}>
								<Text
									style={[
										styles.reviewerName,
										{ color: authColors.primaryText },
									]}
								>
									{review.name}
								</Text>
								<Text
									style={[
										styles.reviewerRole,
										{ color: authColors.secondaryText },
									]}
								>
									{review.role}
								</Text>
							</View>
						</View>

						<View style={styles.ratingContainer}>
							{[1, 2, 3, 4, 5].map((star) => (
								<Ionicons
									key={star}
									name={star <= review.rating ? "star" : "star-outline"}
									size={18}
									color="#FFD700"
									style={styles.starIcon}
								/>
							))}
						</View>

						<Text
							style={[styles.reviewText, { color: authColors.secondaryText }]}
						>
							"{review.review}"
						</Text>
					</View>
				))}
			</ScrollView>
		</View>
	);

	// Render region selection (conditional phase)
	const renderRegionSelection = () => (
		<View style={styles.phaseContainer}>
			<Text style={[styles.phaseTitle, { color: authColors.titleText }]}>
				{selectedGoals.includes("travel")
					? "Where do you plan to travel?"
					: "Where do you plan to relocate?"}
			</Text>
			<Text style={[styles.phaseSubtitle, { color: authColors.secondaryText }]}>
				We'll prioritize content relevant to your destination.
			</Text>

			<View style={styles.regionsList}>
				{REGIONS.map((region) => (
					<TouchableOpacity
						key={region.id}
						style={[
							styles.regionItem,
							selectedRegion === region.id && {
								backgroundColor: `${authColors.primaryButton}20`,
								borderColor: authColors.primaryButton,
							},
						]}
						onPress={() => setSelectedRegion(region.id)}
					>
						<Text style={styles.regionFlag}>{region.flag}</Text>
						<Text
							style={[
								styles.regionText,
								{ color: authColors.primaryText },
								selectedRegion === region.id && {
									color: authColors.primaryButton,
									fontWeight: "600",
								},
							]}
						>
							{region.label}
						</Text>
						{selectedRegion === region.id && (
							<Ionicons
								name="checkmark-circle"
								size={22}
								color={authColors.primaryButton}
							/>
						)}
					</TouchableOpacity>
				))}
			</View>
		</View>
	);

	// Render final phase
	const renderFinalPhase = () => (
		<View style={styles.phaseContainer}>
			<Image
				source={require("../../assets/icon.png")}
				style={styles.finalImage}
				resizeMode="contain"
			/>
			<Text style={[styles.finalTitle, { color: authColors.titleText }]}>
				You're all set, {userName}!
			</Text>
			<Text style={[styles.finalSubtitle, { color: authColors.secondaryText }]}>
				We've personalized your learning experience based on your preferences.
				Let's start your English learning journey!
			</Text>

			<View style={styles.summaryContainer}>
				<Text style={[styles.summaryTitle, { color: authColors.primaryText }]}>
					Your Personalized Plan:
				</Text>

				<View style={styles.summaryItem}>
					<Ionicons
						name="globe-outline"
						size={22}
						color={authColors.primaryButton}
						style={styles.summaryIcon}
					/>
					<Text
						style={[styles.summaryText, { color: authColors.secondaryText }]}
					>
						Native language:{" "}
						<Text style={{ fontWeight: "600" }}>
							{motherTongue || "Not specified"}
						</Text>
					</Text>
				</View>

				<View style={styles.summaryItem}>
					<Ionicons
						name="school-outline"
						size={22}
						color={authColors.primaryButton}
						style={styles.summaryIcon}
					/>
					<Text
						style={[styles.summaryText, { color: authColors.secondaryText }]}
					>
						English level:{" "}
						<Text style={{ fontWeight: "600" }}>
							{selectedLevel
								? LEVELS.find((l) => l.id === selectedLevel)?.label
								: "Not specified"}
						</Text>
					</Text>
				</View>

				<View style={styles.summaryItem}>
					<Ionicons
						name="flag-outline"
						size={22}
						color={authColors.primaryButton}
						style={styles.summaryIcon}
					/>
					<Text
						style={[styles.summaryText, { color: authColors.secondaryText }]}
					>
						Learning goals:{" "}
						<Text style={{ fontWeight: "600" }}>
							{selectedGoals
								.map((g) => GOALS.find((goal) => goal.id === g)?.label)
								.join(", ") || "Not specified"}
						</Text>
					</Text>
				</View>

				{educationLevel && (
					<View style={styles.summaryItem}>
						<Ionicons
							name="school-outline"
							size={22}
							color={authColors.primaryButton}
							style={styles.summaryIcon}
						/>
						<Text
							style={[styles.summaryText, { color: authColors.secondaryText }]}
						>
							Education:{" "}
							<Text style={{ fontWeight: "600" }}>
								{EDUCATION_LEVELS.find((e) => e.id === educationLevel)?.label}
							</Text>
						</Text>
					</View>
				)}

				{selectedRegion && (
					<View style={styles.summaryItem}>
						<Ionicons
							name="location-outline"
							size={22}
							color={authColors.primaryButton}
							style={styles.summaryIcon}
						/>
						<Text
							style={[styles.summaryText, { color: authColors.secondaryText }]}
						>
							Target region:{" "}
							<Text style={{ fontWeight: "600" }}>
								{REGIONS.find((r) => r.id === selectedRegion)?.label}
							</Text>
						</Text>
					</View>
				)}
			</View>

			<TouchableOpacity
				style={[
					styles.finishButton,
					{ backgroundColor: authColors.primaryButton },
				]}
				onPress={() => navigation.replace("Main")}
			>
				<Text style={styles.finishButtonText}>Let's Go!</Text>
				<Ionicons
					name="arrow-forward"
					size={20}
					color="#FFFFFF"
					style={{ marginLeft: 8 }}
				/>
			</TouchableOpacity>
		</View>
	);

	// ===== IMPORTANT CHANGES BEGIN =====
	// Map of phase indexes to render functions
	const phaseRenderers = {
		0: renderWelcome,
		1: renderMotherTongue,
		2: renderEnglishLevel,
		3: renderGoals,
		4: renderEducationLevel,
		5: renderReviews,
		6: renderRegionSelection,
		7: renderFinalPhase,
	};

	// ===== IMPORTANT CHANGES: RENDER CURRENT SCREEN =====
	// Instead of rendering based on phases array, render the current screen directly
	const renderCurrentScreen = () => {
		// Get the render function for the current screen
		const renderFunction = phaseRenderers[currentScreen];
		return renderFunction ? renderFunction() : null;
	};

	const isFirstPhase = currentPhaseIndex === 0;
	const isLastPhase = currentPhaseIndex === activePhases.length - 1;

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<LinearGradient
				colors={[authColors.gradientStart, authColors.gradientEnd]}
				style={styles.container}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
			>
				<StatusBar
					barStyle="light-content"
					backgroundColor="transparent"
					translucent
				/>

				{/* Top Navigation Bar */}
				<View style={styles.topBar}>
					{!isFirstPhase ? (
						<TouchableOpacity
							style={styles.topBarButton}
							onPress={handlePrevious}
						>
							<Ionicons
								name="arrow-back"
								size={24}
								color={authColors.primaryText}
							/>
						</TouchableOpacity>
					) : (
						<View style={styles.topBarButton} />
					)}

					<View style={styles.progressContainer}>
						{activePhases.map((phase, index) => (
							<TouchableOpacity
								key={phase}
								style={[
									styles.progressDot,
									{
										width: index === currentPhaseIndex ? 20 : 10,
										backgroundColor:
											index === currentPhaseIndex
												? authColors.primaryButton
												: index < currentPhaseIndex
												? `${authColors.primaryButton}80`
												: authColors.divider,
									},
								]}
								onPress={() => {
									// Only allow going back to completed phases
									if (index <= currentPhaseIndex) {
										setCurrentPhaseIndex(index);
									}
								}}
							/>
						))}
					</View>

					<TouchableOpacity style={styles.topBarButton} onPress={handleSkip}>
						<Text style={[styles.skipText, { color: authColors.primaryText }]}>
							Skip
						</Text>
					</TouchableOpacity>
				</View>

				{/* Main Content - Just render the current screen */}
				<View style={{ width, flex: 1 }}>{renderCurrentScreen()}</View>

				{/* Bottom Navigation - don't show on final phase */}
				{!isLastPhase && (
					<View style={styles.bottomBar}>
						<TouchableOpacity
							style={[
								styles.navButton,
								styles.prevButton,
								{ opacity: !isFirstPhase ? 1 : 0.5 },
							]}
							onPress={handlePrevious}
							disabled={isFirstPhase}
						>
							<Ionicons
								name="arrow-back"
								size={24}
								color={authColors.primaryText}
							/>
							<Text
								style={[
									styles.navButtonText,
									{ color: authColors.primaryText },
								]}
							>
								Previous
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								styles.navButton,
								styles.nextButton,
								{ backgroundColor: authColors.primaryButton },
							]}
							onPress={handleNext}
						>
							<Text style={styles.nextButtonText}>Next</Text>
							<Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
						</TouchableOpacity>
					</View>
				)}
			</LinearGradient>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	topBar: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingTop: 50,
		paddingBottom: 16,
	},
	topBarButton: {
		padding: 8,
		minWidth: 60,
	},
	progressContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	progressDot: {
		height: 10,
		borderRadius: 5,
		marginHorizontal: 3,
	},
	skipText: {
		fontSize: 16,
		fontWeight: "500",
		textAlign: "right",
	},
	phaseContainer: {
		width,
		paddingHorizontal: 24,
		paddingTop: 20,
		paddingBottom: 100,
	},
	bottomBar: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 16,
		paddingBottom: 32,
	},
	navButton: {
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
		borderRadius: 12,
	},
	prevButton: {
		backgroundColor: "transparent",
	},
	nextButton: {
		paddingHorizontal: 24,
	},
	navButtonText: {
		fontSize: 16,
		fontWeight: "500",
		marginLeft: 8,
	},
	nextButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
		marginRight: 8,
	},

	// Welcome Phase Styles
	welcomeImage: {
		width: width * 0.5,
		height: width * 0.3,
		alignSelf: "center",
		marginBottom: 30,
	},
	welcomeTitle: {
		fontSize: 28,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 16,
	},
	welcomeSubtitle: {
		fontSize: 16,
		textAlign: "center",
		lineHeight: 24,
		marginBottom: 32,
	},
	featuresContainer: {
		marginTop: 20,
	},
	featureItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	featureIcon: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	featureTextContainer: {
		flex: 1,
	},
	featureTitle: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 4,
	},
	featureDesc: {
		fontSize: 14,
		lineHeight: 20,
	},

	// Mother Tongue Phase Styles
	phaseTitle: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 12,
	},
	phaseSubtitle: {
		fontSize: 16,
		lineHeight: 24,
		marginBottom: 24,
	},
	searchContainer: {
		marginBottom: 16,
	},
	searchWrapper: {
		flexDirection: "row",
		alignItems: "center",
		height: 50,
		borderWidth: 1.5,
		borderRadius: 12,
		paddingHorizontal: 12,
	},
	searchIcon: {
		marginRight: 8,
	},
	searchInput: {
		flex: 1,
		height: 50,
		fontSize: 16,
	},
	clearIcon: {
		marginLeft: 8,
	},
	languageList: {
		maxHeight: height * 0.5,
	},
	languageItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderWidth: 1.5,
		borderColor: "transparent",
		borderRadius: 12,
		marginBottom: 8,
	},
	languageText: {
		fontSize: 16,
	},

	// English Level Phase Styles
	levelList: {
		marginTop: 8,
	},
	levelItem: {
		padding: 16,
		borderWidth: 1.5,
		borderColor: "transparent",
		borderRadius: 12,
		marginBottom: 12,
	},
	levelHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 4,
	},
	levelTitle: {
		fontSize: 18,
		fontWeight: "600",
	},
	levelDesc: {
		fontSize: 14,
		lineHeight: 20,
	},

	// Goals Phase Styles
	goalsList: {
		marginTop: 8,
	},
	goalItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		borderWidth: 1.5,
		borderColor: "transparent",
		borderRadius: 12,
		marginBottom: 12,
	},
	goalIcon: {
		width: 42,
		height: 42,
		borderRadius: 21,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	goalText: {
		fontSize: 16,
		fontWeight: "500",
		flex: 1,
	},
	goalCheck: {
		marginLeft: 8,
	},

	// Education Level Styles (conditional phase)
	// Already covered by levelList, levelItem, etc.

	// Reviews Styles (conditional phase)
	reviewsList: {
		maxHeight: height * 0.6,
	},
	reviewCard: {
		padding: 16,
		borderRadius: 12,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	reviewHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	reviewerPhoto: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 12,
	},
	reviewerInfo: {
		flex: 1,
	},
	reviewerName: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 2,
	},
	reviewerRole: {
		fontSize: 12,
	},
	ratingContainer: {
		flexDirection: "row",
		marginBottom: 8,
	},
	starIcon: {
		marginRight: 2,
	},
	reviewText: {
		fontSize: 14,
		lineHeight: 22,
		fontStyle: "italic",
	},

	// Region Selection Styles (conditional phase)
	regionsList: {
		marginTop: 8,
	},
	regionItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		borderWidth: 1.5,
		borderColor: "transparent",
		borderRadius: 12,
		marginBottom: 12,
	},
	regionFlag: {
		fontSize: 24,
		marginRight: 16,
	},
	regionText: {
		fontSize: 16,
		fontWeight: "500",
		flex: 1,
	},

	// Final Phase Styles
	finalImage: {
		width: width * 0.5,
		height: width * 0.3,
		alignSelf: "center",
		marginBottom: 30,
	},
	finalTitle: {
		fontSize: 28,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 16,
	},
	finalSubtitle: {
		fontSize: 16,
		textAlign: "center",
		lineHeight: 24,
		marginBottom: 32,
	},
	summaryContainer: {
		padding: 16,
		borderRadius: 12,
		backgroundColor: "rgba(0,0,0,0.05)",
		marginBottom: 24,
	},
	summaryTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 16,
	},
	summaryItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	summaryIcon: {
		marginRight: 12,
	},
	summaryText: {
		fontSize: 14,
		lineHeight: 20,
	},
	finishButton: {
		flexDirection: "row",
		height: 56,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 24,
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	finishButtonText: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "600",
	},
});

export default OnboardingScreen;
