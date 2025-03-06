// components/ClassDetail.tsx
import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Animated,
	StatusBar,
	SafeAreaView,
	Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../App";
import AssignmentCard from "../../CommonScreens/AssignmentCard";
import StickyHeader from "./StickyHeader";

const ClassDetail = ({
	selectedClass,
	setSelectedClass,
	scrollY,
	stickyHeaderOpacity,
	headerOpacity,
	handleStartAssignment,
	handleViewCompletedAssignment,
}) => {
	const [activeTab, setActiveTab] = useState("assignments");
	const { isDarkMode } = useTheme();

	const renderItems = (items, isAssignments) => (
		<View style={styles.itemsContainer}>
			{isAssignments && items.pending && (
				<View style={styles.statusSection}>
					<Text
						style={[styles.statusTitle, isDarkMode && styles.darkStatusTitle]}
					>
						Pending
					</Text>
					{items.pending.length > 0 ? (
						items.pending.map((item) => (
							<AssignmentCard
								key={item.id}
								item={item}
								isPending={true}
								onStartAssignment={handleStartAssignment}
								onViewCompletedAssignment={() => {}}
							/>
						))
					) : (
						<Text
							style={[styles.noItemsText, isDarkMode && styles.darkNoItemsText]}
						>
							No pending items
						</Text>
					)}
				</View>
			)}

			<View style={styles.statusSection}>
				<Text
					style={[styles.statusTitle, isDarkMode && styles.darkStatusTitle]}
				>
					Completed
				</Text>
				{items.completed && items.completed.length > 0 ? (
					items.completed.map((item) => (
						<AssignmentCard
							key={item.id}
							item={item}
							isPending={false}
							onStartAssignment={() => {}}
							onViewCompletedAssignment={handleViewCompletedAssignment}
						/>
					))
				) : (
					<Text
						style={[styles.noItemsText, isDarkMode && styles.darkNoItemsText]}
					>
						No completed items
					</Text>
				)}
			</View>
		</View>
	);

	const renderTabSwitch = () => (
		<View
			style={[
				styles.tabSwitchContainer,
				isDarkMode && styles.darkTabSwitchContainer,
			]}
		>
			<TouchableOpacity
				style={[
					styles.tabSwitch,
					activeTab === "assignments" && styles.activeTabSwitch,
					activeTab === "assignments" &&
						isDarkMode &&
						styles.darkActiveTabSwitch,
				]}
				onPress={() => setActiveTab("assignments")}
			>
				<Text
					style={[
						styles.tabSwitchText,
						activeTab === "assignments" && styles.activeTabSwitchText,
						isDarkMode && styles.darkTabSwitchText,
						activeTab === "assignments" &&
							isDarkMode &&
							styles.darkActiveTabSwitchText,
					]}
				>
					Assignments
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[
					styles.tabSwitch,
					activeTab === "assessments" && styles.activeTabSwitch,
					activeTab === "assessments" &&
						isDarkMode &&
						styles.darkActiveTabSwitch,
				]}
				onPress={() => setActiveTab("assessments")}
			>
				<Text
					style={[
						styles.tabSwitchText,
						activeTab === "assessments" && styles.activeTabSwitchText,
						isDarkMode && styles.darkTabSwitchText,
						activeTab === "assessments" &&
							isDarkMode &&
							styles.darkActiveTabSwitchText,
					]}
				>
					Assessments
				</Text>
			</TouchableOpacity>
		</View>
	);

	return (
		<SafeAreaView
			style={[styles.container, isDarkMode && styles.darkContainer]}
		>
			<StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

			{/* Sticky Header */}
			<StickyHeader
				title={selectedClass.title}
				stickyHeaderOpacity={stickyHeaderOpacity}
				isDarkMode={isDarkMode}
				onBackPress={() => setSelectedClass(null)}
			/>

			<Animated.ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: true }
				)}
				scrollEventThrottle={16}
			>
				{/* Main Header with animations */}
				<Animated.View style={{ opacity: headerOpacity }}>
					<LinearGradient
						colors={
							isDarkMode ? ["#1A1A1A", "#2D2D2D"] : ["#012269", "#224ba3"]
						}
						style={styles.header}
					>
						<View style={styles.headerContent}>
							<TouchableOpacity
								onPress={() => setSelectedClass(null)}
								style={styles.backButtonHeader}
							>
								<MaterialIcons name="arrow-back" size={24} color="white" />
							</TouchableOpacity>
							<Text style={styles.headerTitle}>{selectedClass.title}</Text>
						</View>
						<View style={styles.classInfo}>
							<View style={styles.instructorSection}>
								<MaterialIcons name="person" size={20} color="white" />
								<Text style={styles.instructorText}>
									{selectedClass.instructor}
								</Text>
							</View>
							<View style={styles.nextClassSection}>
								<MaterialIcons name="schedule" size={20} color="white" />
								<Text style={styles.nextClassText}>
									{selectedClass.nextClass}
								</Text>
							</View>
						</View>
						{/* <View style={styles.progressSection}>
							<View style={styles.progressHeader}>
								<Text style={styles.progressLabel}>Course Progress</Text>
								<Text style={styles.progressValue}>
									{selectedClass.progress}%
								</Text>
							</View>
							<View style={styles.progressBar}>
								<View
									style={[
										styles.progressFill,
										{ width: `${selectedClass.progress}%` },
									]}
								/>
							</View>
						</View> */}
					</LinearGradient>
				</Animated.View>

				<View style={[styles.content, isDarkMode && styles.darkContent]}>
					{renderTabSwitch()}
					{renderItems(
						selectedClass.items[activeTab],
						activeTab === "assignments"
					)}
				</View>
				<View style={styles.bottomSpacing} />
			</Animated.ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F7FA",
	},
	darkContainer: {
		backgroundColor: "#1a1a1a",
	},
	scrollView: {
		flex: 1,
	},
	scrollViewContent: {
		paddingTop: 0,
	},
	header: {
		padding: 20,
		paddingTop: Platform.OS === "ios" ? 30 : 60,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 15,
	},
	backButtonHeader: {
		marginRight: 15,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
	classInfo: {
		marginTop: 15,
	},
	instructorSection: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	instructorText: {
		color: "white",
		marginLeft: 8,
		fontSize: 16,
	},
	nextClassSection: {
		flexDirection: "row",
		alignItems: "center",
	},
	nextClassText: {
		color: "white",
		marginLeft: 8,
		fontSize: 16,
	},
	progressSection: {
		marginTop: 20,
	},
	progressHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	progressLabel: {
		color: "white",
		fontSize: 14,
	},
	progressValue: {
		color: "white",
		fontSize: 14,
		fontWeight: "bold",
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
	content: {
		padding: 20,
	},
	darkContent: {
		backgroundColor: "#1a1a1a",
	},
	tabSwitchContainer: {
		flexDirection: "row",
		backgroundColor: "#EDF2F7",
		borderRadius: 30,
		padding: 4,
		marginBottom: 20,
	},
	darkTabSwitchContainer: {
		backgroundColor: "#333",
	},
	tabSwitch: {
		flex: 1,
		paddingVertical: 12,
		alignItems: "center",
		borderRadius: 60,
	},
	activeTabSwitch: {
		backgroundColor: "white",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	darkActiveTabSwitch: {
		backgroundColor: "#2a2a2a",
	},
	tabSwitchText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#4A5568",
	},
	darkTabSwitchText: {
		color: "#cbd5e0",
	},
	activeTabSwitchText: {
		color: "#2563EB",
	},
	darkActiveTabSwitchText: {
		color: "#3b82f6",
	},
	itemsContainer: {
		gap: 24,
	},
	statusSection: {
		marginBottom: 16,
	},
	statusTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#4A5568",
		marginBottom: 12,
	},
	darkStatusTitle: {
		color: "#cbd5e0",
	},
	noItemsText: {
		color: "#666",
		fontSize: 16,
		fontStyle: "italic",
		textAlign: "center",
		padding: 12,
	},
	darkNoItemsText: {
		color: "#999",
	},
	bottomSpacing: {
		height: 30,
	},
});

export default ClassDetail;
