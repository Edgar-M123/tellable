
import { gls } from "@/app/_layout";
import { Pressable, StyleSheet, View } from "react-native"
import { ThemedText } from "../ThemedText";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import Animated, { LinearTransition, FadeIn, FadeOut } from "react-native-reanimated";
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import { useCreateStoryContext } from "@/contexts/CreateStoryContext";
import { getDateString, getTodayString, getYesterdayString } from "@/utils/dateUtils";

export function StoryDateSelect() {

    const {theme, thmStyle} = useAppTheme()
    const router = useRouter()
    const {storyDate, setStoryDate} = useCreateStoryContext()

    return (
        <Animated.View 
        layout={LinearTransition.duration(250)}
        entering={FadeIn.duration(250)}
        exiting={FadeOut.duration(250)}
        style={[gls.width100]}>

            <Pressable 
            style={({pressed}) => [gls.rows, gls.width100, gls.br, styles.dateContainer, {alignItems: "center", borderColor: theme.surfaceContainer},
                pressed && {backgroundColor: theme.surfaceHover}
            ]}
            onPress={() => {router.navigate("/calendar")}}
            >

                <Feather name="calendar" size={16} color={theme.onSurfaceWeakest} />
                
                {/* data picker here */}
                <View
                style={[gls.f1, {justifyContent: 'center'}]}
                >
                    <ThemedText>{storyDate}</ThemedText>
                </View>

                <Pressable 
                style={[gls.circle, styles.btn, thmStyle.bgSurfaceContainer, 
                    (storyDate == new Date().toJSON().slice(0, 10)) && {backgroundColor: theme.secondary}
                ]}
                onPress={() => setStoryDate(getTodayString())}
                >
                    <ThemedText 
                    type="small" 
                    style={[
                        {color: theme.onSurfaceWeakest},
                        (storyDate == getTodayString()) && {color: theme.onSurface}
                    ]}
                    >
                        Today
                    </ThemedText>
                </Pressable>

                <Pressable 
                style={[gls.circle, styles.btn, thmStyle.bgSurfaceContainer, 
                    (storyDate == getYesterdayString()) && {backgroundColor: theme.secondary}
                ]}
                onPress={() => setStoryDate(getYesterdayString())}
                >
                    <ThemedText 
                    type="small"
                    style={[
                        {color: theme.onSurfaceWeakest},
                        (storyDate == getYesterdayString()) && {color: theme.onSurface}
                    ]}
                    >
                        Yesterday
                    </ThemedText>
                </Pressable>

            </Pressable>

        </Animated.View>
    )
}

const styles = StyleSheet.create({
    btn: {
        paddingHorizontal: 10, 
        paddingVertical: 5,
        marginVertical: 5
    },
    dateContainer: {
        borderWidth: 1,
        paddingHorizontal: 5,
        gap: 5
    },
    fullScreen: {
        flex: 1,
        height: "100%",
        width: "100%",
    },
    container: {
        position: "absolute",
        height: "100%",
        width: "100%",
        backgroundColor: "red",
        alignItems: 'center',
        zIndex: 100,
    },
    background: {
        width: 200,
        height: 200,
        backgroundColor: "blue",
    },
    input: {
        backgroundColor: "yellow",
        width: 200,
        height: 50,
        alignSelf: "center",
        marginTop: 150,
    },
})