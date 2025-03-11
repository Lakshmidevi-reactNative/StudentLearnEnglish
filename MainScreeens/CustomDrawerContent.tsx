// MainScreeens/CustomDrawerContent.tsx
import React from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	Switch,
	Platform,
} from "react-native";
import {
	DrawerContentScrollView,
	DrawerItemList,
	DrawerItem,
} from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "./constants/ThemeContext";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { CommonActions } from "@react-navigation/native";

interface CustomDrawerContentProps extends DrawerContentComponentProps {
	studentInfo: any;
	onLogout: () => Promise<void>;
}

export default function CustomDrawerContent(props: CustomDrawerContentProps) {
	const { theme, colors, toggleTheme } = useTheme();
	const isDarkMode = theme === "dark";
	const { studentInfo, onLogout } = props;

	const handleLogout = async () => {
		try {
			// Call the logout function from AuthContext
			await onLogout();

			// Reset navigation to Auth stack's Signup screen
			props.navigation.dispatch(
				CommonActions.reset({
					index: 0,
					routes: [
						{
							name: "Auth",
							state: {
								routes: [{ name: "Signup" }],
							},
						},
					],
				})
			);
		} catch (error) {
			console.error("Error during logout:", error);
		}
	};

	return (
		<LinearGradient
			colors={[colors.deepBlue, colors.softPurple]}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			<DrawerContentScrollView
				{...props}
				contentContainerStyle={styles.drawerContent}
			>
				<View style={styles.profileSection}>
					<Image
						source={
							studentInfo?.student_photo &&
							!studentInfo.student_photo.includes("default.jpg")
								? { uri: studentInfo.student_photo }
								: {
										uri: "https://api.a0.dev/assets/image?text=portrait%20photo%20of%20a%20young%20female%20student%20with%20a%20friendly%20smile&aspect=1:1&seed=123",
								  }
						}
						style={[styles.profileImage, { borderColor: colors.neonPurple }]}
					/>
					<Text style={[styles.profileName, { color: colors.textPrimary }]}>
						{studentInfo?.student_name || "Guest User"}
					</Text>
					<View
						style={[
							styles.levelBadge,
							{
								backgroundColor:
									theme === "dark"
										? "rgba(0, 180, 255, 0.2)"
										: "rgba(0, 133, 204, 0.2)",
								borderColor:
									theme === "dark"
										? "rgba(0, 180, 255, 0.5)"
										: "rgba(0, 133, 204, 0.5)",
							},
						]}
					>
						<Text
							style={[
								styles.levelText,
								{ color: theme === "dark" ? "#FFFFFF" : colors.deepBlue },
							]}
						>
							Beginner
						</Text>
					</View>
				</View>

				<View
					style={[
						styles.dividerHorizontal,
						{ backgroundColor: colors.cardBorder },
					]}
				/>

				{/* Custom DrawerItemList with white text for selected items */}
				<View style={styles.drawerItemsContainer}>
					{props.state.routes.map((route, index) => {
						const { options } = props.descriptors[route.key];
						const label =
							options.drawerLabel !== undefined
								? options.drawerLabel
								: options.title !== undefined
								? options.title
								: route.name;

						const isFocused = props.state.index === index;

						return (
							<DrawerItem
								key={route.key}
								label={({ focused, color }) => (
									<Text
										style={{
											color: isFocused
												? theme === "dark"
													? "#FFFFFF"
													: "#4169E1" // Royal blue for light mode
												: colors.textPrimary,
											fontWeight: isFocused ? "bold" : "normal",
										}}
									>
										{label}
									</Text>
								)}
								onPress={() => {
									props.navigation.navigate(route.name);
								}}
								focused={isFocused}
								activeTintColor="#FFFFFF"
								activeBackgroundColor={
									theme === "dark"
										? "rgba(255, 255, 255, 0.2)"
										: "rgba(65, 105, 225, 0.1)" // Light blue background in light mode
								}
								style={
									isFocused && theme === "light"
										? {
												backgroundColor: "rgba(65, 105, 225, 0.1)",
												borderRadius: 10,
												overflow: "hidden",
										  }
										: {}
								}
								icon={({ focused, color, size }) => {
									if (options.drawerIcon) {
										// In dark mode: white icons
										// In light mode: black icons
										const iconColor = theme === "dark" ? "#FFFFFF" : "#000000";
										return options.drawerIcon({
											focused,
											color: iconColor,
											size: size || 24,
										});
									}
									return null;
								}}
							/>
						);
					})}
				</View>

				<View
					style={[
						styles.dividerHorizontal,
						{ backgroundColor: colors.cardBorder },
					]}
				/>

				<View style={styles.modeToggleContainer}>
					<Text style={[styles.modeToggleLabel, { color: colors.textPrimary }]}>
						{isDarkMode ? "Dark Mode" : "Light Mode"}
					</Text>
					<Switch
						value={isDarkMode}
						onValueChange={toggleTheme}
						trackColor={{ false: "#767577", true: colors.neonBlue }}
						thumbColor={isDarkMode ? colors.neonPurple : "#f4f3f4"}
						ios_backgroundColor="#3e3e3e"
					/>
				</View>

				<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
					<MaterialCommunityIcons
						name="logout"
						size={20}
						color={colors.textSecondary}
					/>
					<Text style={[styles.logoutText, { color: colors.textSecondary }]}>
						Sign Out
					</Text>
				</TouchableOpacity>
			</DrawerContentScrollView>

			<View
				style={[styles.versionContainer, { borderTopColor: colors.cardBorder }]}
			>
				<Text style={[styles.versionText, { color: colors.textSecondary }]}>
					LearnEng v1.0.0
				</Text>
			</View>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	drawerContent: {
		paddingTop: Platform.OS === "android" ? 10 : 0,
	},
	profileSection: {
		padding: 20,
		alignItems: "center",
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: 10,
		borderWidth: 2,
	},
	profileName: {
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 5,
	},
	levelBadge: {
		paddingHorizontal: 15,
		paddingVertical: 5,
		borderRadius: 20,
		borderWidth: 1,
		overflow: "hidden",
	},
	levelText: {
		fontWeight: "600",
		fontSize: 12,
	},
	dividerHorizontal: {
		height: 1,
		marginVertical: 15,
		marginHorizontal: 20,
	},
	drawerItemsContainer: {
		marginVertical: 5,
	},
	modeToggleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginHorizontal: 20,
		paddingVertical: 10,
	},
	modeToggleLabel: {
		fontSize: 16,
	},
	logoutButton: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 20,
		marginTop: 10,
		paddingVertical: 10,
	},
	logoutText: {
		marginLeft: 10,
		fontSize: 16,
	},
	versionContainer: {
		padding: 20,
		borderTopWidth: 1,
	},
	versionText: {
		fontSize: 12,
		textAlign: "center",
	},
});
