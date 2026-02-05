import { colors } from "@/constants/theme";
import { Stack } from "expo-router";

export default function WorkoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: "Novo Treino",
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text.white,
        headerTitleStyle: {
          fontFamily: "Cinzel",
          fontWeight: "600",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Treinos",
        }}
      />
    </Stack>
  );
}
