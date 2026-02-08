import { AuthProvider } from "@/contexts/AuthContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  fade: true,
});

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require("../assets/fonts/Inter/Inter_24pt-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter/Inter_24pt-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter/Inter_24pt-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter/Inter_24pt-Bold.ttf"),

    Cinzel: require("../assets/fonts/Cinzel/Cinzel-Regular.ttf"),
    "Cinzel-SemiBold": require("../assets/fonts/Cinzel/Cinzel-SemiBold.ttf"),
    "Cinzel-Bold": require("../assets/fonts/Cinzel/Cinzel-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hide();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
