// AuthColors.ts - Dedicated colors for authentication screens
import { COLORS } from "../constants/Colors";

// Auth-specific colors that work well with your existing theme
export const AUTH_COLORS = {
	// Backgrounds
	gradientStart: COLORS.deepBlue,
	gradientEnd: COLORS.softPurple,
	cardBackground: "#1D2235", // Slightly lighter than deep blue for card backgrounds
	inputBackground: "#252A3D", // Subtle input field background

	// Text
	titleText: "#FFFFFF", // White for main titles
	primaryText: "#FFFFFF", // White for primary text
	secondaryText: "#A0A7B5", // Light gray for secondary text
	accentText: COLORS.neonBlue, // Bright blue for accent text

	// UI Elements
	primaryButton: COLORS.neonBlue, // Bright blue for primary buttons
	outlineButtonBorder: COLORS.neonBlue, // Border for outline buttons
	inputBorder: "#384057", // Subtle border for inputs
	inputBorderFocus: COLORS.neonBlue, // Highlighted border for focused inputs

	// Status
	error: "#FF5252", // Red for error messages
	success: "#4CAF50", // Green for success messages
	divider: "#384057", // Color for dividers

	// Icons
	icon: "#A0A7B5", // Light gray for icons
	iconActive: COLORS.neonBlue, // Bright blue for active icons

	// Placeholders
	placeholder: "#636B7E", // Gray for placeholder text

	// Brand colors
	brandPrimary: COLORS.neonBlue, // Primary brand color (blue)
	brandSecondary: COLORS.accent, // Secondary brand color
};

// Light theme version of auth colors
export const AUTH_COLORS_LIGHT = {
	// Backgrounds
	gradientStart: "#F0F7FF", // Light blue gradient start
	gradientEnd: "#F0EFFF", // Light purple gradient end
	cardBackground: "#FFFFFF", // White card background
	inputBackground: "#F5F7FA", // Very light gray input background

	// Text
	titleText: "#2C3E50", // Dark blue for main titles
	primaryText: "#2C3E50", // Dark blue for primary text
	secondaryText: "#7F8C8D", // Medium gray for secondary text
	accentText: "#0085CC", // Bright blue for accent text

	// UI Elements
	primaryButton: "#0085CC", // Bright blue for primary buttons
	outlineButtonBorder: "#0085CC", // Border for outline buttons
	inputBorder: "#D9E2EC", // Light gray border for inputs
	inputBorderFocus: "#0085CC", // Highlighted border for focused inputs

	// Status
	error: "#E74C3C", // Red for error messages
	success: "#2ECC71", // Green for success messages
	divider: "#D9E2EC", // Color for dividers

	// Icons
	icon: "#7F8C8D", // Medium gray for icons
	iconActive: "#0085CC", // Bright blue for active icons

	// Placeholders
	placeholder: "#B2BDCD", // Light gray for placeholder text

	// Brand colors
	brandPrimary: "#0085CC", // Primary brand color (blue)
	brandSecondary: "#8000B3", // Secondary brand color
};

// Function to get the appropriate color set based on theme
export const getAuthColors = (isDarkMode: boolean) => {
	return isDarkMode ? AUTH_COLORS : AUTH_COLORS_LIGHT;
};

export default getAuthColors;
