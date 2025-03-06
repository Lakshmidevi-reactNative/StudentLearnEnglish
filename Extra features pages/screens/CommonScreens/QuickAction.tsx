import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface QuickActionProps {
	title: string;
	icon: string;
	color: string;
	onPress: () => void;
	isDarkMode: boolean;
}

/**
 * QuickAction Component
 *
 * @param props - Component properties
 * @param props.title - The title of the quick action
 * @param props.icon - MaterialIcons icon name
 * @param props.color - Base color for the quick action
 * @param props.onPress - Function to call when pressed
 * @param props.isDarkMode - Whether dark mode is enabled
 * @returns A touchable card with icon and title for navigation
 */
const QuickAction: React.FC<QuickActionProps> = ({
	title,
	icon,
	color,
	onPress,
	isDarkMode,
}) => {
	return (
		<TouchableOpacity
			style={[styles.actionCard, isDarkMode && styles.darkCard]}
			onPress={onPress}
		>
			<LinearGradient
				colors={[`${color}15`, `${color}05`]}
				style={styles.actionGradient}
			>
				<View style={[styles.iconContainer, { backgroundColor: `${color}30` }]}>
					<MaterialIcons name={icon} size={24} color={color} />
				</View>
				<Text style={[styles.actionTitle, isDarkMode && styles.darkText]}>
					{title}
				</Text>
			</LinearGradient>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	actionCard: {
		flex: 1,
		minWidth: "45%",
		backgroundColor: "white",
		borderRadius: 16,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
	},
	darkCard: {
		backgroundColor: "#2D3436",
	},
	actionGradient: {
		padding: 16,
		alignItems: "center",
		height: 120,
		justifyContent: "center",
	},
	iconContainer: {
		width: 56,
		height: 56,
		borderRadius: 28,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 12,
	},
	actionTitle: {
		fontSize: 15,
		fontWeight: "600",
		color: "#2D3436",
		textAlign: "center",
	},
	darkText: {
		color: "#FFFFFF",
	},
});

export default QuickAction;
