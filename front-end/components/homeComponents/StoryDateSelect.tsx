
import { ActiveCompContext, ActiveCompContextValues, gls } from "@/app/_layout";
import { Pressable, StyleSheet, View, TouchableWithoutFeedback } from "react-native"
import { ThemedText } from "../ThemedText";
import { useAppTheme } from "@/hooks/useAppTheme";
import React, { Dispatch, SetStateAction } from "react";
import Animated, { LinearTransition, FadeIn, FadeOut } from "react-native-reanimated";
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import { OverKeyboardView } from "react-native-keyboard-controller";
import {GestureHandlerRootView, TouchableOpacity} from 'react-native-gesture-handler'
import { Calendar } from "react-native-calendars";

export function StoryDateSelect(props: {date: string}) {

    const {theme, thmStyle} = useAppTheme()
    const router = useRouter()

    return (
        <Animated.View 
        layout={LinearTransition.duration(250)}
        entering={FadeIn.duration(250)}
        exiting={FadeOut.duration(250)}
        style={[gls.width100]}>

            <ThemedText type="small" style={{color: theme.onSurfaceWeak}}>What day?</ThemedText>

            <View style={[gls.rows, gls.width100, gls.br, styles.dateContainer, {alignItems: "center", borderColor: theme.surfaceContainer}]}>

                <Feather name="calendar" size={16} color={theme.onSurfaceWeakest} />
                
                {/* data picker here */}
                <Pressable
                style={({pressed}) => [gls.f1, {justifyContent: 'center'}, pressed && {backgroundColor: theme.surfaceHover}]}
                onPress={() => {router.navigate("/calendar")}}
                >
                    <ThemedText>{props.date}</ThemedText>
                </Pressable>

                <Pressable style={[gls.circle, styles.btn, thmStyle.bgSurfaceContainer]}>
                    <ThemedText type="small" style={{color: theme.onSurfaceWeakest}}>Today</ThemedText>
                </Pressable>
                <Pressable style={[gls.circle, styles.btn, thmStyle.bgSurfaceContainer]}>
                    <ThemedText type="small" style={{color: theme.onSurfaceWeakest}}>Yesterday</ThemedText>
                </Pressable>

            </View>

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