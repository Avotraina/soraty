import { CircleAlert, Delete } from "lucide-react-native";
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSnackbar } from "../../contexts/snackbar-provider";
import { useDeleteCategoryMutation } from "../../features/categories/category.query";

type EditCategoryModalProps = {
    isVisible: boolean;
    onClose?: () => void;
    categoryId: string;
    isEmpty: boolean
    // Add any other props you want to pass
};

export default function DeleteCategoryConfirmation({ isVisible, onClose, categoryId, isEmpty }: EditCategoryModalProps) {

    const styles = makeStyles();

    const { showSnackbar } = useSnackbar();


    const { mutate: deleteCategory, isPending } = useDeleteCategoryMutation();

    const handleDelete = () => {
        deleteCategory(categoryId, {
            onSuccess: async () => {
                showSnackbar("Deleted", 'success')
                onClose?.()
                // toaster.show({message: "New Category added", type: "success", position: "middle"})
            },
            onError: async (error) => {
                console.log("Error", error)
                showSnackbar("Failed to delete this category, try again", "error")
            }
        })
    }

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
                        {/* {editingCategory ? 'Edit Category' : 'New Category'} */}
                        Delete { }
                    </Text>

                    <View style={styles.modalContentContainer}>
                        <CircleAlert color={'red'} />
                        <Text style={styles.modalContentText}>
                            {isEmpty ? 'Do you really want to delete this category' : 'This Category is not empty, do you really want to delete it with all notes inside?'}

                        </Text>
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
                            // onPress={handleSubmit(onSubmit)}
                            onPress={() => handleDelete()}
                        >
                            {/* <Text className="text-white" style={styles.modalSaveText}>Confirm</Text> */}

                            {
                                isPending ? <ActivityIndicator hidesWhenStopped={true} animating={isPending} color="white" /> :
                                    <>
                                        <Delete size={16} color="white" className="mr-1" />
                                        <Text className="text-white" style={styles.modalSaveText}>
                                            {/* {editingCategory ? 'Update' : 'Create'} */}
                                            Confirm
                                        </Text>
                                    </>
                            }

                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

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
        // gap: 8
    },
    modalTitle: {
        fontSize: 20,           // Tailwind 'text-xl'
        fontWeight: '700',       // Tailwind 'font-bold'
        color: '#1f2937',        // Tailwind 'text-gray-800'
        marginBottom: 16,        // Tailwind 'mb-4' (1rem = 16px)
    },
    modalContentContainer: {
        // flex: 1
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        marginBottom: 16

    },
    modalContentText: {
        // flex: 1,
        fontSize: 16,
        // marginBottom: 16
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
        backgroundColor: '#f63b3bff', // Tailwind 'bg-blue-500'
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
})