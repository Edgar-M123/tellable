import { Colors } from "@/constants/Colors";
import { useColorScheme, StyleSheet } from "react-native";




export function useAppTheme() {

    const scheme = useColorScheme()
    if (scheme == null || scheme == undefined) {
        throw new Error(
            "Couldn't find a theme. Is your component inside NavigationContainer or does it have a theme?"
          );
    }

    const theme = Colors[scheme]

    const thmStyle = StyleSheet.create({
        bgSurface: {
            backgroundColor: theme?.surface
        },
        bgSurfaceHover: {
            backgroundColor: theme?.surfaceHover
        },
        bgSurfaceContainer: {
            backgroundColor: theme?.surfaceContainer
        },
        bgPrimary: {
            backgroundColor: theme?.primary
        },
        bgPrimaryHover: {
            backgroundColor: theme?.primaryHover
        },
        bgSecondary: {
            backgroundColor: theme?.secondary
        }
    })

    return {theme, thmStyle}


}