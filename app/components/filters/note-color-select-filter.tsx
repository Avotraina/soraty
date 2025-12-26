import { NOTE_COLORS } from "@/app/constants/colors";
import { CustomColors } from "@/app/theme/colors";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { ThemedText } from "../themed/themed-text";
// import { useCategoriesInfiniteQuery } from "../../features/categories/category.query";
// import { useDebounce } from "../../hooks/debounce";



type Category = {
    id: string;
    category_name: string;
    color: string;
}

type NoteColorSelectProps = {
    onClose?: () => void;
    currentColor?: string | null
    onSelectColor: (note: string | null) => void;
    value?: string;
}

// const NOTE_COLORS = [
//     { name: 'Yellow', value: '#FFF9C4' },
//     { name: 'Blue', value: '#BBDEFB' },
//     { name: 'Green', value: '#C8E6C9' },
//     { name: 'Pink', value: '#F8BBD0' },
//     { name: 'Purple', value: '#E1BEE7' },
//     { name: 'Orange', value: '#FFE0B2' },
// ];

export default function NoteColorSelectFilter({
    currentColor,
    onSelectColor,
    value
}: NoteColorSelectProps) {

    const [selectedNote, setSelectedNote] = useState<string | null>(null)

    const { colors } = useTheme();
    const styles = makeStyles(colors as CustomColors & MD3Colors);

    // const { data: categoryList } = useCategoriesQuery();
    // const categories: T_Category[] = categoryList || []


    const handleColorSelect = (note: string | null) => {
        setSelectedNote(note),
            onSelectColor?.(note); // ⬅️ Notify parent
    };

    return (
        <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3" style={styles.colorFilterOptionsScrollContainer}>
                <View className="flex-row" style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        className={`rounded-full px-3 py-1 mr-2 ${!currentColor ? 'bg-blue-500' : 'bg-gray-200'}`}
                        style={{ ...styles.colorFilterAllOptionContainer, backgroundColor: !currentColor ? colors.primary : (colors as CustomColors & MD3Colors).chipsContainer }}
                        onPress={() => handleColorSelect(null)}
                    >
                        <ThemedText className={!currentColor ? 'text-white' : 'text-gray-700'} style={{ color: !currentColor ? (colors as CustomColors & MD3Colors).onPrimary : (colors as CustomColors & MD3Colors).primaryText }}>All</ThemedText>
                    </TouchableOpacity>

                    {NOTE_COLORS.map((color) => (
                        <TouchableOpacity
                            key={color.value}
                            className={`flex-row items-center rounded-full px-3 py-1 mr-2 ${currentColor === color.value ? 'bg-blue-500' : 'bg-gray-200'}`}
                            style={{ ...styles.colorFilterOptionsContainer, backgroundColor: currentColor === color.value ? colors.primary : (colors as CustomColors & MD3Colors).chipsContainer }}
                            onPress={() => handleColorSelect(selectedNote === color.value ? null : color.value)}
                        >
                            <View
                                className="w-3 h-3 rounded-full mr-1"
                                style={{ ...styles.colorFilterOptionsCircle, backgroundColor: color?.value }}
                            />
                            <ThemedText className={selectedNote === color.value ? 'text-white' : 'text-gray-700'} style={{ color: currentColor === color.value ? (colors as CustomColors & MD3Colors).onPrimary : (colors as CustomColors & MD3Colors).primaryText }}>
                                {color.name}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </>
    );
}


const makeStyles = (colors?: CustomColors & MD3Colors) => StyleSheet.create({

    colorFilterHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    colorFilterOptionsScrollContainer: {
        marginBottom: 12,
    },
    colorFilterAllOptionContainer: {
        borderRadius: 9999,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginRight: 8,
    },
    colorFilterOptionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 9999,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginRight: 8,
    },
    colorFilterOptionsCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },

})