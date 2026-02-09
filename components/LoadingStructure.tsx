import { ActivityIndicator, Text, View } from "react-native";

export default function LoadingStructure() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0d0d0d",
      }}
    >
      <ActivityIndicator size="large" color="#b91c1c" />
      <Text
        style={{
          color: "#4a4a4a",
          marginTop: 16,
          fontSize: 14,
          letterSpacing: 2,
          fontWeight: "700",
        }}
      >
        CARREGANDO...
      </Text>
    </View>
  );
}
