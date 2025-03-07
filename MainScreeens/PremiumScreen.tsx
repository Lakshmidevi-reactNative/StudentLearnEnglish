import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image,
	Platform,
	Switch,
	ActivityIndicator,
	Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	MaterialCommunityIcons,
	FontAwesome5,
	Ionicons,
	MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { COLORS } from "./constants/Colors";
import { toast } from "sonner-native";

const { width } = Dimensions.get("window");

export default function PremiumScreen() {
	const navigation = useNavigation();
	const [selectedPlan, setSelectedPlan] = useState("fluence"); // 'foundation' or 'fluence'
	const [billingCycle, setBillingCycle] = useState("yearly"); // 'monthly' or 'yearly'
	const [isLoading, setIsLoading] = useState(false);

	// Check if user has an active subscription
	const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

	// Plan pricing
	const pricing = {
		foundation: {
			monthly: 199,
			yearly: 199,
			yearlySavings: 20,
		},
		fluence: {
			monthly: 299,
			yearly: 2999,
			yearlySavings: 20,
		},
	};

	// Plan data
	const plans = [
		{
			id: "foundation",
			name: "Foundation",
			description:
				"Perfect for casual learners who want to build basic English skills",
			color: COLORS.neonBlue,
			icon: "book-education",
			features: [
				{
					title: "Listen, Speak, Read, Write, Type, Prompt in English",
					included: true,
				},
				{ title: "Basic Practice Tests", included: true },
				{ title: "Class Tests Access", included: true },
				{ title: "Standard Progress Tracking", included: true },
				{ title: "Advanced Practice Tests", included: false },
				{ title: "Pronunciation Analysis", included: false },
				{ title: "AI-Powered Feedback", included: false },
				{ title: "Personalized Learning Path", included: false },
			],
		},
		{
			id: "fluence",
			name: "Fluence",
			description:
				"For serious learners who want AI-powered personalized learning",
			color: COLORS.neonPurple,
			icon: "star-circle",
			features: [
				{
					title: "Listen, Speak, Read, Write, Type, Prompt in English",
					included: true,
				},
				{ title: "Basic Practice Tests", included: true },
				{ title: "Class Tests Access", included: true },
				{ title: "Standard Progress Tracking", included: true },
				{ title: "Advanced Practice Tests", included: true },
				{ title: "Pronunciation Analysis", included: true },
				{ title: "AI-Powered Feedback", included: true },
				{ title: "Personalized Learning Path", included: true },
			],
		},
	];

	const goBack = () => {
		navigation.goBack();
	};

	const handleFreeTrial = () => {
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
			setHasActiveSubscription(true);
			toast.success(
				`Started 7-day free trial of ${
					selectedPlan === "foundation" ? "Foundation" : "Fluence"
				} Plan`
			);
		}, 1500);
	};

	const handlePurchase = () => {
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
			setHasActiveSubscription(true);
			toast.success(
				`Subscribed to ${
					selectedPlan === "foundation" ? "Foundation" : "Fluence"
				} Plan`
			);
		}, 1500);
	};

	const getMonthlyPrice = (planId) => {
		if (billingCycle === "monthly") {
			return pricing[planId].monthly;
		} else {
			// Calculate the monthly equivalent from the yearly price
			return (pricing[planId].yearly / 12).toFixed(2);
		}
	};

	const getPlanById = (id) => {
		return plans.find((plan) => plan.id === id);
	};

	const renderPlanCard = (plan) => {
		const isSelected = selectedPlan === plan.id;

		return (
			<TouchableOpacity
				onPress={() => setSelectedPlan(plan.id)}
				style={[
					styles.planCard,
					isSelected && styles.selectedPlanCard,
					{ borderColor: isSelected ? plan.color : "rgba(255, 255, 255, 0.1)" },
				]}
			>
				<LinearGradient
					colors={[
						isSelected ? `${plan.color}20` : "rgba(255, 255, 255, 0.05)",
						isSelected ? `${plan.color}05` : "rgba(255, 255, 255, 0.02)",
					]}
					style={styles.planCardGradient}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
				>
					{isSelected && (
						<View
							style={[styles.selectedBadge, { backgroundColor: plan.color }]}
						>
							<Text style={styles.selectedBadgeText}>SELECTED</Text>
						</View>
					)}

					<View
						style={[
							styles.planIconContainer,
							{ backgroundColor: `${plan.color}30` },
						]}
					>
						<MaterialCommunityIcons
							name={plan.icon}
							size={32}
							color={plan.color}
						/>
					</View>

					<Text style={styles.planCardTitle}>{plan.name}</Text>
					<Text style={styles.planCardDescription}>{plan.description}</Text>

					<View style={styles.planPriceContainer}>
						<Text
							style={[
								styles.planPrice,
								{ color: isSelected ? plan.color : COLORS.textPrimary },
							]}
						>
							{getMonthlyPrice(plan.id)}
						</Text>
						<Text style={styles.planCurrencySymbol}> Rs</Text>

						<View style={styles.planPriceDetailsContainer}>
							<Text style={styles.planPricePerMonth}>/month</Text>
							{billingCycle === "yearly" && (
								<Text style={styles.planBilledAnnually}>billed annually</Text>
							)}
						</View>
					</View>

					{billingCycle === "yearly" && (
						<View
							style={[
								styles.planSavingsBadge,
								{ backgroundColor: `${COLORS.neonGreen}20` },
							]}
						>
							<Text style={styles.planSavingsText}>
								Save {pricing[plan.id].yearlySavings}% with annual billing
							</Text>
						</View>
					)}

					<View style={styles.planFeatureList}>
						{plan.features.slice(0, 4).map((feature, index) => (
							<View key={index} style={styles.planFeatureItem}>
								<MaterialCommunityIcons
									name={feature.included ? "check-circle" : "close-circle"}
									size={18}
									color={
										feature.included
											? isSelected
												? plan.color
												: COLORS.neonGreen
											: "rgba(255,255,255,0.3)"
									}
								/>
								<Text
									style={[
										styles.planFeatureText,
										!feature.included && styles.planFeatureTextDisabled,
									]}
								>
									{feature.title}
								</Text>
							</View>
						))}
						{plan.id === "fluence" && (
							<View
								style={[
									styles.aiPoweredTag,
									{ backgroundColor: `${plan.color}20` },
								]}
							>
								<MaterialCommunityIcons
									name="robot"
									size={16}
									color={plan.color}
								/>
								<Text style={[styles.aiPoweredText, { color: plan.color }]}>
									AI-Powered
								</Text>
							</View>
						)}
					</View>
				</LinearGradient>
			</TouchableOpacity>
		);
	};

	const renderFeaturesComparison = () => {
		const currentPlan = getPlanById(selectedPlan);
		return (
			<View style={styles.featuresComparisonCard}>
				<Text style={styles.featuresComparisonTitle}>Plan Features</Text>

				{currentPlan.features.map((feature, index) => (
					<View key={index} style={styles.featureComparisonRow}>
						<View style={styles.featureComparisonTextContainer}>
							<Text
								style={[
									styles.featureComparisonText,
									!feature.included && styles.featureComparisonTextDisabled,
								]}
							>
								{feature.title}
							</Text>
						</View>
						<View style={styles.featureComparisonIndicator}>
							<MaterialCommunityIcons
								name={feature.included ? "check-circle" : "minus-circle"}
								size={22}
								color={
									feature.included ? COLORS.neonGreen : "rgba(255,255,255,0.2)"
								}
							/>
						</View>
					</View>
				))}
			</View>
		);
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
					<TouchableOpacity onPress={goBack} style={styles.backButton}>
						<MaterialCommunityIcons
							name="arrow-left"
							size={28}
							color={COLORS.textPrimary}
						/>
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Premium</Text>
					<View style={{ width: 28 }} />
				</View>

				<ScrollView
					showsVerticalScrollIndicator={false}
					style={styles.scrollView}
				>
					<Animated.View entering={FadeInDown.delay(100).duration(400)}>
						<View style={styles.crownContainer}>
							<MaterialCommunityIcons
								name="crown"
								size={60}
								color={COLORS.neonYellow}
								style={styles.crownIcon}
							/>
						</View>

						{hasActiveSubscription ? (
							<View style={styles.subscriptionStatusContainer}>
								<Text style={styles.activeSubscriptionText}>
									{selectedPlan === "foundation" ? "Foundation" : "Fluence"}{" "}
									Plan Active
								</Text>
								<Text style={styles.renewalText}>
									Renews on November 1, 2025
								</Text>
							</View>
						) : (
							<View style={styles.subscriptionStatusContainer}>
								<Text style={styles.noSubscriptionText}>
									Unlock Premium Features
								</Text>
								<Text style={styles.subscribePromptText}>
									Choose a plan that fits your learning goals
								</Text>
							</View>
						)}
					</Animated.View>

					<Animated.View entering={FadeInDown.delay(200).duration(400)}>
						<View style={styles.billingCycleContainer}>
							<Text style={styles.billingCycleLabel}>Billing Cycle:</Text>
							<View style={styles.billingToggleContainer}>
								<Text
									style={[
										styles.billingText,
										billingCycle === "monthly" && styles.activeBillingText,
									]}
								>
									Monthly
								</Text>
								<Switch
									value={billingCycle === "yearly"}
									onValueChange={(value) =>
										setBillingCycle(value ? "yearly" : "monthly")
									}
									trackColor={{
										false: COLORS.cardBg,
										true: `${COLORS.neonBlue}80`,
									}}
									thumbColor={
										billingCycle === "yearly" ? COLORS.neonBlue : "#f4f3f4"
									}
									ios_backgroundColor={COLORS.cardBg}
									style={styles.billingSwitch}
								/>
								<View style={styles.billingYearlyContainer}>
									<Text
										style={[
											styles.billingText,
											billingCycle === "yearly" && styles.activeBillingText,
										]}
									>
										Yearly
									</Text>
									<View style={styles.savingsBadge}>
										<Text style={styles.savingsText}>Save 20%</Text>
									</View>
								</View>
							</View>
						</View>
					</Animated.View>

					<View style={styles.planCardsContainer}>
						{plans.map((plan, index) => (
							<Animated.View
								key={plan.id}
								entering={FadeInDown.delay(300 + index * 100).duration(400)}
								style={styles.planCardContainer}
							>
								{renderPlanCard(plan)}
							</Animated.View>
						))}
					</View>

					{/* <Animated.View entering={FadeInDown.delay(500).duration(400)}>
						{renderFeaturesComparison()}
					</Animated.View> */}

					{/* {selectedPlan === "fluence" && (
						<Animated.View entering={FadeInDown.delay(600).duration(400)}>
							<View style={styles.aiAdvantageContainer}>
								<View style={styles.aiHeaderRow}>
									<MaterialCommunityIcons
										name="brain"
										size={24}
										color={COLORS.neonPurple}
									/>
									<Text style={styles.aiAdvantageTitle}>
										AI-Powered Learning Advantage
									</Text>
								</View>

								<Text style={styles.aiAdvantageSubtitle}>
									Fluence Plan includes powerful AI features that analyze your
									learning patterns and customize your experience
								</Text>

								<View style={styles.aiFeatureGrid}>
									<View style={styles.aiFeatureItem}>
										<View
											style={[
												styles.aiFeatureIconBg,
												{ backgroundColor: `${COLORS.neonBlue}30` },
											]}
										>
											<MaterialCommunityIcons
												name="chart-bell-curve"
												size={24}
												color={COLORS.neonBlue}
											/>
										</View>
										<Text style={styles.aiFeatureTitle}>Smart Analysis</Text>
										<Text style={styles.aiFeatureDescription}>
											Detailed analysis of your strengths and weaknesses
										</Text>
									</View>

									<View style={styles.aiFeatureItem}>
										<View
											style={[
												styles.aiFeatureIconBg,
												{ backgroundColor: `${COLORS.neonPurple}30` },
											]}
										>
											<MaterialCommunityIcons
												name="route"
												size={24}
												color={COLORS.neonPurple}
											/>
										</View>
										<Text style={styles.aiFeatureTitle}>Custom Path</Text>
										<Text style={styles.aiFeatureDescription}>
											Personalized learning journey based on your goals
										</Text>
									</View>

									<View style={styles.aiFeatureItem}>
										<View
											style={[
												styles.aiFeatureIconBg,
												{ backgroundColor: `${COLORS.neonGreen}30` },
											]}
										>
											<MaterialCommunityIcons
												name="microphone"
												size={24}
												color={COLORS.neonGreen}
											/>
										</View>
										<Text style={styles.aiFeatureTitle}>
											Pronunciation Coach
										</Text>
										<Text style={styles.aiFeatureDescription}>
											Real-time feedback on your spoken English
										</Text>
									</View>

									<View style={styles.aiFeatureItem}>
										<View
											style={[
												styles.aiFeatureIconBg,
												{ backgroundColor: `${COLORS.neonOrange}30` },
											]}
										>
											<MaterialCommunityIcons
												name="progress-check"
												size={24}
												color={COLORS.neonOrange}
											/>
										</View>
										<Text style={styles.aiFeatureTitle}>Adaptive Testing</Text>
										<Text style={styles.aiFeatureDescription}>
											Tests that adjust to your skill level in real-time
										</Text>
									</View>
								</View>
							</View>
						</Animated.View>
					)} */}

					<Animated.View
						entering={FadeInDown.delay(700).duration(400)}
						style={styles.actionButtonsContainer}
					>
						{!hasActiveSubscription && (
							<>
								<TouchableOpacity
									style={[
										styles.freeTrialButton,
										{
											backgroundColor:
												selectedPlan === "foundation"
													? COLORS.neonBlue
													: COLORS.neonPurple,
										},
									]}
									onPress={handleFreeTrial}
									disabled={isLoading}
								>
									{isLoading ? (
										<ActivityIndicator color={COLORS.textPrimary} />
									) : (
										<>
											<MaterialCommunityIcons
												name="trophy"
												size={20}
												color={COLORS.textPrimary}
												style={styles.buttonIcon}
											/>
											<Text style={styles.freeTrialButtonText}>
												Start 7-Day Free Trial
											</Text>
										</>
									)}
								</TouchableOpacity>
								<Text style={styles.trialNoteText}>
									Trial automatically converts to a paid subscription unless
									canceled
								</Text>

								<TouchableOpacity
									style={styles.subscribeButton}
									onPress={handlePurchase}
									disabled={isLoading}
								>
									<MaterialCommunityIcons
										name="credit-card-outline"
										size={20}
										color={COLORS.textPrimary}
										style={styles.buttonIcon}
									/>
									<Text style={styles.subscribeButtonText}>Subscribe Now</Text>
								</TouchableOpacity>
							</>
						)}

						{hasActiveSubscription && (
							<TouchableOpacity style={styles.managePlanButton}>
								<MaterialCommunityIcons
									name="cog-outline"
									size={20}
									color={COLORS.textPrimary}
									style={styles.buttonIcon}
								/>
								<Text style={styles.managePlanButtonText}>Manage Plan</Text>
							</TouchableOpacity>
						)}
					</Animated.View>

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
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: Platform.OS === "ios" ? 10 : 40,
		paddingBottom: 15,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		justifyContent: "center",
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
	crownContainer: {
		alignItems: "center",
		marginTop: 10,
		marginBottom: 20,
	},
	crownIcon: {
		textShadowColor: COLORS.neonYellow,
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 15,
	},
	subscriptionStatusContainer: {
		alignItems: "center",
		marginBottom: 30,
	},
	activeSubscriptionText: {
		color: COLORS.neonGreen,
		fontSize: 20,
		fontWeight: "700",
		marginBottom: 5,
	},
	renewalText: {
		color: COLORS.textSecondary,
		fontSize: 14,
	},
	noSubscriptionText: {
		color: COLORS.textPrimary,
		fontSize: 22,
		fontWeight: "700",
		marginBottom: 5,
	},
	subscribePromptText: {
		color: COLORS.textSecondary,
		fontSize: 14,
		textAlign: "center",
		paddingHorizontal: 20,
	},
	billingCycleContainer: {
		marginBottom: 20,
	},
	billingCycleLabel: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 10,
		textAlign: "center",
	},
	billingToggleContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.08)",
		borderRadius: 12,
		padding: 10,
	},
	billingText: {
		color: COLORS.textSecondary,
		fontSize: 14,
	},
	activeBillingText: {
		color: COLORS.textPrimary,
		fontWeight: "600",
	},
	billingSwitch: {
		marginHorizontal: 15,
	},
	billingYearlyContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	savingsBadge: {
		backgroundColor: `${COLORS.neonGreen}30`,
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 12,
		marginLeft: 8,
	},
	savingsText: {
		color: COLORS.neonGreen,
		fontSize: 10,
		fontWeight: "700",
	},
	planCardsContainer: {
		marginBottom: 20,
	},
	planCardContainer: {
		marginBottom: 16,
	},
	planCard: {
		borderRadius: 16,
		borderWidth: 2,
		overflow: "hidden",
	},
	selectedPlanCard: {
		shadowColor: COLORS.neonPurple,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.5,
		shadowRadius: 10,
		elevation: 10,
	},
	planCardGradient: {
		padding: 16,
		position: "relative",
	},
	selectedBadge: {
		position: "absolute",
		top: 16,
		right: 16,
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
	},
	selectedBadgeText: {
		color: COLORS.textPrimary,
		fontSize: 10,
		fontWeight: "800",
	},
	planIconContainer: {
		width: 56,
		height: 56,
		borderRadius: 28,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 12,
	},
	planCardTitle: {
		color: COLORS.textPrimary,
		fontSize: 24,
		fontWeight: "700",
		marginBottom: 6,
	},
	planCardDescription: {
		color: COLORS.textSecondary,
		fontSize: 14,
		marginBottom: 16,
		lineHeight: 20,
	},
	planPriceContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 12,
	},
	planCurrencySymbol: {
		color: COLORS.textPrimary,
		fontSize: 28,
		fontWeight: "700",
		marginTop: 4,
	},
	planPrice: {
		fontSize: 32,
		fontWeight: "700",
	},
	planPriceDetailsContainer: {
		marginLeft: 4,
		marginTop: 16,
	},
	planPricePerMonth: {
		color: COLORS.textPrimary,
		fontSize: 14,
	},
	planBilledAnnually: {
		color: COLORS.textSecondary,
		fontSize: 11,
		marginTop: 2,
	},
	planSavingsBadge: {
		alignSelf: "flex-start",
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 12,
		marginBottom: 16,
	},
	planSavingsText: {
		color: COLORS.neonGreen,
		fontSize: 12,
		fontWeight: "600",
	},
	planFeatureList: {
		marginTop: 12,
	},
	planFeatureItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	planFeatureText: {
		color: COLORS.textPrimary,
		fontSize: 14,
		marginLeft: 8,
		flex: 1,
	},
	planFeatureTextDisabled: {
		color: "rgba(255, 255, 255, 0.4)",
	},
	aiPoweredTag: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "flex-start",
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 12,
		marginTop: 8,
	},
	aiPoweredText: {
		fontSize: 12,
		fontWeight: "600",
		marginLeft: 5,
	},
	featuresComparisonCard: {
		backgroundColor: "rgba(255, 255, 255, 0.08)",
		borderRadius: 16,
		padding: 16,
		marginBottom: 20,
	},
	featuresComparisonTitle: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 16,
	},
	featureComparisonRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.05)",
	},
	featureComparisonTextContainer: {
		flex: 1,
	},
	featureComparisonText: {
		color: COLORS.textPrimary,
		fontSize: 14,
	},
	featureComparisonTextDisabled: {
		color: "rgba(255, 255, 255, 0.4)",
	},
	featureComparisonIndicator: {
		marginLeft: 10,
	},
	aiAdvantageContainer: {
		backgroundColor: "rgba(255, 255, 255, 0.08)",
		borderRadius: 16,
		padding: 16,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: `${COLORS.neonPurple}40`,
	},
	aiHeaderRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	aiAdvantageTitle: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "700",
		marginLeft: 10,
	},
	aiAdvantageSubtitle: {
		color: COLORS.textSecondary,
		fontSize: 14,
		marginBottom: 20,
		lineHeight: 20,
	},
	aiFeatureGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	aiFeatureItem: {
		width: "48%",
		alignItems: "center",
		marginBottom: 20,
	},
	aiFeatureIconBg: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
	},
	aiFeatureTitle: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 5,
		textAlign: "center",
	},
	aiFeatureDescription: {
		color: COLORS.textSecondary,
		fontSize: 12,
		textAlign: "center",
		lineHeight: 16,
	},
	actionButtonsContainer: {
		marginBottom: 20,
	},
	freeTrialButton: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 16,
		borderRadius: 12,
		marginBottom: 8,
	},
	buttonIcon: {
		marginRight: 8,
	},
	freeTrialButtonText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "700",
	},
	trialNoteText: {
		color: COLORS.textSecondary,
		fontSize: 12,
		textAlign: "center",
		marginBottom: 15,
	},
	subscribeButton: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: COLORS.neonBlue,
		paddingVertical: 16,
		borderRadius: 12,
	},
	subscribeButtonText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "700",
	},
	managePlanButton: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: COLORS.neonBlue,
		paddingVertical: 16,
		borderRadius: 12,
	},
	managePlanButtonText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "700",
	},
});
