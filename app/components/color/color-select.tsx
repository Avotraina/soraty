import { NOTE_COLORS } from "@/app/constants/colors";
import { CustomColors } from "@/app/theme/colors";
import { Palette } from "lucide-react-native";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { ThemedText } from "../themed/themed-text";

type ColorSelectProps = {
    onClose?: () => void;
    currentColor?: string | undefined
    onSelectColor?: (color: string | undefined) => void;
    value?: string;
}

// export const COLORS = [
//     '#FFE599', // Yellow
//     '#A4C2F4', // Blue
//     '#F9CB9C', // Orange
//     '#B4A7D6', // Purple
//     '#8FBC8F', // Green
//     '#F9B7B7', // Red
//     '#E6B8AF', // Pink
//     '#D5A6BD', // Magenta
// ];


export default function ColorSelect({
    currentColor,
    onSelectColor,
    value
}: ColorSelectProps) {

    const { colors } = useTheme();
    const styles = makeStyles(colors as CustomColors & MD3Colors);

    // useEffect(() => {
    //     if (!currentColor && onSelectColor) {
    //         onSelectColor(COLORS[0]); // pick first color by default
    //     }
    // }, [currentColor, onSelectColor]);

    const handleColorSelect = (color: string | undefined) => {
        onSelectColor?.(color);
    };

    console.log("CURRENT COLOR", currentColor);


    return (
        <>
            {/* Color Selection */}
            <View className="py-3 px-4 bg-white border-b border-gray-200" style={styles.colorSelectionContainer}>
                <View className="flex-row items-center mb-2" style={styles.colorSelectionTitleContainer}>
                    <Palette size={20} color={(colors as CustomColors & MD3Colors).secondaryText} className="mr-2" style={{ marginRight: 8 }} />
                    <ThemedText type="normalSemiBold" className="text-gray-700 font-medium" style={styles.colorSelectionTitle}>Note Color</ThemedText>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-16" style={styles.colorSelectionScrollView}>
                    <View className="flex-row gap-3" style={styles.colorsSelectionContainer}>
                        {NOTE_COLORS.map((color, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleColorSelect(color.value)}
                                className={`w-10 h-10 rounded-full border-2 ${currentColor === color.value ? 'border-blue-500' : 'border-gray-300'}`}
                                // style={{ ...styles.colorCircle, backgroundColor: color, borderColor: currentColor === color ? '#3b82f6' : '#d1d5db' }}
                                style={{ ...styles.colorCircle, backgroundColor: color.value, borderColor: currentColor === color.value ? colors.primary : (colors as CustomColors & MD3Colors).chipsContainer }}
                            // style={{ backgroundColor: color }}
                            />
                        ))}
                    </View>
                </ScrollView>
            </View>
        </>
    );

}

const makeStyles = (colors: CustomColors & MD3Colors) => StyleSheet.create({

    colorSelectionContainer: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        // backgroundColor: 'white',
        // borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    colorSelectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    colorSelectionTitle: {
        // fontSize: 16,
        color: colors.secondaryText,
    },
    colorSelectionScrollView: {
        maxHeight: 64,
    },
    colorsSelectionContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    colorCircle: {
        width: 28,
        height: 28,
        borderRadius: 20,
        borderWidth: 0.8,
    },

})