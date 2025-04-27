import React from "react";
import { ScrollView, StyleSheet, View, Pressable } from "react-native"
import { ThemedText } from "../ThemedText"
import { useAppTheme } from "@/hooks/useAppTheme";
import { StoryRaw } from "@/typing/appTypes";
import { gls } from "@/app/_layout";
import Animated, { LinearTransition } from "react-native-reanimated";
import * as Clipboard from 'expo-clipboard';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


function TextLoaded(props: {text: string}) {

    const {theme, thmStyle} = useAppTheme()

    const copyFn = React.useCallback(() => {Clipboard.setStringAsync(props.text)}, [props.text])
    
    return (
        <Animated.View
        layout={LinearTransition.duration(250)} 
        style={[gls.f1, gls.br, styles.container, thmStyle.bgSurface, {borderColor: theme.secondary, zIndex: 10}]}
        >
            <ScrollView 
            style={[gls.f1, gls.width100]}
            >
                <ThemedText >{props.text}</ThemedText>
            </ScrollView>

            <Animated.View 
            layout={LinearTransition.duration(250)}
            style={[gls.rows, {justifyContent: "flex-end"}]}
            >
                <Pressable
                style={({pressed}) => [gls.circle, {padding: 5}, pressed && {backgroundColor: theme.surfaceHover}]}
                onPress={copyFn}
                >
                    <FontAwesome6 name="copy" size={16} color={theme.onSurfaceWeak} />
                </Pressable>

            </Animated.View>

        </Animated.View>

)

}

function TextPlaceholder() {
    
    const {theme} = useAppTheme()

    return (
        <View style={[gls.width100, gls.br, styles.container, {borderColor: theme.secondary}]}>
            <ThemedText style={{color: theme.onSurfaceWeakest}}>Loading your story...</ThemedText>
        </View>
    )
}


export function NewStoryText(props: {showText: "transformed" | "original" , storyData: StoryRaw | null}) {

    if (props.storyData) {
        return <TextLoaded text={props.showText == "transformed" ? props.storyData.storyText : props.storyData.origNotes} />
    }

    return <TextPlaceholder />

}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        padding: 14,
        flexShrink: 1
    }
})