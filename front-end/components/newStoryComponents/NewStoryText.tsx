import { View } from "react-native"
import { ThemedText } from "../ThemedText"
import { useAppTheme } from "@/hooks/useAppTheme";
import { StoryRaw } from "@/typing/appTypes";
import { gls } from "@/app/_layout";


function TextLoaded(props: {text: string}) {

    const {theme} = useAppTheme()
    
    return (
        
        <View style={[gls.f1, gls.width100]}>
            <ThemedText >{props.text}</ThemedText>
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


export function NewStoryText(props: {showText: "transformed" | "original" , storyData: StoryRaw | null}) {

    if (props.storyData) {
        return <TextLoaded text={props.showText == "transformed" ? props.storyData.storyText : props.storyData.origNotes} />
    }

    return <TextPlaceholder />

}