import { useWindowDimensions } from "react-native";

export function useResponsive() {
    const { width, height } = useWindowDimensions();

    return {
        width,
        height,
        isSmall: width < 480,
        isMobile: width >= 480 && width < 768,
        isTablet: width >= 768 && width < 1024,
        isLarge: width >= 1024,
        isLandscape: width > height,
        isPortrait: height > width,

        // Adaptive sizing
        adaptiveSpacing: (mobileSize: number, tabletSize: number, desktopSize?: number) => {
            if (width >= 1024) return desktopSize || tabletSize * 1.5;
            if (width >= 768) return tabletSize;
            return mobileSize;
        },

        adaptiveFontSize: (baseSize: number, scale: number = 1.2) => {
            if (width >= 1024) return baseSize * scale * 1.2;
            if (width >= 768) return baseSize * scale;
            return baseSize;
        },
    };
}
