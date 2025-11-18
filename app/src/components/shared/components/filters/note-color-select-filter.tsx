import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

const NOTE_COLORS = [
    { name: 'Yellow', value: '#FFF9C4' },
    { name: 'Blue', value: '#BBDEFB' },
    { name: 'Green', value: '#C8E6C9' },
    { name: 'Pink', value: '#F8BBD0' },
    { name: 'Purple', value: '#E1BEE7' },
    { name: 'Orange', value: '#FFE0B2' },
];

export default function NoteColorSelectFilter({
    currentColor,
    onSelectColor,
    value
}: NoteColorSelectProps) {

    const [selectedNote, setSelectedNote] = useState<string | null>(null)

    const styles = makeStyles();

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
                        style={{ ...styles.colorFilterAllOptionContainer, backgroundColor: !currentColor ? '#3b82f6' : '#e5e7eb' }}
                        onPress={() => handleColorSelect(null)}
                    >
                        <Text className={!currentColor ? 'text-white' : 'text-gray-700'} style={{ color: !currentColor ? '#fff' : '#4b5563' }}>All</Text>
                    </TouchableOpacity>

                    {NOTE_COLORS.map((color) => (
                        <TouchableOpacity
                            key={color.value}
                            className={`flex-row items-center rounded-full px-3 py-1 mr-2 ${currentColor === color.value ? 'bg-blue-500' : 'bg-gray-200'}`}
                            style={{ ...styles.colorFilterOptionsContainer, backgroundColor: currentColor === color.value ? '#3b82f6' : '#e5e7eb' }}
                            onPress={() => handleColorSelect(selectedNote === color.value ? null : color.value)}
                        >
                            <View
                                className="w-3 h-3 rounded-full mr-1"
                                style={{ ...styles.colorFilterOptionsCircle, backgroundColor: color?.value }}
                            />
                            <Text className={selectedNote === color.value ? 'text-white' : 'text-gray-700'} style={{ color: currentColor === color.value ? '#fff' : '#4b5563' }}>
                                {color.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </>
    );
}


const makeStyles = (colors?: any) => StyleSheet.create({

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