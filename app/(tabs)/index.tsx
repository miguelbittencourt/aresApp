import { colors, components, fonts, spacing } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={[
        components.container.screen,
        {
          display: "flex",
          justifyContent: "center",
        },
      ]}
    >
      {/* Header */}
      <View style={{ marginBottom: spacing.xxl }}>
        <Text
          style={{
            fontFamily: fonts.title,
            fontSize: 24,
            color: colors.text.white,
            letterSpacing: 2,
          }}
        >
          Novo Treino
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: colors.text.secondary,
            letterSpacing: 1,
          }}
        >
          Escolha como deseja criar
        </Text>
      </View>

      {/* Opções de Treino */}
      <View style={{ gap: spacing.lg }}>
        {/* Opção: Copia e Cola */}
        <Pressable
          onPress={() => router.push("/workout/paste")}
          style={({ pressed }) => [
            {
              backgroundColor: "#0d0d0d",
              borderRadius: 12,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: "#2a2a2a",
              opacity: pressed ? 0.7 : 1,
              shadowColor: colors.primary,
              shadowOpacity: 0.4,
              shadowRadius: 10,
              elevation: 10,
            },
          ]}
        >
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              backgroundColor: colors.primary,
              borderTopLeftRadius: 12,
              borderBottomLeftRadius: 12,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                backgroundColor: "#140404",
                borderWidth: 1,
                borderColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="content-paste"
                size={28}
                color={colors.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: fonts.title,
                  fontSize: 18,
                  color: colors.text.white,
                  letterSpacing: 1.5,
                }}
              >
                Copia e Cola
              </Text>
              <Text
                style={{
                  fontFamily: fonts.body,
                  fontSize: 13,
                  color: colors.text.secondary,
                  marginTop: 4,
                }}
              >
                Cole um treino pronto no formato especificado
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.primary}
            />
          </View>
        </Pressable>

        {/* Opção: Formulário */}
        <Pressable
          onPress={() => router.push("/workout/form")}
          style={({ pressed }) => [
            {
              backgroundColor: "#0d0d0d",
              borderRadius: 12,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: "#2a2a2a",
              opacity: pressed ? 0.7 : 1,
              shadowColor: colors.primary,
              shadowOpacity: 0.4,
              shadowRadius: 10,
              elevation: 10,
            },
          ]}
        >
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              backgroundColor: colors.primary,
              borderTopLeftRadius: 12,
              borderBottomLeftRadius: 12,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                backgroundColor: "#140404",
                borderWidth: 1,
                borderColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="form-textbox"
                size={32}
                color={colors.primary}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: fonts.title,
                  fontSize: 18,
                  color: colors.text.white,
                  letterSpacing: 1.5,
                }}
              >
                Por Formulário
              </Text>
              <Text
                style={[
                  components.text.small,
                  {
                    color: colors.text.secondary,
                    maxWidth: "90%",
                    marginTop: 4,
                  },
                ]}
              >
                Preencha um formulário com os dados do seu treino
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.primary}
            />
          </View>
        </Pressable>
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
            { textAlign: "center", color: colors.text.secondary },
          ]}
        >
          Seus treinos serão salvos no histórico para consulta futura
        </Text>
      </View>
    </View>
  );
}
