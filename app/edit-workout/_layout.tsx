import { colors } from "@/constants/theme";
import { Stack } from "expo-router";

export default function EditWorkoutLayout() {
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
        name="[id]"
        options={{
          title: "Editar Treino",
        }}
      />
    </Stack>
  );
}
