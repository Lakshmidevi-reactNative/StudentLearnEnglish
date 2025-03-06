import React, { useState } from "react";
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	Modal,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { useTheme } from "../../App";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [isModalVisible, setModalVisible] = useState(false);
	const [resetEmail, setResetEmail] = useState("");
	const [resetEmailError, setResetEmailError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const { isDarkMode } = useTheme();

	const validateEmail = (email) => {
		if (!email.trim()) {
			return "Please enter your email";
		}
		if (!/\S+@\S+\.com$/.test(email)) {
			return "Please enter a valid email address ending with .com";
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

	const handleSignIn = () => {
		const emailValidationError = validateEmail(email);
		const passwordValidationError = validatePassword(password);

		setEmailError(emailValidationError);
		setPasswordError(passwordValidationError);

		if (!emailValidationError && !passwordValidationError) {
			// Add your sign in logic here
			navigation.replace("MainApp");
		}
	};

	const handleGoogleSignIn = () => {
		// Implement Google sign in logic here
		console.log("Google sign in");
	};

	const handleResetPassword = () => {
		const resetEmailValidationError = validateEmail(resetEmail);
		setResetEmailError(resetEmailValidationError);

		if (!resetEmailValidationError) {
			// Add your reset password logic here
			setModalVisible(false);
			setResetEmail("");
			setResetEmailError("");
		}
	};

	return (
		<SafeAreaView
			style={[styles.container, isDarkMode && styles.containerDark]}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardView}
			>
				<View style={[styles.card, isDarkMode && styles.cardDark]}>
					<View style={styles.logoContainer}>
						<Image
							source={require("../../assets/icon.png")}
							style={styles.logo}
							resizeMode="contain"
						/>
					</View>

					<View style={styles.formContainer}>
						<Text style={[styles.welcomeText, isDarkMode && styles.textDark]}>
							Welcome to <Text style={styles.brandLearn}>Learn</Text>
							<Text style={styles.brandEng}>Eng</Text>
						</Text>
						<Text style={[styles.subtitle, isDarkMode && styles.textDark]}>
							Please sign in to continue
						</Text>

						<View style={styles.inputContainer}>
							<Text style={[styles.label, isDarkMode && styles.labelDark]}>
								EMAIL ADDRESS
							</Text>
							<TextInput
								style={[
									styles.input,
									isDarkMode && styles.inputDark,
									emailError && styles.inputError,
								]}
								placeholder="Enter your email"
								placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
								value={email}
								onChangeText={handleEmailChange}
								keyboardType="email-address"
								autoCapitalize="none"
							/>
							{emailError ? (
								<Text style={styles.errorText}>{emailError}</Text>
							) : null}
						</View>

						<View style={styles.inputContainer}>
							<Text style={[styles.label, isDarkMode && styles.labelDark]}>
								PASSWORD
							</Text>
							<View
								style={[
									styles.passwordContainer,
									isDarkMode && styles.inputDark,
									passwordError && styles.inputError,
								]}
							>
								<TextInput
									style={[styles.passwordInput, isDarkMode && styles.inputDark]}
									placeholder="Enter your password"
									placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
									value={password}
									onChangeText={handlePasswordChange}
									secureTextEntry={!showPassword}
								/>
								<TouchableOpacity
									style={styles.eyeIcon}
									onPress={() => setShowPassword(!showPassword)}
								>
									<Ionicons
										name={showPassword ? "eye-outline" : "eye-off-outline"}
										size={24}
										color={isDarkMode ? "#6B7280" : "#4B5563"}
									/>
								</TouchableOpacity>
							</View>
							{passwordError ? (
								<Text style={styles.errorText}>{passwordError}</Text>
							) : null}
						</View>

						<TouchableOpacity
							style={styles.signInButton}
							onPress={handleSignIn}
						>
							<Text style={styles.signInButtonText}>Sign In</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => setModalVisible(true)}
							style={styles.forgotPassword}
						>
							<Text
								style={[
									styles.forgotPasswordText,
									isDarkMode && styles.textDark,
								]}
							>
								Forgot password?
							</Text>
						</TouchableOpacity>

						<View style={styles.divider}>
							<View
								style={[
									styles.dividerLine,
									isDarkMode && styles.dividerLineDark,
								]}
							/>
							<Text style={[styles.dividerText, isDarkMode && styles.textDark]}>
								or
							</Text>
							<View
								style={[
									styles.dividerLine,
									isDarkMode && styles.dividerLineDark,
								]}
							/>
						</View>

						<TouchableOpacity
							style={[
								styles.googleButton,
								isDarkMode && styles.googleButtonDark,
							]}
							onPress={handleGoogleSignIn}
						>
							<MaterialIcons
								name="mail"
								size={20}
								color={isDarkMode ? "#fff" : "#374151"}
								style={{ marginRight: 8 }}
							/>
							<Text
								style={[styles.googleButtonText, isDarkMode && styles.textDark]}
							>
								Sign in with Google
							</Text>
						</TouchableOpacity>

						<View style={styles.signupContainer}>
							<Text style={[styles.signupText, isDarkMode && styles.textDark]}>
								Don't have an account?{" "}
							</Text>
							<TouchableOpacity onPress={() => navigation.navigate("Signup")}>
								<Text style={styles.signupLink}>Sign up</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>

				{/* Reset Password Modal */}
				<Modal visible={isModalVisible} transparent animationType="slide">
					<View style={styles.modalContainer}>
						<View
							style={[
								styles.modalContent,
								isDarkMode && styles.modalContentDark,
							]}
						>
							<View style={styles.modalHeader}>
								<Text
									style={[styles.modalTitle, isDarkMode && styles.textDark]}
								>
									Reset Password
								</Text>
								<TouchableOpacity
									onPress={() => {
										setModalVisible(false);
										setResetEmail("");
										setResetEmailError("");
									}}
									style={styles.closeButton}
								>
									<Ionicons
										name="close"
										size={24}
										color={isDarkMode ? "#fff" : "#000"}
									/>
								</TouchableOpacity>
							</View>

							<Text
								style={[styles.modalSubtitle, isDarkMode && styles.textDark]}
							>
								Enter your email address and we'll send you a link to reset your
								password.
							</Text>

							<TextInput
								style={[
									styles.input,
									isDarkMode && styles.inputDark,
									resetEmailError && styles.inputError,
								]}
								placeholder="Enter your email"
								placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
								value={resetEmail}
								onChangeText={(text) => {
									setResetEmail(text);
									setResetEmailError(validateEmail(text));
								}}
								keyboardType="email-address"
								autoCapitalize="none"
							/>
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
					</View>
				</Modal>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8F9FF",
	},
	containerDark: {
		backgroundColor: "#1a1a1a",
	},
	keyboardView: {
		flex: 1,
	},
	card: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		paddingTop: 80,
		borderRadius: 16,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.05,
		shadowRadius: 24,
		elevation: 5,
	},
	cardDark: {
		backgroundColor: "#2a2a2a",
	},
	logoContainer: {
		alignItems: "center",
		padding: 20,
	},
	logo: {
		width: 280,
		height: 100,
	},
	formContainer: {
		padding: 20,
	},
	welcomeText: {
		fontSize: 28,
		fontWeight: "700",
		color: "#063181",
		marginBottom: 8,
		textAlign: "center",
	},
	brandLearn: {
		color: "#063181",
	},
	brandEng: {
		color: "#4A90E2",
	},
	subtitle: {
		color: "#6B7280",
		fontSize: 14,
		marginBottom: 24,
		textAlign: "center",
	},
	inputContainer: {
		marginBottom: 16,
	},
	label: {
		fontSize: 12,
		fontWeight: "600",
		color: "#4B5563",
		marginBottom: 6,
	},
	labelDark: {
		color: "#E5E7EB",
	},
	input: {
		height: 44,
		borderWidth: 1.5,
		borderColor: "#E5E7EB",
		borderRadius: 8,
		paddingHorizontal: 12,
		fontSize: 14,
		color: "#000",
	},
	inputDark: {
		borderColor: "#4B5563",
		color: "#fff",
		backgroundColor: "#3a3a3a",
	},
	inputError: {
		borderColor: "#DC2626",
		borderWidth: 1.5,
	},
	errorText: {
		color: "#DC2626",
		fontSize: 12,
		marginTop: 4,
	},
	passwordContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1.5,
		borderColor: "#E5E7EB",
		borderRadius: 8,
		backgroundColor: "#FFFFFF",
	},
	passwordInput: {
		flex: 1,
		height: 44,
		paddingHorizontal: 12,
		fontSize: 14,
		color: "#000",
		backgroundColor: "transparent",
	},
	eyeIcon: {
		padding: 10,
	},
	signInButton: {
		height: 44,
		backgroundColor: "#063181",
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 8,
	},
	signInButtonText: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "600",
	},
	forgotPassword: {
		marginVertical: 16,
		alignItems: "center",
	},
	forgotPasswordText: {
		fontSize: 14,
		color: "#6B7280",
	},
	divider: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 16,
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: "#E5E7EB",
	},
	dividerLineDark: {
		backgroundColor: "#4B5563",
	},
	dividerText: {
		marginHorizontal: 16,
		color: "#6B7280",
		fontSize: 14,
	},
	googleButton: {
		height: 44,
		backgroundColor: "#FFFFFF",
		borderRadius: 8,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#E5E7EB",
	},
	googleButtonDark: {
		backgroundColor: "#3a3a3a",
		borderColor: "#4B5563",
	},
	googleButtonText: {
		color: "#374151",
		fontSize: 14,
		fontWeight: "500",
	},
	signupContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 24,
	},
	signupText: {
		fontSize: 14,
		color: "#6B7280",
	},
	signupLink: {
		fontSize: 14,
		color: "#063181",
		fontWeight: "600",
	},
	textDark: {
		color: "#FFFFFF",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		padding: 20,
	},
	modalContent: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 20,
		width: "100%",
	},
	modalContentDark: {
		backgroundColor: "#2a2a2a",
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
		color: "#063181",
	},
	closeButton: {
		padding: 4,
	},
	modalSubtitle: {
		color: "#6B7280",
		fontSize: 14,
		marginBottom: 20,
	},
	resetButton: {
		height: 44,
		backgroundColor: "#063181",
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 16,
	},
	resetButtonText: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "600",
	},
});

export default LoginScreen;
