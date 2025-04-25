
import Animated, {FadeIn, FadeOut, LinearTransition} from "react-native-reanimated"
import { ThemedText } from "../ThemedText"
import SearchBar from "./SearchBar"
import { gls, useActiveCompContext } from "@/app/_layout"
import { FlatList, Platform, StyleSheet } from "react-native"
import { useAppTheme } from "@/hooks/useAppTheme";
import { CompTab } from "./CompTab"
import { StoryPreviewComp } from "./StoryPreviewComp"
import { StoryPreview } from "@/typing/appTypes";

function EmptyListComp() {

    const {theme} = useAppTheme()

    return (
        <ThemedText type='small' 
        style={[gls.width100, {color: theme.onSurfaceWeakest, textAlign: "center"}]}
        >
            No stories yet. Add one below!
        </ThemedText>
    )
}

export function PreviewList(props: {stories: StoryPreview[] | null}) {

    const {theme} = useAppTheme()
    const {activeComp} = useActiveCompContext()
    

    return (
        <Animated.View 
        layout={LinearTransition.duration(250)}
        style={[gls.width100, {paddingVertical: 10}]}
        >
            <ThemedText style={{color: theme.onSurfaceWeak}}>Recent</ThemedText>
            <FlatList
            data={props.stories}
            renderItem={({item}) => <StoryPreviewComp data={item}/>}
            contentContainerStyle={{gap: 10}}
            ListEmptyComponent={EmptyListComp}
            />
        </Animated.View>
    )
}