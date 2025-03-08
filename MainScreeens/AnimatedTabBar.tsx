import React, { useState, useRef, useEffect } from "react";
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
import { useTheme } from "./constants/ThemeContext";

const { width } = Dimensions.get("window");

// Track which screens need refreshing
const screensNeedRefresh = {};

interface TabIconProps {
	routeName: string;
	focused: boolean;
	color: string;
}

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
	const { colors, theme } = useTheme();
	const [previousTab, setPreviousTab] = useState<string | null>(null);

	// Track tab changes to mark screens for refresh
	useEffect(() => {
		const currentRoute = state.routes[state.index];
		if (previousTab && previousTab !== currentRoute.name) {
			// Mark the previous screen as needing refresh when we return to it
			screensNeedRefresh[previousTab] = true;
		}
		setPreviousTab(currentRoute.name);
	}, [state.index, state.routes]);

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
			// Navigate to the selected tab
			navigation.navigate(route.name);
			
			// Check if this screen needs a refresh
			if (screensNeedRefresh[route.name]) {
				// Reset the tab's navigation state to force a refresh
				navigation.reset({
					index: 0,
					routes: [{ name: route.name }],
				});
				// Clear the refresh flag
				screensNeedRefresh[route.name] = false;
			}
		} else if (isFocused) {
			// Always reset the current tab when clicking on it again
			navigation.reset({
				index: 0,
				routes: [{ name: route.name }],
			});
		}
	};

	// Safe bottom padding (adds to existing styles)
	const bottomPadding = Math.max(insets.bottom, 10);

	const gradientColors = theme === 'dark' 
		? ["rgba(11, 16, 51, 0.95)", "rgba(33, 33, 100, 0.95)"]
		: ["rgba(255, 255, 255, 0.95)", "rgba(240, 240, 255, 0.95)"];

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
					colors={gradientColors}
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
						const color = isFocused ? colors.neonBlue : colors.textSecondary;

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
								{isFocused && <View style={[styles.activeIndicator, { backgroundColor: colors.neonBlue }]} />}
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
		borderTopColor: "rgba(255, 255, 255, 0.1)",
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
		borderRadius: 4,
		marginTop: 4,
	},
	glowIcon: {
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 10,
	},
});

export default AnimatedTabBar;