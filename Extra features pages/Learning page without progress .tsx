import React from 'react';
import { useTheme } from '../App';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import FeatureCard from "./CommonScreens/FeatureCard";

export default function LearningScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  
  const learningFeatures = [
    {
      title: 'ListenEng',
      description: 'Master listening comprehension',
      icon: 'headset',
      color: '#4169E1', // Professional Blue from HomeScreen
      progress: 85,
      onPress: () => navigation.navigate('ListenEng'),
    },
    {
      title: 'SpeakEng',
      description: 'Perfect pronunciation & fluency',
      icon: 'mic',
      color: '#10B981', // Green from HomeScreen
      progress: 70,
      onPress: () => navigation.navigate('SpeakEng'),
    },
    {
      title: 'ReadEng',
      description: 'Enhance reading skills',
      icon: 'menu-book',
      color: '#4c2882', // Purple from HomeScreen
      progress: 90,
      onPress: () => navigation.navigate('ReadEng'),
    },
    {
      title: 'WriteEng',
      description: 'Improve writing abilities',
      icon: 'create',
      color: '#16212b', // Dark Blue
      progress: 65,
      onPress: () => navigation.navigate('WriteEng'),
    },
    {
      title: 'TypeEng',
      description: 'Improve typing abilities',
      icon: 'keyboard',
      color: '#F59E0B', // Orange from HomeScreen
      progress: 65,
      onPress: () => navigation.navigate('TypeEng'),
    },
    {
      title: 'PromptEng',
      description: 'Practice real conversations',
      icon: 'chat',
      color: '#F56565',
      progress: 75,
      onPress: () => navigation.navigate('PromptEng'),
    }
  ];

  const resources = [
    {
      title: 'Study Materials',
      description: 'Access course documents & worksheets',
      icon: 'library-books',
      color: isDarkMode ? '#4169E1' : '#2563EB'
    },
    {
      title: 'Practice Tests',
      description: 'Prepare with sample exercises',
      icon: 'assignment',
      color: isDarkMode ? '#10B981' : '#2563EB'
    },
    {
      title: 'Video Lessons',
      description: 'Watch recorded class sessions',
      icon: 'play-circle-fill',
      color: isDarkMode ? '#4c2882' : '#162C8F'
    }
  ];

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <LinearGradient
        colors={isDarkMode ? ['#1A1A1A', '#2D2D2D'] : ['#4169E1', '#6495ED']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Learning Center</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <MaterialIcons name="timer" size={24} color="#FFD700" />
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>Minutes Today</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <MaterialIcons name="trending-up" size={24} color="#FFD700" />
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.featuresContainer}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
          Learning Features
        </Text>
        {learningFeatures.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.featureCard, isDarkMode && styles.darkCard]}
            onPress={feature.onPress}
          >
            <LinearGradient
              colors={[`${feature.color}15`, `${feature.color}05`]}
              style={styles.featureGradient}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${feature.color}15` }]}>
                <MaterialIcons name={feature.icon} size={24} color={feature.color} />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, isDarkMode && styles.darkText]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, isDarkMode && styles.darkSubText]}>
                  {feature.description}
                </Text>
              </View>
              <View style={styles.progressContainer}>
                <Text style={[styles.progressText, isDarkMode && styles.darkText]}>
                  {feature.progress}%
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.resourcesContainer}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
          Student Resources
        </Text>
        <View style={styles.resourcesGrid}>
          {resources.map((resource, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.resourceCard, isDarkMode && styles.darkCard]}
            >
              <View style={[styles.resourceIcon, { backgroundColor: `${resource.color}15` }]}>
                <MaterialIcons name={resource.icon} size={32} color={resource.color} />
              </View>
              <Text style={[styles.resourceTitle, isDarkMode && styles.darkText]}>
                {resource.title}
              </Text>
              <Text style={[styles.resourceDescription, isDarkMode && styles.darkSubText]}>
                {resource.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 15,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 15,
  },
  statNumber: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  featuresContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSubText: {
    color: '#A0AEC0',
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    height: 85,
  },
  darkCard: {
    backgroundColor: '#2D2D2D',
  },
  featureGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    height: '100%',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  progressContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 55,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  resourcesContainer: {
    padding: 24,
    paddingTop: 0,
  },
  resourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  resourceCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  resourceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  resourceDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
});