import React, { useState, useRef, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	Image,
	Modal,
	StatusBar,
	Animated,
	Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { toast } from "sonner-native";
import * as Haptics from "expo-haptics";
import { useAuth } from "./AuthContext.tsx"; // Import useAuth hook

// Define your colors
const COLORS = {
	background: "#1B1A3B",
	cardBg: "#2A2950",
	primary: "#6C63FF",
	secondary: "#FF6584",
	accent: "#42E8E0",
	textPrimary: "#FFFFFF",
	textSecondary: "#B0B0B0",
	inputBg: "rgba(255, 255, 255, 0.08)",
	border: "#5A5894",
	error: "#FF5A5A",
	success: "#4CAF50",
};

const { width, height } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
	const { login, isLoading: authLoading } = useAuth(); // Use the auth hook

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [focusedInput, setFocusedInput] = useState(null);

	// Reset password modal state
	const [isModalVisible, setModalVisible] = useState(false);
	const [resetEmail, setResetEmail] = useState("");
	const [resetEmailError, setResetEmailError] = useState("");

	// Terms and Privacy policy modals
	const [termsModalVisible, setTermsModalVisible] = useState(false);
	const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

	// Animation values
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(30)).current;
	const buttonScale = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 600,
				useNativeDriver: true,
			}),
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 600,
				useNativeDriver: true,
			}),
		]).start();
	}, []);

	const validateEmail = (email) => {
		if (!email.trim()) {
			return "Please enter your email";
		}
		if (!/\S+@\S+\.\S+/.test(email)) {
			return "Please enter a valid email address";
		}
		return "";
	};

	const validatePassword = (password) => {
		if (!password) {
			return "Please enter your password";
		}
		return "";
	};

	const handleEmailChange = (text) => {
		setEmail(text);
		setEmailError(validateEmail(text));
	};

	const handlePasswordChange = (text) => {
		setPassword(text);
		setPasswordError(validatePassword(text));
	};

	const handleLogin = async () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

		const emailValidationError = validateEmail(email);
		const passwordValidationError = validatePassword(password);

		setEmailError(emailValidationError);
		setPasswordError(passwordValidationError);

		if (!emailValidationError && !passwordValidationError) {
			setIsLoading(true);

			try {
				// Use the login function from AuthContext
				const result = await login(email, password);

				setIsLoading(false);

				if (result.success) {
					toast.success("Login successful!");
					// No need to navigate - App.js will handle it based on auth state
				} else {
					// Show error message from auth context
					toast.error(result.message || "Login failed");
					setPasswordError("Invalid credentials");
				}
			} catch (error) {
				setIsLoading(false);
				toast.error("An error occurred. Please try again.");
				console.error("Login error:", error);
			}
		}
	};

	const handleForgotPassword = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setModalVisible(true);
	};

	const handleResetPassword = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

		const resetEmailValidationError = validateEmail(resetEmail);
		setResetEmailError(resetEmailValidationError);

		if (!resetEmailValidationError) {
			setModalVisible(false);
			toast.info("Password reset link sent! Check your email.");
			setResetEmail("");
			setResetEmailError("");
		}
	};

	const handleGoogleLogin = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		toast.info("Google login coming soon!");
	};

	const onPressIn = () => {
		Animated.spring(buttonScale, {
			toValue: 0.97,
			useNativeDriver: true,
		}).start();
	};

	const onPressOut = () => {
		Animated.spring(buttonScale, {
			toValue: 1,
			friction: 4,
			tension: 40,
			useNativeDriver: true,
		}).start();
	};

	return (
		<View style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

			<SafeAreaView style={styles.safeArea}>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.keyboardView}
				>
					<ScrollView
						contentContainerStyle={styles.scrollContent}
						showsVerticalScrollIndicator={false}
					>
						<Animated.View
							style={[
								styles.header,
								{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
							]}
						>
							<View style={styles.logoContainer}>
								<Image
									source={require("../../assets/logo.png")}
									style={styles.logo}
									resizeMode="cover"
								/>
							</View>
							<Text style={styles.title}>Welcome Back</Text>
							<Text style={styles.subtitle}>
								Sign in to continue your learning journey
							</Text>
						</Animated.View>

						<Animated.View
							style={[
								styles.formContainer,
								{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
							]}
						>
							<View
								style={[
									styles.inputContainer,
									focusedInput === "email" && styles.inputContainerFocused,
								]}
							>
								<MaterialCommunityIcons
									name="email-outline"
									size={22}
									color={
										focusedInput === "email"
											? "#FFFFFF"
											: "rgba(255, 255, 255, 0.6)"
									}
									style={styles.inputIcon}
								/>
								<TextInput
									style={styles.input}
									placeholder="Email"
									placeholderTextColor={COLORS.textSecondary}
									value={email}
									onChangeText={handleEmailChange}
									keyboardType="email-address"
									autoCapitalize="none"
									onFocus={() => setFocusedInput("email")}
									onBlur={() => setFocusedInput(null)}
								/>
							</View>
							{emailError ? (
								<Text style={styles.errorText}>{emailError}</Text>
							) : null}

							<View
								style={[
									styles.inputContainer,
									focusedInput === "password" && styles.inputContainerFocused,
								]}
							>
								<MaterialCommunityIcons
									name="lock-outline"
									size={22}
									color={
										focusedInput === "password"
											? "#FFFFFF"
											: "rgba(255, 255, 255, 0.6)"
									}
									style={styles.inputIcon}
								/>
								<TextInput
									style={styles.input}
									placeholder="Password"
									placeholderTextColor={COLORS.textSecondary}
									value={password}
									onChangeText={handlePasswordChange}
									secureTextEntry={!showPassword}
									onFocus={() => setFocusedInput("password")}
									onBlur={() => setFocusedInput(null)}
								/>
								<TouchableOpacity
									onPress={() => setShowPassword(!showPassword)}
									style={styles.eyeIcon}
								>
									<MaterialCommunityIcons
										name={showPassword ? "eye-off" : "eye"}
										size={22}
										color="rgba(255, 255, 255, 0.6)"
									/>
								</TouchableOpacity>
							</View>
							{passwordError ? (
								<Text style={styles.errorText}>{passwordError}</Text>
							) : null}

							<TouchableOpacity
								style={styles.forgotPassword}
								onPress={handleForgotPassword}
							>
								<Text style={styles.forgotPasswordText}>Forgot Password?</Text>
							</TouchableOpacity>

							<Animated.View style={{ transform: [{ scale: buttonScale }] }}>
								<TouchableOpacity
									style={[
										styles.loginButton,
										(isLoading || authLoading) && styles.loginButtonDisabled,
									]}
									onPress={handleLogin}
									disabled={isLoading || authLoading}
									onPressIn={onPressIn}
									onPressOut={onPressOut}
								>
									{isLoading || authLoading ? (
										<MaterialCommunityIcons
											name="loading"
											size={24}
											color={COLORS.textPrimary}
										/>
									) : (
										<Text style={styles.loginButtonText}>Sign In</Text>
									)}
								</TouchableOpacity>
							</Animated.View>

							<Text style={styles.termsText}>
								By signing in, you agree to our{" "}
								<Text
									style={styles.termsLink}
									onPress={() => {
										Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
										setTermsModalVisible(true);
									}}
								>
									Terms of Service
								</Text>{" "}
								and{" "}
								<Text
									style={styles.termsLink}
									onPress={() => {
										Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
										setPrivacyModalVisible(true);
									}}
								>
									Privacy Policy
								</Text>
							</Text>

							<View style={styles.dividerContainer}>
								<View style={styles.divider} />
								<Text style={styles.dividerText}>OR</Text>
								<View style={styles.divider} />
							</View>

							<TouchableOpacity
								style={styles.googleButton}
								onPress={handleGoogleLogin}
							>
								<FontAwesome5 name="google" size={18} color="#DB4437" />
								<Text style={styles.googleButtonText}>
									Continue with Google
								</Text>
							</TouchableOpacity>
						</Animated.View>

						<Animated.View
							style={[
								styles.footer,
								{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
							]}
						>
							<Text style={styles.footerText}>Don't have an account?</Text>
							<TouchableOpacity
								onPress={() => {
									Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
									navigation.navigate("Signup");
								}}
							>
								<Text style={styles.signupText}> Sign Up</Text>
							</TouchableOpacity>
						</Animated.View>
					</ScrollView>
				</KeyboardAvoidingView>

				{/* Reset Password Modal */}
				<Modal visible={isModalVisible} transparent animationType="fade">
					<BlurView intensity={70} tint="dark" style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<View style={styles.modalHeader}>
								<Text style={styles.modalTitle}>Reset Password</Text>
								<TouchableOpacity
									onPress={() => {
										Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
										setModalVisible(false);
										setResetEmail("");
										setResetEmailError("");
									}}
									style={styles.closeButton}
								>
									<MaterialCommunityIcons
										name="close"
										size={24}
										color={COLORS.textPrimary}
									/>
								</TouchableOpacity>
							</View>

							<Text style={styles.modalSubtitle}>
								Enter your email address and we'll send you a link to reset your
								password.
							</Text>

							<View
								style={[
									styles.inputContainer,
									focusedInput === "resetEmail" && styles.inputContainerFocused,
								]}
							>
								<MaterialCommunityIcons
									name="email-outline"
									size={22}
									color={
										focusedInput === "resetEmail"
											? "#FFFFFF"
											: "rgba(255, 255, 255, 0.6)"
									}
									style={styles.inputIcon}
								/>
								<TextInput
									style={styles.input}
									placeholder="Email"
									placeholderTextColor={COLORS.textSecondary}
									value={resetEmail}
									onChangeText={(text) => {
										setResetEmail(text);
										setResetEmailError(validateEmail(text));
									}}
									keyboardType="email-address"
									autoCapitalize="none"
									onFocus={() => setFocusedInput("resetEmail")}
									onBlur={() => setFocusedInput(null)}
								/>
							</View>
							{resetEmailError ? (
								<Text style={styles.errorText}>{resetEmailError}</Text>
							) : null}

							<TouchableOpacity
								style={styles.resetButton}
								onPress={handleResetPassword}
							>
								<Text style={styles.resetButtonText}>Send Reset Link</Text>
							</TouchableOpacity>
						</View>
					</BlurView>
				</Modal>

				{/* Terms and Conditions Modal */}
				<Modal visible={termsModalVisible} transparent animationType="fade">
					<BlurView intensity={70} tint="dark" style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<View style={styles.modalHeader}>
								<Text style={styles.modalTitle}>Terms and Conditions</Text>
								<TouchableOpacity
									onPress={() => {
										Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
										setTermsModalVisible(false);
									}}
									style={styles.closeButton}
								>
									<MaterialCommunityIcons
										name="close"
										size={24}
										color={COLORS.textPrimary}
									/>
								</TouchableOpacity>
							</View>

							<ScrollView style={styles.modalScrollView}>
								<Text style={styles.modalSubtitle}>
									Last Updated: March 10, 2025
								</Text>

								<Text style={styles.modalSectionTitle}>
									1. Acceptance of Terms
								</Text>
								<Text style={styles.modalText}>
									By downloading or using the app, you agree to comply with
									these Terms and Conditions. If you do not agree, please do not
									use the app.
								</Text>

								<Text style={styles.modalSectionTitle}>2. User Accounts</Text>
								<Text style={styles.modalText}>
									• You may need to create an account to access some features.
									{"\n"}• You are responsible for maintaining the
									confidentiality of your login information.
								</Text>

								<Text style={styles.modalSectionTitle}>
									3. Usage Restrictions
								</Text>
								<Text style={styles.modalText}>
									• You agree not to misuse the app by attempting to gain
									unauthorized access to systems or data.{"\n"}• You must not
									use the app for any illegal or unauthorized purposes.
								</Text>

								<Text style={styles.modalSectionTitle}>
									4. Subscription and Payments
								</Text>
								<Text style={styles.modalText}>
									• Some features may require a subscription.{"\n"}• Payments
									are processed through app stores (Google Play Store or Apple
									App Store) following their policies.
								</Text>

								<Text style={styles.modalSectionTitle}>
									5. Content Ownership
								</Text>
								<Text style={styles.modalText}>
									• All content, including text, graphics, and software, is the
									property of the app owner.{"\n"}• You may not copy,
									distribute, or modify any part of the app without permission.
								</Text>

								<Text style={styles.modalSectionTitle}>6. Termination</Text>
								<Text style={styles.modalText}>
									• We reserve the right to suspend or terminate your access if
									you violate these terms.
								</Text>

								<Text style={styles.modalSectionTitle}>
									7. Limitation of Liability
								</Text>
								<Text style={styles.modalText}>
									• The app owner is not liable for any direct, indirect, or
									incidental damages arising from your use of the app.
								</Text>

								<Text style={styles.modalSectionTitle}>8. Governing Law</Text>
								<Text style={styles.modalText}>
									• These terms are governed by applicable laws.
								</Text>
							</ScrollView>

							<TouchableOpacity
								style={styles.modalButton}
								onPress={() => {
									Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
									setTermsModalVisible(false);
								}}
							>
								<Text style={styles.modalButtonText}>I Understand</Text>
							</TouchableOpacity>
						</View>
					</BlurView>
				</Modal>

				{/* Privacy Policy Modal */}
				<Modal visible={privacyModalVisible} transparent animationType="fade">
					<BlurView intensity={70} tint="dark" style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<View style={styles.modalHeader}>
								<Text style={styles.modalTitle}>Privacy Policy</Text>
								<TouchableOpacity
									onPress={() => {
										Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
										setPrivacyModalVisible(false);
									}}
									style={styles.closeButton}
								>
									<MaterialCommunityIcons
										name="close"
										size={24}
										color={COLORS.textPrimary}
									/>
								</TouchableOpacity>
							</View>

							<ScrollView style={styles.modalScrollView}>
								<Text style={styles.modalSubtitle}>
									Last Updated: March 10, 2025
								</Text>

								<Text style={styles.modalSectionTitle}>
									1. Information We Collect
								</Text>
								<Text style={styles.modalText}>
									• Personal Information: Name, email, and other account
									details.{"\n"}• Usage Data: Information about how you use the
									app.{"\n"}• Device Information: Device type, operating system,
									and IP address.
								</Text>

								<Text style={styles.modalSectionTitle}>
									2. How We Use Information
								</Text>
								<Text style={styles.modalText}>
									• To provide and improve the app's services.{"\n"}• To send
									notifications and updates.{"\n"}• To personalize the user
									experience.
								</Text>

								<Text style={styles.modalSectionTitle}>
									3. Sharing of Information
								</Text>
								<Text style={styles.modalText}>
									• We do not share your personal information with third parties
									except to comply with legal obligations or with your consent.
								</Text>

								<Text style={styles.modalSectionTitle}>
									4. Security of Information
								</Text>
								<Text style={styles.modalText}>
									• We use encryption and secure protocols to protect your data.
								</Text>

								<Text style={styles.modalSectionTitle}>5. Your Rights</Text>
								<Text style={styles.modalText}>
									• You can access, update, or delete your information by
									contacting us.
								</Text>

								<Text style={styles.modalSectionTitle}>
									6. Children's Privacy
								</Text>
								<Text style={styles.modalText}>
									• Our app is not intended for users under the age of 13
									without parental consent.
								</Text>

								<Text style={styles.modalSectionTitle}>
									7. Changes to This Policy
								</Text>
								<Text style={styles.modalText}>
									• We may update this Privacy Policy from time to time. We will
									notify you of any changes by posting the new policy on this
									page.
								</Text>

								<Text style={styles.modalSectionTitle}>8. Contact Us</Text>
								<Text style={styles.modalText}>
									• If you have any questions, please contact us at
									support@example.com.
								</Text>
							</ScrollView>

							<TouchableOpacity
								style={styles.modalButton}
								onPress={() => {
									Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
									setPrivacyModalVisible(false);
								}}
							>
								<Text style={styles.modalButtonText}>I Understand</Text>
							</TouchableOpacity>
						</View>
					</BlurView>
				</Modal>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	safeArea: {
		flex: 1,
	},
	keyboardView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingTop: Platform.OS === "ios" ? 40 : 60,
		paddingBottom: 30,
		justifyContent: "center",
	},
	header: {
		alignItems: "center",
		marginBottom: 40,
	},
	logoContainer: {
		width: 80,
		height: 80,
		borderRadius: 20,
		backgroundColor: COLORS.cardBg,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 24,
		shadowColor: COLORS.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 10,
		elevation: 5,
	},
	logo: {
		width: 60,
		height: 60,
		borderRadius: 15,
	},
	title: {
		fontSize: 28,
		fontWeight: "700",
		color: COLORS.textPrimary,
		marginBottom: 12,
	},
	subtitle: {
		fontSize: 16,
		color: COLORS.textSecondary,
		textAlign: "center",
	},
	formContainer: {
		backgroundColor: COLORS.cardBg,
		borderRadius: 16,
		padding: 24,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 5,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: COLORS.inputBg,
		borderRadius: 12,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.3)",
	},
	inputContainerFocused: {
		borderColor: "#FFFFFF",
	},
	inputIcon: {
		padding: 14,
	},
	input: {
		flex: 1,
		color: COLORS.textPrimary,
		fontSize: 16,
		paddingVertical: 14,
		backgroundColor: "transparent",
	},
	eyeIcon: {
		padding: 14,
	},
	errorText: {
		color: COLORS.error,
		fontSize: 13,
		marginTop: -8,
		marginBottom: 16,
		marginLeft: 5,
	},
	forgotPassword: {
		alignSelf: "flex-end",
		marginBottom: 24,
	},
	forgotPasswordText: {
		color: COLORS.primary,
		fontSize: 14,
		fontWeight: "500",
	},
	loginButton: {
		backgroundColor: COLORS.primary,
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
		shadowColor: COLORS.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
		elevation: 5,
	},
	loginButtonDisabled: {
		opacity: 0.7,
	},
	loginButtonText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "600",
		letterSpacing: 0.5,
	},
	termsText: {
		color: COLORS.textSecondary,
		fontSize: 12,
		textAlign: "center",
		lineHeight: 18,
		marginBottom: 20,
	},
	termsLink: {
		color: COLORS.primary,
		fontWeight: "600",
	},
	dividerContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 24,
	},
	divider: {
		flex: 1,
		height: 1,
		backgroundColor: COLORS.border,
	},
	dividerText: {
		color: COLORS.textSecondary,
		paddingHorizontal: 12,
		fontSize: 14,
	},
	googleButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(255, 255, 255, 0.08)",
		borderRadius: 12,
		paddingVertical: 14,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	googleButtonText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "500",
		marginLeft: 12,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 30,
	},
	footerText: {
		color: COLORS.textSecondary,
	},
	signupText: {
		color: COLORS.primary,
		fontWeight: "600",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
	},
	modalContent: {
		width: "100%",
		maxHeight: height * 0.7,
		borderRadius: 16,
		padding: 24,
		backgroundColor: COLORS.cardBg,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.3,
		shadowRadius: 20,
		elevation: 10,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: COLORS.textPrimary,
	},
	closeButton: {
		padding: 6,
	},
	modalScrollView: {
		maxHeight: height * 0.5,
		marginBottom: 20,
	},
	modalSubtitle: {
		fontSize: 14,
		color: COLORS.textSecondary,
		marginBottom: 24,
	},
	modalSectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: COLORS.textPrimary,
		marginBottom: 8,
		marginTop: 16,
	},
	modalText: {
		fontSize: 14,
		color: COLORS.textSecondary,
		marginBottom: 12,
		lineHeight: 20,
	},
	modalButton: {
		backgroundColor: COLORS.primary,
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
		justifyContent: "center",
	},
	modalButtonText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "600",
	},
	resetButton: {
		backgroundColor: COLORS.primary,
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
	},
	resetButtonText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "600",
	},
});
