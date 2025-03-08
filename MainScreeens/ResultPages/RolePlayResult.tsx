import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RoleplayResult = ({ navigation, route }) => {
  // Get parameters from route or use defaults
  const studentId = route?.params?.studentId || 977;
  const assignmentId = route?.params?.assignmentId || 3085;
  const classId = route?.params?.classId || 12294;
  
  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoleplayData();
  }, [studentId, assignmentId, classId]);

  const fetchRoleplayData = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, you would make an actual API call
      console.log(`Fetching roleplay results for Student: ${studentId}, Assignment: ${assignmentId}, Class: ${classId}`);
      
      // For demo purposes, we'll use mock data
      const mockResponse = {
        statusCode: 200,
        data: [
          {
            assignment_question_id: 1,
            question_text: '{mother:"Did you complete your homework?",daughter:"Yes, I finished it an hour ago."}',
            fluency: 85,
            pronounciation: 78,
            integrity: 92,
            accuracy: 88,
            overall_score: 86,
            assignment_question_type_id: 3,
            question_points: 10
          },
          {
            assignment_question_id: 2,
            question_text: '{mother:"What did you learn in school today?",daughter:"We learned about photosynthesis in science class."}',
            fluency: 80,
            pronounciation: 75,
            integrity: 85,
            accuracy: 90,
            overall_score: 82,
            assignment_question_type_id: 3,
            question_points: 10
          },
          {
            assignment_question_id: 3,
            question_text: '{mother:"Do you have any plans for the weekend?",daughter:"I might go to the library to study with friends."}',
            fluency: 90,
            pronounciation: 82,
            integrity: 88,
            accuracy: 92,
            overall_score: 88,
            assignment_question_type_id: 3,
            question_points: 10
          }
        ]
      };

      if (mockResponse.statusCode === 200) {
        // Map the API response data to the format expected by our component
        const formattedData = mockResponse.data.map((item, index) => {
          // Parse the dialogue from question_text
          let dialogue = item.question_text;
          try {
            // The data shows the format is like {mother:"text",daughter:"text"}
            // This is not valid JSON, so we need to use regex to extract the parts
            const motherRegex = /mother:"([^"]*)"/;
            const daughterRegex = /daughter:"([^"]*)"/;

            const motherMatch = motherRegex.exec(item.question_text);
            const daughterMatch = daughterRegex.exec(item.question_text);

            if (motherMatch && daughterMatch) {
              dialogue = `Mother: "${motherMatch[1]}"\n\nDaughter: "${daughterMatch[1]}"`;
            }
          } catch (e) {
            // If parsing fails, use the original text
            console.log("Error extracting dialogue parts:", e);
          }

          return {
            id: item.assignment_question_id.toString(),
            dialogue: dialogue,
            fluency: item.fluency,
            pronunciation: item.pronounciation, // Note the spelling difference in API
            integrity: item.integrity,
            accuracy: item.accuracy,
            overall: item.overall_score,
            questionType: item.assignment_question_type_id,
            questionPoints: item.question_points,
          };
        });

        setResponseData(formattedData);
      } else {
        setError("Failed to fetch data. Please try again.");
      }

      // For a real implementation, use this code:
      /*
      const response = await axios.get(
        `http://your-api-url/assignment/get-overall-roleplay-evaluation/${studentId}/${assignmentId}/${classId}`
      );

      if (response.data.statusCode === 200) {
        // Map the API response data to the format expected by our component
        const formattedData = response.data.data.map((item, index) => {
          // Parse the dialogue from question_text
          let dialogue = item.question_text;
          try {
            // The data shows the format is like {mother:"text",daughter:"text"}
            // This is not valid JSON, so we need to use regex to extract the parts
            const motherRegex = /mother:"([^"]*)"/;
            const daughterRegex = /daughter:"([^"]*)"/;

            const motherMatch = motherRegex.exec(item.question_text);
            const daughterMatch = daughterRegex.exec(item.question_text);

            if (motherMatch && daughterMatch) {
              dialogue = `Mother: "${motherMatch[1]}"\n\nDaughter: "${daughterMatch[1]}"`;
            }
          } catch (e) {
            // If parsing fails, use the original text
            console.log("Error extracting dialogue parts:", e);
          }

          return {
            id: item.assignment_question_id.toString(),
            dialogue: dialogue,
            fluency: item.fluency,
            pronunciation: item.pronounciation, // Note the spelling difference in API
            integrity: item.integrity,
            accuracy: item.accuracy,
            overall: item.overall_score,
            questionType: item.assignment_question_type_id,
            questionPoints: item.question_points,
          };
        });

        setResponseData(formattedData);
      } else {
        setError("Failed to fetch data. Please try again.");
      }
      */
    } catch (err) {
      console.error("Error fetching roleplay data:", err);
      setError(
        "An error occurred while fetching data. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderResponseItem = ({ item, index }) => (
    <View style={styles.cardContainer}>
      <View style={styles.responseCard}>
        <View style={styles.responseHeader}>
          <View style={styles.responseHeaderLeft}>
            <Ionicons name="chatbubble-ellipses" size={22} color="#6C5CE7" />
            <Text style={styles.responseHeaderText}>Student Response</Text>
          </View>
          <View style={styles.responseBadge}>
            <Text style={styles.responseBadgeText}>{`#${index + 1}`}</Text>
          </View>
        </View>
        <Text style={styles.dialogueText}>{item.dialogue}</Text>
        <View style={styles.scoresDivider} />
        <View style={styles.scoresContainer}>
          <ScoreItem label="Fluency" score={item.fluency} icon="mic-outline" />
          <ScoreItem
            label="Pronunciation"
            score={item.pronunciation}
            icon="language-outline"
          />
          <ScoreItem
            label="Integrity"
            score={item.integrity}
            icon="shield-checkmark-outline"
          />
          <ScoreItem
            label="Accuracy"
            score={item.accuracy}
            icon="checkmark-circle-outline"
          />
          <ScoreItem
            label="Overall"
            score={item.overall}
            icon="stats-chart-outline"
          />
        </View>
      </View>
    </View>
  );

  const ScoreItem = ({ label, score, icon }) => {
    // Determine color based on score
    const getScoreColor = (score) => {
      if (score >= 80) return "#00B894"; // Green
      if (score >= 60) return "#FDCB6E"; // Yellow
      return "#FF7675"; // Red
    };

    // Calculate percentage for circle fill
    const percentage = score;

    return (
      <View style={styles.scoreItem}>
        <View style={styles.scoreCircleContainer}>
          <View style={styles.scoreBackground}>
            <View style={styles.scoreIconContainer}>
              <Ionicons name={icon} size={16} color="#2D3436" />
            </View>
            <View style={styles.scoreSvgContainer}>
              <View style={styles.scoreTrack} />
              <View
                style={[
                  styles.scoreFill,
                  {
                    backgroundColor: getScoreColor(score),
                    width: `${percentage}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>
        <View style={styles.scoreLabelContainer}>
          <Text style={styles.scoreLabel}>{label}</Text>
          <Text style={[styles.scoreValue, { color: getScoreColor(score) }]}>
            {score}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#6C5CE7" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Roleplay Evaluation</Text>
          <View style={styles.headerBreadcrumb}>
            <TouchableOpacity
              style={styles.breadcrumbItem}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="home-outline" size={16} color="#D6BCFA" />
              <Text style={styles.breadcrumbText}>Dashboard</Text>
            </TouchableOpacity>
            <Ionicons name="chevron-forward" size={12} color="#D6BCFA" />
            <Text style={styles.breadcrumbActive}>Roleplay Results</Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.pageContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6C5CE7" />
            <Text style={styles.loadingText}>Loading results...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#FF7675" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchRoleplayData}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <FlatList
              data={responseData}
              renderItem={renderResponseItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons
                    name="document-text-outline"
                    size={48}
                    color="#A0AEC0"
                  />
                  <Text style={styles.emptyText}>
                    No roleplay data available
                  </Text>
                </View>
              }
            />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  header: {
    paddingTop: 46,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#6C5CE7",
    elevation: 4,
    paddingBottom: 40,
    shadowColor: "#6C5CE7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  headerBreadcrumb: {
    flexDirection: "row",
    alignItems: "center",
  },
  breadcrumbItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 4,
  },
  breadcrumbText: {
    fontSize: 12,
    color: "#D6BCFA",
    marginLeft: 4,
  },
  breadcrumbActive: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 4,
  },
  pageContainer: {
    flex: 1,
    backgroundColor: "#F0F4F8",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  listContainer: {
    paddingBottom: 16,
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#A0AEC0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  responseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    padding: 16,
  },
  responseHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  responseHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  responseHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginLeft: 8,
  },
  responseBadge: {
    backgroundColor: "#6C5CE710",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#6C5CE730",
  },
  responseBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6C5CE7",
  },
  dialogueText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4A5568",
    marginBottom: 16,
    backgroundColor: "#F7FAFC",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#6C5CE7",
  },
  scoresDivider: {
    height: 1,
    backgroundColor: "#EDF2F7",
    marginBottom: 16,
  },
  scoresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  scoreItem: {
    width: "48%",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  scoreCircleContainer: {
    marginRight: 10,
  },
  scoreBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EDF2F7",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  scoreIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 2,
  },
  scoreSvgContainer: {
    position: "absolute",
    width: "100%",
    height: 4,
    backgroundColor: "#E2E8F0",
    bottom: 0,
    left: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  scoreTrack: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#E2E8F0",
  },
  scoreFill: {
    position: "absolute",
    height: "100%",
    left: 0,
  },
  scoreLabelContainer: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 12,
    color: "#718096",
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4A5568",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4A5568",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  emptyContainer: {
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
  },
});

export default RoleplayResult;