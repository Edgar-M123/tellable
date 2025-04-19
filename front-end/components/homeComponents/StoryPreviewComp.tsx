import React from "react";
import { gls } from "@/app/_layout";
import { useAppTheme } from "@/hooks/useAppTheme";
import { View, Text, StyleSheet } from "react-native"
import { StoryPreview } from "@/typing/appTypes";
import { ThemedText } from "../ThemedText";


export function StoryPreviewComp(props: {data: StoryPreview}) {

    const {theme, thmStyle} = useAppTheme()

    const styles = React.useMemo(() => StyleSheet.create({
        
        container: {
            borderWidth: 1,
            borderColor: theme.surfaceContainer,
            padding: 10,
        },
    
    }), [theme])


    return (
        <View style={[gls.width100, gls.br, styles.container]}>

            <ThemedText>{props.data.title}</ThemedText>
            <ThemedText style={{color: theme.onSurfaceWeak}} type="small">{props.data.date.toDateString()}</ThemedText>


        </View>
    )
}
