import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { UserProfile, FoodLog, ExerciseLog, View } from '../types';
import { COOKING_COEFFICIENTS, FOODS, EXERCISES } from '../constants';

interface AppContextType {
  user: UserProfile;
  foodLogs: FoodLog[];
  exerciseLogs: ExerciseLog[];
  currentView: View;
  setView: (view: View) => void;
  updateUser: (user: Partial<UserProfile>) => void;
  addFoodLog: (data: { name: string; calories: number; method: string; nutrients?: any; purine?: any; gi?: any }) => void;
  addExerciseLog: (exerciseId: string, duration: number) => void;
  bmr: number;
  totalIntake: number;
  totalExpenditure: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>({
    age: 28,
    height: 175,
    weight: 72.4,
    gender: 'male',
  });

  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [currentView, setView] = useState<View>(View.DASHBOARD);

  // Basal Metabolic Rate (BMR) - Mifflin-St Jeor Equation
  const bmr = useMemo(() => {
    if (user.gender === 'male') {
      return 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
    } else {
      return 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
    }
  }, [user]);

  const totalIntake = useMemo(() => {
    return foodLogs.reduce((sum, log) => sum + log.calories, 0);
  }, [foodLogs]);

  const totalExpenditure = useMemo(() => {
    // Basic metabolic consumption + exercise
    return bmr + exerciseLogs.reduce((sum, log) => sum + log.caloriesBurned, 0);
  }, [bmr, exerciseLogs]);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const addFoodLog = ({ name, calories, method, nutrients, purine, gi }: { 
    name: string; calories: number; method: string; nutrients?: any; purine?: any; gi?: any 
  }) => {
    const newLog: FoodLog = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      calories,
      method: method as any,
      timestamp: Date.now(),
      nutrients,
      purine,
      gi,
    };

    setFoodLogs((prev) => [...prev, newLog]);
  };

  const addExerciseLog = (exerciseId: string, duration: number) => {
    const exercise = EXERCISES.find((e) => e.id === exerciseId);
    if (!exercise) return;

    // Calories = MET * weight_kg * (duration_min / 60)
    const caloriesBurned = Math.round(exercise.met * user.weight * (duration / 60));

    const newLog: ExerciseLog = {
      id: Math.random().toString(36).substr(2, 9),
      exerciseId,
      name: exercise.name,
      duration,
      caloriesBurned,
      timestamp: Date.now(),
    };

    setExerciseLogs((prev) => [...prev, newLog]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        foodLogs,
        exerciseLogs,
        currentView,
        setView,
        updateUser,
        addFoodLog,
        addExerciseLog,
        bmr,
        totalIntake,
        totalExpenditure,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
