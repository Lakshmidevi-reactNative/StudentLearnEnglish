import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image,
	Platform,
	FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as DocumentPicker from "expo-document-picker";

// Theme colors
const COLORS = {
	deepBlue: "#0B1033",
	softPurple: "#4B0082",
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
};

interface ContentItem {
	id: string;
	title: string;
	description: string;
	type: string;
	date: string;
	size: string;
	thumbnail?: string;
}

export default function ContentListTemplate() {
	const navigation = useNavigation();
	const [contents, setContents] = useState<ContentItem[]>([
		{
			id: "1",
			title: "English Grammar Basics",
			description: "Learn the fundamentals of English grammar",
			type: "PDF",
			date: "2025-03-01",
			size: "4.2 MB",
			thumbnail: "https://api.a0.dev/assets/image?text=English%20Grammar&aspect=1:1&seed=123",
		},
		{
			id: "2",
			title: "Vocabulary Practice",
			description: "Expand your vocabulary with these exercises",
			type: "DOCX",
			date: "2025-02-28",
			size: "1.7 MB",
			thumbnail: "https://api.a0.dev/assets/image?text=Vocabulary&aspect=1:1&seed=456",
		},
		{
			id: "3",
			title: "Conversational Practice",
			description: "Audio lessons for improving conversation skills",
			type: "MP3",
			date: "2025-02-25",
			size: "12.5 MB",
			thumbnail: "https://api.a0.dev/assets/image?text=Conversation&aspect=1:1&seed=789",
		},
	]);

	const goBack = () => {
		navigation.navigate("Learn");
	};

	const handleUpload = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: "*/*",
				copyToCacheDirectory: true,
			});

			if (result.canceled) {
				return;
			}

			// Process the first selected file
			const file = result.assets[0];
			const fileType = file.mimeType?.split("/")[1]?.toUpperCase() || "FILE";
			
			// Create a new content item
			const newContent: ContentItem = {
				id: (contents.length + 1).toString(),
				title: file.name.split(".")[0],
				description: "Newly uploaded content",
				type: fileType,
				date: new Date().toISOString().split("T")[0],
				size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
				thumbnail: `https://api.a0.dev/assets/image?text=${fileType}&aspect=1:1&seed=${Math.floor(Math.random() * 1000)}`,
			};

			// Update the contents state
			setContents([newContent, ...contents]);
		} catch (error) {
			console.error("Error uploading file:", error);
		}
	};

	const renderContentItem = ({ item }: { item: ContentItem }) => (
		<Animated.View entering={FadeInDown.delay(200).duration(600)}>
			<TouchableOpacity style={styles.contentCard}>
				<View style={styles.contentImageContainer}>
					{item.thumbnail ? (
						<Image source={{ uri: item.thumbnail }} style={styles.contentThumbnail} />
					) : (
						<View style={[styles.contentThumbnailPlaceholder, { backgroundColor: `${COLORS.neonBlue}20` }]}>
							<Text style={styles.contentTypeBadge}>{item.type}</Text>
						</View>
					)}
				</View>
				<View style={styles.contentDetails}>
					<Text style={styles.contentTitle}>{item.title}</Text>
					<Text style={styles.contentDescription} numberOfLines={1}>{item.description}</Text>
					<View style={styles.contentMeta}>
						<View style={styles.contentMetaItem}>
							<MaterialCommunityIcons name="calendar" size={14} color={COLORS.textSecondary} />
							<Text style={styles.contentMetaText}>{item.date}</Text>
						</View>
						<View style={styles.contentMetaItem}>
							<MaterialCommunityIcons name="file-outline" size={14} color={COLORS.textSecondary} />
							<Text style={styles.contentMetaText}>{item.size}</Text>
						</View>
						<View style={[styles.typeBadge, { backgroundColor: `${COLORS.neonBlue}20` }]}>
							<Text style={[styles.typeText, { color: COLORS.neonBlue }]}>{item.type}</Text>
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
						<TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
							<Ionicons name="cloud-upload-outline" size={20} color={COLORS.textPrimary} />
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
							keyExtractor={item => item.id}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.contentsList}
						/>
					)}
				</View>
			</SafeAreaView>

			{/* Floating action button for quick upload */}
			<TouchableOpacity style={styles.floatingButton} onPress={handleUpload}>
				<LinearGradient
					colors={[COLORS.neonBlue, COLORS.neonPurple]}
					style={styles.floatingButtonGradient}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
				>
					<Ionicons name="add" size={30} color={COLORS.textPrimary} />
				</LinearGradient>
			</TouchableOpacity>
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
});