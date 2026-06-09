import React, { useState, useEffect } from 'react';
import {
  Home, Dumbbell, History as HistoryIcon, TrendingUp, Plus, Check, X, Trophy,
  Flame, Target, ChevronRight, Quote, UtensilsCrossed, Camera,
  Coffee, Apple, Edit3, Calendar, Award, ChevronDown
} from 'lucide-react';

// ============================================================================
// CONFIG
// ============================================================================

const PROGRAM_START = new Date('2026-06-08T00:00:00');
const PROGRAM_WEEKS = 12;
const USER = { name: 'UMANG', weightStart: 70, weightTarget: 68 };

// ============================================================================
// COLOR SYSTEM
// ============================================================================

const MUSCLE_COLORS = {
  Chest:      { bg: 'bg-rose-500',    bgSoft: 'bg-rose-500/10',    border: 'border-rose-500',    borderSoft: 'border-rose-500/50',    text: 'text-rose-400',    hex: '#f43f5e', label: 'CHEST' },
  Back:       { bg: 'bg-blue-500',    bgSoft: 'bg-blue-500/10',    border: 'border-blue-500',    borderSoft: 'border-blue-500/50',    text: 'text-blue-400',    hex: '#3b82f6', label: 'BACK' },
  Shoulders:  { bg: 'bg-amber-500',   bgSoft: 'bg-amber-500/10',   border: 'border-amber-500',   borderSoft: 'border-amber-500/50',   text: 'text-amber-400',   hex: '#f59e0b', label: 'SHOULDERS' },
  Arms:       { bg: 'bg-violet-500',  bgSoft: 'bg-violet-500/10',  border: 'border-violet-500',  borderSoft: 'border-violet-500/50',  text: 'text-violet-400',  hex: '#8b5cf6', label: 'ARMS' },
  Quads:      { bg: 'bg-emerald-500', bgSoft: 'bg-emerald-500/10', border: 'border-emerald-500', borderSoft: 'border-emerald-500/50', text: 'text-emerald-400', hex: '#10b981', label: 'QUADS' },
  Hamstrings: { bg: 'bg-teal-500',    bgSoft: 'bg-teal-500/10',    border: 'border-teal-500',    borderSoft: 'border-teal-500/50',    text: 'text-teal-400',    hex: '#14b8a6', label: 'HAMSTRINGS' },
  Glutes:     { bg: 'bg-fuchsia-500', bgSoft: 'bg-fuchsia-500/10', border: 'border-fuchsia-500', borderSoft: 'border-fuchsia-500/50', text: 'text-fuchsia-400', hex: '#d946ef', label: 'GLUTES' },
  Calves:     { bg: 'bg-lime-500',    bgSoft: 'bg-lime-500/10',    border: 'border-lime-500',    borderSoft: 'border-lime-500/50',    text: 'text-lime-400',    hex: '#84cc16', label: 'CALVES' },
  Core:       { bg: 'bg-orange-500',  bgSoft: 'bg-orange-500/10',  border: 'border-orange-500',  borderSoft: 'border-orange-500/50',  text: 'text-orange-400',  hex: '#f97316', label: 'CORE' },
  Skill:      { bg: 'bg-cyan-500',    bgSoft: 'bg-cyan-500/10',    border: 'border-cyan-500',    borderSoft: 'border-cyan-500/50',    text: 'text-cyan-400',    hex: '#06b6d4', label: 'SKILL' },
};
const getMuscleColor = (m) => MUSCLE_COLORS[m] || MUSCLE_COLORS.Skill;

// ============================================================================
// PROGRAM
// ============================================================================

const PROGRAM = {
  'upper-strength': {
    id: 'upper-strength', name: 'Upper Strength', dayLabel: 'DAY 1', focus: 'Push + Pull-up Priority',
    primaryMuscle: 'Back',
    exercises: [
      { name: 'Barbell Bench Press', muscle: 'Chest', sets: '4×5-6', defaultWeight: 40, defaultReps: 6,
        target: { weight: 52.5, reps: 6, weekTarget: 12 }, note: 'Bar 20kg + plates per side.' },
      { name: 'Pull-up / Negative', muscle: 'Back', sets: '4×3-5', defaultWeight: 0, defaultReps: 3, isBodyweight: true,
        target: { weight: 0, reps: 10, weekTarget: 12 }, note: 'THE bottleneck. 5s eccentric on negatives.' },
      { name: 'Overhead Press', muscle: 'Shoulders', sets: '3×6-8', defaultWeight: 25, defaultReps: 7,
        target: { weight: 32.5, reps: 6, weekTarget: 12 }, note: 'Strict, no leg drive.' },
      { name: 'Barbell Row', muscle: 'Back', sets: '3×8-10', defaultWeight: 30, defaultReps: 8,
        target: { weight: 42.5, reps: 8, weekTarget: 12 }, note: 'Drive elbow back, squeeze shoulder blades.' },
      { name: 'Dips', muscle: 'Chest', sets: '3×6-10', defaultWeight: 0, defaultReps: 6, isBodyweight: true,
        target: { weight: 10, reps: 8, weekTarget: 12 }, note: 'Add weight when 10 reps clean.' },
      { name: 'Hanging Leg Raises', muscle: 'Core', sets: '3×8-12', defaultWeight: 0, defaultReps: 10, isBodyweight: true,
        target: { weight: 0, reps: 15, weekTarget: 12 } },
    ],
  },
  'lower-strength': {
    id: 'lower-strength', name: 'Lower Strength', dayLabel: 'DAY 2', focus: 'Squat + Posterior Chain',
    primaryMuscle: 'Quads',
    exercises: [
      { name: 'Back Squat', muscle: 'Quads', sets: '4×5-6', defaultWeight: 45, defaultReps: 6,
        target: { weight: 65, reps: 6, weekTarget: 12 }, note: 'Below parallel. King lift for athletic legs.' },
      { name: 'Romanian Deadlift', muscle: 'Hamstrings', sets: '3×6-8', defaultWeight: 40, defaultReps: 7,
        target: { weight: 55, reps: 7, weekTarget: 12 }, note: 'Hamstrings + glutes + lower back.' },
      { name: 'Bulgarian Split Squat', muscle: 'Glutes', sets: '3×8 ea', defaultWeight: 8, defaultReps: 8,
        target: { weight: 16, reps: 8, weekTarget: 12 }, note: 'DB each hand. Pistol squat builder.' },
      { name: 'Walking Lunges', muscle: 'Quads', sets: '3×10 ea', defaultWeight: 7.5, defaultReps: 10,
        target: { weight: 12.5, reps: 10, weekTarget: 12 } },
      { name: 'Standing Calf Raises', muscle: 'Calves', sets: '4×12-15', defaultWeight: 30, defaultReps: 13,
        target: { weight: 50, reps: 13, weekTarget: 12 } },
    ],
  },
  'upper-hypertrophy': {
    id: 'upper-hypertrophy', name: 'Upper Hypertrophy', dayLabel: 'DAY 3', focus: 'Pull-up Cluster Volume',
    primaryMuscle: 'Back',
    exercises: [
      { name: 'Pull-up Cluster Set', muscle: 'Back', sets: '6×2-3', defaultWeight: 0, defaultReps: 2, isBodyweight: true,
        target: { weight: 0, reps: 5, weekTarget: 12 }, note: '60s rest. Builds pull-ups faster than failure sets.' },
      { name: 'Incline DB Press', muscle: 'Chest', sets: '4×8-10', defaultWeight: 12, defaultReps: 10,
        target: { weight: 20, reps: 10, weekTarget: 12 }, note: 'DB each hand.' },
      { name: 'Lat Pulldown', muscle: 'Back', sets: '4×10-12', defaultWeight: 32, defaultReps: 11,
        target: { weight: 45, reps: 11, weekTarget: 12 }, note: 'Wide grip. Squeeze lats.' },
      { name: 'Cable Row', muscle: 'Back', sets: '3×10-12', defaultWeight: 30, defaultReps: 11,
        target: { weight: 42.5, reps: 11, weekTarget: 12 }, note: 'Chest-supported if available.' },
      { name: 'Lateral Raise', muscle: 'Shoulders', sets: '4×12-15', defaultWeight: 5, defaultReps: 13,
        target: { weight: 9, reps: 13, weekTarget: 12 }, note: 'Shoulders = the athletic look.' },
      { name: 'Face Pulls', muscle: 'Shoulders', sets: '3×15', defaultWeight: 12, defaultReps: 15,
        target: { weight: 20, reps: 15, weekTarget: 12 }, note: 'Posture + rear delts.' },
      { name: 'Barbell Curls', muscle: 'Arms', sets: '3×8-10', defaultWeight: 12, defaultReps: 9,
        target: { weight: 20, reps: 9, weekTarget: 12 } },
      { name: 'Triceps Pushdown', muscle: 'Arms', sets: '3×10-12', defaultWeight: 20, defaultReps: 11,
        target: { weight: 30, reps: 11, weekTarget: 12 } },
    ],
  },
  'lower-skill': {
    id: 'lower-skill', name: 'Lower + Skill', dayLabel: 'DAY 4', focus: 'Pistol + Handstand Work',
    primaryMuscle: 'Skill',
    exercises: [
      { name: 'Front Squat', muscle: 'Quads', sets: '4×8-10', defaultWeight: 30, defaultReps: 9,
        target: { weight: 45, reps: 9, weekTarget: 12 }, note: 'Core + quads.' },
      { name: 'Hip Thrust', muscle: 'Glutes', sets: '3×10-12', defaultWeight: 50, defaultReps: 11,
        target: { weight: 70, reps: 11, weekTarget: 12 }, note: 'Glutes for badminton power.' },
      { name: 'Leg Press', muscle: 'Quads', sets: '3×12-15', defaultWeight: 80, defaultReps: 13,
        target: { weight: 110, reps: 13, weekTarget: 12 } },
      { name: 'Leg Curl', muscle: 'Hamstrings', sets: '3×12', defaultWeight: 25, defaultReps: 12,
        target: { weight: 40, reps: 12, weekTarget: 12 } },
      { name: 'Pistol Squat Progression', muscle: 'Skill', sets: '3×5-6 ea', defaultWeight: 0, defaultReps: 5, isBodyweight: true,
        target: { weight: 0, reps: 2, weekTarget: 12 }, note: 'Box pistol → unassisted. Goal: 2 reps each leg flat.' },
      { name: 'Wall Handstand Hold', muscle: 'Skill', sets: '3×20-30s', defaultWeight: 0, defaultReps: 25, isBodyweight: true, isHold: true,
        target: { weight: 0, reps: 45, weekTarget: 12 }, note: 'Face wall, hands 6 inches from base.' },
      { name: 'Hanging Knee Raises', muscle: 'Core', sets: '3×10-15', defaultWeight: 0, defaultReps: 12, isBodyweight: true,
        target: { weight: 0, reps: 18, weekTarget: 12 } },
    ],
  },
};

