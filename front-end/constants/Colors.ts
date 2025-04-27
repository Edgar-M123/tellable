/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export interface TagColor {
  bg: string;
  text: string;
}

export const Colors = {
  light: {
    primary: 'hsl(225, 76%, 44%)',
    primaryDisabled: 'hsl(225, 76%, 92%)',
    primaryHover: 'hsl(225, 76%, 36%)',
    primaryContainer: 'hsl(225, 100%, 80%)',
    onPrimary: "hsl(225, 76%, 98%)",
    secondary: "hsl(220, 16%, 60%)",
    secondaryHover: "hsl(220, 16%, 42%)",
    onSecondary: "hsl(220, 16%, 98%)",
    surface: "hsl(225, 76%, 97%)",
    surfaceHover: "hsl(225, 76%, 90%)",
    onSurface: "hsl(215, 16%, 10%)",
    onSurfaceWeak: "hsl(215, 16%, 30%)",
    onSurfaceWeakest: "hsl(215, 16%, 50%)",
    surfaceContainer: "hsl(220, 33%, 85%)",
    surfaceContainerHover: "hsl(220, 33%, 89%)",
    accent: "hsl(10, 100%, 30%)",
    accentHover: "hsl(10, 100%, 22%)",
  },
  dark: {
    primary: 'hsl(225, 76%, 56%)',
    primaryDisabled: 'hsl(225, 76%, 8%)',
    primaryHover: 'hsl(225, 76%, 48%)',
    primaryContainer: 'hsl(225, 100%, 10%)',
    onPrimary: "hsl(225, 76%, 98%)",
    secondary: "hsl(220, 16%, 40%)",
    secondaryHover: "hsl(220, 16%, 58%)",
    onSecondary: "hsl(220, 16%, 2%)",
    surface: "hsl(225, 76%, 3%)",
    surfaceHover: "hsl(225, 76%, 10%)",
    onSurface: "hsl(215, 16%, 90%)",
    onSurfaceWeak: "hsl(215, 16%, 70%)",
    onSurfaceWeakest: "hsl(215, 16%, 50%)",
    surfaceContainer: "hsl(220, 33%, 15%)",
    surfaceContainerHover: "hsl(220, 33%, 11%)",
    accent: "hsl(10, 100%, 70%)",
    accentHover: "hsl(10, 100%, 78%)",
  },
};

export const TagColors: {[key: string]: TagColor} = {
  "Funny": {bg: 'hsl(210, 100%, 95%)', text: 'hsl(210, 80%, 40%)'},
  "Heartwarming": {bg: 'hsl(350, 100%, 95%)', text: 'hsl(350, 80%, 40%)'},
  "Surprising": {bg: 'hsl(270, 100%, 95%)', text: 'hsl(270, 70%, 40%)'},
  "Inspiring": {bg: 'hsl(40, 100%, 95%)', text: 'hsl(40, 90%, 35%)'},
  "Awkward": {bg: 'hsl(0, 100%, 95%)', text: 'hsl(0, 80%, 40%)'},
  "Work": {bg: 'hsl(200, 30%, 95%)', text: 'hsl(200, 50%, 30%)'},
  "Family": {bg: 'hsl(130, 60%, 95%)', text: 'hsl(130, 70%, 30%)'},
  "Friends": {bg: 'hsl(180, 70%, 90%)', text: 'hsl(180, 80%, 30%)'},
  "Travel": {bg: 'hsl(25, 100%, 95%)', text: 'hsl(25, 90%, 40%)'},
  "Life Lesson": {bg: 'hsl(290, 50%, 95%)', text: 'hsl(290, 60%, 40%)'},
}