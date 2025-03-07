import React, { createContext, useState, useContext, useEffect } from "react";
import { COLORS } from "./Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define our theme types
export type ThemeType = "dark" | "light";

// Define the colors for each theme
export const themes = {
	dark: {
		...COLORS,
	},
	light: {
		deepBlue: "#FFFFFF",
		softPurple: "#F0F0FF", // Lighter version for gradients
		neonBlue: "#0085CC",
		neonPurple: "#8000B3",
		neonGreen: COLORS.neonGreen,
		neonOrange: COLORS.neonOrange,
		neonPink: COLORS.neonPink,
		neonYellow: COLORS.neonYellow,
		textPrimary: "#333333",
		textSecondary: "#666666",
		cardBg: "rgba(0, 0, 0, 0.06)",
		cardBorder: "rgba(0, 0, 0, 0.1)",
	},
};

// Create the context with default values
type ThemeContextType = {
	theme: ThemeType;
	colors: typeof COLORS;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
	theme: "dark",
	colors: themes.dark,
	toggleTheme: () => {},
});

// Theme storage key
const THEME_STORAGE_KEY = '@LearnEng:theme';

// Create the provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [theme, setTheme] = useState<ThemeType>("dark");
	const [isLoading, setIsLoading] = useState(true);

	// Load saved theme on startup
	useEffect(() => {
		const loadTheme = async () => {
			try {
				const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
				if (savedTheme !== null) {
					setTheme(savedTheme as ThemeType);
				}
			} catch (error) {
				console.warn('Failed to load theme preference:', error);
			} finally {
				setIsLoading(false);
			}
		};

		loadTheme();
	}, []);

	// Get current theme colors
	const colors = themes[theme];

	// Toggle between dark and light themes
	const toggleTheme = async () => {
		const newTheme = theme === "dark" ? "light" : "dark";
		setTheme(newTheme);
		
		// Save theme preference
		try {
			await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
		} catch (error) {
			console.warn('Failed to save theme preference:', error);
		}
	};

	if (isLoading) {
		// You could return a loading component here if needed
		return null;
	}

	return (
		<ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);