const WARMUP = [
  '3 min easy bike or rower',
  'Arm circles — 10 each direction',
  'Cat-cow + thoracic rotations — 8 reps',
  'Hip openers (90/90) — 6 each side',
  'Scapular pull-ups — 2×8',
];

const COOLDOWN = [
  'Doorway pec stretch — 30s each side',
  'Couch stretch — 45s each side',
  'Lat hang — 2×20s',
  'Pigeon pose — 45s each side',
  '10-15 min incline walk (post upper days only)',
];

// ============================================================================
// MEAL PLAN — Built for Umang's profile
// ============================================================================

const MACRO_COLORS = {
  protein: { hex: '#3b82f6', text: 'text-blue-400', bg: 'bg-blue-500' },
  carbs:   { hex: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-500' },
  fat:     { hex: '#f43f5e', text: 'text-rose-400', bg: 'bg-rose-500' },
  kcal:    { hex: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500' },
};

const DAILY_TARGET = { kcal: 2300, protein: 138, carbs: 220, fat: 70 };

// Standard meals — reused across days with tweaks
const M = {
  preWorkout: {
    time: '6:15 AM', name: 'Pre-Workout', icon: 'pre',
    items: ['1 banana', '5 soaked almonds (peel after soaking)'],
    note: 'Skip coffee on empty stomach — your acidity will thank you.',
    kcal: 150, protein: 4, carbs: 28, fat: 5,
  },
  breakfast: {
    time: '8:30 AM', name: 'Breakfast · Post-Workout', icon: 'breakfast',
    items: [
      '3 whole eggs scrambled in 1 tsp ghee',
      '2 slices brown bread (Modern Multigrain)',
      '250 ml milk (Nandini Toned)',
      '1 small fruit — apple or orange',
    ],
    note: 'Replaces chocolate muesli. Mostly sugar otherwise.',
    kcal: 600, protein: 35, carbs: 55, fat: 22,
  },
  lunchOrdered: {
    time: '1:00 PM', name: 'Lunch · Ordered', icon: 'lunch',
    items: [
      '2 rotis + 1 katori dal + 1 sabzi',
      '+ Paneer bhurji OR 100g paneer side (₹40-60 extra)',
      'Skip rice on weekdays · large salad on side',
    ],
    note: 'Most HSR places do paneer add-ons. Avoid burrito on weekdays.',
    kcal: 700, protein: 40, carbs: 75, fat: 22,
  },
  lunchCooked: {
    time: '1:00 PM', name: 'Lunch · Home', icon: 'lunch',
    items: [
      '2 rotis + 1 katori dal',
      '100g paneer sabzi',
      'Large salad: cucumber, tomato, onion, carrot + lemon',
    ],
    kcal: 700, protein: 40, carbs: 72, fat: 24,
  },
  snackSoya: {
    time: '4:30 PM', name: 'Snack', icon: 'snack',
    items: [
      '50g dry soya chunks (boiled, squeezed, tossed in masala + lemon)',
      '1 cup green tea (gentler than coffee for acidity)',
    ],
    kcal: 220, protein: 26, carbs: 15, fat: 3,
  },
  snackEggs: {
    time: '4:30 PM', name: 'Snack', icon: 'snack',
    items: ['2 boiled eggs', 'Handful peanuts (~20g)', '1 cup green tea'],
    kcal: 260, protein: 18, carbs: 8, fat: 18,
  },
  dinnerPaneer: {
    time: '8:30 PM', name: 'Dinner', icon: 'dinner',
    items: [
      '100g paneer (Milky Mist) + green sabzi (palak/beans/lauki)',
      '1-2 rotis OR small bowl rice — not both',
      'Large salad with lemon + black salt',
    ],
    note: 'Lighter carbs at dinner = where most fat loss happens.',
    kcal: 600, protein: 38, carbs: 45, fat: 25,
  },
  dinnerSoya: {
    time: '8:30 PM', name: 'Dinner', icon: 'dinner',
    items: [
      '50g dry soya chunks cooked with masala + onion-tomato gravy',
      '2 rotis',
      'Salad on side',
    ],
    kcal: 580, protein: 42, carbs: 50, fat: 18,
  },
  preBed: {
    time: '10:30 PM', name: 'Optional Pre-Bed', icon: 'prebed',
    items: ['250ml warm milk + pinch turmeric'],
    note: 'Only if hungry. No food 2 hrs before sleep otherwise (acidity).',
    kcal: 150, protein: 8, carbs: 12, fat: 8, optional: true,
  },
};

const MEAL_PLAN = {
  Mon: { dayLabel: 'MONDAY', sessionTag: 'UPPER STRENGTH', tagColor: 'Back',
    note: 'Higher carbs at breakfast — pressing day needs the energy.',
    meals: [M.preWorkout, M.breakfast, M.lunchOrdered, M.snackSoya, M.dinnerPaneer] },
  Tue: { dayLabel: 'TUESDAY', sessionTag: 'LOWER STRENGTH', tagColor: 'Quads',
    note: 'Protein-forward dinner for leg recovery.',
    meals: [M.preWorkout, M.breakfast, M.lunchOrdered, M.snackEggs, M.dinnerSoya, M.preBed] },
  Wed: { dayLabel: 'WEDNESDAY', sessionTag: 'REST DAY', tagColor: null,
    note: 'No training — drop 100-150 kcal carbs from lunch if you want.',
    meals: [
      { ...M.breakfast, time: '9:00 AM', kcal: 500, carbs: 45 },
      M.lunchOrdered, M.snackSoya, M.dinnerPaneer,
    ] },
  Thu: { dayLabel: 'THURSDAY', sessionTag: 'UPPER HYPERTROPHY', tagColor: 'Back',
    note: 'Pull-up cluster day — keep protein high.',
    meals: [M.preWorkout, M.breakfast, M.lunchOrdered, M.snackSoya, M.dinnerPaneer] },
  Fri: { dayLabel: 'FRIDAY', sessionTag: 'LOWER + SKILL', tagColor: 'Skill',
    note: 'Skill work — eat normally, hydrate well.',
    meals: [M.preWorkout, M.breakfast, M.lunchOrdered, M.snackEggs, M.dinnerSoya] },
  Sat: { dayLabel: 'SATURDAY', sessionTag: 'BADMINTON', tagColor: 'Shoulders',
    note: 'Pre-game oats give sustained energy. Hydrate aggressively.',
    meals: [
      { time: '7:30 AM', name: 'Pre-Game Breakfast', icon: 'breakfast',
        items: ['1 bowl oats with milk + banana + 1 tbsp peanut butter', '2 boiled eggs'],
        kcal: 550, protein: 28, carbs: 65, fat: 18 },
      { time: '1:30 PM', name: 'Lunch · Recovery', icon: 'lunch',
        items: ['2 rotis + dal + paneer sabzi', '1 banana post-match'],
        kcal: 750, protein: 38, carbs: 95, fat: 20 },
      M.snackSoya, M.dinnerPaneer,
    ] },
  Sun: { dayLabel: 'SUNDAY', sessionTag: 'BADMINTON · CHEAT MEAL', tagColor: 'Shoulders',
    note: 'CHEAT MEAL at lunch — burrito, biryani, whatever. Eat clean rest of day.',
    meals: [
      { time: '8:30 AM', name: 'Breakfast', icon: 'breakfast',
        items: ['3 eggs + 2 slices brown bread', '250ml milk', 'Fruit'],
        kcal: 580, protein: 33, carbs: 50, fat: 22 },
      { time: '1:30 PM', name: '🌯 Cheat Meal · Lunch', icon: 'cheat',
        items: ['California Burrito OR biryani OR pizza — your call', 'Enjoy it. Move on. Stay clean rest of day.'],
        note: 'One cheat MEAL, not a cheat DAY. Resume protocol at dinner.',
        kcal: 1000, protein: 30, carbs: 110, fat: 40, isCheat: true },
      { time: '5:00 PM', name: 'Light Snack', icon: 'snack',
        items: ['1 cup green tea', 'Handful peanuts'], kcal: 180, protein: 8, carbs: 6, fat: 14 },
      { ...M.dinnerPaneer, items: [...M.dinnerPaneer.items, '(keep dinner clean to offset lunch)'] },
    ] },
};

const GROCERY_LIST = [
  { category: 'Reliance Fresh / MK Retail', items: [
    { name: 'Eggs · 2 trays (60 eggs)', price: 400 },
    { name: 'Paneer · 500g (Milky Mist / Heritage)', price: 220 },
    { name: 'Milk · 7L Nandini Toned', price: 350 },
    { name: 'Brown bread · 2 loaves (Modern Multigrain)', price: 100 },
    { name: 'Soya chunks · 500g (Nutrela)', price: 100 },
    { name: 'Bananas + apples + seasonal fruit', price: 250 },
    { name: 'Almonds + peanuts (small packs)', price: 200 },
  ]},
  { category: 'Local Sabziwala', items: [
    { name: 'Vegetables (palak, beans, capsicum, lauki, etc.)', price: 300 },
    { name: 'Lemon, ginger, garlic, coriander, chili', price: 100 },
  ]},
  { category: 'Pantry (monthly, amortized)', items: [
    { name: 'Toor dal, moong dal, atta, rice, ghee, oil, masalas', price: 150 },
  ]},
];

const DIET_RULES = [
  { rule: 'Protein on every meal — no protein, no meal', severity: 'high' },
  { rule: 'Water: 3-4 L/day, especially with high protein', severity: 'high' },
  { rule: 'No black coffee on empty stomach (acidity)', severity: 'med' },
  { rule: 'No food 2 hrs before bed (acidity)', severity: 'med' },
  { rule: 'No curd / yogurt — replace with milk or paneer', severity: 'med' },
  { rule: 'Ajwain water after lunch helps digestion', severity: 'low' },
];

// ============================================================================
// QUOTES
// ============================================================================

const QUOTES = [
  { text: 'Discipline equals freedom.', author: 'Jocko Willink' },
  { text: "You don't rise to the level of your goals. You fall to the level of your systems.", author: 'James Clear' },
  { text: 'The body achieves what the mind believes.', author: 'Napoleon Hill' },
  { text: 'Suffer the pain of discipline or suffer the pain of regret.', author: 'Jim Rohn' },
  { text: 'Hard choices, easy life. Easy choices, hard life.', author: 'Jerzy Gregorek' },
  { text: 'The pain you feel today is the strength you feel tomorrow.', author: 'Arnold Schwarzenegger' },
  { text: "Don't count the days, make the days count.", author: 'Muhammad Ali' },
  { text: 'It never gets easier. You just get better.', author: 'Anonymous' },
  { text: "You miss 100% of the reps you don't do.", author: 'Anonymous' },
  { text: "Rest when you're done, not when you're tired.", author: 'Anonymous' },
];

// ============================================================================
// HELPERS
// ============================================================================

const getProgramWeek = () => {
  const now = new Date();
  const diff = Math.floor((now - PROGRAM_START) / (1000 * 60 * 60 * 24 * 7));
  return Math.max(1, Math.min(PROGRAM_WEEKS, diff + 1));
};

const getCurrentQuote = () => {
  const week = getProgramWeek();
  return QUOTES[week % QUOTES.length];
};

const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
const formatDateLong = (iso) => new Date(iso).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
const daysAgo = (iso) => {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
  if (d === 0) return 'TODAY';
  if (d === 1) return 'YESTERDAY';
  return `${d}D AGO`;
};

const getDayKey = (date = new Date()) => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][date.getDay()];

const WEEK_SCHEDULE = [
  { dayName: 'MON', dayKey: 'Mon', programId: 'upper-strength' },
  { dayName: 'TUE', dayKey: 'Tue', programId: 'lower-strength' },
  { dayName: 'WED', dayKey: 'Wed', programId: null, isRest: true },
  { dayName: 'THU', dayKey: 'Thu', programId: 'upper-hypertrophy' },
  { dayName: 'FRI', dayKey: 'Fri', programId: 'lower-skill' },
  { dayName: 'SAT', dayKey: 'Sat', programId: null, isSport: true },
  { dayName: 'SUN', dayKey: 'Sun', programId: null, isSport: true },
];

// ============================================================================
// PERSISTENCE — localStorage
// ============================================================================

const STORAGE_KEY = 'forge-tracker-v2';

const initialState = () => {
  const exerciseState = {};
  Object.values(PROGRAM).forEach(p => {
    p.exercises.forEach(ex => {
      exerciseState[ex.name] = {
        weight: null,         // null = not yet set by user
        reps: null,
        muscle: ex.muscle,
        isBodyweight: !!ex.isBodyweight,
        isHold: !!ex.isHold,
        defaultWeight: ex.defaultWeight,
        defaultReps: ex.defaultReps,
        history: [],          // [{ weight, reps, date }]
        personalBest: null,   // { weight, reps, date }
      };
    });
  });
  return {
    exercises: exerciseState,
    sessions: [],             // [{ id, programId, name, date, completedExercises: [name] }]
    measurements: [],         // [{ date, weight, waist }]
    lastPhotoDate: null,
  };
};

const loadState = () => {
  if (typeof window === 'undefined') return initialState();
  try {
    const raw = window.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw);
    // Merge so new exercises added later still show up
    const base = initialState();
    Object.keys(base.exercises).forEach(k => {
      if (parsed.exercises?.[k]) base.exercises[k] = { ...base.exercises[k], ...parsed.exercises[k] };
    });
    return {
      ...base,
      sessions: parsed.sessions || [],
      measurements: parsed.measurements || [],
      lastPhotoDate: parsed.lastPhotoDate || null,
    };
  } catch (e) {
    return initialState();
  }
};

