import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface TypingStats {
  wpm: string;
  accuracy: string;
  time: string;
  character: string;
}

interface TypingData {
  "201": TypingStats[];
  "202": TypingStats[];
  "203": TypingStats[];
}

interface ApiResponse {
  statusCode: number;
  data: TypingData;
}

const TypingResult = ({ navigation, route }) => {
  // Get parameters from route or use defaults
  const studentId = route?.params?.studentId || 948;
  const assignmentId = route?.params?.assignmentId || 3063;
  const classId = route?.params?.classId || 12099;
  
  const [activeTab, setActiveTab] = useState("words");
  const [typingData, setTypingData] = useState<TypingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const TAB_TYPES = {
    "201": "words",
    "202": "sentences",
    "203": "paragraphs",
  };

  useEffect(() => {
    fetchTypingResults();
  }, [studentId, assignmentId, classId]);

  const fetchTypingResults = async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this URL would use the actual parameters
      console.log(`Fetching typing results for Student: ${studentId}, Assignment: ${assignmentId}, Class: ${classId}`);
      
      // For demo purposes, we'll use mock data instead of making the actual API call
      const mockData = {
        statusCode: 200,
        data: {
          "201": [{ 
            wpm: "45", 
            accuracy: "92", 
            time: "120", 
            character: "450/500/50" 
          }],
          "202": [{ 
            wpm: "38", 
            accuracy: "85", 
            time: "180", 
            character: "650/800/150" 
          }],
          "203": [{ 
            wpm: "32", 
            accuracy: "78", 
            time: "300", 
            character: "1200/1500/300" 
          }]
        }
      };
      
      setTypingData(mockData.data);
      
      // For a real implementation, uncomment this code:
      /*
      const response = await fetch(
        `http://your-api-url/get-overall-typing-evaluation/${studentId}/${assignmentId}/${classId}`
      );
      const result: ApiResponse = await response.json();

      if (result.statusCode === 200 && result.data) {
        setTypingData(result.data);
      } else {
        console.error("Invalid data format received");
      }
      */
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTabData = (tabType: string): TypingStats | null => {
    if (!typingData) return null;

    const keyForTab = Object.keys(TAB_TYPES).find(
      (key) => TAB_TYPES[key] === tabType
    );
    if (!keyForTab || !typingData[keyForTab] || !typingData[keyForTab][0])
      return null;

    return typingData[keyForTab][0];
  };

  const getCharacterStats = (stats: TypingStats | null) => {
    if (!stats || !stats.character)
      return { correct: "0", total: "0", incorrect: "0" };

    const [correct, total, incorrect] = stats.character.split("/");
    return { correct, total, incorrect };
  };

  const renderMetricCard = (
    icon: string,
    label: string,
    value: string,
    color: string
  ) => (
    <View
      style={[
        styles.metricCard,
        {
          backgroundColor:
            color === "primary"
              ? "#EFF6FF"
              : color === "success"
              ? "#F0FDF4"
              : "#F3E8FF",
        },
      ]}
    >
      <View style={styles.metricContent}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                color === "primary"
                  ? "rgba(37, 99, 235, 0.25)"
                  : color === "success"
                  ? "rgba(22, 163, 74, 0.25)"
                  : "rgba(124, 58, 237, 0.25)",
            },
          ]}
        >
          <FontAwesome5
            name={icon}
            size={20}
            color={
              color === "primary"
                ? "#2563EB"
                : color === "success"
                ? "#16A34A"
                : "#7C3AED"
            }
          />
        </View>
        <View>
          <Text
            style={[
              styles.metricLabel,
              {
                color:
                  color === "primary"
                    ? "#2563EB"
                    : color === "success"
                    ? "#16A34A"
                    : "#7C3AED",
              },
            ]}
          >
            {label}
          </Text>
          <Text
            style={[
              styles.metricValue,
              {
                color:
                  color === "primary"
                    ? "#2563EB"
                    : color === "success"
                    ? "#16A34A"
                    : "#7C3AED",
              },
            ]}
          >
            {value}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderTabContent = (tabName: string) => {
    const tabData = getTabData(tabName);
    const { correct, total, incorrect } = getCharacterStats(tabData);

    return (
      <View style={styles.tabContent}>
        <View style={styles.metricsGrid}>
          {renderMetricCard("keyboard", "WPM", tabData?.wpm || "0", "primary")}
          {renderMetricCard(
            "bullseye",
            "Accuracy",
            `${tabData?.accuracy || "0"}%`,
            "success"
          )}
          {renderMetricCard(
            "clock",
            "Time",
            `${tabData?.time || "0"}s`,
            "secondary"
          )}
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Character Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={[styles.statValue, styles.rawValue]}>{total}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Correct</Text>
              <Text style={[styles.statValue, styles.correctValue]}>
                {correct}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Incorrect</Text>
              <Text style={[styles.statValue, styles.incorrectValue]}>
                {incorrect}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <FontAwesome5 name="chevron-left" size={20} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Typing Test Results</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.mainContainer}>
          <Text style={styles.mainContainerTitle}>Varun's Performance</Text>

          {/* Tab Navigation */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "words" && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab("words")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "words" && styles.activeTabButtonText,
                ]}
              >
                Words
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "sentences" && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab("sentences")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "sentences" && styles.activeTabButtonText,
                ]}
              >
                Sentences
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "paragraphs" && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab("paragraphs")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "paragraphs" && styles.activeTabButtonText,
                ]}
              >
                Paragraphs
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {isLoading ? (
            <Text style={styles.loadingText}>Loading results...</Text>
          ) : activeTab === "words" ? (
            renderTabContent("words")
          ) : activeTab === "sentences" ? (
            renderTabContent("sentences")
          ) : (
            renderTabContent("paragraphs")
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  mainContainer: {
    padding: 16,
    maxWidth: 900,
    alignSelf: "center",
    width: "100%",
  },
  mainContainerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#1a1a1a",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 4,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#4B5563",
  },
  tabButtonText: {
    fontSize: 16,
    color: "#6B7280",
  },
  activeTabButtonText: {
    color: "#1F2937",
    fontWeight: "bold",
  },
  tabContent: {
    padding: 16,
  },
  metricsGrid: {
    marginBottom: 20,
  },
  metricCard: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statsCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  rawValue: {
    color: "#1F2937",
  },
  correctValue: {
    color: "#16A34A",
  },
  incorrectValue: {
    color: "#DC2626",
  },
  loadingText: {
    textAlign: "center",
    padding: 20,
    fontSize: 16,
    color: "#6B7280",
  },
});

export default TypingResult;