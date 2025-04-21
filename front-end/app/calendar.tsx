
import { BackHandler, TouchableWithoutFeedback, Pressable } from "react-native"
import { ActiveCompContext, ActiveCompContextValues, gls } from "./_layout";
import {Calendar} from 'react-native-calendars';
import { KeyboardAvoidingView, } from "react-native-keyboard-controller";
import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import Animated, {useSharedValue, useAnimatedStyle, interpolateColor, interpolate, withTiming} from "react-native-reanimated";
import { AnimThemedText } from "@/components/ThemedText";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function CalendarModal() {

    const router = useRouter()
    const [disabled, setDisabled] = React.useState(true)
    const {theme, thmStyle} = useAppTheme()
    const {setShowCalendar} = React.useContext(ActiveCompContext) as ActiveCompContextValues

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

        disabled
        ? activeProg.value = withTiming(0, {duration: 250})
        : activeProg.value = withTiming(1, {duration: 250})

    }, [disabled])

    useFocusEffect(() => {

        setShowCalendar(true)

        return () => {
            setShowCalendar(false)
        }
    })

    

    return (
        <TouchableWithoutFeedback
        onPress={() => router.dismiss()}
        >
            <KeyboardAvoidingView
            style={[gls.f1, gls.width100, gls.centerAll, {gap: 10, backgroundColor: "rgba(0,0,0, 0.7)",}]}
            behavior="padding"
            keyboardVerticalOffset={-50}
            >

                <Calendar
                style={[gls.br, {minWidth: "80%"}]}
                theme={{
                    calendarBackground: theme.surfaceContainer,
                    selectedDotColor: theme.accent

                }}
                />

                <Animated.View
                style={[activeBtn, gls.centerAll, gls.br, {overflow: 'hidden'}]}
                >
                    <Pressable 
                    style={({pressed}) => [gls.centerAll, {padding: 10}, pressed && [thmStyle.bgPrimaryHover]]}
                    disabled={disabled}
                    >
                        <AnimThemedText style={[activeText]}>Save</AnimThemedText>
                    </Pressable>
                </Animated.View>

            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}