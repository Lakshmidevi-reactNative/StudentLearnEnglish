// AssignmentCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../App"; // Import the ThemeContext

const AssignmentCard = ({
	item,
	isPending,
	onStartAssignment,
	onViewCompletedAssignment,
}) => {
	const navigation = useNavigation();
	const { isDarkMode } = useTheme(); // Get the current theme

	// Handle preview button press
	const handlePreview = () => {
		// Navigate to ContentView screen with the assignment data
		navigation.navigate("ContentView", { assignmentData: item });
	};

	// Get the appropriate icon based on assignment type
	const getTypeIcon = (type) => {
		switch (type) {
			case "Typing":
				return "keyboard";
			case "Language":
				return "translate";
			case "RolePlay":
				return "people";
			case "Writing":
				return "edit";
			default:
				return "record-voice-over";
		}
	};

	// Format score as a number with % symbol
	const formatScore = (score) => {
		if (score === undefined || score === null) return "N/A";
		return typeof score === "number" ? `${Math.round(score)}%` : `${score}`;
	};

	return (
		<View
			key={item.id}
			style={[styles.itemCard, isDarkMode && styles.itemCardDark]}
		>
			<View style={styles.itemHeader}>
				<View style={[styles.itemType, isDarkMode && styles.itemTypeDark]}>
					<MaterialIcons
						name={getTypeIcon(item.type)}
						size={20}
						color="#2563EB"
					/>
					<Text style={styles.itemTypeText}>{item.type}</Text>
				</View>
			</View>
			<Text style={[styles.itemTitle, isDarkMode && styles.itemTitleDark]}>
				{item.title}
			</Text>

			{isPending ? (
				// Pending assignment content
				<>
					<View style={styles.dueDateContainer}>
						<MaterialIcons
							name="event"
							size={16}
							color={isDarkMode ? "#999" : "#666"}
						/>
						<Text
							style={[styles.dueDateText, isDarkMode && styles.dueDateTextDark]}
						>
							{" "}
							Due : {item.dueDate || "N/A"}
						</Text>
					</View>
					<View style={styles.view_start}>
						<TouchableOpacity
							style={[styles.actionview, isDarkMode && styles.actionviewDark]}
							onPress={handlePreview}
						>
							<MaterialIcons name="visibility" size={16} color="#38A169" />
							<Text style={{ color: "#38A169" }}>Preview</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.actionButton,
								isDarkMode && styles.actionButtonDark,
							]}
							onPress={() => onStartAssignment(item)}
						>
							<Text style={styles.actionButtonText}>Start Now</Text>
						</TouchableOpacity>
					</View>
				</>
			) : (
				// Completed assignment content
				<>
					<View style={styles.completedInfoContainer}>
						<MaterialIcons name="check-circle" size={16} color="#48BB78" />
						<Text
							style={[
								styles.completedDateText,
								isDarkMode && styles.completedDateTextDark,
							]}
						>
							Completed: {item.completedDate || "N/A"}
						</Text>
						<Text style={styles.scoreText}>
							Score: {formatScore(item.score)}
						</Text>
					</View>
					{item.feedback && (
						<View
							style={[styles.feedbackBox, isDarkMode && styles.feedbackBoxDark]}
						>
							<Text
								style={[
									styles.feedbackText,
									isDarkMode && styles.feedbackTextDark,
								]}
							>
								{item.feedback}
							</Text>
						</View>
					)}
					<TouchableOpacity
						style={[styles.actionButton, styles.viewResultsButton]}
						onPress={() => onViewCompletedAssignment(item)}
					>
						<Text style={styles.actionButtonText}>View Results</Text>
					</TouchableOpacity>
				</>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	itemCard: {
		backgroundColor: "white",
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	itemCardDark: {
		backgroundColor: "#2a2a2a",
		shadowColor: "#000",
		shadowOpacity: 0.3,
	},
	view_start: {
		flexDirection: "row",
		// justifyContent: "space-between",
		justifyContent: "flex-end",
		gap: 10,
	},
	itemHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	itemType: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#EBF5FF",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
	},
	itemTypeDark: {
		backgroundColor: "#1e3a5f", // Darker blue for dark mode
	},
	itemTypeText: {
		color: "#2563EB",
		marginLeft: 6,
		fontSize: 14,
		fontWeight: "600",
	},
	itemTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#1A202C",
		marginBottom: 8,
	},
	itemTitleDark: {
		color: "#ffffff",
	},
	completedInfoContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
		gap: 8,
	},
	completedDateText: {
		color: "#48BB78",
		fontSize: 14,
	},
	completedDateTextDark: {
		color: "#4ADE80", // Brighter green for dark mode
	},
	scoreText: {
		color: "#48BB78",
		fontSize: 14,
		fontWeight: "bold",
	},
	feedbackBox: {
		backgroundColor: "#F7FAFC",
		padding: 12,
		borderRadius: 8,
		marginTop: 10,
	},
	feedbackBoxDark: {
		backgroundColor: "#333333",
	},
	feedbackText: {
		color: "#4A5568",
		fontSize: 14,
		fontStyle: "italic",
	},
	feedbackTextDark: {
		color: "#cbd5e0",
	},
	actionButton: {
		backgroundColor: "#2563EB",
		borderRadius: 8,
		padding: 10,
		marginTop: 10,
		alignItems: "center",
	},
	actionButtonDark: {
		backgroundColor: "#3b82f6", // Slightly brighter blue for dark mode
	},
	actionButtonText: {
		color: "white",
		fontSize: 14,
		fontWeight: "600",
	},
	actionview: {
		borderColor: "#38A169",
		borderWidth: 2,
		color: "black",
		// padding: 8,
		flexDirection: "row",
		borderRadius: 8,
		padding: 10,
		marginTop: 10,
		alignItems: "center", //, Green color for view results
	},
	actionviewDark: {
		borderColor: "#38A169",
		// No changes needed as green outline works well in dark mode too
	},
	viewResultsButton: {
		backgroundColor: "#38A169", // Green color for view results
	},
	dueDateContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 4,
	},
	dueDateText: {
		marginLeft: 5,
		color: "#666",
		fontSize: 14,
	},
	dueDateTextDark: {
		color: "#999",
	},
});

export default AssignmentCard;
