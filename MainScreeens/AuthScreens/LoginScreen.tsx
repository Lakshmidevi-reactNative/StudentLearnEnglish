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
	StatusBar,
	ScrollView,
} from "react-native";
import { useTheme } from "../constants/ThemeContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import getAuthColors from "./AuthColors";

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [isModalVisible, setModalVisible] = useState(false);
	const [resetEmail, setResetEmail] = useState("");
	const [resetEmailError, setResetEmailError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	// Get theme and colors
	const { theme, colors } = useTheme();
	const isDarkMode = theme === "dark";
	const authColors = getAuthColors(isDarkMode);

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

	const handleSignIn = () => {
		const emailValidationError = validateEmail(email);
		const passwordValidationError = validatePassword(password);

		setEmailError(emailValidationError);
		setPasswordError(passwordValidationError);

		if (!emailValidationError && !passwordValidationError) {
			// Add your sign in logic here
			navigation.replace("Main");
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
		<SafeAreaView style={{ flex: 1 }}>
			<LinearGradient
				colors={[authColors.gradientStart, authColors.gradientEnd]}
				style={styles.container}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
			>
				<StatusBar
					barStyle={isDarkMode ? "light-content" : "dark-content"}
					backgroundColor="transparent"
					translucent
				/>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.keyboardView}
				>
					<ScrollView
						contentContainerStyle={styles.scrollContent}
						showsVerticalScrollIndicator={false}
					>
						<View
							style={[
								styles.card,
								{ backgroundColor: authColors.cardBackground },
							]}
						>
							<View style={styles.logoContainer}>
								<Image
									source={require("../../assets/icon.png")}
									style={styles.logo}
									resizeMode="contain"
								/>
							</View>

							<View style={styles.formContainer}>
								<Text
									style={[styles.welcomeText, { color: authColors.titleText }]}
								>
									Welcome Back
								</Text>
								<Text
									style={[styles.subtitle, { color: authColors.secondaryText }]}
								>
									Sign in to continue your language journey
								</Text>

								<View style={styles.inputContainer}>
									<Text
										style={[styles.label, { color: authColors.secondaryText }]}
									>
										EMAIL ADDRESS
									</Text>
									<View
										style={[
											styles.inputWrapper,
											{
												borderColor: emailError
													? authColors.error
													: authColors.inputBorder,
												backgroundColor: authColors.inputBackground,
											},
										]}
									>
										<Ionicons
											name="mail-outline"
											size={18}
											color={authColors.icon}
											style={styles.inputIcon}
										/>
										<TextInput
											style={[styles.input, { color: authColors.primaryText }]}
											placeholder="Enter your email"
											placeholderTextColor={authColors.placeholder}
											value={email}
											onChangeText={handleEmailChange}
											keyboardType="email-address"
											autoCapitalize="none"
										/>
									</View>
									{emailError ? (
										<Text
											style={[styles.errorText, { color: authColors.error }]}
										>
											{emailError}
										</Text>
									) : null}
								</View>

								<View style={styles.inputContainer}>
									<Text
										style={[styles.label, { color: authColors.secondaryText }]}
									>
										PASSWORD
									</Text>
									<View
										style={[
											styles.inputWrapper,
											{
												borderColor: passwordError
													? authColors.error
													: authColors.inputBorder,
												backgroundColor: authColors.inputBackground,
											},
										]}
									>
										<Ionicons
											name="lock-closed-outline"
											size={18}
											color={authColors.icon}
											style={styles.inputIcon}
										/>
										<TextInput
											style={[styles.input, { color: authColors.primaryText }]}
											placeholder="Enter your password"
											placeholderTextColor={authColors.placeholder}
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
												size={20}
												color={authColors.icon}
											/>
										</TouchableOpacity>
									</View>
									{passwordError ? (
										<Text
											style={[styles.errorText, { color: authColors.error }]}
										>
											{passwordError}
										</Text>
									) : null}
								</View>

								<TouchableOpacity
									onPress={() => setModalVisible(true)}
									style={styles.forgotPassword}
								>
									<Text
										style={[
											styles.forgotPasswordText,
											{ color: authColors.accentText },
										]}
									>
										Forgot password?
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										styles.signInButton,
										{ backgroundColor: authColors.primaryButton },
									]}
									onPress={handleSignIn}
								>
									<Text style={styles.signInButtonText}>Sign In</Text>
								</TouchableOpacity>

								<View style={styles.divider}>
									<View
										style={[
											styles.dividerLine,
											{ backgroundColor: authColors.divider },
										]}
									/>
									<Text
										style={[
											styles.dividerText,
											{ color: authColors.secondaryText },
										]}
									>
										or
									</Text>
									<View
										style={[
											styles.dividerLine,
											{ backgroundColor: authColors.divider },
										]}
									/>
								</View>

								<TouchableOpacity
									style={[
										styles.googleButton,
										{
											backgroundColor: authColors.cardBackground,
											borderColor: authColors.divider,
										},
									]}
									onPress={handleGoogleSignIn}
								>
									<MaterialIcons
										name="mail"
										size={20}
										color={authColors.primaryText}
										style={{ marginRight: 8 }}
									/>
									<Text
										style={[
											styles.googleButtonText,
											{ color: authColors.primaryText },
										]}
									>
										Sign in with Google
									</Text>
								</TouchableOpacity>

								<View style={styles.signupContainer}>
									<Text
										style={[
											styles.signupText,
											{ color: authColors.secondaryText },
										]}
									>
										Don't have an account?{" "}
									</Text>
									<TouchableOpacity
										onPress={() => navigation.navigate("Signup")}
									>
										<Text
											style={[
												styles.signupLink,
												{ color: authColors.accentText },
											]}
										>
											Sign up
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</ScrollView>

					{/* Reset Password Modal */}
					<Modal visible={isModalVisible} transparent animationType="slide">
						<View style={styles.modalContainer}>
							<View
								style={[
									styles.modalContent,
									{ backgroundColor: authColors.cardBackground },
								]}
							>
								<View style={styles.modalHeader}>
									<Text
										style={[styles.modalTitle, { color: authColors.titleText }]}
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
											color={authColors.primaryText}
										/>
									</TouchableOpacity>
								</View>

								<Text
									style={[
										styles.modalSubtitle,
										{ color: authColors.secondaryText },
									]}
								>
									Enter your email address and we'll send you a link to reset
									your password.
								</Text>

								<View
									style={[
										styles.inputWrapper,
										{
											borderColor: resetEmailError
												? authColors.error
												: authColors.inputBorder,
											backgroundColor: authColors.inputBackground,
											marginVertical: 16,
										},
									]}
								>
									<Ionicons
										name="mail-outline"
										size={18}
										color={authColors.icon}
										style={styles.inputIcon}
									/>
									<TextInput
										style={[styles.input, { color: authColors.primaryText }]}
										placeholder="Enter your email"
										placeholderTextColor={authColors.placeholder}
										value={resetEmail}
										onChangeText={(text) => {
											setResetEmail(text);
											setResetEmailError(validateEmail(text));
										}}
										keyboardType="email-address"
										autoCapitalize="none"
									/>
								</View>
								{resetEmailError ? (
									<Text style={[styles.errorText, { color: authColors.error }]}>
										{resetEmailError}
									</Text>
								) : null}

								<TouchableOpacity
									style={[
										styles.resetButton,
										{ backgroundColor: authColors.primaryButton },
									]}
									onPress={handleResetPassword}
								>
									<Text style={styles.resetButtonText}>Send Reset Link</Text>
								</TouchableOpacity>
							</View>
						</View>
					</Modal>
				</KeyboardAvoidingView>
			</LinearGradient>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	keyboardView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: "center",
		padding: 20,
	},
	card: {
		borderRadius: 16,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
	},
	logoContainer: {
		alignItems: "center",
		padding: 20,
		paddingTop: 40,
	},
	logo: {
		width: 200,
		height: 80,
	},
	formContainer: {
		padding: 24,
	},
	welcomeText: {
		fontSize: 28,
		fontWeight: "700",
		marginBottom: 8,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 14,
		marginBottom: 32,
		textAlign: "center",
	},
	inputContainer: {
		marginBottom: 20,
	},
	label: {
		fontSize: 12,
		fontWeight: "600",
		marginBottom: 8,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1.5,
		borderRadius: 12,
		height: 50,
	},
	inputIcon: {
		marginLeft: 12,
	},
	input: {
		flex: 1,
		paddingHorizontal: 12,
		fontSize: 14,
		height: 50,
	},
	eyeIcon: {
		padding: 12,
	},
	errorText: {
		fontSize: 12,
		marginTop: 4,
	},
	forgotPassword: {
		alignItems: "flex-end",
		marginBottom: 24,
	},
	forgotPasswordText: {
		fontSize: 14,
		fontWeight: "500",
	},
	signInButton: {
		height: 50,
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
	signInButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
	},
	divider: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 24,
	},
	dividerLine: {
		flex: 1,
		height: 1,
	},
	dividerText: {
		marginHorizontal: 16,
		fontSize: 14,
	},
	googleButton: {
		height: 50,
		borderRadius: 12,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
	},
	googleButtonText: {
		fontSize: 16,
		fontWeight: "500",
	},
	signupContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 32,
		marginBottom: 16,
	},
	signupText: {
		fontSize: 14,
	},
	signupLink: {
		fontSize: 14,
		fontWeight: "600",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		padding: 20,
	},
	modalContent: {
		borderRadius: 16,
		padding: 24,
		width: "100%",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
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
	},
	closeButton: {
		padding: 4,
	},
	modalSubtitle: {
		fontSize: 14,
		marginBottom: 16,
	},
	resetButton: {
		height: 50,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 16,
	},
	resetButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
	},
});

export default LoginScreen;
