import { spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Controller } from "react-hook-form";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export interface LocalExercise {
  id: string;
  name: string;
  weight: string;
  sets: string;
  reps: string;
  unit: "kg" | "lb";
  notes: string;
}

interface ExerciseCardProps {
  exercise: LocalExercise;
  index: number;
  fieldPrefix: string;
  control: any;
  onRemove: () => void;
  errors?: any;
}

export default function ExerciseCard({
  exercise,
  index,
  fieldPrefix,
  control,
  onRemove,
  errors,
}: ExerciseCardProps) {
  return (
    <LinearGradient
      colors={["#1a1a1a", "#0d0d0d"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* Marca de sangue sutil */}
      <View style={styles.bloodMark} />

      {/* Borda vermelha superior */}
      <View style={styles.topBorder} />

      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{index + 1}</Text>
          </View>
          <Text style={styles.title}>EXERCÍCIO {index + 1}</Text>
        </View>

        <Pressable
          onPress={onRemove}
          style={({ pressed }) => [
            styles.removeBtn,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="trash" size={20} color="#b91c1c" />
        </Pressable>
      </View>

      <View style={{ gap: spacing.md }}>
        {/* Nome do Exercício */}
        <View>
          <Text style={styles.label}>
            NOME <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name={`${fieldPrefix}.name`}
            rules={{ required: "Nome é obrigatório" }}
            render={({ field, fieldState }) => (
              <>
                <TextInput
                  style={[styles.input, fieldState.error && styles.inputError]}
                  placeholder="Ex: Supino Reto"
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

        {/* Séries e Repetições em linha */}
        <View style={{ flexDirection: "row", gap: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>
              SÉRIES <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              name={`${fieldPrefix}.sets`}
              rules={{
                required: "Obrigatório",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Apenas números",
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    style={[
                      styles.input,
                      fieldState.error && styles.inputError,
                    ]}
                    placeholder="3"
                    keyboardType="number-pad"
                    placeholderTextColor="#4a4a4a"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    maxLength={2}
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

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>
              REPETIÇÕES <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              name={`${fieldPrefix}.reps`}
              rules={{
                required: "Obrigatório",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Apenas números",
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    style={[
                      styles.input,
                      fieldState.error && styles.inputError,
                    ]}
                    placeholder="12"
                    keyboardType="number-pad"
                    placeholderTextColor="#4a4a4a"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    maxLength={3}
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
        </View>

        {/* Peso */}
        <View>
          <Text style={styles.label}>PESO</Text>
          <Controller
            control={control}
            name={`${fieldPrefix}.weight`}
            rules={{
              pattern: {
                value: /^[0-9.,\s]*(kg|lb|lbs)?$/i,
                message: "Ex: 50kg ou 20lb",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <TextInput
                  style={[styles.input, fieldState.error && styles.inputError]}
                  placeholder="Ex: 50kg ou 20lb (padrão: kg)"
                  keyboardType="default"
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

        {/* Notas */}
        <View>
          <Text style={styles.label}>NOTAS</Text>
          <Controller
            control={control}
            name={`${fieldPrefix}.notes`}
            render={({ field }) => (
              <TextInput
                style={[styles.input, { height: 60, textAlignVertical: "top" }]}
                placeholder="Observações opcionais..."
                placeholderTextColor="#4a4a4a"
                value={field.value}
                onChangeText={field.onChange}
                multiline
                numberOfLines={2}
              />
            )}
          />
        </View>
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
  numberText: {
    color: "#000000",
    fontWeight: "900",
    fontSize: 14,
  },
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
  required: {
    color: "#b91c1c",
  },
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
  inputError: {
    borderColor: "#b91c1c",
    borderWidth: 2,
  },
  errorText: {
    color: "#b91c1c",
    fontSize: 13,
    marginTop: 4,
    fontWeight: "600",
  },
});
