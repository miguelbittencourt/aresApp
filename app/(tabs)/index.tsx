import { CardButton } from "@/components/CardButton";
import { colors, components, spacing } from "@/constants/theme";
import { LastActivity, useWorkoutDraft } from "@/contexts/WorkoutDraftContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "../../constants/styles";

export default function Index() {
  const { getLastActivity, clearLastActivity } = useWorkoutDraft();
  const [lastActivity, setLastActivity] = useState<LastActivity | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadLastActivity();
    }, []),
  );

  async function loadLastActivity() {
    const activity = await getLastActivity();

    // ✅ Só mostra se for recente (últimas 24 horas)
    if (activity) {
      const hoursSince = (Date.now() - activity.timestamp) / (1000 * 60 * 60);
      if (hoursSince < 24) {
        setLastActivity(activity);
      } else {
        // Limpa atividades antigas
        await clearLastActivity();
        setLastActivity(null);
      }
    }
  }

  function handleContinue() {
    if (!lastActivity) return;

    if (lastActivity.type === "edit" && lastActivity.workoutId) {
      router.push(`/edit-workout/${lastActivity.workoutId}`);
    } else {
      router.push("/workout/form"); // ✅ Corrija a rota
    }
  }

  async function handleDismiss() {
    await clearLastActivity();
    setLastActivity(null);
  }

  function getTimeAgo(timestamp: number): string {
    const now = Date.now();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));

    if (diffInMinutes < 1) return "agora mesmo";
    if (diffInMinutes === 1) return "há 1 minuto";
    if (diffInMinutes < 60) return `há ${diffInMinutes} minutos`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return "há 1 hora";
    if (diffInHours < 24) return `há ${diffInHours} horas`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "há 1 dia";
    return `há ${diffInDays} dias`;
  }

  return (
    <ScrollView style={[components.container.screen]}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingVertical: spacing.xxl,
          maxWidth: 900,
          alignSelf: "center",
          width: "100%",
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: spacing.xxl }}>
          <Text style={[styles.headerTitle, { fontSize: 22, marginBottom: 0 }]}>
            Novo Treino
          </Text>

          <Text
            style={{
              fontSize: 18,
              color: colors.text.secondary,
              letterSpacing: 1,
              marginTop: spacing.sm,
            }}
          >
            Escolha como deseja criar
          </Text>
        </View>

        {/* ✅ Card "Continue de onde parou" - ANTES das opções */}
        {lastActivity && (
          <LinearGradient
            colors={["rgba(185, 28, 28, 0.2)", "rgba(127, 29, 29, 0.1)"]}
            style={{
              padding: spacing.lg,
              borderRadius: 12,
              marginBottom: spacing.xl,
              borderWidth: 2,
              borderColor: "#b91c1c",
              shadowColor: "#b91c1c",
              shadowOpacity: 0.3,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              {/* Ícone */}
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: "#b91c1c",
                  borderRadius: 25,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name={lastActivity.type === "edit" ? "pencil" : "plus-circle"}
                  size={26}
                  color="#fff"
                />
              </View>

              {/* Conteúdo */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "900",
                    letterSpacing: 0.5,
                    marginBottom: 4,
                  }}
                >
                  CONTINUE DE ONDE PAROU
                </Text>

                <Text
                  style={{
                    color: "#a3a3a3",
                    fontSize: 14,
                    marginBottom: 2,
                  }}
                >
                  {lastActivity.type === "edit"
                    ? "Editando treino"
                    : "Novo treino"}
                  {lastActivity.preview.gymName &&
                    ` • ${lastActivity.preview.gymName}`}
                </Text>

                <Text
                  style={{
                    color: "#737373",
                    fontSize: 12,
                  }}
                >
                  {lastActivity.preview.exerciseCount} exercício
                  {lastActivity.preview.exerciseCount !== 1 ? "s" : ""} •{" "}
                  {getTimeAgo(lastActivity.timestamp)} {/* ✅ Formatado */}
                </Text>

                {/* Botões */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    marginTop: spacing.md,
                  }}
                >
                  <Pressable
                    onPress={handleContinue}
                    style={({ pressed }) => ({
                      flex: 1,
                      backgroundColor: "#b91c1c",
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 8,
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "900",
                        fontSize: 14,
                        textAlign: "center",
                        letterSpacing: 0.5,
                      }}
                    >
                      CONTINUAR
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleDismiss}
                    style={({ pressed }) => ({
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#404040",
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <Text
                      style={{
                        color: "#737373",
                        fontWeight: "700",
                        fontSize: 14,
                      }}
                    >
                      Descartar
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </LinearGradient>
        )}

        {/* Opções de Treino */}
        <View style={{ gap: spacing.lg }}>
          {/* Opção: Copia e Cola */}
          <CardButton
            onPress={() => router.push("/workout/paste")}
            icon={
              <MaterialCommunityIcons
                name="content-paste"
                size={28}
                color={colors.primary}
              />
            }
            title="COPIA E COLA"
            subtitle="Cole um treino pronto no formato especificado"
          />

          {/* Opção: Formulário */}
          <CardButton
            onPress={() => router.push("/workout/form")}
            icon={
              <MaterialCommunityIcons
                name="form-textbox"
                size={32}
                color={colors.primary}
              />
            }
            title="FORMULÁRIO"
            subtitle="Preencha um formulário com os dados do seu treino"
          />
        </View>

        {/* Informação adicional */}
        <View
          style={{
            marginTop: spacing.xxxl,
            paddingTop: spacing.lg,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <Text
            style={[
              components.text.small,
              {
                textAlign: "center",
                color: colors.text.secondary,
                fontSize: 16,
              },
            ]}
          >
            Seus treinos serão salvos no histórico para consulta futura
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
