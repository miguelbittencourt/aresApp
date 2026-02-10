// app/contexts/WorkoutDraftContext.tsx
import { WorkoutFormValues } from "@/schemas/workoutSchema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext } from "react";

export type LastActivity = {
  type: "create" | "edit";
  workoutId?: string;
  timestamp: number;
  preview: {
    gymName?: string;
    exerciseCount: number;
  };
};

export type WorkoutDraftContextType = {
  getCreateDraft: () => Promise<WorkoutFormValues | null>;
  getEditDraft: (workoutId: string) => Promise<WorkoutFormValues | null>;
  saveCreateDraft: (data: WorkoutFormValues) => Promise<void>;
  saveEditDraft: (workoutId: string, data: WorkoutFormValues) => Promise<void>;
  clearCreateDraft: () => Promise<void>;
  clearEditDraft: (workoutId: string) => Promise<void>;
  clearAllDrafts: () => Promise<void>;
  getLastActivity: () => Promise<LastActivity | null>;
  setLastActivity: (activity: LastActivity) => Promise<void>;
  clearLastActivity: () => Promise<void>;
};

export const WorkoutDraftContext = createContext<
  WorkoutDraftContextType | undefined
>(undefined);

const CREATE_DRAFT_KEY = "@workout_draft_create";
const EDIT_DRAFT_PREFIX = "@workout_draft_edit_";
const LAST_ACTIVITY_KEY = "@workout_last_activity";

export function WorkoutDraftProvider({ children }: { children: ReactNode }) {
  async function getCreateDraft(): Promise<WorkoutFormValues | null> {
    try {
      const data = await AsyncStorage.getItem(CREATE_DRAFT_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  async function getEditDraft(
    workoutId: string,
  ): Promise<WorkoutFormValues | null> {
    try {
      const data = await AsyncStorage.getItem(
        `${EDIT_DRAFT_PREFIX}${workoutId}`,
      );
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  async function saveCreateDraft(data: WorkoutFormValues) {
    await AsyncStorage.setItem(CREATE_DRAFT_KEY, JSON.stringify(data));
  }

  async function saveEditDraft(workoutId: string, data: WorkoutFormValues) {
    await AsyncStorage.setItem(
      `${EDIT_DRAFT_PREFIX}${workoutId}`,
      JSON.stringify(data),
    );
  }

  async function clearCreateDraft() {
    await AsyncStorage.removeItem(CREATE_DRAFT_KEY);
  }

  async function clearEditDraft(workoutId: string) {
    await AsyncStorage.removeItem(`${EDIT_DRAFT_PREFIX}${workoutId}`);
  }

  async function clearAllDrafts() {
    const keys = await AsyncStorage.getAllKeys();
    const draftKeys = keys.filter(
      (key) => key === CREATE_DRAFT_KEY || key.startsWith(EDIT_DRAFT_PREFIX),
    );
    await AsyncStorage.multiRemove(draftKeys);
  }

  async function getLastActivity(): Promise<LastActivity | null> {
    try {
      const data = await AsyncStorage.getItem(LAST_ACTIVITY_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  async function setLastActivity(activity: LastActivity) {
    await AsyncStorage.setItem(LAST_ACTIVITY_KEY, JSON.stringify(activity));
  }

  async function clearLastActivity() {
    await AsyncStorage.removeItem(LAST_ACTIVITY_KEY);
  }

  return (
    <WorkoutDraftContext.Provider
      value={{
        getCreateDraft,
        getEditDraft,
        saveCreateDraft,
        saveEditDraft,
        clearCreateDraft,
        clearEditDraft,
        clearAllDrafts,
        getLastActivity,
        setLastActivity,
        clearLastActivity,
      }}
    >
      {children}
    </WorkoutDraftContext.Provider>
  );
}

export function useWorkoutDraft() {
  const context = useContext(WorkoutDraftContext);

  if (!context) {
    throw new Error("useWorkoutDraft must be used inside WorkoutDraftProvider");
  }

  return context;
}
