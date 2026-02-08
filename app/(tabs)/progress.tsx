import { colors, components, spacing } from "@/constants/theme";
import { Text, View } from "react-native";

export default function Progress() {
  const stats = [
    { label: "Treinos Este Mês", value: "12", icon: "dumbbell" },
    { label: "Séries Totais", value: "156", icon: "repeat" },
    { label: "Volume Total", value: "12.5t", icon: "weight" },
  ];

  return (
    <View style={[components.container.centered]}>
      <Text
        style={[
          components.title.section,
          { textAlign: "center", marginBottom: spacing.md },
        ]}
      >
        Progresso
      </Text>
      <Text
        style={[
          components.text.body,
          { color: colors.text.secondary, textAlign: "center" },
        ]}
      >
        Funcionalidade em desenvolvimento...
      </Text>
    </View>
  );
}
