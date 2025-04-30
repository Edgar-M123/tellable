import React, { memo } from "react";
import { gls, useActiveCompContext } from "@/app/_layout";
import { useAppTheme } from "@/hooks/useAppTheme";
import { View, Text, StyleSheet, Pressable } from "react-native"
import { StoryPreview } from "@/typing/appTypes";
import { ThemedText } from "../ThemedText";
import { useRouter } from "expo-router";


export const StoryPreviewComp = memo(function StoryPreviewComp(props: {data: StoryPreview}) {

    console.log("rendering StoryPreviewComponent id: ", props.data.id)

    const {theme} = useAppTheme()
    const router = useRouter()
    const {activeComp} = useActiveCompContext()
    
    const goToStory = React.useCallback(() => {router.push(`/newStory?id=${props.data.id}`)}, [])

    
    return (
        <Pressable 
        style={({pressed}) => [
            gls.width100, gls.br, styles.container, {borderColor: theme.surfaceContainer},
            pressed && {backgroundColor: theme.surfaceHover}  
        ]}
        onPress={goToStory}
        >

            <ThemedText type="bold" numberOfLines={activeComp == "search" ? 0 : 1}>{props.data.title}</ThemedText>
            <ThemedText style={{color: theme.onSurfaceWeak}} type="small">{props.data.date}</ThemedText>


        </Pressable>
    )
})

const styles = StyleSheet.create({
    
    container: {
        borderWidth: 1,
        padding: 10,
    },

})