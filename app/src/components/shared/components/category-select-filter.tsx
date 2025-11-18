import { useCategoriesQuery } from "@/app/src/features/categories/category.query";
import { T_Category } from "@/app/src/features/categories/category.repo";
import { Folder } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { useCategoriesInfiniteQuery } from "../../features/categories/category.query";
// import { useDebounce } from "../../hooks/debounce";



type Category = {
    id: string;
    category_name: string;
    color: string;
}

type CategorySelectProps = {
    onClose?: () => void;
    currentCategory?: Category | null
    onSelectCategory: (category: Category | null) => void;
    value?: string;
}


export default function CategorySelectFilter({
    currentCategory,
    onSelectCategory,
    value
}: CategorySelectProps) {

    const [selectedCategory, setSelectedCategory] = useState<T_Category | null | undefined>(currentCategory)

    const styles = makeStyles();

    const { data: categoryList } = useCategoriesQuery();
    const categories: T_Category[] = categoryList || []


    const handleCategorySelect = (category: Category | null) => {
        setSelectedCategory(category),
            onSelectCategory?.(category); // ⬅️ Notify parent
    };

    return (
        <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3" style={styles.categoryFilterOptionsScrollContainer}>
                <View className="flex-row" style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        className={`rounded-full px-3 py-1 mr-2 ${!currentCategory ? 'bg-blue-500' : 'bg-gray-200'}`}
                        style={{ ...styles.categoryFilterAllOptionContainer, backgroundColor: !currentCategory ? '#3b82f6' : '#e5e7eb' }}
                        onPress={() => handleCategorySelect(null)}
                    >
                        <Text className={!currentCategory ? 'text-white' : 'text-gray-700'} style={{ color: !currentCategory ? '#fff' : '#4b5563' }}>All</Text>
                    </TouchableOpacity>

                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            className={`flex-row items-center rounded-full px-3 py-1 mr-2 ${currentCategory?.id === category.id ? 'bg-blue-500' : 'bg-gray-200'}`}
                            style={{ ...styles.categoryFilterOptionsContainer, backgroundColor: currentCategory?.id === category.id ? '#3b82f6' : '#e5e7eb' }}
                            onPress={() => handleCategorySelect(selectedCategory?.id === category.id ? null : category)}
                        >
                            <Folder size={12} color={category.color} className="mr-1" style={{ marginRight: 4 }} />
                            <Text className={selectedCategory?.id === category.id ? 'text-white' : 'text-gray-700'} style={{ color: currentCategory?.id === category.id ? '#fff' : '#4b5563' }}>
                                {category.category_name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </>
    );
}


const makeStyles = (colors?: any) => StyleSheet.create({

    categoryFilterHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    categoryFilterOptionsScrollContainer: {
        marginBottom: 12,
    },
    categoryFilterAllOptionContainer: {
        borderRadius: 9999,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginRight: 8,
    },
    categoryFilterOptionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 9999,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginRight: 8,
    },

})