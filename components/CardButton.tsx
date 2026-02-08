import { colors, fonts, spacing } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export function CardButton({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: "#0d0d0d",
          borderRadius: 12,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: "#2a2a2a",
          opacity: pressed ? 0.7 : 1,
          shadowColor: colors.primary,
          shadowOpacity: 0.4,
          shadowRadius: 10,
          elevation: 10,
        },
      ]}
      onPress={onPress}
    >
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          backgroundColor: colors.primary,
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
        }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 12,
            backgroundColor: "#140404",
            borderWidth: 1,
            borderColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {icon}
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              color: colors.text.white,
              letterSpacing: 1.5,
              fontWeight: "700",
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontFamily: fonts.family.body.regular,
              fontSize: 14,
              color: colors.text.secondary,
              marginTop: 4,
            }}
          >
            {subtitle}
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={colors.primary}
        />
      </View>
    </Pressable>
  );
}
