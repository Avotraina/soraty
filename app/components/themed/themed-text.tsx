import { CustomColors } from '@/app/theme/colors';
import { StyleSheet, Text, type TextProps } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

// import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'normal' | 'normalSemiBold';
};

export function ThemedText({
    style,
    lightColor,
    darkColor,
    type = 'default',
    ...rest
}: ThemedTextProps) {

    const { colors } = useTheme();
    const styles = makeStyles(colors as CustomColors & MD3Colors);

    return (
        <Text
            style={[
                type === 'default' ? styles.default : undefined,
                type === 'normal' ? styles.normal : undefined,
                type === 'normalSemiBold' ? styles.normalSemiBold : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'link' ? styles.link : undefined,
                style,
            ]}
            {...rest}
        />
    );
}


const makeStyles = (colors: CustomColors & MD3Colors) => StyleSheet.create({
    default: {
        fontSize: 14,
        // lineHeight: 24,
    },
    defaultSemiBold: {
        fontSize: 14,
        // lineHeight: 24,
        fontWeight: '600',
    },
    normal: {
        fontSize: 16,
        // lineHeight: 24,
        // fontWeight: '600',
    },
    normalSemiBold: {
        fontSize: 16,
        // lineHeight: 24,
        fontWeight: '600',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        // lineHeight: 32,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    link: {
        // lineHeight: 30,
        fontSize: 16,
        color: '#0a7ea4',
    },
})