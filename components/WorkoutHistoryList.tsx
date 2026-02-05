import { colors, components, spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { getWorkouts } from "@/services/workoutService";
import type { Workout } from "@/types/workout";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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

  // 🔄 Loading inicial
  if (authLoading || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 🔒 Usuário não logado
  if (!user) {
    return (
      <View style={{ padding: spacing.lg, alignItems: "center" }}>
        <Text style={components.text.body}>
          Faça login para ver seu histórico.
        </Text>
      </View>
    );
  }

  // ❌ Erro
  if (error) {
    return (
      <View style={{ padding: spacing.lg, alignItems: "center" }}>
        <Text style={[components.text.body, { color: colors.primary }]}>
          {error}
        </Text>
      </View>
    );
  }

  // 🕳️ Vazio
  if (workouts.length === 0) {
    return (
      <View style={{ padding: spacing.lg, alignItems: "center" }}>
        <Text style={components.text.body}>
          Nenhum treino registrado ainda.
        </Text>
        <Text style={[components.text.small, { marginTop: spacing.sm }]}>
          Comece registrando seu primeiro treino.
        </Text>
      </View>
    );
  }

  // 📜 Lista
  return (
    <FlatList
      data={workouts}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
      contentContainerStyle={{
        padding: spacing.md,
        paddingBottom: spacing.xxl,
      }}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      renderItem={({ item }) => (
        <View
          style={{
            backgroundColor: colors.border,
            borderRadius: 14,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: colors.primary,
            shadowColor: colors.primary,
            shadowOpacity: 0.15,
            shadowRadius: 6,
          }}
        >
          <Text style={[components.title.subsection, { marginBottom: 4 }]}>
            {item.gym_name}
          </Text>

          <Text style={components.text.small}>{item.date}</Text>

          <View
            style={{
              marginTop: spacing.sm,
              paddingTop: spacing.sm,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <Text style={components.text.small}>
              {(item.exercises || []).length} exercício(s)
            </Text>
          </View>
        </View>
      )}
    />
  );
}
