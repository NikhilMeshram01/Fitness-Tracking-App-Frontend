import { BlogPost, Achievement } from "../types";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Essential Exercises for Building Core Strength",
    excerpt:
      "Discover the most effective exercises to build a strong, stable core that supports all your movements.",
    content: "A strong core is the foundation of all fitness activities...",
    category: "fitness",
    author: "Sarah Johnson",
    publishedAt: "2025-01-15",
    imageUrl:
      "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=800",
    readTime: 5,
  },
  {
    id: "2",
    title: "Nutrition Guide: Fueling Your Workouts",
    excerpt:
      "Learn how to properly fuel your body before, during, and after workouts for optimal performance.",
    content: "Proper nutrition is crucial for athletic performance...",
    category: "nutrition",
    author: "Dr. Michael Chen",
    publishedAt: "2025-01-14",
    imageUrl:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
    readTime: 8,
  },
  {
    id: "3",
    title: "The Importance of Rest and Recovery",
    excerpt:
      "Why taking rest days is just as important as your workout days for achieving your fitness goals.",
    content: "Recovery is when the magic happens...",
    category: "lifestyle",
    author: "Emma Davis",
    publishedAt: "2025-01-13",
    imageUrl:
      "https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=800",
    readTime: 6,
  },
  {
    id: "4",
    title: "HIIT vs. Steady State Cardio: Which is Better?",
    excerpt:
      "Compare the benefits of high-intensity interval training versus steady-state cardio for different fitness goals.",
    content: "Both HIIT and steady-state cardio have their place...",
    category: "fitness",
    author: "James Wilson",
    publishedAt: "2025-01-12",
    imageUrl:
      "https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800",
    readTime: 7,
  },
  {
    id: "5",
    title: "Building Healthy Habits That Last",
    excerpt:
      "Practical strategies for creating sustainable fitness and nutrition habits that stick long-term.",
    content: "Sustainable habits are the key to long-term success...",
    category: "lifestyle",
    author: "Lisa Rodriguez",
    publishedAt: "2025-01-11",
    imageUrl:
      "https://images.pexels.com/photos/4946515/pexels-photo-4946515.jpeg?auto=compress&cs=tinysrgb&w=800",
    readTime: 5,
  },
  {
    id: "6",
    title: "Strength Training for Beginners",
    excerpt:
      "A comprehensive guide to getting started with weight training safely and effectively.",
    content: "Starting your strength training journey can be intimidating...",
    category: "fitness",
    author: "Alex Thompson",
    publishedAt: "2025-01-10",
    imageUrl:
      "https://images.pexels.com/photos/1547248/pexels-photo-1547248.jpeg?auto=compress&cs=tinysrgb&w=800",
    readTime: 9,
  },
];

export const achievements: Achievement[] = [
  {
    id: "1",
    title: "First Workout",
    description: "Complete your first workout session",
    icon: "🎯",
    unlockedAt: "2025-01-15",
    isUnlocked: true,
  },
  {
    id: "2",
    title: "Week Warrior",
    description: "Complete 7 workouts in a week",
    icon: "🏆",
    unlockedAt: "2025-01-20",
    isUnlocked: true,
  },
  {
    id: "3",
    title: "Calorie Crusher",
    description: "Burn 500+ calories in a single workout",
    icon: "🔥",
    isUnlocked: false,
  },
  {
    id: "4",
    title: "Consistency King",
    description: "Maintain a 30-day workout streak",
    icon: "👑",
    isUnlocked: false,
  },
  {
    id: "5",
    title: "Goal Getter",
    description: "Complete your first fitness goal",
    icon: "⭐",
    isUnlocked: false,
  },
];