const saveState = (state) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) { /* ignore */ }
};

// ============================================================================
// MAIN APP
// ============================================================================

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [state, setStateRaw] = useState(loadState);
  const [activeProgramId, setActiveProgramId] = useState(null);

  const setState = (updater) => {
    setStateRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveState(next);
      return next;
    });
  };

  // ----- Exercise updates -----
  const updateExercise = (name, weight, reps) => {
    setState(prev => {
      const ex = prev.exercises[name];
      if (!ex) return prev;
      const w = ex.isBodyweight ? 0 : parseFloat(weight) || 0;
      const r = parseInt(reps) || 0;
      const dateNow = new Date().toISOString();
      const newHistory = [...ex.history, { weight: w, reps: r, date: dateNow }];
      const allEntries = [...newHistory];
      const pb = allEntries.reduce((best, cur) => {
        if (!best) return cur;
        if (cur.weight > best.weight) return cur;
        if (cur.weight === best.weight && cur.reps > best.reps) return cur;
        return best;
      }, null);
      return {
        ...prev,
        exercises: {
          ...prev.exercises,
          [name]: { ...ex, weight: w, reps: r, history: newHistory, personalBest: pb },
        },
      };
    });
  };

  // ----- Session marking -----
  const markSessionDone = (programId, completedExercises) => {
    setState(prev => ({
      ...prev,
      sessions: [
        {
          id: `s${Date.now()}`,
          programId,
          name: PROGRAM[programId].name,
          date: new Date().toISOString(),
          completedExercises,
        },
        ...prev.sessions,
      ],
    }));
  };

  // ----- Measurements -----
  const addMeasurement = (weight, waist) => {
    setState(prev => ({
      ...prev,
      measurements: [
        { date: new Date().toISOString(), weight: parseFloat(weight) || null, waist: parseFloat(waist) || null },
        ...prev.measurements,
      ],
    }));
  };

  const markPhotoDone = () => {
    setState(prev => ({ ...prev, lastPhotoDate: new Date().toISOString() }));
  };

  const openProgram = (pid) => { setActiveProgramId(pid); setTab('workout'); };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
        .font-mono-num { font-family: 'JetBrains Mono', monospace; font-feature-settings: 'tnum'; }
        .stripe-bg { background-image: repeating-linear-gradient(-45deg, rgba(59,130,246,0.04) 0px, rgba(59,130,246,0.04) 2px, transparent 2px, transparent 12px); }
        .stripe-bg-warm { background-image: repeating-linear-gradient(-45deg, rgba(245,158,11,0.05) 0px, rgba(245,158,11,0.05) 2px, transparent 2px, transparent 12px); }
        .grid-bg { background-image: linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px); background-size: 24px 24px; }
        .scan-line { background: linear-gradient(180deg, transparent 0%, rgba(59,130,246,0.05) 50%, transparent 100%); }
        input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); } 50% { box-shadow: 0 0 0 6px rgba(59,130,246,0); } }
        .pulse-glow { animation: pulse-glow 2s infinite; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>

      {tab === 'dashboard' && <Dashboard state={state} openProgram={openProgram} setTab={setTab} />}
      {tab === 'workout' && (
        <Workout
          programId={activeProgramId}
          state={state}
          onUpdate={updateExercise}
          onMarkSessionDone={markSessionDone}
          onBack={() => { setActiveProgramId(null); setTab('dashboard'); }}
          onPick={openProgram}
        />
      )}
      {tab === 'fuel' && <Fuel state={state} />}
      {tab === 'history' && <HistoryView state={state} />}
      {tab === 'progress' && (
        <Progress state={state} onAddMeasurement={addMeasurement} onMarkPhoto={markPhotoDone} />
      )}

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

// ============================================================================
// DASHBOARD
// ============================================================================

function Dashboard({ state, openProgram, setTab }) {
  const week = getProgramWeek();
  const quote = getCurrentQuote();
  const todayKey = getDayKey();
  const todaySchedule = WEEK_SCHEDULE.find(d => d.dayKey === todayKey);
  const todayProgram = todaySchedule?.programId ? PROGRAM[todaySchedule.programId] : null;

  // Pull-up bottleneck status
  const pullupState = state.exercises['Pull-up / Negative'];
  const currentPullups = pullupState?.personalBest?.reps || pullupState?.reps || 0;
  const pullupTarget = 10;
  const pullupProgress = Math.min(100, (currentPullups / pullupTarget) * 100);

  // Sessions this week
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7)); weekStart.setHours(0,0,0,0);
  const sessionsThisWeek = state.sessions.filter(s => new Date(s.date) >= weekStart).length;
  const streak = calculateStreak(state.sessions);

  // Latest weight
  const latestWeight = state.measurements[0]?.weight || null;

  return (
    <div className="px-5 pt-6 pb-8">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-blue-500 animate-pulse"></div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-blue-400 font-bold">
              Recomp · Week {week} of {PROGRAM_WEEKS}
            </p>
          </div>
          <p className="text-[10px] text-zinc-500 font-mono-num">
            {latestWeight ? `${latestWeight}KG` : '—'} <span className="text-zinc-700">·</span> TARGET LEAN
          </p>
        </div>
        <h1 className="text-5xl font-black uppercase leading-[0.85] tracking-tight">
          {USER.name}<span className="text-blue-500">.</span>
        </h1>
        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 mt-1 font-bold">
          Personal Strength System
        </p>
      </div>

      {/* Today's session — the hero card */}
      <div className="mb-5">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-[10px] font-mono-num text-blue-500">01</span>
          <h2 className="text-base font-bold uppercase tracking-wider">Today</h2>
          <span className="text-[10px] text-zinc-500 font-mono-num ml-auto">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase()}
          </span>
        </div>

        {todayProgram ? (
          <button onClick={() => openProgram(todaySchedule.programId)}
            className="w-full relative bg-zinc-900 border border-zinc-800 hover:border-blue-500 transition-all overflow-hidden text-left group">
            <div className={`absolute top-0 left-0 h-full w-1.5 ${getMuscleColor(todayProgram.primaryMuscle).bg}`}></div>
            <div className="absolute inset-0 grid-bg opacity-50"></div>
            <div className="relative px-5 py-5 pl-7">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-blue-400 font-bold mb-1">
                    {todayProgram.dayLabel} · {todayProgram.focus}
                  </p>
                  <h3 className="text-3xl font-black uppercase leading-none">{todayProgram.name}</h3>
                </div>
                <div className="w-10 h-10 border border-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-zinc-950 transition">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-[10px] font-mono-num text-zinc-500">
                  {todayProgram.exercises.length} EXERCISES
                </span>
                <span className="text-zinc-700">·</span>
                <span className={`text-[10px] uppercase tracking-widest font-bold ${getMuscleColor(todayProgram.primaryMuscle).text}`}>
                  {getMuscleColor(todayProgram.primaryMuscle).label}
                </span>
              </div>
            </div>
          </button>
        ) : todaySchedule?.isSport ? (
          <div className="bg-zinc-900/50 border border-amber-500/30 px-5 py-5 stripe-bg-warm">
            <p className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-bold mb-1">Active Recovery</p>
            <h3 className="text-3xl font-black uppercase">Badminton 🏸</h3>
            <p className="text-[11px] text-zinc-500 mt-2">Counts as conditioning. Hydrate well.</p>
          </div>
        ) : (
          <div className="bg-zinc-900/50 border border-zinc-800 px-5 py-5 stripe-bg">
            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold mb-1">Rest Day</p>
            <h3 className="text-3xl font-black uppercase text-zinc-400">Recovery</h3>
            <p className="text-[11px] text-zinc-500 mt-2">Light walk, mobility, sleep. That's it.</p>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-1.5 mb-5">
        <StatTile icon={<Flame className="w-3 h-3" />} label="Streak" value={streak} unit="d" accent />
        <StatTile icon={<Target className="w-3 h-3" />} label="Week" value={`${sessionsThisWeek}/4`} />
        <StatTile icon={<Calendar className="w-3 h-3" />} label="Total" value={state.sessions.length} />
      </div>

      {/* THE BOTTLENECK — pull-up tracker */}
      <div className="mb-5">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-[10px] font-mono-num text-blue-500">02</span>
          <h2 className="text-base font-bold uppercase tracking-wider">The Bottleneck</h2>
          <span className="text-[10px] text-zinc-500 ml-auto font-mono-num">PULL-UP MAX</span>
        </div>
        <div className="bg-zinc-900/40 border border-blue-500/30 px-4 py-4 relative overflow-hidden">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-1">CURRENT MAX</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black font-mono-num text-blue-400 leading-none">
                  {currentPullups}
                </span>
                <span className="text-sm text-zinc-500 uppercase tracking-widest font-bold">reps</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">TARGET · WK 12</p>
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-2xl font-black font-mono-num text-zinc-400 leading-none">{pullupTarget}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">reps</span>
              </div>
            </div>
          </div>
          <div className="h-2 bg-zinc-800 relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
                 style={{ width: `${pullupProgress}%` }}></div>
          </div>
          <p className="text-[10px] text-zinc-500 mt-2 font-mono-num">
            {currentPullups < pullupTarget
              ? `${pullupTarget - currentPullups} REPS TO GOAL · ${Math.round(pullupProgress)}% THERE`
              : '🎯 TARGET HIT — RAISE THE BAR'}
          </p>
        </div>
      </div>

      {/* Quote */}
      <div className="relative mb-5 border-l-2 border-blue-500 bg-zinc-900/40 pl-4 pr-3 py-2.5 stripe-bg">
        <Quote className="absolute top-2 right-2 w-3 h-3 text-blue-500/40" />
        <p className="text-sm italic text-zinc-200 leading-snug">"{quote.text}"</p>
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1 font-bold">— {quote.author}</p>
      </div>

      {/* Week strip */}
      <div className="mb-2">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-[10px] font-mono-num text-blue-500">03</span>
          <h2 className="text-base font-bold uppercase tracking-wider">This Week</h2>
        </div>
        <WeekStrip state={state} openProgram={openProgram} />
      </div>
    </div>
  );
}

