import { colors, components, spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";

export function UserMenuButton() {
  const { user, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      setModalVisible(false);
      router.replace("/login");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível fazer logout.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => ({
          padding: spacing.md,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <MaterialCommunityIcons
          name="account-circle"
          size={32}
          color={colors.primary}
        />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-start",
            paddingTop: 100,
            paddingRight: spacing.md,
          }}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={{
              alignSelf: "flex-end",
              backgroundColor: colors.background,
              borderRadius: 8,
              padding: spacing.md,
              minWidth: 250,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={{ marginBottom: spacing.md }}>
              <Text
                style={[
                  components.title.subsection,
                  { color: colors.text.white },
                ]}
              >
                Minha Conta
              </Text>
            </View>

            {user ? (
              <>
                <View style={{ marginBottom: spacing.md }}>
                  <Text
                    style={[
                      components.text.small,
                      { color: colors.text.secondary },
                    ]}
                  >
                    Nome
                  </Text>
                  <Text
                    style={[
                      components.text.small,
                      { color: colors.text.white },
                    ]}
                  >
                    {user.displayName || "Sem nome"}
                  </Text>
                </View>

                <View style={{ marginBottom: spacing.md }}>
                  <Text
                    style={[
                      components.text.small,
                      { color: colors.text.secondary },
                    ]}
                  >
                    Email
                  </Text>
                  <Text
                    style={[
                      components.text.small,
                      { color: colors.text.white },
                    ]}
                  >
                    {user.email}
                  </Text>
                </View>

                <Pressable
                  onPress={handleLogout}
                  disabled={loggingOut}
                  style={{
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.md,
                    backgroundColor: colors.primary,
                    borderRadius: 6,
                    alignItems: "center",
                  }}
                >
                  {loggingOut ? (
                    <ActivityIndicator size="small" color={colors.background} />
                  ) : (
                    <Text
                      style={[
                        components.text.small,
                        { color: colors.background, fontWeight: "600" },
                      ]}
                    >
                      Sair
                    </Text>
                  )}
                </Pressable>
              </>
            ) : (
              <Text
                style={[components.text.small, { color: colors.text.white }]}
              >
                Faça login para ver seus dados.
              </Text>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
