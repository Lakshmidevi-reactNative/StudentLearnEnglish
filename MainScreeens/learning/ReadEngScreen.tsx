import React from 'react';
import LearningFeatureTemplate from './ContentListTemplate';
import { COLORS } from '../constants/Colors';

export default function ReadEngScreen() {
  const readEngLessons = [
    {
      title: 'Short Stories',
      subtitle: 'Read interesting short stories with comprehension questions',
      duration: '15 mins',
      level: 'Beginner',
      imageSeed: 2201
    },
    {
      title: 'News Articles',
      subtitle: 'Practice reading contemporary news and current events',
      duration: '20 mins',
      level: 'Intermediate',
      imageSeed: 2202
    },
    {
      title: 'Literary Classics',
      subtitle: 'Enjoy excerpts from famous English literature works',
      duration: '25 mins',
      level: 'Advanced',
      imageSeed: 2203
    }
  ];

  return (
    <LearningFeatureTemplate
      title="ReadEng 📖"
      description="Enhances your reading skills with a variety of texts at different difficulty levels"
      icon="book-open"
      color={COLORS.neonGreen}
      progress={90}
      imageSeed={3003}
      lessons={readEngLessons}
    />
  );
}