function StatTile({ icon, label, value, unit, accent }) {
  return (
    <div className={`relative border ${accent ? 'border-blue-500 bg-blue-500/5' : 'border-zinc-800 bg-zinc-900/50'} p-2.5 stripe-bg`}>
      <div className={`flex items-center gap-1 mb-1 ${accent ? 'text-blue-400' : 'text-zinc-500'}`}>
        {icon}
        <span className="text-[9px] uppercase tracking-widest font-bold">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-black font-mono-num ${accent ? 'text-blue-400' : 'text-zinc-100'} leading-none`}>
          {value}
        </span>
        {unit && <span className="text-[9px] text-zinc-500 uppercase tracking-wider">{unit}</span>}
      </div>
    </div>
  );
}

function WeekStrip({ state, openProgram }) {
  const today = new Date();
  const todayIdx = (today.getDay() + 6) % 7;
  const todayStr = today.toDateString();
  const doneToday = new Set(
    state.sessions.filter(s => new Date(s.date).toDateString() === todayStr).map(s => s.programId)
  );

  return (
    <div className="grid grid-cols-7 gap-1">
      {WEEK_SCHEDULE.map((d, i) => {
        const isToday = i === todayIdx;
        const program = d.programId ? PROGRAM[d.programId] : null;
        const c = program ? getMuscleColor(program.primaryMuscle) : null;
        const isDone = program && doneToday.has(d.programId);
        const base = 'relative flex flex-col items-center justify-between py-2 px-1 border transition min-h-[64px] text-center';

        if (d.isRest) return (
          <div key={i} className={`${base} bg-zinc-900/30 border-zinc-800 ${isToday ? 'ring-1 ring-blue-500' : ''}`}>
            <span className={`text-[9px] font-mono-num font-bold ${isToday ? 'text-blue-400' : 'text-zinc-500'}`}>{d.dayName}</span>
            <span className="text-zinc-600 text-sm">·</span>
            <span className="text-[8px] uppercase text-zinc-600 font-bold">REST</span>
          </div>
        );
        if (d.isSport) return (
          <div key={i} className={`${base} bg-zinc-900/40 border-zinc-800 ${isToday ? 'ring-1 ring-blue-500' : ''}`}>
            <span className={`text-[9px] font-mono-num font-bold ${isToday ? 'text-blue-400' : 'text-zinc-500'}`}>{d.dayName}</span>
            <span className="text-sm">🏸</span>
            <span className="text-[8px] uppercase text-zinc-400 font-bold">SPORT</span>
          </div>
        );
        return (
          <button key={i} onClick={() => openProgram(d.programId)}
            className={`${base} bg-zinc-900 hover:bg-zinc-800 ${isToday ? 'ring-1 ring-blue-500' : 'border-zinc-800'} group`}>
            <div className={`absolute top-0 left-0 right-0 h-0.5 ${c.bg}`}></div>
            {isDone && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full"></div>}
            <span className={`text-[9px] font-mono-num font-bold ${isToday ? 'text-blue-400' : 'text-zinc-500'}`}>{d.dayName}</span>
            <span className="text-[10px] font-bold uppercase leading-none">{program.name.split(' ')[0]}</span>
            <span className={`text-[8px] uppercase ${c.text} font-bold`}>{program.name.split(' ').slice(1).join(' ')}</span>
          </button>
        );
      })}
    </div>
  );
}

const calculateStreak = (sessions) => {
  if (!sessions.length) return 0;
  const dates = [...new Set(sessions.map(s => new Date(s.date).toDateString()))].sort((a,b) => new Date(b) - new Date(a));
  const mostRecent = new Date(dates[0]); mostRecent.setHours(0,0,0,0);
  const today = new Date(); today.setHours(0,0,0,0);
  if (Math.floor((today - mostRecent) / 86400000) > 2) return 0;
  let count = 1, prev = mostRecent;
  for (let i = 1; i < dates.length; i++) {
    const cur = new Date(dates[i]); cur.setHours(0,0,0,0);
    if (Math.floor((prev - cur) / 86400000) <= 2) { count++; prev = cur; } else break;
  }
  return count;
};

// ============================================================================
// WORKOUT
// ============================================================================

function Workout({ programId, state, onUpdate, onMarkSessionDone, onBack, onPick }) {
  // If no program selected, show picker
  if (!programId || !PROGRAM[programId]) return <WorkoutPicker onPick={onPick} />;

  const program = PROGRAM[programId];
  const [doneIds, setDoneIds] = useState(new Set());
  const [editingExercise, setEditingExercise] = useState(null);
  const c = getMuscleColor(program.primaryMuscle);

  const toggleDone = (name) => {
    setDoneIds(prev => {
      const n = new Set(prev);
      n.has(name) ? n.delete(name) : n.add(name);
      return n;
    });
  };

  const handleFinish = () => {
    if (doneIds.size === 0) { onBack(); return; }
    onMarkSessionDone(programId, [...doneIds]);
    setDoneIds(new Set());
    onBack();
  };

  const completedCount = doneIds.size;
  const totalCount = program.exercises.length;

  return (
    <div>
      {/* Sticky header — NO TIMER */}
      <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur border-b border-zinc-800">
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-start justify-between mb-2">
            <div>
              <button onClick={onBack} className="text-[10px] uppercase tracking-[0.25em] text-blue-400 font-bold mb-1 hover:text-blue-300">
                ← {formatDateLong(new Date().toISOString()).toUpperCase()}
              </button>
              <h1 className="text-2xl font-black uppercase tracking-tight leading-none">{program.name}</h1>
              <p className="text-[11px] text-zinc-500 mt-1">{program.focus}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Done</p>
              <p className="text-2xl font-black font-mono-num text-blue-400 leading-none">{completedCount}<span className="text-sm text-zinc-600">/{totalCount}</span></p>
            </div>
          </div>
          <div className="h-1 bg-zinc-800 overflow-hidden">
            <div className={`h-full ${c.bg} transition-all`} style={{ width: `${(completedCount / totalCount) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        <PhaseBlock title="Warm-up" badge="8 MIN" items={WARMUP} accent="amber" />

        {program.exercises.map((ex, i) => (
          <ExerciseCard
            key={ex.name}
            index={i + 1}
            exercise={ex}
            state={state.exercises[ex.name]}
            isDone={doneIds.has(ex.name)}
            isEditing={editingExercise === ex.name}
            onEdit={() => setEditingExercise(editingExercise === ex.name ? null : ex.name)}
            onUpdate={(w, r) => { onUpdate(ex.name, w, r); setEditingExercise(null); }}
            onToggleDone={() => toggleDone(ex.name)}
          />
        ))}

        <PhaseBlock title="Cooldown" badge="MOBILITY" items={COOLDOWN} accent="emerald" />

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button onClick={onBack} className="bg-zinc-900 border border-zinc-800 hover:border-red-500 hover:text-red-400 py-3 uppercase tracking-widest text-xs font-bold transition flex items-center justify-center gap-2">
            <X className="w-4 h-4" /> Cancel
          </button>
          <button onClick={handleFinish}
            disabled={completedCount === 0}
            className={`py-3 uppercase tracking-widest text-xs font-black transition flex items-center justify-center gap-2 ${
              completedCount === 0
                ? 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-400 text-zinc-950'
            }`}>
            <Check className="w-4 h-4" /> Save Session
          </button>
        </div>
      </div>
    </div>
  );
}

function WorkoutPicker({ onPick }) {
  return (
    <div className="px-5 pt-8 pb-6">
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.25em] text-blue-400 font-bold mb-1">No Session Selected</p>
        <h1 className="text-4xl font-black uppercase leading-none">Pick Your Day</h1>
      </div>
      <div className="space-y-2">
        {Object.values(PROGRAM).map(p => {
          const c = getMuscleColor(p.primaryMuscle);
          return (
            <button key={p.id} onClick={() => onPick(p.id)}
              className="group relative bg-zinc-900 border border-zinc-800 hover:border-blue-500 transition w-full text-left overflow-hidden">
              <div className={`absolute top-0 left-0 h-full w-1 ${c.bg}`}></div>
              <div className="flex items-center justify-between px-4 py-3 pl-5">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 font-mono-num">{p.dayLabel}</span>
                    <span className="text-zinc-700">·</span>
                    <span className={`text-[10px] uppercase tracking-widest ${c.text} font-bold`}>{c.label}</span>
                  </div>
                  <h3 className="text-base font-bold uppercase tracking-wide">{p.name}</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{p.focus}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PhaseBlock({ title, badge, items, accent }) {
  const colors = {
    amber: 'border-amber-500 text-amber-400 bg-amber-500/5',
    emerald: 'border-emerald-500 text-emerald-400 bg-emerald-500/5',
  };
  return (
    <div className={`border-l-4 ${colors[accent]} pl-3 py-2 stripe-bg`}>
      <div className="flex items-center gap-2 mb-1.5">
        <h3 className="text-base font-bold uppercase tracking-wider">{title}</h3>
        <span className={`text-[9px] font-mono-num font-bold px-1.5 py-0.5 ${colors[accent]} border`}>{badge}</span>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-zinc-400 flex items-start gap-2">
            <span className="text-zinc-700 font-mono-num text-[10px] mt-0.5">{String(i + 1).padStart(2, '0')}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExerciseCard({ index, exercise, state, isDone, isEditing, onEdit, onUpdate, onToggleDone }) {
  const c = getMuscleColor(exercise.muscle);
  const isSet = state.weight !== null || state.reps !== null;
  const displayWeight = state.weight !== null ? state.weight : exercise.defaultWeight;
  const displayReps = state.reps !== null ? state.reps : exercise.defaultReps;
  const lastUpdate = state.history.length > 0 ? state.history[state.history.length - 1].date : null;

  const [weightInput, setWeightInput] = useState(displayWeight);
  const [repsInput, setRepsInput] = useState(displayReps);

  useEffect(() => {
    if (isEditing) {
      setWeightInput(displayWeight);
      setRepsInput(displayReps);
    }
  }, [isEditing, displayWeight, displayReps]);

  const handleSave = () => onUpdate(weightInput, repsInput);

  return (
    <div className={`relative bg-zinc-900/40 border-l-4 ${c.border} ${isDone ? 'bg-green-500/5 border-green-500' : ''} transition`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800/60">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="text-2xl font-black font-mono-num text-zinc-700 leading-none">{String(index).padStart(2,'0')}</span>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold uppercase tracking-wide leading-tight">{exercise.name}</h3>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 border ${c.bgSoft} ${c.text} ${c.borderSoft}`}>
                  {c.label}
                </span>
                <span className="text-[9px] font-mono-num text-zinc-500">{exercise.sets}</span>
                {state.personalBest && state.personalBest.reps > 0 && (
                  <span className="flex items-center gap-0.5 text-[9px] font-mono-num text-amber-400">
                    <Trophy className="w-2.5 h-2.5" />
                    PB {state.personalBest.weight > 0 ? `${state.personalBest.weight}kg` : ''}{state.personalBest.weight > 0 ? '×' : ''}{state.personalBest.reps}{exercise.isHold ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onToggleDone}
            className={`w-8 h-8 border-2 transition flex items-center justify-center flex-shrink-0 ${
              isDone ? 'bg-green-500 border-green-500' : 'border-zinc-700 hover:border-blue-500'
            }`}>
            {isDone && <Check className="w-5 h-5 text-zinc-950" strokeWidth={3} />}
          </button>
        </div>
        {exercise.note && (
          <p className={`text-[11px] ${c.text} italic mt-2 ml-9`}>{exercise.note}</p>
        )}
      </div>

      {/* Current numbers */}
      <div className="px-4 py-3">
        {!isEditing ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-4">
              {!exercise.isBodyweight && (
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-0.5">Weight</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-black font-mono-num leading-none ${isSet ? c.text : 'text-zinc-600'}`}>
                      {displayWeight}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">kg</span>
                  </div>
                </div>
              )}
              <div>
                <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-0.5">
                  {exercise.isHold ? 'Hold' : 'Reps'}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-black font-mono-num leading-none ${isSet ? c.text : 'text-zinc-600'}`}>
                    {displayReps}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{exercise.isHold ? 'sec' : 'reps'}</span>
                </div>
              </div>
            </div>
            <button onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-2 border border-zinc-800 hover:border-blue-500 hover:text-blue-400 transition text-[10px] uppercase tracking-widest font-bold">
              <Edit3 className="w-3 h-3" />
              {isSet ? 'Update' : 'Set'}
            </button>
          </div>
        ) : (
          <div className="space-y-2 slide-up">
            <div className="grid grid-cols-2 gap-2">
              {!exercise.isBodyweight && (
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Weight (kg)</label>
                  <input type="number" step="2.5" value={weightInput} autoFocus
                    onChange={e => setWeightInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-blue-500 px-3 py-2 text-lg font-mono-num focus:outline-none" />
                </div>
              )}
              <div className={exercise.isBodyweight ? 'col-span-2' : ''}>
                <label className="block text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-1">
                  {exercise.isHold ? 'Hold (sec)' : 'Reps'}
                </label>
                <input type="number" value={repsInput}
                  autoFocus={exercise.isBodyweight}
                  onChange={e => setRepsInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-blue-500 px-3 py-2 text-lg font-mono-num focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={onEdit} className="border border-zinc-800 hover:border-zinc-600 py-2 text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                Cancel
              </button>
              <button onClick={handleSave} className={`${c.bg} hover:opacity-90 text-zinc-950 py-2 text-[10px] uppercase tracking-widest font-black`}>
                Save
              </button>
            </div>
          </div>
        )}
        {lastUpdate && !isEditing && (
          <p className="text-[10px] text-zinc-600 font-mono-num mt-2 uppercase tracking-widest">
            Last updated · {daysAgo(lastUpdate)}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// FUEL (Diet plan)
// ============================================================================

function Fuel({ state }) {
  const [activeDay, setActiveDay] = useState(getDayKey());
  const [showGrocery, setShowGrocery] = useState(false);

  const dayPlan = MEAL_PLAN[activeDay];
  const dayMeals = dayPlan.meals;
  const dayTotals = dayMeals.reduce((acc, m) => ({
    kcal: acc.kcal + m.kcal,
    protein: acc.protein + m.protein,
    carbs: acc.carbs + m.carbs,
    fat: acc.fat + m.fat,
  }), { kcal: 0, protein: 0, carbs: 0, fat: 0 });

  const tagColor = dayPlan.tagColor ? getMuscleColor(dayPlan.tagColor) : null;

  return (
    <div className="px-5 pt-6 pb-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-emerald-500"></div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-bold">
              Recomp Nutrition
            </p>
          </div>
          <p className="text-[10px] text-zinc-500 font-mono-num">{DAILY_TARGET.kcal} KCAL · {DAILY_TARGET.protein}g P</p>
        </div>
        <h1 className="text-4xl font-black uppercase leading-none tracking-tight">
          Fuel<span className="text-emerald-500">.</span>
        </h1>
      </div>

      {/* Day selector */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {Object.keys(MEAL_PLAN).map(dk => {
          const p = MEAL_PLAN[dk];
          const isActive = activeDay === dk;
          const isToday = dk === getDayKey();
          return (
            <button key={dk} onClick={() => setActiveDay(dk)}
              className={`relative py-2 px-1 border transition ${
                isActive
                  ? 'bg-blue-500 text-zinc-950 border-blue-500'
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-400'
              }`}>
              {isToday && !isActive && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>}
              <span className="block text-[10px] font-mono-num font-bold">{dk.toUpperCase()}</span>
            </button>
          );
        })}
      </div>

      {/* Day header */}
      <div className="mb-4 bg-zinc-900/40 border border-zinc-800 px-4 py-3 stripe-bg">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-black uppercase tracking-tight">{dayPlan.dayLabel}</h2>
          {tagColor ? (
            <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 border ${tagColor.bgSoft} ${tagColor.text} ${tagColor.borderSoft}`}>
              {dayPlan.sessionTag}
            </span>
          ) : (
            <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 border bg-zinc-800/40 text-zinc-500 border-zinc-700">
              {dayPlan.sessionTag}
            </span>
          )}
        </div>
        {dayPlan.note && <p className="text-[11px] text-zinc-500 italic">{dayPlan.note}</p>}
      </div>

      {/* Day macro totals */}
      <div className="grid grid-cols-4 gap-1.5 mb-5">
        <MacroBox label="Kcal" value={dayTotals.kcal} target={DAILY_TARGET.kcal} color="kcal" />
        <MacroBox label="Protein" value={dayTotals.protein} target={DAILY_TARGET.protein} color="protein" unit="g" />
        <MacroBox label="Carbs" value={dayTotals.carbs} target={DAILY_TARGET.carbs} color="carbs" unit="g" />
        <MacroBox label="Fat" value={dayTotals.fat} target={DAILY_TARGET.fat} color="fat" unit="g" />
      </div>

      {/* Meals */}
      <div className="space-y-3 mb-6">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[10px] font-mono-num text-emerald-500">01</span>
          <h2 className="text-base font-bold uppercase tracking-wider">Meals</h2>
        </div>
        {dayMeals.map((meal, i) => <MealCard key={i} meal={meal} index={i + 1} />)}
      </div>

      {/* Grocery list */}
      <div className="mb-5">
        <button onClick={() => setShowGrocery(!showGrocery)}
          className="w-full flex items-center justify-between bg-zinc-900/40 border border-zinc-800 hover:border-emerald-500/40 px-4 py-3 transition">
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] font-mono-num text-emerald-500">02</span>
            <h2 className="text-base font-bold uppercase tracking-wider">Weekly Grocery List</h2>
          </div>
          <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${showGrocery ? 'rotate-180' : ''}`} />
        </button>
        {showGrocery && (
          <div className="mt-2 space-y-2 slide-up">
            {GROCERY_LIST.map((cat, ci) => {
              const total = cat.items.reduce((a, b) => a + b.price, 0);
              return (
                <div key={ci} className="bg-zinc-900/30 border border-zinc-800 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-zinc-300">{cat.category}</h4>
                    <span className="text-[10px] font-mono-num text-emerald-400 font-bold">₹{total}</span>
                  </div>
                  <div className="space-y-1">
                    {cat.items.map((item, ii) => (
                      <div key={ii} className="flex items-center justify-between text-[11px] text-zinc-400 py-0.5">
                        <span className="flex-1 min-w-0 truncate">· {item.name}</span>
                        <span className="font-mono-num text-zinc-500 ml-2">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest font-bold text-emerald-300">Weekly Total</span>
              <span className="text-lg font-black font-mono-num text-emerald-400">
                ₹{GROCERY_LIST.reduce((s, c) => s + c.items.reduce((a, b) => a + b.price, 0), 0)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Diet rules */}
      <div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-[10px] font-mono-num text-emerald-500">03</span>
          <h2 className="text-base font-bold uppercase tracking-wider">Rules That Matter</h2>
        </div>
        <div className="space-y-1.5">
          {DIET_RULES.map((r, i) => {
            const sev = { high: 'border-rose-500/40 text-rose-300', med: 'border-amber-500/40 text-amber-300', low: 'border-zinc-700 text-zinc-400' }[r.severity];
            return (
              <div key={i} className={`bg-zinc-900/30 border-l-2 ${sev} pl-3 py-2`}>
                <p className="text-xs">{r.rule}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MacroBox({ label, value, target, color, unit }) {
  const c = MACRO_COLORS[color];
  const pct = Math.min(100, (value / target) * 100);
  return (
    <div className="relative bg-zinc-900/40 border border-zinc-800 p-2 overflow-hidden">
      <p className={`text-[8px] uppercase tracking-widest font-bold ${c.text} mb-0.5`}>{label}</p>
      <div className="flex items-baseline gap-0.5">
        <span className={`text-base font-black font-mono-num ${c.text} leading-none`}>{Math.round(value)}</span>
        {unit && <span className="text-[8px] text-zinc-500">{unit}</span>}
      </div>
      <p className="text-[8px] font-mono-num text-zinc-600">/{target}{unit || ''}</p>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-800">
        <div className={`h-full ${c.bg}`} style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
}

function MealCard({ meal, index }) {
  const icons = { pre: Coffee, breakfast: Coffee, lunch: UtensilsCrossed, snack: Apple, dinner: UtensilsCrossed, prebed: Coffee, cheat: Award };
  const Icon = icons[meal.icon] || UtensilsCrossed;
  const isCheat = meal.isCheat;

  return (
    <div className={`bg-zinc-900/40 border-l-2 ${isCheat ? 'border-amber-500' : meal.optional ? 'border-zinc-700' : 'border-emerald-500'} ${isCheat ? 'stripe-bg-warm' : ''} relative`}>
      <div className="px-4 py-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <div className={`p-1.5 ${isCheat ? 'bg-amber-500/10' : 'bg-emerald-500/10'} mt-0.5`}>
              <Icon className={`w-3 h-3 ${isCheat ? 'text-amber-400' : 'text-emerald-400'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-num font-bold text-zinc-500">{meal.time}</span>
                {meal.optional && <span className="text-[8px] uppercase tracking-widest font-bold text-zinc-600">· OPTIONAL</span>}
              </div>
              <h4 className="text-sm font-bold uppercase tracking-wide mt-0.5">{meal.name}</h4>
            </div>
          </div>
          <div className="flex items-baseline gap-1 ml-2 flex-shrink-0">
            <span className={`text-lg font-black font-mono-num ${isCheat ? 'text-amber-400' : 'text-emerald-400'} leading-none`}>{meal.kcal}</span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider">kcal</span>
          </div>
        </div>
        <ul className="space-y-1 ml-9">
          {meal.items.map((item, i) => (
            <li key={i} className="text-xs text-zinc-300 leading-snug">· {item}</li>
          ))}
        </ul>
        {meal.note && (
          <p className={`text-[10px] italic mt-2 ml-9 ${isCheat ? 'text-amber-300/80' : 'text-zinc-500'}`}>{meal.note}</p>
        )}
        <div className="flex items-center gap-3 mt-2 ml-9 pt-2 border-t border-zinc-800/60">
          <span className="text-[9px] font-mono-num"><span className="text-blue-400 font-bold">{meal.protein}P</span></span>
          <span className="text-zinc-700">·</span>
          <span className="text-[9px] font-mono-num"><span className="text-amber-400 font-bold">{meal.carbs}C</span></span>
          <span className="text-zinc-700">·</span>
          <span className="text-[9px] font-mono-num"><span className="text-rose-400 font-bold">{meal.fat}F</span></span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// HISTORY / LOG
// ============================================================================

function HistoryView({ state }) {
  const sessions = state.sessions;
  return (
    <div className="px-5 pt-6 pb-6">
      <div className="mb-5">
        <p className="text-[10px] uppercase tracking-[0.25em] text-blue-400 mb-1 font-bold">Training Log</p>
        <h1 className="text-4xl font-black uppercase leading-none">
          History<span className="text-blue-500">.</span>
        </h1>
        <p className="text-xs text-zinc-500 mt-1.5 font-mono-num">{sessions.length} SESSIONS LOGGED</p>
      </div>
      <div className="space-y-2">
        {sessions.length === 0 ? (
          <div className="border border-zinc-800 p-8 text-center text-zinc-500 text-sm stripe-bg">
            <p className="uppercase tracking-widest font-bold text-xs mb-2">No Sessions Yet</p>
            <p className="text-[11px]">Complete a workout to start your log.</p>
          </div>
        ) : sessions.map(s => <HistoryCard key={s.id} session={s} state={state} />)}
      </div>
    </div>
  );
}

function HistoryCard({ session, state }) {
  const program = PROGRAM[session.programId];
  const c = program ? getMuscleColor(program.primaryMuscle) : null;
  return (
    <div className="bg-zinc-900 border border-zinc-800 relative overflow-hidden">
      {c && <div className={`absolute top-0 left-0 h-full w-1 ${c.bg}`}></div>}
      <div className="px-4 py-3 pl-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-base font-bold uppercase tracking-wide">{session.name}</h3>
            <p className="text-[10px] text-zinc-500 font-mono-num mt-0.5">
              {formatDateLong(session.date).toUpperCase()} · {daysAgo(session.date)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-black font-mono-num text-blue-400 leading-none">{session.completedExercises.length}</p>
            <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">DONE</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {session.completedExercises.map(ex => {
            const exState = state.exercises[ex];
            const muscle = exState?.muscle || 'Skill';
            const mc = getMuscleColor(muscle);
            return (
              <span key={ex} className={`px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold border ${mc.bgSoft} ${mc.borderSoft} ${mc.text}`}>
                {ex}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PROGRESS / STATS
// ============================================================================

function Progress({ state, onAddMeasurement, onMarkPhoto }) {
  const [showMeasureForm, setShowMeasureForm] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [waistInput, setWaistInput] = useState('');

  const handleAddMeasurement = () => {
    if (!weightInput && !waistInput) return;
    onAddMeasurement(weightInput, waistInput);
    setWeightInput(''); setWaistInput('');
    setShowMeasureForm(false);
  };

  const week = getProgramWeek();
  const weeksRemaining = PROGRAM_WEEKS - week;
  const latestMeasure = state.measurements[0];
  const startMeasure = state.measurements[state.measurements.length - 1];

  // Photo days check
  const daysSincePhoto = state.lastPhotoDate
    ? Math.floor((Date.now() - new Date(state.lastPhotoDate).getTime()) / 86400000)
    : null;
  const photoDue = daysSincePhoto === null || daysSincePhoto >= 14;

  // Strength milestones — pull data from key exercises
  const milestones = [
    'Pull-up / Negative',
    'Barbell Bench Press',
    'Back Squat',
    'Overhead Press',
    'Barbell Row',
  ].map(name => {
    const exState = state.exercises[name];
    let exConfig;
    Object.values(PROGRAM).forEach(p => {
      const found = p.exercises.find(e => e.name === name);
      if (found) exConfig = found;
    });
    return { name, state: exState, config: exConfig, muscle: exState?.muscle };
  }).filter(m => m.config);

  return (
    <div className="px-5 pt-6 pb-6">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-blue-500 animate-pulse"></div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-blue-400 font-bold">
              Week {week} of {PROGRAM_WEEKS}
            </p>
          </div>
          <p className="text-[10px] text-zinc-500 font-mono-num">{weeksRemaining} WEEKS LEFT</p>
        </div>
        <h1 className="text-4xl font-black uppercase leading-none tracking-tight">
          Progress<span className="text-blue-500">.</span>
        </h1>
      </div>

      {/* Body measurements */}
      <div className="mb-5">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-[10px] font-mono-num text-blue-500">01</span>
          <h2 className="text-base font-bold uppercase tracking-wider">Body</h2>
          <button onClick={() => setShowMeasureForm(!showMeasureForm)}
            className="ml-auto text-[10px] uppercase tracking-widest font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <Plus className="w-3 h-3" /> Log
          </button>
        </div>

        {showMeasureForm && (
          <div className="bg-zinc-900/40 border border-blue-500/30 p-3 mb-2 slide-up">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Weight (kg)</label>
                <input type="number" step="0.1" value={weightInput} onChange={e => setWeightInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-blue-500 px-3 py-2 text-base font-mono-num focus:outline-none" />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Waist (cm)</label>
                <input type="number" step="0.5" value={waistInput} onChange={e => setWaistInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-blue-500 px-3 py-2 text-base font-mono-num focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setShowMeasureForm(false)}
                className="border border-zinc-800 hover:border-zinc-600 py-2 text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                Cancel
              </button>
              <button onClick={handleAddMeasurement}
                className="bg-blue-500 hover:bg-blue-400 text-zinc-950 py-2 text-[10px] uppercase tracking-widest font-black">
                Save
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <MeasurementCard label="Weight" value={latestMeasure?.weight} unit="kg"
            history={state.measurements.map(m => ({ value: m.weight, date: m.date })).filter(m => m.value)}
            startValue={startMeasure?.weight} />
          <MeasurementCard label="Waist" value={latestMeasure?.waist} unit="cm"
            history={state.measurements.map(m => ({ value: m.waist, date: m.date })).filter(m => m.value)}
            startValue={startMeasure?.waist} />
        </div>
      </div>

      {/* Photo reminder */}
      <div className="mb-5">
        <div className={`bg-zinc-900/40 border ${photoDue ? 'border-amber-500/40' : 'border-zinc-800'} px-4 py-3 flex items-center gap-3`}>
          <div className={`p-2 ${photoDue ? 'bg-amber-500/10' : 'bg-zinc-800'}`}>
            <Camera className={`w-4 h-4 ${photoDue ? 'text-amber-400' : 'text-zinc-500'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-300">Progress Photos</p>
            <p className="text-[11px] text-zinc-500 mt-0.5 font-mono-num">
              {state.lastPhotoDate ? `Last taken · ${daysAgo(state.lastPhotoDate)}` : 'No photos yet'}
            </p>
          </div>
          <button onClick={onMarkPhoto}
            className={`px-3 py-2 border text-[10px] uppercase tracking-widest font-bold transition ${
              photoDue
                ? 'border-amber-500/50 text-amber-300 hover:bg-amber-500/10'
                : 'border-zinc-700 text-zinc-500 hover:border-zinc-600'
            }`}>
            {photoDue ? 'Take Now' : 'Update'}
          </button>
        </div>
      </div>

      {/* Strength milestones — THE meat of stats */}
      <div className="mb-5">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-[10px] font-mono-num text-blue-500">02</span>
          <h2 className="text-base font-bold uppercase tracking-wider">Strength Milestones</h2>
          <span className="text-[10px] text-zinc-500 ml-auto font-mono-num">CURRENT → WK 12</span>
        </div>
        <div className="space-y-2">
          {milestones.map(m => (
            <MilestoneCard key={m.name} name={m.name} state={m.state} config={m.config} muscle={m.muscle} />
          ))}
        </div>
      </div>

      {/* Exercise progression sparklines */}
      <div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-[10px] font-mono-num text-blue-500">03</span>
          <h2 className="text-base font-bold uppercase tracking-wider">Strength Trends</h2>
        </div>
        <div className="space-y-2">
          {milestones.filter(m => m.state.history.length >= 2).map(m => (
            <SparklineCard key={m.name} name={m.name} muscle={m.muscle} history={m.state.history} />
          ))}
          {milestones.filter(m => m.state.history.length >= 2).length === 0 && (
            <div className="border border-zinc-800 p-6 text-center text-zinc-500 text-xs stripe-bg">
              <p className="uppercase tracking-widest font-bold mb-1">Trends appear after 2+ updates</p>
              <p className="text-[10px]">Update an exercise weight or reps to start tracking progression.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MeasurementCard({ label, value, unit, history, startValue }) {
  const delta = (value !== null && value !== undefined && startValue !== null && startValue !== undefined && startValue !== value)
    ? value - startValue : 0;
  const isPositive = delta > 0;
  const isWaist = label === 'Waist';
  const goodDirection = isWaist ? !isPositive : Math.abs(delta) > 0; // for waist, down is good

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 p-3">
      <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-black font-mono-num ${value !== null && value !== undefined ? 'text-blue-400' : 'text-zinc-600'} leading-none`}>
          {value !== null && value !== undefined ? value : '—'}
        </span>
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{unit}</span>
      </div>
      {delta !== 0 && (
        <p className={`text-[10px] font-mono-num mt-1 font-bold ${
          isWaist ? (isPositive ? 'text-rose-400' : 'text-green-400') : (isPositive ? 'text-green-400' : 'text-rose-400')
        }`}>
          {delta > 0 ? '+' : ''}{delta.toFixed(1)} {unit}
        </p>
      )}
      {history.length >= 2 && <MiniSparkline data={history} />}
    </div>
  );
}

function MiniSparkline({ data }) {
  const values = data.map(d => d.value);
  const max = Math.max(...values), min = Math.min(...values);
  const range = max - min || 1;
  const W = 100, H = 18;
  const pts = data.slice().reverse().map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * W,
    y: H - ((d.value - min) / range) * H,
  }));
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-4 mt-1.5" preserveAspectRatio="none">
      <path d={path} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MilestoneCard({ name, state, config, muscle }) {
  const c = getMuscleColor(muscle);
  const isBW = config.isBodyweight;
  const isHold = config.isHold;
  const current = state.personalBest || (state.weight !== null ? { weight: state.weight, reps: state.reps } : null);
  const target = config.target;

  let progress = 0;
  if (current) {
    if (isBW) {
      progress = Math.min(100, (current.reps / target.reps) * 100);
    } else {
      // Combine weight and reps loosely — primary signal is weight
      progress = Math.min(100, (current.weight / target.weight) * 100);
    }
  }

  return (
    <div className={`bg-zinc-900/40 border-l-2 ${c.border} px-3 py-2.5`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold uppercase tracking-wide truncate">{name}</h4>
          <span className={`text-[9px] font-bold uppercase tracking-widest ${c.text}`}>{c.label}</span>
        </div>
        <div className="text-right">
          {current ? (
            <p className={`text-base font-black font-mono-num ${c.text} leading-none`}>
              {isBW ? '' : `${current.weight}kg`}{isBW ? '' : '×'}{current.reps}{isHold ? 's' : ''}
            </p>
          ) : (
            <p className="text-xs font-bold text-zinc-600 uppercase">Not set</p>
          )}
          <p className="text-[9px] font-mono-num text-zinc-500 mt-0.5">
            → {isBW ? '' : `${target.weight}kg`}{isBW ? '' : '×'}{target.reps}{isHold ? 's' : ''}
          </p>
        </div>
      </div>
      <div className="h-1.5 bg-zinc-800 relative overflow-hidden">
        <div className={`h-full ${c.bg} transition-all`} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}

function SparklineCard({ name, muscle, history }) {
  const c = getMuscleColor(muscle);
  const data = history.map(h => ({
    weight: h.weight,
    reps: h.reps,
    date: h.date,
    metric: h.weight > 0 ? h.weight : h.reps,
  }));
  const values = data.map(d => d.metric);
  const max = Math.max(...values), min = Math.min(...values);
  const range = max - min || 1;
  const pr = data.reduce((a, b) => (b.metric > a.metric ? b : a), data[0]);
  const trend = data.length >= 2 ? data[data.length - 1].metric - data[0].metric : 0;

  const W = 200, H = 40, pad = 3;
  const points = data.map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * (W - pad * 2) + pad,
    y: H - pad - ((d.metric - min) / range) * (H - pad * 2),
    ...d,
  }));
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const areaPath = `${path} L ${points[points.length - 1].x},${H} L ${points[0].x},${H} Z`;
  const safeId = name.replace(/[^a-z0-9]/gi, '');

  return (
    <div className={`bg-zinc-900/40 border-l-2 ${c.border} p-3`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold uppercase tracking-wide truncate">{name}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[9px] uppercase tracking-widest font-bold ${c.text}`}>{c.label}</span>
            <span className="text-zinc-700">·</span>
            <span className="text-[10px] text-zinc-500 font-mono-num">{data.length} UPDATES</span>
            {trend !== 0 && (
              <span className={`text-[10px] font-mono-num font-bold ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {trend > 0 ? '+' : ''}{trend}{pr.weight > 0 ? 'KG' : ''}
              </span>
            )}
          </div>
        </div>
        <div className="text-right ml-2 flex-shrink-0">
          <div className="flex items-center gap-1 justify-end">
            <Trophy className="w-2.5 h-2.5 text-amber-400" />
            <span className="text-[8px] uppercase tracking-widest text-amber-400 font-bold">PB</span>
          </div>
          <p className={`text-lg font-black font-mono-num ${c.text} leading-none mt-0.5`}>
            {pr.weight > 0 ? pr.weight : pr.reps}<span className="text-[10px] text-zinc-500 ml-0.5">{pr.weight > 0 ? 'KG' : 'R'}</span>
          </p>
          {pr.weight > 0 && <p className="text-[9px] text-zinc-500 font-mono-num">×{pr.reps}</p>}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-10" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${safeId}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={c.hex} stopOpacity="0.4" />
            <stop offset="100%" stopColor={c.hex} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#grad-${safeId})`} />
        <path d={path} fill="none" stroke={c.hex} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === points.length - 1 ? 2.5 : 1.5} fill={c.hex} />
        ))}
      </svg>
    </div>
  );
}

// ============================================================================
// BOTTOM NAV
// ============================================================================

function BottomNav({ tab, setTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'workout',   label: 'Train', icon: Dumbbell },
    { id: 'fuel',      label: 'Fuel',  icon: UtensilsCrossed },
    { id: 'history',   label: 'Log',   icon: HistoryIcon },
    { id: 'progress',  label: 'Stats', icon: TrendingUp },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 z-20">
      <div className="grid grid-cols-5 max-w-md mx-auto">
        {tabs.map(t => {
          const Icon = t.icon, active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`relative py-2.5 flex flex-col items-center gap-0.5 transition ${active ? 'text-blue-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
              {active && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-0.5 bg-blue-500"></div>}
              <Icon className="w-4 h-4" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[9px] uppercase tracking-widest font-bold">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
