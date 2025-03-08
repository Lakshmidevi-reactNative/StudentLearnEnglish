import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
import { ThemeProvider } from "./MainScreeens/constants/ThemeContext";
import RoleplayAttemptScreen from "./MainScreeens/assignments/RoleplayAttemptScreen";
import LanguageAttemptScreen from "./MainScreeens/assignments/LanguageAttemptScreen";
import TypingPracticeScreen from "./MainScreeens/assignments/TypingPracticeScreen";

// Import authentication screens
import SplashScreen from "./MainScreeens/AuthScreens/SplashScreen";
import LoginScreen from "./MainScreeens/AuthScreens/LoginScreen";
import SignupScreen from "./MainScreeens/AuthScreens/SignupScreen";
import OnboardingScreen from "./MainScreeens/AuthScreens/OnboardingScreen";
import WelcomeScreen from "./MainScreeens/AuthScreens/WelcomeScreen";

// Create navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const LearnStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

// Placeholder screens with common gradient background
const CommonScreen: React.FC<{ title: string; subtitle?: string }> = ({
	title,
	subtitle = "Coming soon...",
}) => {
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
import ContentListTemplate from "./MainScreeens/learning/ContentListTemplate";

import ClassesScreen from "./MainScreeens/ClassesScreen";
import { COLORS } from "./MainScreeens/constants/Colors";
import { useTheme } from "./MainScreeens/constants/ThemeContext";

import PremiumScreen from "./MainScreeens/PremiumScreen";
import LanguageResult from "./MainScreeens/ResultPages/LanguageResult";
import RoleplayResult from "./MainScreeens/ResultPages/RolePlayResult";
import TypingResult from "./MainScreeens/ResultPages/TypingResult";

// Authentication Stack Navigator - manages auth flow
function AuthStackNavigator() {
	return (
		<AuthStack.Navigator
			initialRouteName="Splash"
			screenOptions={{ headerShown: false }}
		>
			<AuthStack.Screen name="Splash" component={SplashScreen} />

			<AuthStack.Screen name="Welcome" component={WelcomeScreen} />
			<AuthStack.Screen name="Login" component={LoginScreen} />
			<AuthStack.Screen name="Signup" component={SignupScreen} />
			<AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
		</AuthStack.Navigator>
	);
}

// Learn Stack Navigator - manages the learning section flow
function LearnStackNavigator() {
	return (
		<LearnStack.Navigator screenOptions={{ headerShown: false }}>
			<LearnStack.Screen name="LearnMain" component={LearnScreen} />
			<LearnStack.Screen name="Contents" component={ContentListTemplate} />
			<LearnStack.Screen name="ListenEng" component={ListenEngScreen} />
			<LearnStack.Screen name="SpeakEng" component={SpeakEngScreen} />
			<LearnStack.Screen name="ReadEng" component={ReadEngScreen} />
			<LearnStack.Screen name="WriteEng" component={WriteEngScreen} />
			<LearnStack.Screen name="TypeEng" component={TypeEngScreen} />
			<LearnStack.Screen name="PromptEng" component={PromptEngScreen} />
		</LearnStack.Navigator>
	);
}

// Bottom tab navigator
function TabNavigator() {
	return (
		<Tab.Navigator
			tabBar={(props) => <AnimatedTabBar {...props} />}
			screenOptions={{ headerShown: false }}
		>
			<Tab.Screen name="Home" component={HomeScreen} />
			<Tab.Screen name="Learn" component={LearnStackNavigator} />
			<Tab.Screen name="Classes" component={ClassesScreen} />
			<Tab.Screen name="Resources" component={ResourcesScreen} options={{}} />
		</Tab.Navigator>
	);
}

// Main drawer navigator
function DrawerNavigator() {
	const { colors } = useTheme();

	return (
		<Drawer.Navigator
			drawerContent={(props) => <CustomDrawerContent {...props} />}
			screenOptions={{
				headerShown: false,
				drawerActiveTintColor: colors.neonBlue,
				drawerInactiveTintColor: colors.textSecondary,
				drawerStyle: {
					backgroundColor: colors.deepBlue,
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
				component={LearnStackNavigator}
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
			<Stack.Screen name="ResourceDetail" component={ResourceDetailScreen} />
			<Stack.Screen name="Profile" component={ProfileScreen} />
			<Stack.Screen name="RoleplayAttempt" component={RoleplayAttemptScreen} />
			<Stack.Screen name="LanguageAttempt" component={LanguageAttemptScreen} />
			<Stack.Screen name="TypingPractice" component={TypingPracticeScreen} />
			<Stack.Screen name="LanguageResult" component={LanguageResult} />
<Stack.Screen name="RoleplayResult" component={RoleplayResult} />
<Stack.Screen name="TypingResult" component={TypingResult} />
		</Stack.Navigator>
	);
}

export default function App() {
	// You can add state management here to check if the user is authenticated
	// For example: const [isAuthenticated, setIsAuthenticated] = useState(false);

	return (
		<GestureHandlerRootView style={styles.container}>
			<ThemeProvider>
				<SafeAreaProvider style={styles.container}>
					<Toaster />
					<NavigationContainer>
						<Stack.Navigator
							initialRouteName="Auth"
							screenOptions={{ headerShown: false }}
						>
							{/* Auth Flow with Welcome as the first screen */}
							<Stack.Screen name="Auth" component={AuthStackNavigator} />

							{/* Main App Flow */}
							<Stack.Screen name="Main" component={RootStack} />
						</Stack.Navigator>
					</NavigationContainer>
				</SafeAreaProvider>
			</ThemeProvider>
		</GestureHandlerRootView>
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
