import { useSnackbar } from "@/app/src/contexts/snackbar-provider";
import { useAddCategoryMutation } from "@/app/src/features/categories/category.query";
import { Check, Save } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { useToast } from "react-native-paper-toast";



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

type Category = {
    id: string;
    name: string;
    color: string;
    // noteCount: number;
};

type NewCategoryModalProps = {
    isVisible: boolean;
    onClose?: () => void;
    // Add any other props you want to pass
};

export default function NewCategoryModal({ isVisible, onClose }: NewCategoryModalProps) {

    const toaster = useToast()

    const [isModalVisible, setIsModalVisible] = useState<boolean>(isVisible)

    const styles = makeStyles();

    const { control, handleSubmit, formState: { errors }, setError, setFocus } = useForm({
        defaultValues: {
            category_name: "",
        }
    })

    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [newCategory, setNewCategory] = useState({ name: '', color: CATEGORY_COLORS[0] });
    const [searchQuery, setSearchQuery] = useState('');

    const { showSnackbar } = useSnackbar();


    // const [categories, setCategories] = useState<Category[]>([
    //     { id: '1', name: 'Personal', color: '#FFD54F', noteCount: 5 },
    //     { id: '2', name: 'Work', color: '#4FC3F7', noteCount: 8 },
    //     { id: '3', name: 'Ideas', color: '#81C784', noteCount: 3 },
    //     { id: '4', name: 'Shopping', color: '#E57373', noteCount: 2 },
    // ]);


    const { mutate: addCategory, isPending, isError, isSuccess } = useAddCategoryMutation();

    const onSubmit = async (data: any) => {
        addCategory({ category_name: data.category_name, color: newCategory.color }, {
            onSuccess: async () => {
                showSnackbar("New Category Added", 'success')
                control._reset()
                onClose?.()
                // toaster.show({message: "New Category added", type: "success", position: "middle"})
            },
            onError: async (error) => {
                console.log("Error", error)
                if ((error?.message as any).includes('UNIQUE constraint failed')) {
                    setError('category_name', { message: 'This category already exists' })
                } else {
                    showSnackbar("Failed to add new category, try again", "error")
                }
            }
        })
    }


    const resetForm = () => {
        isVisible = false
        setIsModalVisible(true)
        // setIsModalVisible(false);
        // setEditingCategory(null);
        // setNewCategory({ name: '', color: CATEGORY_COLORS[0] });
    };

    {/* Add/Edit Category Modal */ }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            // onRequestClose={resetForm}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50" style={styles.modalOverlay}>
                <View className="bg-white rounded-xl p-6 w-11/12 max-w-md" style={styles.modalContainer}>
                    <Text className="text-xl font-bold text-gray-800 mb-4" style={styles.modalTitle}>
                        {editingCategory ? 'Edit Category' : 'New Category'}
                    </Text>

                    <Controller
                        control={control}
                        name="category_name"
                        rules={{ required: "Category name is required" }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                mode="outlined"
                                // activeOutlineColor="red"
                                // activeOutlineColor={newCategory.color ?? CATEGORY_COLORS[0]}
                                // textColor="red"
                                label="Category Name"
                                placeholder="Enter Category name"
                                value={value}
                                onChangeText={onChange}
                                right={<TextInput.Affix text={`${value.length}/100`} />}
                                maxLength={100}
                                style={{ ...styles.modalCategoryNameInput, outlineColor: newCategory.color }}
                                error={!!errors.category_name}
                            />
                        )}
                    />
                    {errors.category_name && <Text style={styles.errorLabel}>{errors.category_name.message}</Text>}

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
                            // onPress={resetForm}
                            onPress={onClose}
                        >
                            <Text className="text-gray-700" style={styles.modalCancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-blue-500 rounded-lg px-4 py-2 flex-row items-center"
                            style={styles.modalSaveButton}
                            // onPress={handleAddCategory}
                            onPress={handleSubmit(onSubmit)}
                        >

                            {
                                isPending ? <ActivityIndicator hidesWhenStopped={true} animating={isPending} color="white" /> :
                                    <>
                                        <Save size={16} color="white" className="mr-1" />
                                        <Text className="text-white" style={styles.modalSaveText}>
                                            {editingCategory ? 'Update' : 'Create'}
                                        </Text>
                                    </>
                            }

                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )


}


const makeStyles = (colors?: any) => StyleSheet.create({
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
        // borderWidth: 1,           // Tailwind 'border'
        borderColor: '#d1d5db',   // Tailwind 'border-gray-300'
        borderRadius: 8,           // Tailwind 'rounded-lg'
        // padding: 12,               // Tailwind 'p-3' (0.75rem = 12px)
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
    },
    errorLabel: {
        color: 'red',
        alignSelf: 'flex-start',
        marginBottom: 8,
        marginLeft: 4,
        fontSize: 13,
    },
})