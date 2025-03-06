// components/StickyHeader.tsx
import React from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Platform,
	StatusBar,
	Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const StickyHeader = ({
	title,
	stickyHeaderOpacity,
	isDarkMode,
	onBackPress = null,
}) => {
	return (
		<Animated.View
			style={[
				styles.stickyHeader,
				{ opacity: stickyHeaderOpacity },
				isDarkMode && styles.darkStickyHeader,
			]}
		>
			{onBackPress ? (
				<TouchableOpacity onPress={onBackPress} style={styles.backButton}>
					<MaterialIcons
						name="arrow-back"
						size={24}
						color={isDarkMode ? "#FFFFFF" : "black"}
					/>
				</TouchableOpacity>
			) : (
				<View style={styles.placeholder} />
			)}
			<Text style={[styles.stickyHeaderTitle, isDarkMode && styles.darkText]}>
				{title}
			</Text>
			<View style={styles.placeholder} />
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	stickyHeader: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: Platform.OS === "ios" ? 50 : 100,
		backgroundColor: "rgba(245,247,250,0.97)",
		zIndex: 1000,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0,0,0,0.1)",
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
		elevation: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	darkStickyHeader: {
		backgroundColor: "rgba(26,26,26,0.95)",
		borderBottomColor: "rgba(255,255,255,0.1)",
	},
	backButton: {
		padding: 8,
	},
	stickyHeaderTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#012269",
	},
	darkText: {
		color: "#FFFFFF",
	},
	placeholder: {
		width: 40,
	},
});

export default StickyHeader;
