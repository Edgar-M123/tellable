import { View } from "react-native"
import { ThemedText } from "../ThemedText"
import { useAppTheme } from "@/hooks/useAppTheme";
import { StoryRaw } from "@/typing/appTypes";
import { gls } from "@/app/_layout";


function TextLoaded(props: {storyData: StoryRaw}) {

    const {theme} = useAppTheme()
    
    return (
        
        <View style={[gls.f1, gls.width100]}>
            <ThemedText >{props.storyData.storyText}</ThemedText>
        </View>

)

}

function TextPlaceholder() {
    
    const {theme} = useAppTheme()

    return (
        <View style={[gls.f1, gls.width100]}>
            <ThemedText style={{color: theme.onSurfaceWeakest}}>Creating your story for your next facetime...</ThemedText>
        </View>
    )
}


export function NewStoryText(props: {storyData: StoryRaw | null}) {

    if (props.storyData) {
        return <TextLoaded storyData={props.storyData} />
    }

    return <TextPlaceholder />

}