import { colors, components, fonts, spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Register() {
  const { signUp, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Validação
    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    if (name.length < 3) {
      setError("O nome deve ter pelo menos 3 caracteres");
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

    if (password !== confirmPassword) {
      setError("As senhas não correspondem");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await signUp(email, password, name);
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("Erro ao fazer cadastro:", err);

      // Tratar diferentes tipos de erro
      if (err.code === "auth/email-already-in-use") {
        setError("Este email já está registrado");
      } else if (err.code === "auth/invalid-email") {
        setError("Email inválido");
      } else if (err.code === "auth/weak-password") {
        setError("Senha muito fraca");
      } else {
        setError("Erro ao fazer cadastro. Tente novamente.");
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
        <Text style={components.title.hero}>ARES</Text>
        <Text
          style={[
            components.title.subsection,
            { marginTop: spacing.sm, textAlign: "center" },
          ]}
        >
          Crie sua Conta
        </Text>
      </View>

      {/* Formulário */}
      <View style={{ gap: spacing.md }}>
        {/* Name Input */}
        <View>
          <Text
            style={[
              components.text.body,
              { marginBottom: spacing.sm, color: colors.text.primary },
            ]}
          >
            Nome
          </Text>
          <TextInput
            style={{
              backgroundColor: colors.border,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 12,
              color: colors.text.white,
              fontSize: fonts.size.md,
            }}
            placeholder="Seu nome completo"
            placeholderTextColor={colors.text.secondary}
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError("");
            }}
            editable={!isLoading}
          />
        </View>

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
              paddingHorizontal: 12,
              paddingVertical: 12,
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
              paddingHorizontal: 12,
              paddingVertical: 12,
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

        {/* Confirm Password Input */}
        <View>
          <Text
            style={[
              components.text.body,
              { marginBottom: spacing.sm, color: colors.text.primary },
            ]}
          >
            Confirmar Senha
          </Text>
          <TextInput
            style={{
              backgroundColor: colors.border,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 12,
              color: colors.text.white,
              fontSize: fonts.size.md,
            }}
            placeholder="Confirme sua senha"
            placeholderTextColor={colors.text.secondary}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
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
              fontFamily: fonts.body,
            }}
          >
            {error}
          </Text>
        ) : null}

        {/* Botão Cadastro */}
        <Pressable
          onPress={handleRegister}
          disabled={isLoading}
          style={[
            components.button.primary,
            { opacity: isLoading ? 0.6 : 1, marginTop: spacing.md },
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.text.white} />
          ) : (
            <Text style={components.button.text}>CADASTRAR</Text>
          )}
        </Pressable>
      </View>

      {/* Link para login */}
      <View
        style={{
          marginTop: spacing.lg,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: spacing.sm,
        }}
      >
        <Text style={[components.text.body, { color: colors.text.secondary }]}>
          Já tem uma conta?
        </Text>
        <Pressable onPress={() => router.push("/login")}>
          <Text
            style={[
              components.text.body,
              { color: colors.primary, fontWeight: fonts.weight.semibold },
            ]}
          >
            Faça Login
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
