import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ScrollView,
	Image,
	TouchableOpacity,
	TextInput,
	Modal,
	StyleSheet,
	Alert,
	SafeAreaView,
	StatusBar,
	Dimensions,
	Animated,
	Platform,
} from "react-native";
import { useTheme } from "../../App";
import { MaterialIcons } from "@expo/vector-icons";
import { toast } from "sonner-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker"; // Add this import

const { width } = Dimensions.get("window");

export default function ProfileScreen({ navigation }) {
	const { isDarkMode } = useTheme();
	const [loading, setLoading] = useState(true);
	const [studentData, setStudentData] = useState(null);
	const profileGetUrl = `http://192.168.29.37:8080/learnengspring/student/get-student-profile/3089`;
	const profilePutUrl = `http://192.168.29.37:8080/learnengspring/student/profile`;

	// State variables
	const [profile, setProfile] = useState({
		name: "",
		email: "",
		phone: "",
		education: "", // Changed from institute to education
		role: "English Student",
		profilePicture: "",
		student_id: "",
	});

	const [newProfile, setNewProfile] = useState({ ...profile });
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [classCode, setClassCode] = useState("");
	const [className, setClassName] = useState("");
	const [instructorName, setInstructorName] = useState("");
	const scrollY = new Animated.Value(0);

	// Add photo selection modal state
	const [isPhotoPickerVisible, setIsPhotoPickerVisible] = useState(false);

	const [enrolledClasses, setEnrolledClasses] = useState([
		{
			id: "1",
			name: "Business English",
			instructor: "John Smith",
			startDate: "01/15/2024",
		},
		{
			id: "2",
			name: "IELTS Preparation",
			instructor: "Emma Wilson",
			startDate: "02/01/2024",
		},
	]);

	// Menu and settings options
	const settingsOptions = [
		{
			id: "privacy",
			icon: "privacy-tip",
			title: "Privacy Policy",
			action: () => {},
		},
		{
			id: "terms",
			icon: "description",
			title: "Terms & Conditions",
			action: () => {},
		},
		{
			id: "delete",
			icon: "delete-forever",
			title: "Delete Account",
			action: () => {
				Alert.alert(
					"Delete Account",
					"Are you sure you want to delete your account? This action cannot be undone.",
					[
						{
							text: "Cancel",
							style: "cancel",
						},
						{
							text: "Delete",
							style: "destructive",
							onPress: () => {
								toast.error("Account deletion initiated");
								navigation.navigate("Login");
							},
						},
					]
				);
			},
			textColor: "#FF3B30",
		},
	];

	const menuItems = [
		{
			id: "edit",
			icon: "edit",
			title: "Edit Profile",
			action: handleEdit,
		},
		{
			id: "payment",
			icon: "payment",
			title: "Payment",
			action: () => {},
		},
		{
			id: "settings",
			icon: "settings",
			title: "Settings",
			action: () => setShowSettings(true),
		},
		{
			id: "logout",
			icon: "logout",
			title: "Log out",
			action: handleLogout,
			textColor: "#FF3B30",
		},
	];

	// Fetch profile data on component mount
	useEffect(() => {
		fetchProfileData();
	}, []);

	const fetchProfileData = async () => {
		setLoading(true);
		try {
			const response = await axios.get(profileGetUrl);
			if (response.data && response.data.data) {
				setStudentData(response.data.data);
				updateProfileFromStudentData(response.data.data);
			}
		} catch (err) {
			console.error("Error fetching student data:", err);
			toast.error("Failed to load profile data");
		} finally {
			setLoading(false);
		}
	};

	const updateProfileFromStudentData = (data) => {
		if (!data) return;

		const updatedProfile = {
			class_count: data.class_count || "0",
			name: data.full_name || "",
			email: data.email || "",
			phone: data.phone || "",
			education: data.institute_name || "", // Changed from institute to education
			profilePicture:
				data.photo ||
				"https://i.pinimg.com/736x/f0/91/45/f0914536d6e262f0c8a668c97222916e.jpg",
			student_id: data.student_id || "",
			role: "English Student",
		};

		setProfile(updatedProfile);
		setNewProfile(updatedProfile);
	};

	// Handler functions
	function handleEdit() {
		setNewProfile({ ...profile });
		setIsEditModalVisible(true);
	}

	// Add this function to handle profile photo change
	const handleChangeProfilePhoto = async () => {
		setIsPhotoPickerVisible(true);
	};

	// Add image picking function
	const pickImage = async (source) => {
		setIsPhotoPickerVisible(false);

		try {
			let result;

			if (source === "camera") {
				// Request camera permissions
				const cameraPermission =
					await ImagePicker.requestCameraPermissionsAsync();

				if (cameraPermission.status !== "granted") {
					toast.error("Camera permission is required");
					return;
				}

				result = await ImagePicker.launchCameraAsync({
					allowsEditing: true,
					aspect: [1, 1],
					quality: 0.7,
				});
			} else {
				// Request media library permissions
				const libraryPermission =
					await ImagePicker.requestMediaLibraryPermissionsAsync();

				if (libraryPermission.status !== "granted") {
					toast.error("Gallery permission is required");
					return;
				}

				result = await ImagePicker.launchImageLibraryAsync({
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: true,
					aspect: [1, 1],
					quality: 0.7,
				});
			}

			if (!result.canceled) {
				// Update profile photo in the state
				setNewProfile({
					...newProfile,
					profilePicture: result.assets[0].uri,
				});

				// If we're in the edit modal, only update the preview
				// The actual profile update will happen on save
				if (!isEditModalVisible) {
					setProfile({
						...profile,
						profilePicture: result.assets[0].uri,
					});

					// Upload photo to server immediately if not in edit mode
					// You would need to implement this function
					uploadProfilePhoto(result.assets[0].uri);
				}
			}
		} catch (error) {
			console.error("Error picking image:", error);
			toast.error("Failed to pick image");
		}
	};

	// Function to upload the profile photo to server
	const uploadProfilePhoto = async (photoUri) => {
		try {
			// Create a form data object
			const formData = new FormData();

			// Append the photo file
			formData.append("profilePhoto", {
				uri: photoUri,
				type: "image/jpeg", // You might want to detect actual file type
				name: "profile-photo.jpg",
			});

			formData.append("studentId", profile.student_id);

			// Send to server
			const response = await axios.post(
				`http://192.168.29.37:8080/learnengspring/student/upload-photo`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (response.data && response.data.success) {
				toast.success("Profile photo updated successfully");
			} else {
				toast.error("Failed to update profile photo");
			}
		} catch (error) {
			console.error("Error uploading photo:", error);
			toast.error("Failed to upload profile photo");
		}
	};

	function confirmChanges() {
		const updatedProfile = {
			studentId: profile.student_id,
			name: newProfile.name,
			email: newProfile.email,
			phone: newProfile.phone,
			education: newProfile.education, // Changed from institute to education
			profilePhoto: newProfile.profilePicture,
		};

		// Show loading indicator
		setLoading(true);

		// Log what we're sending to the API
		console.log("Sending updated profile:", updatedProfile);

		// Make the PUT request
		axios
			.put(profilePutUrl, updatedProfile, {
				headers: {
					"Content-Type": "application/json",
				},
			})
			.then((response) => {
				console.log("Profile updated successfully:", response.data);
				toast.success("Profile updated successfully!");

				// Update the profile state with new values
				setProfile({ ...newProfile });

				// If profile photo was changed, upload it
				if (profile.profilePicture !== newProfile.profilePicture) {
					uploadProfilePhoto(newProfile.profilePicture);
				}

				// Refresh profile data after successful update
				fetchProfileData();
			})
			.catch((error) => {
				console.error("Error updating profile:", error);
				console.error("Error details:", error.response?.data);
				toast.error("Failed to update profile");
			})
			.finally(() => {
				setLoading(false);
				setIsEditModalVisible(false);
			});
	}

	function cancelChanges() {
		setNewProfile({ ...profile });
		setIsEditModalVisible(false);
	}

	function handleInputChange(key, value) {
		setNewProfile({ ...newProfile, [key]: value });
	}

	function handleJoinClass() {
		setIsJoinModalVisible(true);
	}

	function handleSubmitClassCode() {
		if (!classCode || !className || !instructorName) {
			toast.error("Please fill all fields");
			return;
		}

		// Add the new class
		const newClass = {
			id: Date.now().toString(),
			name: className,
			instructor: instructorName,
			startDate: new Date().toLocaleDateString(),
		};

		setEnrolledClasses([...enrolledClasses, newClass]);

		// Reset form fields
		setClassCode("");
		setClassName("");
		setInstructorName("");

		toast.success("Class joined successfully!");
		setIsJoinModalVisible(false);
	}

	function handleDeleteClass(classId) {
		setEnrolledClasses(enrolledClasses.filter((item) => item.id !== classId));
		toast.success("Class removed successfully!");
	}

	function handleLogout() {
		Alert.alert("Logout", "Are you sure you want to logout?", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "Logout",
				onPress: () => {
					toast.success("Logged out successfully");
					navigation.navigate("Login");
				},
			},
		]);
	}

	const renderHeaderProfile = () => (
		<View style={styles.headerProfile}>
			<TouchableOpacity
				onPress={() => navigation.goBack()}
				style={[styles.backButton, isDarkMode && styles.darkBackButton]}
			>
				<MaterialIcons
					name="arrow-back"
					size={22}
					color={isDarkMode ? "#fff" : "#333"}
				/>
			</TouchableOpacity>

			<View style={styles.profileImageWrapper}>
				<Image
					source={{
						uri: "https://i.pinimg.com/736x/f0/91/45/f0914536d6e262f0c8a668c97222916e.jpg",
					}} // Add a local fallback image
					style={styles.profileImage}
				/>
			</View>

			<Text style={[styles.profileName, isDarkMode && styles.darkText]}>
				{profile.name}
			</Text>
			<Text style={[styles.profileRole, isDarkMode && styles.darkSubText]}>
				{profile.role}
			</Text>

			{/* Profile Stats */}
			<View style={styles.statsContainer}>
				<View style={styles.statItem}>
					<Text style={[styles.statValue, isDarkMode && styles.darkText]}>
						{enrolledClasses.length}
					</Text>
					<Text style={[styles.statLabel, isDarkMode && styles.darkSubText]}>
						Classes
					</Text>
				</View>

				<View style={styles.statDivider} />

				<View style={styles.statItem}>
					<Text style={[styles.statValue, isDarkMode && styles.darkText]}>
						30 days
					</Text>
					<Text style={[styles.statLabel, isDarkMode && styles.darkSubText]}>
						License End
					</Text>
				</View>
			</View>
		</View>
	);

	// Render helper functions
	const renderInfoSection = () => (
		<View style={[styles.section, isDarkMode && styles.darkSection]}>
			<View style={styles.sectionHeader}>
				<MaterialIcons
					name="person"
					size={20}
					color={isDarkMode ? "#7c4dff" : "#012269"}
				/>
				<Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
					Personal Information
				</Text>
			</View>

			<View style={styles.infoList}>
				<View style={styles.infoItem}>
					<Text style={[styles.infoLabel, isDarkMode && styles.darkSubText]}>
						Email
					</Text>
					<Text style={[styles.infoValue, isDarkMode && styles.darkText]}>
						{profile.email}
					</Text>
				</View>

				<View style={styles.infoItem}>
					<Text style={[styles.infoLabel, isDarkMode && styles.darkSubText]}>
						Phone
					</Text>
					<Text style={[styles.infoValue, isDarkMode && styles.darkText]}>
						{profile.phone}
					</Text>
				</View>

				<View style={styles.infoItem}>
					<Text style={[styles.infoLabel, isDarkMode && styles.darkSubText]}>
						Education
					</Text>
					<Text style={[styles.infoValue, isDarkMode && styles.darkText]}>
						{profile.education}
					</Text>
				</View>
			</View>
		</View>
	);

	const renderMenuSection = () => (
		<View style={[styles.section, isDarkMode && styles.darkSection]}>
			<View style={styles.sectionHeader}>
				<MaterialIcons
					name="settings"
					size={20}
					color={isDarkMode ? "#7c4dff" : "#012269"}
				/>
				<Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
					Account Settings
				</Text>
			</View>

			<View style={styles.menuList}>
				{menuItems.map((item, index) => (
					<TouchableOpacity
						key={item.id}
						style={[
							styles.menuItem,
							index !== menuItems.length - 1 && styles.menuItemBorder,
						]}
						onPress={item.action}
					>
						<View
							style={[
								styles.menuIconContainer,
								{
									backgroundColor: item.textColor
										? `${item.textColor}15`
										: isDarkMode
										? "#3d3a50"
										: "#f0eaff",
								},
							]}
						>
							<MaterialIcons
								name={item.icon}
								size={20}
								color={item.textColor || (isDarkMode ? "#7c4dff" : "#012269")}
							/>
						</View>

						<Text
							style={[
								styles.menuItemText,
								isDarkMode && styles.darkText,
								item.textColor && { color: item.textColor },
							]}
						>
							{item.title}
						</Text>

						<MaterialIcons
							name="keyboard-arrow-right"
							size={24}
							color={isDarkMode ? "#666" : "#aaa"}
						/>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);

	const renderClassesSection = () => (
		<View style={styles.classesSection}>
			<View style={styles.sectionHeader}>
				<MaterialIcons
					name="school"
					size={20}
					color={isDarkMode ? "#7c4dff" : "#012269"}
				/>
				<Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
					Enrolled Classes
				</Text>
				<TouchableOpacity
					style={[styles.addClassButton, isDarkMode && styles.darkAddButton]}
					onPress={handleJoinClass}
				>
					<MaterialIcons name="add" size={18} color="#fff" />
				</TouchableOpacity>
			</View>

			{enrolledClasses.length > 0 ? (
				<View style={styles.classGrid}>
					{enrolledClasses.map((classItem) => (
						<View
							key={classItem.id}
							style={[styles.classCard, isDarkMode && styles.darkClassCard]}
						>
							<View style={styles.classCardTop}>
								<View
									style={[
										styles.classTypeTag,
										{ backgroundColor: isDarkMode ? "#3a1d8f" : "#ece3ff" },
									]}
								>
									<Text
										style={[
											styles.classTypeText,
											{ color: isDarkMode ? "#c4b5fd" : "#012269" },
										]}
									>
										Course
									</Text>
								</View>

								<TouchableOpacity
									onPress={() => handleDeleteClass(classItem.id)}
								>
									<MaterialIcons
										name="delete-outline"
										size={20}
										color={isDarkMode ? "#999" : "#888"}
									/>
								</TouchableOpacity>
							</View>

							<Text style={[styles.className, isDarkMode && styles.darkText]}>
								{classItem.name}
							</Text>

							<View style={styles.classDetail}>
								<MaterialIcons
									name="person"
									size={16}
									color={isDarkMode ? "#7c4dff" : "#012269"}
									style={styles.classIcon}
								/>
								<Text
									style={[styles.classText, isDarkMode && styles.darkSubText]}
								>
									{classItem.instructor}
								</Text>
							</View>

							<View style={styles.classDetail}>
								<MaterialIcons
									name="calendar-today"
									size={16}
									color={isDarkMode ? "#7c4dff" : "#012269"}
									style={styles.classIcon}
								/>
								<Text
									style={[styles.classText, isDarkMode && styles.darkSubText]}
								>
									Started: {classItem.startDate}
								</Text>
							</View>

							<TouchableOpacity
								style={[
									styles.classButton,
									isDarkMode && styles.darkClassButton,
								]}
							>
								<Text
									style={[
										styles.classButtonText,
										{ color: isDarkMode ? "#c4b5fd" : "#012269" },
									]}
								>
									View Course
								</Text>
								<MaterialIcons
									name="arrow-forward"
									size={18}
									color={isDarkMode ? "#c4b5fd" : "#012269"}
								/>
							</TouchableOpacity>
						</View>
					))}
				</View>
			) : (
				<View
					style={[styles.emptyClassCard, isDarkMode && styles.darkEmptyClass]}
				>
					<MaterialIcons
						name="school"
						size={40}
						color={isDarkMode ? "#424363" : "#d8d2e9"}
					/>
					<Text style={[styles.emptyText, isDarkMode && styles.darkText]}>
						You're not enrolled in any classes yet
					</Text>
					<TouchableOpacity
						style={[styles.joinButton, isDarkMode && styles.darkJoinButton]}
						onPress={handleJoinClass}
					>
						<Text style={styles.joinButtonText}>Join Your First Class</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);

	return (
		<SafeAreaView
			style={[styles.container, isDarkMode && styles.darkContainer]}
		>
			<StatusBar
				barStyle={isDarkMode ? "light-content" : "dark-content"}
				backgroundColor="transparent"
				translucent
			/>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: false }
				)}
				scrollEventThrottle={16}
			>
				{renderHeaderProfile()}
				{renderInfoSection()}
				{renderMenuSection()}
				{renderClassesSection()}
			</ScrollView>

			{/* Edit Profile Modal */}
			<Modal
				visible={isEditModalVisible}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setIsEditModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View
						style={[
							styles.modalContent,
							isDarkMode ? styles.darkModalContent : styles.lightModalContent,
						]}
					>
						<View style={styles.modalHeader}>
							<Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
								Edit Profile
							</Text>
							<TouchableOpacity
								style={styles.closeButton}
								onPress={cancelChanges}
							>
								<MaterialIcons
									name="close"
									size={24}
									color={isDarkMode ? "#fff" : "#333"}
								/>
							</TouchableOpacity>
						</View>

						{/* Add profile photo edit section */}
						<View style={styles.editProfilePhotoSection}>
							<Image
								source={{ uri: newProfile.profilePicture }}
								style={styles.editProfileImage}
							/>
							<TouchableOpacity
								style={styles.changePhotoButton}
								onPress={handleChangeProfilePhoto}
							>
								<MaterialIcons
									name="camera-alt"
									size={18}
									color="#fff"
									style={styles.buttonIcon}
								/>
								<Text style={styles.changePhotoText}>Change Photo</Text>
							</TouchableOpacity>
						</View>

						{Object.entries(newProfile).map(
							([key, value]) =>
								key !== "profilePicture" &&
								key !== "role" &&
								key !== "student_id" && (
									<View key={key} style={styles.formGroup}>
										<Text
											style={[
												styles.formLabel,
												isDarkMode && styles.darkSubText,
											]}
										>
											{key.charAt(0).toUpperCase() + key.slice(1)}
										</Text>
										<TextInput
											style={[
												styles.formInput,
												isDarkMode ? styles.darkInput : styles.lightInput,
											]}
											value={value}
											onChangeText={(text) => handleInputChange(key, text)}
											placeholderTextColor={isDarkMode ? "#777" : "#999"}
										/>
									</View>
								)
						)}

						<TouchableOpacity
							style={[styles.saveButton, isDarkMode && styles.darkSaveButton]}
							onPress={confirmChanges}
						>
							<Text style={styles.saveButtonText}>Save Changes</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			{/* Photo Select Modal */}
			<Modal
				visible={isPhotoPickerVisible}
				transparent={true}
				animationType="slide"
				onRequestClose={() => setIsPhotoPickerVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View
						style={[
							styles.photoPickerContent,
							isDarkMode ? styles.darkModalContent : styles.lightModalContent,
						]}
					>
						<View style={styles.modalHeader}>
							<Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
								Change Profile Photo
							</Text>
							<TouchableOpacity
								style={styles.closeButton}
								onPress={() => setIsPhotoPickerVisible(false)}
							>
								<MaterialIcons
									name="close"
									size={24}
									color={isDarkMode ? "#fff" : "#333"}
								/>
							</TouchableOpacity>
						</View>

						<TouchableOpacity
							style={styles.photoOption}
							onPress={() => pickImage("camera")}
						>
							<MaterialIcons
								name="camera-alt"
								size={24}
								color={isDarkMode ? "#7c4dff" : "#012269"}
								style={styles.photoOptionIcon}
							/>
							<Text
								style={[styles.photoOptionText, isDarkMode && styles.darkText]}
							>
								Take Photo
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.photoOption}
							onPress={() => pickImage("gallery")}
						>
							<MaterialIcons
								name="photo-library"
								size={24}
								color={isDarkMode ? "#7c4dff" : "#012269"}
								style={styles.photoOptionIcon}
							/>
							<Text
								style={[styles.photoOptionText, isDarkMode && styles.darkText]}
							>
								Choose from Gallery
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								styles.cancelButton,
								isDarkMode && styles.darkCancelButton,
							]}
							onPress={() => setIsPhotoPickerVisible(false)}
						>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			{/* Join Class Modal */}
			<Modal
				visible={isJoinModalVisible}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setIsJoinModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View
						style={[
							styles.modalContent,
							isDarkMode ? styles.darkModalContent : styles.lightModalContent,
						]}
					>
						<View style={styles.modalHeader}>
							<Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
								Join a New Class
							</Text>
							<TouchableOpacity
								style={styles.closeButton}
								onPress={() => setIsJoinModalVisible(false)}
							>
								<MaterialIcons
									name="close"
									size={24}
									color={isDarkMode ? "#fff" : "#333"}
								/>
							</TouchableOpacity>
						</View>

						<View style={styles.formGroup}>
							<Text
								style={[styles.formLabel, isDarkMode && styles.darkSubText]}
							>
								Class Code
							</Text>
							<TextInput
								style={[
									styles.formInput,
									isDarkMode ? styles.darkInput : styles.lightInput,
								]}
								placeholder="Enter class code"
								placeholderTextColor={isDarkMode ? "#777" : "#999"}
								value={classCode}
								onChangeText={setClassCode}
							/>
						</View>

						<View style={styles.formGroup}>
							<Text
								style={[styles.formLabel, isDarkMode && styles.darkSubText]}
							>
								Class Name
							</Text>
							<TextInput
								style={[
									styles.formInput,
									isDarkMode ? styles.darkInput : styles.lightInput,
								]}
								placeholder="Enter class name"
								placeholderTextColor={isDarkMode ? "#777" : "#999"}
								value={className}
								onChangeText={setClassName}
							/>
						</View>

						<View style={styles.formGroup}>
							<Text
								style={[styles.formLabel, isDarkMode && styles.darkSubText]}
							>
								Instructor Name
							</Text>
							<TextInput
								style={[
									styles.formInput,
									isDarkMode ? styles.darkInput : styles.lightInput,
								]}
								placeholder="Enter instructor name"
								placeholderTextColor={isDarkMode ? "#777" : "#999"}
								value={instructorName}
								onChangeText={setInstructorName}
							/>
						</View>

						<TouchableOpacity
							style={[styles.saveButton, isDarkMode && styles.darkSaveButton]}
							onPress={handleSubmitClassCode}
						>
							<Text style={styles.saveButtonText}>Join Class</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			{/* Settings Modal */}
			<Modal
				visible={showSettings}
				transparent={true}
				animationType="slide"
				onRequestClose={() => setShowSettings(false)}
			>
				<View style={styles.modalOverlay}>
					<View
						style={[
							styles.modalContent,
							styles.settingsModal,
							isDarkMode ? styles.darkModalContent : styles.lightModalContent,
						]}
					>
						<View style={styles.modalHeader}>
							<Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
								Settings
							</Text>
							<TouchableOpacity
								style={styles.closeButton}
								onPress={() => setShowSettings(false)}
							>
								<MaterialIcons
									name="close"
									size={24}
									color={isDarkMode ? "#fff" : "#333"}
								/>
							</TouchableOpacity>
						</View>

						{settingsOptions.map((option, index) => (
							<TouchableOpacity
								key={option.id}
								style={[
									styles.settingsItem,
									index !== settingsOptions.length - 1 &&
										styles.settingsDivider,
								]}
								onPress={option.action}
							>
								<View
									style={[
										styles.settingsIconWrap,
										{
											backgroundColor: option.textColor
												? `${option.textColor}15`
												: isDarkMode
												? "#3d3a50"
												: "#f0eaff",
										},
									]}
								>
									<MaterialIcons
										name={option.icon}
										size={20}
										color={
											option.textColor || (isDarkMode ? "#7c4dff" : "#012269")
										}
									/>
								</View>
								<Text
									style={[
										styles.settingsText,
										isDarkMode && styles.darkText,
										option.textColor && { color: option.textColor },
									]}
								>
									{option.title}
								</Text>
								{option.id !== "delete" && (
									<MaterialIcons
										name="keyboard-arrow-right"
										size={24}
										color={isDarkMode ? "#666" : "#aaa"}
									/>
								)}
							</TouchableOpacity>
						))}
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	darkContainer: {
		backgroundColor: "#121218",
	},
	scrollContent: {
		paddingBottom: 40,
	},
	headerProfile: {
		paddingTop: Platform.OS === "android" ? 50 : 20,
		paddingBottom: 25,
		paddingHorizontal: 20,
		position: "relative",
		alignItems: "center",
	},
	backButton: {
		position: "absolute",
		top: Platform.OS === "android" ? 50 : 20,
		left: 20,
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 2,
		zIndex: 1,
	},
	darkBackButton: {
		backgroundColor: "#252530",
	},
	profileImageWrapper: {
		marginTop: 30,
		marginBottom: 15,
		position: "relative",
	},
	profileImage: {
		width: 110,
		height: 110,
		borderRadius: 55,
		borderWidth: 4,
		borderColor: "#fff",
	},
	editImageButton: {
		position: "absolute",
		bottom: 2,
		right: 2,
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#012269",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "#fff",
	},
	profileName: {
		fontSize: 24,
		fontWeight: "700",
		color: "#222",
		marginBottom: 5,
	},
	profileRole: {
		fontSize: 16,
		color: "#666",
		marginBottom: 20,
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		backgroundColor: "#fff",
		borderRadius: 16,
		paddingVertical: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.05,
		shadowRadius: 12,
		elevation: 2,
	},
	statItem: {
		flex: 1,
		alignItems: "center",
	},
	statValue: {
		fontSize: 20,
		fontWeight: "700",
		color: "#333",
		marginBottom: 3,
	},
	statLabel: {
		fontSize: 13,
		color: "#888",
	},
	statDivider: {
		width: 1,
		height: 30,
		backgroundColor: "#eee",
	},

	// Section styling
	section: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 20,
		marginHorizontal: 20,
		marginTop: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.05,
		shadowRadius: 12,
		elevation: 2,
	},
	darkSection: {
		backgroundColor: "#1d1d26",
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#222",
		marginLeft: 10,
		flex: 1,
	},

	// Info section
	infoList: {
		marginTop: 5,
	},
	infoItem: {
		marginBottom: 16,
	},
	infoLabel: {
		fontSize: 12,
		color: "#888",
		marginBottom: 4,
	},
	infoValue: {
		fontSize: 16,
		color: "#333",
		fontWeight: "500",
	},

	// Menu section
	menuList: {
		marginTop: 5,
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
	},
	menuItemBorder: {
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	menuIconContainer: {
		width: 38,
		height: 38,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 14,
	},
	menuItemText: {
		fontSize: 16,
		color: "#333",
		flex: 1,
		fontWeight: "500",
	},

	// Classes section
	classesSection: {
		marginTop: 20,
		marginHorizontal: 20,
		marginBottom: 20,
	},
	addClassButton: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: "#012269",
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 10,
		shadowColor: "#012269",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 3,
	},
	darkAddButton: {
		backgroundColor: "#7c4dff",
	},
	classGrid: {
		marginTop: 10,
	},
	classCard: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.05,
		shadowRadius: 12,
		elevation: 2,
	},
	darkClassCard: {
		backgroundColor: "#1d1d26",
	},
	classCardTop: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	classTypeTag: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 6,
	},
	classTypeText: {
		fontSize: 12,
		fontWeight: "500",
	},
	className: {
		fontSize: 18,
		fontWeight: "700",
		color: "#222",
		marginBottom: 14,
	},
	classDetail: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	classIcon: {
		marginRight: 8,
	},
	classText: {
		fontSize: 14,
		color: "#666",
	},
	classButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#f5f0ff",
		borderRadius: 10,
		paddingVertical: 12,
		marginTop: 12,
	},
	darkClassButton: {
		backgroundColor: "#2a2541",
	},
	classButtonText: {
		fontSize: 14,
		fontWeight: "600",
		marginRight: 6,
	},
	emptyClassCard: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 30,
		marginTop: 10,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.05,
		shadowRadius: 12,
		elevation: 2,
	},
	darkEmptyClass: {
		backgroundColor: "#1d1d26",
	},
	emptyText: {
		color: "#666",
		fontSize: 16,
		textAlign: "center",
		marginVertical: 15,
	},
	joinButton: {
		backgroundColor: "#012269",
		borderRadius: 10,
		paddingVertical: 12,
		paddingHorizontal: 20,
		marginTop: 5,
	},
	darkJoinButton: {
		backgroundColor: "#7c4dff",
	},
	joinButtonText: {
		color: "#fff",
		fontWeight: "600",
		fontSize: 14,
	},

	// Modal styles
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		width: "90%",
		backgroundColor: "#fff",
		borderRadius: 20,
		padding: 24,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.1,
		shadowRadius: 20,
		elevation: 5,
	},
	darkModalContent: {
		backgroundColor: "#1d1d26",
	},
	lightModalContent: {
		backgroundColor: "#fff",
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#222",
	},
	closeButton: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: "#f5f5f5",
		justifyContent: "center",
		alignItems: "center",
	},
	formGroup: {
		marginBottom: 20,
	},
	formLabel: {
		fontSize: 14,
		color: "#666",
		marginBottom: 8,
	},
	formInput: {
		borderWidth: 1,
		borderColor: "#e0e0e0",
		borderRadius: 12,
		padding: 12,
		fontSize: 16,
		backgroundColor: "#f9f9f9",
	},
	darkInput: {
		backgroundColor: "#2a2a36",
		borderColor: "#3d3d4e",
		color: "#fff",
	},
	lightInput: {
		backgroundColor: "#f9f9f9",
		borderColor: "#e0e0e0",
		color: "#333",
	},
	saveButton: {
		backgroundColor: "#012269",
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
		marginTop: 10,
	},
	darkSaveButton: {
		backgroundColor: "#7c4dff",
	},
	saveButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	settingsModal: {
		paddingHorizontal: 0,
	},
	settingsItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 16,
		paddingHorizontal: 24,
	},
	settingsDivider: {
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	settingsIconWrap: {
		width: 40,
		height: 40,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	settingsText: {
		fontSize: 16,
		color: "#333",
		flex: 1,
		fontWeight: "500",
	},

	// New styles for profile photo editing
	editProfilePhotoSection: {
		alignItems: "center",
		marginBottom: 20,
	},
	editProfileImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: 12,
	},
	changePhotoButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#012269",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 20,
	},
	buttonIcon: {
		marginRight: 6,
	},
	changePhotoText: {
		color: "#fff",
		fontWeight: "600",
		fontSize: 14,
	},

	// Photo picker modal styles
	photoPickerContent: {
		width: "85%",
		borderRadius: 20,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.1,
		shadowRadius: 20,
		elevation: 5,
	},
	photoOption: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	photoOptionIcon: {
		marginRight: 16,
	},
	photoOptionText: {
		fontSize: 16,
		color: "#333",
	},
	cancelButton: {
		backgroundColor: "#f5f5f5",
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
		marginTop: 20,
	},
	darkCancelButton: {
		backgroundColor: "#2a2a36",
	},
	cancelButtonText: {
		color: "#555",
		fontSize: 16,
		fontWeight: "600",
	},

	// Helper styles for dark mode
	darkText: {
		color: "#fff",
	},
	darkSubText: {
		color: "#aaa",
	},
});
