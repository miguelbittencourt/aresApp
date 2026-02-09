import LoadingStructure from "@/components/LoadingStructure";
import { useAuth } from "@/contexts/AuthContext";
import { getWorkoutById } from "@/services/workoutService";
import { workoutToFormValues } from "@/utils/workoutForm";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import WorkoutForm from "../workout/form";

export default function EditWorkout() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    async function loadWorkout() {
      if (!user || !id) return;

      const workout = await getWorkoutById(user.uid, id);

      if (!workout) {
        Alert.alert(
          "Treino não encontrado",
          "Esse treino não existe mais ou foi removido.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(tabs)/history"),
            },
          ],
        );
        return;
      }
      setInitialValues(workoutToFormValues(workout));
    }

    loadWorkout();
  }, [user, id]);

  if (!initialValues) {
    return <LoadingStructure />;
  }

  return (
    <WorkoutForm mode="edit" workoutId={id} defaultValues={initialValues} />
  );
}
