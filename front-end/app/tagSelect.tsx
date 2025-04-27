import { View, TouchableWithoutFeedback, Pressable, FlatList } from "react-native"
import { ActiveCompContext, ActiveCompContextValues, gls } from "./_layout";
import {Calendar, DateData} from 'react-native-calendars';
import { KeyboardAvoidingView, } from "react-native-keyboard-controller";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { memo } from "react";
import Animated, {useSharedValue, useAnimatedStyle, interpolateColor, interpolate, withTiming} from "react-native-reanimated";
import { AnimThemedText, ThemedText } from "@/components/ThemedText";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useSQLiteContext } from "expo-sqlite";
import { getTagsAsync, updateStoryTagsAsync } from "@/utils/dbUtils";
import { TagColor, TagColors } from "@/constants/Colors";
import { TagComp } from "@/components/newStoryComponents/StoryTags";
import AntDesign from '@expo/vector-icons/AntDesign';

const TagRow = memo(function TagRow(props: {unselectFn: () => void, selectFn: () => void, selected: boolean, text: string, colorScheme: TagColor}) {

    const {theme} = useAppTheme()

    return (
        <Pressable 
        style={[gls.width100, gls.rows, {paddingVertical: 10, gap: 10, alignItems: "center"}]}
        onPress={props.selected ? props.unselectFn : props.selectFn}
        >

            <View style={[gls.circle, gls.centerAll, {height: 20, width:20, borderWidth: 1, borderColor: props.selected ? "transparent" : theme.secondary}]}>
                {props.selected && (<AntDesign name="checkcircle" size={18} color={theme.accent} />)}
            </View>

            <TagComp text={props.text} colorScheme={props.colorScheme} />


        </Pressable>
    )


})

export default function TagSelectModal() {

    const db = useSQLiteContext()
    const router = useRouter()
    const {theme, thmStyle} = useAppTheme()

    const {id, currentTags} = useLocalSearchParams<{id: string, currentTags: string}>()
    const [allTags, setAllTags] = React.useState<string[]>([])
    const [selectedTags, setSelectedTags] = React.useState((JSON.parse(currentTags) as string[]))
    const [disabled, setDisabled] = React.useState(true)


    const fetchTags = React.useCallback(async () => {
        const tags = await getTagsAsync(db)
        setAllTags(tags)
    }, [])

    function selectTag(tag: string) {setSelectedTags([...selectedTags, tag])}
    function unselectTag(tag: string) {setSelectedTags(selectedTags.filter(selTag => selTag != tag))}

    const activeProg = useSharedValue(0)

    const activeBtn = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            activeProg.value,
            [0, 1],
            [theme.primaryDisabled, theme.primary]
        ),
        transform: [{scale: interpolate(activeProg.value, [0, 1], [0.95, 1])}]
    }))

    const activeText = useAnimatedStyle(() => ({
        color: interpolateColor(
            activeProg.value,
            [0, 1],
            [theme.onSurfaceWeakest, theme.onPrimary]
        ),
    }))

    React.useEffect(() => {
        selectedTags != JSON.parse(currentTags) && setDisabled(false)
        selectedTags == JSON.parse(currentTags) && setDisabled(true)
    }, [selectedTags])

    React.useEffect(() => {

        disabled
        ? activeProg.value = withTiming(0, {duration: 250})
        : activeProg.value = withTiming(1, {duration: 250})

    }, [disabled])

    useFocusEffect(React.useCallback(() => {fetchTags()}, []))

    return (
        <TouchableWithoutFeedback
        onPress={() => {router.dismiss()}}
        >
            <KeyboardAvoidingView
            style={[gls.f1, gls.width100, gls.centerAll, {gap: 10, backgroundColor: "rgba(0,0,0, 0.7)",}]}
            behavior="padding"
            keyboardVerticalOffset={-50}
            >

                <View style={{minWidth: "80%", maxWidth: "80%", gap: 10}}>

                    <FlatList
                    style={[gls.br, gls.width100, {zIndex: 50}]}
                    data={allTags}
                    renderItem={({item}) => 
                        <TagRow 
                        unselectFn={() => {unselectTag(item)}} 
                        selectFn={() => {selectTag(item)}} 
                        selected={selectedTags.includes(item)} 
                        text={item} colorScheme={TagColors[item]}
                        />
                    }
                    />

                    <View style={[gls.width100, gls.rows, {gap: 10, alignItems: 'center', justifyContent: "flex-end"}]}>
                        
                        <Pressable 
                        style={({pressed}) => [gls.br, gls.centerAll, {padding: 10}, pressed && [thmStyle.bgSurfaceHover]]}
                        onPress={() => router.dismiss()}
                        >
                            <ThemedText>Cancel</ThemedText>
                        </Pressable>
                        
                        <Animated.View
                        style={[activeBtn, gls.br, gls.centerAll, {overflow: 'hidden'}]}
                        >
                            <Pressable 
                            style={({pressed}) => [gls.centerAll, {padding: 10, paddingHorizontal: 15}, pressed && [thmStyle.bgPrimaryHover]]}
                            onPress={() => {updateStoryTagsAsync(db, id, selectedTags); router.dismiss()}}
                            disabled={disabled}
                            >
                                <AnimThemedText type={'bold'} style={[activeText]}>Save</AnimThemedText>
                            </Pressable>
                        </Animated.View>

                    </View>


                </View>


            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}