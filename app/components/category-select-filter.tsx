import { useCategoriesQuery } from "@/app/features/categories/category.query";
import { T_Category } from "@/app/features/categories/category.repo";
import { Folder } from "lucide-react-native";
import { useEffect, useState } from "react";
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
    const [defaultValue, setDefaultValue] = useState<string | null | undefined>(value)

    const styles = makeStyles();

    const { data: categoryList } = useCategoriesQuery();
    const categories: T_Category[] = categoryList || []

    console.log("Selected Category in CategorySelectFilter:", categoryList);

    useEffect(() => {
        setSelectedCategory(categoryList?.find(cat => cat.id === value) || null);
        onSelectCategory(categoryList?.find(cat => cat.id === value) || null);
        // Alert.alert("Value changed", `New value: ${value}`);
    }, [categoryList, value]);

    const handleCategorySelect = (category: Category | null) => {
        setSelectedCategory(category),
            onSelectCategory?.(category); // ⬅️ Notify parent
            setDefaultValue(null);
    };

    const itemBackgroundColor = (category: T_Category) => {
        if (selectedCategory) {
            if (selectedCategory.id === category.id) {
                return { backgroundColor: '#3b82f6', color: '#fff' }
            } else {
                return { backgroundColor: '#e5e7eb' }
            }
        } else {
            if (defaultValue === category.id) {
                return { backgroundColor: '#3b82f6', }
            } else {
                return { backgroundColor: '#e5e7eb' }
            }
        }
       
    }

    const itemTextColor = (category: T_Category) => {
        if (selectedCategory) {
            if (selectedCategory.id === category.id) {
                return { color: '#fff' }
            } else {
                return { color: '#4b5563' }
            }
        } else {
            if (defaultValue === category.id) {
                return { color: '#fff' }
            } else {
                return { color: '#4b5563' }
            }
        }
    }

    const allButtonBackgroundColor = () => {
        if (!selectedCategory) {
            if (!defaultValue) {
                return { backgroundColor: '#3b82f6' }
            } else {
                return { backgroundColor: '#e5e7eb' }
            }
        } else {
            return { backgroundColor: '#e5e7eb' }
        }
    }

    const allButtonTextColor = () => {
        if (!selectedCategory) {
            if (!defaultValue) {
                return { color: '#fff' }
            } else {
                return { color: '#4b5563' }
            }
        } else {
            return { color: '#4b5563' }
        }
    }

    return (
        <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3" style={styles.categoryFilterOptionsScrollContainer}>
                <View className="flex-row" style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        className={`rounded-full px-3 py-1 mr-2 ${!currentCategory ? 'bg-blue-500' : 'bg-gray-200'}`}
                        style={{ ...styles.categoryFilterAllOptionContainer, backgroundColor: !currentCategory ? '#3b82f6' : '#e5e7eb' }}
                        // style={{ ...styles.categoryFilterAllOptionContainer, ...allButtonBackgroundColor() }}
                        onPress={() => handleCategorySelect(null)}
                    >
                        <Text className={!currentCategory ? 'text-white' : 'text-gray-700'} style={{ color: !currentCategory ? '#fff' : '#4b5563' }}>All</Text>
                        {/* <Text className={!currentCategory ? 'text-white' : 'text-gray-700'} style={{ ...allButtonTextColor() }}>All</Text> */}
                    </TouchableOpacity>

                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            className={`flex-row items-center rounded-full px-3 py-1 mr-2 ${currentCategory?.id === category.id ? 'bg-blue-500' : 'bg-gray-200'}`}
                            style={{ ...styles.categoryFilterOptionsContainer, backgroundColor: currentCategory && currentCategory?.id === category.id ? '#3b82f6' : '#e5e7eb' }}
                            // style={{ ...styles.categoryFilterOptionsContainer, ...itemBackgroundColor(category) }}
                            onPress={() => handleCategorySelect(selectedCategory?.id === category.id ? null : category)}
                        >
                            <Folder size={12} color={category.color} className="mr-1" style={{ marginRight: 4 }} />
                            <Text className={selectedCategory?.id === category.id ? 'text-white' : 'text-gray-700'} style={{ color: currentCategory?.id === category.id ? '#fff' : '#4b5563' }}>
                            {/* <Text className={selectedCategory?.id === category.id ? 'text-white' : 'text-gray-700'} style={{ ...itemTextColor(category) }}> */}
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