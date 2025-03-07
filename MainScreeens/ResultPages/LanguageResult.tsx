import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	SafeAreaView,
	StatusBar,
	Dimensions,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Svg, { Circle, Path } from "react-native-svg";

interface ProgressData {
	title: string;
	value: number;
}

interface TableRow {
	[key: string]: string | number;
}

const LanguageResult = ({ navigation }) => {
	const [activeTab, setActiveTab] = useState("words");
	const [progressData, setProgressData] = useState<ProgressData[]>([
		{ title: "Word Overall", value: 20 },
		{ title: "Sentence Overall", value: 25 },
		{ title: "Paragraph Overall", value: 76 },
		{ title: "Overall Score", value: 62 },
	]);

	const [wordsData, setWordsData] = useState<TableRow[]>([
		{
			words: "Example",
			studentPronunciation: "eg-ZAM-pel",
			standardPronunciation: "ig-ZAM-pul",
			syllables: 3,
			overall: "92%",
		},
		{
			words: "Sample",
			studentPronunciation: "SAM-pel",
			standardPronunciation: "SAM-pul",
			syllables: 2,
			overall: "78%",
		},
		{
			words: "Test",
			studentPronunciation: "TEST",
			standardPronunciation: "TEH-st",
			syllables: 1,
			overall: "15%",
		},
		{
			words: "Practice",
			studentPronunciation: "PRAK-tis",
			standardPronunciation: "PRAK-tees",
			syllables: 2,
			overall: "73%",
		},
	]);

	const [sentencesData, setSentencesData] = useState<TableRow[]>([
		{
			sentences:
				"The classess was the awesome place to learn the new things....",
			integrity: "85%",
			fluency: "88%",
			accuracy: "80%",
			overall: "97%",
		},
		{
			sentences:
				"Knowing the newthings will always keeps us in a good position...",
			integrity: "90%",
			fluency: "78%",
			accuracy: "60%",
			overall: "87%",
		},
		{
			sentences:
				"The classess was the awesome place to learn the new things....",
			integrity: "85%",
			fluency: "88%",
			accuracy: "80%",
			overall: "37%",
		},
		{
			sentences:
				"Knowing the newthings will always keeps us in a good position...",
			integrity: "90%",
			fluency: "78%",
			accuracy: "60%",
			overall: "37%",
		},
	]);

	const [paragraphsData, setParagraphsData] = useState<TableRow[]>([
		{
			paragraphs: "India, a land of immense diversity and complexity..",
			integrity: "88%",
			fluency: "50%",
			accuracy: "30%",
			overall: "92%",
		},
		{
			paragraphs: "India, a land of immense diversity and complexity..",
			integrity: "78%",
			fluency: "70%",
			accuracy: "30%",
			overall: "78%",
		},
		{
			paragraphs: "India, a land of immense diversity and complexity..",
			integrity: "68%",
			fluency: "80%",
			accuracy: "40%",
			overall: "15%",
		},
		{
			paragraphs: "India, a land of immense diversity and complexity..",
			integrity: "88%",
			fluency: "89%",
			accuracy: "70%",
			overall: "73%",
		},
	]);

	const getColorForValue = (value: number): string => {
		if (value >= 75) return "#38A169"; // Green
		if (value >= 50) return "#3182CE"; // Blue
		if (value >= 25) return "#DD6B20"; // Orange
		return "#E53E3E"; // Red
	};

	const renderProgressCircles = () => {
		return (
			<View style={styles.progressRow}>
				{progressData.map((item, index) => {
					const radius = 28;
					const circumference = 2 * Math.PI * radius;
					const strokeDashoffset =
						circumference - (item.value / 100) * circumference;
					const color = getColorForValue(item.value);

					return (
						<View key={index} style={styles.progressCircleContainer}>
							<View style={styles.progressRing}>
								<Svg width={70} height={70}>
									<Circle
										cx="35"
										cy="35"
										r={radius}
										stroke="#EDF2F7"
										strokeWidth="5"
										fill="none"
									/>
									<Circle
										cx="35"
										cy="35"
										r={radius}
										stroke={color}
										strokeWidth="5"
										fill="none"
										strokeDasharray={circumference}
										strokeDashoffset={strokeDashoffset}
										strokeLinecap="round"
										transform="rotate(-90, 35, 35)"
									/>
								</Svg>
								<View style={styles.progressValue}>
									<Text style={[styles.progressValueText, { color }]}>
										{item.value}%
									</Text>
								</View>
							</View>
							<Text style={styles.progressTitle}>{item.title}</Text>
						</View>
					);
				})}
			</View>
		);
	};

	const renderPerformanceCards = () => {
		if (activeTab === "words") {
			return (
				<View style={styles.performanceCardsContainer}>
					{wordsData.map((item, index) => {
						const scoreValue = parseInt(item.overall as string);
						const color = getColorForValue(scoreValue);
						return (
							<View key={index} style={styles.performanceCard}>
								<View style={styles.performanceCardHeader}>
									<Text style={styles.performanceCardTitle}>{item.words}</Text>
									<View style={styles.scoreContainer}>
										<Text style={[styles.scoreText, { color }]}>
											{item.overall}
										</Text>
									</View>
								</View>
								<View style={styles.divider} />
								<View style={styles.performanceCardContent}>
									<View style={styles.performanceDetail}>
										<Text style={styles.detailLabel}>Your pronunciation:</Text>
										<Text style={styles.detailValue}>
											{item.studentPronunciation}
										</Text>
									</View>
									<View style={styles.performanceDetail}>
										<Text style={styles.detailLabel}>Standard:</Text>
										<Text style={styles.detailValue}>
											{item.standardPronunciation}
										</Text>
									</View>
									<View style={styles.performanceDetail}>
										<Text style={styles.detailLabel}>Syllables:</Text>
										<Text style={styles.detailValue}>{item.syllables}</Text>
									</View>
								</View>
							</View>
						);
					})}
				</View>
			);
		} else if (activeTab === "sentences") {
			return (
				<View style={styles.performanceCardsContainer}>
					{sentencesData.map((item, index) => {
						const scoreValue = parseInt(item.overall as string);
						const color = getColorForValue(scoreValue);
						return (
							<View key={index} style={styles.performanceCard}>
								<View style={styles.performanceCardHeader}>
									<Text style={styles.sentenceNumber}>
										Sentence {index + 1}
									</Text>
									<View style={styles.scoreContainer}>
										<Text style={[styles.scoreText, { color }]}>
											{item.overall}
										</Text>
									</View>
								</View>
								<View style={styles.divider} />
								<Text style={styles.sentenceText} numberOfLines={2}>
									{item.sentences}
								</Text>
								<View style={styles.metricsGrid}>
									<View style={styles.metricItem}>
										<Text style={styles.metricLabel}>Integrity</Text>
										<Text
											style={[
												styles.metricValue,
												{
													color: getColorForValue(
														parseInt(item.integrity as string)
													),
												},
											]}
										>
											{item.integrity}
										</Text>
									</View>
									<View style={styles.metricItem}>
										<Text style={styles.metricLabel}>Fluency</Text>
										<Text
											style={[
												styles.metricValue,
												{
													color: getColorForValue(
														parseInt(item.fluency as string)
													),
												},
											]}
										>
											{item.fluency}
										</Text>
									</View>
									<View style={styles.metricItem}>
										<Text style={styles.metricLabel}>Accuracy</Text>
										<Text
											style={[
												styles.metricValue,
												{
													color: getColorForValue(
														parseInt(item.accuracy as string)
													),
												},
											]}
										>
											{item.accuracy}
										</Text>
									</View>
								</View>
							</View>
						);
					})}
				</View>
			);
		} else {
			return (
				<View style={styles.performanceCardsContainer}>
					{paragraphsData.map((item, index) => {
						const scoreValue = parseInt(item.overall as string);
						const color = getColorForValue(scoreValue);
						return (
							<View key={index} style={styles.performanceCard}>
								<View style={styles.performanceCardHeader}>
									<Text style={styles.sentenceNumber}>
										Paragraph {index + 1}
									</Text>
									<View style={styles.scoreContainer}>
										<Text style={[styles.scoreText, { color }]}>
											{item.overall}
										</Text>
									</View>
								</View>
								<View style={styles.divider} />
								<Text style={styles.sentenceText} numberOfLines={2}>
									{item.paragraphs}
								</Text>
								<View style={styles.metricsGrid}>
									<View style={styles.metricItem}>
										<Text style={styles.metricLabel}>Integrity</Text>
										<Text
											style={[
												styles.metricValue,
												{
													color: getColorForValue(
														parseInt(item.integrity as string)
													),
												},
											]}
										>
											{item.integrity}
										</Text>
									</View>
									<View style={styles.metricItem}>
										<Text style={styles.metricLabel}>Fluency</Text>
										<Text
											style={[
												styles.metricValue,
												{
													color: getColorForValue(
														parseInt(item.fluency as string)
													),
												},
											]}
										>
											{item.fluency}
										</Text>
									</View>
									<View style={styles.metricItem}>
										<Text style={styles.metricLabel}>Accuracy</Text>
										<Text
											style={[
												styles.metricValue,
												{
													color: getColorForValue(
														parseInt(item.accuracy as string)
													),
												},
											]}
										>
											{item.accuracy}
										</Text>
									</View>
								</View>
							</View>
						);
					})}
				</View>
			);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#2D3748" />

			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerContent}>
					<Text style={styles.headerTitle}>Grade 9 - A</Text>
					<FontAwesome5 name="user-graduate" size={18} color="#FFF" />
				</View>
			</View>

			<ScrollView style={styles.scrollView}>
				<View style={styles.mainContainer}>
					<View style={styles.studentInfoSection}>
						<View style={styles.studentDetails}>
							<Text style={styles.studentName}>Varun's Performance</Text>
							<View style={styles.statusBadge}>
								<Text style={styles.statusText}>
									{progressData[3].value >= 75
										? "Excellent"
										: progressData[3].value >= 50
										? "Good"
										: progressData[3].value >= 25
										? "Needs Improvement"
										: "Needs Attention"}
								</Text>
							</View>
						</View>
					</View>

					{/* Progress Rings in a single row */}
					{renderProgressCircles()}

					{/* Tab Navigation */}
					<View style={styles.tabsContainer}>
						<TouchableOpacity
							style={[
								styles.tabButton,
								activeTab === "words" && styles.activeTabButton,
							]}
							onPress={() => setActiveTab("words")}
						>
							<Text
								style={[
									styles.tabButtonText,
									activeTab === "words" && styles.activeTabButtonText,
								]}
							>
								Words
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.tabButton,
								activeTab === "sentences" && styles.activeTabButton,
							]}
							onPress={() => setActiveTab("sentences")}
						>
							<Text
								style={[
									styles.tabButtonText,
									activeTab === "sentences" && styles.activeTabButtonText,
								]}
							>
								Sentences
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.tabButton,
								activeTab === "paragraphs" && styles.activeTabButton,
							]}
							onPress={() => setActiveTab("paragraphs")}
						>
							<Text
								style={[
									styles.tabButtonText,
									activeTab === "paragraphs" && styles.activeTabButtonText,
								]}
							>
								Paragraphs
							</Text>
						</TouchableOpacity>
					</View>

					{/* Performance Cards */}
					<View style={styles.sectionContainer}>
						<Text style={styles.sectionTitle}>
							{activeTab === "words"
								? "Word Pronunciation"
								: activeTab === "sentences"
								? "Sentence Formation"
								: "Paragraph Structure"}
						</Text>
						{renderPerformanceCards()}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F7FAFC",
	},
	header: {
		backgroundColor: "#2D3748",
		paddingTop: 50,
		paddingHorizontal: 20,
		paddingBottom: 15,
	},
	headerContent: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#FFF",
	},
	scrollView: {
		flex: 1,
	},
	mainContainer: {
		padding: 16,
	},
	studentInfoSection: {
		marginBottom: 16,
	},
	studentDetails: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	studentName: {
		fontSize: 18,
		fontWeight: "600",
		color: "#2D3748",
	},
	statusBadge: {
		backgroundColor: "#E2E8F0",
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 4,
	},
	statusText: {
		color: "#4A5568",
		fontWeight: "500",
		fontSize: 12,
	},
	progressRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
		paddingHorizontal: 8,
	},
	progressCircleContainer: {
		alignItems: "center",
		width: "24%",
	},
	progressRing: {
		position: "relative",
		width: 70,
		height: 70,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 8,
	},
	progressValue: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
	},
	progressValueText: {
		fontSize: 14,
		fontWeight: "bold",
	},
	progressTitle: {
		fontSize: 12,
		textAlign: "center",
		color: "#4A5568",
		fontWeight: "500",
	},
	tabsContainer: {
		flexDirection: "row",
		backgroundColor: "#FFF",
		borderRadius: 8,
		padding: 2,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	tabButton: {
		flex: 1,
		paddingVertical: 10,
		alignItems: "center",
		borderRadius: 6,
	},
	activeTabButton: {
		backgroundColor: "#2D3748",
	},
	tabButtonText: {
		fontSize: 14,
		color: "#4A5568",
		fontWeight: "500",
	},
	activeTabButtonText: {
		color: "#FFF",
		fontWeight: "500",
	},
	sectionContainer: {
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 12,
		color: "#2D3748",
	},
	performanceCardsContainer: {
		marginBottom: 8,
	},
	performanceCard: {
		backgroundColor: "#FFF",
		borderRadius: 8,
		padding: 16,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	performanceCardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	performanceCardTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#2D3748",
	},
	sentenceNumber: {
		fontSize: 15,
		fontWeight: "600",
		color: "#2D3748",
	},
	scoreContainer: {
		paddingHorizontal: 2,
	},
	scoreText: {
		fontWeight: "bold",
		fontSize: 16,
	},
	divider: {
		height: 1,
		backgroundColor: "#E2E8F0",
		marginVertical: 10,
	},
	performanceCardContent: {
		marginTop: 6,
	},
	performanceDetail: {
		flexDirection: "row",
		marginBottom: 6,
		alignItems: "center",
	},
	detailLabel: {
		width: 130,
		fontSize: 13,
		color: "#718096",
	},
	detailValue: {
		fontSize: 13,
		fontWeight: "500",
		color: "#2D3748",
	},
	sentenceText: {
		fontSize: 14,
		color: "#2D3748",
		marginBottom: 12,
		lineHeight: 20,
	},
	metricsGrid: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	metricItem: {
		width: "31%",
		backgroundColor: "#F7FAFC",
		padding: 10,
		borderRadius: 6,
		alignItems: "center",
	},
	metricLabel: {
		fontSize: 12,
		color: "#718096",
		marginBottom: 4,
	},
	metricValue: {
		fontSize: 14,
		fontWeight: "600",
	},
});

export default LanguageResult;
