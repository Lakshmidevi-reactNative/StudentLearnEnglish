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
	StatusBar,
	Animated,
	Dimensions,
	Modal,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { BlurView } from "expo-blur";

// Define your colors
const COLORS = {
	background: "#121212",
	cardBg: "#1E1E1E",
	primary: "#6C63FF",
	secondary: "#FF6584",
	accent: "#42E8E0",
	textPrimary: "#FFFFFF",
	textSecondary: "#B0B0B0",
	inputBg: "#2D2D2D",
	border: "#444444",
	error: "#FF5A5A",
	success: "#4CAF50",
};

const { width, height } = Dimensions.get("window");

export default function SignupScreen({ navigation }) {
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
		otp: "",
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [focusedInput, setFocusedInput] = useState(null);

	// OTP related states
	const [otpSent, setOtpSent] = useState(false);
	const [otp, setOtp] = useState("");
	const [otpVerified, setOtpVerified] = useState(false);
	const [resendDisabled, setResendDisabled] = useState(false);
	const [resendTimer, setResendTimer] = useState(0);
	const [generatedOtp, setGeneratedOtp] = useState("");

	// Terms and Privacy policy modals
	const [termsModalVisible, setTermsModalVisible] = useState(false);
	const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

	// Animation values
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(30)).current;
	const buttonScale = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		// Animate content on mount
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

	// Timer for OTP resend
	useEffect(() => {
		let interval;
		if (resendTimer > 0) {
			interval = setInterval(() => {
				setResendTimer((prev) => prev - 1);
			}, 1000);
		} else {
			setResendDisabled(false);
		}

		return () => clearInterval(interval);
	}, [resendTimer]);

	const validateField = (field, value) => {
		switch (field) {
			case "firstName":
				return !value.trim() ? "First name is required" : "";
			case "lastName":
				return !value.trim() ? "Last name is required" : "";
			case "email":
				if (!value.trim()) return "Please enter your email";
				if (!/\S+@\S+\.\S+/.test(value))
					return "Please enter a valid email address";
				return "";
			case "password":
				if (!value) return "Please enter your password";
				if (value.length < 6) return "Password must be at least 6 characters";
				return "";
			case "confirmPassword":
				if (!value) return "Please confirm your password";
				if (value !== formData.password) return "Passwords don't match";
				return "";
			case "otp":
				if (!value) return "Please enter verification code";
				if (value.length !== 6) return "Verification code must be 6 digits";
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

	// Generate a random 6-digit OTP
	const generateOTP = () => {
		const randomOTP = Math.floor(100000 + Math.random() * 900000).toString();
		setGeneratedOtp(randomOTP);
		return randomOTP;
	};

	// Send OTP to user's email
	const sendOTP = () => {
		if (validateField("email", formData.email) === "") {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			setIsLoading(true);

			// Generate and store OTP
			const newOtp = generateOTP();

			// Simulate API call to send OTP
			setTimeout(() => {
				setIsLoading(false);
				setOtpSent(true);
				setResendDisabled(true);
				setResendTimer(60); // 60 seconds countdown
				toast.success(`Verification code sent to ${formData.email}`);

				// For demo purposes, show the OTP in a toast
				toast.info(`Your verification code is: ${newOtp}`);
			}, 1500);
		} else {
			setFormErrors({
				...formErrors,
				email: validateField("email", formData.email),
			});
		}
	};

	// Verify the entered OTP
	const verifyOTP = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

		const otpError = validateField("otp", otp);
		if (otpError) {
			setFormErrors({
				...formErrors,
				otp: otpError,
			});
			return;
		}

		setIsLoading(true);

		// Simulate API verification
		setTimeout(() => {
			// For demo purposes, any 6-digit code will be accepted
			// In production, compare with the generated OTP or verify via server
			if (otp.length === 6) {
				setOtpVerified(true);
				toast.success("Email verified successfully!");
			} else {
				setFormErrors({
					...formErrors,
					otp: "Invalid verification code",
				});
			}
			setIsLoading(false);
		}, 1000);
	};

	// Resend OTP
	const resendOTP = () => {
		if (!resendDisabled) {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

			// Generate a new OTP
			const newOtp = generateOTP();

			// Simulate sending
			toast.info("Sending new verification code...");

			setTimeout(() => {
				setResendDisabled(true);
				setResendTimer(60); // 60 seconds countdown
				toast.success(`New verification code sent to ${formData.email}`);

				// For demo purposes, show the OTP in a toast
				toast.info(`Your new verification code is: ${newOtp}`);
			}, 1000);
		}
	};

	const handleSignUp = async () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

		if (validateForm() && otpVerified) {
			setIsLoading(true);

			// Simulate API call
			setTimeout(() => {
				setIsLoading(false);
				// Navigate to Onboarding with firstName
				navigation.navigate("Onboarding", {
					firstName: formData.firstName,
				});
			}, 1500);
		} else if (!otpVerified) {
			toast.error("Please verify your email first");
		}
	};

	const handleGoogleSignup = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		toast.info("Google signup coming soon!");
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

			<Image
				source={require("../../assets/logo.png")}
				style={styles.backgroundPattern}
				resizeMode="cover"
			/>

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
							<TouchableOpacity
								style={styles.backButton}
								onPress={() => {
									Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
									navigation.goBack();
								}}
							>
								<MaterialCommunityIcons
									name="arrow-left"
									size={24}
									color={COLORS.textPrimary}
								/>
							</TouchableOpacity>

							<View style={styles.logoContainer}>
								<Image
									source={require("../../assets/logo.png")}
									style={styles.logo}
									resizeMode="cover"
								/>
							</View>
							<Text style={styles.title}>Create Account</Text>
							<Text style={styles.subtitle}>
								Start your learning journey today
							</Text>
						</Animated.View>

						<Animated.View
							style={[
								styles.formContainer,
								{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
							]}
						>
							<View style={styles.nameRow}>
								{/* First Name Input */}
								<View
									style={[
										styles.inputContainer,
										styles.halfInput,
										focusedInput === "firstName" &&
											styles.inputContainerFocused,
									]}
								>
									<MaterialCommunityIcons
										name="account-outline"
										size={22}
										color={
											focusedInput === "firstName"
												? COLORS.primary
												: COLORS.textSecondary
										}
										style={styles.inputIcon}
									/>
									<TextInput
										style={styles.input}
										placeholder="First Name"
										placeholderTextColor={COLORS.textSecondary}
										value={formData.firstName}
										onChangeText={(text) => handleChange("firstName", text)}
										onFocus={() => setFocusedInput("firstName")}
										onBlur={() => setFocusedInput(null)}
									/>
								</View>

								{/* Last Name Input */}
								<View
									style={[
										styles.inputContainer,
										styles.halfInput,
										focusedInput === "lastName" && styles.inputContainerFocused,
									]}
								>
									<MaterialCommunityIcons
										name="account-outline"
										size={22}
										color={
											focusedInput === "lastName"
												? COLORS.primary
												: COLORS.textSecondary
										}
										style={styles.inputIcon}
									/>
									<TextInput
										style={styles.input}
										placeholder="Last Name"
										placeholderTextColor={COLORS.textSecondary}
										value={formData.lastName}
										onChangeText={(text) => handleChange("lastName", text)}
										onFocus={() => setFocusedInput("lastName")}
										onBlur={() => setFocusedInput(null)}
									/>
								</View>
							</View>

							{/* Error messages for names */}
							<View style={styles.nameRow}>
								<View style={styles.halfInput}>
									{formErrors.firstName ? (
										<Text style={styles.errorText}>{formErrors.firstName}</Text>
									) : null}
								</View>
								<View style={styles.halfInput}>
									{formErrors.lastName ? (
										<Text style={styles.errorText}>{formErrors.lastName}</Text>
									) : null}
								</View>
							</View>

							{/* Email Input */}
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
											? COLORS.primary
											: COLORS.textSecondary
									}
									style={styles.inputIcon}
								/>
								<TextInput
									style={styles.input}
									placeholder="Email"
									placeholderTextColor={COLORS.textSecondary}
									value={formData.email}
									onChangeText={(text) => handleChange("email", text)}
									keyboardType="email-address"
									autoCapitalize="none"
									onFocus={() => setFocusedInput("email")}
									onBlur={() => setFocusedInput(null)}
									editable={!otpVerified}
								/>
								{!otpSent && !otpVerified && (
									<TouchableOpacity
										style={[
											styles.verifyButton,
											isLoading && styles.verifyButtonDisabled,
										]}
										onPress={sendOTP}
										disabled={isLoading}
									>
										<Text style={styles.verifyButtonText}>
											{isLoading ? "Sending..." : "Verify"}
										</Text>
									</TouchableOpacity>
								)}
								{otpVerified && (
									<MaterialCommunityIcons
										name="check-circle"
										size={22}
										color={COLORS.success}
										style={styles.verifiedIcon}
									/>
								)}
							</View>
							{formErrors.email ? (
								<Text style={styles.errorText}>{formErrors.email}</Text>
							) : null}

							{/* OTP Input - Only show when OTP has been sent but not verified */}
							{otpSent && !otpVerified && (
								<>
									<View
										style={[
											styles.inputContainer,
											focusedInput === "otp" && styles.inputContainerFocused,
										]}
									>
										<MaterialCommunityIcons
											name="shield-key-outline"
											size={22}
											color={
												focusedInput === "otp"
													? COLORS.primary
													: COLORS.textSecondary
											}
											style={styles.inputIcon}
										/>
										<TextInput
											style={styles.input}
											placeholder="Enter 6-digit verification code"
											placeholderTextColor={COLORS.textSecondary}
											value={otp}
											onChangeText={(text) => {
												// Only allow digits and max 6 characters
												const filtered = text
													.replace(/[^0-9]/g, "")
													.slice(0, 6);
												setOtp(filtered);
												if (formErrors.otp) {
													setFormErrors({
														...formErrors,
														otp: validateField("otp", filtered),
													});
												}
											}}
											keyboardType="number-pad"
											onFocus={() => setFocusedInput("otp")}
											onBlur={() => setFocusedInput(null)}
										/>
										<TouchableOpacity
											style={[
												styles.verifyButton,
												isLoading && styles.verifyButtonDisabled,
											]}
											onPress={verifyOTP}
											disabled={isLoading}
										>
											<Text style={styles.verifyButtonText}>
												{isLoading ? "Verifying..." : "Confirm"}
											</Text>
										</TouchableOpacity>
									</View>
									{formErrors.otp ? (
										<Text style={styles.errorText}>{formErrors.otp}</Text>
									) : null}

									<View style={styles.resendContainer}>
										<Text style={styles.resendText}>
											Didn't receive the code?
										</Text>
										<TouchableOpacity
											onPress={resendOTP}
											disabled={resendDisabled}
										>
											<Text
												style={[
													styles.resendButton,
													resendDisabled && styles.resendButtonDisabled,
												]}
											>
												{resendDisabled
													? `Resend in ${resendTimer}s`
													: "Resend Code"}
											</Text>
										</TouchableOpacity>
									</View>
								</>
							)}

							{/* Password Input */}
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
											? COLORS.primary
											: COLORS.textSecondary
									}
									style={styles.inputIcon}
								/>
								<TextInput
									style={styles.input}
									placeholder="Password"
									placeholderTextColor={COLORS.textSecondary}
									value={formData.password}
									onChangeText={(text) => handleChange("password", text)}
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
										color={COLORS.textSecondary}
									/>
								</TouchableOpacity>
							</View>
							{formErrors.password ? (
								<Text style={styles.errorText}>{formErrors.password}</Text>
							) : null}

							{/* Confirm Password Input */}
							<View
								style={[
									styles.inputContainer,
									focusedInput === "confirmPassword" &&
										styles.inputContainerFocused,
								]}
							>
								<MaterialCommunityIcons
									name="lock-outline"
									size={22}
									color={
										focusedInput === "confirmPassword"
											? COLORS.primary
											: COLORS.textSecondary
									}
									style={styles.inputIcon}
								/>
								<TextInput
									style={styles.input}
									placeholder="Confirm Password"
									placeholderTextColor={COLORS.textSecondary}
									value={formData.confirmPassword}
									onChangeText={(text) => handleChange("confirmPassword", text)}
									secureTextEntry={!showConfirmPassword}
									onFocus={() => setFocusedInput("confirmPassword")}
									onBlur={() => setFocusedInput(null)}
								/>
								<TouchableOpacity
									onPress={() => setShowConfirmPassword(!showConfirmPassword)}
									style={styles.eyeIcon}
								>
									<MaterialCommunityIcons
										name={showConfirmPassword ? "eye-off" : "eye"}
										size={22}
										color={COLORS.textSecondary}
									/>
								</TouchableOpacity>
							</View>
							{formErrors.confirmPassword ? (
								<Text style={styles.errorText}>
									{formErrors.confirmPassword}
								</Text>
							) : null}

							<Animated.View style={{ transform: [{ scale: buttonScale }] }}>
								<TouchableOpacity
									style={[
										styles.signupButton,
										(!otpVerified || isLoading) && styles.signupButtonDisabled,
									]}
									onPress={handleSignUp}
									disabled={!otpVerified || isLoading}
									onPressIn={onPressIn}
									onPressOut={onPressOut}
								>
									{isLoading ? (
										<MaterialCommunityIcons
											name="loading"
											size={24}
											color={COLORS.textPrimary}
										/>
									) : (
										<Text style={styles.signupButtonText}>Create Account</Text>
									)}
								</TouchableOpacity>
							</Animated.View>

							<Text style={styles.termsText}>
								By signing up, you agree to our{" "}
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
								onPress={handleGoogleSignup}
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
							<Text style={styles.footerText}>Already have an account?</Text>
							<TouchableOpacity
								onPress={() => {
									Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
									navigation.navigate("Login");
								}}
							>
								<Text style={styles.loginText}> Sign In</Text>
							</TouchableOpacity>
						</Animated.View>
					</ScrollView>
				</KeyboardAvoidingView>

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
	backgroundPattern: {
		position: "absolute",
		width: "100%",
		height: "100%",
		opacity: 0.1,
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
	},
	header: {
		alignItems: "center",
		marginBottom: 30,
	},
	backButton: {
		position: "absolute",
		left: 0,
		top: 0,
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: COLORS.cardBg,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
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
	nameRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	halfInput: {
		width: "48%",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: COLORS.inputBg,
		borderRadius: 12,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	inputContainerFocused: {
		borderColor: COLORS.primary,
	},
	inputIcon: {
		padding: 14,
	},
	input: {
		flex: 1,
		color: COLORS.textPrimary,
		fontSize: 16,
		paddingVertical: 14,
	},
	verifyButton: {
		backgroundColor: COLORS.primary,
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
		marginRight: 10,
	},
	verifyButtonDisabled: {
		opacity: 0.7,
	},
	verifyButtonText: {
		color: COLORS.textPrimary,
		fontSize: 14,
		fontWeight: "500",
	},
	verifiedIcon: {
		marginRight: 14,
	},
	resendContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: -8,
		marginBottom: 16,
	},
	resendText: {
		color: COLORS.textSecondary,
		fontSize: 14,
	},
	resendButton: {
		color: COLORS.primary,
		fontSize: 14,
		fontWeight: "600",
		marginLeft: 4,
	},
	resendButtonDisabled: {
		color: COLORS.textSecondary,
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
	signupButton: {
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
	signupButtonDisabled: {
		opacity: 0.7,
	},
	signupButtonText: {
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
	loginText: {
		color: COLORS.primary,
		fontWeight: "600",
	},
	// Modal styles
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
});
