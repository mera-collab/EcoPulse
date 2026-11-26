// To use real photos, replace the .jpg files in assets/images with your own
// (keep the same file names). Free sources: unsplash.com, pexels.com.
export default {
  hero: require('../assets/images/hero.jpg'),
  climate: require('../assets/images/climate.jpg'),
  forest: require('../assets/images/forest.jpg'),
  water: require('../assets/images/water.jpg'),
  waste: require('../assets/images/waste.jpg'),
  biodiversity: require('../assets/images/biodiversity.jpg'),
  quiz: require('../assets/images/quiz.jpg'),
  videos: require('../assets/images/videos.jpg'),
};
export const topicImage = { 1: 'climate', 2: 'forest', 3: 'water', 4: 'waste', 5: 'biodiversity' };
export const topicIcon = { 1: 'thermometer', 2: 'tree-outline', 3: 'water-outline', 4: 'recycle', 5: 'butterfly-outline' };