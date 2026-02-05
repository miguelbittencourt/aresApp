import { colors, components, spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Controller } from "react-hook-form";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export interface LocalExercise {
  id: string;
  name: string;
  weight: string;
  reps: string;
  unit: string;
  notes: string;
}

interface ExerciseCardProps {
  exercise: LocalExercise;
  index: number;
  fieldPrefix: string;
  control: any;
  onRemove: () => void;
}

export default function ExerciseCard({
  exercise,
  index,
  fieldPrefix,
  control,
  onRemove,
}: ExerciseCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={components.title.subsection}>Exercício {index + 1}</Text>
        <Pressable onPress={onRemove} style={styles.removeBtn}>
          <Ionicons name="trash" size={18} color="#ff3b30" />
        </Pressable>
      </View>

      <View style={{ gap: spacing.sm }}>
        <Controller
          control={control}
          name={`${fieldPrefix}.name`}
          render={({ field }: any) => (
            <TextInput
              style={components.input}
              placeholder="Nome do exercício"
              placeholderTextColor={colors.text.secondary}
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name={`${fieldPrefix}.weight`}
          render={({ field }: any) => (
            <TextInput
              style={components.input}
              placeholder="Peso (Ex: 50kg ou 20lb)"
              keyboardType="numeric"
              placeholderTextColor={colors.text.secondary}
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name={`${fieldPrefix}.reps`}
          render={({ field }: any) => (
            <TextInput
              style={components.input}
              placeholder="Repetições"
              keyboardType="numeric"
              placeholderTextColor={colors.text.secondary}
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name={`${fieldPrefix}.notes`}
          render={({ field }: any) => (
            <TextInput
              style={components.input}
              placeholder="Observações (opcional)"
              placeholderTextColor={colors.text.secondary}
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.card,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  removeBtn: {
    padding: spacing.sm,
    backgroundColor: "rgba(255, 59, 48, 0.06)",
    borderRadius: 8,
  },
});
