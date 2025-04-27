import React from "react";
import { gls } from "@/app/_layout";
import { useAppTheme } from "@/hooks/useAppTheme";
import { memo } from "react";
import { Pressable, StyleSheet, View, FlatList } from "react-native";
import { ThemedText } from "../ThemedText";
import AntDesign from '@expo/vector-icons/AntDesign';
import { TagColor, TagColors } from "@/constants/Colors";

const TagComp = memo(function TagComp(props: {text: string, colorScheme: TagColor}) {

    return (
        <View 
        style={[gls.circle, styles.addTagBtn, {backgroundColor: props.colorScheme.bg}]}
        >
            <ThemedText type="small" style={{fontSize: 12, color: props.colorScheme.text}}>{props.text}</ThemedText>
        </View>

    )
})


export const StoryTags = memo(function StoryTags(props: {tags: string[]}) {

    const {theme} = useAppTheme()

    const openTags = React.useCallback(() => {}, [])

    return (
        <View style={[gls.rows, styles.container]}>
            
            <Pressable 
            style={({pressed}) => [gls.circle, styles.addTagBtn, {backgroundColor: pressed ? theme.surfaceContainerHover : theme.surfaceContainer}]}
            onPress={openTags}
            >
                <ThemedText type="small" style={{color: theme.onSurfaceWeakest}}>+ tag</ThemedText>
            </Pressable>

            <View style={[{height: 30, width: StyleSheet.hairlineWidth, backgroundColor: theme.secondary}]}/>

            {/* current tags */}
            <FlatList 
            data={props.tags}
            renderItem={({item}) => <TagComp text={item} colorScheme={TagColors[item]} />}
            horizontal={true}
            contentContainerStyle={{gap: 5}}
            showsHorizontalScrollIndicator={false}
            />


        </View>
    )
})


const styles = StyleSheet.create({
    container: {
        gap: 10, 
        alignItems: 'center', 
        justifyContent: 'flex-end',
    },
    addTagBtn: {
        paddingVertical: 5, 
        paddingHorizontal: 10,
    },
})