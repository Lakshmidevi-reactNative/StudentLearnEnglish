import React, { useState } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/Colors';
import { BlurView } from 'expo-blur';
import { toast } from 'sonner-native';
import * as Haptics from 'expo-haptics';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  
  // Animation values
  const buttonScale = new Animated.Value(1);
  const glowOpacity = new Animated.Value(0.5);
  
  // Reset password modal state
  const [isModalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');

  React.useEffect(() => {
    // Create pulsing animation for glow effects
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const validateEmail = (email) => {
    if (!email.trim()) {
      return 'Please enter your email';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Please enter your password';
    }
    return '';
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
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        // For demo, just navigate to main app
        navigation.replace('Main');
      }, 1500);
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
      // Add your reset password logic here
      setModalVisible(false);
      toast.info('Password reset link sent! Check your email.');
      setResetEmail('');
      setResetEmailError('');
    }
  };

  const handleSocialLogin = (platform) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toast.info(`${platform} login coming soon!`);
  };

  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
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
    <LinearGradient
      colors={[COLORS.deepBlue, '#1A1A2E', COLORS.softPurple]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Background animated lights */}
      <Animated.View style={[styles.backgroundGlow, { opacity: glowOpacity }]} />
      
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Animated.View style={[styles.logoContainer, { opacity: glowOpacity }]}>
                <Image
                  source={require("../../assets/logo.png")}
                  style={styles.logo}
                />
                <View style={styles.logoGlow} />
              </Animated.View>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>
                Sign in to continue your learning journey
              </Text>
            </View>

            <BlurView intensity={30} tint="dark" style={styles.formContainer}>
              <View style={[
                styles.inputContainer,
                focusedInput === 'email' && styles.inputContainerFocused
              ]}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color={focusedInput === 'email' ? COLORS.neonBlue : COLORS.textSecondary}
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
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}

              <View style={[
                styles.inputContainer,
                focusedInput === 'password' && styles.inputContainerFocused
              ]}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={focusedInput === 'password' ? COLORS.neonBlue : COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={COLORS.textSecondary}
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={focusedInput === 'password' ? COLORS.neonBlue : COLORS.textSecondary}
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
                  style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={isLoading}
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                >
                  <LinearGradient
                    colors={['#4facfe', '#00f2fe']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    {isLoading ? (
                      <MaterialCommunityIcons
                        name="loading"
                        size={24}
                        color={COLORS.textPrimary}
                      />
                    ) : (
                      <Text style={styles.loginButtonText}>Sign In</Text>
                    )}
                  </LinearGradient>
                  <View style={styles.buttonGlow} />
                </TouchableOpacity>
              </Animated.View>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={() => handleSocialLogin('Google')}
                >
                  <LinearGradient
                    colors={['#DB4437', '#EA4335']}
                    style={styles.socialButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <FontAwesome5 name="google" size={20} color={COLORS.textPrimary} />
                  </LinearGradient>
                  <View style={styles.socialButtonGlow} />
                </TouchableOpacity>
              </View>
            </BlurView>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.navigate('Signup');
                }}
              >
                <Text style={styles.signupText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Reset Password Modal */}
        <Modal visible={isModalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <BlurView intensity={30} tint="dark" style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Reset Password</Text>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setModalVisible(false);
                    setResetEmail('');
                    setResetEmailError('');
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
                Enter your email address and we'll send you a link to reset
                your password.
              </Text>

              <View style={[
                styles.inputContainer,
                focusedInput === 'resetEmail' && styles.inputContainerFocused
              ]}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color={focusedInput === 'resetEmail' ? COLORS.neonBlue : COLORS.textSecondary}
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
                  onFocus={() => setFocusedInput('resetEmail')}
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
                <LinearGradient
                  colors={['#4facfe', '#00f2fe']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.resetButtonText}>Send Reset Link</Text>
                </LinearGradient>
                <View style={styles.buttonGlow} />
              </TouchableOpacity>
            </BlurView>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGlow: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.neonBlue,
    opacity: 0.15,
    transform: [{ scale: 2 }],
    zIndex: -1,
    shadowColor: COLORS.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
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
    paddingTop: Platform.OS === 'ios' ? 40 : 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    borderRadius: 90,
    width: 70,
    height: 70,
    zIndex: 2,
  },
  logoGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: COLORS.neonBlue,
    shadowColor: COLORS.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 10,
    textShadowColor: COLORS.neonBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: COLORS.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  inputContainerFocused: {
    borderColor: COLORS.neonBlue,
    shadowColor: COLORS.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
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
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 15,
    marginLeft: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: COLORS.neonBlue,
    fontSize: 14,
    textShadowColor: COLORS.neonBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  loginButton: {
    position: 'relative',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    shadowColor: COLORS.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: COLORS.textSecondary,
    paddingHorizontal: 10,
    fontSize: 12,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    position: 'relative',
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  socialButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 25,
    shadowColor: '#FF4B4B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  footerText: {
    color: COLORS.textSecondary,
    marginRight: 5,
  },
  signupText: {
    color: COLORS.neonBlue,
    fontWeight: '600',
    textShadowColor: COLORS.neonBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: COLORS.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textShadowColor: COLORS.neonBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  resetButton: {
    position: 'relative',
    borderRadius: 12,
    marginTop: 10,
    overflow: 'hidden',
  },
  resetButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
});