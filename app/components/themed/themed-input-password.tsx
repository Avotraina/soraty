import { StyleSheet } from 'react-native';

import { CustomColors } from "@/app/theme/colors";
import { useState } from 'react';
import { TextInput, useTheme, type TextInputProps } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";

// import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
    mode?: "outlined" | "flat",
    // onChange?: (value: NativeSyntheticEvent<TextInputChangeEvent>) => void;
};

export function ThemedInputPassword({
    style,
    lightColor,
    darkColor,
    mode = "outlined",
    onChangeText,
    placeholder = 'Password',
    ...otherProps
}: ThemedInputProps) {


    const { colors } = useTheme();
    const styles = makeStyles(colors as CustomColors & MD3Colors);

    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);

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
            secureTextEntry={!visible}
            onChangeText={onChangeText}
            // placeholderTextColor={color + '99'}
            {...otherProps}
            right={
                <TextInput.Icon
                    icon={visible ? 'eye-off' : 'eye'}
                    onPress={() => setVisible((v) => !v)}
                />
            }
            textContentType='password'
            autoComplete="password"
            placeholder={placeholder}
        />
    );
}


const makeStyles = (colors: CustomColors & MD3Colors) => StyleSheet.create({
})
