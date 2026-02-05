import { UserMenuButton } from "@/components/UserMenu";
import { colors } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
        },
        headerRight: () => <UserMenuButton />,
        headerRightContainerStyle: {
          paddingRight: 12,
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Treino",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={24} name="dumbbell" color={color} />
          ),
          headerTitle: "Treino de Hoje",
          headerTitleStyle: {
            fontFamily: "Cinzel",
            fontSize: 20,
          },
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Histórico",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={24} name="history" color={color} />
          ),
          headerTitle: "Histórico de Treinos",
          headerTitleStyle: {
            fontFamily: "Cinzel",
            fontSize: 20,
          },
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progresso",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={24} name="chart-line" color={color} />
          ),
          headerTitle: "Progresso",
          headerTitleStyle: {
            fontFamily: "Cinzel",
            fontSize: 20,
          },
        }}
      />
    </Tabs>
  );
}
