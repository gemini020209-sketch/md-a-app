export enum View {
  DASHBOARD = 'dashboard',
  SCAN = 'scan',
  EXERCISE = 'exercise',
  REPORT = 'report',
}

export interface UserProfile {
  age: number;
  height: number;
  weight: number;
  gender: 'male' | 'female';
}

export type CookingMethod = 'steamed' | 'braised' | 'fried' | 'grilled';

export interface FoodItem {
  id: string;
  name: string;
  baseCalories: number; // kcal per serving/unit
  purine: 'low' | 'medium' | 'high';
  gi: 'low' | 'medium' | 'high';
  nutrients: {
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
    purineValue: number;
  };
}

export interface FoodLog {
  id: string;
  name: string;
  calories: number;
  method: CookingMethod;
  timestamp: number;
  nutrients?: {
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
  };
  purine?: 'low' | 'medium' | 'high';
  gi?: 'low' | 'medium' | 'high';
}

export interface ExerciseType {
  id: string;
  name: string;
  met: number;
  icon: string;
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  name: string;
  duration: number; // minutes
  caloriesBurned: number;
  timestamp: number;
}
