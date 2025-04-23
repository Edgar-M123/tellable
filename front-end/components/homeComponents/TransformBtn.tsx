import { Pressable } from "react-native"
import { AnimThemedText, ThemedText } from "../ThemedText"
import { useAppTheme } from "@/hooks/useAppTheme";
import { gls } from "@/app/_layout";
import Animated, { interpolate, interpolateColor, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import React from "react";
import { CreateStoryContext, CreateStoryContextValues } from "@/contexts/CreateStoryContext";
import { transformStoryRequest } from "@/utils/transformUtils";

export function TransformBtn(props: {disabled: boolean}) {

    const {theme, thmStyle} = useAppTheme()
    const {storyText} = React.useContext(CreateStoryContext) as CreateStoryContextValues

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

    const transformStory = React.useCallback(async () => {
        const newStory = await transformStoryRequest(storyText); 
        console.log("StoryData: ", newStory);
        console.log("Story: ", newStory.story);
    }, [storyText])

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
            onPress={transformStory}
            >
                <AnimThemedText style={[activeText]}>Transform your story</AnimThemedText>
            </Pressable>
        </Animated.View>
    )
}