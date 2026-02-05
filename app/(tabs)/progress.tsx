import { colors, components, spacing } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function Progress() {
  const stats = [
    { label: "Treinos Este Mês", value: "12", icon: "dumbbell" },
    { label: "Séries Totais", value: "156", icon: "repeat" },
    { label: "Volume Total", value: "12.5t", icon: "weight" },
  ];

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
      <View style={{ gap: spacing.lg }}>
        {stats.map((stat, index) => (
          <View
            key={index}
            style={{
              backgroundColor: colors.border,
              borderRadius: 8,
              padding: spacing.lg,
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
              borderLeftWidth: 4,
              borderLeftColor: colors.primary,
            }}
          >
            <MaterialCommunityIcons
              name={stat.icon as any}
              size={32}
              color={colors.primary}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[components.text.small, { marginBottom: spacing.xs }]}
              >
                {stat.label}
              </Text>
              <Text
                style={[
                  components.title.subsection,
                  { color: colors.text.white },
                ]}
              >
                {stat.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
