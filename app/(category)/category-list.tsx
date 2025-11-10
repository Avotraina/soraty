import NewCategoryModal from '@/app/src/components/category/new-category-modal';
import { useCategoriesInfiniteQuery } from '@/app/src/features/categories/category.query';
import { Edit3, Folder, Plus, Trash2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Category = {
    id: string;
    category_name: string;
    name?: string;
    color: string;
    noteCount?: number;
    note_count?: number;
};

const CATEGORY_COLORS = [
    '#FFD54F', // Yellow
    '#4FC3F7', // Blue
    '#81C784', // Green
    '#E57373', // Red
    '#BA68C8', // Purple
    '#FF8A65', // Orange
    '#4DB6AC', // Teal
    '#9575CD', // Deep Purple
];

export default function CategoriesScreen() {

    const [users, setUsers] = useState<{ id: number; name: string; email: string }[]>([]);

    const styles = makeStyles();

    // const [categories, setCategories] = useState<Category[]>([
    //     { id: '1', name: 'Personal', color: '#FFD54F', noteCount: 5 },
    //     { id: '2', name: 'Work', color: '#4FC3F7', noteCount: 8 },
    //     { id: '3', name: 'Ideas', color: '#81C784', noteCount: 3 },
    //     { id: '4', name: 'Shopping', color: '#E57373', noteCount: 2 },
    // ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [newCategory, setNewCategory] = useState({ name: '', color: CATEGORY_COLORS[0] });
    const [searchQuery, setSearchQuery] = useState('');

    const { data } = useCategoriesInfiniteQuery(searchQuery);
    
    const categoryList = data?.pages[0]?.flatMap((page: any) => page) || []
    // const categoryList = data?.pages || []

    console.log("Data", categoryList, data)


    // const handleAddCategory = () => {
    //     if (!newCategory.name.trim()) {
    //         Alert.alert('Error', 'Please enter a category name');
    //         return;
    //     }

    //     if (editingCategory) {
    //         // Update existing category
    //         setCategories(categories.map(cat =>
    //             cat.id === editingCategory.id
    //                 ? { ...cat, name: newCategory.name, color: newCategory.color }
    //                 : cat
    //         ));
    //     } else {
    //         // Add new category
    //         const category: Category = {
    //             id: Date.now().toString(),
    //             name: newCategory.name,
    //             color: newCategory.color,
    //             noteCount: 0,
    //         };
    //         setCategories([category, ...categories]);
    //     }

    //     resetForm();
    // };

    // const handleEditCategory = (category: Category) => {
    //     setEditingCategory(category);
    //     setNewCategory({ name: category.name, color: category.color });
    //     setIsModalVisible(true);
    // };

    // const handleDeleteCategory = (id: string) => {
    //     Alert.alert(
    //         'Delete Category',
    //         'Are you sure you want to delete this category? Notes in this category will become uncategorized.',
    //         [
    //             { text: 'Cancel', style: 'cancel' },
    //             {
    //                 text: 'Delete',
    //                 style: 'destructive',
    //                 onPress: () => {
    //                     setCategories(categories.filter(cat => cat.id !== id));
    //                 },
    //             },
    //         ]
    //     );
    // };

    const resetForm = () => {
        setIsModalVisible(false);
        setEditingCategory(null);
        setNewCategory({ name: '', color: CATEGORY_COLORS[0] });
    };

    // const filteredCategories = categories.filter(category =>
    //     category.name.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    const renderCategoryItem = ({ item }: { item: Category }) => (
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-center" style={styles.categoryContainer}>
            <View
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ ...styles.categoryIcon, backgroundColor: `${item.color}20` }}
            >
                <Folder size={24} color={item.color} />
            </View>

            <View className="flex-1" style={styles.categoryLabelsContainer}>
                <Text className="text-lg font-semibold text-gray-800" style={styles.categoryName}>{item.category_name}</Text>
                <Text className="text-gray-500" style={styles.categoryNoteCount}>{item.note_count} notes</Text>
            </View>

            <View className="flex-row" style={styles.categoryIconsContainer}>
                <TouchableOpacity
                    className="p-2 mr-2"
                    // onPress={() => handleEditCategory(item)}
                >
                    <Edit3 size={20} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                    className="p-2"
                    // onPress={() => handleDeleteCategory(item.id)}
                >
                    <Trash2 size={20} color="#666" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50" style={styles.container}>
            {/* Header */}
            <View className="bg-white py-4 px-4 shadow-sm" style={styles.headerContainer}>
                <View className="flex-row justify-between items-center" style={styles.header}>
                    <Text className="text-2xl font-bold text-gray-800" style={styles.headerTitle}>Categories</Text>
                    <TouchableOpacity
                        className="bg-blue-500 rounded-full p-3"
                        style={styles.headerSaveButton}
                        onPress={() => setIsModalVisible(true)}
                    >
                        <Plus size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View className="bg-white py-3 px-4 mb-3" style={styles.searchBarContainer}>
                <View className="flex-row items-center bg-gray-100 rounded-xl px-3" style={styles.searchBar}>
                    <TextInput
                        className="flex-1 py-3 px-2"
                        style={styles.searchInput}
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <X size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Categories List */}
            <View className="flex-1 px-4" style={styles.categoryListContainer}>
                {/* {filteredCategories.length === 0 ? ( */}
                {categoryList.length === 0 ? (
                    <View className="flex-1 justify-center items-center py-10" style={styles.noCategoriesContainer}>
                        <Folder size={48} color="#ccc" />
                        <Text className="text-gray-500 text-lg mt-4" style={styles.noCategoriesFound}>No categories found</Text>
                        <Text className="text-gray-400 mt-1" style={styles.noCategoriesFoundCreate}>Create your first category to get started</Text>
                    </View>
                ) : (
                    <FlatList
                        data={categoryList}
                        renderItem={renderCategoryItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}
            </View>

            {/* Add/Edit Category Modal */}
            <NewCategoryModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
        </View>
    );
}


