import React, { memo } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { gls } from "@/app/_layout";
import { useAppTheme } from "@/hooks/useAppTheme";
import AntDesign from '@expo/vector-icons/AntDesign';
import Animated, { FadeIn, FadeOut, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";



export const StorytellingTips = memo(function StorytellingTips(props: {text: string}) {

    const {theme} = useAppTheme()
    const [show, setShow] = React.useState(false)

    const rotate = useSharedValue(0)
    const rotateStyle = useAnimatedStyle(() => ({
        transform: [{rotateZ: `${rotate.value}deg`}]
    }))
    
    const rotateFn = React.useCallback(() => {rotate.value = withTiming(90, {duration: 250})}, [])
    const unrotateFn = React.useCallback(() => {rotate.value = withTiming(0, {duration: 250})}, [])

    const showText = React.useCallback(() => {setShow(true); rotateFn()}, [])
    const hideText = React.useCallback(() => {setShow(false); unrotateFn()}, [])



    return (
        <Animated.View 
        layout={LinearTransition.duration(250)}
        exiting={FadeOut.duration(150)}
        style={[gls.br, gls.width100, style.container, {borderColor: theme.secondary, backgroundColor: theme.surfaceContainer}]}>
            
            <Pressable 
            style={[gls.width100, gls.rows, {alignItems: "center"}]}
            onPress={show ? hideText : showText}
            >
                <Animated.View style={[rotateStyle]}>
                    <AntDesign name="caretright" size={16} color={theme.onSurface} />
                </Animated.View>
                <ThemedText> Storytelling Tips</ThemedText>
            </Pressable>

            {show && (
                <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(250)} style={[gls.width100]}>

                    <ThemedText>{props.text}</ThemedText>

                </Animated.View>
            )}
        </Animated.View>
    )
})

const style = StyleSheet.create({
    container: {
        gap: 10,
        borderWidth: 1, 
        padding: 14,
        zIndex: 2
    }
})