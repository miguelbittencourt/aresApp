import { spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { getWorkoutById } from "@/services/workoutService";
import type { Workout } from "@/types/workout";
import { formatWorkoutDate } from "@/utils/formatDate";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function WorkoutDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
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
            marginBottom: spacing.lg,
            paddingBottom: spacing.md,
            borderBottomWidth: 2,
            borderBottomColor: "#b91c1c",
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
            ARSENAL
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
                    {exercise.weight} {exercise.unit} × {exercise.reps} REPS{" "}
                    {exercise.notes ? `· ${exercise.notes}` : ""}
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
              fontSize: 16,
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
          <Text
            style={{
              color: "#737373",
              fontSize: 12,
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            Os deuses testemunharam sua força
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
