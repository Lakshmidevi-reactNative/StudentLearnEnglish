import React from 'react';
import LearningFeatureTemplate from './ContentListTemplate';
import { COLORS } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';

export default function PromptEngScreen() {
  const promptEngLessons = [
    {
      title: 'Basic Conversations',
      subtitle: 'Practice everyday dialogues with AI conversation partners',
      duration: '15 mins',
      level: 'Beginner',
      imageSeed: 2501
    },
    {
      title: 'Situational Roleplay',
      subtitle: 'Simulate real-world scenarios like ordering food or asking for directions',
      duration: '20 mins',
      level: 'Intermediate',
      imageSeed: 2502
    },
    {
      title: 'Complex Discussions',
      subtitle: 'Engage in deeper conversations about diverse topics',
      duration: '25 mins',
      level: 'Advanced',
      imageSeed: 2503
    }
  ];

  return (
    <LearningFeatureTemplate
      title="PromptEng 💬"
      description="Simulates real conversations with AI partners to help you practice your English in realistic scenarios"
      icon="comment"
      color={COLORS.neonPink}
      progress={75}
      imageSeed={3006}
      lessons={promptEngLessons}
    />
  );
}