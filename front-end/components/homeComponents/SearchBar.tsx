import { useAppTheme } from "@/hooks/useAppTheme";
import { View, TextInput } from "react-native"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { gls } from "@/app/_layout";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import React from "react";
import { KeyboardEvents } from "react-native-keyboard-controller";
import { ActiveCompContext, ActiveCompContextValues } from "@/app/_layout";



export function SearchBar() {
    
    const {theme} = useAppTheme()
    const searchTIRef = React.useRef<TextInput>(null)
    const {activeComp, setActiveComp} = React.useContext(ActiveCompContext) as ActiveCompContextValues
    

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
    }, [])
    
    const deactivate = React.useCallback(() => {
        activeProg.value = withTiming(0, {duration: 250})
        setActiveComp(null)
    }, [])

    React.useEffect(() => {
        const show = KeyboardEvents.addListener("keyboardWillHide", (e) => {
            searchTIRef.current?.blur()
        });
        
        return () => {
            show.remove();
        };
    }, []);
    
    return (
        <Animated.View style={[gls.width100, gls.rows, gls.br, activeStyle, {borderWidth: 1, alignItems: "center", padding: 10, gap: 10}]}>
            <FontAwesome name="search" size={16} style={{padding: 0, margin: 0}} color={theme.onSurfaceWeak} />
            <TextInput
            ref={searchTIRef}
            style={[gls.width100, {fontFamily: "Merriweather-Regular", color: theme.onSurface}]}
            placeholder='search for keywords, dates, emotions...'
            placeholderTextColor={theme.onSurfaceWeakest}
            onFocus={activate}
            onBlur={deactivate}
            />
      </Animated.View>
    )
}