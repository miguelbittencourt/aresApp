import { spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { getWorkouts } from "@/services/workoutService";
import type { Workout } from "@/types/workout";
import { formatWorkoutDate } from "@/utils/formatDate";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

export default function WorkoutHistoryList() {
  const { user, loading: authLoading } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadWorkouts() {
    if (!user) return;

    try {
      setError(null);
      const data = await getWorkouts(user.uid);
      setWorkouts(data as Workout[]);
    } catch {
      setError("Não foi possível carregar seus treinos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleClick(workoutId: string) {
    router.push(`/workout/${workoutId}`);
  }

  useEffect(() => {
    if (!authLoading) {
      loadWorkouts();
    }
  }, [user, authLoading]);

  async function onRefresh() {
    setRefreshing(true);
    await loadWorkouts();
    setRefreshing(false);
  }

  if (authLoading || loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "#000000",
        }}
      >
        <ActivityIndicator size="large" color="#b91c1c" />
        <Text
          style={{
            color: "#4a4a4a",
            textAlign: "center",
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

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          padding: spacing.lg,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
        }}
      >
        <Text
          style={{
            color: "#dc2626",
            fontSize: 20,
            fontWeight: "900",
            letterSpacing: 1,
          }}
        >
          ACESSO NEGADO
        </Text>
        <Text
          style={{
            color: "#737373",
            marginTop: 8,
            textAlign: "center",
          }}
        >
          Faça login para acessar o Templo de Ares
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          padding: spacing.lg,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
        }}
      >
        <Text
          style={{
            color: "#dc2626",
            fontSize: 16,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {error}
        </Text>
      </View>
    );
  }

  if (workouts.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          padding: spacing.xl,
          backgroundColor: "#000000",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "#dc2626",
            fontSize: 24,
            fontWeight: "900",
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          SEM BATALHAS
        </Text>
        <Text
          style={{
            color: "#737373",
            fontSize: 15,
            lineHeight: 22,
          }}
        >
          Sua vingança ainda não começou.{"\n"}
          Registre seu primeiro treino.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#b91c1c"
          />
        }
        contentContainerStyle={{
          padding: spacing.md,
          paddingBottom: spacing.xxl,
        }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleClick(item.id)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            })}
          >
            <LinearGradient
              colors={["#1a1a1a", "#000000"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 12,
                padding: spacing.lg,
                borderLeftWidth: 4,
                borderLeftColor: "#b91c1c",
                borderRightWidth: 1,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderRightColor: "#262626",
                borderTopColor: "#262626",
                borderBottomColor: "#262626",
                shadowColor: "#b91c1c",
                shadowOpacity: 0.4,
                shadowRadius: 10,
                shadowOffset: { width: -2, height: 4 },
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Marca de sangue sutil no fundo */}
              <View
                style={{
                  position: "absolute",
                  top: -30,
                  right: -30,
                  width: 120,
                  height: 120,
                  backgroundColor: "#b91c1c",
                  opacity: 0.05,
                  borderRadius: 60,
                }}
              />

              {/* Linha superior vermelha */}
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  backgroundColor: "#b91c1c",
                  opacity: 0.3,
                }}
              />

              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "900",
                  color: "#ffffff",
                  letterSpacing: 0.5,
                  marginBottom: 6,
                  textTransform: "uppercase",
                }}
              >
                {item.gym_name}
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: "#737373",
                  fontWeight: "600",
                }}
              >
                {formatWorkoutDate(item.date)}
              </Text>

              <View
                style={{
                  marginTop: spacing.md,
                  paddingTop: spacing.md,
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
                    marginRight: 10,
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: "#a3a3a3",
                    fontWeight: "700",
                    letterSpacing: 0.5,
                  }}
                >
                  {(item.exercises || []).length} EXERCÍCIO
                  {(item.exercises || []).length !== 1 ? "S" : ""}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>
        )}
      />
    </View>
  );
}
