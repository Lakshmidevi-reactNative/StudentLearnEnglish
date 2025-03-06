import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Modal,
	ScrollView,
	SafeAreaView,
	Image,
	Platform,
	ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

// Colors from your existing theme
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

const PremiumSubscriptionModal = ({
	visible,
	onClose,
	navigation,
	userData,
}) => {
	const [selectedPlan, setSelectedPlan] = useState("yearly"); // Default to yearly for best value
	const [isProcessing, setIsProcessing] = useState(false);

	const plans = [
		{
			id: "monthly",
			title: "Monthly Plan",
			price: "$9.99",
			period: "per month",
			features: [
				"Full access to all premium content",
				"Unlimited practice exercises",
				"Personalized learning path",
				"AI-powered feedback",
				"Cancel anytime",
			],
			popular: false,
			gradient: ["#3B82F6", "#2563EB"],
		},
		{
			id: "yearly",
			title: "Yearly Plan",
			price: "$79.99",
			period: "per year",
			savings: "Save 33%",
			features: [
				"All monthly plan features",
				"Advanced analytics dashboard",
				"Priority support",
				"Offline mode",
				"Certificate of completion",
			],
			popular: true,
			gradient: ["#8B5CF6", "#6D28D9"],
		},
		{
			id: "trial",
			title: "7-Day Free Trial",
			price: "Free",
			period: "then $9.99/month",
			features: [
				"7 days of full premium access",
				"No commitment required",
				"Auto-cancels after trial",
				"Email reminder before billing",
				"Full access to beginner content",
			],
			popular: false,
			gradient: ["#10B981", "#059669"],
		},
	];

	const handleSubscribe = () => {
		// Start loading state
		setIsProcessing(true);

		// Here you would normally integrate with a payment provider
		const plan = plans.find((p) => p.id === selectedPlan);

		// Mock subscription data
		const subscriptionData = {
			plan: selectedPlan,
			price: plan.price,
			startDate: new Date(),
			userData: userData || {},
		};

		// Simulate API delay
		setTimeout(() => {
			setIsProcessing(false);
			onClose();

			// Navigate to MainApp screen with subscription data
			navigation.navigate("MainApp", {
				subscriptionData: subscriptionData,
				...userData,
			});
		}, 1000);
	};

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent={false}
			onRequestClose={onClose}
		>
			<SafeAreaView style={styles.modalContainer}>
				<View style={styles.modalHeader}>
					<TouchableOpacity style={styles.closeButton} onPress={onClose}>
						<MaterialIcons name="close" size={24} color={COLORS.text} />
					</TouchableOpacity>
					<Text style={styles.modalTitle}>Premium Access</Text>
					<View style={{ width: 24 }} />
				</View>

				<ScrollView
					style={styles.modalContent}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.heroSection}>
						<MaterialCommunityIcons
							name="crown"
							size={48}
							color={COLORS.accent}
						/>
						<Text style={styles.heroTitle}>
							Upgrade Your Learning Experience
						</Text>
						<Text style={styles.heroSubtitle}>
							Unlock your full potential with premium features tailored to help
							you master English faster
						</Text>
					</View>

					<View style={styles.plansContainer}>
						{plans.map((plan) => (
							<TouchableOpacity
								key={plan.id}
								style={[
									styles.planCard,
									selectedPlan === plan.id && styles.selectedPlanCard,
									plan.popular && styles.popularPlanCard,
								]}
								onPress={() => setSelectedPlan(plan.id)}
							>
								{plan.popular && (
									<View style={styles.popularBadge}>
										<Text style={styles.popularBadgeText}>Best Value</Text>
									</View>
								)}

								<View style={styles.planHeader}>
									<Text style={styles.planTitle}>{plan.title}</Text>
									<View style={styles.priceContainer}>
										<Text style={styles.planPrice}>{plan.price}</Text>
										<Text style={styles.planPeriod}>{plan.period}</Text>
									</View>
									{plan.savings && (
										<View style={styles.savingsBadge}>
											<Text style={styles.savingsText}>{plan.savings}</Text>
										</View>
									)}
								</View>

								<View style={styles.featuresList}>
									{plan.features.map((feature, index) => (
										<View key={index} style={styles.featureItem}>
											<MaterialIcons
												name="check-circle"
												size={18}
												color={COLORS.success}
												style={styles.featureIcon}
											/>
											<Text style={styles.featureText}>{feature}</Text>
										</View>
									))}
								</View>

								<View style={styles.planSelector}>
									<View
										style={[
											styles.radioCircle,
											selectedPlan === plan.id && styles.radioCircleSelected,
										]}
									>
										{selectedPlan === plan.id && (
											<View style={styles.selectedRing} />
										)}
									</View>
								</View>
							</TouchableOpacity>
						))}
					</View>

					<View style={styles.benefitsSection}>
						<Text style={styles.benefitsSectionTitle}>Premium Benefits</Text>

						<View style={styles.benefitRow}>
							<View style={styles.benefitIcon}>
								<MaterialIcons
									name="videocam"
									size={24}
									color={COLORS.primary}
								/>
							</View>
							<View style={styles.benefitContent}>
								<Text style={styles.benefitTitle}>Expert Video Lessons</Text>
								<Text style={styles.benefitDesc}>
									Access high-quality video lessons from certified TEFL
									instructors
								</Text>
							</View>
						</View>

						<View style={styles.benefitRow}>
							<View style={styles.benefitIcon}>
								<MaterialIcons
									name="headset"
									size={24}
									color={COLORS.primary}
								/>
							</View>
							<View style={styles.benefitContent}>
								<Text style={styles.benefitTitle}>Pronunciation Practice</Text>
								<Text style={styles.benefitDesc}>
									Get instant feedback on your pronunciation with AI technology
								</Text>
							</View>
						</View>

						<View style={styles.benefitRow}>
							<View style={styles.benefitIcon}>
								<MaterialIcons
									name="insert-chart"
									size={24}
									color={COLORS.primary}
								/>
							</View>
							<View style={styles.benefitContent}>
								<Text style={styles.benefitTitle}>Progress Analytics</Text>
								<Text style={styles.benefitDesc}>
									Track your learning journey with detailed progress analytics
								</Text>
							</View>
						</View>
					</View>

					<View style={styles.guaranteeSection}>
						<MaterialIcons
							name="verified-user"
							size={28}
							color={COLORS.success}
						/>
						<Text style={styles.guaranteeTitle}>
							100% Satisfaction Guarantee
						</Text>
						<Text style={styles.guaranteeText}>
							If you're not completely satisfied within the first 14 days, we'll
							refund your payment in full.
						</Text>
					</View>
				</ScrollView>

				<View style={styles.subscribeButtonContainer}>
					<TouchableOpacity
						style={styles.subscribeButton}
						onPress={handleSubscribe}
						disabled={isProcessing}
					>
						<LinearGradient
							colors={
								selectedPlan === "monthly"
									? ["#3B82F6", "#2563EB"]
									: selectedPlan === "yearly"
									? ["#8B5CF6", "#6D28D9"]
									: ["#10B981", "#059669"]
							}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={styles.subscribeGradient}
						>
							{isProcessing ? (
								<ActivityIndicator color={COLORS.white} size="small" />
							) : (
								<Text style={styles.subscribeButtonText}>
									{selectedPlan === "trial"
										? "Start Free Trial"
										: "Subscribe Now"}
								</Text>
							)}
						</LinearGradient>
					</TouchableOpacity>

					<Text style={styles.termsText}>
						By subscribing you agree to our Terms of Service and Privacy Policy
					</Text>
				</View>
			</SafeAreaView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
	},
	closeButton: {
		padding: 8,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: COLORS.text,
	},
	modalContent: {
		flex: 1,
	},
	heroSection: {
		alignItems: "center",
		paddingVertical: 24,
		paddingHorizontal: 20,
	},
	heroTitle: {
		fontSize: 24,
		fontWeight: "700",
		color: COLORS.text,
		textAlign: "center",
		marginTop: 16,
		marginBottom: 8,
	},
	heroSubtitle: {
		fontSize: 15,
		color: COLORS.textLight,
		textAlign: "center",
		lineHeight: 22,
		marginHorizontal: 20,
	},
	plansContainer: {
		paddingHorizontal: 16,
		marginBottom: 24,
	},
	planCard: {
		backgroundColor: COLORS.surface,
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		borderWidth: 2,
		borderColor: COLORS.border,
		position: "relative",
	},
	selectedPlanCard: {
		borderColor: COLORS.accent,
		backgroundColor: COLORS.white,
	},
	popularPlanCard: {
		borderColor: COLORS.accent,
	},
	popularBadge: {
		position: "absolute",
		top: -12,
		right: 20,
		backgroundColor: COLORS.accent,
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 12,
	},
	popularBadgeText: {
		color: COLORS.white,
		fontWeight: "600",
		fontSize: 12,
	},
	planHeader: {
		marginBottom: 16,
	},
	planTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: COLORS.text,
		marginBottom: 8,
	},
	priceContainer: {
		flexDirection: "row",
		alignItems: "baseline",
	},
	planPrice: {
		fontSize: 28,
		fontWeight: "800",
		color: COLORS.text,
	},
	planPeriod: {
		fontSize: 14,
		color: COLORS.textLight,
		marginLeft: 4,
	},
	savingsBadge: {
		backgroundColor: COLORS.success + "20", // 20% opacity
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 8,
		alignSelf: "flex-start",
		marginTop: 8,
	},
	savingsText: {
		color: COLORS.success,
		fontWeight: "600",
		fontSize: 12,
	},
	featuresList: {
		marginBottom: 16,
	},
	featureItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	featureIcon: {
		marginRight: 8,
	},
	featureText: {
		fontSize: 14,
		color: COLORS.text,
		flex: 1,
	},
	planSelector: {
		position: "absolute",
		top: 20,
		right: 20,
	},
	radioCircle: {
		height: 22,
		width: 22,
		borderRadius: 11,
		borderWidth: 2,
		borderColor: COLORS.border,
		alignItems: "center",
		justifyContent: "center",
	},
	radioCircleSelected: {
		borderColor: COLORS.accent,
	},
	selectedRing: {
		height: 12,
		width: 12,
		borderRadius: 6,
		backgroundColor: COLORS.accent,
	},
	benefitsSection: {
		padding: 20,
		backgroundColor: COLORS.surface,
		borderRadius: 16,
		marginHorizontal: 16,
		marginBottom: 24,
	},
	benefitsSectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: COLORS.text,
		marginBottom: 16,
	},
	benefitRow: {
		flexDirection: "row",
		marginBottom: 16,
	},
	benefitIcon: {
		width: 40,
		height: 40,
		borderRadius: 8,
		backgroundColor: COLORS.primaryLight + "30", // 30% opacity
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	benefitContent: {
		flex: 1,
	},
	benefitTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: COLORS.text,
		marginBottom: 4,
	},
	benefitDesc: {
		fontSize: 14,
		color: COLORS.textLight,
		lineHeight: 20,
	},
	guaranteeSection: {
		padding: 20,
		alignItems: "center",
		marginBottom: 24,
		marginHorizontal: 16,
		backgroundColor: COLORS.success + "10", // 10% opacity
		borderRadius: 16,
	},
	guaranteeTitle: {
		fontSize: 16,
		fontWeight: "700",
		color: COLORS.text,
		marginTop: 8,
		marginBottom: 4,
	},
	guaranteeText: {
		fontSize: 14,
		color: COLORS.textLight,
		textAlign: "center",
		lineHeight: 20,
	},
	subscribeButtonContainer: {
		padding: 16,
		borderTopWidth: 1,
		borderTopColor: COLORS.border,
	},
	subscribeButton: {
		marginBottom: 12,
		borderRadius: 12,
		overflow: "hidden",
	},
	subscribeGradient: {
		paddingVertical: 16,
		alignItems: "center",
	},
	subscribeButtonText: {
		color: COLORS.white,
		fontSize: 16,
		fontWeight: "700",
	},
	termsText: {
		fontSize: 12,
		color: COLORS.textLight,
		textAlign: "center",
	},
});

export default PremiumSubscriptionModal;
