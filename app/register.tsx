import { colors, components, fonts, spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { RegisterForm, registerSchema } from "@/schemas/registerSchema";
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
  "auth/email-already-in-use": "Este email já está registrado",
  "auth/invalid-email": "Email inválido",
  "auth/weak-password": "Senha muito fraca",
};

export default function RegisterScreen() {
  const { signUp } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterForm) {
    try {
      await signUp(data.email, data.password, data.name);
      router.replace("/(tabs)");
    } catch (err: any) {
      const message =
        errorMap[err.code] ?? "Erro ao criar conta. Tente novamente.";
      throw new Error(message);
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
            gap: spacing.xs,
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
            { marginTop: spacing.xs, textAlign: "center" },
          ]}
        >
          Crie sua Conta
        </Text>
      </View>

      {/* Form */}
      <View style={{ gap: spacing.md }}>
        {/* Nome */}
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <View>
              <Text
                style={[components.text.body, { marginBottom: spacing.xs }]}
              >
                Nome
              </Text>
              <TextInput
                style={inputStyle}
                placeholder="Seu nome completo"
                placeholderTextColor={colors.text.secondary}
                value={field.value}
                onChangeText={field.onChange}
              />
              {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
            </View>
          )}
        />

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

        {/* Senha */}
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

        {/* Confirmar Senha */}
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <View>
              <Text
                style={[components.text.body, { marginBottom: spacing.xs }]}
              >
                Confirmar Senha
              </Text>
              <TextInput
                style={inputStyle}
                placeholder="Confirme sua senha"
                placeholderTextColor={colors.text.secondary}
                secureTextEntry
                value={field.value}
                onChangeText={field.onChange}
              />
              {errors.confirmPassword && (
                <ErrorText>{errors.confirmPassword.message}</ErrorText>
              )}
            </View>
          )}
        />

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
            <Text style={components.button.text}>CADASTRAR</Text>
          )}
        </Pressable>
      </View>

      {/* Footer */}
      <View
        style={{
          marginTop: spacing.lg,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: spacing.xs,
        }}
      >
        <Text style={[components.text.body, { color: colors.text.secondary }]}>
          Já tem uma conta?
        </Text>
        <Pressable onPress={() => router.push("/login")}>
          <Text
            style={[
              components.text.body,
              { color: colors.primary, fontWeight: "600" },
            ]}
          >
            Faça Login
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ------------------------------ Styles ------------------------------ */

const inputStyle = {
  backgroundColor: colors.border,
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 12,
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
