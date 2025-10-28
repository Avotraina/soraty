import { Check, Edit3, Folder, Plus, Save, Trash2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Category = {
    id: string;
    name: string;
    color: string;
    noteCount: number;
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

    const styles = makeStyles();

    const [categories, setCategories] = useState<Category[]>([
        { id: '1', name: 'Personal', color: '#FFD54F', noteCount: 5 },
        { id: '2', name: 'Work', color: '#4FC3F7', noteCount: 8 },
        { id: '3', name: 'Ideas', color: '#81C784', noteCount: 3 },
        { id: '4', name: 'Shopping', color: '#E57373', noteCount: 2 },
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [newCategory, setNewCategory] = useState({ name: '', color: CATEGORY_COLORS[0] });
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddCategory = () => {
        if (!newCategory.name.trim()) {
            Alert.alert('Error', 'Please enter a category name');
            return;
        }

        if (editingCategory) {
            // Update existing category
            setCategories(categories.map(cat =>
                cat.id === editingCategory.id
                    ? { ...cat, name: newCategory.name, color: newCategory.color }
                    : cat
            ));
        } else {
            // Add new category
            const category: Category = {
                id: Date.now().toString(),
                name: newCategory.name,
                color: newCategory.color,
                noteCount: 0,
            };
            setCategories([category, ...categories]);
        }

        resetForm();
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setNewCategory({ name: category.name, color: category.color });
        setIsModalVisible(true);
    };

    const handleDeleteCategory = (id: string) => {
        Alert.alert(
            'Delete Category',
            'Are you sure you want to delete this category? Notes in this category will become uncategorized.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setCategories(categories.filter(cat => cat.id !== id));
                    },
                },
            ]
        );
    };

    const resetForm = () => {
        setIsModalVisible(false);
        setEditingCategory(null);
        setNewCategory({ name: '', color: CATEGORY_COLORS[0] });
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderCategoryItem = ({ item }: { item: Category }) => (
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-center" style={styles.categoryContainer}>
            <View
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ ...styles.categoryIcon, backgroundColor: `${item.color}20` }}
            >
                <Folder size={24} color={item.color} />
            </View>

            <View className="flex-1" style={styles.categoryLabelsContainer}>
                <Text className="text-lg font-semibold text-gray-800" style={styles.categoryName}>{item.name}</Text>
                <Text className="text-gray-500" style={styles.categoryNoteCount}>{item.noteCount} notes</Text>
            </View>

            <View className="flex-row" style={styles.categoryIconsContainer}>
                <TouchableOpacity
                    className="p-2 mr-2"
                    onPress={() => handleEditCategory(item)}
                >
                    <Edit3 size={20} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                    className="p-2"
                    onPress={() => handleDeleteCategory(item.id)}
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
                {filteredCategories.length === 0 ? (
                    <View className="flex-1 justify-center items-center py-10" style={styles.noCategoriesContainer}>
                        <Folder size={48} color="#ccc" />
                        <Text className="text-gray-500 text-lg mt-4" style={styles.noCategoriesFound}>No categories found</Text>
                        <Text className="text-gray-400 mt-1" style={styles.noCategoriesFoundCreate}>Create your first category to get started</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredCategories}
                        renderItem={renderCategoryItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}
            </View>

            {/* Add/Edit Category Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={resetForm}
            >
                <View className="flex-1 justify-center items-center bg-black/50" style={styles.modalOverlay}>
                    <View className="bg-white rounded-xl p-6 w-11/12 max-w-md" style={styles.modalContainer}>
                        <Text className="text-xl font-bold text-gray-800 mb-4" style={styles.modalTitle}>
                            {editingCategory ? 'Edit Category' : 'New Category'}
                        </Text>

                        <TextInput
                            className="border border-gray-300 rounded-lg p-3 mb-4"
                            style={styles.modalCategoryNameInput}
                            placeholder="Category name"
                            value={newCategory.name}
                            onChangeText={(text) => setNewCategory({ ...newCategory, name: text })}
                        />

                        <Text className="font-semibold text-gray-700 mb-2" style={styles.categoryModalColorTitle}>Color</Text>
                        <View className="flex-row flex-wrap mb-6" style={styles.categoryModalColorsContainer}>
                            {CATEGORY_COLORS.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    className="w-10 h-10 rounded-full m-1 border-2 items-center justify-center"
                                    style={{
                                        ...styles.colorItem,
                                        backgroundColor: color,
                                        borderColor: newCategory.color === color ? '#4A90E2' : 'transparent'
                                    }}
                                    onPress={() => setNewCategory({ ...newCategory, color })}
                                >
                                    {newCategory.color === color && <Check size={16} color="white" />}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View className="flex-row justify-end" style={styles.modalFooterContainer}>
                            <TouchableOpacity
                                className="bg-gray-200 rounded-lg px-4 py-2 mr-2"
                                style={styles.modalCancelButton}
                                onPress={resetForm}
                            >
                                <Text className="text-gray-700" style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-blue-500 rounded-lg px-4 py-2 flex-row items-center"
                                style={styles.modalSaveButton}
                                onPress={handleAddCategory}
                            >
                                <Save size={16} color="white" className="mr-1" />
                                <Text className="text-white" style={styles.modalSaveText}>
                                    {editingCategory ? 'Update' : 'Create'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        width: '91.666667%',   // 11/12 in percentage
        maxWidth: 448,         // Tailwind 'max-w-md' = 28rem = 448px
    },
    modalTitle: {
        fontSize: 20,           // Tailwind 'text-xl'
        fontWeight: '700',       // Tailwind 'font-bold'
        color: '#1f2937',        // Tailwind 'text-gray-800'
        marginBottom: 16,        // Tailwind 'mb-4' (1rem = 16px)
    },
    modalCategoryNameInput: {
        borderWidth: 1,           // Tailwind 'border'
        borderColor: '#d1d5db',   // Tailwind 'border-gray-300'
        borderRadius: 8,           // Tailwind 'rounded-lg'
        padding: 12,               // Tailwind 'p-3' (0.75rem = 12px)
        marginBottom: 16,          // Tailwind 'mb-4' (1rem = 16px)
    },
    categoryModalColorTitle: {
        fontWeight: '600',        // Tailwind 'font-semibold'
        color: '#374151',         // Tailwind 'text-gray-700'
        marginBottom: 8,          // Tailwind 'mb-2' (0.5rem = 8px)
    },
    categoryModalColorsContainer: {
        flexDirection: 'row',    // Tailwind 'flex-row'
        flexWrap: 'wrap',        // Tailwind 'flex-wrap'
        marginBottom: 24,        // Tailwind 'mb-6' (1.5rem = 24px)
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
    modalFooterContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    modalCancelButton: {
        backgroundColor: '#e5e7eb', // Tailwind 'bg-gray-200'
        borderRadius: 8,             // Tailwind 'rounded-lg'
        paddingHorizontal: 16,       // Tailwind 'px-4' (1rem = 16px)
        paddingVertical: 8,          // Tailwind 'py-2' (0.5rem = 8px)
        marginRight: 8,              // Tailwind 'mr-2' (0.5rem = 8px)
    },
    modalCancelText: {
        color: '#374151', // Tailwind 'text-gray-700'
    },
    modalSaveButton: {
        backgroundColor: '#3b82f6', // Tailwind 'bg-blue-500'
        borderRadius: 8,             // Tailwind 'rounded-lg'
        paddingHorizontal: 16,       // Tailwind 'px-4' (1rem = 16px)
        paddingVertical: 8,          // Tailwind 'py-2' (0.5rem = 8px)
        flexDirection: 'row',        // Tailwind 'flex-row'
        alignItems: 'center',        // Tailwind 'items-center',
        gap: 4
    },
    modalSaveText: {
        color: 'white',
    }

})