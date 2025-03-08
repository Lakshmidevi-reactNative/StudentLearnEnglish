import React, { useState, useRef, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image,
	Platform,
	FlatList,
	Modal,
	TextInput,
	KeyboardAvoidingView,
	ActivityIndicator,
	Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	MaterialCommunityIcons,
	FontAwesome5,
	Ionicons,
	MaterialIcons,
	Feather,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as DocumentPicker from "expo-document-picker";
import * as Clipboard from "expo-clipboard";
import {
	processFileUpload,
	processUrlUpload,
	processTextContent,
	ContentAnalysis,
} from "../services/PythonApis";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Theme colors
const COLORS = {
	deepBlue: "#0B1033",
	softPurple: "#302253",
	neonBlue: "#00B4FF",
	neonPurple: "#B026FF",
	neonGreen: "#39FF14",
	neonOrange: "#FF6B35",
	neonPink: "#FF00FF",
	neonYellow: "#FFD700",
	textPrimary: "#FFFFFF",
	textSecondary: "#CCCCCC",
	cardBg: "rgba(255, 255, 255, 0.06)",
	cardBorder: "rgba(255, 255, 255, 0.1)",
	modalBg: "rgba(11, 16, 51, 0.95)",
	inputBg: "rgba(255, 255, 255, 0.08)",
};

// Enhanced ContentItem interface to include level and text properties
interface ContentItem {
	id: string;
	title: string;
	description: string;
	type: string;
	date: string;
	size: string;
	thumbnail?: string;
	url?: string;
	level?: string;
	text?: string;
}

export default function ContentListTemplate() {
	const navigation = useNavigation<any>(); // Added type for navigation
	const [contents, setContents] = useState<ContentItem[]>([
		{
			id: "1",
			title: "English Grammar Basics",
			description: "Learn the fundamentals of English grammar",
			type: "PDF",
			date: "2025-03-01",
			size: "4.2 MB",
			thumbnail:
				"https://api.a0.dev/assets/image?text=English%20Grammar&aspect=1:1&seed=123",
		},
		{
			id: "2",
			title: "Vocabulary Practice",
			description: "Expand your vocabulary with these exercises",
			type: "DOCX",
			date: "2025-02-28",
			size: "1.7 MB",
			thumbnail:
				"https://api.a0.dev/assets/image?text=Vocabulary&aspect=1:1&seed=456",
		},
		{
			id: "3",
			title: "Conversational Practice",
			description: "Audio lessons for improving conversation skills",
			type: "MP3",
			date: "2025-02-25",
			size: "12.5 MB",
			thumbnail:
				"https://api.a0.dev/assets/image?text=Conversation&aspect=1:1&seed=789",
		},
	]);

	// States for upload modals
	const [uploadMethodModalVisible, setUploadMethodModalVisible] =
		useState(false);
	const [urlModalVisible, setUrlModalVisible] = useState(false);
	const [textEditorModalVisible, setTextEditorModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("Processing...");
	const [studentId, setStudentId] = useState<number>(3063); // Default student ID

	// States for user inputs
	const [url, setUrl] = useState("");
	const [pastedText, setPastedText] = useState("");
	const [contentTitle, setContentTitle] = useState("");
	const [contentDescription, setContentDescription] = useState("");

	// Load student ID from storage on component mount
	useEffect(() => {
		const loadStudentId = async () => {
			try {
				const storedId = await AsyncStorage.getItem("studentId");
				if (storedId) {
					setStudentId(parseInt(storedId, 10));
				}
			} catch (error) {
				console.error("Error loading student ID:", error);
			}
		};

		loadStudentId();
	}, []);

	const goBack = () => {
		navigation.navigate("LearnMain");
	};

	// Show upload method selection modal
	const showUploadOptions = () => {
		setUploadMethodModalVisible(true);
	};

	// Handle document upload from device
	const handleDocumentUpload = async () => {
		setUploadMethodModalVisible(false);
		setIsLoading(true);
		setLoadingMessage("Selecting file...");

		try {
			// Step 1: Pick document
			const result = await DocumentPicker.getDocumentAsync({
				type: "*/*",
				copyToCacheDirectory: true,
			});

			if (result.canceled) {
				setIsLoading(false);
				return;
			}

			// Process the first selected file
			const file = result.assets[0];
			const fileUri = file.uri;
			const fileName = file.name.split(".")[0];

			setLoadingMessage("Processing file...");

			// Use the processFileUpload function from your API service with student ID
			const contentAnalysis = await processFileUpload(fileUri, fileName, studentId);

			// Create a content item from the analysis result
			const fileType = file.mimeType?.split("/")[1]?.toUpperCase() || "FILE";

			const newContent: ContentItem = {
				id: Date.now().toString(),
				title: contentAnalysis.title,
				description:
					contentAnalysis.text.substring(0, 100) +
					(contentAnalysis.text.length > 100 ? "..." : ""),
				type: fileType,
				date: new Date().toISOString().split("T")[0],
				size: file.size
					? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
					: "Unknown size",
				level: contentAnalysis.level,
				url: contentAnalysis.url,
				text: contentAnalysis.text,
				thumbnail: `https://api.a0.dev/assets/image?text=${fileType}&aspect=1:1&seed=${Math.floor(
					Math.random() * 1000
				)}`,
			};

			// Update the contents state
			setContents([newContent, ...contents]);
			setIsLoading(false);

			// Show success message with detected level
			Alert.alert(
				"Upload Successful",
				`Content uploaded successfully!\nLanguage Level: ${contentAnalysis.level}`
			);
		} catch (error) {
			console.error("Error uploading file:", error);
			Alert.alert(
				"Upload Failed",
				"There was an error processing your file. Please try again."
			);
			setIsLoading(false);
		}
	};

	// Determine content type from URL
	const getUrlType = (url: string): string => {
		const extension = url.split(".").pop()?.toLowerCase();

		if (!extension) return "LINK";

		switch (extension) {
			case "pdf":
				return "PDF";
			case "doc":
			case "docx":
				return "DOCX";
			case "ppt":
			case "pptx":
				return "PPT";
			case "xls":
			case "xlsx":
				return "XLS";
			case "mp3":
			case "wav":
				return "AUDIO";
			case "mp4":
			case "mov":
				return "VIDEO";
			case "jpg":
			case "jpeg":
			case "png":
				return "IMAGE";
			default:
				return "LINK";
		}
	};

	// Open URL upload modal
	const openUrlUpload = () => {
		setUploadMethodModalVisible(false);
		setUrl("");
		setContentTitle("");
		setContentDescription("");
		setUrlModalVisible(true);
	};

	// Handle URL upload
	const handleUrlUpload = async () => {
		if (!url.trim()) {
			Alert.alert("Error", "Please enter a valid URL");
			return;
		}

		if (!contentTitle.trim()) {
			Alert.alert("Error", "Please enter a title for the content");
			return;
		}

		setIsLoading(true);
		setUrlModalVisible(false);
		setLoadingMessage("Processing URL...");

		// Validate URL
		try {
			new URL(url);
		} catch (e) {
			Alert.alert("Error", "Please enter a valid URL");
			setIsLoading(false);
			return;
		}

		try {
			// Use the processUrlUpload function from your API service with student ID
			const contentAnalysis = await processUrlUpload(url, contentTitle, studentId);

			// Create a content item from the analysis result
			const urlType = getUrlType(url);

			const newContent: ContentItem = {
				id: Date.now().toString(),
				title: contentAnalysis.title,
				description:
					contentDescription ||
					contentAnalysis.text.substring(0, 100) +
						(contentAnalysis.text.length > 100 ? "..." : ""),
				type: urlType,
				date: new Date().toISOString().split("T")[0],
				size: "Web Link",
				level: contentAnalysis.level,
				url: contentAnalysis.url,
				text: contentAnalysis.text,
				thumbnail: `https://api.a0.dev/assets/image?text=${urlType}&aspect=1:1&seed=${Math.floor(
					Math.random() * 1000
				)}`,
			};

			// Update the contents state
			setContents([newContent, ...contents]);
			setIsLoading(false);

			// Show success message with detected level
			Alert.alert(
				"Import Successful",
				`Content imported successfully!\nLanguage Level: ${contentAnalysis.level}`
			);
		} catch (error) {
			console.error("Error importing URL:", error);
			Alert.alert(
				"Import Failed",
				"There was an error processing the URL. Please try again."
			);
			setIsLoading(false);
		}
	};

	// Open text editor modal
	const openTextEditor = () => {
		setUploadMethodModalVisible(false);
		setPastedText("");
		setContentTitle("");
		setContentDescription("");
		setTextEditorModalVisible(true);
	};

	// Handle text content upload
	const handleTextUpload = async () => {
		if (!pastedText.trim()) {
			Alert.alert("Error", "Please enter some text content");
			return;
		}

		if (!contentTitle.trim()) {
			Alert.alert("Error", "Please enter a title for the content");
			return;
		}

		setIsLoading(true);
		setTextEditorModalVisible(false);
		setLoadingMessage("Analyzing content...");

		try {
			// Use the processTextContent function from your API service with student ID
			const contentAnalysis = await processTextContent(
				pastedText,
				contentTitle,
				studentId
			);

			// Calculate approximate size - using safer approach for React Native
			const bytes = new TextEncoder().encode(pastedText).length;
			const sizeDisplay =
				bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;

			// Create a new content item
			const newContent: ContentItem = {
				id: Date.now().toString(),
				title: contentAnalysis.title,
				description:
					contentDescription ||
					contentAnalysis.text.substring(0, 100) +
						(contentAnalysis.text.length > 100 ? "..." : ""),
				type: "TXT",
				date: new Date().toISOString().split("T")[0],
				size: sizeDisplay,
				level: contentAnalysis.level,
				text: contentAnalysis.text,
				thumbnail: `https://api.a0.dev/assets/image?text=TXT&aspect=1:1&seed=${Math.floor(
					Math.random() * 1000
				)}`,
			};

			// Update the contents state
			setContents([newContent, ...contents]);
			setIsLoading(false);

			// Show success message with detected level
			Alert.alert(
				"Content Created",
				`Text content saved successfully!\nLanguage Level: ${contentAnalysis.level}`
			);
		} catch (error) {
			console.error("Error processing text:", error);
			Alert.alert(
				"Processing Failed",
				"There was an error analyzing your text. Please try again."
			);
			setIsLoading(false);
		}
	};

	// Clipboard paste implementation using expo-clipboard
	const pasteFromClipboard = async () => {
		try {
			const hasString = await Clipboard.hasStringAsync();
			if (hasString) {
				const text = await Clipboard.getStringAsync();
				setPastedText(text);
			} else {
				Alert.alert(
					"Paste Text",
					"Please manually paste your text in the input field.",
					[{ text: "OK" }]
				);
			}
		} catch (error) {
			console.error("Error accessing clipboard:", error);
			Alert.alert("Error", "Could not access clipboard.");
		}
	};

	const renderContentItem = ({ item }: { item: ContentItem }) => (
		<Animated.View entering={FadeInDown.delay(200).duration(600)}>
			<TouchableOpacity style={styles.contentCard}>
				<View style={styles.contentImageContainer}>
					{item.thumbnail ? (
						<Image
							source={{ uri: item.thumbnail }}
							style={styles.contentThumbnail}
						/>
					) : (
						<View
							style={[
								styles.contentThumbnailPlaceholder,
								{ backgroundColor: `${COLORS.neonBlue}20` },
							]}
						>
							<Text style={styles.contentTypeBadge}>{item.type}</Text>
						</View>
					)}
				</View>
				<View style={styles.contentDetails}>
					<Text style={styles.contentTitle}>{item.title}</Text>
					<Text style={styles.contentDescription} numberOfLines={1}>
						{item.description}
					</Text>
					<View style={styles.contentMeta}>
						<View style={styles.contentMetaItem}>
							<MaterialCommunityIcons
								name="calendar"
								size={14}
								color={COLORS.textSecondary}
							/>
							<Text style={styles.contentMetaText}>{item.date}</Text>
						</View>
						<View style={styles.contentMetaItem}>
							<MaterialCommunityIcons
								name="file-outline"
								size={14}
								color={COLORS.textSecondary}
							/>
							<Text style={styles.contentMetaText}>{item.size}</Text>
						</View>
						<View
							style={[
								styles.typeBadge,
								{ backgroundColor: `${COLORS.neonBlue}20` },
							]}
						>
							<Text style={[styles.typeText, { color: COLORS.neonBlue }]}>
								{item.type}
							</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</Animated.View>
	);

	return (
		<LinearGradient
			colors={[COLORS.deepBlue, COLORS.softPurple]}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.header}>
					<TouchableOpacity onPress={goBack} style={styles.backButton}>
						<MaterialCommunityIcons
							name="arrow-left"
							size={28}
							color={COLORS.textPrimary}
						/>
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Learning Content</Text>
					<View style={{ width: 28 }} />
				</View>

				<View style={styles.mainContainer}>
					<View style={styles.uploadSection}>
						<Text style={styles.sectionTitle}>My Content</Text>
						<TouchableOpacity
							style={styles.uploadButton}
							onPress={showUploadOptions}
						>
							<Ionicons
								name="cloud-upload-outline"
								size={20}
								color={COLORS.textPrimary}
							/>
							<Text style={styles.uploadButtonText}>Upload</Text>
						</TouchableOpacity>
					</View>

					{contents.length === 0 ? (
						<View style={styles.emptyContainer}>
							<FontAwesome5
								name="file-upload"
								size={50}
								color={COLORS.textSecondary}
								style={styles.emptyIcon}
							/>
							<Text style={styles.emptyText}>No content uploaded yet</Text>
							<Text style={styles.emptySubtext}>
								Tap the upload button to add your learning materials
							</Text>
						</View>
					) : (
						<FlatList
							data={contents}
							renderItem={renderContentItem}
							keyExtractor={(item) => item.id}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.contentsList}
						/>
					)}
				</View>
			</SafeAreaView>

			{/* Floating action button for quick upload */}
			<TouchableOpacity
				style={styles.floatingButton}
				onPress={showUploadOptions}
			>
				<LinearGradient
					colors={[COLORS.neonBlue, COLORS.neonPurple]}
					style={styles.floatingButtonGradient}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
				>
					<Ionicons name="add" size={30} color={COLORS.textPrimary} />
				</LinearGradient>
			</TouchableOpacity>

			{/* Upload Method Modal */}
			<Modal
				animationType="fade"
				transparent={true}
				visible={uploadMethodModalVisible}
				onRequestClose={() => setUploadMethodModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<Animated.View
						entering={FadeInDown.duration(300)}
						style={styles.modalContent}
					>
						<Text style={styles.modalTitle}>Choose Upload Method</Text>

						<TouchableOpacity
							style={styles.uploadOption}
							onPress={handleDocumentUpload}
						>
							<View
								style={[
									styles.uploadOptionIcon,
									{ backgroundColor: `${COLORS.neonBlue}30` },
								]}
							>
								<MaterialIcons
									name="file-upload"
									size={24}
									color={COLORS.neonBlue}
								/>
							</View>
							<View style={styles.uploadOptionTextContainer}>
								<Text style={styles.uploadOptionTitle}>Device Files</Text>
								<Text style={styles.uploadOptionDescription}>
									Upload documents from your device storage
								</Text>
							</View>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.uploadOption}
							onPress={openUrlUpload}
						>
							<View
								style={[
									styles.uploadOptionIcon,
									{ backgroundColor: `${COLORS.neonGreen}30` },
								]}
							>
								<Feather name="link" size={24} color={COLORS.neonGreen} />
							</View>
							<View style={styles.uploadOptionTextContainer}>
								<Text style={styles.uploadOptionTitle}>Web URL</Text>
								<Text style={styles.uploadOptionDescription}>
									Import content from a web link
								</Text>
							</View>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.uploadOption}
							onPress={openTextEditor}
						>
							<View
								style={[
									styles.uploadOptionIcon,
									{ backgroundColor: `${COLORS.neonPurple}30` },
								]}
							>
								<MaterialCommunityIcons
									name="text-box"
									size={24}
									color={COLORS.neonPurple}
								/>
							</View>
							<View style={styles.uploadOptionTextContainer}>
								<Text style={styles.uploadOptionTitle}>Text Editor</Text>
								<Text style={styles.uploadOptionDescription}>
									Paste or type content directly
								</Text>
							</View>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.cancelButton}
							onPress={() => setUploadMethodModalVisible(false)}
						>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>
					</Animated.View>
				</View>
			</Modal>

			{/* URL Upload Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={urlModalVisible}
				onRequestClose={() => setUrlModalVisible(false)}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.modalOverlay}
				>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Import from URL</Text>

						<Text style={styles.inputLabel}>URL</Text>
						<TextInput
							style={styles.textInput}
							value={url}
							onChangeText={setUrl}
							placeholder="https://example.com/content"
							placeholderTextColor={COLORS.textSecondary}
							autoCapitalize="none"
							autoCorrect={false}
							keyboardType="url"
						/>

						<Text style={styles.inputLabel}>Title</Text>
						<TextInput
							style={styles.textInput}
							value={contentTitle}
							onChangeText={setContentTitle}
							placeholder="Give your content a title"
							placeholderTextColor={COLORS.textSecondary}
						/>

						<Text style={styles.inputLabel}>Description (Optional)</Text>
						<TextInput
							style={styles.textInput}
							value={contentDescription}
							onChangeText={setContentDescription}
							placeholder="Add a short description"
							placeholderTextColor={COLORS.textSecondary}
							multiline
							numberOfLines={2}
						/>

						<View style={styles.modalButtonRow}>
							<TouchableOpacity
								style={[styles.modalButton, styles.modalCancelButton]}
								onPress={() => setUrlModalVisible(false)}
								disabled={isLoading}
							>
								<Text style={styles.modalButtonText}>Cancel</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[styles.modalButton, styles.modalConfirmButton]}
								onPress={handleUrlUpload}
								disabled={isLoading}
							>
								{isLoading ? (
									<ActivityIndicator color={COLORS.textPrimary} size="small" />
								) : (
									<Text style={styles.modalButtonText}>Import</Text>
								)}
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAvoidingView>
			</Modal>

			{/* Text Editor Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={textEditorModalVisible}
				onRequestClose={() => setTextEditorModalVisible(false)}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.modalOverlay}
				>
					<View style={[styles.modalContent, styles.textEditorModal]}>
						<Text style={styles.modalTitle}>Create Text Content</Text>

						<TouchableOpacity
							style={styles.pasteButton}
							onPress={pasteFromClipboard}
						>
							<MaterialIcons
								name="content-paste"
								size={18}
								color={COLORS.textPrimary}
							/>
							<Text style={styles.pasteButtonText}>Paste from Clipboard</Text>
						</TouchableOpacity>

						<Text style={styles.inputLabel}>Content</Text>
						<TextInput
							style={[styles.textInput, styles.textAreaInput]}
							value={pastedText}
							onChangeText={setPastedText}
							placeholder="Type or paste your content here..."
							placeholderTextColor={COLORS.textSecondary}
							multiline
							numberOfLines={8}
							textAlignVertical="top"
						/>

						<Text style={styles.inputLabel}>Title</Text>
						<TextInput
							style={styles.textInput}
							value={contentTitle}
							onChangeText={setContentTitle}
							placeholder="Give your content a title"
							placeholderTextColor={COLORS.textSecondary}
						/>

						<Text style={styles.inputLabel}>Description (Optional)</Text>
						<TextInput
							style={styles.textInput}
							value={contentDescription}
							onChangeText={setContentDescription}
							placeholder="Add a short description"
							placeholderTextColor={COLORS.textSecondary}
						/>

						<View style={styles.modalButtonRow}>
							<TouchableOpacity
								style={[styles.modalButton, styles.modalCancelButton]}
								onPress={() => setTextEditorModalVisible(false)}
								disabled={isLoading}
							>
								<Text style={styles.modalButtonText}>Cancel</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[styles.modalButton, styles.modalConfirmButton]}
								onPress={handleTextUpload}
								disabled={isLoading}
							>
								{isLoading ? (
									<ActivityIndicator color={COLORS.textPrimary} size="small" />
								) : (
									<Text style={styles.modalButtonText}>Save</Text>
								)}
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAvoidingView>
			</Modal>

			{/* Loading Overlay */}
			{isLoading && !urlModalVisible && !textEditorModalVisible && (
				<View style={styles.loadingOverlay}>
					<ActivityIndicator size="large" color={COLORS.neonBlue} />
					<Text style={styles.loadingText}>{loadingMessage}</Text>
				</View>
			)}
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: Platform.OS === "ios" ? 10 : 40,
		paddingBottom: 15,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		justifyContent: "center",
		alignItems: "center",
	},
	headerTitle: {
		color: COLORS.textPrimary,
		fontSize: 22,
		fontWeight: "700",
		textShadowColor: COLORS.neonBlue,
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 10,
	},
	mainContainer: {
		flex: 1,
		paddingHorizontal: 20,
	},
	uploadSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 15,
	},
	sectionTitle: {
		color: COLORS.textPrimary,
		fontSize: 20,
		fontWeight: "700",
	},
	uploadButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
	},
	uploadButtonText: {
		color: COLORS.textPrimary,
		marginLeft: 8,
		fontWeight: "600",
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 40,
	},
	emptyIcon: {
		marginBottom: 20,
		opacity: 0.7,
	},
	emptyText: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 10,
		textAlign: "center",
	},
	emptySubtext: {
		color: COLORS.textSecondary,
		fontSize: 14,
		textAlign: "center",
		lineHeight: 20,
	},
	contentsList: {
		paddingBottom: 100, // Extra space for floating button
	},
	contentCard: {
		backgroundColor: COLORS.cardBg,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
		flexDirection: "row",
		overflow: "hidden",
		marginBottom: 16,
	},
	contentImageContainer: {
		width: 90,
		height: 90,
		justifyContent: "center",
		alignItems: "center",
	},
	contentThumbnail: {
		width: 90,
		height: 90,
		resizeMode: "cover",
	},
	contentThumbnailPlaceholder: {
		width: 90,
		height: 90,
		justifyContent: "center",
		alignItems: "center",
	},
	contentTypeBadge: {
		color: COLORS.textPrimary,
		fontWeight: "bold",
	},
	contentDetails: {
		flex: 1,
		padding: 12,
		justifyContent: "space-between",
	},
	contentTitle: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 4,
	},
	contentDescription: {
		color: COLORS.textSecondary,
		fontSize: 14,
		marginBottom: 8,
	},
	contentMeta: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
	},
	contentMetaItem: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 12,
	},
	contentMetaText: {
		color: COLORS.textSecondary,
		fontSize: 12,
		marginLeft: 4,
	},
	typeBadge: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 10,
	},
	typeText: {
		fontSize: 10,
		fontWeight: "bold",
	},
	floatingButton: {
		position: "absolute",
		bottom: 30,
		right: 30,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 5,
	},
	floatingButtonGradient: {
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
	},

	// Modal styles
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	modalContent: {
		backgroundColor: COLORS.modalBg,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
		padding: 24,
		width: "100%",
		maxWidth: 500,
	},
	textEditorModal: {
		maxHeight: "90%",
	},
	modalTitle: {
		color: COLORS.textPrimary,
		fontSize: 20,
		fontWeight: "700",
		marginBottom: 20,
		textAlign: "center",
	},
	uploadOption: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		padding: 16,
		borderRadius: 12,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.08)",
	},
	uploadOptionIcon: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	uploadOptionTextContainer: {
		flex: 1,
	},
	uploadOptionTitle: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 4,
	},
	uploadOptionDescription: {
		color: COLORS.textSecondary,
		fontSize: 14,
	},
	cancelButton: {
		alignItems: "center",
		paddingVertical: 12,
		marginTop: 8,
	},
	cancelButtonText: {
		color: COLORS.textSecondary,
		fontSize: 16,
		fontWeight: "500",
	},
	inputLabel: {
		color: COLORS.textSecondary,
		fontSize: 14,
		marginBottom: 8,
		marginTop: 16,
	},
	textInput: {
		backgroundColor: COLORS.inputBg,
		borderRadius: 10,
		padding: 12,
		color: COLORS.textPrimary,
		fontSize: 16,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
	},
	textAreaInput: {
		minHeight: 120,
		textAlignVertical: "top",
	},
	modalButtonRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 24,
	},
	modalButton: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	modalCancelButton: {
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		marginRight: 10,
	},
	modalConfirmButton: {
		backgroundColor: COLORS.neonBlue,
		marginLeft: 10,
	},
	modalButtonText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "600",
	},
	pasteButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		padding: 10,
		borderRadius: 8,
		marginBottom: 16,
	},
	pasteButtonText: {
		color: COLORS.textPrimary,
		marginLeft: 8,
		fontSize: 14,
		fontWeight: "500",
	},
	loadingOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		justifyContent: "center",
		alignItems: "center",
	},
	loadingText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		marginTop: 12,
	},
});
