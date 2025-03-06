// components/SchoolClasses.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const SchoolClasses = ({ handleClassSelect, isDarkMode }) => {
	const schoolClasses = [
		{
			id: 1,
			title: "Business English",
			instructor: "Sarah Johnson",
			nextClass: "10:00 AM Today",
			students: 12,
			progress: 65,
			image:
				"https://api.a0.dev/assets/image?text=business%20professional%20teaching%20in%20modern%20classroom&aspect=16:9",
			items: {
				assessments: {
					completed: [
						{
							id: 3,
							title: "Professional Email Templates",
							completedDate: "2024-02-15",
							type: "Typing",
							score: 92,
							feedback: "Excellent work on format and tone!",
						},
					],
				},
				assignments: {
					pending: [
						{
							id: 22,
							title: "Business Vocabulary Quiz",
							dueDate: "2024-02-22",
							type: "Language",
						},
					],
					completed: [
						{
							id: 4,
							title: "Business Terms Research",
							completedDate: "2024-02-16",
							type: "RolePlay",
							score: 88,
							feedback: "Good depth of research",
						},
					],
				},
			},
		},
		{
			id: 32,
			title: "IELTS Preparation",
			instructor: "Michael Brown",
			nextClass: "2:30 PM Tomorrow",
			students: 8,
			progress: 45,
			image:
				"https://api.a0.dev/assets/image?text=students%20studying%20for%20exam%20in%20modern%20classroom&aspect=16:9",
			items: {
				assessments: {
					completed: [
						{
							id: 6,
							title: "RolePlay",
							completedDate: "2024-02-14",
							type: "RolePlay",
							score: 88,
							feedback: "Good structure and arguments",
						},
						{
							id: 6,
							title: "RolePlay",
							completedDate: "2024-02-14",
							type: "Language",
							score: 88,
							feedback: "Good structure and arguments",
						},
					],
				},
				assignments: {
					pending: [
						{
							id: 12,
							title: "Advanced Business Writing",
							dueDate: "2024-02-22",
							type: "Typing",
						},
						{
							id: 3,
							title: "Advanced Business RolePlay",
							dueDate: "2024-02-22",
							type: "RolePlay",
						},
						{
							id: 7,
							title: "Advanced Business Language",
							dueDate: "2024-02-22",
							type: "Language",
						},
					],
					completed: [
						{
							id: 4,
							title: "Speed Typing Test",
							completedDate: "2024-02-16",
							type: "Typing",
							score: 88,
							feedback: "Excellent typing speed and accuracy",
						},
						{
							id: 102,
							title: "Advanced Business Writing",
							dueDate: "2024-02-22",
							type: "Typing",
						},
						{
							id: 103,
							title: "Advanced Business RolePlay",
							dueDate: "2024-02-22",
							type: "RolePlay",
						},
						{
							id: 107,
							title: "Advanced Business Language",
							dueDate: "2024-02-22",
							type: "Language",
						},
					],
				},
			},
		},
	];

	return (
		<View style={styles.classesContainer}>
			{schoolClasses.map((classItem) => (
				<TouchableOpacity
					key={classItem.id}
					style={[styles.classCard, isDarkMode && styles.darkClassCard]}
					onPress={() => handleClassSelect(classItem)}
				>
					<Image source={{ uri: classItem.image }} style={styles.classImage} />
					<LinearGradient
						colors={
							isDarkMode
								? ["transparent", "rgba(0,0,0,0.9)"]
								: ["transparent", "rgba(0,0,0,0.8)"]
						}
						style={styles.classOverlay}
					>
						<View style={styles.classContent}>
							<Text style={styles.classTitle}>{classItem.title}</Text>
							<View style={styles.classDetails}>
								<View style={styles.detailRow}>
									<MaterialIcons name="person" size={16} color="white" />
									<Text style={styles.detailText}>{classItem.instructor}</Text>
								</View>
								<View style={styles.detailRow}>
									<MaterialIcons name="schedule" size={16} color="white" />
									<Text style={styles.detailText}>{classItem.nextClass}</Text>
								</View>
								<View style={styles.detailRow}>
									<MaterialIcons name="groups" size={16} color="white" />
									<Text style={styles.detailText}>
										{classItem.students} Students
									</Text>
								</View>
							</View>
							<View style={styles.progressBar}>
								<View
									style={[
										styles.progressFill,
										{ width: `${classItem.progress}%` },
									]}
								/>
							</View>
							<Text style={styles.progressText}>
								{classItem.progress}% Complete
							</Text>
						</View>
					</LinearGradient>
				</TouchableOpacity>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	classesContainer: {
		padding: 20,
		gap: 20,
	},
	classCard: {
		borderRadius: 20,
		overflow: "hidden",
		height: 240,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 5,
	},
	darkClassCard: {
		shadowColor: "#000",
		shadowOpacity: 0.4,
	},
	classImage: {
		width: "100%",
		height: "100%",
	},
	classOverlay: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		padding: 20,
	},
	classContent: {
		gap: 8,
	},
	classTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
	classDetails: {
		gap: 8,
	},
	detailRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	detailText: {
		color: "white",
		fontSize: 14,
	},
	progressBar: {
		height: 6,
		backgroundColor: "rgba(255,255,255,0.2)",
		borderRadius: 3,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: "white",
		borderRadius: 3,
	},
	progressText: {
		color: "white",
		fontSize: 14,
		marginTop: 4,
	},
});

export default SchoolClasses;
