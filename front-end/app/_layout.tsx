import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/hooks/useAppTheme';
import {KeyboardProvider} from 'react-native-keyboard-controller'
import { CreateStoryContextProvider } from '@/contexts/CreateStoryContext';
import {SQLiteProvider} from 'expo-sqlite'
import { migrateDbIfNeeded } from '@/utils/dbUtils';

export const ActiveCompContext = React.createContext({})


export interface ActiveCompContextValues {
  activeComp: "story" | "search" | null;
  setActiveComp:React.Dispatch<React.SetStateAction<"story" | "search" | null>>;
  showCalendar: boolean;
  setShowCalendar:React.Dispatch<React.SetStateAction<boolean>>;
}

export function useActiveCompContext() {

  const context = React.useContext(ActiveCompContext) as ActiveCompContextValues

  return context
}

export function ActiveCompContextProvider(props: {children: any}) {

  const [activeComp, setActiveComp] = React.useState<"story" | "search" | null>(null)
  const [showCalendar, setShowCalendar] = React.useState(false)

  return (
    <ActiveCompContext.Provider value={{activeComp, setActiveComp, showCalendar, setShowCalendar}}>
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
          <CreateStoryContextProvider>
            <SQLiteProvider databaseName={'tellable.db'} onInit={migrateDbIfNeeded}>
              <Stack
              screenOptions={{
                headerTitle: () => <View><ThemedText type='title' style={{color: theme.primary, fontSize: 20}}>'tellable'</ThemedText></View>,
                headerStyle: {backgroundColor: theme.surface},
                headerShadowVisible: false
              }}
              >
                <Stack.Screen
                name='index'
                />
                <Stack.Screen
                name='newStory'
                />
                <Stack.Screen
                name='calendar'
                options={{
                  presentation: "transparentModal",
                  animation: "fade",
                  headerShown: false
                }}
                />
              </Stack>
              <StatusBar style="auto" backgroundColor={theme.surface} />
            </SQLiteProvider>
          </CreateStoryContextProvider>
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
