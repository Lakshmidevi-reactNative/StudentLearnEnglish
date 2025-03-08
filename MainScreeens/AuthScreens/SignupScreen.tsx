import React, { useState } from "react";
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StatusBar,
} from "react-native";
import { useTheme } from "../constants/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import getAuthColors from "./AuthColors";

const SignupScreen = ({ navigation }) => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [formErrors, setFormErrors] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	// Get theme and colors
	const { theme, colors } = useTheme();
	const isDarkMode = theme === "dark";
	const authColors = getAuthColors(isDarkMode);

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const validateField = (field, value) => {
		switch (field) {
			case "firstName":
				return !value.trim() ? "First name is required" : "";
			case "lastName":
				return !value.trim() ? "Last name is required" : "";
			case "email":
				if (!value.trim()) return "Email is required";
				if (!/\S+@\S+\.\S+/.test(value)) return "Enter a valid email address";
				return "";
			case "password":
				if (!value) return "Password is required";
				if (value.length < 6) return "Password must be at least 6 characters";
				return "";
			case "confirmPassword":
				if (!value) return "Please confirm your password";
				if (value !== formData.password) return "Passwords don't match";
				return "";
			default:
				return "";
		}
	};

	const handleChange = (field, value) => {
		setFormData({
			...formData,
			[field]: value,
		});

		const error = validateField(field, value);
		setFormErrors({
			...formErrors,
			[field]: error,
		});

		// For confirming password, we need to revalidate when either password changes
		if (field === "password" && formData.confirmPassword) {
			const confirmError =
				formData.confirmPassword !== value ? "Passwords don't match" : "";
			setFormErrors({
				...formErrors,
				[field]: error,
				confirmPassword: confirmError,
			});
		}
	};

	const validateForm = () => {
		const newErrors = {
			firstName: validateField("firstName", formData.firstName),
			lastName: validateField("lastName", formData.lastName),
			email: validateField("email", formData.email),
			password: validateField("password", formData.password),
			confirmPassword: validateField(
				"confirmPassword",
				formData.confirmPassword
			),
		};

		setFormErrors(newErrors);

		return !Object.values(newErrors).some((error) => error !== "");
	};

	const handleSignUp = () => {
		if (validateForm()) {
			// Pass user's first name to onboarding screen
			navigation.navigate("Onboarding", {
				firstName: formData.firstName,
			});
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
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.scrollContent}
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
									Create Account
								</Text>
								<Text
									style={[styles.subtitle, { color: authColors.secondaryText }]}
								>
									Start your language learning journey today
								</Text>

								<View style={styles.row}>
									<View style={styles.halfColumn}>
										<Text
											style={[
												styles.label,
												{ color: authColors.secondaryText },
											]}
										>
											FIRST NAME
										</Text>
										<View
											style={[
												styles.inputWrapper,
												{
													borderColor: formErrors.firstName
														? authColors.error
														: authColors.inputBorder,
													backgroundColor: authColors.inputBackground,
												},
											]}
										>
											<Ionicons
												name="person-outline"
												size={18}
												color={authColors.icon}
												style={styles.inputIcon}
											/>
											<TextInput
												style={[
													styles.input,
													{ color: authColors.primaryText },
												]}
												placeholder="First name"
												placeholderTextColor={authColors.placeholder}
												value={formData.firstName}
												onChangeText={(text) => handleChange("firstName", text)}
											/>
										</View>
										{formErrors.firstName ? (
											<Text
												style={[styles.errorText, { color: authColors.error }]}
											>
												{formErrors.firstName}
											</Text>
										) : null}
									</View>

									<View style={styles.halfColumn}>
										<Text
											style={[
												styles.label,
												{ color: authColors.secondaryText },
											]}
										>
											LAST NAME
										</Text>
										<View
											style={[
												styles.inputWrapper,
												{
													borderColor: formErrors.lastName
														? authColors.error
														: authColors.inputBorder,
													backgroundColor: authColors.inputBackground,
												},
											]}
										>
											<Ionicons
												name="person-outline"
												size={18}
												color={authColors.icon}
												style={styles.inputIcon}
											/>
											<TextInput
												style={[
													styles.input,
													{ color: authColors.primaryText },
												]}
												placeholder="Last name"
												placeholderTextColor={authColors.placeholder}
												value={formData.lastName}
												onChangeText={(text) => handleChange("lastName", text)}
											/>
										</View>
										{formErrors.lastName ? (
											<Text
												style={[styles.errorText, { color: authColors.error }]}
											>
												{formErrors.lastName}
											</Text>
										) : null}
									</View>
								</View>

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
												borderColor: formErrors.email
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
											value={formData.email}
											onChangeText={(text) => handleChange("email", text)}
											keyboardType="email-address"
											autoCapitalize="none"
										/>
									</View>
									{formErrors.email ? (
										<Text
											style={[styles.errorText, { color: authColors.error }]}
										>
											{formErrors.email}
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
												borderColor: formErrors.password
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
											placeholder="Create password"
											placeholderTextColor={authColors.placeholder}
											value={formData.password}
											onChangeText={(text) => handleChange("password", text)}
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
									{formErrors.password ? (
										<Text
											style={[styles.errorText, { color: authColors.error }]}
										>
											{formErrors.password}
										</Text>
									) : null}
								</View>

								<View style={styles.inputContainer}>
									<Text
										style={[styles.label, { color: authColors.secondaryText }]}
									>
										CONFIRM PASSWORD
									</Text>
									<View
										style={[
											styles.inputWrapper,
											{
												borderColor: formErrors.confirmPassword
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
											placeholder="Confirm password"
											placeholderTextColor={authColors.placeholder}
											value={formData.confirmPassword}
											onChangeText={(text) =>
												handleChange("confirmPassword", text)
											}
											secureTextEntry={!showConfirmPassword}
										/>
										<TouchableOpacity
											style={styles.eyeIcon}
											onPress={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
										>
											<Ionicons
												name={
													showConfirmPassword
														? "eye-outline"
														: "eye-off-outline"
												}
												size={20}
												color={authColors.icon}
											/>
										</TouchableOpacity>
									</View>
									{formErrors.confirmPassword ? (
										<Text
											style={[styles.errorText, { color: authColors.error }]}
										>
											{formErrors.confirmPassword}
										</Text>
									) : null}
								</View>

								<TouchableOpacity
									style={[
										styles.signUpButton,
										{ backgroundColor: authColors.primaryButton },
									]}
									onPress={handleSignUp}
								>
									<Text style={styles.signUpButtonText}>Create Account</Text>
								</TouchableOpacity>

								<View style={styles.signinContainer}>
									<Text
										style={[
											styles.signinText,
											{ color: authColors.secondaryText },
										]}
									>
										Already have an account?{" "}
									</Text>
									<TouchableOpacity
										onPress={() => navigation.navigate("Login")}
									>
										<Text
											style={[
												styles.signinLink,
												{ color: authColors.accentText },
											]}
										>
											Sign in
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</ScrollView>
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
		padding: 20,
		paddingTop: 40,
		paddingBottom: 40,
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
	row: {
		flexDirection: "row",
		marginBottom: 10,
		gap: 12,
	},
	halfColumn: {
		flex: 1,
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
	signUpButton: {
		height: 50,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 8,
		marginBottom: 16,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	signUpButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
	},
	signinContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 24,
		marginBottom: 16,
	},
	signinText: {
		fontSize: 14,
	},
	signinLink: {
		fontSize: 14,
		fontWeight: "600",
	},
});

export default SignupScreen;
