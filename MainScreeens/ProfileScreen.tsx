import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image,
	Modal,
	TextInput,
	Switch,
	Platform,
	Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	MaterialCommunityIcons,
	FontAwesome5,
	Ionicons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS } from "./constants/Colors";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { toast } from "sonner-native";

export default function ProfileScreen() {
	const navigation = useNavigation();
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [isPhotoPickerVisible, setIsPhotoPickerVisible] = useState(false);
	const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
	const [isJoinClassModalVisible, setIsJoinClassModalVisible] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(true);
	const [profilePhoto, setProfilePhoto] = useState(
		"https://api.a0.dev/assets/image?text=portrait%20photo%20of%20a%20young%20female%20student%20with%20a%20friendly%20smile&aspect=1:1&seed=123"
	);
	const [classCode, setClassCode] = useState("");
	const [isValidCode, setIsValidCode] = useState(true);
	const [facing, setFacing] = useState<CameraType>("front");
	const [cameraActive, setCameraActive] = useState(false);
	const [permission, requestPermission] = useCameraPermissions();

	// User data (mock)
	const [userData, setUserData] = useState({
		name: "Sarah Johnson",
		role: "Student",
		email: "sarah.johnson@example.com",
		phone: "+1 (555) 123-4567",
		education: "Bachelor of Arts in Communications",
		licenseEndDate: "2025-12-31",
		notifications: true,
		emailUpdates: true,
		soundEffects: true,
	});

	// Mock classes data
	const [enrolledClasses, setEnrolledClasses] = useState([
		{
			id: 1,
			name: "English 101",
			instructor: "Dr. Sarah Williams",
			startDate: "2025-01-15",
		},
		{
			id: 2,
			name: "Business Communication",
			instructor: "Prof. Michael Chen",
			startDate: "2025-02-10",
		},
		{
			id: 3,
			name: "Conversational English",
			instructor: "Ms. Emily Rodriguez",
			startDate: "2025-03-01",
		},
	]);

	const goBack = () => {
		navigation.goBack();
	};

	const handleSaveProfile = (editedData) => {
		setUserData({ ...userData, ...editedData });
		setIsEditModalVisible(false);
		toast.success("Profile updated successfully");
	};

	const handleDeleteClass = (classId) => {
		setEnrolledClasses(enrolledClasses.filter((c) => c.id !== classId));
		toast.success("Class removed successfully");
	};

	const handleJoinClass = () => {
		if (classCode.trim() === "") {
			setIsValidCode(false);
			return;
		}

		// Check if code is valid (mock validation)
		if (classCode === "IELTS2025") {
			const newClass = {
				id: enrolledClasses.length + 1,
				name: "IELTS Preparation Master Class",
				instructor: "Ms. Sophia Lee",
				startDate: "2025-03-10",
			};

			setEnrolledClasses([...enrolledClasses, newClass]);
			toast.success("Successfully joined IELTS Preparation Master Class");
			setIsJoinClassModalVisible(false);
			setClassCode("");
		} else {
			setIsValidCode(false);
		}
	};

	const takePicture = async () => {
		// This would typically use the camera to take a picture
		// For this demo, we'll just use a new generated image
		const newPhotoSeed = Math.floor(Math.random() * 1000);
		setProfilePhoto(
			`https://api.a0.dev/assets/image?text=portrait%20photo%20of%20a%20young%20female%20student%20with%20a%20smile&aspect=1:1&seed=${newPhotoSeed}`
		);
		setCameraActive(false);
		setIsPhotoPickerVisible(false);
		toast.success("Profile photo updated");
	};

	const selectFromGallery = () => {
		// This would typically open a gallery picker
		// For this demo, we'll just use a new generated image
		const newPhotoSeed = Math.floor(Math.random() * 1000);
		setProfilePhoto(
			`https://api.a0.dev/assets/image?text=portrait%20photo%20of%20a%20young%20female%20student%20smiling&aspect=1:1&seed=${newPhotoSeed}`
		);
		setIsPhotoPickerVisible(false);
		toast.success("Profile photo updated");
	};

	const toggleCameraFacing = () => {
		setFacing((current) => (current === "back" ? "front" : "back"));
	};

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
					<Text style={styles.headerTitle}>My Profile</Text>
					<View style={{ width: 28 }} />
				</View>

				<ScrollView
					showsVerticalScrollIndicator={false}
					style={styles.scrollView}
				>
					<Animated.View entering={FadeInDown.delay(100).duration(400)}>
						<View style={styles.profileHeader}>
							<TouchableOpacity
								style={styles.profilePhotoContainer}
								onPress={() => setIsPhotoPickerVisible(true)}
							>
								<Image
									source={{ uri: profilePhoto }}
									style={styles.profilePhoto}
								/>
								<View style={styles.editPhotoButton}>
									<MaterialCommunityIcons
										name="camera"
										size={16}
										color={COLORS.textPrimary}
									/>
								</View>
							</TouchableOpacity>

							<Text style={styles.profileName}>{userData.name}</Text>
							<Text style={styles.profileRole}>{userData.role}</Text>

							<View style={styles.statsContainer}>
								<View style={styles.statItem}>
									<Text style={styles.statNumber}>
										{enrolledClasses.length}
									</Text>
									<Text style={styles.statLabel}>Classes</Text>
								</View>
								<View style={styles.statDivider} />
								<View style={styles.statItem}>
									<Text style={styles.statNumber}>
										{new Date(userData.licenseEndDate).toLocaleDateString(
											"en-US",
											{
												year: "numeric",
												month: "short",
												day: "numeric",
											}
										)}
									</Text>
									<Text style={styles.statLabel}>License End</Text>
								</View>
							</View>
						</View>
					</Animated.View>

					<Animated.View entering={FadeInDown.delay(200).duration(400)}>
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Personal Information</Text>

							<View style={styles.infoCard}>
								<View style={styles.infoRow}>
									<MaterialCommunityIcons
										name="email-outline"
										size={22}
										color={COLORS.neonBlue}
									/>
									<View style={styles.infoTextContainer}>
										<Text style={styles.infoLabel}>Email</Text>
										<Text style={styles.infoValue}>{userData.email}</Text>
									</View>
								</View>

								<View style={styles.infoRow}>
									<MaterialCommunityIcons
										name="phone-outline"
										size={22}
										color={COLORS.neonPurple}
									/>
									<View style={styles.infoTextContainer}>
										<Text style={styles.infoLabel}>Phone</Text>
										<Text style={styles.infoValue}>{userData.phone}</Text>
									</View>
								</View>

								<View style={styles.infoRow}>
									<MaterialCommunityIcons
										name="school-outline"
										size={22}
										color={COLORS.neonGreen}
									/>
									<View style={styles.infoTextContainer}>
										<Text style={styles.infoLabel}>Education</Text>
										<Text style={styles.infoValue}>{userData.education}</Text>
									</View>
								</View>
							</View>
						</View>
					</Animated.View>

					<Animated.View entering={FadeInDown.delay(300).duration(400)}>
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Account Settings</Text>

							<View style={styles.settingsCard}>
								<TouchableOpacity
									style={styles.settingsRow}
									onPress={() => setIsEditModalVisible(true)}
								>
									<View style={styles.settingsIconContainer}>
										<MaterialCommunityIcons
											name="account-edit-outline"
											size={22}
											color={COLORS.neonBlue}
										/>
									</View>
									<Text style={styles.settingsText}>Edit Profile</Text>
									<MaterialCommunityIcons
										name="chevron-right"
										size={22}
										color={COLORS.textSecondary}
									/>
								</TouchableOpacity>

								<TouchableOpacity style={styles.settingsRow}>
									<View style={styles.settingsIconContainer}>
										<MaterialCommunityIcons
											name="credit-card-outline"
											size={22}
											color={COLORS.neonPurple}
										/>
									</View>
									<Text style={styles.settingsText}>Payment Methods</Text>
									<MaterialCommunityIcons
										name="chevron-right"
										size={22}
										color={COLORS.textSecondary}
									/>
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.settingsRow}
									onPress={() => setIsSettingsModalVisible(true)}
								>
									<View style={styles.settingsIconContainer}>
										<MaterialCommunityIcons
											name="cog-outline"
											size={22}
											color={COLORS.neonGreen}
										/>
									</View>
									<Text style={styles.settingsText}>Settings</Text>
									<MaterialCommunityIcons
										name="chevron-right"
										size={22}
										color={COLORS.textSecondary}
									/>
								</TouchableOpacity>

								<TouchableOpacity style={styles.settingsRow}>
									<View style={styles.settingsIconContainer}>
										<MaterialCommunityIcons
											name="logout"
											size={22}
											color={COLORS.neonOrange}
										/>
									</View>
									<Text style={styles.settingsText}>Logout</Text>
									<MaterialCommunityIcons
										name="chevron-right"
										size={22}
										color={COLORS.textSecondary}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</Animated.View>

					<Animated.View entering={FadeInDown.delay(400).duration(400)}>
						<View style={styles.section}>
							<View style={styles.sectionTitleRow}>
								<Text style={styles.sectionTitle}>Enrolled Classes</Text>
								<TouchableOpacity
									style={styles.joinClassButton}
									onPress={() => setIsJoinClassModalVisible(true)}
								>
									<Text style={styles.joinClassText}>Join Class</Text>
									<MaterialCommunityIcons
										name="plus"
										size={16}
										color={COLORS.textPrimary}
									/>
								</TouchableOpacity>
							</View>

							<View style={styles.classesGrid}>
								{enrolledClasses.map((classItem, index) => (
									<Animated.View
										key={classItem.id}
										entering={FadeInDown.delay(500 + index * 100).duration(400)}
										style={styles.classCard}
									>
										<View style={styles.classCardHeader}>
											<MaterialCommunityIcons
												name="book-open-variant"
												size={24}
												color={COLORS.neonBlue}
											/>
											<TouchableOpacity
												style={styles.deleteClassButton}
												onPress={() => handleDeleteClass(classItem.id)}
											>
												<MaterialCommunityIcons
													name="close"
													size={16}
													color={COLORS.textSecondary}
												/>
											</TouchableOpacity>
										</View>

										<Text style={styles.className}>{classItem.name}</Text>
										<Text style={styles.classInstructor}>
											{classItem.instructor}
										</Text>

										<View style={styles.classDateContainer}>
											<MaterialCommunityIcons
												name="calendar"
												size={14}
												color={COLORS.textSecondary}
											/>
											<Text style={styles.classDate}>
												Started:{" "}
												{new Date(classItem.startDate).toLocaleDateString(
													"en-US",
													{
														month: "short",
														day: "numeric",
														year: "numeric",
													}
												)}
											</Text>
										</View>

										<TouchableOpacity style={styles.viewCourseButton}>
											<Text style={styles.viewCourseText}>View Course</Text>
										</TouchableOpacity>
									</Animated.View>
								))}
							</View>
						</View>
					</Animated.View>

					{/* Extra space at bottom */}
					<View style={{ height: 100 }} />
				</ScrollView>

				{/* Edit Profile Modal */}
				<Modal
					visible={isEditModalVisible}
					transparent={true}
					animationType="slide"
					onRequestClose={() => setIsEditModalVisible(false)}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContainer}>
							<View style={styles.modalHeader}>
								<Text style={styles.modalTitle}>Edit Profile</Text>
								<TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
									<Ionicons name="close" size={24} color={COLORS.textPrimary} />
								</TouchableOpacity>
							</View>

							<ScrollView style={styles.modalContent}>
								<Text style={styles.inputLabel}>Name</Text>
								<TextInput
									style={styles.textInput}
									value={userData.name}
									onChangeText={(text) =>
										setUserData({ ...userData, name: text })
									}
									placeholderTextColor={COLORS.textSecondary}
								/>

								<Text style={styles.inputLabel}>Email</Text>
								<TextInput
									style={styles.textInput}
									value={userData.email}
									onChangeText={(text) =>
										setUserData({ ...userData, email: text })
									}
									keyboardType="email-address"
									placeholderTextColor={COLORS.textSecondary}
								/>

								<Text style={styles.inputLabel}>Phone</Text>
								<TextInput
									style={styles.textInput}
									value={userData.phone}
									onChangeText={(text) =>
										setUserData({ ...userData, phone: text })
									}
									keyboardType="phone-pad"
									placeholderTextColor={COLORS.textSecondary}
								/>

								<Text style={styles.inputLabel}>Education</Text>
								<TextInput
									style={styles.textInput}
									value={userData.education}
									onChangeText={(text) =>
										setUserData({ ...userData, education: text })
									}
									placeholderTextColor={COLORS.textSecondary}
								/>

								<TouchableOpacity
									style={styles.saveButton}
									onPress={() => handleSaveProfile(userData)}
								>
									<Text style={styles.saveButtonText}>Save Changes</Text>
								</TouchableOpacity>
							</ScrollView>
						</View>
					</View>
				</Modal>

				{/* Photo Picker Modal */}
				<Modal
					visible={isPhotoPickerVisible}
					transparent={true}
					animationType="slide"
					onRequestClose={() => {
						setCameraActive(false);
						setIsPhotoPickerVisible(false);
					}}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContainer}>
							<View style={styles.modalHeader}>
								<Text style={styles.modalTitle}>Change Profile Photo</Text>
								<TouchableOpacity
									onPress={() => {
										setCameraActive(false);
										setIsPhotoPickerVisible(false);
									}}
								>
									<Ionicons name="close" size={24} color={COLORS.textPrimary} />
								</TouchableOpacity>
							</View>

							{cameraActive ? (
								<View style={styles.cameraContainer}>
									{!permission ? (
										<View style={styles.cameraPermissionContainer}>
											<Text style={styles.cameraPermissionText}>
												We need camera permission
											</Text>
											<TouchableOpacity
												style={styles.cameraPermissionButton}
												onPress={requestPermission}
											>
												<Text style={styles.cameraPermissionButtonText}>
													Grant Permission
												</Text>
											</TouchableOpacity>
										</View>
									) : !permission.granted ? (
										<View style={styles.cameraPermissionContainer}>
											<Text style={styles.cameraPermissionText}>
												Camera access is required
											</Text>
											<TouchableOpacity
												style={styles.cameraPermissionButton}
												onPress={requestPermission}
											>
												<Text style={styles.cameraPermissionButtonText}>
													Grant Permission
												</Text>
											</TouchableOpacity>
										</View>
									) : (
										<View style={styles.cameraView}>
											<CameraView style={styles.camera} facing={facing}>
												<View style={styles.cameraControls}>
													<TouchableOpacity
														style={styles.cameraButton}
														onPress={toggleCameraFacing}
													>
														<Ionicons
															name="camera-reverse"
															size={24}
															color={COLORS.textPrimary}
														/>
													</TouchableOpacity>
													<TouchableOpacity
														style={styles.takePictureButton}
														onPress={takePicture}
													>
														<View style={styles.takePictureButtonInner} />
													</TouchableOpacity>
													<TouchableOpacity
														style={styles.cameraButton}
														onPress={() => setCameraActive(false)}
													>
														<Ionicons
															name="close"
															size={24}
															color={COLORS.textPrimary}
														/>
													</TouchableOpacity>
												</View>
											</CameraView>
										</View>
									)}
								</View>
							) : (
								<View style={styles.photoPickerOptions}>
									<TouchableOpacity
										style={styles.photoPickerOption}
										onPress={() => setCameraActive(true)}
									>
										<View
											style={[
												styles.photoOptionIconContainer,
												{ backgroundColor: `${COLORS.neonBlue}20` },
											]}
										>
											<MaterialCommunityIcons
												name="camera"
												size={28}
												color={COLORS.neonBlue}
											/>
										</View>
										<Text style={styles.photoOptionText}>Take Photo</Text>
									</TouchableOpacity>

									<TouchableOpacity
										style={styles.photoPickerOption}
										onPress={selectFromGallery}
									>
										<View
											style={[
												styles.photoOptionIconContainer,
												{ backgroundColor: `${COLORS.neonPurple}20` },
											]}
										>
											<MaterialCommunityIcons
												name="image"
												size={28}
												color={COLORS.neonPurple}
											/>
										</View>
										<Text style={styles.photoOptionText}>
											Choose from Gallery
										</Text>
									</TouchableOpacity>
								</View>
							)}
						</View>
					</View>
				</Modal>

				{/* Settings Modal */}
				<Modal
					visible={isSettingsModalVisible}
					transparent={true}
					animationType="slide"
					onRequestClose={() => setIsSettingsModalVisible(false)}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContainer}>
							<View style={styles.modalHeader}>
								<Text style={styles.modalTitle}>Settings</Text>
								<TouchableOpacity
									onPress={() => setIsSettingsModalVisible(false)}
								>
									<Ionicons name="close" size={24} color={COLORS.textPrimary} />
								</TouchableOpacity>
							</View>

							<ScrollView style={styles.modalContent}>
								<View style={styles.settingItem}>
									<View style={styles.settingLabelContainer}>
										<MaterialCommunityIcons
											name="theme-light-dark"
											size={22}
											color={COLORS.neonBlue}
										/>
										<Text style={styles.settingLabel}>Dark Mode</Text>
									</View>
									<Switch
										value={isDarkMode}
										onValueChange={setIsDarkMode}
										trackColor={{ false: "#767577", true: COLORS.neonBlue }}
										thumbColor={isDarkMode ? COLORS.neonPurple : "#f4f3f4"}
										ios_backgroundColor="#3e3e3e"
									/>
								</View>

								<View style={styles.settingItem}>
									<View style={styles.settingLabelContainer}>
										<MaterialCommunityIcons
											name="bell-outline"
											size={22}
											color={COLORS.neonPurple}
										/>
										<Text style={styles.settingLabel}>Notifications</Text>
									</View>
									<Switch
										value={userData.notifications}
										onValueChange={(value) =>
											setUserData({ ...userData, notifications: value })
										}
										trackColor={{ false: "#767577", true: COLORS.neonBlue }}
										thumbColor={
											userData.notifications ? COLORS.neonPurple : "#f4f3f4"
										}
										ios_backgroundColor="#3e3e3e"
									/>
								</View>

								<View style={styles.settingItem}>
									<View style={styles.settingLabelContainer}>
										<MaterialCommunityIcons
											name="email-outline"
											size={22}
											color={COLORS.neonGreen}
										/>
										<Text style={styles.settingLabel}>Email Updates</Text>
									</View>
									<Switch
										value={userData.emailUpdates}
										onValueChange={(value) =>
											setUserData({ ...userData, emailUpdates: value })
										}
										trackColor={{ false: "#767577", true: COLORS.neonBlue }}
										thumbColor={
											userData.emailUpdates ? COLORS.neonPurple : "#f4f3f4"
										}
										ios_backgroundColor="#3e3e3e"
									/>
								</View>

								<View style={styles.settingItem}>
									<View style={styles.settingLabelContainer}>
										<MaterialCommunityIcons
											name="volume-high"
											size={22}
											color={COLORS.neonOrange}
										/>
										<Text style={styles.settingLabel}>Sound Effects</Text>
									</View>
									<Switch
										value={userData.soundEffects}
										onValueChange={(value) =>
											setUserData({ ...userData, soundEffects: value })
										}
										trackColor={{ false: "#767577", true: COLORS.neonBlue }}
										thumbColor={
											userData.soundEffects ? COLORS.neonPurple : "#f4f3f4"
										}
										ios_backgroundColor="#3e3e3e"
									/>
								</View>

								<View style={styles.settingActionContainer}>
									<TouchableOpacity style={styles.settingActionButton}>
										<Text style={styles.settingActionText}>Clear Cache</Text>
									</TouchableOpacity>

									<TouchableOpacity
										style={[
											styles.settingActionButton,
											styles.dangerActionButton,
										]}
									>
										<Text style={styles.dangerActionText}>Delete Account</Text>
									</TouchableOpacity>
								</View>
							</ScrollView>
						</View>
					</View>
				</Modal>

				{/* Join Class Modal */}
				<Modal
					visible={isJoinClassModalVisible}
					transparent={true}
					animationType="slide"
					onRequestClose={() => {
						setIsJoinClassModalVisible(false);
						setClassCode("");
						setIsValidCode(true);
					}}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.joinModalContainer}>
							<View style={styles.modalHeader}>
								<Text style={styles.modalTitle}>Join a Class</Text>
								<TouchableOpacity
									onPress={() => {
										setIsJoinClassModalVisible(false);
										setClassCode("");
										setIsValidCode(true);
									}}
								>
									<Ionicons name="close" size={24} color={COLORS.textPrimary} />
								</TouchableOpacity>
							</View>

							<Text style={styles.joinModalDescription}>
								Enter the class code provided by your teacher to join a class
							</Text>

							<TextInput
								style={[
									styles.codeInput,
									!isValidCode && styles.invalidCodeInput,
								]}
								placeholder="Enter class code"
								placeholderTextColor={COLORS.textSecondary}
								value={classCode}
								onChangeText={(text) => {
									setClassCode(text.toUpperCase());
									setIsValidCode(true);
								}}
								autoCapitalize="characters"
							/>

							{!isValidCode && (
								<Text style={styles.invalidCodeText}>
									Invalid class code. Please check and try again.
								</Text>
							)}

							<Text style={styles.hintText}>
								Try using code "IELTS2025" for a demo
							</Text>

							<TouchableOpacity
								style={styles.joinButton}
								onPress={handleJoinClass}
							>
								<Text style={styles.joinButtonText}>Join Class</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</SafeAreaView>
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
	scrollView: {
		padding: 20,
	},
	profileHeader: {
		alignItems: "center",
		marginBottom: 30,
	},
	profilePhotoContainer: {
		position: "relative",
		marginBottom: 15,
	},
	profilePhoto: {
		width: 120,
		height: 120,
		borderRadius: 60,
		borderWidth: 3,
		borderColor: COLORS.neonPurple,
	},
	editPhotoButton: {
		position: "absolute",
		bottom: 0,
		right: 0,
		backgroundColor: COLORS.neonBlue,
		width: 36,
		height: 36,
		borderRadius: 18,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: COLORS.deepBlue,
	},
	profileName: {
		color: COLORS.textPrimary,
		fontSize: 24,
		fontWeight: "700",
		marginBottom: 5,
	},
	profileRole: {
		color: COLORS.textSecondary,
		fontSize: 16,
		marginBottom: 20,
	},
	statsContainer: {
		flexDirection: "row",
		backgroundColor: "rgba(255, 255, 255, 0.08)",
		borderRadius: 12,
		paddingVertical: 15,
		paddingHorizontal: 30,
		width: "100%",
	},
	statItem: {
		flex: 1,
		alignItems: "center",
	},
	statNumber: {
		color: COLORS.neonBlue,
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 5,
	},
	statLabel: {
		color: COLORS.textSecondary,
		fontSize: 12,
	},
	statDivider: {
		width: 1,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		marginHorizontal: 15,
	},
	section: {
		marginBottom: 30,
	},
	sectionTitle: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 15,
	},
	sectionTitleRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 15,
	},
	joinClassButton: {
		flexDirection: "row",
		backgroundColor: COLORS.neonBlue,
		borderRadius: 20,
		paddingVertical: 6,
		paddingHorizontal: 12,
		alignItems: "center",
	},
	joinClassText: {
		color: COLORS.textPrimary,
		fontWeight: "600",
		fontSize: 12,
		marginRight: 5,
	},
	infoCard: {
		backgroundColor: "rgba(255, 255, 255, 0.08)",
		borderRadius: 12,
		padding: 15,
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.1)",
	},
	infoRow: {
		flexDirection: "row",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.1)",
	},
	infoTextContainer: {
		marginLeft: 15,
		flex: 1,
	},
	infoLabel: {
		color: COLORS.textSecondary,
		fontSize: 12,
		marginBottom: 3,
	},
	infoValue: {
		color: COLORS.textPrimary,
		fontSize: 15,
	},
	settingsCard: {
		backgroundColor: "rgba(255, 255, 255, 0.08)",
		borderRadius: 12,
	},
	settingsRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 15,
		paddingHorizontal: 15,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.1)",
	},
	settingsIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 15,
	},
	settingsText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		flex: 1,
	},
	classesGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	classCard: {
		backgroundColor: "rgba(255, 255, 255, 0.08)",
		borderRadius: 12,
		padding: 15,
		width: "48%",
		marginBottom: 15,
	},
	classCardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	deleteClassButton: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		justifyContent: "center",
		alignItems: "center",
	},
	className: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "700",
		marginBottom: 5,
	},
	classInstructor: {
		color: COLORS.textSecondary,
		fontSize: 12,
		marginBottom: 8,
	},
	classDateContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	classDate: {
		color: COLORS.textSecondary,
		fontSize: 11,
		marginLeft: 5,
	},
	viewCourseButton: {
		backgroundColor: COLORS.neonBlue,
		paddingVertical: 6,
		borderRadius: 6,
		alignItems: "center",
	},
	viewCourseText: {
		color: COLORS.textPrimary,
		fontSize: 12,
		fontWeight: "600",
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		backgroundColor: COLORS.deepBlue,
		borderRadius: 16,
		width: "90%",
		maxHeight: "80%",
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
	},
	joinModalContainer: {
		backgroundColor: COLORS.deepBlue,
		borderRadius: 16,
		width: "90%",
		padding: 20,
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: COLORS.cardBorder,
		paddingHorizontal: 20,
		paddingVertical: 15,
	},
	modalTitle: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: "700",
	},
	modalContent: {
		padding: 20,
	},
	inputLabel: {
		color: COLORS.textSecondary,
		fontSize: 14,
		marginBottom: 8,
	},
	textInput: {
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		borderRadius: 8,
		paddingHorizontal: 15,
		paddingVertical: 12,
		color: COLORS.textPrimary,
		marginBottom: 15,
	},
	saveButton: {
		backgroundColor: COLORS.neonBlue,
		borderRadius: 8,
		paddingVertical: 12,
		alignItems: "center",
		marginTop: 10,
	},
	saveButtonText: {
		color: COLORS.textPrimary,
		fontWeight: "600",
		fontSize: 16,
	},
	photoPickerOptions: {
		padding: 20,
	},
	photoPickerOption: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		borderRadius: 12,
		padding: 15,
		marginBottom: 15,
	},
	photoOptionIconContainer: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 15,
	},
	photoOptionText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "500",
	},
	cameraContainer: {
		height: 400,
	},
	cameraPermissionContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	cameraPermissionText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		marginBottom: 20,
		textAlign: "center",
	},
	cameraPermissionButton: {
		backgroundColor: COLORS.neonBlue,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 8,
	},
	cameraPermissionButtonText: {
		color: COLORS.textPrimary,
		fontWeight: "600",
	},
	cameraView: {
		flex: 1,
	},
	camera: {
		flex: 1,
	},
	cameraControls: {
		flex: 1,
		backgroundColor: "transparent",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "flex-end",
		paddingBottom: 20,
	},
	cameraButton: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	takePictureButton: {
		width: 70,
		height: 70,
		borderRadius: 35,
		backgroundColor: "rgba(255, 255, 255, 0.3)",
		justifyContent: "center",
		alignItems: "center",
	},
	takePictureButtonInner: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: COLORS.textPrimary,
		borderWidth: 2,
		borderColor: "black",
	},
	settingItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.cardBorder,
	},
	settingLabelContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	settingLabel: {
		color: COLORS.textPrimary,
		fontSize: 16,
		marginLeft: 15,
	},
	settingActionContainer: {
		marginTop: 20,
	},
	settingActionButton: {
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: "center",
		marginBottom: 10,
	},
	settingActionText: {
		color: COLORS.textPrimary,
		fontWeight: "600",
	},
	dangerActionButton: {
		backgroundColor: "rgba(255, 59, 48, 0.2)",
	},
	dangerActionText: {
		color: "#FF3B30",
		fontWeight: "600",
	},
	joinModalDescription: {
		color: COLORS.textSecondary,
		fontSize: 14,
		lineHeight: 20,
		marginBottom: 20,
		textAlign: "center",
	},
	codeInput: {
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
		borderRadius: 8,
		color: COLORS.textPrimary,
		padding: 12,
		fontSize: 16,
		letterSpacing: 2,
		textAlign: "center",
	},
	invalidCodeInput: {
		borderColor: "#FF5252",
	},
	invalidCodeText: {
		color: "#FF5252",
		fontSize: 12,
		marginTop: 5,
		marginBottom: 15,
	},
	hintText: {
		color: COLORS.textSecondary,
		fontSize: 12,
		fontStyle: "italic",
		marginTop: 8,
		textAlign: "center",
	},
	joinButton: {
		backgroundColor: COLORS.neonBlue,
		borderRadius: 10,
		paddingVertical: 12,
		alignItems: "center",
		marginTop: 20,
	},
	joinButtonText: {
		color: COLORS.textPrimary,
		fontWeight: "600",
		fontSize: 16,
	},
});
