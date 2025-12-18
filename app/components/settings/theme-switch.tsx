import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
// import { Icon } from "react-native-vector-icons/Icon";
import { Checkbox } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import Icon from 'react-native-vector-icons/FontAwesome';
import { CustomColors } from "../../theme/colors";
import { useThemeContext } from "../../theme/theme-context";


export default function ThemeSwitch() {

    const { colors } = useTheme();

    const styles = makeStyles(colors as CustomColors & MD3Colors);

    const { setCustomColors, toggleTheme, isDark, setTheme, colorScheme } = useThemeContext();

    // const { toggleTheme, isDarkTheme } = useThemeContext();
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [themeAnimation] = useState(new Animated.Value(0));

    // const setColorScheme = Appearance.setColorScheme('dark')


    // const toggleTheme = () => {
    //     Animated.timing(themeAnimation, {
    //         toValue: isDarkTheme ? 0 : 1,
    //         duration: 500,
    //         useNativeDriver: false,
    //     }).start();
    //     Appearance.setColorScheme('light')
    //     setIsDarkTheme(!isDarkTheme);
    // };


    return (
        <>
            {/* <View style={styles.settingItem}>
                <Text style={styles.settingText}>Dark Theme</Text>
                <View style={styles.switchContainer}>
                    <Icon
                        name={isDarkTheme ? 'moon-o' : 'sun-o'}
                        size={24}
                        color={isDarkTheme ? '#f0e68c' : '#ffa500'}
                    />
                    <Switch
                        value={isDarkTheme}
                        onValueChange={toggleTheme}
                    />
                </View>



            </View> */}

            <View style={styles.checklistContainer}>
                {/* <Text style={styles.checklistTitle}>Theme</Text> */}
                <View style={styles.checklistItem}>
                    <Icon name="moon-o" size={24} color={colors.primary} style={styles.checklistIcon} />
                    <Text style={styles.checklistLabel}>Dark</Text>
                    <Checkbox
                        status={colorScheme === 'dark' ? 'checked' : 'unchecked'}
                        onPress={() => setTheme('dark')}
                        color="#333"
                    />
                </View>
                <View style={styles.checklistItem}>
                    <Icon name="sun-o" size={24} color={(colors as CustomColors & MD3Colors).warning} style={styles.checklistIcon} />
                    <Text style={styles.checklistLabel}>Light</Text>
                    <Checkbox
                        status={colorScheme === 'light' ? 'checked' : 'unchecked'}
                        onPress={() => setTheme('light')}
                        color="#ffa500"
                    />
                </View>
                {/* <View style={styles.checklistItem}>
                    <Icon name="cog" size={24} color="#333" style={styles.checklistIcon} />
                    <Text style={styles.checklistLabel}>System</Text>
                    <Checkbox
                        status={selectedTheme === 'system' ? 'checked' : 'unchecked'}
                        onPress={() => handleThemeChange('system')}
                        color="#333"
                    />
                </View> */}
            </View>
        </>
    );
}



const makeStyles = (colors: CustomColors & MD3Colors) => StyleSheet.create({
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    settingText: {
        fontSize: 18,
        color: colors.text,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checklistContainer: {
        marginTop: 20,
        // paddingHorizontal: 20,
    },
    checklistTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.text,
    },
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    checklistIcon: {
        marginRight: 10,
    },
    checklistLabel: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
    },
})