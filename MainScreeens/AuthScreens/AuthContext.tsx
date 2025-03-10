import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the Authentication Context
export const AuthContext = createContext();

// Custom hook to use the Auth Context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [studentInfo, setStudentInfo] = useState(null);
	const [authToken, setAuthToken] = useState(null);

	// Check if user is already logged in when app starts
	useEffect(() => {
		// Load authentication state from storage
		const loadStoredAuth = async () => {
			try {
				const storedStudentInfo = await AsyncStorage.getItem("@student_info");

				if (storedStudentInfo) {
					setStudentInfo(JSON.parse(storedStudentInfo));
					setIsAuthenticated(true);
				}
			} catch (error) {
				console.error("Failed to load authentication info", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadStoredAuth();
	}, []);

	// Login function
	const login = async (email, password) => {
		setIsLoading(true);

		try {
			const response = await fetch(
				"http://192.168.29.37:8080/learnengspring/user/do-login",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				}
			);

			const result = await response.json();

			if (
				result.statusCode === 200 &&
				result.data.login_status.login_status === "auth-success"
			) {
				// Store student info
				const studentData = result.data.student;
				setStudentInfo(studentData);
				setIsAuthenticated(true);

				// Save to AsyncStorage for persistence
				await AsyncStorage.setItem(
					"@student_info",
					JSON.stringify(studentData)
				);

				return { success: true, data: studentData };
			} else {
				return { success: false, message: "Invalid credentials" };
			}
		} catch (error) {
			console.error("Login failed:", error);
			return { success: false, message: "Network error, please try again" };
		} finally {
			setIsLoading(false);
		}
	};

	// Logout function
	const logout = async () => {
		try {
			// Clear authentication data
			setIsAuthenticated(false);
			setStudentInfo(null);

			// Remove from AsyncStorage
			await AsyncStorage.removeItem("@student_info");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	// Values to be provided to consumers of this context
	const authContextValue = {
		isLoading,
		isAuthenticated,
		studentInfo,
		login,
		logout,
	};

	return (
		<AuthContext.Provider value={authContextValue}>
			{children}
		</AuthContext.Provider>
	);
};
