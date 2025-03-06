import React from 'react';
import LearningFeatureTemplate from './ContentListTemplate';
import { COLORS } from '../constants/Colors';

export default function TypeEngScreen() {
  const typeEngLessons = [
    {
      title: 'Typing Basics',
      subtitle: 'Learn keyboard layout and improve typing speed',
      duration: '10 mins',
      level: 'Beginner',
      imageSeed: 2401
    },
    {
      title: 'Word Drills',
      subtitle: 'Practice typing common English words and phrases',
      duration: '15 mins',
      level: 'Intermediate',
      imageSeed: 2402
    },
    {
      title: 'Speed Challenge',
      subtitle: 'Test your typing speed and accuracy with timed exercises',
      duration: '20 mins',
      level: 'Advanced',
      imageSeed: 2403
    }
  ];

  return (
    <LearningFeatureTemplate
      title="TypeEng ⌨️"
      description="Enhances your typing skills with specialized exercises to improve speed and accuracy"
      icon="keyboard"
      color={COLORS.neonYellow}
      progress={65}
      imageSeed={3005}
      lessons={typeEngLessons}
    />
  );
}