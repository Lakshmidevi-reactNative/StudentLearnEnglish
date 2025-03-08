import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { COLORS } from "../constants/Colors";

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
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      
      // Simulate API call (from first file)
      setTimeout(() => {
        setIsLoading(false);
        // Navigate to Onboarding with firstName (from second file)
        navigation.navigate("Onboarding", {
          firstName: formData.firstName,
        });
      }, 1500);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.deepBlue, COLORS.softPurple]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Start your language learning journey today
              </Text>
            </View>

            <BlurView intensity={30} tint="dark" style={styles.formContainer}>
              <View style={styles.nameRow}>
                {/* First Name Input */}
                <View style={[styles.inputContainer, styles.halfInput]}>
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={20}
                    color={COLORS.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    placeholderTextColor={COLORS.textSecondary}
                    value={formData.firstName}
                    onChangeText={(text) => handleChange("firstName", text)}
                  />
                </View>

                {/* Last Name Input */}
                <View style={[styles.inputContainer, styles.halfInput]}>
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={20}
                    color={COLORS.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    placeholderTextColor={COLORS.textSecondary}
                    value={formData.lastName}
                    onChangeText={(text) => handleChange("lastName", text)}
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
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color={COLORS.textSecondary}
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
                />
              </View>
              {formErrors.email ? (
                <Text style={styles.errorText}>{formErrors.email}</Text>
              ) : null}

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={COLORS.textSecondary}
                  value={formData.password}
                  onChangeText={(text) => handleChange("password", text)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {formErrors.password ? (
                <Text style={styles.errorText}>{formErrors.password}</Text>
              ) : null}

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor={COLORS.textSecondary}
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleChange("confirmPassword", text)}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <MaterialCommunityIcons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {formErrors.confirmPassword ? (
                <Text style={styles.errorText}>{formErrors.confirmPassword}</Text>
              ) : null}

              <TouchableOpacity
                style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                onPress={handleSignUp}
                disabled={isLoading}
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

              <Text style={styles.termsText}>
                By signing up, you agree to our{" "}
                <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </BlurView>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 40,
    paddingBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 10,
    textShadowColor: COLORS.neonBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  halfInput: {
    width: "48%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  inputIcon: {
    padding: 15,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
    paddingVertical: 15,
  },
  eyeIcon: {
    padding: 15,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
  signupButton: {
    backgroundColor: COLORS.neonPurple,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  termsText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.neonBlue,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  footerText: {
    color: COLORS.textSecondary,
    marginRight: 5,
  },
  loginText: {
    color: COLORS.neonBlue,
    fontWeight: "600",
  },
});

export default SignupScreen;