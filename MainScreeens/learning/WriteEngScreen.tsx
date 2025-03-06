import React from 'react';
import LearningFeatureTemplate from  './ContentListTemplate';
import { COLORS } from '../constants/Colors';

export default function WriteEngScreen() {
  const writeEngLessons = [
    {
      title: 'Basic Sentences',
      subtitle: 'Practice constructing simple English sentences',
      duration: '10 mins',
      level: 'Beginner',
      imageSeed: 2301
    },
    {
      title: 'Email Writing',
      subtitle: 'Learn to write professional and personal emails',
      duration: '20 mins',
      level: 'Intermediate',
      imageSeed: 2302
    },
    {
      title: 'Essay Composition',
      subtitle: 'Develop skills for academic and creative writing',
      duration: '30 mins',
      level: 'Advanced',
      imageSeed: 2303
    }
  ];

  return (
    <LearningFeatureTemplate
      title="WriteEng ✍️"
      description="Improves your writing abilities through guided exercises and feedback on grammar and style"
      icon="pencil-alt"
      color={COLORS.neonOrange}
      progress={65}
      imageSeed={3004}
      lessons={writeEngLessons}
    />
  );
}