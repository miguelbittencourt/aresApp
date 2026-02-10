import { spacing } from "@/constants/theme";
import { generateId } from "@/utils/workoutForm";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export type LocalSet = {
  id: string;
  reps: string;
  weight: string;
  unit: "kg" | "lb";
};

export interface LocalExercise {
  id: string;
  name: string;
  notes?: string | undefined;
  sets: LocalSet[];
}

interface ExerciseCardProps {
  index: number;
  fieldPrefix: string;
  control: any;
  onRemove: () => void;
  errors?: any;
  exercise: LocalExercise;
  getValues: any;
}

export default function ExerciseCard({
  index,
  fieldPrefix,
  control,
  onRemove,
  errors,
  exercise,
  getValues,
}: ExerciseCardProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${fieldPrefix}.sets`,
  });

  return (
    <LinearGradient
      colors={["#1a1a1a", "#0d0d0d"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.bloodMark} />
      <View style={styles.topBorder} />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{index + 1}</Text>
          </View>
          <Text style={styles.title}>EXERCÍCIO {index + 1}</Text>
        </View>

        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            onRemove();
          }}
          style={({ pressed }) => [
            styles.removeBtn,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="trash" size={20} color="#b91c1c" />
        </Pressable>
      </View>

      {/* NOME */}
      <Text style={styles.label}>NOME *</Text>
      <Controller
        control={control}
        name={`${fieldPrefix}.name`}
        rules={{ required: "Nome é obrigatório" }}
        render={({ field, fieldState }) => (
          <>
            <TextInput
              style={[styles.input, fieldState.error && styles.inputError]}
              placeholder="Ex: Supino reto"
              placeholderTextColor="#4a4a4a"
              value={field.value}
              onChangeText={field.onChange}
            />
            {fieldState.error && (
              <Text style={styles.errorText}>{fieldState.error.message}</Text>
            )}
          </>
        )}
      />

      {/* SÉRIES */}
      <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
        <Text style={styles.label}>SÉRIES</Text>

        {fields.map((set, setIndex) => {
          const base = `${fieldPrefix}.sets.${setIndex}`;

          return (
            <View key={set.id} style={styles.setRow}>
              <Text style={{ fontWeight: "700", color: "red" }}>
                {setIndex + 1}
              </Text>
              {/* Reps */}
              <Controller
                control={control}
                name={`${base}.reps`}
                render={({ field }) => (
                  <TextInput
                    style={[styles.input, styles.setInput]}
                    placeholder="Reps"
                    keyboardType="number-pad"
                    placeholderTextColor="#4a4a4a"
                    value={field.value}
                    onChangeText={field.onChange}
                  />
                )}
              />

              {/* Weight */}
              <Controller
                control={control}
                name={`${base}.weight`}
                render={({ field }) => (
                  <TextInput
                    style={[styles.input, styles.setInput]}
                    placeholder="Peso"
                    keyboardType="decimal-pad"
                    placeholderTextColor="#4a4a4a"
                    value={field.value}
                    onChangeText={field.onChange}
                  />
                )}
              />

              {/* Unit */}
              <Controller
                control={control}
                name={`${base}.unit`}
                render={({ field }) => (
                  <Pressable
                    onPress={() => {
                      Keyboard.dismiss();
                      field.onChange(field.value === "kg" ? "lb" : "kg");
                    }}
                    style={styles.unitBtn}
                  >
                    <Text style={styles.unitText}>{field.value}</Text>
                  </Pressable>
                )}
              />

              {/* Remove set */}
              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  if (fields.length === 1) return;
                  remove(setIndex);
                }}
              >
                <Ionicons name="close-circle" size={22} color="#b91c1c" />
              </Pressable>
            </View>
          );
        })}

        {/* Add Set */}
        <Pressable
          onPress={() => {
            Keyboard.dismiss();

            const path = `${fieldPrefix}.sets`;
            const currentSets = getValues(path) as LocalSet[];

            if (!currentSets || currentSets.length === 0) {
              append({
                id: generateId(),
                reps: "",
                weight: "",
                unit: "kg",
              });
              return;
            }

            const last = currentSets[currentSets.length - 1];

            append({
              id: generateId(),
              reps: last.reps,
              weight: last.weight,
              unit: last.unit,
            });
          }}
          style={styles.addSetBtn}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addSetText}>Adicionar série</Text>
        </Pressable>
      </View>

      {/* NOTAS */}
      <View style={{ marginTop: spacing.md }}>
        <Text style={styles.label}>NOTAS</Text>
        <Controller
          control={control}
          name={`${fieldPrefix}.notes`}
          render={({ field }) => (
            <TextInput
              style={[styles.input, { height: 60 }]}
              placeholder="Observações..."
              placeholderTextColor="#4a4a4a"
              value={field.value}
              onChangeText={field.onChange}
              multiline
            />
          )}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: "#b91c1c",
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: "#262626",
    borderTopColor: "#262626",
    borderBottomColor: "#262626",
    borderRadius: 8,
    shadowColor: "#b91c1c",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: -2, height: 4 },
    position: "relative",
    overflow: "hidden",
  },
  bloodMark: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    backgroundColor: "#b91c1c",
    opacity: 0.05,
    borderRadius: 60,
  },
  topBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#b91c1c",
    opacity: 0.2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#262626",
  },
  numberBadge: {
    width: 28,
    height: 28,
    backgroundColor: "#b91c1c",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  numberText: { color: "#000000", fontWeight: "900", fontSize: 14 },
  title: {
    fontSize: 16,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  removeBtn: {
    padding: spacing.sm,
    backgroundColor: "rgba(185, 28, 28, 0.1)",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#262626",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#737373",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  required: { color: "#b91c1c" },
  input: {
    backgroundColor: "#0d0d0d",
    borderWidth: 1,
    borderColor: "#262626",
    borderRadius: 6,
    padding: spacing.md,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  inputError: { borderColor: "#b91c1c", borderWidth: 2 },
  errorText: {
    color: "#b91c1c",
    fontSize: 13,
    marginTop: 4,
    fontWeight: "600",
  },
  setRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  setInput: {
    flex: 1,
    paddingVertical: 10,
    textAlign: "center",
  },

  unitBtn: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#b91c1c",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  unitText: {
    color: "#b91c1c",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 0.5,
  },

  addSetBtn: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#262626",
    backgroundColor: "#111",
  },

  addSetText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 1,
  },
});
