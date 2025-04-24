import { View } from "react-native"
import { ThemedText } from "../ThemedText"
import { useAppTheme } from "@/hooks/useAppTheme";
import { StoryRaw } from "@/typing/appTypes";


function TitleLoaded(props: {storyData: StoryRaw}) {

    const {theme} = useAppTheme()
    
    return (
        
        <View>
            <ThemedText type='title'>{props.storyData.title}</ThemedText>
            <ThemedText type="small" style={{color: theme.onSurfaceWeak}}>{props.storyData.date}</ThemedText>
        </View>

)

}

function TitlePlaceholder() {
    
    const {theme} = useAppTheme()

    return (
        <View>
            <ThemedText type="title" style={{color: theme.onSurfaceWeakest}}>Transforming your story...</ThemedText>
        </View>
    )
}


export function NewStoryTitle(props: {storyData: StoryRaw | null}) {

    if (props.storyData) {
        return <TitleLoaded storyData={props.storyData} />
    }

    return <TitlePlaceholder />

}