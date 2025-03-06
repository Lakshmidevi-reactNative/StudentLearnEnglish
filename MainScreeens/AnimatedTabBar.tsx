import React, { useState, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	Animated,
	Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface TabIconProps {
	routeName: string;
	focused: boolean;
	color: string;
}

// Dark Theme Colors
const COLORS = {
	deepBlue: "#0B1033",
	softPurple: "#4B0082",
	neonBlue: "#00B4FF",
	neonPurple: "#B026FF",
	neonGreen: "#39FF14",
	textPrimary: "#FFFFFF",
	textSecondary: "#CCCCCC",
	cardBg: "rgba(255, 255, 255, 0.06)",
	cardBorder: "rgba(255, 255, 255, 0.1)",
};

const getTabIcon = ({ routeName, focused, color }: TabIconProps) => {
	let iconName = "";

	switch (routeName) {
		case "Home":
			iconName = focused ? "home" : "home-outline";
			break;
		case "Learn":
			iconName = focused ? "book" : "book-outline";
			break;
		case "Classes":
			iconName = focused ? "school" : "school-outline";
			break;
		case "Resources":
			iconName = focused ? "search" : "search-outline";
			break;
		default:
			iconName = "help-circle-outline";
	}

	return (
		<Ionicons
			name={iconName as any}
			size={24}
			color={color}
			style={focused ? styles.glowIcon : {}}
		/>
	);
};

const AnimatedTabBar = ({
	state,
	descriptors,
	navigation,
}: BottomTabBarProps) => {
	const [isVisible, setIsVisible] = useState(true);
	const lastTapTimeRef = useRef<{ [key: string]: number }>({});
	const translateY = useRef(new Animated.Value(0)).current;
	const opacity = useRef(new Animated.Value(1)).current;
	const insets = useSafeAreaInsets();

	const hideTabBar = () => {
		Animated.parallel([
			Animated.timing(translateY, {
				toValue: 100,
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.timing(opacity, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}),
		]).start(() => setIsVisible(false));
	};

	const showTabBar = () => {
		setIsVisible(true);
		Animated.parallel([
			Animated.timing(translateY, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.timing(opacity, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}),
		]).start();
	};

	const handleTabPress = (route: any, isFocused: boolean, index: number) => {
		const event = navigation.emit({
			type: "tabPress",
			target: route.key,
			canPreventDefault: true,
		});

		const currentTime = Date.now();
		const lastTapTime = lastTapTimeRef.current[route.name] || 0;
		lastTapTimeRef.current[route.name] = currentTime;

		// Double tap detection (within 300ms)
		if (currentTime - lastTapTime < 300 && isFocused) {
			hideTabBar();
			return;
		}

		if (!isFocused && !event.defaultPrevented) {
			navigation.navigate(route.name);
		} else if (isFocused) {
			// Reset the stack to the first screen if on the same tab
			navigation.reset({
				index: 0,
				routes: [{ name: route.name }],
			});
		}
	};

	// Safe bottom padding (adds to existing styles)
	const bottomPadding = Math.max(insets.bottom, 10);

	return (
		<>
			{/* Full screen pressable to show tab bar when hidden */}
			{!isVisible && (
				<Pressable style={StyleSheet.absoluteFill} onPress={showTabBar} />
			)}

			<Animated.View
				style={[
					styles.tabBar,
					{
						paddingBottom: bottomPadding,
						transform: [{ translateY }],
						opacity,
					},
				]}
			>
				<LinearGradient
					colors={["rgba(11, 16, 51, 0.95)", "rgba(75, 0, 130, 0.95)"]}
					style={styles.gradient}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
				>
					{state.routes.map((route, index) => {
						const { options } = descriptors[route.key];
						const label =
							options.tabBarLabel !== undefined
								? options.tabBarLabel
								: options.title !== undefined
								? options.title
								: route.name;

						const isFocused = state.index === index;
						const color = isFocused ? COLORS.neonBlue : COLORS.textSecondary;

						return (
							<TouchableOpacity
								key={route.key}
								accessibilityRole="button"
								accessibilityState={isFocused ? { selected: true } : {}}
								accessibilityLabel={options.tabBarAccessibilityLabel}
								testID={options.tabBarTestID}
								onPress={() => handleTabPress(route, isFocused, index)}
								style={styles.tabButton}
							>
								{getTabIcon({
									routeName: route.name,
									focused: isFocused,
									color,
								})}
								<Text style={[styles.tabLabel, { color }]}>
									{String(label)}
								</Text>
								{isFocused && <View style={styles.activeIndicator} />}
							</TouchableOpacity>
						);
					})}
				</LinearGradient>
			</Animated.View>
		</>
	);
};

const styles = StyleSheet.create({
	tabBar: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		elevation: 8,
		backgroundColor: "transparent",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: -3,
		},
		shadowOpacity: 0.2,
		shadowRadius: 5,
	},
	gradient: {
		flexDirection: "row",
		borderTopWidth: 1,
		borderTopColor: COLORS.cardBorder,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		overflow: "hidden",
	},
	tabButton: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 8,
		position: "relative",
	},
	tabLabel: {
		fontSize: 12,
		marginTop: 2,
	},
	activeIndicator: {
		position: "absolute",
		bottom: -1,
		width: 8,
		height: 2,
		backgroundColor: COLORS.neonBlue,
		borderRadius: 4,
		marginTop: 4,
	},
	glowIcon: {
		textShadowColor: COLORS.neonBlue,
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 10,
	},
});

export default AnimatedTabBar;
