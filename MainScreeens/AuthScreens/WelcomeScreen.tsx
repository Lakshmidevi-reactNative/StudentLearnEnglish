import React from "react";
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
	SafeAreaView,
	StatusBar,
	Dimensions,
} from "react-native";
import { useTheme } from "../constants/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import getAuthColors from "./AuthColors";

const { width, height } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }) => {
	const { theme, colors } = useTheme();
	const isDarkMode = theme === "dark";
	const authColors = getAuthColors(isDarkMode);

	// Handle navigation to Login
	const handleLogin = () => {
		navigation.navigate("Login");
	};

	// Handle navigation to Signup (direct to signup, not onboarding)
	const handleSignup = () => {
		navigation.navigate("Signup");
	};

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

				<View style={styles.contentContainer}>
					<Image
						source={require("../../assets/icon.png")}
						style={styles.logo}
						resizeMode="contain"
					/>

					<View style={styles.titleContainer}>
						<Text style={[styles.title, { color: authColors.titleText }]}>
							Welcome to
							<Text style={{ color: authColors.brandPrimary }}> Learn</Text>
							<Text style={{ color: authColors.brandSecondary }}>Eng</Text>
						</Text>

						<Text
							style={[styles.subtitle, { color: authColors.secondaryText }]}
						>
							Your personal English language tutor
						</Text>
					</View>

					<View style={styles.featureContainer}>
						<FeatureItem
							title="Learn at your own pace"
							color={authColors.secondaryText}
						/>
						<FeatureItem
							title="Practice with native speakers"
							color={authColors.secondaryText}
						/>
						<FeatureItem
							title="Track your progress"
							color={authColors.secondaryText}
						/>
					</View>

					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={[
								styles.button,
								{ backgroundColor: authColors.primaryButton },
							]}
							onPress={handleSignup}
						>
							<Text style={styles.buttonText}>Create Account</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								styles.outlineButton,
								{ borderColor: authColors.outlineButtonBorder },
							]}
							onPress={handleLogin}
						>
							<Text
								style={[
									styles.outlineButtonText,
									{ color: authColors.accentText },
								]}
							>
								Sign In
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</LinearGradient>
		</SafeAreaView>
	);
};

// Feature item component
const FeatureItem = ({ title, color }) => (
	<View style={styles.featureItem}>
		<View style={styles.bulletPoint} />
		<Text style={[styles.featureText, { color }]}>{title}</Text>
	</View>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
	},
	logo: {
		width: width * 0.6,
		height: width * 0.3,
		marginBottom: 40,
	},
	titleContainer: {
		alignItems: "center",
		marginBottom: 30,
	},
	title: {
		fontSize: 32,
		fontWeight: "700",
		textAlign: "center",
		marginBottom: 16,
	},
	subtitle: {
		fontSize: 18,
		textAlign: "center",
	},
	featureContainer: {
		width: "100%",
		marginBottom: 40,
		paddingHorizontal: 20,
	},
	featureItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	bulletPoint: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#4A90E2",
		marginRight: 10,
	},
	featureText: {
		fontSize: 16,
	},
	buttonContainer: {
		width: "100%",
		marginTop: 16,
	},
	button: {
		height: 54,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "600",
	},
	outlineButton: {
		height: 54,
		borderRadius: 12,
		borderWidth: 2,
		justifyContent: "center",
		alignItems: "center",
	},
	outlineButtonText: {
		fontSize: 18,
		fontWeight: "600",
	},
});

export default WelcomeScreen;
