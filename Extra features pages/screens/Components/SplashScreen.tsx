// SplashScreen.tsx
import React, { useEffect } from "react";
import { View, Image, StyleSheet, Text, Animated } from "react-native";

const SplashScreen = ({ onFinish }) => {
	const fadeAnim = new Animated.Value(0);
	const scaleAnim = new Animated.Value(0.9);

	useEffect(() => {
		// Start animations
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 800,
				useNativeDriver: true,
			}),
			Animated.spring(scaleAnim, {
				toValue: 1,
				friction: 8,
				tension: 40,
				useNativeDriver: true,
			}),
		]).start();

		// Hide splash screen after animations (adjust timing as needed)
		const timer = setTimeout(() => {
			onFinish();
		}, 2500);

		return () => clearTimeout(timer);
	}, []);

	return (
		<View style={styles.container}>
			<Animated.View
				style={[
					styles.logoContainer,
					{
						opacity: fadeAnim,
						transform: [{ scale: scaleAnim }],
					},
				]}
			>
				<Image
					source={require("../../assets/icon.png")}
					style={styles.logo}
					resizeMode="contain"
				/>
				<Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
					LearnEng
				</Animated.Text>
				<Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
					Your English Learning Journey Starts Here
				</Animated.Text>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#4A90E2",
		alignItems: "center",
		justifyContent: "center",
	},
	logoContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	logo: {
		borderRadius: 150,
		width: 150,
		height: 150,
		marginBottom: 20,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		color: "white",
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 16,
		color: "white",
		textAlign: "center",
		maxWidth: "80%",
	},
});

export default SplashScreen;