const makeStyles = (colors?: any) => StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f9fafb'
    },
    headerContainer: {
        backgroundColor: 'white',
        paddingVertical: 16,
        paddingHorizontal: 16,
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)', // Tailwind shadow-sm
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937'
    },
    headerSaveButton: {
        backgroundColor: '#3b82f6', // Tailwind bg-blue-500
        borderRadius: 9999,
        padding: 12,
    },
    searchBarContainer: {
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        paddingHorizontal: 12
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    categoryListContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    noCategoriesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    noCategoriesFound: {
        color: '#6b7280',
        fontSize: 18,
        marginTop: 16,
    },
    noCategoriesFoundCreate: {
        color: '#9ca3af',
        marginTop: 4,
    },
    categoryContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 1,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', // Tailwind shadow-sm
        flexDirection: 'row',
        alignItems: 'center'
    },
    categoryIcon: {
        width: 28,
        height: 28,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    categoryLabelsContainer: {
        flex: 1,
    },
    categoryName: {
        fontSize: 18,
        fontWeight: 600,
        color: '#1f2937',
    },
    categoryNoteCount: {
        color: '#6b7280'
    },
    categoryIconsContainer: {
        flexDirection: 'row',
        gap: 24,
    },
    colorItem: {
        width: 40,                // Tailwind 'w-10' (2.5rem = 40px)
        height: 40,               // Tailwind 'h-10' (2.5rem = 40px)
        borderRadius: 9999,       // Tailwind 'rounded-full'
        margin: 4,                // Tailwind 'm-1' (0.25rem = 4px)
        borderWidth: 2,           // Tailwind 'border-2'
        alignItems: 'center',     // Tailwind 'items-center'
        justifyContent: 'center', // Tailwind 'justify-center'
    },
})