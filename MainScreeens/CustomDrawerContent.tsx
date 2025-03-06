import React, { useState } from "react";
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
} from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const COLORS = {
	deepBlue: "#0B1033",
	softPurple: "#4B0082",
	neonBlue: "#00B4FF",
	neonPurple: "#B026FF",
	textPrimary: "#FFFFFF",
	textSecondary: "#CCCCCC",
	cardBg: "rgba(255, 255, 255, 0.06)",
	cardBorder: "rgba(255, 255, 255, 0.1)",
};

import { DrawerContentComponentProps } from "@react-navigation/drawer";

export default function CustomDrawerContent(
	props: DrawerContentComponentProps
) {
	const [isDarkMode, setIsDarkMode] = useState(true);

	return (
		<LinearGradient
			colors={[COLORS.deepBlue, COLORS.softPurple]}
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
						source={{
							uri: "https://api.a0.dev/assets/image?text=portrait%20photo%20of%20a%20young%20female%20student%20with%20a%20friendly%20smile&aspect=1:1&seed=123",
						}}
						style={styles.profileImage}
					/>
					<Text style={styles.profileName}>Sarah Johnson</Text>
					<View style={styles.levelBadge}>
						<Text style={styles.levelText}>Beginner</Text>
					</View>
				</View>

				<View style={styles.statsContainer}>
					<View style={styles.statItem}>
						<Text style={styles.statNumber}>24</Text>
						<Text style={styles.statLabel}>Days</Text>
					</View>
					<View style={styles.divider} />
					<View style={styles.statItem}>
						<Text style={styles.statNumber}>385</Text>
						<Text style={styles.statLabel}>Points</Text>
					</View>
					<View style={styles.divider} />
					<View style={styles.statItem}>
						<Text style={styles.statNumber}>8</Text>
						<Text style={styles.statLabel}>Skills</Text>
					</View>
				</View>

				<View style={styles.dividerHorizontal} />

				<DrawerItemList {...props} />

				<View style={styles.dividerHorizontal} />

				<View style={styles.modeToggleContainer}>
					<Text style={styles.modeToggleLabel}>Dark Mode</Text>
					<Switch
						value={isDarkMode}
						onValueChange={setIsDarkMode}
						trackColor={{ false: "#767577", true: COLORS.neonBlue }}
						thumbColor={isDarkMode ? COLORS.neonPurple : "#f4f3f4"}
						ios_backgroundColor="#3e3e3e"
					/>
				</View>

				<TouchableOpacity style={styles.logoutButton}>
					<MaterialCommunityIcons
						name="logout"
						size={20}
						color={COLORS.textSecondary}
					/>
					<Text style={styles.logoutText}>Sign Out</Text>
				</TouchableOpacity>
			</DrawerContentScrollView>

			<View style={styles.versionContainer}>
				<Text style={styles.versionText}>LearnEng v1.0.0</Text>
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
		borderColor: COLORS.neonPurple,
	},
	profileName: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 5,
	},
	levelBadge: {
		backgroundColor: "rgba(0, 180, 255, 0.2)",
		paddingHorizontal: 15,
		paddingVertical: 5,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "rgba(0, 180, 255, 0.5)",
	},
	levelText: {
		color: COLORS.neonBlue,
		fontWeight: "600",
		fontSize: 12,
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginHorizontal: 20,
		marginVertical: 10,
		backgroundColor: COLORS.cardBg,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
		padding: 15,
	},
	statItem: {
		alignItems: "center",
		flex: 1,
	},
	statNumber: {
		color: COLORS.neonPurple,
		fontSize: 20,
		fontWeight: "700",
	},
	statLabel: {
		color: COLORS.textSecondary,
		fontSize: 12,
	},
	divider: {
		width: 1,
		backgroundColor: COLORS.cardBorder,
	},
	dividerHorizontal: {
		height: 1,
		backgroundColor: COLORS.cardBorder,
		marginVertical: 15,
		marginHorizontal: 20,
	},
	modeToggleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginHorizontal: 20,
		paddingVertical: 10,
	},
	modeToggleLabel: {
		color: COLORS.textPrimary,
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
		color: COLORS.textSecondary,
		marginLeft: 10,
		fontSize: 16,
	},
	versionContainer: {
		padding: 20,
		borderTopWidth: 1,
		borderTopColor: COLORS.cardBorder,
	},
	versionText: {
		color: COLORS.textSecondary,
		fontSize: 12,
		textAlign: "center",
	},
});
