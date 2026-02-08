import { CardButton } from "@/components/CardButton";
import { colors, components, spacing } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { styles } from "../../constants/styles";

export default function Index() {
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
