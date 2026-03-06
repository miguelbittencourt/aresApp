export const colors = {
    // Backgrounds
    background: "#000",
    card: "#141414",

    // Text colors
    text: {
        primary: "#e6e6e6",
        secondary: "#777",
        white: "#fff",
    },

    // Brand colors
    primary: "#f01414",

    // Borders & dividers
    border: "#333",
    overlay: "rgba(0, 0, 0, 0.5)",
} as const;

// Responsive utilities
export const responsive = {
    // Font scale based on design
    getFontSize: (baseSize: number, scale: number = 1) => baseSize * scale,

    // Breakpoints (for screen width considerations)
    breakpoints: {
        small: 320,   // Mobile phones
        medium: 480,  // Larger phones
        large: 768,   // Tablets
        xlarge: 1024, // Large tablets/iPad
        desktop: 1440, // Desktop
    },

    // Adaptive padding based on screen size
    getAdaptivePadding: (baseSize: number, screenWidth: number) => {
        if (screenWidth > 1024) return baseSize * 3;
        if (screenWidth > 768) return baseSize * 2;
        return baseSize;
    },
} as const;

export const fonts = {
    family: {
        title: {
            regular: 'Cinzel',
            semibold: "Cinzel-SemiBold",
            bold: "Cinzel-Bold",
        },
        body: {
            regular: "Inter",
            semibold: "Inter-SemiBold",
            bold: "Inter-Bold",
        },
    },

    size: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 24,
        xxl: 32,
        xxxl: 48,
    },

    letterSpacing: {
        tight: 1,
        normal: 1.5,
        wide: 2,
        wider: 4,
    },
} as const;

export const spacing = {
    xs: 6,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 50,
} as const;

export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 999,
} as const;

export const opacity = {
    disabled: 0.5,
    muted: 0.8,
    overlay: 0.9,
} as const;

// Componentes pré-configurados
export const components = {
    button: {
        primary: {
            backgroundColor: colors.primary,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.xxl,
            borderRadius: borderRadius.md,
            alignItems: "center" as const,
        },
        secondary: {
            borderWidth: 1,
            borderColor: colors.primary,
            paddingVertical: spacing.md,
            borderRadius: 8,
            alignItems: "center",
            marginTop: spacing.md,
        },
        text: {
            fontFamily: fonts.family.title.bold,
            fontSize: fonts.size.md,
            color: colors.text.white,
            letterSpacing: fonts.letterSpacing.tight,
        },
    },

    input: {
        backgroundColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        color: colors.text.white,
        fontSize: fonts.size.md,
        marginBottom: spacing.md,
    },

    title: {
        hero: {
            fontFamily: fonts.family.title.semibold,
            fontSize: fonts.size.xxxl,
            color: colors.text.primary,
            letterSpacing: fonts.letterSpacing.wider,
        },
        section: {
            fontFamily: fonts.family.title.semibold,
            fontSize: fonts.size.lg,
            color: colors.text.primary,
            letterSpacing: fonts.letterSpacing.wide,
        },
        subsection: {
            fontFamily: fonts.family.title.regular,
            fontSize: fonts.size.md,
            color: colors.text.primary,
            letterSpacing: fonts.letterSpacing.wide,
            opacity: opacity.muted,
        },
    },

    text: {
        body: {
            fontFamily: fonts.family.body.regular,
            fontSize: fonts.size.md,
            letterSpacing: fonts.letterSpacing.normal,
            color: colors.text.primary,
        },
        small: {
            fontFamily: fonts.family.body.regular,
            fontSize: fonts.size.sm,
            color: colors.text.secondary,
        },
        accent: {
            color: colors.primary,
        },
    },

    container: {
        screen: {
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: spacing.xl,
            maxWidth: "100%",
            alignSelf: "center",
            width: "100%",
        },
        centered: {
            flex: 1,
            backgroundColor: colors.background,
            justifyContent: "center" as const,
            paddingHorizontal: spacing.xl,
            gap: spacing.xxxl,
            maxWidth: "100%",
            alignSelf: "center",
            width: "100%",
        },
        constrainedWidth: {
            maxWidth: 800,
            alignSelf: "center",
            width: "100%",
        },
    },
} as const;

// Helpers para espaçamento consistente
export const gaps = {
    xs: { gap: spacing.xs },
    sm: { gap: spacing.sm },
    md: { gap: spacing.md },
    lg: { gap: spacing.lg },
    xl: { gap: spacing.xl },
    xxl: { gap: spacing.xxl },
    xxxl: { gap: spacing.xxxl },
} as const;

// Tamanhos de imagem comuns
export const imageSizes = {
    icon: { width: 24, height: 24 },
    avatar: { width: 48, height: 48 },
    logo: { width: 120, height: 120 },
} as const;

export const godOfWarClassicColors = {
    background: "#0d0d0d",      // Preto profundo
    cardBg: "#1a1a1a",          // Cinza escuro
    bloodRed: "#b91c1c",        // Vermelho sangue
    bloodRedDark: "#7f1d1d",    // Vermelho escuro
    textPrimary: "#ffffff",     // Branco puro
    textSecondary: "#a3a3a3",   // Cinza médio
    textTertiary: "#737373",    // Cinza escuro
    borderDark: "#262626",      // Bordas escuras
    danger: "#dc2626",          // Vermelho vibrante
};