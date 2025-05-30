import { useAppTheme } from "@/hooks/useAppTheme";
import { View, TextInput, StyleSheet } from "react-native"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { gls } from "@/app/_layout";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import React, { ForwardedRef, forwardRef, RefObject} from "react";
import { KeyboardEvents } from "react-native-keyboard-controller";
import { ActiveCompContext, ActiveCompContextValues } from "@/app/_layout";
import { searchStories } from "@/utils/dbUtils";
import { useSQLiteContext } from "expo-sqlite";



const SearchBar = forwardRef((props: {searchFn: (text: string) => void}, ref: ForwardedRef<TextInput>) => {

    console.log("Rendering SearchBar")
    const refTI = ref as RefObject<TextInput>
    
    const {theme} = useAppTheme()
    const {setActiveComp} = React.useContext(ActiveCompContext) as ActiveCompContextValues
    const [text, setText] = React.useState("")

    const activeProg = useSharedValue(0)
    const activeStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            activeProg.value,
            [0, 1],
            [theme.surfaceContainer, theme.surface],
        ),
        borderColor: interpolateColor(
            activeProg.value,
            [0, 1],
            [theme.surfaceContainer, theme.primary]
        ),
    }))
    
    const activate = React.useCallback(() => {
        activeProg.value = withTiming(1, {duration: 250})
        setActiveComp("search")
        props.searchFn(text)
    }, [])
    
    const deactivate = React.useCallback(() => {
        if (text == "") {
            activeProg.value = withTiming(0, {duration: 250})
            setActiveComp(null)
        }
    }, [text])

    React.useEffect(() => {
        const show = KeyboardEvents.addListener("keyboardWillHide", (e) => {
            refTI.current?.isFocused() && refTI.current?.blur()
        });
        
        return () => {
            show.remove();
        };
        
    }, []);
    
    return (
        <Animated.View style={[gls.width100, gls.rows, gls.br, styles.container, activeStyle]}>
            <FontAwesome name="search" size={16} style={{padding: 0, margin: 0}} color={theme.onSurfaceWeak} />
            <TextInput
            ref={refTI}
            style={[gls.f1, styles.input, {color: theme.onSurface}]}
            placeholder='search for keywords, dates, emotions...'
            placeholderTextColor={theme.onSurfaceWeakest}
            defaultValue={text}
            onFocus={activate}
            onBlur={deactivate}
            onChangeText={(text) => {setText(text); props.searchFn(text)}}
            />
      </Animated.View>
    )
})

export default SearchBar

const styles = StyleSheet.create({
    container: {
        borderWidth: 1, 
        alignItems: "center", 
        paddingHorizontal: 10, 
        gap: 10
    },
    input: {
        paddingVertical: 10, 
        fontFamily: "Merriweather-Regular",
    }
})