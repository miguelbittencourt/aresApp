import { PrimaryButton } from "@/components/PrimaryButton";
import { colors, components, fonts, spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Login() {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Validação
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    if (!email.includes("@")) {
      setError("Por favor, insira um email válido");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await signIn(email, password);
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("Erro ao fazer login:", err);

      // Tratar diferentes tipos de erro
      if (err.code === "auth/user-not-found") {
        setError("Email não encontrado");
      } else if (err.code === "auth/wrong-password") {
        setError("Senha incorreta");
      } else if (err.code === "auth/invalid-email") {
        setError("Email inválido");
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        paddingHorizontal: spacing.md,
      }}
    >
      {/* Título */}
      <View style={{ marginBottom: spacing.xxl, alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: spacing.sm,
          }}
        >
          <Image
            source={require("../assets/images/ares-transparent.png")}
            style={{
              width: 55,
              height: 55,
            }}
          />
          <Text style={components.title.hero}>ARES</Text>
        </View>
        <Text
          style={[
            components.title.subsection,
            { marginTop: spacing.sm, textAlign: "center" },
          ]}
        >
          Entre na sua conta
        </Text>
      </View>

      {/* Formulário */}
      <View style={{ gap: spacing.md }}>
        {/* Email Input */}
        <View>
          <Text
            style={[
              components.text.body,
              { marginBottom: spacing.sm, color: colors.text.primary },
            ]}
          >
            Email
          </Text>
          <TextInput
            style={{
              backgroundColor: colors.border,
              borderRadius: 8,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.md,
              color: colors.text.white,
              fontSize: fonts.size.md,
            }}
            placeholder="seu@email.com"
            placeholderTextColor={colors.text.secondary}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError("");
            }}
            editable={!isLoading}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View>
          <Text
            style={[
              components.text.body,
              { marginBottom: spacing.sm, color: colors.text.primary },
            ]}
          >
            Senha
          </Text>
          <TextInput
            style={{
              backgroundColor: colors.border,
              borderRadius: 8,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.md,
              color: colors.text.white,
              fontSize: fonts.size.md,
            }}
            placeholder="Sua senha"
            placeholderTextColor={colors.text.secondary}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError("");
            }}
            secureTextEntry
            editable={!isLoading}
          />
        </View>

        {/* Erro */}
        {error ? (
          <Text
            style={{
              color: colors.primary,
              fontSize: fonts.size.sm,
              fontFamily: fonts.family.body.regular,
            }}
          >
            {error}
          </Text>
        ) : null}

        {/* Botão Login */}
        <PrimaryButton
          onPress={handleLogin}
          disabled={isLoading}
          styles={{ opacity: isLoading ? 0.6 : 1, marginTop: spacing.md }}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.text.white} />
          ) : (
            <Text style={components.button.text}>ENTRAR</Text>
          )}
        </PrimaryButton>
      </View>

      {/* Link para cadastro */}
      <View
        style={{
          marginTop: spacing.xxl,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: spacing.sm,
        }}
      >
        <Text style={[components.text.body, { color: colors.text.secondary }]}>
          Não tem uma conta?
        </Text>
        <Pressable onPress={() => router.push("/register")}>
          <Text
            style={[
              components.text.body,
              { color: colors.primary, fontWeight: "600" as const },
            ]}
          >
            Cadastre-se
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
