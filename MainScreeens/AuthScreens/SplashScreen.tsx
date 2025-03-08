import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions,Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const logoScale = new Animated.Value(0);
  const logoOpacity = new Animated.Value(0);
  const textOpacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 10,
          friction: 2,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Login after splash
    setTimeout(() => {
      navigation.replace('Login');
    }, 8000);
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.deepBlue, COLORS.softPurple]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
          
                     
          {/* <MaterialCommunityIcons
            name="brain"
            size={100}
            color={COLORS.neonBlue}
            style={styles.glowIcon}
          /> */}
        </Animated.View>

        <Animated.View style={{ opacity: textOpacity }}>
          <Text style={styles.appName}>LearnEng</Text>
          <Text style={styles.tagline}>Master English, Unleash Potential</Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo:{
    width:90,
    height:90,
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  glowIcon: {
    textShadowColor: COLORS.neonBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  appName: {
    color: COLORS.textPrimary,
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: COLORS.neonBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  tagline: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});