import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	FlatList,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Animated, { FadeInRight } from "react-native-reanimated";
import { COLORS } from "./Colors";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.38;
const ITEM_SPACING = 10;

export default function LearningActivitiesCarousel() {
	const learningOptions = [
		{ icon: "headset", title: "ListenEng", color: "#00B4FF" },
		{ icon: "microphone", title: "SpeakEng", color: "#B026FF" },
		{ icon: "book-open", title: "ReadEng", color: "#39FF14" },
		{ icon: "pencil-alt", title: "WriteEng", color: "#FF6B35" },
		{ icon: "comment", title: "PromptEng", color: "#FF00FF" },
		{ icon: "keyboard", title: "TypeEng", color: "#FFD700" },
	];

	const renderItem = ({ item, index }) => (
		<Animated.View
			entering={FadeInRight.delay(400 + index * 100).duration(600)}
		>
			<TouchableOpacity
				style={[
					styles.carouselItem,
					{
						marginRight:
							index === learningOptions.length - 1 ? 20 : ITEM_SPACING,
					},
				]}
			>
				<View
					style={[
						styles.activityIconContainer,
						{ backgroundColor: `${item.color}20` },
					]}
				>
					<FontAwesome5
						name={item.icon}
						size={28}
						color={item.color}
						style={[styles.glowIcon, { textShadowColor: item.color }]}
					/>
				</View>
				<Text style={styles.carouselItemText}>{item.title}</Text>
			</TouchableOpacity>
		</Animated.View>
	);

	return (
		<View style={styles.carouselContainer}>
			<FlatList
				data={learningOptions}
				renderItem={renderItem}
				keyExtractor={(item) => item.title}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.listContent}
				snapToInterval={ITEM_WIDTH + ITEM_SPACING}
				decelerationRate="fast"
				initialNumToRender={3}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	carouselContainer: {
		marginBottom: 15,
	},
	listContent: {
		paddingLeft: 20,
	},
	carouselItem: {
		width: ITEM_WIDTH,
		backgroundColor: COLORS.cardBg,
		borderWidth: 1,
		borderColor: COLORS.cardBorder,
		borderRadius: 16,
		padding: 16,
		marginRight: ITEM_SPACING,
		alignItems: "center",
		height: 140,
		justifyContent: "center",
	},
	carouselItemText: {
		color: COLORS.textPrimary,
		marginTop: 10,
		fontSize: 14,
		fontWeight: "500",
	},
	activityIconContainer: {
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
	},
	glowIcon: {
		textShadowColor: COLORS.neonBlue,
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 10,
	},
});
