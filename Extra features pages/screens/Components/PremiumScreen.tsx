import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	SafeAreaView,
	StatusBar,
	ScrollView,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const PremiumScreen = () => {
	const navigation = useNavigation();
	const [selectedPlan, setSelectedPlan] = useState("foundation-monthly"); // Default selected plan
	const [selectedType, setSelectedType] = useState("foundation"); // Default subscription type
	const [selectedDuration, setSelectedDuration] = useState("monthly"); // Default duration

	// Subscription plans
	const foundationFeatures = [
		"L S R W T P (English)",
		"Basic Practice Tests",
		"Class Tests Access",
		"Standard Progress Tracking",
	];

	const fluenceFeatures = [
		"All Foundation Features",
		"Advanced Practice Tests",
		"Pronunciation Analysis",
		"AI-Powered Feedback",
		"Personalized Learning Path",
	];

	const plans = {
		"foundation-monthly": {
			name: "Foundation Monthly",
			type: "foundation",
			duration: "monthly",
			price: "$8.99/month",
			features: foundationFeatures,
			savings: "0%",
		},
		"foundation-yearly": {
			name: "Foundation Yearly",
			type: "foundation",
			duration: "yearly",
			price: "$79.99/year",
			features: foundationFeatures,
			savings: "26%",
		},
		"fluence-monthly": {
			name: "Fluence Monthly",
			type: "fluence",
			duration: "monthly",
			price: "$14.99/month",
			features: fluenceFeatures,
			savings: "0%",
		},
		"fluence-yearly": {
			name: "Fluence Yearly",
			type: "fluence",
			duration: "yearly",
			price: "$129.99/year",
			features: fluenceFeatures,
			savings: "28%",
		},
	};

	const handleStartFreeTrial = () => {
		// Logic to start the 7-day free trial
	};

	const handlePurchase = () => {
		// Add your purchase logic here with the selected plan
	};

	const handleBack = () => {
		navigation.goBack();
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="dark-content" />

			{/* Header with back button */}
			<View style={styles.header}>
				<TouchableOpacity onPress={handleBack} style={styles.backButton}>
					<MaterialIcons name="arrow-back" size={24} color="#0A2268" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Premium Subscriptions</Text>
				<View style={{ width: 24 }} />
			</View>

			<ScrollView showsVerticalScrollIndicator={false}>
				{/* Premium Status Summary */}
				<View style={styles.summaryCard}>
					<Text style={styles.summaryTitle}>Your Premium Status</Text>
					<View style={styles.expiredTag}>
						<MaterialIcons name="error" size={16} color="#EF4444" />
						<Text style={styles.expiredTagText}>No Active Premium</Text>
					</View>
					<Text style={styles.summaryText}>
						You don't have any active premium subscriptions.
					</Text>
				</View>

				{/* Plan Selection Section */}
				<Text style={styles.sectionTitle}>Choose Your Plan</Text>

				{/* Plan Type Tabs */}
				<View style={styles.planTypeTabs}>
					<TouchableOpacity
						style={[
							styles.planTypeTab,
							selectedType === "foundation" && styles.activePlanTypeTab,
						]}
						onPress={() => {
							setSelectedType("foundation");
							setSelectedPlan(
								selectedDuration === "monthly"
									? "foundation-monthly"
									: "foundation-yearly"
							);
						}}
					>
						<Text
							style={[
								styles.planTypeTabText,
								selectedType === "foundation" && styles.activePlanTypeTabText,
							]}
						>
							FOUNDATION
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.planTypeTab,
							selectedType === "fluence" && styles.activePlanTypeTab,
						]}
						onPress={() => {
							setSelectedType("fluence");
							setSelectedPlan(
								selectedDuration === "monthly"
									? "fluence-monthly"
									: "fluence-yearly"
							);
						}}
					>
						<Text
							style={[
								styles.planTypeTabText,
								selectedType === "fluence" && styles.activePlanTypeTabText,
							]}
						>
							FLUENCE
						</Text>
					</TouchableOpacity>
				</View>

				{/* Duration Tabs */}
				<View style={styles.durationTabs}>
					<TouchableOpacity
						style={[
							styles.durationTab,
							selectedDuration === "monthly" && styles.activeDurationTab,
						]}
						onPress={() => {
							setSelectedDuration("monthly");
							setSelectedPlan(
								selectedType === "foundation"
									? "foundation-monthly"
									: "fluence-monthly"
							);
						}}
					>
						<Text
							style={[
								styles.durationTabText,
								selectedDuration === "monthly" && styles.activeDurationTabText,
							]}
						>
							Monthly
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.durationTab,
							selectedDuration === "yearly" && styles.activeDurationTab,
						]}
						onPress={() => {
							setSelectedDuration("yearly");
							setSelectedPlan(
								selectedType === "foundation"
									? "foundation-yearly"
									: "fluence-yearly"
							);
						}}
					>
						<Text
							style={[
								styles.durationTabText,
								selectedDuration === "yearly" && styles.activeDurationTabText,
							]}
						>
							Yearly
						</Text>
						{plans[selectedType + "-yearly"].savings !== "0%" && (
							<View style={styles.tabSavingsTag}>
								<Text style={styles.tabSavingsText}>
									Save {plans[selectedType + "-yearly"].savings}
								</Text>
							</View>
						)}
					</TouchableOpacity>
				</View>

				{/* Selected Plan Card */}
				<View style={styles.selectedPlanCard}>
					<View style={styles.planHeader}>
						<Text style={styles.planTitle}>{plans[selectedPlan].name}</Text>
						{plans[selectedPlan].savings !== "0%" && (
							<View style={styles.savingsTag}>
								<Text style={styles.savingsText}>
									Save {plans[selectedPlan].savings}
								</Text>
							</View>
						)}
					</View>

					<Text style={styles.planPrice}>{plans[selectedPlan].price}</Text>

					<View style={styles.featuresContainer}>
						<Text style={styles.featuresSubtitle}>What's Included:</Text>
						{plans[selectedPlan].features.map((feature, index) => (
							<View key={index} style={styles.featureRow}>
								<MaterialIcons
									name="check-circle"
									size={16}
									color={selectedType === "foundation" ? "#4A90E2" : "#9C27B0"}
								/>
								<Text style={styles.featureText}>{feature}</Text>
							</View>
						))}
					</View>

					{selectedType === "fluence" && (
						<View style={styles.advantageContainer}>
							<MaterialIcons name="star" size={18} color="#9C27B0" />
							<Text style={styles.advantageText}>
								Fluence offers enhanced AI-powered learning tools and
								personalized feedback
							</Text>
						</View>
					)}
				</View>

				{/* Free Trial Button */}
				<TouchableOpacity
					style={[
						styles.freeTrialButton,
						{
							backgroundColor:
								selectedType === "foundation" ? "#4A90E2" : "#9C27B0",
						},
					]}
					onPress={handleStartFreeTrial}
					activeOpacity={0.8}
				>
					<MaterialIcons name="play-circle-filled" size={18} color="#FFFFFF" />
					<Text style={styles.freeTrialButtonText}>
						Start Your 7-Day Free Trial
					</Text>
				</TouchableOpacity>

				{/* Purchase Button */}
				<TouchableOpacity
					style={[
						styles.purchaseButton,
						{
							backgroundColor:
								selectedType === "foundation" ? "#0A2268" : "#6A1B9A",
						},
					]}
					onPress={handlePurchase}
					activeOpacity={0.8}
				>
					<MaterialIcons name="credit-card" size={18} color="#FFFFFF" />
					<Text style={styles.purchaseButtonText}>
						Purchase {plans[selectedPlan].name}
					</Text>
				</TouchableOpacity>

				{/* Additional Information */}
				<View style={styles.infoContainer}>
					<Text style={styles.infoText}>
						Free trial automatically converts to a paid subscription after 7
						days unless canceled before the trial period ends.
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#F5F7FA",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 20,
		paddingTop: 10,
	},
	backButton: {
		padding: 8,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#0A2268",
	},
	summaryCard: {
		padding: 20,
		borderRadius: 16,
		backgroundColor: "#0A2268",
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 15,
		elevation: 4,
	},
	summaryTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: "white",
		marginBottom: 12,
	},
	summaryText: {
		fontSize: 15,
		color: "#E2E8F0",
		marginTop: 8,
		marginBottom: 10,
	},
	expiredTag: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "flex-start",
		backgroundColor: "#FEE2E2",
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
	},
	expiredTagText: {
		marginLeft: 4,
		color: "#DC2626",
		fontWeight: "500",
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1F2937",
		marginBottom: 16,
		marginTop: 10,
	},
	planTypeTabs: {
		flexDirection: "row",
		marginBottom: 16,
		borderRadius: 12,
		overflow: "hidden",
		backgroundColor: "#E5E7EB",
	},
	planTypeTab: {
		flex: 1,
		paddingVertical: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	activePlanTypeTab: {
		backgroundColor: "#0A2268",
	},
	planTypeTabText: {
		fontWeight: "600",
		color: "#4B5563",
	},
	activePlanTypeTabText: {
		color: "white",
	},
	durationTabs: {
		flexDirection: "row",
		marginBottom: 20,
		borderRadius: 12,
		overflow: "hidden",
		backgroundColor: "#E5E7EB",
	},
	durationTab: {
		flex: 1,
		paddingVertical: 12,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
	},
	activeDurationTab: {
		backgroundColor: "#0A2268",
	},
	durationTabText: {
		fontWeight: "600",
		color: "#4B5563",
	},
	activeDurationTabText: {
		color: "white",
	},
	tabSavingsTag: {
		backgroundColor: "#10B981",
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 8,
		marginLeft: 6,
	},
	tabSavingsText: {
		fontSize: 10,
		color: "white",
		fontWeight: "600",
	},
	selectedPlanCard: {
		backgroundColor: "white",
		borderRadius: 16,
		padding: 20,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 15,
		elevation: 4,
	},
	planHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	planTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: "#1F2937",
	},
	savingsTag: {
		backgroundColor: "#ECFDF5",
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 8,
	},
	savingsText: {
		fontSize: 12,
		color: "#059669",
		fontWeight: "500",
	},
	planPrice: {
		fontSize: 24,
		fontWeight: "700",
		color: "#111827",
		marginBottom: 16,
	},
	advantageContainer: {
		marginTop: 16,
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
		backgroundColor: "#F3E5F5",
		borderRadius: 8,
	},
	advantageText: {
		marginLeft: 8,
		fontSize: 14,
		color: "#6A1B9A",
		flex: 1,
	},
	featuresContainer: {
		marginTop: 16,
	},
	featuresSubtitle: {
		fontSize: 16,
		fontWeight: "500",
		color: "#4B5563",
		marginBottom: 12,
	},
	featureRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	featureText: {
		marginLeft: 8,
		fontSize: 14,
		color: "#4B5563",
	},
	freeTrialButton: {
		marginTop: 10,
		marginBottom: 16,
		backgroundColor: "#4A90E2",
		borderRadius: 10,
		paddingVertical: 14,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	freeTrialButtonText: {
		color: "white",
		fontWeight: "600",
		marginLeft: 8,
		fontSize: 16,
	},
	purchaseButton: {
		marginBottom: 16,
		backgroundColor: "#0A2268",
		borderRadius: 10,
		paddingVertical: 14,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	purchaseButtonText: {
		color: "white",
		fontWeight: "600",
		marginLeft: 8,
		fontSize: 16,
	},
	infoContainer: {
		marginBottom: 30,
		padding: 16,
		backgroundColor: "#F9FAFB",
		borderRadius: 8,
		borderLeftWidth: 4,
		borderLeftColor: "#9CA3AF",
	},
	infoText: {
		fontSize: 12,
		color: "#6B7280",
		lineHeight: 18,
	},
});

export default PremiumScreen;
