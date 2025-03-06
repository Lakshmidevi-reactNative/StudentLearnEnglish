// LSRTPW --> VIEWER UPLOAD CARDS
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const ContentCard = ({
	content,
	onView,
	onDelete,
	icon,
	bgcolor,
	iconcolor,
	viewbg,
	titlecolor,
}) => {
	return (
		<View style={[styles.contentCard, { backgroundColor: bgcolor }]}>
			<View style={styles.contentMain}>
				<View style={[styles.contentIcon, { backgroundColor: bgcolor }]}>
					<MaterialIcons name={icon} size={24} color={iconcolor} />
				</View>

				<View style={styles.contentInfo}>
					<Text style={[styles.contentTitle, { color: titlecolor }]}>
						{content.title}
					</Text>
					<View style={styles.contentMeta}>
						<View
							style={{ backgroundColor: viewbg, padding: 5, borderRadius: 5 }}
						>
							<Text style={(styles.levelText, { color: iconcolor })}>
								{content.level}
							</Text>
						</View>

						<Text style={styles.duration}>
							<MaterialIcons name="access-time" size={14} color="#666" />{" "}
							{content.duration}
						</Text>
					</View>
					<View style={styles.contentDetails}>
						<Text style={[styles.sourceText, { color: titlecolor }]}>
							{content.source}
						</Text>
						<Text style={[styles.dateText, { color: titlecolor }]}>
							{content.date}
						</Text>
					</View>
				</View>
			</View>

			<View style={styles.actionButtons}>
				<TouchableOpacity
					style={[styles.actionButton, styles.deleteButton]}
					onPress={() => onDelete(content.id)}
				>
					<MaterialIcons name="delete" size={20} color="#EF4444" />
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.actionButton,
						styles.viewButton,
						{ backgroundColor: viewbg }, // Apply the background color here
					]}
					onPress={() => onView(content.id)}
				>
					<MaterialIcons name={icon} size={20} color={iconcolor} />
					<Text style={[styles.actionText, { color: iconcolor }]}>View</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	contentCard: {
		backgroundColor: "#fff",
		borderRadius: 15,
		padding: 15,
		marginBottom: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	contentMain: {
		flexDirection: "row",
		marginBottom: 15,
	},
	contentIcon: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 15,
	},
	contentInfo: {
		flex: 1,
	},
	contentTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#2C3E50",
		marginBottom: 8,
	},
	contentMeta: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},

	levelText: {
		fontSize: 10,
		fontWeight: "500",
	},
	duration: {
		color: "#666",
		fontSize: 12,
	},
	contentDetails: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	sourceText: {
		color: "#666",
		fontSize: 12,
	},
	dateText: {
		color: "#666",
		fontSize: 12,
	},
	actionButtons: {
		flexDirection: "row",
		borderTopWidth: 1,
		borderTopColor: "#EDF2F7",
		paddingTop: 15,
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 8,
		borderRadius: 8,
		marginHorizontal: 5,
	},
	viewButton: {
		flex: 1,
	},
	deleteButton: {
		// backgroundColor: "#FEE2E2",
	},
	actionText: {
		marginLeft: 8,
		fontSize: 14,
		fontWeight: "600",
	},

	deleteText: {
		color: "#EF4444",
	},
});

export default ContentCard;
