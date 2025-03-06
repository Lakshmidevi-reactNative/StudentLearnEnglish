// components/PrivateClasses.tsx
import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	Modal,
	TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { toast } from "sonner-native";

const PrivateClasses = ({ handleClassSelect, isDarkMode }) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [classCode, setClassCode] = useState("");
	const [privateClasses, setPrivateClasses] = useState([]);

	const handleJoinClass = () => {
		if (classCode.trim()) {
			const newClass = {
				id: privateClasses.length + 1,
				title: `Class ${classCode}`,
				instructor: "Unknown Instructor",
				nextClass: "Time TBD",
				students: 1,
				progress: 0,
				image:
					"https://api.a0.dev/assets/image?text=Private%20Class&aspect=16:9",
				items: {
					assessments: {
						completed: [],
					},
					assignments: {
						pending: [],
						completed: [],
					},
				},
			};
			setPrivateClasses([...privateClasses, newClass]);
			toast.success("Successfully joined new class!");
			setModalVisible(false);
			setClassCode("");
		} else {
			toast.error("Please enter a valid class code");
		}
	};

	return (
		<View style={styles.container}>
			{/* Join Class Button */}
			<TouchableOpacity
				style={[
					styles.joinClassButton,
					isDarkMode && styles.darkJoinClassButton,
				]}
				onPress={() => setModalVisible(true)}
			>
				<MaterialIcons
					name="add-circle-outline"
					size={24}
					color={isDarkMode ? "#4299e1" : "#1a73e8"}
				/>
				<Text
					style={[
						styles.joinClassButtonText,
						isDarkMode && styles.darkJoinClassButtonText,
					]}
				>
					Join New Class
				</Text>
			</TouchableOpacity>

			{/* Class Cards */}
			<View style={styles.classesContainer}>
				{privateClasses.length > 0 ? (
					privateClasses.map((classItem) => (
						<TouchableOpacity
							key={classItem.id}
							style={[styles.classCard, isDarkMode && styles.darkClassCard]}
							onPress={() => handleClassSelect(classItem)}
						>
							<Image
								source={{ uri: classItem.image }}
								style={styles.classImage}
							/>
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
											<Text style={styles.detailText}>
												{classItem.instructor}
											</Text>
										</View>
										<View style={styles.detailRow}>
											<MaterialIcons name="schedule" size={16} color="white" />
											<Text style={styles.detailText}>
												{classItem.nextClass}
											</Text>
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
					))
				) : (
					<View style={styles.emptyStateContainer}>
						<MaterialIcons
							name="class"
							size={64}
							color={isDarkMode ? "#4a5568" : "#cbd5e0"}
						/>
						<Text
							style={[
								styles.emptyStateText,
								isDarkMode && styles.darkEmptyStateText,
							]}
						>
							No private classes yet
						</Text>
						<Text
							style={[
								styles.emptyStateSubtext,
								isDarkMode && styles.darkEmptyStateSubtext,
							]}
						>
							Join a class using the button above
						</Text>
					</View>
				)}
			</View>

			{/* Join Class Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={[styles.modalView, isDarkMode && styles.darkModalView]}>
						<Text
							style={[styles.modalTitle, isDarkMode && styles.darkModalTitle]}
						>
							Join Private Class
						</Text>
						<Text
							style={[
								styles.modalSubtitle,
								isDarkMode && styles.darkModalSubtitle,
							]}
						>
							Enter the class code provided by your instructor
						</Text>

						<View style={styles.inputContainer}>
							<MaterialIcons
								name="vpn-key"
								size={20}
								color={isDarkMode ? "#718096" : "#4a5568"}
								style={styles.inputIcon}
							/>
							<TextInput
								style={[styles.input, isDarkMode && styles.darkInput]}
								onChangeText={setClassCode}
								value={classCode}
								placeholder="Enter class code"
								placeholderTextColor={isDarkMode ? "#718096" : "#a0aec0"}
							/>
						</View>

						<View style={styles.buttonContainer}>
							<TouchableOpacity
								style={[styles.joinButton, isDarkMode && styles.darkJoinButton]}
								onPress={handleJoinClass}
							>
								<Text style={styles.joinButtonText}>Join Class</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[
									styles.cancelButton,
									isDarkMode && styles.darkCancelButton,
								]}
								onPress={() => setModalVisible(false)}
							>
								<Text
									style={[
										styles.cancelButtonText,
										isDarkMode && styles.darkCancelButtonText,
									]}
								>
									Cancel
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
	},
	joinClassButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#e6f2ff",
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: 12,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	darkJoinClassButton: {
		backgroundColor: "#2d3748",
	},
	joinClassButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1a73e8",
		marginLeft: 8,
	},
	darkJoinClassButtonText: {
		color: "#4299e1",
	},
	classesContainer: {
		gap: 20,
	},
	emptyStateContainer: {
		alignItems: "center",
		justifyContent: "center",
		padding: 40,
		marginTop: 20,
	},
	emptyStateText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#2d3748",
		marginTop: 16,
	},
	darkEmptyStateText: {
		color: "#e2e8f0",
	},
	emptyStateSubtext: {
		fontSize: 14,
		color: "#718096",
		marginTop: 8,
		textAlign: "center",
	},
	darkEmptyStateSubtext: {
		color: "#a0aec0",
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
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalView: {
		width: "85%",
		backgroundColor: "white",
		borderRadius: 16,
		padding: 24,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.25,
		shadowRadius: 16,
		elevation: 10,
	},
	darkModalView: {
		backgroundColor: "#2d3748",
	},
	modalTitle: {
		fontSize: 22,
		fontWeight: "700",
		color: "#1a202c",
		marginBottom: 8,
		textAlign: "center",
	},
	darkModalTitle: {
		color: "#f7fafc",
	},
	modalSubtitle: {
		fontSize: 14,
		color: "#4a5568",
		marginBottom: 24,
		textAlign: "center",
	},
	darkModalSubtitle: {
		color: "#a0aec0",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f7fafc",
		borderRadius: 12,
		paddingHorizontal: 12,
		marginBottom: 24,
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	inputIcon: {
		marginRight: 10,
	},
	input: {
		flex: 1,
		height: 50,
		fontSize: 16,
		color: "#2d3748",
	},
	darkInput: {
		backgroundColor: "#4a5568",
		color: "#f7fafc",
		borderColor: "#718096",
	},
	buttonContainer: {
		gap: 12,
	},
	joinButton: {
		backgroundColor: "#1a73e8",
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 3,
	},
	darkJoinButton: {
		backgroundColor: "#4299e1",
	},
	joinButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
	cancelButton: {
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
		backgroundColor: "#f7fafc",
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	darkCancelButton: {
		backgroundColor: "#2d3748",
		borderColor: "#4a5568",
	},
	cancelButtonText: {
		color: "#4a5568",
		fontSize: 16,
		fontWeight: "600",
	},
	darkCancelButtonText: {
		color: "#a0aec0",
	},
});

export default PrivateClasses;
