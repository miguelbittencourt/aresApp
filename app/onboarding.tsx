import { components, fonts, imageSizes, spacing } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

export default function Onboarding() {
  async function handleStart() {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/login");
  }

  return (
    <View style={components.container.centered}>
      {/* Logo */}
      <View style={{ alignItems: "center" }}>
        <Image
          source={require("../assets/images/adaptive-icon.png")}
          style={imageSizes.logo}
        />

        <Text style={components.title.hero}>ARES</Text>
      </View>

      {/* Slogan */}
      <View
        style={{
          alignItems: "center",
          marginTop: -20,
        }}
      >
        <Text
          style={[
            components.title.subsection,
            {
              marginBottom: spacing.xs,
              textAlign: "center",
            },
          ]}
        >
          Disciplina. Força. Progresso.
        </Text>

        <Text
          style={[
            components.text.body,
            {
              textAlign: "center",
              maxWidth: 270,
            },
          ]}
        >
          <Text style={{ fontFamily: fonts.family.body.semibold }}>
            Seu treino registrado de forma{" "}
          </Text>
          <Text
            style={[
              components.text.accent,
              { fontFamily: fonts.family.body.semibold },
            ]}
          >
            simples.
          </Text>
        </Text>
      </View>

      {/* Botão */}
      <Pressable style={components.button.primary} onPress={handleStart}>
        <Text style={components.button.text}>COMEÇAR</Text>
      </Pressable>

      {/* Footer */}
      <Text
        style={[
          components.text.small,
          {
            textAlign: "center",
            marginTop: spacing.lg,
          },
        ]}
      >
        Built by SolaDev
      </Text>
    </View>
  );
}
