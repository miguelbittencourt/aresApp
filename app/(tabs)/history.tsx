import WorkoutHistoryList from "@/components/WorkoutHistoryList";
import { components } from "@/constants/theme";
import { View } from "react-native";

export default function History() {
  return (
    <View style={[components.container.screen]}>
      <WorkoutHistoryList />
    </View>
  );
}
