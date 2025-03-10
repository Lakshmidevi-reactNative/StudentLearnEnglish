import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	Image,
	SafeAreaView,
	StatusBar,
	TextInput,
	ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import axios from "axios";

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

// English proficiency levels with CEFR levels
const LEVELS = [
	{
		id: "beginner",
		label: "Beginner",
		cefr: "A1",
		description: "I can say hello, my name, and talk about what I do.",
		icon: "walk",
		iconColor: "#FFFFFF",
	},
	{
		id: "lower_intermediate",
		label: "Lower Intermediate",
		cefr: "A2",
		description: "I can talk about my past and my plans comfortably.",
		icon: "bicycle",
		iconColor: "#FFCC00",
	},
	{
		id: "intermediate",
		label: "Intermediate",
		cefr: "B1",
		description: "I can talk freely about everyday topics and my profession.",
		icon: "bicycle",
		iconColor: "#FFFFFF",
	},
	{
		id: "upper_intermediate",
		label: "Upper Intermediate",
		cefr: "B2",
		description: "I can talk about a broad range of topics with confidence.",
		icon: "car",
		iconColor: "#FF5555",
	},
	{
		id: "advanced",
		label: "Advanced",
		cefr: "C1",
		description: "I'm nearly fluent in English.",
		icon: "airplane",
		iconColor: "#FFFFFF",
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

// User reviews
const USER_REVIEWS = [
	{
		id: 1,
		name: "Sarah K.",
		role: "Software Engineer",
		rating: 5,
		review: "LearnEng helped me improve my technical English...",
		photo: require("../../assets/logo.png"),
		goal: "career",
	},
	{
		id: 2,
		name: "Michael T.",
		role: "Marketing Manager",
		rating: 5,
		review: "The business English modules were exactly what I needed...",
		photo: require("../../assets/logo.png"),
		goal: "career",
	},
	{
		id: 3,
		name: "Raj P.",
		role: "International Student",
		rating: 5,
		review: "I've made friends from all over the world...",
		photo: require("../../assets/logo.png"),
		goal: "connect",
	},
	{
		id: 4,
		name: "Elena M.",
		role: "Travel Enthusiast",
		rating: 4,
		review: "The app's social features helped me connect with locals...",
		photo: require("../../assets/logo.png"),
		goal: "connect",
	},
];

type OnboardingScreenProps = {
	navigation: NavigationProp<any>;
	route: RouteProp<any>;
};

const OnboardingScreen = ({ navigation, route }: OnboardingScreenProps) => {
	const customColors = {
		background: "#1F1B3C",
		gradientStart: "#1F1B3C",
		gradientMiddle: "#2A2650",
		gradientEnd: "#333180",
		primaryText: "#FFFFFF",
		secondaryText: "#CCCCFF",
		primaryButton: "#4A90E2",
		cardBackground: "rgba(255, 255, 255, 0.15)",
		cardBorder: "rgba(255, 255, 255, 0.2)",
		progressBar: "rgba(255, 255, 255, 0.2)",
		progressBarActive: "#4A90E2",
		selectedCard: "rgba(74, 144, 226, 0.2)",
		inputBackground: "rgba(255, 255, 255, 0.1)",
		inputBorder: "rgba(255, 255, 255, 0.2)",
		iconBackground: "rgba(255, 255, 255, 0.2)",
		placeholder: "#9999CC",
	};

	const userName = route?.params?.firstName || "there";
	const ALL_PHASES = [0, 1, 2, 3, 4, 5, 6, 7];
	const [activePhases, setActivePhases] = useState([0, 1, 2, 3]);
	const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
	const [motherTongue, setMotherTongue] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
	const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
	const [educationLevel, setEducationLevel] = useState<string | null>(null);
	const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

	const filteredLanguages = LANGUAGES.filter((lang) =>
		lang.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const toggleGoal = (goalId: string) => {
		setSelectedGoals((prev) =>
			prev.includes(goalId)
				? prev.filter((id) => id !== goalId)
				: [...prev, goalId]
		);
	};

	const filteredReviews = USER_REVIEWS.filter((review) =>
		selectedGoals.includes(review.goal)
	);

	useEffect(() => {
		let newActivePhases = [0, 1, 2, 3];
		if (selectedGoals.includes("education")) newActivePhases.push(4);
		if (selectedGoals.includes("career") || selectedGoals.includes("connect"))
			newActivePhases.push(5);
		if (selectedGoals.includes("travel") || selectedGoals.includes("relocate"))
			newActivePhases.push(6);
		newActivePhases.push(7);
		setActivePhases(newActivePhases);
	}, [selectedGoals]);

	const saveStudentData = async () => {
		if (!motherTongue || !selectedLevel) {
			alert("Please complete all required fields");
			return;
		}

		const apiUrl =
			"http://192.168.29.37:8080/learnengspring/student/save-onboarding";

		const decisionCriteria = [];

		if (selectedGoals.includes("education")) {
			decisionCriteria.push({
				"support to education": educationLevel || "school",
			});
		}

		if (selectedGoals.includes("relocate")) {
			decisionCriteria.push({
				"move to another country": selectedRegion
					? REGIONS.find((r) => r.id === selectedRegion)?.label || "America"
					: "America",
			});
		}

		if (selectedGoals.includes("travel")) {
			decisionCriteria.push({
				"Prepare to travel": selectedRegion
					? REGIONS.find((r) => r.id === selectedRegion)?.label || "USA"
					: "USA",
			});
		}

		if (decisionCriteria.length === 0) {
			decisionCriteria.push({
				"support to education": "school",
			});
		}

		const studentData = {
			studentId: "4367",
			motherTongue: motherTongue.toLowerCase(),
			level_criteria_name: selectedLevel,
			decision_criteria_name: decisionCriteria,
		};

		try {
			const response = await axios.post(apiUrl, studentData, {
				headers: {
					"Content-Type": "application/json",
				},
				timeout: 10000,
			});

			console.log("Student data saved successfully:", response.data);
			navigation.navigate("Main");
		} catch (error) {
			console.error("Error saving student data:", error);
			if (error.response) {
				console.error("Response data:", error.response.data);
				console.error("Response status:", error.response.status);
			}
			alert(
				"Failed to save your preferences. Please check your internet connection and try again."
			);
		}
	};

	const currentScreen = activePhases[currentPhaseIndex];

	const handleNext = () => {
		if (currentPhaseIndex < activePhases.length - 1) {
			setCurrentPhaseIndex(currentPhaseIndex + 1);
		} else {
			navigation.navigate("Main");
		}
	};

	const handlePrevious = () => {
		if (currentPhaseIndex > 0) setCurrentPhaseIndex(currentPhaseIndex - 1);
	};

	const handleSkip = () => {
		navigation.navigate("Main");
	};

	// Sticky header function
	const renderStickyHeader = () => {
		let title = "";
		let subtitle = "";

		switch (currentScreen) {
			case 0:
				title = `Welcome, ${userName}!`;
				subtitle =
					"We're excited to have you join LearnEng. Let's personalize your learning experience.";
				break;
			case 1:
				title = "What's your mother tongue?";
				subtitle =
					"This helps us tailor lessons to address common challenges for speakers of your language.";
				break;
			case 2:
				title = "What is your level of English?";
				subtitle = "AI Tutor will match lessons to your English level";
				break;
			case 3:
				title = "Why are you learning English?";
				subtitle =
					"Select all that apply. This helps us recommend the most relevant content.";
				break;
			case 4:
				title = "What's your current education level?";
				subtitle = "We'll recommend content relevant to your academic needs.";
				break;
			case 5:
				title = "Success Stories from LearnEng";
				subtitle = "See how others achieved their goals with LearnEng.";
				break;
			case 6:
				title = selectedGoals.includes("travel")
					? "Where do you plan to travel?"
					: "Where do you plan to relocate?";
				subtitle = "We'll prioritize content relevant to your destination.";
				break;
			case 7:
				title = `You're all set, ${userName}!`;
				subtitle =
					"We've personalized your learning experience based on your preferences. Let's start your English learning journey!";
				break;
			default:
				break;
		}

		return (
			<View style={styles.stickyHeader}>
				<View style={styles.mascotContainer}>
					<Image
						source={require("../../assets/logo.png")}
						style={styles.mascotImage}
						resizeMode="contain"
					/>
				</View>
				<Text
					style={[
						currentScreen === 0 || currentScreen === 7
							? styles.welcomeTitle
							: styles.phaseTitle,
						{ color: customColors.primaryText, textAlign: "center" },
					]}
				>
					{title}
				</Text>
				<Text
					style={[
						currentScreen === 0 || currentScreen === 7
							? styles.welcomeSubtitle
							: styles.phaseSubtitle,
						{ color: customColors.secondaryText, textAlign: "center" },
					]}
				>
					{subtitle}
				</Text>
			</View>
		);
	};

	const renderWelcome = () => (
		<View style={styles.phaseContainer}>
			<View style={styles.featuresContainer}>
				<View style={styles.featureItem}>
					<View
						style={[
							styles.featureIcon,
							{ backgroundColor: "rgba(74, 144, 226, 0.2)" },
						]}
					>
						<Ionicons name="book" size={24} color="#4A90E2" />
					</View>
					<View style={styles.featureTextContainer}>
						<Text
							style={[styles.featureTitle, { color: customColors.primaryText }]}
						>
							Personalized Learning
						</Text>
						<Text
							style={[
								styles.featureDesc,
								{ color: customColors.secondaryText },
							]}
						>
							Lessons tailored to your level and goals
						</Text>
					</View>
				</View>
				<View style={styles.featureItem}>
					<View
						style={[
							styles.featureIcon,
							{ backgroundColor: "rgba(155, 89, 182, 0.2)" },
						]}
					>
						<Ionicons name="mic" size={24} color="#9B59B6" />
					</View>
					<View style={styles.featureTextContainer}>
						<Text
							style={[styles.featureTitle, { color: customColors.primaryText }]}
						>
							Practice Speaking
						</Text>
						<Text
							style={[
								styles.featureDesc,
								{ color: customColors.secondaryText },
							]}
						>
							Improve your pronunciation and fluency
						</Text>
					</View>
				</View>
				<View style={styles.featureItem}>
					<View
						style={[
							styles.featureIcon,
							{ backgroundColor: "rgba(46, 204, 113, 0.2)" },
						]}
					>
						<Ionicons name="stats-chart" size={24} color="#2ECC71" />
					</View>
					<View style={styles.featureTextContainer}>
						<Text
							style={[styles.featureTitle, { color: customColors.primaryText }]}
						>
							Track Progress
						</Text>
						<Text
							style={[
								styles.featureDesc,
								{ color: customColors.secondaryText },
							]}
						>
							See your improvement over time
						</Text>
					</View>
				</View>
			</View>
		</View>
	);

	const renderMotherTongue = () => (
		<View style={styles.phaseContainer}>
			<View style={styles.searchContainer}>
				<View
					style={[
						styles.searchWrapper,
						{
							backgroundColor: customColors.inputBackground,
							borderColor: customColors.inputBorder,
						},
					]}
				>
					<Ionicons
						name="search"
						size={20}
						color={customColors.secondaryText}
						style={styles.searchIcon}
					/>
					<TextInput
						style={[styles.searchInput, { color: customColors.primaryText }]}
						placeholder="Search languages..."
						placeholderTextColor={customColors.placeholder}
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
					{searchQuery && (
						<TouchableOpacity onPress={() => setSearchQuery("")}>
							<Ionicons
								name="close-circle"
								size={20}
								color={customColors.secondaryText}
								style={styles.clearIcon}
							/>
						</TouchableOpacity>
					)}
				</View>
			</View>
			<View style={styles.languageListContainer}>
				<ScrollView
					showsVerticalScrollIndicator={true}
					contentContainerStyle={styles.languageListContent}
				>
					{filteredLanguages.map((language) => (
						<TouchableOpacity
							key={language}
							style={[
								styles.modernCard,
								styles.languageItem,
								motherTongue === language && {
									backgroundColor: customColors.selectedCard,
									borderColor: customColors.primaryButton,
								},
							]}
							onPress={() => setMotherTongue(language)}
						>
							<Text
								style={[
									styles.languageText,
									{ color: customColors.primaryText },
									motherTongue === language && {
										color: customColors.primaryButton,
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
									color={customColors.primaryButton}
								/>
							)}
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>
		</View>
	);

	const renderEnglishLevel = () => (
		<View style={styles.phaseContainer}>
			<View style={styles.levelList}>
				{LEVELS.map((level) => (
					<TouchableOpacity
						key={level.id}
						style={[
							styles.englishLevelCard,
							selectedLevel === level.id && {
								borderColor: customColors.primaryButton,
								backgroundColor: customColors.selectedCard,
							},
						]}
						onPress={() => setSelectedLevel(level.id)}
					>
						<View style={styles.levelIconContainer}>
							{level.icon === "car" ? (
								<MaterialIcons
									name="directions-car"
									size={24}
									color={level.iconColor}
								/>
							) : (
								<Ionicons
									name={level.icon as any}
									size={24}
									color={level.iconColor}
								/>
							)}
						</View>
						<View style={styles.levelTextContainer}>
							<View style={styles.levelLabelRow}>
								<Text
									style={[
										styles.levelTitle,
										{ color: customColors.primaryText },
									]}
								>
									{level.label}
								</Text>
								{/* <Text style={styles.cefrLevel}>{level.cefr}</Text> */}
							</View>
							<Text
								style={[
									styles.levelDesc,
									{ color: customColors.secondaryText },
								]}
							>
								{level.description}
							</Text>
						</View>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);

	const renderGoals = () => (
		<View style={styles.phaseContainer}>
			<View style={styles.goalsList}>
				{GOALS.map((goal) => (
					<TouchableOpacity
						key={goal.id}
						style={[
							styles.modernCard,
							{ flexDirection: "row", alignItems: "center" },
							selectedGoals.includes(goal.id) && {
								backgroundColor: customColors.selectedCard,
								borderColor: customColors.primaryButton,
							},
						]}
						onPress={() => toggleGoal(goal.id)}
					>
						<View
							style={[
								styles.goalIcon,
								selectedGoals.includes(goal.id)
									? { backgroundColor: customColors.primaryButton }
									: { backgroundColor: customColors.iconBackground },
							]}
						>
							<Ionicons name={goal.icon as any} size={24} color="#FFFFFF" />
						</View>
						<Text
							style={[
								styles.goalText,
								{ color: customColors.primaryText },
								selectedGoals.includes(goal.id) && {
									color: customColors.primaryButton,
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
								color={customColors.primaryButton}
								style={styles.goalCheck}
							/>
						)}
					</TouchableOpacity>
				))}
			</View>
		</View>
	);

	const renderEducationLevel = () => (
		<View style={styles.phaseContainer}>
			<View style={styles.levelList}>
				{EDUCATION_LEVELS.map((level) => (
					<TouchableOpacity
						key={level.id}
						style={[
							styles.modernCard,
							educationLevel === level.id && {
								backgroundColor: customColors.selectedCard,
								borderColor: customColors.primaryButton,
							},
						]}
						onPress={() => setEducationLevel(level.id)}
					>
						<View style={styles.levelHeader}>
							<Text
								style={[
									styles.levelTitle,
									{ color: customColors.primaryText },
									educationLevel === level.id && {
										color: customColors.primaryButton,
									},
								]}
							>
								{level.label}
							</Text>
							{educationLevel === level.id && (
								<Ionicons
									name="checkmark-circle"
									size={22}
									color={customColors.primaryButton}
								/>
							)}
						</View>
						<Text
							style={[styles.levelDesc, { color: customColors.secondaryText }]}
						>
							{level.description}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);

	const renderReviews = () => (
		<View style={styles.phaseContainer}>
			<ScrollView style={styles.reviewsList}>
				{filteredReviews.map((review) => (
					<View
						key={review.id}
						style={[
							styles.modernCard,
							{ backgroundColor: customColors.cardBackground },
						]}
					>
						<View style={styles.reviewHeader}>
							<Image source={review.photo} style={styles.reviewerPhoto} />
							<View style={styles.reviewerInfo}>
								<Text
									style={[
										styles.reviewerName,
										{ color: customColors.primaryText },
									]}
								>
									{review.name}
								</Text>
								<Text
									style={[
										styles.reviewerRole,
										{ color: customColors.secondaryText },
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
							style={[styles.reviewText, { color: customColors.secondaryText }]}
						>
							"{review.review}"
						</Text>
					</View>
				))}
			</ScrollView>
		</View>
	);

	const renderRegionSelection = () => (
		<View style={styles.phaseContainer}>
			<View style={styles.regionsList}>
				{REGIONS.map((region) => (
					<TouchableOpacity
						key={region.id}
						style={[
							styles.modernCard,
							{ flexDirection: "row", alignItems: "center" },
							selectedRegion === region.id && {
								backgroundColor: customColors.selectedCard,
								borderColor: customColors.primaryButton,
							},
						]}
						onPress={() => setSelectedRegion(region.id)}
					>
						<Text style={styles.regionFlag}>{region.flag}</Text>
						<Text
							style={[
								styles.regionText,
								{ color: customColors.primaryText },
								selectedRegion === region.id && {
									color: customColors.primaryButton,
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
								color={customColors.primaryButton}
							/>
						)}
					</TouchableOpacity>
				))}
			</View>
		</View>
	);

	const renderFinalPhase = () => (
		<View style={styles.phaseContainer}>
			<View
				style={[
					styles.summaryContainer,
					{
						backgroundColor: customColors.cardBackground,
						borderColor: customColors.cardBorder,
						borderWidth: 1,
					},
				]}
			>
				<Text
					style={[styles.summaryTitle, { color: customColors.primaryText }]}
				>
					Your Personalized Plan:
				</Text>
				<View style={styles.summaryItem}>
					<Ionicons
						name="globe-outline"
						size={22}
						color={customColors.primaryButton}
						style={styles.summaryIcon}
					/>
					<Text
						style={[styles.summaryText, { color: customColors.secondaryText }]}
					>
						Native language:{" "}
						<Text
							style={{ fontWeight: "600", color: customColors.primaryText }}
						>
							{motherTongue || "Not specified"}
						</Text>
					</Text>
				</View>
				<View style={styles.summaryItem}>
					<Ionicons
						name="school-outline"
						size={22}
						color={customColors.primaryButton}
						style={styles.summaryIcon}
					/>
					<Text
						style={[styles.summaryText, { color: customColors.secondaryText }]}
					>
						English level:{" "}
						<Text
							style={{ fontWeight: "600", color: customColors.primaryText }}
						>
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
						color={customColors.primaryButton}
						style={styles.summaryIcon}
					/>
					<Text
						style={[styles.summaryText, { color: customColors.secondaryText }]}
					>
						Learning goals:{" "}
						<Text
							style={{ fontWeight: "600", color: customColors.primaryText }}
						>
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
							color={customColors.primaryButton}
							style={styles.summaryIcon}
						/>
						<Text
							style={[
								styles.summaryText,
								{ color: customColors.secondaryText },
							]}
						>
							Education:{" "}
							<Text
								style={{ fontWeight: "600", color: customColors.primaryText }}
							>
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
							color={customColors.primaryButton}
							style={styles.summaryIcon}
						/>
						<Text
							style={[
								styles.summaryText,
								{ color: customColors.secondaryText },
							]}
						>
							Target region:{" "}
							<Text
								style={{ fontWeight: "600", color: customColors.primaryText }}
							>
								{REGIONS.find((r) => r.id === selectedRegion)?.label}
							</Text>
						</Text>
					</View>
				)}
			</View>
			<TouchableOpacity
				style={[
					styles.finishButton,
					{ backgroundColor: customColors.primaryButton },
				]}
				onPress={saveStudentData}
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

	const phaseRenderers: { [key: number]: () => JSX.Element } = {
		0: renderWelcome,
		1: renderMotherTongue,
		2: renderEnglishLevel,
		3: renderGoals,
		4: renderEducationLevel,
		5: renderReviews,
		6: renderRegionSelection,
		7: renderFinalPhase,
	};

	const renderCurrentScreen = () => phaseRenderers[currentScreen as number]?.();

	const isLastPhase = currentPhaseIndex === activePhases.length - 1;
	const isFirstPhase = currentPhaseIndex === 0;

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: customColors.background }}>
			<LinearGradient
				colors={[
					customColors.gradientStart,
					customColors.gradientMiddle,
					customColors.gradientEnd,
				]}
				style={styles.container}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
			>
				<StatusBar
					barStyle="light-content"
					backgroundColor="transparent"
					translucent
				/>
				<View style={styles.topBar}>
					<View style={styles.progressBar}>
						<View
							style={[
								styles.progressIndicator,
								{
									width: `${
										(currentPhaseIndex / (activePhases.length - 1)) * 100
									}%`,
									backgroundColor: "#FFFFFF",
								},
							]}
						/>
					</View>
				</View>

				{/* Sticky header with logo and title */}
				{renderStickyHeader()}

				{/* Fixed content box that's scrollable */}
				<View style={styles.contentBoxContainer}>
					<View style={styles.contentBox}>
						<ScrollView
							style={styles.contentScroll}
							showsVerticalScrollIndicator={true}
							contentContainerStyle={styles.scrollContent}
						>
							{renderCurrentScreen()}
						</ScrollView>
					</View>
				</View>

				{!isLastPhase && (
					<View style={styles.bottomBar}>
						{!isFirstPhase && (
							<TouchableOpacity
								style={styles.backButton}
								onPress={handlePrevious}
							>
								<Ionicons name="arrow-back" size={24} color="white" />
							</TouchableOpacity>
						)}
						<TouchableOpacity
							style={[
								styles.continueButton,
								isFirstPhase ? { width: "80%" } : { width: "65%" },
							]}
							onPress={handleNext}
						>
							<Text style={styles.continueButtonText}>Continue</Text>
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
		paddingHorizontal: 16,
		marginTop: 50,
		paddingBottom: 10,
		backgroundColor: "rgba(31, 27, 60, 0.7)",
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 10,
	},
	progressBar: {
		height: 6,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		borderRadius: 4,
	},
	progressIndicator: {
		height: 6,
		borderRadius: 4,
	},
	stickyHeader: {
		position: "absolute",
		top: 70,
		left: 0,
		right: 0,
		zIndex: 20,
		// backgroundColor: "rgba(31, 27, 60, 0.9)",
		paddingHorizontal: 20,
		paddingVertical: 15,
		alignItems: "center",
	},
	contentBoxContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingTop: 300, // Space for sticky header
		paddingBottom: 120, // Space for bottom buttons
	},
	contentBox: {
		// alignItems:"center",

		width: width * 0.9,
		height: "100%",
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.2)",
		overflow: "hidden",
	},
	contentScroll: {
		flex: 1,
	},
	scrollContent: {
		padding: 16,
	},
	phaseContainer: {
		paddingBottom: 20,
	},
	bottomBar: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		padding: 16,
		paddingBottom: 32,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		// backgroundColor: "rgba(31, 27, 60, 0.7)",
	},
	continueButton: {
		height: 56,
		borderWidth: 1,
		borderColor: "white",
		borderRadius: 28,
		justifyContent: "center",
		alignItems: "center",
	},
	backButton: {
		width: 56,
		height: 56,
		borderWidth: 1,
		borderColor: "white",
		borderRadius: 28,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 10,
	},
	continueButtonText: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "600",
	},
	mascotContainer: {
		alignItems: "center",
		marginBottom: 16,
	},
	mascotImage: {
		width: 100,
		height: 100,
	},
	welcomeTitle: {
		fontSize: 28,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 12,
	},
	welcomeSubtitle: {
		fontSize: 16,
		textAlign: "center",
		lineHeight: 24,
		marginBottom: 24,
		paddingHorizontal: 20,
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
	modernCard: {
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.2)",
	},
	phaseTitle: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 8,
	},
	phaseSubtitle: {
		fontSize: 16,
		lineHeight: 24,
		marginBottom: 16,
		paddingHorizontal: 20,
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
	languageListContainer: {
		flex: 1,
	},
	languageListContent: {
		paddingBottom: 20,
	},
	languageItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 14,
		paddingHorizontal: 16,
	},
	languageText: {
		fontSize: 16,
		flex: 1,
	},
	levelList: {
		marginTop: 8,
	},
	englishLevelCard: {
		flexDirection: "row",
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.2)",
		alignItems: "center",
	},
	levelIconContainer: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	levelTextContainer: {
		flex: 1,
	},
	levelLabelRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 6,
	},
	levelTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginRight: 8,
	},
	cefrLevel: {
		fontSize: 16,
		color: "#AAAACC",
	},
	levelHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 4,
	},
	levelDesc: {
		fontSize: 14,
		lineHeight: 20,
	},
	goalsList: {
		marginTop: 8,
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
	reviewsList: {
		maxHeight: height * 0.6,
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
	regionsList: {
		marginTop: 8,
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
		borderRadius: 16,
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
		borderRadius: 28,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 24,
		paddingHorizontal: 32,
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
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
