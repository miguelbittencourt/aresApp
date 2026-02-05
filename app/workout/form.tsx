import ExerciseCard, { LocalExercise } from "@/components/ExerciseCard";
import { colors, components, spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { saveWorkout } from "@/services/workoutService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Controller, useFieldArray, useForm } from "react-hook-form";

export default function WorkoutForm() {
  const { user } = useAuth();

  type FormValues = {
    gymName: string;
    date: string;
    exercises: LocalExercise[];
  };

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      gymName: "",
      date: new Date().toISOString().split("T")[0],
      exercises: [
        {
          id: generateId(),
          name: "",
          weight: "",
          reps: "",
          unit: "kg",
          notes: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  const recentlyRemoved = useRef<{
    item: LocalExercise | null;
    timeout?: number;
  }>({ item: null });

  function generateId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function addExercise() {
    append({
      id: generateId(),
      name: "",
      weight: "",
      reps: "",
      unit: "kg",
      notes: "",
    });
  }

  function updateExercise(
    id: string,
    field: keyof LocalExercise,
    value: string,
  ) {
    const idx = (getValues().exercises || []).findIndex(
      (e: any) => e.id === id,
    );
    if (idx >= 0) setValue(`exercises.${idx}.${field}`, value);
  }

  function removeExercise(indexOrId: string | number) {
    const current = getValues().exercises || [];
    if (current.length === 1) {
      Alert.alert("Você precisa de pelo menos um exercício");
      return;
    }

    let idx: number;
    if (typeof indexOrId === "number") {
      idx = indexOrId;
    } else {
      idx = current.findIndex((e: any) => e.id === indexOrId);
    }

    if (idx >= 0) {
      const item = current[idx] as LocalExercise;
      remove(idx);
      recentlyRemoved.current.item = item;
      if (recentlyRemoved.current.timeout)
        clearTimeout(recentlyRemoved.current.timeout);
      recentlyRemoved.current.timeout = setTimeout(() => {
        recentlyRemoved.current.item = null;
      }, 5000);
    }
  }

  function undoRemove() {
    const item = recentlyRemoved.current.item;
    if (item) {
      append(item);
      recentlyRemoved.current.item = null;
      if (recentlyRemoved.current.timeout)
        clearTimeout(recentlyRemoved.current.timeout);
    }
  }

  function parseWeight(input: string) {
    const clean = input.toLowerCase().replace(",", ".").trim();

    const match = clean.match(/^([\d.]+)\s*(kg|kgs|lb|lbs)?$/);

    if (!match) {
      return { value: 0, unit: "kg" };
    }

    const value = parseFloat(match[1]);
    const unit = match[2]?.startsWith("l") ? "lb" : "kg";

    return { value, unit };
  }

  async function onSubmit(values: {
    gymName: string;
    date: string;
    exercises: LocalExercise[];
  }) {
    console.log("onSubmit called with values:", values);
    console.log("Current errors:", errors);

    if (!user) {
      Alert.alert("Erro", "Você precisa estar logado");
      return;
    }

    if (!values.gymName || values.gymName.trim() === "") {
      Alert.alert("Erro", "Informe a academia");
      return;
    }

    const validExercises = (values.exercises || []).filter(
      (e) => e.name && e.name.trim() && e.reps && e.reps.trim(),
    );

    if (validExercises.length === 0) {
      Alert.alert(
        "Erro",
        "Adicione pelo menos um exercício com nome e repetições",
      );
      return;
    }

    try {
      console.log("Saving workout with:", {
        gymName: values.gymName,
        date: values.date,
        exerciseCount: validExercises.length,
      });

      await saveWorkout(user.uid, {
        gym_name: values.gymName,
        date: values.date,
        exercises: validExercises.map((e, idx) => {
          const parsed = parseWeight(e.weight || "");

          return {
            id: generateId(),
            order_index: idx,
            name: e.name,
            weight: parsed.value,
            unit: parsed.unit,
            reps: Number(e.reps),
            notes: e.notes || "",
          };
        }),
      });

      Alert.alert("Sucesso", "Treino salvo com sucesso!");
      router.replace("/(tabs)/history");
    } catch (e: any) {
      console.error("Error saving workout:", e);
      Alert.alert(
        "Erro",
        `Erro ao salvar treino: ${e.message || "Tente novamente"}`,
      );
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={components.container.screen}
        contentContainerStyle={{
          padding: spacing.sm,
          paddingTop: spacing.lg,
          paddingBottom: spacing.xxxl,
        }}
      >
        {/* HEADER */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: spacing.xl,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{ padding: spacing.sm, marginRight: spacing.sm }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.white} />
          </Pressable>

          <Text style={components.title.section}>Novo Treino</Text>
        </View>

        {/* ACADEMIA */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={[components.text.body, { marginBottom: spacing.sm }]}>
            Academia
          </Text>
          <Controller
            control={control}
            name="gymName"
            render={({ field }: any) => (
              <TextInput
                style={components.input}
                placeholder="Ex: Smart Fit"
                placeholderTextColor={colors.text.secondary}
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
        </View>

        {/* EXERCÍCIOS */}
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

        {recentlyRemoved.current.item ? (
          <View style={styles.undoBar}>
            <Text
              style={[components.text.small, { color: colors.text.secondary }]}
            >
              Exercício removido
            </Text>
            <Pressable onPress={undoRemove} style={styles.undoBtn}>
              <Text style={[components.text.small, { color: colors.primary }]}>
                Desfazer
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* AÇÕES */}
        <View style={{ gap: spacing.md }}>
          <Pressable onPress={addExercise} style={components.button.secondary}>
            <Text style={components.button.text}>+ Adicionar exercício</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              console.log("Save button pressed");
              handleSubmit(onSubmit)();
            }}
            style={components.button.primary}
          >
            <Text style={components.button.text}>Salvar Treino</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  undoBar: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  undoBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
