import ExerciseCard, { LocalExercise } from "@/components/ExerciseCard";
import { spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { WorkoutFormValues, workoutSchema } from "@/schemas/workoutSchema";
import { saveWorkout } from "@/services/workoutService";
import {
  generateId,
  getLocalDateISO,
  normalizeWeightToKg,
  parseWeight,
} from "@/utils/workoutForm";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
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

export default function WorkoutForm() {
  const { user } = useAuth();

  function createEmptyExercise(): LocalExercise {
    return {
      id: generateId(),
      name: "",
      weight: "",
      sets: "",
      reps: "",
      unit: "kg",
      notes: "",
    };
  }

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    mode: "onBlur",
    defaultValues: {
      gymName: "",
      date: getLocalDateISO(),
      exercises: [createEmptyExercise()],
    },
  });

  const { fields, append, remove } = useFieldArray<
    WorkoutFormValues,
    "exercises"
  >({
    control,
    name: "exercises",
  });

  const recentlyRemoved = useRef<{
    item: LocalExercise | null;
    timeout?: ReturnType<typeof setTimeout>; // ✅ Isso funciona em qualquer ambiente
  }>({ item: null });

  // Cleanup do timeout quando desmontar
  useEffect(() => {
    return () => {
      if (recentlyRemoved.current.timeout) {
        clearTimeout(recentlyRemoved.current.timeout);
      }
    };
  }, []);

  function addExercise() {
    append(createEmptyExercise());
  }

  function removeExercise(index: number) {
    const current = getValues().exercises || [];
    if (current.length === 1) {
      Alert.alert("Atenção", "Você precisa de pelo menos um exercício", [
        { text: "OK" },
      ]);
      return;
    }

    const item = current[index] as LocalExercise;
    remove(index);

    recentlyRemoved.current.item = item;
    if (recentlyRemoved.current.timeout) {
      clearTimeout(recentlyRemoved.current.timeout);
    }

    recentlyRemoved.current.timeout = setTimeout(() => {
      recentlyRemoved.current.item = null;
    }, 5000);
  }

  function undoRemove() {
    const item = recentlyRemoved.current.item;
    if (item) {
      append(item);
      recentlyRemoved.current.item = null;
      if (recentlyRemoved.current.timeout) {
        clearTimeout(recentlyRemoved.current.timeout);
      }
    }
  }

  async function onSubmit(values: WorkoutFormValues) {
    if (!user) return Alert.alert("Erro", "Você precisa estar logado");

    const exercises = values.exercises.map((e, idx) => {
      const weightRaw = e.weight ?? "0";
      const parsed = parseWeight(weightRaw);
      const weightKg = normalizeWeightToKg(weightRaw);

      return {
        id: generateId(),
        order_index: idx,
        name: e.name,
        weight: Number(weightKg.toFixed(2)),
        unit: parsed.unit,
        sets: Number(e.sets),
        reps: Number(e.reps),
        notes: e.notes || "",
      };
    });

    try {
      await saveWorkout(user.uid, {
        gym_name: values.gymName,
        date: values.date,
        exercises,
      });

      Alert.alert("Sucesso!", "Treino salvo", [
        { text: "OK", onPress: () => router.replace("/(tabs)/history") },
      ]);
    } catch {
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
            rules={{ required: "Nome da academia é obrigatório" }}
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
              onRemove={() => removeExercise(index)}
            />
          ))}
        </View>

        {/* Undo bar */}
        {recentlyRemoved.current.item && (
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
