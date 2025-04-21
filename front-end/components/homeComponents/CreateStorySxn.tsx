import React, { Dispatch, SetStateAction } from "react"
import { View } from "react-native"
import { ThemedText } from "../ThemedText"
import { TransformBtn } from "./TransformBtn"
import { StoryInput } from "./StoryInput"
import { ActiveCompContext, ActiveCompContextValues, gls } from "@/app/_layout"
import { useAppTheme } from "@/hooks/useAppTheme";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { StoryDateSelect } from "./StoryDateSelect";
import { CreateStoryContext, CreateStoryContextValues } from "@/contexts/CreateStoryContext";



export function CreateStorySxn() {

    const {theme, thmStyle} = useAppTheme()
    const {activeComp} = React.useContext(ActiveCompContext) as ActiveCompContextValues

    const [disabled, setDisabled] = React.useState(true)
    const {storyText} = React.useContext(CreateStoryContext) as CreateStoryContextValues

    React.useEffect(() => {
    
        storyText.length > 0 && disabled && setDisabled(false);
        storyText.length == 0 && !disabled && setDisabled(true);
    
    }, [storyText])
    

    return (
            <Animated.View 
            layout={LinearTransition.duration(250)}
            entering={FadeIn.duration(250)}
            exiting={FadeOut.duration(250)}
            style={[gls.shrink, gls.width100, thmStyle.bgSurface, {maxHeight: "50%", padding: 10, gap: 10}]}
            >
                <View>
                    <ThemedText type='title'>What happened today?</ThemedText>
                    <ThemedText type="small" style={{color: theme.onSurfaceWeak}}>Jot down something you experienced</ThemedText>
                </View>
                <StoryInput />
                {activeComp && <StoryDateSelect />}
                <TransformBtn disabled={disabled} />
                
            </Animated.View>
    )
}