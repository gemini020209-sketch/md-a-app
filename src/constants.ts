import { ExerciseType, FoodItem } from './types';

export const COOKING_COEFFICIENTS: Record<string, number> = {
  steamed: 1.0,
  braised: 1.3,
  fried: 1.8,
  grilled: 1.2,
};

export const FOODS: FoodItem[] = [
  {
    id: 'eggplant-minced',
    name: '肉末茄子',
    baseCalories: 300,
    purine: 'high',
    gi: 'high',
    nutrients: {
      protein: 15,
      fat: 25,
      carbs: 40,
      fiber: 5,
      purineValue: 80,
    },
  },
  {
    id: 'quinoa-salad',
    name: '藜麦沙拉',
    baseCalories: 180,
    purine: 'low',
    gi: 'low',
    nutrients: {
      protein: 5,
      fat: 8,
      carbs: 25,
      fiber: 15,
      purineValue: 10,
    },
  },
];

export const EXERCISES: ExerciseType[] = [
  { id: 'running', name: '跑步', met: 8.0, icon: 'directions_run' },
  { id: 'swimming', name: '游泳', met: 6.0, icon: 'pool' },
  { id: 'cycling', name: '骑行', met: 7.5, icon: 'directions_bike' },
  { id: 'housework', name: '做家务', met: 3.5, icon: 'house' },
  { id: 'yoga', name: '瑜伽', met: 3.0, icon: 'self_improvement' },
];
