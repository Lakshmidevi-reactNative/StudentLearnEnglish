// ModernTabBar.tsx
// Completely redesigned tab bar with premium UI, reliable functionality, and screen refresh on tab change
import React, { useState, useEffect, useRef } from "react";
import {
	View,
	TouchableOpacity,
	StyleSheet,
	Animated,
	Text,
	Platform,
	Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "../../App";

const ModernTabBar: React.FC<BottomTabBarProps> = ({
	state,
	descriptors,
	navigation,
}) => {
	const { isDarkMode } = useTheme();
	const insets = useSafeAreaInsets();
	const [visible, setVisible] = useState(true);
	const fadeAnim = useRef(new Animated.Value(1)).current;
	const translateY = useRef(new Animated.Value(0)).current;
	const lastTapTimeRef = useRef(0);
	const lastActiveTabRef = useRef(-1);

	// Theme colors
	const theme = {
		barBackground: isDarkMode ? "#1A1A1A" : "#FFFFFF",
		tabActive: isDarkMode ? "#4299E1" : "#0066FF",
		tabInactive: isDarkMode ? "#888888" : "#8E8E93",
		borderColor: isDarkMode ? "#333333" : "#E5E5EA",
		shadow: isDarkMode ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.1)",
		text: isDarkMode ? "#FFFFFF" : "#000000",
	};

	// Hide tab bar with smooth animation
	const hideTabBar = () => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}),
			Animated.timing(translateY, {
				toValue: 70,
				duration: 250,
				useNativeDriver: true,
			}),
		]).start(() => {
			setVisible(false);
		});
	};

	// Show tab bar with smooth animation
	const showTabBar = () => {
		setVisible(true);
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 250,
				useNativeDriver: true,
			}),
			Animated.timing(translateY, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}),
		]).start();
	};

	// Handle tab press with double-tap detection
	const handleTabPress = (route, index, isFocused) => {
		const event = navigation.emit({
			type: "tabPress",
			target: route.key,
			canPreventDefault: true,
		});

		if (!isFocused && !event.defaultPrevented) {
			// Force refresh by using reset instead of navigate
			navigation.reset({
				index: 0,
				routes: [{ name: route.name }],
			});
			lastActiveTabRef.current = index;
			return;
		}

		// Handle double tap on active tab
		if (isFocused) {
			const now = Date.now();
			const timeSinceLastTap = now - lastTapTimeRef.current;

			if (timeSinceLastTap < 300 && lastActiveTabRef.current === index) {
				hideTabBar();
			}

			lastTapTimeRef.current = now;
			lastActiveTabRef.current = index;
		}
	};

	// Handle global screen tap to show tab bar
	const handleScreenTap = () => {
		const now = Date.now();
		const timeSinceLastTap = now - lastTapTimeRef.current;

		if (timeSinceLastTap < 300) {
			showTabBar();
		}

		lastTapTimeRef.current = now;
	};

	// If tab bar is hidden, render full-screen touch handler
	if (!visible) {
		return (
			<TouchableOpacity
				style={[StyleSheet.absoluteFill, styles.fullScreenTouchArea]}
				activeOpacity={1}
				onPress={handleScreenTap}
			/>
		);
	}

	return (
		<Animated.View
			style={[
				styles.container,
				{
					opacity: fadeAnim,
					transform: [{ translateY: translateY }],
					backgroundColor: theme.barBackground,
					borderTopColor: theme.borderColor,
					paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
					shadowColor: theme.shadow,
				},
			]}
		>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const label = options.tabBarLabel || options.title || route.name;
				const isFocused = state.index === index;

				// Icon selection based on route and focus state
				let iconName;
				if (route.name === "Home") {
					iconName = isFocused ? "home" : "home-outline";
				} else if (route.name === "Learn") {
					iconName = isFocused ? "book" : "book-outline";
				} else if (route.name === "Classes") {
					iconName = isFocused ? "school" : "school-outline";
				} else if (route.name === "Resource") {
					iconName = isFocused ? "search" : "search-outline";
				}

				return (
					<TouchableOpacity
						key={index}
						accessibilityRole="button"
						accessibilityState={isFocused ? { selected: true } : {}}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						testID={options.tabBarTestID}
						onPress={() => handleTabPress(route, index, isFocused)}
						style={styles.tabButton}
						activeOpacity={0.8}
					>
						<View style={styles.tabContent}>
							<Ionicons
								name={iconName}
								size={24}
								color={isFocused ? theme.tabActive : theme.tabInactive}
							/>

							<Text
								style={[
									styles.tabLabel,
									{
										color: isFocused ? theme.tabActive : theme.tabInactive,
										fontWeight: isFocused ? "700" : "400",
									},
								]}
							>
								{label}
							</Text>

							{isFocused && (
								<View
									style={[
										styles.activeIndicator,
										{ backgroundColor: theme.tabActive },
									]}
								/>
							)}
						</View>
					</TouchableOpacity>
				);
			})}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		borderTopWidth: 1,
		elevation: 10,
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
	},
	tabButton: {
		flex: 1,
		paddingVertical: 10,
	},
	tabContent: {
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
	},
	tabLabel: {
		fontSize: 11,
		marginTop: 5,
		textAlign: "center",
	},
	activeIndicator: {
		position: "absolute",
		top: -12,
		width: 4,
		height: 4,
		borderRadius: 2,
	},
	fullScreenTouchArea: {
		zIndex: 999,
	},
});

export default ModernTabBar;
