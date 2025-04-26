import { View, StyleSheet } from "react-native"
import { ThemedText } from "../ThemedText"
import { gls } from "@/app/_layout"
import { useAppTheme } from "@/hooks/useAppTheme";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";


export function HomeDivider() {

    console.log("Rendering HomeDivider")


    const {theme} = useAppTheme()

    return (
        <Animated.View
        layout={LinearTransition}
        entering={FadeIn.duration(250)}
        exiting={FadeOut.duration(250)}
        style={[gls.width100, gls.rows, gls.centerAll, {gap: 10}]}
        >
            <View style={[gls.f1, {height: StyleSheet.hairlineWidth, backgroundColor: theme.onSurfaceWeak}]}></View>
            <ThemedText type='small' style={[{color: theme.onSurfaceWeakest}]}>or create new</ThemedText>
            <View style={[gls.f1, {height: StyleSheet.hairlineWidth, backgroundColor: theme.onSurfaceWeak}]}></View>
        </Animated.View>
    )
}