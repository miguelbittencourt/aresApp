import ExerciseCard, { LocalExercise } from "@/components/ExerciseCard";
import { colors, spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { WorkoutFormValues, workoutSchema } from "@/schemas/workoutSchema";
import { saveWorkout, updateWorkout } from "@/services/workoutService";
import {
  createEmptyExercise,
  generateId,
  getLocalDateISO,
  normalizeWeightToKg,
  parseWeight,
  toLocalExercise,
} from "@/utils/workoutForm";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { zodResolver } from "@hookform/resolvers/zod";
// import DateTimePicker from "@react-native-community/datetimepicker";
import { useWorkoutDraft } from "@/contexts/WorkoutDraftContext";
import { useDebouncedValue } from "@/utils/useDebouncedValue";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
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
  const {
    getCreateDraft,
    getEditDraft,
    saveCreateDraft,
    saveEditDraft,
    clearCreateDraft,
    clearEditDraft,
    setLastActivity,
    clearLastActivity,
  } = useWorkoutDraft();

  const [draft, setDraft] = useState<WorkoutFormValues | null>(null);
  const [localDraft, setLocalDraft] = useState<WorkoutFormValues | null>(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState(true);

  useEffect(() => {
    async function loadDraft() {
      setIsLoadingDraft(true);
      try {
        let loadedDraft: WorkoutFormValues | null = null;

        if (mode === "edit" && workoutId) {
          loadedDraft = await getEditDraft(workoutId);
        } else if (mode === "create") {
          loadedDraft = await getCreateDraft();
        }

        setDraft(loadedDraft);
      } catch (error) {
        console.error("Error loading draft:", error);
      } finally {
        setIsLoadingDraft(false);
      }
    }

    loadDraft();
  }, [mode, workoutId, getCreateDraft, getEditDraft]);

  // const [showDatePicker, setShowDatePicker] = useState(false);

  function hasValidContent(values: WorkoutFormValues): boolean {
    // Verifica se tem nome da academia
    if (values.gymName && values.gymName.trim().length > 0) {
      return true;
    }

    // Verifica se algum exercício tem conteúdo
    const hasExerciseContent = values.exercises.some((exercise) => {
      // Tem nome do exercício
      if (exercise.name && exercise.name.trim().length > 0) {
        return true;
      }

      // Tem notas
      if (exercise.notes && exercise.notes.trim().length > 0) {
        return true;
      }

      // Tem alguma série preenchida
      const hasSetContent = exercise.sets.some((set) => {
        return (
          (set.reps && set.reps.trim().length > 0) ||
          (set.weight && set.weight.trim().length > 0)
        );
      });

      return hasSetContent;
    });

    return hasExerciseContent;
  }

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    mode: "onBlur",
    defaultValues: (() => {
      // Se ainda está carregando, use valores padrão temporários
      if (isLoadingDraft) {
        return {
          gymName: "",
          date: getLocalDateISO(),
          exercises: [createEmptyExercise()],
        };
      }

      // ✅ MODO EDIT: Prioriza defaultValues (dados reais do treino)
      // Só usa draft se tiver conteúdo válido E for diferente dos defaultValues
      if (mode === "edit" && defaultValues) {
        // Se tem draft, use ele (significa que o usuário já começou a editar)
        // Senão, use os defaultValues (dados originais do treino)
        const values = draft ?? defaultValues;

        return {
          ...values,
          exercises: values.exercises.map((ex) => ({
            ...ex,
            sets:
              ex.sets && ex.sets.length > 0
                ? ex.sets
                : [
                    {
                      id: generateId(),
                      reps: "",
                      weight: "",
                      unit: "kg",
                    },
                  ],
          })),
        };
      }

      // ✅ MODO CREATE: Prioriza draft (rascunho de novo treino)
      const values = draft ?? {
        gymName: "",
        date: getLocalDateISO(),
        exercises: [createEmptyExercise()],
      };

      // Garante que cada exercício tenha pelo menos 1 série
      return {
        ...values,
        exercises: values.exercises.map((ex) => ({
          ...ex,
          sets:
            ex.sets && ex.sets.length > 0
              ? ex.sets
              : [
                  {
                    id: generateId(),
                    reps: "",
                    weight: "",
                    unit: "kg",
                  },
                ],
        })),
      };
    })(),
  });

  const {
    control,
    handleSubmit,
    getValues,
    watch,
    reset,
    formState: { isSubmitting },
  } = form;

  // ✅ Reseta o form quando o draft carregar OU quando defaultValues mudar
  useEffect(() => {
    if (isLoadingDraft) return;

    let valuesToUse: WorkoutFormValues;

    if (mode === "edit" && defaultValues) {
      // No modo edit, usa draft se existir, senão usa defaultValues
      valuesToUse = draft ?? defaultValues;
    } else {
      // No modo create, usa draft se existir
      if (!draft) return; // Não faz nada se não tiver draft
      valuesToUse = draft;
    }

    reset({
      ...valuesToUse,
      exercises: valuesToUse.exercises.map((ex) => ({
        ...ex,
        sets:
          ex.sets && ex.sets.length > 0
            ? ex.sets
            : [
                {
                  id: generateId(),
                  reps: "",
                  weight: "",
                  unit: "kg",
                },
              ],
      })),
    });
  }, [isLoadingDraft, draft, defaultValues, mode, reset]);

  useEffect(() => {
    if (!isLoadingDraft && draft) {
      reset({
        ...draft,
        exercises: draft.exercises.map((ex) => ({
          ...ex,
          sets:
            ex.sets && ex.sets.length > 0
              ? ex.sets
              : [
                  {
                    id: generateId(),
                    reps: "",
                    weight: "",
                    unit: "kg",
                  },
                ],
        })),
      });
    }
  }, [isLoadingDraft, draft, reset]);

  const watchedValues = watch();
  const debouncedValues = useDebouncedValue(watchedValues, 2500);

  const lastSavedRef = useRef<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  useEffect(() => {
    if (isLoadingDraft) return;
    if (!debouncedValues?.exercises?.length) return;

    if (!hasValidContent(debouncedValues)) {
      if (mode === "edit" && workoutId) {
        clearEditDraft(workoutId);
      } else {
        clearCreateDraft();
      }
      return;
    }

    const serialized = JSON.stringify(debouncedValues);
    if (lastSavedRef.current === serialized) return;

    lastSavedRef.current = serialized;

    setIsSavingDraft(true);

    const saveDraftPromise =
      mode === "edit" && workoutId
        ? saveEditDraft(workoutId, debouncedValues)
        : saveCreateDraft(debouncedValues);

    saveDraftPromise
      .then(async () => {
        // ✅ Registra a última atividade
        await setLastActivity({
          type: mode,
          workoutId: mode === "edit" ? workoutId : undefined,
          timestamp: Date.now(),
          preview: {
            gymName: debouncedValues.gymName || undefined,
            exerciseCount: debouncedValues.exercises.length,
          },
        });

        setTimeout(() => setIsSavingDraft(false), 1000);
      })
      .finally(async () => {
        if (mode == "edit" && workoutId)
          setLocalDraft(await getEditDraft(workoutId));
        else setLocalDraft(await getCreateDraft());
      });
  }, [
    debouncedValues,
    mode,
    workoutId,
    saveCreateDraft,
    saveEditDraft,
    clearCreateDraft,
    clearEditDraft,
    isLoadingDraft,
    setLastActivity,
  ]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
    keyName: "formId",
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
        await clearEditDraft(workoutId!); // ✅ Limpa o rascunho de edição
      } else {
        await saveWorkout(user.uid, payload);
        await clearCreateDraft(); // ✅ Limpa o rascunho de criação
      }

      await clearLastActivity();

      Alert.alert("Sucesso!", "Treino salvo", [
        { text: "OK", onPress: () => router.replace("/(tabs)/history") },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao salvar treino");
    }
  }

  async function discardDraft() {
    if (mode === "edit" && workoutId) {
      await clearEditDraft(workoutId);
    } else {
      await clearCreateDraft();
    }

    setDraft(null);
    setLocalDraft(null);

    reset({
      gymName: "",
      date: getLocalDateISO(),
      exercises: [createEmptyExercise()],
    });
  }

  if (isLoadingDraft) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0d0d0d",
        }}
      >
        <ActivityIndicator size="large" color="#b91c1c" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Carregando...</Text>
      </View>
    );
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
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>REGISTRAR BATALHA</Text>
            </View>
          </View>
          <View style={styles.headerDivider} />
          {isSavingDraft ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginTop: 6,
              }}
            >
              <ActivityIndicator size="small" color="#b91c1c" />
              <Text
                style={{ color: "#737373", fontSize: 12, fontWeight: "600" }}
              >
                Salvando...
              </Text>
            </View>
          ) : (
            (draft || localDraft) && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 10,
                }}
              >
                <MaterialCommunityIcons
                  name="check-circle"
                  size={16}
                  color="#22c55e"
                />
                <Text
                  style={{
                    color: "#22c55e",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Salvo
                </Text>
              </View>
            )
          )}
        </View>

        {draft && mode === "create" && (
          <LinearGradient
            colors={["rgba(185, 28, 28, 0.2)", "rgba(127, 29, 29, 0.1)"]}
            style={{
              padding: spacing.md,
              borderRadius: 8,
              marginBottom: spacing.lg,
              borderWidth: 1,
              borderColor: "#b91c1c",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  flex: 1,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#b91c1c",
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="content-save"
                    size={22}
                    color="#fff"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}
                  >
                    Rascunho Recuperado
                  </Text>
                  <Text
                    style={{ color: "#a3a3a3", fontSize: 14, marginTop: 2 }}
                  >
                    {isSavingDraft
                      ? "Salvando alterações..."
                      : "Salvo automaticamente"}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={async () => {
                  Alert.alert(
                    "Descartar Rascunho",
                    "Tem certeza? Esta ação não pode ser desfeita.",
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Descartar",
                        style: "destructive",
                        onPress: async () => discardDraft(),
                      },
                    ],
                  );
                }}
                style={({ pressed }) => ({
                  padding: 8,
                  backgroundColor: pressed
                    ? "rgba(185, 28, 28, 0.3)"
                    : "rgba(185, 28, 28, 0.15)",
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: "#b91c1c",
                })}
              >
                <MaterialCommunityIcons name="close" size={18} color="#fff" />
              </Pressable>
            </View>
          </LinearGradient>
        )}

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
            onPress={() => {
              Keyboard.dismiss();
              addExercise();
            }}
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

          {draft && (
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Descartar Rascunho",
                  "Isso irá limpar todos os dados preenchidos. Deseja continuar?",
                  [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Descartar",
                      style: "destructive",
                      onPress: async () => discardDraft(),
                    },
                  ],
                );
              }}
              style={({ pressed }) => [
                {
                  borderWidth: 1,
                  borderColor: "#b91c1c",
                  borderRadius: 8,
                  padding: spacing.md,
                  opacity: pressed ? 0.7 : 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={18}
                color="#b91c1c"
              />
              <Text
                style={{ color: "#b91c1c", fontWeight: "900", fontSize: 14 }}
              >
                DESCARTAR RASCUNHO
              </Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => {
              Keyboard.dismiss();
              handleSubmit(onSubmit)();
            }}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                opacity: pressed || isSubmitting ? 0.8 : 1,
              },
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
              {isSubmitting ? (
                <>
                  <Text style={styles.primaryButtonText}>SALVANDO...</Text>
                  <ActivityIndicator color={colors.text.white} />
                </>
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="sword-cross"
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.primaryButtonText}>SALVAR TREINO</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
