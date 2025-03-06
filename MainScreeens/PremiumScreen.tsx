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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	MaterialCommunityIcons,
	FontAwesome5,
	Ionicons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS } from "./constants/Colors";
import { toast } from "sonner-native";

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
			monthly: 9.99,
			yearly: 99.99,
			yearlySavings: 20,
		},
		fluence: {
			monthly: 19.99,
			yearly: 199.99,
			yearlySavings: 20,
		},
	};

	// Plan features
	const features = {
		foundation: [
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
		fluence: [
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
	};

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

	const getCurrentPrice = () => {
		return pricing[selectedPlan][billingCycle];
	};

	const getMonthlyPrice = () => {
		if (billingCycle === "monthly") {
			return pricing[selectedPlan].monthly;
		} else {
			// Calculate the monthly equivalent from the yearly price
			return (pricing[selectedPlan].yearly / 12).toFixed(2);
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
								<Text style={styles.noSubscriptionText}>No Active Premium</Text>
								<Text style={styles.subscribePromptText}>
									Subscribe to unlock premium features and accelerate your
									learning
								</Text>
							</View>
						)}
					</Animated.View>

					<Animated.View entering={FadeInDown.delay(200).duration(400)}>
						<View style={styles.selectionContainer}>
							<View style={styles.planToggleContainer}>
								<TouchableOpacity
									style={[
										styles.planToggleButton,
										selectedPlan === "foundation" &&
											styles.planToggleButtonActive,
									]}
									onPress={() => setSelectedPlan("foundation")}
								>
									<Text
										style={[
											styles.planToggleText,
											selectedPlan === "foundation" &&
												styles.planToggleTextActive,
										]}
									>
										Foundation
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[
										styles.planToggleButton,
										selectedPlan === "fluence" && styles.planToggleButtonActive,
									]}
									onPress={() => setSelectedPlan("fluence")}
								>
									<Text
										style={[
											styles.planToggleText,
											selectedPlan === "fluence" && styles.planToggleTextActive,
										]}
									>
										Fluence
									</Text>
								</TouchableOpacity>
							</View>

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

					<Animated.View entering={FadeInDown.delay(300).duration(400)}>
						<View style={styles.pricingCard}>
							<Text style={styles.planName}>
								{selectedPlan === "foundation" ? "Foundation" : "Fluence"} Plan
							</Text>
							<View style={styles.priceContainer}>
								<Text style={styles.currencySymbol}>$</Text>
								<Text style={styles.price}>{getMonthlyPrice()}</Text>
								<View style={styles.billingFrequencyContainer}>
									<Text style={styles.perMonth}>/month</Text>
									{billingCycle === "yearly" && (
										<Text style={styles.billedAnnually}>billed annually</Text>
									)}
								</View>
							</View>

							{billingCycle === "yearly" && (
								<View style={styles.savingsContainer}>
									<Text style={styles.savingsInfoText}>
										Total: ${pricing[selectedPlan].yearly} per year{" "}
										<Text style={styles.savingsHighlight}>
											(Save ${pricing[selectedPlan].yearlySavings}%)
										</Text>
									</Text>
								</View>
							)}
						</View>
					</Animated.View>

					<Animated.View entering={FadeInDown.delay(400).duration(400)}>
						<View style={styles.featuresContainer}>
							<Text style={styles.featuresTitle}>What's Included</Text>

							{features[selectedPlan].map((feature, index) => (
								<View key={index} style={styles.featureItem}>
									<MaterialCommunityIcons
										name={feature.included ? "check-circle" : "close-circle"}
										size={22}
										color={
											feature.included
												? COLORS.neonGreen
												: "rgba(255,255,255,0.3)"
										}
										style={styles.featureIcon}
									/>
									<Text
										style={[
											styles.featureText,
											!feature.included && styles.featureTextDisabled,
										]}
									>
										{feature.title}
									</Text>
								</View>
							))}
						</View>
					</Animated.View>

					{selectedPlan === "fluence" && (
						<Animated.View entering={FadeInDown.delay(500).duration(400)}>
							<View style={styles.aiAdvantageContainer}>
								<Text style={styles.aiAdvantageTitle}>
									AI-Powered Learning Advantage
								</Text>
								<View style={styles.aiFeatureRow}>
									<View style={styles.aiFeature}>
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

									<View style={styles.aiFeature}>
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
								</View>
							</View>
						</Animated.View>
					)}

					<Animated.View
						entering={FadeInDown.delay(600).duration(400)}
						style={styles.actionButtonsContainer}
					>
						{!hasActiveSubscription && (
							<>
								<TouchableOpacity
									style={styles.freeTrialButton}
									onPress={handleFreeTrial}
									disabled={isLoading}
								>
									{isLoading ? (
										<ActivityIndicator color={COLORS.textPrimary} />
									) : (
										<Text style={styles.freeTrialButtonText}>
											Start 7-Day Free Trial
										</Text>
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
									<Text style={styles.subscribeButtonText}>Buy Now</Text>
								</TouchableOpacity>
							</>
						)}

						{hasActiveSubscription && (
							<TouchableOpacity style={styles.managePlanButton}>
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
		fontSize: 20,
		fontWeight: "700",
		marginBottom: 5,
	},
	subscribePromptText: {
		color: COLORS.textSecondary,
		fontSize: 14,
		textAlign: "center",
		paddingHorizontal: 20,
	},
	selectionContainer: {
		marginBottom: 20,
	},
	planToggleContainer: {
		flexDirection: "row",
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		borderRadius: 10,
		marginBottom: 20,
		padding: 4,
	},
	planToggleButton: {
		flex: 1,
		paddingVertical: 12,
		alignItems: "center",
		borderRadius: 8,
	},
	planToggleButtonActive: {
		backgroundColor: "rgba(255, 255, 255, 0.15)",
	},
	planToggleText: {
		color: COLORS.textSecondary,
		fontWeight: "600",
		fontSize: 16,
	},
	planToggleTextActive: {
		color: COLORS.textPrimary,
	},
	billingToggleContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
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
	pricingCard: {
		backgroundColor: "rgba(255, 255, 255, 0.08)",
		borderRadius: 16,
		padding: 20,
		alignItems: "center",
		marginBottom: 20,
	},
	planName: {
		color: COLORS.textPrimary,
		fontSize: 20,
		fontWeight: "700",
		marginBottom: 10,
	},
	priceContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 5,
	},
	currencySymbol: {
		color: COLORS.textPrimary,
		fontSize: 24,
		fontWeight: "700",
		marginTop: 5,
	},
	price: {
		color: COLORS.textPrimary,
		fontSize: 36,
		fontWeight: "700",
	},
	billingFrequencyContainer: {
		marginLeft: 5,
		marginTop: 8,
	},
	perMonth: {
		color: COLORS.textPrimary,
		fontSize: 16,
	},
	billedAnnually: {
		color: COLORS.textSecondary,
		fontSize: 12,
		marginTop: 2,
	},
	savingsContainer: {
		marginTop: 5,
	},
	savingsInfoText: {
		color: COLORS.textSecondary,
		fontSize: 14,
	},
	savingsHighlight: {
		color: COLORS.neonGreen,
		fontWeight: "600",
	},
	featuresContainer: {
		backgroundColor: "rgba(255, 255, 255, 0.08)",
		borderRadius: 16,
		padding: 20,
		marginBottom: 20,
	},
	featuresTitle: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 15,
	},
	featureItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	featureIcon: {
		marginRight: 10,
	},
	featureText: {
		color: COLORS.textPrimary,
		fontSize: 15,
		flex: 1,
	},
	featureTextDisabled: {
		color: "rgba(255, 255, 255, 0.4)",
	},
	aiAdvantageContainer: {
		backgroundColor: "rgba(255, 255, 255, 0.08)",
		borderRadius: 16,
		padding: 20,
		marginBottom: 20,
	},
	aiAdvantageTitle: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 15,
	},
	aiFeatureRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	aiFeature: {
		width: "48%",
		alignItems: "center",
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
	},
	aiFeatureDescription: {
		color: COLORS.textSecondary,
		fontSize: 12,
		textAlign: "center",
		lineHeight: 18,
	},
	actionButtonsContainer: {
		marginBottom: 20,
	},
	freeTrialButton: {
		backgroundColor: COLORS.neonPurple,
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
		marginBottom: 8,
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
		backgroundColor: COLORS.neonBlue,
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	subscribeButtonText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "700",
	},
	managePlanButton: {
		backgroundColor: COLORS.neonBlue,
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	managePlanButtonText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "700",
	},
});
