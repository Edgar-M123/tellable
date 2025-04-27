import { View } from "react-native"
import { ThemedText } from "../ThemedText"
import { useAppTheme } from "@/hooks/useAppTheme";
import { Story, StoryRaw } from "@/typing/appTypes";
import { gls } from "@/app/_layout";
import { StoryTags } from "./StoryTags";

const testTags = ["Funny", "Surprising", "Work"]

function TitleLoaded(props: {storyData: Story}) {

    const {theme} = useAppTheme()
    
    return (
        
        <View style={[gls.width100, {alignItems: "flex-start"}]}>
            <ThemedText type='title'>{props.storyData.title}</ThemedText>

            <View style={[{gap: 10}]}>
                <ThemedText type="small" style={[{color: theme.onSurfaceWeak}]}>{props.storyData.date}</ThemedText>

                {/* tags */}
                <StoryTags tags={testTags} />

            </View>

        </View>

)

}

function TitlePlaceholder() {
    
    const {theme} = useAppTheme()

    return (
        <View>
            <ThemedText type="title" style={{color: theme.onSurfaceWeakest}}>Getting your story...</ThemedText>
        </View>
    )
}


export function NewStoryTitle(props: {storyData: Story | null}) {

    if (props.storyData) {
        return <TitleLoaded storyData={props.storyData} />
    }

    return <TitlePlaceholder />

}