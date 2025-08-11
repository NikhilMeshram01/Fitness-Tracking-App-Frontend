export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  height: number; // in cm
  weight: number; // in kg
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  profilePicture?: string;
  createdAt: string;
}

export interface Workout {
  id: string;
  userId: string;
  type: "cardio" | "strength" | "yoga" | "flexibility" | "sports" | "other";
  name: string;
  duration: number; // in minutes
  caloriesBurned: number;
  exercises: Exercise[];
  date: string;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  weight?: number; // in kg
  duration?: number; // in minutes
  distance?: number; // in km
}

export interface Goal {
  id: string;
  userId: string;
  type:
    | "weight_loss"
    | "weight_gain"
    | "workout_frequency"
    | "calories"
    | "distance";
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface Progress {
  id: string;
  userId: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  measurements?: Record<string, number>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: "fitness" | "nutrition" | "lifestyle";
  author: string;
  publishedAt: string;
  imageUrl: string;
  readTime: number;
}
