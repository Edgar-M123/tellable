import React from 'react';
import { FlatList, Platform, } from 'react-native';

import { gls } from './_layout';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ActiveCompContext, ActiveCompContextValues } from './_layout';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { BottomTab } from '@/components/homeComponents/BottomTab';
import { CreateStoryContext, CreateStoryContextProvider, CreateStoryContextValues } from '@/contexts/CreateStoryContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StoryRaw } from '@/typing/appTypes';
import { NewStoryTitle } from '@/components/newStoryComponents/NewStoryTitle';
import { NewStoryText } from '@/components/newStoryComponents/NewStoryText';
import { transformStoryFn } from '@/utils/transformUtils';
import { useSQLiteContext } from 'expo-sqlite';
import { saveStoryAsync } from '@/utils/dbUtils';
import { useLocalSearchParams } from 'expo-router';



export default function NewStoryPage() {
  
    const db = useSQLiteContext()
    const {theme, thmStyle} = useAppTheme()
    const [newStoryData, setNewStoryData] = React.useState<StoryRaw | null>(null)
    const {text, date} = useLocalSearchParams<{text: string, date: string}>()

    const createStory = React.useCallback(async () => {

        console.log("Creating story")
        const storyRaw = await transformStoryFn(db, text, date)
        await saveStoryAsync(db, storyRaw)
        setNewStoryData(storyRaw)

    }, [])

    React.useEffect(() => {

        console.log("Running new story effect")
        createStory()

    }, [])


    return (
        <SafeAreaView style={[gls.f1, gls.height100, gls.width100]} edges={Platform.select({ios: ["bottom"], android: []})}>
        <Animated.View 
        layout={LinearTransition.duration(250)}
        style={[gls.f1, gls.height100, gls.width100, thmStyle.bgSurface, {alignItems: "center", padding: 14}]}
        >

            <NewStoryTitle storyData={newStoryData} />

            <NewStoryText storyData={newStoryData} />
        
        </Animated.View>
        </SafeAreaView>
    );
}
