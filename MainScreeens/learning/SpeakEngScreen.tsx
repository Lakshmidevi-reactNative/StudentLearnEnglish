import React from 'react';
import LearningFeatureTemplate from './ContentListTemplate';
import { COLORS } from '../constants/Colors';

export default function SpeakEngScreen() {
  const speakEngLessons = [
    {
      title: 'Pronunciation Basics',
      subtitle: 'Learn the fundamentals of English sounds and phonetics',
      duration: '10 mins',
      level: 'Beginner',
      imageSeed: 2101
    },
    {
      title: 'Conversational Practice',
      subtitle: 'Engage in dialogues and improve speaking fluency',
      duration: '20 mins',
      level: 'Intermediate',
      imageSeed: 2102
    },
    {
      title: 'Public Speaking',
      subtitle: 'Develop confidence with presentations and speeches',
      duration: '30 mins',
      level: 'Advanced',
      imageSeed: 2103
    }
  ];

  return (
    <LearningFeatureTemplate
      title="SpeakEng 🎤"
      description="Improves your pronunciation and speaking fluency through interactive exercises and speech recognition"
      icon="microphone"
      color={COLORS.neonPurple}
      progress={70}
      imageSeed={3002}
      lessons={speakEngLessons}
    />
  );
}