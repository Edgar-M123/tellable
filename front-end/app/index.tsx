import React from 'react';
import { FlatList, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { gls } from './_layout';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ThemedText } from '@/components/ThemedText';
import SearchBar from '@/components/homeComponents/SearchBar';
import { testStoryPreviewData } from '@/testing/testData/homeScreenData';
import { StoryPreviewComp } from '@/components/homeComponents/StoryPreviewComp';
import { HomeDivider } from '@/components/homeComponents/HomeDivider';
import { CreateStorySxn } from '@/components/homeComponents/CreateStorySxn';
import { ActiveCompContext, ActiveCompContextValues } from './_layout';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { BottomTab } from '@/components/homeComponents/BottomTab';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StoryPreview } from '@/typing/appTypes';
import { useFocusEffect } from 'expo-router';
import { getStoryPreviewsAsync } from '@/utils/dbUtils';
import { useSQLiteContext } from 'expo-sqlite';



export default function HomeScreen() {
  
  const db = useSQLiteContext()
  const {theme, thmStyle} = useAppTheme()
  const {activeComp, setActiveComp} = React.useContext(ActiveCompContext) as ActiveCompContextValues
  const searchTIRef = React.useRef<TextInput>(null)
  const [recentStories, setRecentStories] = React.useState<StoryPreview[] | null>(null)

  const fetchRecent = React.useCallback(async () => {
    
    const previews = await getStoryPreviewsAsync(db, 2)
    setRecentStories(previews)

  }, [])

  useFocusEffect(React.useCallback(() => fetchRecent, []))

  return (
    <SafeAreaView style={[gls.f1, gls.height100, gls.width100]} edges={Platform.select({ios: ["bottom"], android: []})}>
      <Animated.View 
      layout={LinearTransition.duration(250)}
      style={[gls.f1, gls.height100, gls.width100, thmStyle.bgSurface, {alignItems: "center", padding: 14}]}
      >
        {activeComp !== "story" && (
          <Animated.View 
          layout={LinearTransition.duration(250)}
          entering={FadeIn.duration(250)} 
          exiting={FadeOut.duration(250)} 
          style={[gls.width100, {alignItems: "center"}]}
          >
            <View style={[gls.width100, {paddingVertical: 10}]}>
              <ThemedText style={{color: theme.onSurfaceWeak}}>Find your stories</ThemedText>
            </View>

            <SearchBar ref={searchTIRef} />

            <View style={[gls.width100, {paddingVertical: 10}]}>
              <ThemedText style={{color: theme.onSurfaceWeak}}>Recent</ThemedText>
              <FlatList
              data={recentStories}
              renderItem={({item}) => <StoryPreviewComp data={item}/>}
              contentContainerStyle={{gap: 10}}
              />
            </View>
          </Animated.View>
        )}

        {activeComp == null && (
          <HomeDivider />
        )}

        {activeComp != "search" && (
            <CreateStorySxn  />
        )}

        {activeComp == null && (
          <BottomTab searchRef={searchTIRef} />
        )}
      
      </Animated.View>
    </SafeAreaView>
  );
}
