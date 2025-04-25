import React from "react"
import { View, Pressable, Keyboard, StyleSheet } from "react-native"
import Animated, {FadeIn} from "react-native-reanimated"
import { ThemedText } from "../ThemedText"
import { gls, useActiveCompContext } from "@/app/_layout"
import { useAppTheme } from "@/hooks/useAppTheme"
import AntDesign from '@expo/vector-icons/AntDesign';

export function CompTab() {

    const {setActiveComp} = useActiveCompContext()
    const {theme} = useAppTheme()

    const backFn = React.useCallback(() => {setActiveComp(null); Keyboard.dismiss()}, [])

    return (
        <Animated.View entering={FadeIn.duration(250)} style={[gls.width100, gls.rows, gls.centerAll, {position: "relative", zIndex: 999, bottom: 0}]}>

            <View style={[gls.f1, gls.rows,]}>
                <Pressable 
                style={({pressed}) => [gls.circle, gls.centerAll, styles.btn, pressed && {backgroundColor: theme.surfaceHover}]}
                onPress={backFn}
                >
                    <AntDesign name="arrowleft" size={18} color={theme.onSurface} />
                </Pressable>
            </View>

            <View style={[{flex: 2}]}>
            </View>
        </Animated.View>
    )

}


const styles = StyleSheet.create({
    btn: {
        alignItems: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 5
    },
})