export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: "male" | "female" | "other";
  height: number; // in cm
  weight: number; // in kg
  level: "beginner" | "intermediate" | "advanced";
  profilePicture?: string;
  createdAt: string;
}
export interface Workout {
  _id: string;
  userId: string;
  exerciseType:
    | "cardio"
    | "strength"
    | "yoga"
    | "flexibility"
    | "sports"
    | "other";
  name: string;
  duration: number; // in minutes
  caloriesBurned: number;
  exercises: Exercise[];
  workoutDate: string;
  notes?: string;
}
export interface Goal {
  _id: string;
  userId: string;
  goalType:
    | "weight_loss"
    | "weight_gain"
    | "workout_frequency"
    | "calories"
    | "distance";
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: string;
  isCompleted: boolean;
}

export interface Exercise {
  _id: string;
  name: string;
  sets?: number;
  reps?: number;
  weight?: number; // in kg
  duration?: number; // in minutes
  distance?: number; // in km
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

// export interface BlogPost {
//   id: string;
//   title: string;
//   excerpt: string;
//   content: string;
//   category: "fitness" | "nutrition" | "lifestyle";
//   author: string;
//   publishedAt: string;
//   imageUrl: string;
//   readTime: number;
// }
