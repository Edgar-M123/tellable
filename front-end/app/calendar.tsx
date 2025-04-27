
import { View, TouchableWithoutFeedback, Pressable } from "react-native"
import { ActiveCompContext, ActiveCompContextValues, gls } from "./_layout";
import {Calendar, DateData} from 'react-native-calendars';
import { KeyboardAvoidingView, } from "react-native-keyboard-controller";
import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import Animated, {useSharedValue, useAnimatedStyle, interpolateColor, interpolate, withTiming} from "react-native-reanimated";
import { AnimThemedText, ThemedText } from "@/components/ThemedText";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useCreateStoryContext } from "@/contexts/CreateStoryContext";

export default function CalendarModal() {

    const router = useRouter()
    const [disabled, setDisabled] = React.useState(true)
    const {theme, thmStyle} = useAppTheme()
    const {setShowCalendar} = React.useContext(ActiveCompContext) as ActiveCompContextValues
    const {storyDate, setStoryDate} = useCreateStoryContext()
    const [selectedDate, setSelectedDate] = React.useState(storyDate)

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
        selectedDate != storyDate && setDisabled(false)
        selectedDate == storyDate && setDisabled(true)
    }, [selectedDate])

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
        onPress={() => {setStoryDate(selectedDate); router.dismiss()}}
        >
            <KeyboardAvoidingView
            style={[gls.f1, gls.width100, gls.centerAll, {gap: 10, backgroundColor: "rgba(0,0,0, 0.7)",}]}
            behavior="padding"
            keyboardVerticalOffset={-50}
            >

                <View style={{minWidth: "80%", maxWidth: "80%", gap: 10}}>

                    <Calendar
                    style={[gls.br, gls.width100, {zIndex: 50}]}
                    theme={{
                        calendarBackground: theme.surfaceContainer,
                        selectedDayBackgroundColor: theme.primary,
                        selectedDayTextColor: theme.onSurface,
                        dayTextColor: theme.onSurfaceWeak,
                        arrowColor: theme.onSurface,
                        monthTextColor: theme.onSurface,
                        textDayFontFamily: "Merriweather-Regular",
                        textMonthFontFamily: "Merriweather-Regular",
                        textDayHeaderFontFamily: "Merriweather-Regular",
                        textDisabledColor: theme.onSurfaceWeakest,

                    }}
                    enableSwipeMonths={true}
                    onDayPress={(day: DateData) => {setSelectedDate(day.dateString)}}
                    markedDates={{
                        [selectedDate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                    }}
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
                            onPress={() => {setStoryDate(selectedDate); router.dismiss()}}
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