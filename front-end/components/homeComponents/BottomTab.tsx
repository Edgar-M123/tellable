import { gls, useActiveCompContext } from "@/app/_layout";
import { Pressable, TextInput, View } from "react-native";
import { ThemedText } from "../ThemedText";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAppTheme } from "@/hooks/useAppTheme";
import React, { RefObject } from "react";
import Animated, { FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";


export function BottomTab(props: {searchRef: RefObject<TextInput>}) {

    console.log("Rendering BottomTab")

    const {theme, thmStyle} = useAppTheme()
    const router = useRouter()

    const goToLibrary = React.useCallback(() => {router.push("/library")}, [])

    return (
        <Animated.View entering={FadeIn.duration(250)} style={[gls.width100, gls.rows, gls.centerAll, {position: "relative", zIndex: 999, bottom: 0}]}>

            <View style={[gls.f1, gls.centerAll]}>
                <Pressable style={[gls.circle, gls.centerAll, {borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5, borderColor: theme.accent}]}>
                    <ThemedText style={{color: theme.accent}}>Get Pro</ThemedText>
                </Pressable>
            </View>

            <View style={[gls.f1, gls.centerAll]}>
                <Pressable 
                style={({pressed}) => [gls.circle, thmStyle.bgPrimary, gls.centerAll, {aspectRatio: 1, padding: 15}, pressed && thmStyle.bgPrimaryHover]}
                onPress={() => props.searchRef.current?.focus()}
                >
                    <FontAwesome name="search" size={18} color={theme.onPrimary} />
                </Pressable>
            </View>

            <View style={[gls.f1, gls.centerAll]}>
                <Pressable
                style={({pressed}) => [gls.circle, gls.centerAll, {padding: 10}, pressed && {backgroundColor: theme.surfaceHover}]}
                onPress={goToLibrary}
                >
                    <MaterialCommunityIcons name="library" size={18} color={theme.onSurface} />
                    <ThemedText type="small">Library</ThemedText>
                </Pressable>
            </View>

        </Animated.View>
    )
}