import { colors } from "@/constants/theme";
import { Stack } from "expo-router";

export default function WorkoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text.white,
        headerTitleStyle: {
          fontFamily: "Cinzel-Bold",
        },
      }}
    >
      <Stack.Screen
        name="form"
        options={{
          title: "Novo Treino",
        }}
      />
      <Stack.Screen
        name="paste"
        options={{
          title: "Novo Treino",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Detalhes do Treino",
        }}
      />
    </Stack>
  );
}
