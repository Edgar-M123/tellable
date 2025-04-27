import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { gls } from './_layout';
import { useAppTheme } from '@/hooks/useAppTheme';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Story, StoryRaw } from '@/typing/appTypes';
import { NewStoryTitle } from '@/components/newStoryComponents/NewStoryTitle';
import { NewStoryText } from '@/components/newStoryComponents/NewStoryText';
import { useSQLiteContext } from 'expo-sqlite';
import { getStoryAsync, saveStoryAsync } from '@/utils/dbUtils';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { StorytellingTips } from '@/components/newStoryComponents/StorytellingTips';



export default function NewStoryPage() {
  
    const db = useSQLiteContext()
    const {theme, thmStyle} = useAppTheme()
    const [newStoryData, setNewStoryData] = React.useState<Story | null>(null)
    const {id} = useLocalSearchParams<{id: string}>()
    const [storyType, setStoryType] = React.useState<"transformed" | "original">("transformed")

    const fetchStory = React.useCallback(async () => {

        console.log("Fetching story")
        const storyData = await getStoryAsync(db, id)
        setNewStoryData(storyData)

    }, [])

    const showTransformed = React.useCallback(() => {setStoryType("transformed")}, [])
    const showOriginal = React.useCallback(() => {setStoryType("original")}, [])

    useFocusEffect(React.useCallback(() => {

        console.log("Running new story effect")
        setTimeout(fetchStory, 50)

    }, []))


    return (
        <SafeAreaView style={[gls.f1, gls.height100, gls.width100]} edges={Platform.select({ios: ["bottom"], android: []})}>
            <Animated.View 
            layout={LinearTransition.duration(250)}
            style={[gls.f1, gls.height100, gls.width100, thmStyle.bgSurface, {alignItems: "center", padding: 14, paddingBottom: 30, gap: 10}]}
            >

                <NewStoryTitle storyData={newStoryData} />

                <View style={[{height: 2}]} />

                <View style={[gls.shrink, gls.rows, {alignSelf: "flex-start", gap: 10}]}>
                    
                    <Pressable 
                    style={[gls.centerAll, styles.storyBtn, gls.circle, storyType == "transformed" && {backgroundColor: theme.primaryContainer}]}
                    onPress={showTransformed}
                    >
                        <ThemedText 
                        type={storyType == "transformed" ? 'smallBold' : "small"} 
                        style={[{color: storyType == "transformed" ? theme.primary : theme.onSurfaceWeakest }]}
                        >
                            Transformed
                        </ThemedText>
                    </Pressable>

                    <Pressable
                    style={[gls.centerAll, styles.storyBtn, gls.circle, storyType == "original" && {backgroundColor: theme.primaryContainer}]}
                    onPress={showOriginal}
                    >
                        <ThemedText 
                        type={storyType == "original" ? 'smallBold' : "small"} 
                        style={[{color: storyType == "original" ? theme.primary : theme.onSurfaceWeakest }]}
                        >
                            Original
                        </ThemedText>
                    </Pressable>
                </View>

                <NewStoryText showText={storyType} storyData={newStoryData} />

                {storyType == "transformed" && newStoryData && (
                    <StorytellingTips text={"Test text"} />
                )}

            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    storyBtn: {
        paddingVertical: 5,
        paddingHorizontal: 10,
    }
})