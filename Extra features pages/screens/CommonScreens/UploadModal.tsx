import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Modal,
	TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const UploadModal = ({
	visible,
	onClose,
	onSubmit,
	iconColor = "#4A90E2", // Color for all icons
	cardColor = "#F8FAFC", // Background color for cards/methods
	buttonColor = "#4A90E2", // Color for primary buttons
	textColor = "#2C3E50", // Color for all text
}) => {
	const [uploadMethod, setUploadMethod] = useState(null);

	const renderUploadContent = () => {
		if (!uploadMethod) {
			return (
				<View style={styles.uploadMethodsContainer}>
					<TouchableOpacity
						style={[styles.uploadMethod, { backgroundColor: cardColor }]}
						onPress={() => setUploadMethod("document")}
					>
						<MaterialIcons name="file-upload" size={24} color={iconColor} />
						<Text style={[styles.uploadMethodText, { color: textColor }]}>
							Upload from Document
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.uploadMethod, { backgroundColor: cardColor }]}
						onPress={() => setUploadMethod("link")}
					>
						<MaterialIcons name="link" size={24} color={iconColor} />
						<Text style={[styles.uploadMethodText, { color: textColor }]}>
							Upload via Link
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.uploadMethod, { backgroundColor: cardColor }]}
						onPress={() => setUploadMethod("text")}
					>
						<MaterialIcons name="edit" size={24} color={iconColor} />
						<Text style={[styles.uploadMethodText, { color: textColor }]}>
							Write or Copy/Paste
						</Text>
					</TouchableOpacity>
				</View>
			);
		}

		switch (uploadMethod) {
			case "document":
				return (
					<View style={styles.uploadContent}>
						<MaterialIcons name="file-upload" size={48} color={iconColor} />
						<Text style={[styles.uploadInstructions, { color: textColor }]}>
							Select a document from your device
						</Text>
						<TouchableOpacity
							style={[
								styles.fileSelectButton,
								{ backgroundColor: buttonColor },
							]}
						>
							<Text style={styles.fileSelectText}>Choose File</Text>
						</TouchableOpacity>
					</View>
				);

			case "link":
				return (
					<View style={styles.uploadContent}>
						<TextInput
							style={[
								styles.linkInput,
								{ backgroundColor: cardColor, color: textColor },
							]}
							placeholder="Enter URL here..."
							placeholderTextColor={textColor + "80"}
						/>
					</View>
				);

			case "text":
				return (
					<View style={styles.uploadContent}>
						<TextInput
							style={[
								styles.textInput,
								{ backgroundColor: cardColor, color: textColor },
							]}
							placeholder="Write or paste your content here..."
							placeholderTextColor={textColor + "80"}
							multiline
							textAlignVertical="top"
						/>
					</View>
				);
		}
	};

	const handleSubmit = () => {
		onSubmit();
		setUploadMethod(null);
	};

	return (
		<Modal visible={visible} animationType="slide" transparent={true}>
			<View style={styles.modalOverlay}>
				<View style={[styles.modalContent, { backgroundColor: cardColor }]}>
					<View style={styles.modalHeader}>
						<Text style={[styles.modalTitle, { color: textColor }]}>
							{uploadMethod ? "Upload Content" : "Choose Upload Method"}
						</Text>
						<TouchableOpacity
							style={styles.closeButton}
							onPress={() => {
								onClose();
								setUploadMethod(null);
							}}
						>
							<MaterialIcons name="close" size={24} color={iconColor} />
						</TouchableOpacity>
					</View>

					{renderUploadContent()}

					{uploadMethod && (
						<View style={styles.modalFooter}>
							<TouchableOpacity
								style={[styles.backButton, { backgroundColor: cardColor }]}
								onPress={() => setUploadMethod(null)}
							>
								<Text style={[styles.backButtonText, { color: textColor }]}>
									Back
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[styles.submitButton, { backgroundColor: buttonColor }]}
								onPress={handleSubmit}
							>
								<Text style={styles.submitButtonText}>Submit</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.8)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		backgroundColor: "white",
		borderRadius: 20,
		width: "90%",
		maxHeight: "80%",
		padding: 20,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
	},
	closeButton: {
		padding: 5,
	},
	uploadMethodsContainer: {
		flexDirection: "column",
		gap: 15,
	},
	uploadMethod: {
		flexDirection: "row",
		alignItems: "center",
		padding: 15,
		borderRadius: 12,
	},
	uploadMethodText: {
		marginLeft: 15,
		fontSize: 16,
		fontWeight: "600",
	},
	uploadContent: {
		alignItems: "center",
		padding: 20,
	},
	uploadInstructions: {
		textAlign: "center",
		marginVertical: 15,
	},
	fileSelectButton: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 8,
		marginTop: 10,
	},
	fileSelectText: {
		color: "white",
		fontWeight: "600",
	},
	linkInput: {
		width: "100%",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
	},
	textInput: {
		width: "100%",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		height: 200,
	},
	modalFooter: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: 20,
		gap: 10,
	},
	backButton: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 8,
	},
	backButtonText: {
		fontWeight: "600",
	},
	submitButton: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 8,
	},
	submitButtonText: {
		color: "white",
		fontWeight: "600",
	},
});

export default UploadModal;
