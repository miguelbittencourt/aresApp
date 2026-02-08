import { components } from "@/constants/theme";
import { Pressable } from "react-native";

export function PrimaryButton({
  children,
  onPress,
  styles,
  disabled,
}: {
  children: React.ReactNode;
  onPress: () => void;
  styles?: any;
  disabled?: boolean;
}) {
  return (
    <Pressable
      style={[components.button.primary, styles]}
      onPress={onPress}
      disabled={disabled}
    >
      {children}
    </Pressable>
  );
}
