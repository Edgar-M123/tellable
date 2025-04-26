import { TextInput, StyleSheet, TouchableWithoutFeedback, BackHandler, Keyboard, View, Pressable } from "react-native"
import { ActiveCompContext, ActiveCompContextValues, gls, useActiveCompContext } from "@/app/_layout"
import { useAppTheme } from "@/hooks/useAppTheme";
import React, { SetStateAction, Dispatch } from "react";
import { KeyboardEvents } from "react-native-keyboard-controller";
import Animated, {useAnimatedStyle, interpolateColor, useSharedValue, withTiming, LinearTransition} from "react-native-reanimated";
import { useCreateStoryContext } from "@/contexts/CreateStoryContext";
import { ThemedText } from "../ThemedText";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';

export function StoryInput(props: {isTransforming: boolean}) {

    console.log("rendering StoryInput")

    const {theme, thmStyle} = useAppTheme()
    const storyTIRef = React.useRef<TextInput>(null)
    const {setActiveComp, showCalendar} = useActiveCompContext()
    const {storyText, setStoryText} = useCreateStoryContext()
    const [focused, setFocused] = React.useState(false)

    const [tiHeight, setTIHeight] = React.useState(100)
    
    const activate = React.useCallback(() => {
      setFocused(true)
      setActiveComp("story")
    }, [])

    const deactivate = React.useCallback(() => {
      setFocused(false)
      !props.isTransforming && setActiveComp(null)
    }, [props.isTransforming])

    const clearText = React.useCallback(() => {
      storyTIRef.current?.clear();
      setStoryText("")
    }, [])


    function changeTIHeight(newHeight: number) {
      newHeight > tiHeight && setTIHeight(newHeight);

      if ((tiHeight > 100) && newHeight < 100) {
        setTIHeight(100)
      }
    }

    React.useEffect(() => {
        const show = KeyboardEvents.addListener("keyboardWillHide", (e) => {
          !showCalendar && storyTIRef.current?.blur()
        });
      
        return () => {
          show.remove();
        };
    }, [showCalendar]);
      
    // React.useEffect(() => {
        
    //   const backBehavior = () => {
    //     Keyboard.dismiss()
    //     return true
    //   }

    //   const subscription = BackHandler.addEventListener(
    //     'hardwareBackPress',
    //     backBehavior
    //   )
      
    //   return () => subscription.remove()

    // }, [])

    return (
      <TouchableWithoutFeedback onPress={() => storyTIRef.current?.focus()}>
        <Animated.View
        layout={LinearTransition.duration(250)} 
        style={[
          gls.shrink, gls.br, gls.width100, styles.inputContainer, 
          {borderColor: theme.secondary}, focused && {borderColor: theme.primary}
        ]}
        >
          <TextInput
          ref={storyTIRef}
          style={[gls.width100, gls.shrink, gls.fntFam, {maxHeight: "100%", height: tiHeight, color: theme.onSurface}]}
          placeholder='Example: Met someone interesting at the coffee shop today. They spilled their drink on me...'
          placeholderTextColor={theme.onSurfaceWeakest}
          defaultValue={storyText}
          onChangeText={(text) => setStoryText(text)}
          textAlignVertical="top"
          multiline={true}
          onFocus={activate}
          onBlur={deactivate}
          onContentSizeChange={({nativeEvent}) => changeTIHeight(nativeEvent.contentSize.height)}
          editable={!props.isTransforming}
          />
          {!props.isTransforming && (
            <View style={[gls.width100, gls.rows, {paddingTop: 5}]}>
              <Pressable 
              style={({pressed}) => [gls.rows, gls.circle, gls.centerAll, styles.clearBtn, pressed && thmStyle.bgSurfaceHover]}
              onPress={clearText}
              >
                <Fontisto name="undo" size={14} style={{paddingBottom: 3}} color={theme.onSurfaceWeak} />
                <ThemedText type="small" style={{color: theme.onSurfaceWeak}}>Clear</ThemedText>
              </Pressable>
            </View>
          )}
        </Animated.View>
      </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({

  inputContainer: {
    padding: 10, 
    borderWidth: 1, 
    minHeight: 100,
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5
  }

})