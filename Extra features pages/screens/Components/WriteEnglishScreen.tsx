import React, { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	TextInput,
	ScrollView,
	ActivityIndicator,
	Alert,
	Platform,
	PermissionsAndroid,
	StatusBar,
	Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchImageLibrary } from "react-native-image-picker";
import { useTheme } from "../../App";

// Define the navigation types
type RootStackParamList = {
	Home: undefined;
	WriteEnglish: undefined;
};

type WriteEnglishScreenNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"WriteEnglish"
>;

interface WriteEnglishScreenProps {
	navigation: WriteEnglishScreenNavigationProp;
}

interface ScoreCardProps {
	title: string;
	score: number;
	icon: string;
	color: string;
}

interface AnalysisResponse {
	extracted_text: string;
	handwriting_analysis: {
		legibility: number;
		neatness: number;
		spacing: number;
	};
	text_analysis: {
		grammar_score: number;
		relevance_score: number;
		vocabulary_score: number;
		feedback: string;
	};
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, icon, color }) => {
	const { isDarkMode } = useTheme();
	const formattedScore = Number(score).toFixed(1);

	return (
		<View
			style={[
				styles.scoreCard,
				{
					borderColor: color,
					backgroundColor: isDarkMode ? "#2c2c2c" : "white",
				},
			]}
		>
			<View style={styles.scoreHeader}>
				<View style={styles.scoreTitle}>
					<Text style={[styles.icon, { color }]}>{icon}</Text>
					<Text
						style={[
							styles.scoreTitleText,
							{ color: isDarkMode ? "#ffffff" : "#374151" },
						]}
					>
						{title}
					</Text>
				</View>
				<Text style={[styles.scoreValue, { color }]}>{formattedScore}%</Text>
			</View>
			<View
				style={[
					styles.progressBar,
					{ backgroundColor: isDarkMode ? "#404040" : "#e5e7eb" },
				]}
			>
				<View
					style={[
						styles.progressFill,
						{
							width: `${score}%`,
							backgroundColor: color,
						},
					]}
				/>
			</View>
		</View>
	);
};

