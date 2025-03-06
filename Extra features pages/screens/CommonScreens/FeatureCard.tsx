import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const FeatureCard = ({ feature }) => {
	const { title, description, icon, color, progress, onPress } = feature;

	const renderProgressBar = (progress) => (
		<View style={styles.progressBarContainer}>
			<View
				style={[
					styles.progressBar,
					{ width: `${progress}%`, backgroundColor: color },
				]}
			/>
		</View>
	);

	return (
		<TouchableOpacity style={styles.featureCard} onPress={onPress}>
			<LinearGradient
				colors={[color + "20", color + "10"]}
				style={styles.featureGradient}
			>
				<View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
					<MaterialIcons name={icon} size={28} color={color} />
				</View>
				<View style={styles.featureContent}>
					<Text style={styles.featureTitle}>{title}</Text>
					<Text style={styles.featureDescription}>{description}</Text>
					{/* <View style={styles.progressSection}>
						<Text style={[styles.progressText, { color: color }]}>
							Progress: {progress}%
						</Text>
						{renderProgressBar(progress)}
					</View> */}
				</View>
				<MaterialIcons name="chevron-right" size={24} color={color} />
			</LinearGradient>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	featureCard: {
		marginBottom: 15,
		borderRadius: 16,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	featureGradient: {
		flexDirection: "row",
		alignItems: "center",
		padding: 15,
		backgroundColor: "white",
	},
	iconContainer: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 15,
	},
	featureContent: {
		flex: 1,
		marginRight: 10,
	},
	featureTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2D3748",
		marginBottom: 4,
	},
	featureDescription: {
		fontSize: 14,
		color: "#718096",
		marginBottom: 8,
	},
	progressSection: {
		marginTop: 4,
	},
	progressText: {
		fontSize: 12,
		fontWeight: "600",
		marginBottom: 4,
	},
	progressBarContainer: {
		height: 4,
		backgroundColor: "#E2E8F0",
		borderRadius: 2,
		overflow: "hidden",
	},
	progressBar: {
		height: "100%",
		borderRadius: 2,
	},
});

export default FeatureCard;
