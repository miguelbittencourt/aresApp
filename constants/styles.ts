import { StyleSheet } from "react-native";
import { spacing } from "./theme";


export const styles = StyleSheet.create({
    headerSection: {
        marginBottom: spacing.xl,
        paddingBottom: spacing.md,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "900",
        color: "#ffffff",
        letterSpacing: 1,
        textTransform: "uppercase",
        marginBottom: spacing.sm,
    },
    headerDivider: {
        height: 2,
        backgroundColor: "#b91c1c",
        width: 60,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacing.lg,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: "#262626",
    },
    sectionMarker: {
        width: 4,
        height: 20,
        backgroundColor: "#b91c1c",
        marginRight: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "900",
        color: "#ffffff",
        letterSpacing: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#737373",
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    required: {
        color: "#b91c1c",
    },
    input: {
        backgroundColor: "#1a1a1a",
        borderWidth: 1,
        borderColor: "#262626",
        borderRadius: 6,
        padding: spacing.md,
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "600",
    },
    inputError: {
        borderColor: "#b91c1c",
        borderWidth: 2,
    },
    errorText: {
        color: "#b91c1c",
        fontSize: 13,
        marginTop: 4,
        fontWeight: "600",
    },
    undoBar: {
        marginTop: spacing.md,
        padding: spacing.md,
        borderRadius: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#262626",
    },
    undoText: {
        color: "#737373",
        fontSize: 13,
        fontWeight: "600",
    },
    undoBtn: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    undoBtnText: {
        color: "#b91c1c",
        fontWeight: "700",
        fontSize: 13,
        letterSpacing: 0.5,
    },
    secondaryButton: {
        backgroundColor: "#1a1a1a",
        borderWidth: 2,
        borderColor: "#262626",
        borderRadius: 8,
        padding: spacing.lg,
        alignItems: "center",
    },
    secondaryButtonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
    primaryButton: {
        borderRadius: 8,
        overflow: "hidden",
        shadowColor: "#b91c1c",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    primaryButtonGradient: {
        padding: spacing.lg,
        alignItems: "center",
    },
    primaryButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "900",
        letterSpacing: 1,
    },
});
