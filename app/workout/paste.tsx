import { colors, components, spacing } from "@/constants/theme";
import { Text, View } from "react-native";

export default function PasteWorkout() {
  // TODO: Implementar funcionalidade de "colar treino"
  // Esta tela deve permitir ao usuário colar um treino em formato de texto
  // e convertê-lo para o formato estruturado da aplicação

  return (
    <View style={[components.container.centered]}>
      <Text
        style={[
          components.title.section,
          { textAlign: "center", marginBottom: spacing.md },
        ]}
      >
        Colar Treino
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
