import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import {
	MaterialCommunityIcons,
	FontAwesome5,
	Ionicons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import HomeScreen from "./MainScreeens/HomeScreen";
import CustomDrawerContent from "./MainScreeens/CustomDrawerContent";
import AnimatedTabBar from "./MainScreeens/AnimatedTabBar";
import ResourceDetailScreen from "./MainScreeens/ResourceDetailScreen";
import ResourcesScreen from "./MainScreeens/ResourcesScreen";
import ProfileScreen from "./MainScreeens/ProfileScreen";
import { useTheme } from "./MainScreeens/constants/ThemeContext";

// Create navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Placeholder screens with common gradient background
const CommonScreen = ({ title, subtitle = "Coming soon..." }) => {
	const { colors } = useTheme();

	return (
		<LinearGradient
			colors={[colors.deepBlue, colors.softPurple]}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			<View style={styles.center}>
				<Text style={[styles.title, { color: colors.textPrimary }]}>
					{title}
				</Text>
				<Text style={[styles.subtitle, { color: colors.textSecondary }]}>
					{subtitle}
				</Text>
			</View>
		</LinearGradient>
	);
};

import LearnScreen from "./MainScreeens/LearnScreen";
import ListenEngScreen from "./MainScreeens/learning/ListenEngScreen";
import SpeakEngScreen from "./MainScreeens/learning/SpeakEngScreen";
import ReadEngScreen from "./MainScreeens/learning/ReadEngScreen";
import WriteEngScreen from "./MainScreeens/learning/WriteEngScreen";
import TypeEngScreen from "./MainScreeens/learning/TypeEngScreen";
import PromptEngScreen from "./MainScreeens/learning/PromptEngScreen";

import ClassesScreen from "./MainScreeens/ClassesScreen";
import { COLORS } from "./MainScreeens/constants/Colors";

import PremiumScreen from "./MainScreeens/PremiumScreen";
// Bottom tab navigator
function TabNavigator() {
	return (
		<Tab.Navigator
			tabBar={(props) => <AnimatedTabBar {...props} />}
			screenOptions={{ headerShown: false }}
		>
			<Tab.Screen name="Home" component={HomeScreen} />
			<Tab.Screen name="Learn" component={LearnScreen} />
			<Tab.Screen name="Classes" component={ClassesScreen} />
			<Tab.Screen
				name="Resources"
				component={ResourcesScreen}
				options={{ unmountOnBlur: true }}
			/>
		</Tab.Navigator>
	);
}

// Main drawer navigator
function DrawerNavigator() {
	return (
		<Drawer.Navigator
			drawerContent={(props) => <CustomDrawerContent {...props} />}
			screenOptions={{
				headerShown: false,
				drawerActiveTintColor: COLORS.neonBlue,
				drawerInactiveTintColor: COLORS.textSecondary,
				drawerStyle: {
					backgroundColor: COLORS.deepBlue,
					width: 280,
				},
			}}
		>
			<Drawer.Screen
				name="TabNavigator"
				component={TabNavigator}
				options={{
					title: "Home",
					drawerIcon: ({ color }) => (
						<MaterialCommunityIcons name="home" size={22} color={color} />
					),
				}}
			/>
			<Drawer.Screen
				name="Learn"
				component={LearnScreen}
				options={{
					title: "Learn & Practice",
					drawerIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="book-open-variant"
							size={22}
							color={color}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="Classes"
				component={ClassesScreen}
				options={{
					title: "My Classes",
					drawerIcon: ({ color }) => (
						<FontAwesome5 name="chalkboard-teacher" size={20} color={color} />
					),
				}}
			/>
			<Drawer.Screen
				name="Premium"
				component={PremiumScreen}
				options={{
					title: "Purchase (Premium)",
					drawerIcon: ({ color }) => (
						<MaterialCommunityIcons name="crown" size={22} color={color} />
					),
				}}
			/>
		</Drawer.Navigator>
	);
}

function RootStack() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Main" component={DrawerNavigator} />
			<Stack.Screen name="ListenEng" component={ListenEngScreen} />
			<Stack.Screen name="SpeakEng" component={SpeakEngScreen} />
			<Stack.Screen name="ReadEng" component={ReadEngScreen} />
			<Stack.Screen name="WriteEng" component={WriteEngScreen} />
			<Stack.Screen name="TypeEng" component={TypeEngScreen} />
			<Stack.Screen name="PromptEng" component={PromptEngScreen} />
			<Stack.Screen name="ResourceDetail" component={ResourceDetailScreen} />
			<Stack.Screen name="Profile" component={ProfileScreen} />
		</Stack.Navigator>
	);
}

export default function App() {
	return (
		<SafeAreaProvider style={styles.container}>
			<Toaster />
			<NavigationContainer>
				<RootStack />
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: COLORS.textPrimary,
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 16,
		color: COLORS.textSecondary,
	},
});
