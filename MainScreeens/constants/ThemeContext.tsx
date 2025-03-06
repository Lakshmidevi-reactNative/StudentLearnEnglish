import React, { createContext, useState, useContext, useEffect } from "react";
import { COLORS } from "./Colors";

// Define our theme types
export type ThemeType = "dark" | "light";

// Define the colors for each theme
export const themes = {
	dark: {
		...COLORS,
	},
	light: {
		deepBlue: "#FFFFFF",
		softPurple: "#F5F5F5",
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

// Create the provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [theme, setTheme] = useState<ThemeType>("dark");

	// Get current theme colors
	const colors = themes[theme];

	// Toggle between dark and light themes
	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
	};

	return (
		<ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);
