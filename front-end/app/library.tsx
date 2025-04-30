import React from "react";
import { SafeAreaView } from "react-native-safe-area-context"
import { gls } from "./_layout"
import { Platform, StyleSheet } from "react-native"
import { useAppTheme } from "@/hooks/useAppTheme";
import { PreviewList } from "@/components/homeComponents/PreviewList";
import { StoryPreview } from "@/typing/appTypes";
import { useFocusEffect } from "expo-router";
import { getStoryPreviewsAsync } from "@/utils/dbUtils";
import { useSQLiteContext } from "expo-sqlite";


export default function LibraryPage() {

    const db = useSQLiteContext()
    const {theme, thmStyle} = useAppTheme();
    const [storyList, setStoryList] = React.useState<StoryPreview[]>([])

    const fetchStories = React.useCallback(async () => {
        
        const previews = await getStoryPreviewsAsync(db)
        setStoryList(previews)
    
    }, [])

    useFocusEffect(React.useCallback(() => {
        fetchStories();
    }, []))

    return (

        <SafeAreaView 
        style={[gls.f1, gls.height100, gls.width100, thmStyle.bgSurface, styles.container]} 
        edges={Platform.select({ios: ["bottom"], android: []})}
        >
            <PreviewList stories={storyList} />
        </SafeAreaView>
    )

}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 14
  }
})