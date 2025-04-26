import React, { Dispatch, SetStateAction } from "react"
import { Platform, View } from "react-native"
import { ThemedText } from "../ThemedText"
import { TransformBtn } from "./TransformBtn"
import { StoryInput } from "./StoryInput"
import { ActiveCompContext, ActiveCompContextValues, gls } from "@/app/_layout"
import { useAppTheme } from "@/hooks/useAppTheme";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { StoryDateSelect } from "./StoryDateSelect";
import { useCreateStoryContext } from "@/contexts/CreateStoryContext";
import { CompTab } from "./CompTab";
import { createStory } from "@/utils/transformUtils"
import { useSQLiteContext } from "expo-sqlite";
import { getTodayString } from "@/utils/dateUtils"
import { useRouter } from "expo-router";



export function CreateStorySxn() {

    console.log("rendering CreateStorySxn")

    const db = useSQLiteContext()
    const router = useRouter()
    const {theme, thmStyle} = useAppTheme()
    const {activeComp, setActiveComp} = React.useContext(ActiveCompContext) as ActiveCompContextValues

    const [disabled, setDisabled] = React.useState(true)
    const [isTransforming, setIsTransforming] = React.useState(false)
    const {storyText, setStoryText, storyDate, setStoryDate} = useCreateStoryContext()

    const transformFn = React.useCallback(async () => {
        setIsTransforming(true)
        setDisabled(true)
        const id = await createStory(db, storyText, storyDate)
        setStoryText("")
        setStoryDate(getTodayString())
        router.navigate(`/newStory?id=${id}`)
        setActiveComp(null)
        setIsTransforming(false)
    }, [storyText, storyDate])

    React.useEffect(() => {
    
        storyText.length > 0 && disabled && setDisabled(false);
        storyText.length == 0 && !disabled && setDisabled(true);
    
    }, [storyText])

    return (
            <Animated.View 
            layout={LinearTransition.duration(250)}
            entering={FadeIn.duration(250)}
            exiting={FadeOut.duration(250)}
            style={[gls.f1, gls.shrink, gls.width100, thmStyle.bgSurface, {justifyContent: "space-evenly", maxHeight: "50%", paddingTop: 10, gap: 10}]}
            >
                <View>
                    <ThemedText type='title'>{isTransforming ? "Transforming your story..." : "What happened today?"}</ThemedText>
                    {!isTransforming && <ThemedText type="small" style={{color: theme.onSurfaceWeak}}>Jot down something you experienced</ThemedText>}
                </View>
                <StoryInput isTransforming={isTransforming} />
                {activeComp && <StoryDateSelect />}
                <TransformBtn isTransforming={isTransforming} transformFn={transformFn} disabled={disabled} />
                {activeComp && Platform.OS == "ios" && <CompTab />}
                
            </Animated.View>
    )




}