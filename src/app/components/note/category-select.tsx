import { useCategoriesQuery } from "@/src/app/features/categories/category.query";
import { useDebounce } from "@/src/app/hooks/debounce";
import { Check, Folder, X } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";



type Category = {
    id: string;
    category_name: string;
    color: string;
}

type CategorySelectProps = {
    onClose?: () => void;
    currentCategory?: Category | null
    onSelectCategory?: (category: Category | null) => void;
    value?: string;
}


export default function CategorySelect({
    currentCategory,
    onSelectCategory,
    value
}: CategorySelectProps) {

    const styles = makeStyles();

    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery);


    // const { data } = useCategoriesInfiniteQuery({ debouncedSearch: debouncedSearch.trim() });
    const { data } = useCategoriesQuery();

    // console.log("CATEGORIES DATA", data);

    const categoryList: Category[] = data || []


    const handleCategorySelect = (category: Category | null) => {
        onSelectCategory?.(category); // ⬅️ Notify parent
        setIsCategoryModalVisible(false);
    };

    console.log("CURRENT CATEGORY", currentCategory);


    return (
        <>
            <View className="py-3 px-4 bg-white border-b border-gray-200" style={styles.categorySelectionContainer}>
                <TouchableOpacity
                    className="flex-row items-center"
                    style={styles.categorySelectionTouchable}
                    onPress={() => setIsCategoryModalVisible(true)}
                >
                    <Folder size={20} color="#666" className="mr-2" style={{ marginRight: 8 }} />
                    <Text className="text-gray-700 font-medium mr-2" style={styles.categorySelectionTitle}>Category</Text>
                    {currentCategory ? (
                        <View className="flex-row items-center bg-gray-100 rounded-full px-3 py-1" style={styles.selectedCategoryContainer}>
                            <View
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ ...styles.selectedCategory, backgroundColor: currentCategory.color }}
                            />
                            <Text className="text-gray-800" style={styles.selectedCategoryName}>{currentCategory.category_name}</Text>
                        </View>
                    ) : (
                        <Text className="text-gray-400" style={styles.noCategorySelectedText}>None selected</Text>
                    )}
                </TouchableOpacity>
            </View>


            {/* Category Selection Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isCategoryModalVisible}
                onRequestClose={() => setIsCategoryModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50" style={styles.categoryModalOverlay}>
                    <View className="bg-white rounded-t-2xl p-4" style={styles.categoryModalContainer}>
                        <View className="flex-row justify-between items-center mb-4" style={styles.categoryModalHeaderContainer}>
                            <Text className="text-xl font-bold text-gray-800" style={styles.categoryModalTitle}>Select Category</Text>
                            <TouchableOpacity onPress={() => setIsCategoryModalVisible(false)}>
                                <X size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {/* Searchbar */}
                        {/* <View>
                            <Searchbar
                                placeholder="Search"
                                onChangeText={setSearchQuery}
                                value={searchQuery}
                            />
                        </View> */}

                        {/* None Option */}
                        <TouchableOpacity
                            className="flex-row items-center py-3 border-b border-gray-100"
                            style={styles.categoryModalNoneOptionContainer}
                            onPress={() => handleCategorySelect(null)}
                        >
                            <View
                                className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3 items-center justify-center"
                                style={styles.categoryModalNoneOptionCheck}
                            >
                                {/* {!note.category && <Check size={16} color="#4A90E2" />} */}
                                {!currentCategory && <Check size={16} color="#4A90E2" />}
                            </View>
                            <Text className="text-gray-700" style={styles.categoryModalNoneText}>None</Text>
                        </TouchableOpacity>

                        {/* Category List */}
                        <FlatList
                            data={categoryList}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    key={item.id}
                                    className="flex-row items-center py-3 border-b border-gray-100"
                                    style={{ ...styles.categoryModalListContainer, backgroundColor: currentCategory?.id === item.id ? `${item.color}20` : undefined }}
                                    onPress={() => handleCategorySelect(item)}
                                >
                                    <View
                                        className="w-6 h-6 rounded-full mr-3 items-center justify-center"
                                        style={{ ...styles.categoryModalOptionCheck, backgroundColor: `${item.color}20` }}
                                    >
                                        {/* {note.category?.id === category.id && <Check size={16} color={category.color} />} */}
                                        {currentCategory?.id === item.id && <Check size={16} color={item.color} />}
                                    </View>
                                    <View
                                        className="w-3 h-3 rounded-full mr-3"
                                        style={{ width: 12, height: 12, borderRadius: 9999, marginRight: 12, backgroundColor: item.color }}
                                    />
                                    <Text className="text-gray-700" style={styles.categoryModalListName}>{item.category_name}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            style={{ maxHeight: 60 * 6 }}
                        />

                        {/* {categoryList.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                className="flex-row items-center py-3 border-b border-gray-100"
                                style={{ ...styles.categoryModalListContainer, backgroundColor: currentCategory?.id === category.id ? `${category.color}20` : undefined }}
                                onPress={() => handleCategorySelect(category)}
                            >
                                <View
                                    className="w-6 h-6 rounded-full mr-3 items-center justify-center"
                                    style={{ ...styles.categoryModalOptionCheck, backgroundColor: `${category.color}20` }}
                                >
                                    {note.category?.id === category.id && <Check size={16} color={category.color} />}
                                    {currentCategory?.id === category.id && <Check size={16} color={category.color} />}
                                </View>
                                <View
                                    className="w-3 h-3 rounded-full mr-3"
                                    style={{ width: 12, height: 12, borderRadius: 9999, marginRight: 12, backgroundColor: category.color }}
                                />
                                <Text className="text-gray-700" style={styles.categoryModalListName}>{category.category_name}</Text>
                            </TouchableOpacity>
                        ))} */}

                        {/* Add New Category */}
                        {/* <View className="flex-row items-center py-3 mt-2" style={styles.addNewCategoryContainer}>
                            <TextInput
                                className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
                                style={styles.addNewCategoryInput}
                                placeholder="New category"
                                value={newCategoryName}
                                onChangeText={setNewCategoryName}
                            />
                            <TouchableOpacity
                                className="bg-blue-500 rounded-lg p-2"
                                style={styles.addNewCategoryAddButton}
                                onPress={handleAddCategory}
                            >
                                <Plus size={20} color="white" />
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </View>
            </Modal>
        </>
    );
}


const makeStyles = (colors?: any) => StyleSheet.create({

    categorySelectionContainer: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    categorySelectionTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categorySelectionTitle: {
        color: '#4b5563',
        fontSize: 16,
        marginRight: 8,
    },
    selectedCategoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 9999,
        paddingHorizontal: 12,
        paddingVertical: 4
    },
    selectedCategory: {
        width: 12,
        height: 12,
        borderRadius: 9999,
        marginRight: 8,
    },
    selectedCategoryName: {
        color: '#1f2937'
    },
    noCategorySelectedText: {
        color: '#9ca3af',
    },
    categoryModalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    categoryModalContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
    },
    categoryModalHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    categoryModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    categoryModalNoneOptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,           // Tailwind's default width
        borderBottomColor: '#e5e7eb',
        marginTop: 8,
    },
    categoryModalNoneOptionCheck: {
        width: 24,
        height: 24,
        borderRadius: 9999,
        borderWidth: 2,              // Tailwind border-2
        borderColor: '#e5e7eb',
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryModalNoneText: {
        color: '#374151'
    },
    categoryModalListContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,           // Tailwind's default width
        borderBottomColor: '#e5e7eb',
    },
    categoryModalOptionCheck: {
        width: 24,
        height: 24,
        borderRadius: 9999,
        borderWidth: 2,              // Tailwind border-2
        borderColor: '#e5e7eb',
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryModalListName: {
        color: '#374151'
    },
    addNewCategoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 8,
    },
    addNewCategoryInput: {
        flex: 1,
        borderWidth: 1,           // Tailwind 'border'
        borderColor: '#d1d5db',   // Tailwind 'border-gray-300'
        borderRadius: 8,          // Tailwind 'rounded-lg'
        padding: 8,
        marginRight: 8,
    },
    addNewCategoryAddButton: {
        backgroundColor: '#3b82f6', // Tailwind 'bg-blue-500'
        borderRadius: 8,             // Tailwind 'rounded-lg'
        padding: 8,                  // Tailwind 'p-2' (0.5rem = 8px)
    }

})