import React, { Dispatch, SetStateAction } from "react"
import { View } from "react-native"
import { ThemedText } from "../ThemedText"
import { TransformBtn } from "./TransformBtn"
import { StoryInput } from "./StoryInput"
import { gls } from "@/app/_layout"
import { useAppTheme } from "@/hooks/useAppTheme";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";

export function CreateStorySxn() {

    const {theme, thmStyle} = useAppTheme()

    const [disabled, setDisabled] = React.useState(true)
    const [storyText, setStoryText] = React.useState("")

    React.useEffect(() => {
    
        storyText.length > 0 && disabled && setDisabled(false);
        storyText.length == 0 && !disabled && setDisabled(true);
    
    }, [storyText])
    

    return (
        <Animated.View 
        layout={LinearTransition}
        entering={FadeIn.duration(250)}
        exiting={FadeOut.duration(250)}
        style={[gls.width100, thmStyle.bgSurface, {padding: 10, gap: 10}]}
        >
            <View>
                <ThemedText type='bold'>What happened today?</ThemedText>
                <ThemedText type="small" style={{color: theme.onSurfaceWeak}}>Jot down something you experienced</ThemedText>
            </View>
            <StoryInput setStoryText={setStoryText}/>
            <TransformBtn disabled={disabled} />
        </Animated.View>
    )
}