import { Text, type TextProps, StyleSheet, Platform } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import Animated from 'react-native-reanimated';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'bold' | 'small' | 'smallBold';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'onSurface');

  return (
    <Text
      style={[
        { color, textAlignVertical: "center" },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'bold' ? styles.defaultBold : undefined,
        type === 'small' ? styles.small : undefined,
        type === 'smallBold' ? styles.smallBold : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

export function AnimThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'onSurface');

  return (
    <Animated.Text
      style={[
        { color, textAlignVertical: "bottom" },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'bold' ? styles.defaultBold : undefined,
        type === 'small' ? styles.small : undefined,
        type === 'smallBold' ? styles.smallBold : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Merriweather-Regular"
  },
  defaultBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Merriweather-Bold"
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: "Merriweather-Bold"
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Merriweather-Regular"
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Merriweather-Bold"
  }
});
