import { useSnackbar } from "@/app/contexts/snackbar-provider";
import { useUpdateCategoryMutation } from "@/app/features/categories/category.query";
import { CustomColors } from "@/app/theme/colors";
import { Check, Save } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, TextInput, useTheme } from "react-native-paper";
import { useToast } from "react-native-paper-toast";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { ThemedInput } from "../themed/themed-input";
import { ThemedText } from "../themed/themed-text";



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
    note_count: string;
    noteCount: number;

};

type EditCategoryModalProps = {
    isVisible: boolean;
    onClose?: () => void;
    initialValue: {
        id: string;
        category_name: string;
        color: string;
    }
    // Add any other props you want to pass
};

export default function EditCategoryModal({ isVisible, onClose, initialValue }: EditCategoryModalProps) {

    console.log('initial value', initialValue)

    const toaster = useToast()

    const [isModalVisible, setIsModalVisible] = useState<boolean>(isVisible)

    const { colors } = useTheme();
    const styles = makeStyles(colors as CustomColors & MD3Colors);

    const { control, handleSubmit, formState: { errors }, setError, setFocus, reset } = useForm({
        defaultValues: {
            // id: initialValue.id,
            category_name: initialValue?.category_name ?? '',
            // color: initialValue.color
        }
    })

    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [newCategory, setNewCategory] = useState({ name: '', color: CATEGORY_COLORS[0] });

    const { showSnackbar } = useSnackbar();


    // const { mutate: addCategory, isPending, isError, isSuccess } = useAddCategoryMutation();

    const { mutate: updateCategory, isPending, isError, isSuccess } = useUpdateCategoryMutation()

    // 🧠 Reset form when modal opens or initialValue changes
    useEffect(() => {
        if (isVisible && initialValue) {
            reset({
                category_name: initialValue.category_name,
            });
            setNewCategory({ name: initialValue.category_name, color: initialValue.color });
        }
    }, [isVisible, initialValue, reset]);


    const onSubmit = async (data: any) => {
        updateCategory({ id: initialValue.id, category_name: data.category_name, color: newCategory.color }, {
            onSuccess: async () => {
                showSnackbar("Updated", 'success')
                control._reset()
                onClose?.()
                // toaster.show({message: "New Category added", type: "success", position: "middle"})
            },
            onError: async (error) => {
                console.log("Error", error)
                if ((error?.message as any).includes('UNIQUE constraint failed')) {
                    setError('category_name', { message: 'This category already exists' })
                } else {
                    showSnackbar("Failed to edit this category, try again", "error")
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
                    <ThemedText type="subtitle" className="text-xl font-bold text-gray-800 mb-4" style={styles.modalTitle}>
                        {/* {editingCategory ? 'Edit Category' : 'New Category'} */}
                        Edit Category
                    </ThemedText>

                    <Controller
                        control={control}
                        name="category_name"
                        rules={{ required: "Category name is required" }}
                        render={({ field: { onChange, value } }) => (
                            <ThemedInput
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

                    <ThemedText type="normalSemiBold" className="font-semibold text-gray-700 mb-2" style={styles.categoryModalColorTitle}>Color</ThemedText>
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
                            <ThemedText className="text-gray-700" style={styles.modalCancelText}>Cancel</ThemedText>
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
                                        <Save size={16} color={colors.onPrimary} className="mr-1" />
                                        <ThemedText type="defaultSemiBold" className="text-white" style={styles.modalSaveText}>
                                            {/* {editingCategory ? 'Update' : 'Create'} */}
                                            Save
                                        </ThemedText>
                                    </>
                            }

                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )


}


const makeStyles = (colors: CustomColors & MD3Colors) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backdrop,

    },
    modalContainer: {
        backgroundColor: colors.surface,

        borderRadius: 12,
        padding: 24,
        width: '91.666667%',   // 11/12 in percentage
        maxWidth: 448,         // Tailwind 'max-w-md' = 28rem = 448px
    },
    modalTitle: {
        marginBottom: 16,        // Tailwind 'mb-4' (1rem = 16px)
        color: colors.onSurface,
    },
    modalCategoryNameInput: {
        // borderWidth: 1,           // Tailwind 'border'
        // borderColor: '#d1d5db',   // Tailwind 'border-gray-300'
        borderRadius: 8,           // Tailwind 'rounded-lg'
        // padding: 12,               // Tailwind 'p-3' (0.75rem = 12px)
        marginBottom: 16,          // Tailwind 'mb-4' (1rem = 16px)
    },
    categoryModalColorTitle: {
        marginBottom: 8,          // Tailwind 'mb-2' (0.5rem = 8px)
        color: colors.onSurface,         // Tailwind 'mb-2' (0.5rem = 8px)
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
        backgroundColor: colors.surfaceVariant,
        borderRadius: 8,             // Tailwind 'rounded-lg'
        paddingHorizontal: 16,       // Tailwind 'px-4' (1rem = 16px)
        paddingVertical: 8,          // Tailwind 'py-2' (0.5rem = 8px)
        marginRight: 8,   
    },
    modalCancelText: {
        color: colors.onSurface,
    },
    modalSaveButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,             // Tailwind 'rounded-lg'
        paddingHorizontal: 16,       // Tailwind 'px-4' (1rem = 16px)
        paddingVertical: 8,          // Tailwind 'py-2' (0.5rem = 8px)
        flexDirection: 'row',        // Tailwind 'flex-row'
        alignItems: 'center',        // Tailwind 'items-center',
        gap: 4
    },
    modalSaveText: {
        color: colors.onPrimary,
    },
    errorLabel: {
        color: colors.error,
        alignSelf: 'flex-start',
        marginBottom: 8,
        marginLeft: 4,
        fontSize: 13,
    },
})