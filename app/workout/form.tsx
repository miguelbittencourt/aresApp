import ExerciseCard, { LocalExercise } from "@/components/ExerciseCard";
import { spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { WorkoutFormValues, workoutSchema } from "@/schemas/workoutSchema";
import { saveWorkout, updateWorkout } from "@/services/workoutService";
import {
  createEmptyExercise,
  getLocalDateISO,
  normalizeWeightToKg,
  parseWeight,
  toLocalExercise,
} from "@/utils/workoutForm";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { zodResolver } from "@hookform/resolvers/zod";
// import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { styles } from "../../constants/styles";

export default function WorkoutForm({
  defaultValues,
  mode = "create",
  workoutId,
}: {
  defaultValues?: WorkoutFormValues;
  mode?: "create" | "edit";
  workoutId?: string;
}) {
  const { user } = useAuth();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    mode: "onBlur",
    defaultValues: defaultValues ?? {
      gymName: "",
      date: getLocalDateISO(),
      exercises: [createEmptyExercise()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  const [removedExercise, setRemovedExercise] = useState<LocalExercise | null>(
    null,
  );

  function addExercise() {
    append(createEmptyExercise());
  }

  function removeExercise(index: number) {
    const current = getValues().exercises;

    if (current.length === 1) {
      Alert.alert("Atenção", "Você precisa de pelo menos um exercício");
      return;
    }

    setRemovedExercise(toLocalExercise(current[index]));
    remove(index);

    setTimeout(() => setRemovedExercise(null), 5000);
  }

  function undoRemove() {
    if (!removedExercise) return;

    append(removedExercise);
    setRemovedExercise(null);
  }

  async function onSubmit(values: WorkoutFormValues) {
    if (!user) return Alert.alert("Erro", "Você precisa estar logado");

    const exercises = values.exercises.map((exercise, index) => {
      return {
        id: exercise.id,
        order_index: index,
        name: exercise.name,
        notes: exercise.notes || "",
        sets: exercise.sets.map((s) => {
          const parsed = parseWeight(s.weight);

          return {
            reps: Number(s.reps),
            weight: Number(normalizeWeightToKg(s.weight).toFixed(2)),
            unit: parsed.unit,
          };
        }),
      };
    });

    const payload = {
      gym_name: values.gymName,
      date: values.date,
      exercises,
    };

    try {
      if (mode === "edit") {
        await updateWorkout(user.uid, workoutId!, payload);
      } else {
        await saveWorkout(user.uid, payload);
      }

      Alert.alert("Sucesso!", "Treino salvo", [
        { text: "OK", onPress: () => router.replace("/(tabs)/history") },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao salvar treino");
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#0d0d0d" }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xxxl,
        }}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>REGISTRAR BATALHA</Text>
          <View style={styles.headerDivider} />
        </View>

        {/* Academia */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={styles.label}>
            ARENA (Academia) <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name="gymName"
            render={({ field, fieldState }) => (
              <>
                <TextInput
                  style={[styles.input, fieldState.error && styles.inputError]}
                  placeholder="Ex: Smart Fit"
                  placeholderTextColor="#4a4a4a"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                />
                {fieldState.error && (
                  <Text style={styles.errorText}>
                    {fieldState.error.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        {/* Data do treino */}
        {/* <View style={{ marginBottom: spacing.xl }}>
          <Text style={styles.label}>
            DATA DO TREINO <Text style={styles.required}>*</Text>
          </Text>

          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <>
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  style={[
                    styles.input,
                    {
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Text style={{ color: "#fff" }}>
                    {new Date(field.value).toLocaleDateString("pt-BR")}
                  </Text>
                </Pressable>

                {showDatePicker && (
                  <DateTimePicker
                    value={new Date(field.value)}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (!selectedDate) return;

                      // ISO local yyyy-mm-dd
                      const iso = selectedDate.toISOString().split("T")[0];
                      field.onChange(iso);
                    }}
                  />
                )}
              </>
            )}
          />
        </View> */}

        {/* Exercícios */}
        <View style={{ marginBottom: spacing.lg }}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionMarker} />
            <Text style={styles.sectionTitle}>ARSENAL (Exercícios)</Text>
          </View>

          {fields.map((field: any, index: number) => (
            <ExerciseCard
              key={field.id}
              exercise={field as LocalExercise}
              index={index}
              fieldPrefix={`exercises.${index}`}
              control={control}
              getValues={getValues}
              onRemove={() => removeExercise(index)}
            />
          ))}
        </View>

        {/* Undo bar */}
        {removedExercise && (
          <LinearGradient
            colors={["#1a1a1a", "#0d0d0d"]}
            style={styles.undoBar}
          >
            <Text style={styles.undoText}>Exercício removido</Text>
            <Pressable onPress={undoRemove} style={styles.undoBtn}>
              <Text style={styles.undoBtnText}>DESFAZER</Text>
            </Pressable>
          </LinearGradient>
        )}

        {/* Botões de Ação */}
        <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
          <Pressable
            onPress={addExercise}
            style={({ pressed }) => [
              styles.secondaryButton,
              {
                opacity: pressed ? 0.8 : 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              },
            ]}
          >
            <MaterialCommunityIcons name="plus" size={16} color="#fff" />
            <Text style={[styles.secondaryButtonText, { textAlign: "center" }]}>
              ADICIONAR EXERCÍCIO
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.primaryButton,
              { opacity: pressed || isSubmitting ? 0.8 : 1 },
            ]}
          >
            <LinearGradient
              colors={["#b91c1c", "#7f1d1d"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.primaryButtonGradient,
                {
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="sword-cross"
                size={20}
                color="#fff"
              />
              <Text style={styles.primaryButtonText}>
                {isSubmitting ? "SALVANDO..." : "SALVAR TREINO"}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
