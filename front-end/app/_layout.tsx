import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/hooks/useAppTheme';
import {KeyboardProvider} from 'react-native-keyboard-controller'

export const ActiveCompContext = React.createContext({})

export interface ActiveCompContextValues {
  activeComp: "story" | "search" | null;
  setActiveComp:React.Dispatch<React.SetStateAction<"story" | "search" | null>>;
}

export function ActiveCompContextProvider(props: {children: any}) {

  const [activeComp, setActiveComp] = React.useState<"story" | "search" | null>(null)

  return (
    <ActiveCompContext.Provider value={{activeComp, setActiveComp}}>
      {props.children}
    </ActiveCompContext.Provider>
  )
}


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const {theme} = useAppTheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <KeyboardProvider>
        <ActiveCompContextProvider>
          <Stack
          screenOptions={{
            headerTitle: () => <View><ThemedText type='title' style={{color: theme.primary, fontSize: 20}}>'tellable'</ThemedText></View>,
            headerStyle: {backgroundColor: theme.surface},
            headerShadowVisible: false
          }}
          />
          <StatusBar style="auto" backgroundColor={theme.surface} />
        </ActiveCompContextProvider>
      </KeyboardProvider>
    </ThemeProvider>
  );
}

export const gls = StyleSheet.create({
  f1: {
    flex: 1
  },
  fntFam: {
    fontFamily: "Merriweather-Regular"
  },
  fntFamBold: {
    fontFamily: "Merriweather-Bold"
  },
  rows: {
    flexDirection: "row"
  },
  e5: {
    elevation: 5,
  },
  centerAll: {
    alignItems: "center",
    justifyContent: "center"
  },
  height100: {
    height: "100%",
    minHeight: "100%",
    maxHeight: "100%",
  },
  width100: {
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
  },
  br: {
    borderRadius: 10
  },
  circle: {
    borderRadius: 9999
  },
  shrink: {
    flexShrink: 1
  },
  blkBorder: {
    borderWidth: 1,
    borderColor: "black"
  },
  whBorder: {
    borderWidth: 1,
    borderColor: "white"
  }
})