const WriteEnglishScreen: React.FC<WriteEnglishScreenProps> = ({
	navigation,
}) => {
	const { isDarkMode } = useTheme();
	const [question, setQuestion] = useState("");
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [analysisResults, setAnalysisResults] =
		useState<AnalysisResponse | null>(null);
	const scrollY = useRef(new Animated.Value(0)).current;

	const HEADER_MAX_HEIGHT = 160;
	const HEADER_MIN_HEIGHT = 70;
	const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

	const themeStyles = {
		light: {
			headcolor: "#074799",
			bgColor: "#F8FAFC",
			textColor: "#1f2937",
			subTextColor: "#6b7280",
			cardBg: "white",
			borderColor: "#d1d5db",
			headerGradient: ["#074799", "#074799"],
			stickyHeaderBg: "rgba(249,250,251,0.97)",
			stickyHeaderTitle: "#074799",
		},
		dark: {
			headcolor: "#1a1a1a",
			bgColor: "#232323",
			textColor: "#ffffff",
			subTextColor: "#9ca3af",
			cardBg: "#2c2c2c",
			borderColor: "#404040",
			headerGradient: ["#1a1a1a", "#1a1a1a"],
			stickyHeaderBg: "rgba(35,35,35,0.95)",
			stickyHeaderTitle: "#FFFFFF",
		},
	};

	const currentTheme = themeStyles[isDarkMode ? "dark" : "light"];

	const headerOpacity = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE],
		outputRange: [1, 0],
		extrapolate: "clamp",
	});

	const stickyHeaderOpacity = scrollY.interpolate({
		inputRange: [HEADER_SCROLL_DISTANCE - 40, HEADER_SCROLL_DISTANCE],
		outputRange: [0, 1],
		extrapolate: "clamp",
	});

	useEffect(() => {
		StatusBar.setBarStyle("light-content");
		if (Platform.OS === "android") {
			StatusBar.setBackgroundColor("transparent");
			StatusBar.setTranslucent(true);
		}
	}, []);

	const requestPermissions = async () => {
		if (Platform.OS === "android") {
			try {
				const permissions = await Promise.all([
					PermissionsAndroid.request(
						PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
						{
							title: "Storage Permission",
							message: "App needs access to your storage to select images",
							buttonNeutral: "Ask Me Later",
							buttonNegative: "Cancel",
							buttonPositive: "OK",
						}
					),
					PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
						title: "Camera Permission",
						message: "App needs access to your camera to take photos",
						buttonNeutral: "Ask Me Later",
						buttonNegative: "Cancel",
						buttonPositive: "OK",
					}),
				]);

				return permissions.every(
					(permission) => permission === PermissionsAndroid.RESULTS.GRANTED
				);
			} catch (err) {
				console.warn(err);
				return false;
			}
		}
		return true;
	};

	const pickImage = async () => {
		if (!(await requestPermissions())) {
			Alert.alert(
				"Permission Denied",
				"Please grant camera and storage permissions to use this feature"
			);
			return;
		}

		const options = {
			mediaType: "photo",
			quality: 1,
			selectionLimit: 1,
		};

		try {
			const result = await launchImageLibrary(options);

			if (result.didCancel) {
				console.log("User cancelled image picker");
			} else if (result.errorCode) {
				console.log("ImagePicker Error: ", result.errorMessage);
				Alert.alert("Error", "Failed to pick image");
			} else if (result.assets && result.assets.length > 0) {
				const selectedAsset = result.assets[0];

				if (selectedAsset.uri) {
					setSelectedImage(selectedAsset.uri);
					console.log("Image selected:", selectedAsset.uri);
				} else {
					Alert.alert("Error", "Selected image has no URI");
				}
			} else {
				Alert.alert("Error", "No image was selected");
			}
		} catch (error) {
			console.error("Error picking image:", error);
			Alert.alert("Error", `Failed to pick image: ${error.message}`);
		}
	};

	const analyzeHandwriting = async () => {
		if (!selectedImage) {
			Alert.alert("Error", "Please select an image first");
			return;
		}

		if (!question.trim()) {
			Alert.alert("Error", "Please enter a question or prompt for analysis");
			return;
		}

		setLoading(true);

		try {
			const formData = new FormData();
			const filename = selectedImage.split("/").pop() || "upload.jpg";

			formData.append("file", {
				uri: selectedImage,
				name: filename,
				type: "image/jpeg",
			} as any);

			formData.append("question", question);

			const apiUrl = "https://yourapi.com/handwritten/analyze_handwritten";

			const response = await fetch(apiUrl, {
				method: "POST",
				body: formData,
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			setAnalysisResults(data);
		} catch (error) {
			console.error("Error:", error);
			Alert.alert(
				"Error",
				"An error occurred during analysis. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView
			style={[styles.safeArea, { backgroundColor: currentTheme.bgColor }]}
			edges={["left", "right"]}
		>
			<StatusBar
				backgroundColor="transparent"
				barStyle="light-content"
				translucent
			/>

			<Animated.View
				style={[
					styles.stickyHeader,
					{
						backgroundColor: currentTheme.stickyHeaderBg,
						opacity: stickyHeaderOpacity,
						borderBottomColor: isDarkMode
							? "rgba(255,255,255,0.1)"
							: "rgba(0,0,0,0.1)",
					},
				]}
			>
				<View style={styles.stickyHeaderContent}>
					<TouchableOpacity
						style={styles.stickyBackButton}
						onPress={() => navigation.goBack()}
					>
						<MaterialIcons name="arrow-back" size={24} color="white" />
					</TouchableOpacity>
					<Text
						style={[
							styles.stickyHeaderTitle,
							{ color: currentTheme.stickyHeaderTitle },
						]}
					>
						WriteEng
					</Text>
				</View>
			</Animated.View>

			<Animated.ScrollView
				style={styles.scrollView}
				scrollEventThrottle={16}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: true }
				)}
				contentContainerStyle={styles.scrollViewContent}
			>
				<Animated.View style={{ opacity: headerOpacity }}>
					<LinearGradient
						colors={currentTheme.headerGradient}
						style={styles.header}
					>
						<View style={styles.headerContent}>
							<TouchableOpacity
								style={styles.backButton}
								onPress={() => navigation.goBack()}
							>
								<MaterialIcons name="arrow-back" size={26} color="white" />
							</TouchableOpacity>
							<View style={styles.headerTextContainer}>
								<Text style={styles.headerTitle}>WriteEng</Text>
								<Text style={styles.headerSubtitle}>
									Improve your writing skills
								</Text>
							</View>
						</View>
					</LinearGradient>
				</Animated.View>

				<View style={styles.contentContainer}>
					<View
						style={[
							styles.card,
							{
								backgroundColor: currentTheme.cardBg,
								borderColor: currentTheme.borderColor,
								elevation: isDarkMode ? 0 : 3,
							},
						]}
					>
						<View
							style={[
								styles.cardHeader,
								{ borderBottomColor: currentTheme.borderColor },
							]}
						>
							<MaterialIcons
								name="create"
								size={20}
								color={isDarkMode ? "#48BB78" : "#063181"}
								style={styles.cardIcon}
							/>
							<Text
								style={[styles.cardTitle, { color: currentTheme.textColor }]}
							>
								Upload Your Writing
							</Text>
						</View>

						<View style={styles.cardBody}>
							<Text
								style={[styles.inputLabel, { color: currentTheme.textColor }]}
							>
								What was the question you answered?
							</Text>
							<TextInput
								style={[
									styles.textInput,
									{
										borderColor: currentTheme.borderColor,
										backgroundColor: isDarkMode
											? "rgba(255,255,255,0.05)"
											: currentTheme.cardBg,
										color: currentTheme.textColor,
									},
								]}
								value={question}
								onChangeText={setQuestion}
								placeholder="Describe the content of your image"
								placeholderTextColor={currentTheme.subTextColor}
								multiline
							/>

							<TouchableOpacity
								style={[
									styles.uploadArea,
									{
										borderColor: isDarkMode ? "#48BB78" : "#063181",
										backgroundColor: isDarkMode
											? "rgba(72, 187, 120, 0.1)"
											: "rgba(6, 49, 129, 0.05)",
									},
								]}
								onPress={pickImage}
								activeOpacity={0.7}
							>
								<MaterialIcons
									name="cloud-upload"
									size={40}
									color={isDarkMode ? "#48BB78" : "#063181"}
								/>
								<Text
									style={[styles.uploadText, { color: currentTheme.textColor }]}
								>
									{selectedImage
										? "Change selected image"
										: "Upload your handwriting image"}
								</Text>
								<Text
									style={[
										styles.uploadSubtext,
										{ color: currentTheme.subTextColor },
									]}
								>
									Choose a clear, well-lit photo for best results
								</Text>
							</TouchableOpacity>

							{selectedImage && (
								<View style={styles.imageContainer}>
									<Image
										source={{ uri: selectedImage }}
										style={styles.imagePreview}
										resizeMode="contain"
									/>
									<TouchableOpacity
										style={styles.removeImageButton}
										onPress={() => setSelectedImage(null)}
									>
										<MaterialIcons name="close" size={16} color="white" />
									</TouchableOpacity>
								</View>
							)}

							<TouchableOpacity
								style={[
									styles.button,
									(!selectedImage || !question.trim() || loading) &&
										styles.buttonDisabled,
									{ backgroundColor: isDarkMode ? "#48BB78" : "#063181" },
								]}
								onPress={analyzeHandwriting}
								disabled={!selectedImage || !question.trim() || loading}
							>
								{loading ? (
									<View style={styles.buttonContent}>
										<ActivityIndicator size="small" color="white" />
										<Text style={styles.buttonText}>Analyzing...</Text>
									</View>
								) : (
									<View style={styles.buttonContent}>
										<MaterialIcons name="analytics" size={20} color="white" />
										<Text style={styles.buttonText}>Analyze My Writing</Text>
									</View>
								)}
							</TouchableOpacity>
						</View>
					</View>

					{loading && (
						<View style={styles.loadingContainer}>
							<ActivityIndicator
								size="large"
								color={isDarkMode ? "#48BB78" : "#063181"}
							/>
							<Text
								style={[styles.loadingText, { color: currentTheme.textColor }]}
							>
								Analyzing your handwriting...
							</Text>
						</View>
					)}

					{analysisResults && (
						<View style={styles.resultsSection}>
							<View
								style={[
									styles.card,
									{
										backgroundColor: currentTheme.cardBg,
										borderColor: currentTheme.borderColor,
										elevation: isDarkMode ? 0 : 3,
									},
								]}
							>
								<View
									style={[
										styles.cardHeader,
										{ borderBottomColor: currentTheme.borderColor },
									]}
								>
									<MaterialIcons
										name="text-fields"
										size={20}
										color={isDarkMode ? "#48BB78" : "#063181"}
										style={styles.cardIcon}
									/>
									<Text
										style={[
											styles.cardTitle,
											{ color: currentTheme.textColor },
										]}
									>
										Extracted Text
									</Text>
								</View>
								<View style={styles.cardBody}>
									<Text
										style={[
											styles.extractedText,
											{ color: currentTheme.textColor },
										]}
									>
										{analysisResults.extracted_text}
									</Text>
								</View>
							</View>

							<Text
								style={[styles.sectionTitle, { color: currentTheme.textColor }]}
							>
								Analysis Scores
							</Text>

							<View style={styles.scoresGrid}>
								<ScoreCard
									title="Legibility"
									score={analysisResults.handwriting_analysis.legibility}
									icon="✍️"
									color="#4f46e5"
								/>
								<ScoreCard
									title="Neatness"
									score={analysisResults.handwriting_analysis.neatness}
									icon="✓"
									color="#22c55e"
								/>
								<ScoreCard
									title="Spacing"
									score={analysisResults.handwriting_analysis.spacing}
									icon="↔️"
									color="#8b5cf6"
								/>
								<ScoreCard
									title="Grammar"
									score={analysisResults.text_analysis.grammar_score}
									icon="📝"
									color="#6366f1"
								/>
								<ScoreCard
									title="Relevance"
									score={analysisResults.text_analysis.relevance_score}
									icon="🎯"
									color="#eab308"
								/>
								<ScoreCard
									title="Vocabulary"
									score={analysisResults.text_analysis.vocabulary_score}
									icon="📚"
									color="#ef4444"
								/>
							</View>

							<View
								style={[
									styles.card,
									{
										backgroundColor: currentTheme.cardBg,
										borderColor: currentTheme.borderColor,
										elevation: isDarkMode ? 0 : 3,
									},
								]}
							>
								<View
									style={[
										styles.cardHeader,
										{ borderBottomColor: currentTheme.borderColor },
									]}
								>
									<MaterialIcons
										name="comment"
										size={20}
										color={isDarkMode ? "#48BB78" : "#063181"}
										style={styles.card}
										name="comment"
										size={20}
										color={isDarkMode ? "#48BB78" : "#063181"}
										style={styles.cardIcon}
									/>
									<Text
										style={[
											styles.cardTitle,
											{ color: currentTheme.textColor },
										]}
									>
										Your Feedback
									</Text>
								</View>
								<View style={styles.cardBody}>
									<View
										style={[
											styles.feedbackSection,
											{
												backgroundColor: isDarkMode
													? "rgba(72, 187, 120, 0.1)"
													: "rgba(6, 49, 129, 0.05)",
											},
										]}
									>
										<Text
											style={[
												styles.feedbackTitle,
												{ color: currentTheme.textColor },
											]}
										>
											Question
										</Text>
										<Text
											style={[
												styles.feedbackContent,
												{ color: currentTheme.textColor },
											]}
										>
											{question}
										</Text>
										<Text
											style={[
												styles.feedbackTitle,
												styles.marginTop,
												{ color: currentTheme.textColor },
											]}
										>
											Writing Feedback
										</Text>
										<Text
											style={[
												styles.feedbackContent,
												{ color: currentTheme.textColor },
											]}
										>
											{analysisResults.text_analysis.feedback}
										</Text>
									</View>
								</View>
							</View>
						</View>
					)}

					<View style={styles.bottomSpacing} />
				</View>
			</Animated.ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	scrollViewContent: {
		paddingTop: 0,
	},
	stickyHeader: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: Platform.OS === "ios" ? 65 : 95,
		backgroundColor: "rgba(249,250,251,0.98)",
		zIndex: 1000,
		borderBottomWidth: 1,
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.15,
		shadowRadius: 4,
	},
	stickyHeaderContent: {
		flex: 1,
		flexDirection: "row",
		gap: 20,
		alignContent: "center",
		alignItems: "center",
		paddingHorizontal: 16,
		height: "100%",
	},
	stickyBackButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#074799",
		justifyContent: "center",
		alignItems: "center",
	},
	stickyHeaderTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#074799",
		flex: 1,
	},
	header: {
		paddingTop:
			Platform.OS === "ios" ? 50 : (StatusBar.currentHeight || 0) + 20,
		paddingHorizontal: 20,
		paddingBottom: 25,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
		marginBottom: 10,
	},
	headerContent: {
		flexDirection: "row",
		marginBottom: 12,
	},
	headerTextContainer: {
		flexDirection: "column",
		flex: 1,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255,255,255,0.2)",
		justifyContent: "center",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 26,
		fontWeight: "bold",
		color: "white",
		marginLeft: 20,
	},
	headerSubtitle: {
		fontSize: 15,
		color: "rgba(255,255,255,0.8)",
		marginTop: 5,
		marginLeft: 20,
	},
	contentContainer: {
		padding: 16,
	},
	card: {
		borderRadius: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		margin: 0,
		marginTop: 16,
		borderWidth: 1,
		overflow: "hidden",
	},
	cardHeader: {
		flexDirection: "row",
		alignItems: "center",
		padding: 14,
		borderBottomWidth: 1,
	},
	cardIcon: {
		marginRight: 10,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: "600",
	},
	cardBody: {
		padding: 16,
	},
	inputLabel: {
		fontSize: 15,
		fontWeight: "500",
		marginBottom: 8,
	},
	textInput: {
		width: "100%",
		padding: 12,
		borderWidth: 1,
		borderRadius: 8,
		fontSize: 16,
		marginBottom: 16,
		minHeight: 80,
		textAlignVertical: "top",
	},
	uploadArea: {
		borderWidth: 1,
		borderStyle: "dashed",
		borderRadius: 12,
		padding: 24,
		alignItems: "center",
		marginBottom: 16,
	},
	uploadText: {
		fontSize: 15,
		marginTop: 12,
		textAlign: "center",
		fontWeight: "500",
	},
	uploadSubtext: {
		fontSize: 13,
		marginTop: 4,
		textAlign: "center",
	},
	imageContainer: {
		position: "relative",
		marginBottom: 16,
		borderRadius: 12,
		overflow: "hidden",
	},
	imagePreview: {
		width: "100%",
		height: 180,
		backgroundColor: "#f3f4f6",
	},
	removeImageButton: {
		position: "absolute",
		top: 8,
		right: 8,
		backgroundColor: "rgba(0,0,0,0.6)",
		width: 24,
		height: 24,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	button: {
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignSelf: "stretch",
		alignItems: "center",
	},
	buttonContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "500",
		marginLeft: 8,
	},
	loadingContainer: {
		padding: 24,
		alignItems: "center",
	},
	loadingText: {
		marginTop: 12,
		fontSize: 15,
	},
	resultsSection: {
		marginTop: 8,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginHorizontal: 0,
		marginTop: 20,
		marginBottom: 12,
	},
	scoresGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		marginBottom: 16,
	},
	scoreCard: {
		width: "48%",
		borderRadius: 12,
		padding: 12,
		marginBottom: 16,
		borderWidth: 1,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	scoreHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	scoreTitle: {
		flexDirection: "row",
		alignItems: "center",
	},
	icon: {
		fontSize: 16,
		marginRight: 4,
	},
	scoreTitleText: {
		fontSize: 13,
		fontWeight: "500",
	},
	scoreValue: {
		fontSize: 18,
		fontWeight: "bold",
	},
	progressBar: {
		height: 4,
		borderRadius: 2,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
	},
	extractedText: {
		fontSize: 15,
		lineHeight: 22,
	},
	feedbackSection: {
		borderRadius: 12,
		padding: 16,
	},
	feedbackTitle: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 8,
	},
	feedbackContent: {
		fontSize: 15,
		lineHeight: 22,
	},
	marginTop: {
		marginTop: 16,
	},
	bottomSpacing: {
		height: 40,
	},
});

export default WriteEnglishScreen;
