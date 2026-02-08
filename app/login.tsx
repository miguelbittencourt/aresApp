import { colors, components, fonts, spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm, loginSchema } from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const errorMap: Record<string, string> = {
  "auth/user-not-found": "Email não encontrado",
  "auth/wrong-password": "Senha incorreta",
  "auth/invalid-email": "Email inválido",
};

export default function Login() {
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginForm) {
    try {
      await signIn(data.email, data.password);
      router.replace("/(tabs)");
    } catch (err: any) {
      const message =
        errorMap[err.code] ?? "Erro ao fazer login. Tente novamente.";

      setError("root", { message });
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        paddingHorizontal: spacing.md,
      }}
    >
      {/* Header */}
      <View style={{ marginBottom: spacing.xxl, alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
          }}
        >
          <Image
            source={require("../assets/images/ares-transparent.png")}
            style={{ width: 55, height: 55 }}
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

      {/* Form */}
      <View style={{ gap: spacing.md }}>
        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <View>
              <Text
                style={[components.text.body, { marginBottom: spacing.xs }]}
              >
                Email
              </Text>
              <TextInput
                style={inputStyle}
                placeholder="seu@email.com"
                placeholderTextColor={colors.text.secondary}
                autoCapitalize="none"
                keyboardType="email-address"
                value={field.value}
                onChangeText={field.onChange}
              />
              {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
            </View>
          )}
        />

        {/* Password */}
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <View>
              <Text
                style={[components.text.body, { marginBottom: spacing.xs }]}
              >
                Senha
              </Text>
              <TextInput
                style={inputStyle}
                placeholder="Sua senha"
                placeholderTextColor={colors.text.secondary}
                secureTextEntry
                value={field.value}
                onChangeText={field.onChange}
              />
              {errors.password && (
                <ErrorText>{errors.password.message}</ErrorText>
              )}
            </View>
          )}
        />

        {/* Erro global (Firebase) */}
        {errors.root?.message && <ErrorText>{errors.root.message}</ErrorText>}

        {/* Botão */}
        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          style={[
            components.button.primary,
            { opacity: isSubmitting ? 0.6 : 1, marginTop: spacing.md },
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.text.white} />
          ) : (
            <Text style={components.button.text}>ENTRAR</Text>
          )}
        </Pressable>
      </View>

      {/* Footer */}
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
              { color: colors.primary, fontWeight: "600" },
            ]}
          >
            Cadastre-se
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ---------------- Styles ---------------- */

const inputStyle = {
  backgroundColor: colors.border,
  borderRadius: 8,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.md,
  color: colors.text.white,
  fontSize: fonts.size.md,
};

function ErrorText({ children }: { children?: string }) {
  return (
    <Text
      style={{
        color: colors.primary,
        fontSize: fonts.size.sm,
        marginTop: 4,
      }}
    >
      {children}
    </Text>
  );
}
