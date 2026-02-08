import { spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { deleteWorkout, getWorkoutById } from "@/services/workoutService";
import type { Workout } from "@/types/workout";
import { formatWorkoutDate } from "@/utils/formatDate";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function WorkoutDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (deleting) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [deleting]);

  useEffect(() => {
    async function loadWorkout() {
      if (!user || !id) return;

      try {
        setError(null);
        const data = await getWorkoutById(user.uid, id);
        setWorkout(data);
      } catch {
        setError("Não foi possível carregar o treino.");
      } finally {
        setLoading(false);
      }
    }

    loadWorkout();
  }, [id, user]);

  if (loading) {
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
        <Text
          style={{
            color: "#4a4a4a",
            marginTop: 16,
            fontSize: 14,
            letterSpacing: 2,
            fontWeight: "700",
          }}
        >
          CARREGANDO...
        </Text>
      </View>
    );
  }

  if (error || !workout) {
    return (
      <View
        style={{
          flex: 1,
          padding: spacing.lg,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d0d0d",
        }}
      >
        <Text
          style={{
            color: "#dc2626",
            fontSize: 18,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {error || "Treino não encontrado"}
        </Text>
      </View>
    );
  }

  const totalExercises = workout.exercises.length;

  const totalSets = workout.exercises.reduce(
    (sum, ex) => sum + (ex.sets || 0),
    0,
  );

  const totalReps = workout.exercises.reduce(
    (sum, ex) => sum + (ex.sets * ex.reps || 0),
    0,
  );

  const totalVolume = workout.exercises.reduce(
    (sum, ex) => sum + (ex.weight * ex.reps * ex.sets || 0),
    0,
  );

  function onRemove(workoutId: string): void {
    Alert.alert(
      "Remover treino",
      "Tem certeza que deseja remover este treino? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteWorkout(user!.uid, workoutId);
              setDeleting(false);
              router.push("/history");
            } catch (err) {
              setDeleting(false);
              Alert.alert(
                "Erro",
                "Não foi possível remover o treino. Tente novamente mais tarde.",
              );
            }
          },
        },
      ],
    );
  }

  function renderStat(label: string, value: number | string) {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 6,
          borderBottomWidth: 1,
          borderBottomColor: "#262626",
        }}
      >
        <Text
          style={{
            color: "#737373",
            fontSize: 14,
            fontWeight: "700",
          }}
        >
          {label}
        </Text>

        <Text
          style={{
            color: "#b91c1c",
            fontSize: 14,
            fontWeight: "900",
          }}
        >
          {value}
        </Text>
      </View>
    );
  }

  return (
    <>
      {deleting && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(13,13,13,0.92)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
            opacity: fadeAnim,
          }}
          pointerEvents="auto"
        >
          <Animated.View
            style={{
              alignItems: "center",
              transform: [{ scale: scaleAnim }],
            }}
          >
            <ActivityIndicator size="large" color="#b91c1c" />

            <Animated.Text
              style={{
                color: "#b91c1c",
                marginTop: 18,
                fontSize: 14,
                letterSpacing: 3,
                fontWeight: "900",
                transform: [{ scale: pulseAnim }],
              }}
            >
              EXCLUINDO
            </Animated.Text>
          </Animated.View>
        </Animated.View>
      )}

      <ScrollView
        style={{ flex: 1, backgroundColor: "#0d0d0d" }}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
      >
        {/* Header brutal */}
        <LinearGradient
          colors={["#1a1a1a", "#0d0d0d"]}
          style={{
            padding: spacing.xl,
            borderBottomWidth: 3,
            borderBottomColor: "#b91c1c",
            position: "relative",
          }}
        >
          {/* Textura de sangue no fundo */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#b91c1c",
              opacity: 0.03,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: spacing.sm,
            }}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: "900",
                color: "#ffffff",
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 12,
                textShadowColor: "#b91c1c",
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
              }}
            >
              {workout.gym_name}
            </Text>
            <Pressable
              onPress={() => onRemove(workout.id)}
              style={({ pressed }) => [
                {
                  padding: spacing.sm,
                  backgroundColor: "rgba(185, 28, 28, 0.1)",
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: "#262626",
                },
                {
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons name="trash" size={24} color="#b91c1c" />
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingTop: spacing.sm,
              borderTopWidth: 1,
              borderTopColor: "#262626",
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: "#b91c1c",
                marginRight: 10,
              }}
            />
            <Text
              style={{
                fontSize: 14,
                color: "#737373",
                fontWeight: "700",
                letterSpacing: 0.5,
              }}
            >
              {formatWorkoutDate(workout.date)}
            </Text>
          </View>
        </LinearGradient>

        {/* Lista de exercícios */}
        <View style={{ padding: spacing.lg }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingBottom: spacing.md,
            }}
          >
            <View
              style={{
                width: 4,
                height: 24,
                backgroundColor: "#b91c1c",
                marginRight: 12,
              }}
            />

            <Text
              style={{
                fontSize: 18,
                fontWeight: "900",
                color: "#ffffff",
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              ARSENAL (Exercícios)
            </Text>
          </View>

          {(workout.exercises || []).map((exercise, index) => (
            <View
              key={index}
              style={{
                marginBottom: spacing.md,
              }}
            >
              <LinearGradient
                colors={["#1a1a1a", "#0d0d0d"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 8,
                  padding: spacing.lg,
                  borderLeftWidth: 4,
                  borderLeftColor: "#b91c1c",
                  borderRightWidth: 1,
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderRightColor: "#262626",
                  borderTopColor: "#262626",
                  borderBottomColor: "#262626",
                  shadowColor: "#000",
                  shadowOpacity: 0.8,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Marca de impacto */}
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 80,
                    height: 80,
                    backgroundColor: "#b91c1c",
                    opacity: 0.05,
                    transform: [{ rotate: "45deg" }],
                  }}
                />

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      backgroundColor: "#b91c1c",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: "#000000",
                        fontWeight: "900",
                        fontSize: 16,
                      }}
                    >
                      {index + 1}
                    </Text>
                  </View>

                  <Text
                    style={{
                      flex: 1,
                      fontSize: 18,
                      fontWeight: "800",
                      color: "#ffffff",
                      letterSpacing: 0.5,
                    }}
                  >
                    {exercise.name}
                  </Text>
                </View>

                {/* Detalhes do exercício */}
                {exercise && (
                  <View
                    style={{
                      marginTop: spacing.sm,
                      paddingTop: spacing.sm,
                      borderTopWidth: 1,
                      borderTopColor: "#262626",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        backgroundColor: "#b91c1c",
                        marginRight: 8,
                      }}
                    />
                    <Text
                      style={{
                        color: "#737373",
                        fontSize: 13,
                        fontWeight: "700",
                      }}
                    >
                      {exercise.sets} {"×"} {exercise.reps} {"·"}{" "}
                      {exercise.weight} {"kg"}
                      {exercise.notes ? ` · ${exercise.notes}` : ""}
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </View>
          ))}

          {/* Footer épico */}
          <View
            style={{
              marginTop: spacing.xl,
              padding: spacing.xl,
              backgroundColor: "#1a1a1a",
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: "#b91c1c",
              borderRightWidth: 1,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderRightColor: "#262626",
              borderTopColor: "#262626",
              borderBottomColor: "#262626",
            }}
          >
            <Text
              style={{
                color: "#dc2626",
                fontSize: 18,
                fontWeight: "900",
                letterSpacing: 1,
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              BATALHA CONCLUÍDA
            </Text>
            <View
              style={{
                height: 2,
                backgroundColor: "#b91c1c",
                marginVertical: spacing.sm,
                opacity: 0.3,
              }}
            />
            <View
              style={{
                padding: spacing.lg,
                backgroundColor: "#1a1a1a",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: "900",
                  letterSpacing: 1,
                  marginBottom: spacing.md,
                }}
              >
                RELATÓRIO DE COMBATE
              </Text>

              {renderStat("Exercícios", totalExercises)}
              {renderStat("Séries totais", totalSets)}
              {renderStat("Repetições", totalReps)}
              {renderStat("Volume", `${totalVolume.toLocaleString()} kg`)}
            </View>
            <Text
              style={{
                color: "#737373",
                fontSize: 15,
                textAlign: "center",
                fontWeight: "600",
                fontStyle: "italic",
              }}
            >
              Os deuses testemunharam sua força
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
