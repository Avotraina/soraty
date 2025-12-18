import { StyleSheet } from 'react-native';

import { CustomColors } from "@/app/theme/colors";
import { TextInput, useTheme, type TextInputProps } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";

// import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
    mode?: "outlined" | "flat",
    // onChange?: (value: NativeSyntheticEvent<TextInputChangeEvent>) => void;
};

export function ThemedInput({
    style,
    lightColor,
    darkColor,
    mode = "outlined",
    onChangeText,
    ...otherProps
}: ThemedInputProps) {

    const { colors } = useTheme();
    const styles = makeStyles(colors as CustomColors & MD3Colors);


    // const color = useThemeColor(
    //     { light: lightColor, dark: darkColor },
    //     'text'
    // );

    // const backgroundColor = useThemeColor(
    //     { light: undefined, dark: undefined },
    //     'background'
    // );

    return (
        <TextInput
            mode={mode}
            style={[
                styles,
                style,
            ]}
            onChangeText={onChangeText}
            // placeholderTextColor={color + '99'}
            {...otherProps}
        />
    );
}


const makeStyles = (colors: CustomColors & MD3Colors) => StyleSheet.create({
})
