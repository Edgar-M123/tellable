import { ActivityIndicator, Easing, Pressable } from "react-native"
import { AnimThemedText, ThemedText } from "../ThemedText"
import { useAppTheme } from "@/hooks/useAppTheme";
import { gls } from "@/app/_layout";
import Animated, { interpolate, interpolateColor, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import React, { memo } from "react";
import { useCreateStoryContext } from "@/contexts/CreateStoryContext";
import { createStory, transformStoryRequest } from "@/utils/transformUtils";
import { useRouter } from "expo-router";
import { getTodayString } from "@/utils/dateUtils";
import { useSQLiteContext } from "expo-sqlite";

export const TransformBtn = memo(function TransformBtn(props: {isTransforming: boolean, transformFn: () => void, disabled: boolean}) {

    console.log("rendering TransformBtn")

    const {theme, thmStyle} = useAppTheme()

    const activeProg = useSharedValue(0)

    const activeBtn = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            activeProg.value,
            [0, 1],
            [theme.primaryDisabled, theme.primary]
        ),
        transform: [{scale: interpolate(activeProg.value, [0, 1], [0.95, 1])}]
    }))

    const activeText = useAnimatedStyle(() => ({
        color: interpolateColor(
            activeProg.value,
            [0, 1],
            [theme.onSurfaceWeakest, theme.onPrimary]
        ),
    }))

    React.useEffect(() => {

        props.disabled
        ? activeProg.value = withTiming(0, {duration: 250})
        : activeProg.value = withTiming(1, {duration: 250})

    }, [props.disabled])

    return (
        <Animated.View
        layout={LinearTransition.duration(250)}
        style={[activeBtn, gls.width100, gls.centerAll, gls.br, {overflow: 'hidden'}]}
        >
            <Pressable 
            style={({pressed}) => [gls.width100, gls.rows, gls.centerAll, {padding: 10}, pressed && [thmStyle.bgPrimaryHover]]}
            disabled={props.disabled}
            onPress={props.transformFn}
            >
                {props.isTransforming && <ActivityIndicator color={theme.onSurfaceWeakest} />}
                <AnimThemedText style={[activeText]}>{props.isTransforming ? "Working on it" : "Transform your story"}</AnimThemedText>
            </Pressable>
        </Animated.View>
    )
})