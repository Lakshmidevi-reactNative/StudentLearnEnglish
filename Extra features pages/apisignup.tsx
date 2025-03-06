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
	Alert,
} from "react-native";
import { useTheme } from "../../App";

const SignupScreen = ({ navigation }) => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const { isDarkMode } = useTheme();

	const validateForm = () => {
		if (!formData.firstName.trim()) {
			Alert.alert("Error", "Please enter your first name");
			return false;
		}
		if (!formData.lastName.trim()) {
			Alert.alert("Error", "Please enter your last name");
			return false;
		}
		if (!formData.email.trim()) {
			Alert.alert("Error", "Please enter your email");
			return false;
		}
		if (!/\S+@\S+\.\S+/.test(formData.email)) {
			Alert.alert("Error", "Please enter a valid email address");
			return false;
		}
		if (!formData.password) {
			Alert.alert("Error", "Please enter a password");
			return false;
		}
		if (formData.password.length < 6) {
			Alert.alert("Error", "Password must be at least 6 characters long");
			return false;
		}
		if (formData.password !== formData.confirmPassword) {
			Alert.alert("Error", "Passwords do not match");
			return false;
		}
		return true;
	};

	const postToApi = async (userData) => {
		try {
			setIsLoading(true);

			// Replace with your actual API endpoint
			const response = await fetch("https://your-api-endpoint.com/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(userData),
			});

			const responseData = await response.json();

			if (!response.ok) {
				throw new Error(responseData.message || "Something went wrong");
			}

			return responseData;
		} catch (error) {
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignUp = async () => {
		if (validateForm()) {
			try {
				// Prepare the data for API submission by removing confirmPassword
				const userData = {
					firstName: formData.firstName,
					lastName: formData.lastName,
					email: formData.email,
					password: formData.password,
					// Add any additional fields required by your API
				};

				// Post the data to the API
				const response = await postToApi(userData);

				// Show success message
				Alert.alert("Success", "Account created successfully!", [
					{
						text: "OK",
						onPress: () => navigation.replace("OnboardingScreen"),
					},
				]);
			} catch (error) {
				// Show error message
				Alert.alert(
					"Error",
					error.message || "Failed to create account. Please try again later."
				);
			}
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
				<ScrollView>
					<View style={[styles.card, isDarkMode && styles.cardDark]}>
						<View style={styles.logoContainer}>
							<Image
								source={require("../../assets/logo.png")}
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
								Please sign up to continue
							</Text>

							<View style={styles.row}>
								<View style={styles.halfColumn}>
									<Text style={[styles.label, isDarkMode && styles.labelDark]}>
										FIRST NAME
									</Text>
									<TextInput
										style={[styles.input, isDarkMode && styles.inputDark]}
										placeholder="Enter first name"
										placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
										value={formData.firstName}
										onChangeText={(text) =>
											setFormData({ ...formData, firstName: text })
										}
									/>
								</View>

								<View style={styles.halfColumn}>
									<Text style={[styles.label, isDarkMode && styles.labelDark]}>
										LAST NAME
									</Text>
									<TextInput
										style={[styles.input, isDarkMode && styles.inputDark]}
										placeholder="Enter last name"
										placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
										value={formData.lastName}
										onChangeText={(text) =>
											setFormData({ ...formData, lastName: text })
										}
									/>
								</View>
							</View>

							<View style={styles.inputContainer}>
								<Text style={[styles.label, isDarkMode && styles.labelDark]}>
									EMAIL ADDRESS
								</Text>
								<TextInput
									style={[styles.input, isDarkMode && styles.inputDark]}
									placeholder="Enter your email"
									placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
									value={formData.email}
									onChangeText={(text) =>
										setFormData({ ...formData, email: text })
									}
									keyboardType="email-address"
									autoCapitalize="none"
								/>
							</View>

							<View style={styles.row}>
								<View style={styles.halfColumn}>
									<Text style={[styles.label, isDarkMode && styles.labelDark]}>
										PASSWORD
									</Text>
									<TextInput
										style={[styles.input, isDarkMode && styles.inputDark]}
										placeholder="Enter password"
										placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
										value={formData.password}
										onChangeText={(text) =>
											setFormData({ ...formData, password: text })
										}
										secureTextEntry
									/>
								</View>

								<View style={styles.halfColumn}>
									<Text style={[styles.label, isDarkMode && styles.labelDark]}>
										CONFIRM PASSWORD
									</Text>
									<TextInput
										style={[styles.input, isDarkMode && styles.inputDark]}
										placeholder="Re-enter password"
										placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
										value={formData.confirmPassword}
										onChangeText={(text) =>
											setFormData({ ...formData, confirmPassword: text })
										}
										secureTextEntry
									/>
								</View>
							</View>

							<TouchableOpacity
								style={[
									styles.signUpButton,
									isLoading && styles.signUpButtonDisabled,
								]}
								onPress={handleSignUp}
								disabled={isLoading}
							>
								<Text style={styles.signUpButtonText}>
									{isLoading ? "Creating Account..." : "Sign Up"}
								</Text>
							</TouchableOpacity>

							<View style={styles.signinContainer}>
								<Text
									style={[styles.signinText, isDarkMode && styles.textDark]}
								>
									Already have an account?{" "}
								</Text>
								<TouchableOpacity onPress={() => navigation.navigate("Login")}>
									<Text style={styles.signinLink}>Sign in</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</ScrollView>
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
		paddingTop: 80,
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
	row: {
		flexDirection: "row",
		marginBottom: 16,
		gap: 12,
	},
	halfColumn: {
		flex: 1,
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
	signUpButton: {
		height: 44,
		backgroundColor: "#063181",
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 8,
	},
	signUpButtonDisabled: {
		backgroundColor: "#9CA3AF",
	},
	signUpButtonText: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "600",
	},
	signinContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 24,
	},
	signinText: {
		fontSize: 14,
		color: "#6B7280",
	},
	signinLink: {
		fontSize: 14,
		color: "#063181",
		fontWeight: "600",
	},
	textDark: {
		color: "#FFFFFF",
	},
});

export default SignupScreen;
