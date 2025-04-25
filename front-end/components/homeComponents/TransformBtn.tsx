import { Easing, Pressable } from "react-native"
import { AnimThemedText, ThemedText } from "../ThemedText"
import { useAppTheme } from "@/hooks/useAppTheme";
import { gls } from "@/app/_layout";
import Animated, { interpolate, interpolateColor, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import React from "react";
import { useCreateStoryContext } from "@/contexts/CreateStoryContext";
import { createStory, transformStoryRequest } from "@/utils/transformUtils";
import { useRouter } from "expo-router";
import { getTodayString } from "@/utils/dateUtils";
import { useSQLiteContext } from "expo-sqlite";

export function TransformBtn(props: {disabled: boolean}) {

    const db = useSQLiteContext()
    const {theme, thmStyle} = useAppTheme()
    const {storyText, setStoryText, storyDate, setStoryDate} = useCreateStoryContext()
    const router = useRouter()

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

    const transformFn = React.useCallback(async () => {
        const id = await createStory(db, storyText, storyDate)
        setStoryText("")
        setStoryDate(getTodayString())
        router.navigate(`/newStory?id=${id}`)
    }, [storyText, storyDate])

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
            style={({pressed}) => [gls.width100, gls.centerAll, {padding: 10}, pressed && [thmStyle.bgPrimaryHover]]}
            disabled={props.disabled}
            onPress={transformFn}
            >
                <AnimThemedText style={[activeText]}>Transform your story</AnimThemedText>
            </Pressable>
        </Animated.View>
    )
}