import { TextInput, StyleSheet, TouchableWithoutFeedback, View } from "react-native"
import { ActiveCompContext, ActiveCompContextValues, gls } from "@/app/_layout"
import { useAppTheme } from "@/hooks/useAppTheme";
import React, { SetStateAction, Dispatch } from "react";
import { KeyboardEvents } from "react-native-keyboard-controller";
import Animated, {useAnimatedStyle, interpolateColor, useSharedValue, withTiming} from "react-native-reanimated";

export function StoryInput(props: {setStoryText: Dispatch<SetStateAction<string>>}) {

    const {theme} = useAppTheme()
    const storyTIRef = React.useRef<TextInput>(null)
    const {activeComp, setActiveComp} = React.useContext(ActiveCompContext) as ActiveCompContextValues
    
    const activeProg = useSharedValue(0)

    const activeStyle = useAnimatedStyle(() => ({
      borderColor: interpolateColor(
        activeProg.value,
        [0, 1],
        [theme.secondary, theme.primary]
      ),
    }))
      
    const activate = React.useCallback(() => {
      activeProg.value = withTiming(1, {duration: 250})
      setActiveComp("story")
    }, [])
    const deactivate = React.useCallback(() => {
      activeProg.value = withTiming(0, {duration: 250})
      setActiveComp(null)
    }, [])

    React.useEffect(() => {
        const show = KeyboardEvents.addListener("keyboardWillHide", (e) => {
          storyTIRef.current?.blur()
        });
      
        return () => {
          show.remove();
        };
    }, []);
      
      



    return (
      <TouchableWithoutFeedback onPress={() => storyTIRef.current?.focus()}>
        <Animated.View 
        style={[gls.br, gls.width100, styles.storyTI, activeStyle]}
        >
          <TextInput
          ref={storyTIRef}
          style={[gls.width100, gls.fntFam, {color: theme.onSurface}]}
          placeholder='Example: Met someone interesting at the coffee shop today. They spilled their drink on me...'
          placeholderTextColor={theme.onSurfaceWeakest}
          onChangeText={(text) => props.setStoryText(text)}
          textAlignVertical="top"
          multiline={true}
          onFocus={activate}
          onBlur={deactivate}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({

  storyTI: {
    padding: 10, 
    borderWidth: 1, 
    minHeight: 100
  }

})