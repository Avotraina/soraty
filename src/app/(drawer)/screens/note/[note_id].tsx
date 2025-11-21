import RichEditor, { default as Editor } from '@/src/app/components/dom-components/rich-editor';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    Save
} from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ColorSelect, { COLORS } from '@/src/app/components/color/color-select';
import { Controller, useForm } from 'react-hook-form';
import { TextInput } from 'react-native-paper';
// import CategorySelect from '@/src/app/components/note/category-select';
import ExampleTheme from "@//src/app/components/dom-components/example-theme";
import CategorySelect from '@/src/app/(drawer)/screens/note/components/category-select';
import { useSnackbar } from '@/src/app/contexts/snackbar-provider';
import { useAddNoteMutation } from '@/src/app/features/notes/note.query';

const placeholder = "Enter some rich text...";

const editorConfig = {
    namespace: "React.js Demo",
    nodes: [],
    // Handling of errors during update
    onError(error: Error) {
        throw error;
    },
    // The editor theme
    theme: ExampleTheme,
    // theme: {},
};

const IS_DOM = typeof Editor !== "undefined";

const initialConfig = {
    namespace: "MyEditor",
    theme: {},
    onError: (error: Error) => console.error(error),
};

export type editorStyle = {
    editorStyle: React.CSSProperties;
}

type Category = {
    id: string;
    category_name: string;
    color: string;
};

export default function EditNoteScreen() {

    const styles = makeStyles();

    const router = useRouter();
    const params = useLocalSearchParams();

    const [editorState, setEditorState] = useState<string | null>(null);
    const [plainText, setPlainText] = useState("");
    const [json, setJson] = useState(null);


    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(COLORS[0]);


    const { showSnackbar } = useSnackbar();



    const { control, handleSubmit, formState: { errors }, setError, setFocus, getValues, reset } = useForm({
        defaultValues: {
            note_title: "New note",
            note_content: "",
            category_id: null,
            color: ""
        }
    })

    const { mutate: addNote, isPending, isError, isSuccess } = useAddNoteMutation();

    const onSubmit = async (data: any) => {

        console.log("JSON", json)
        // return

        // addNote({ note_title: data.note_title, color: data.color, note_content: data.note_content, category_id: data.category_id }, {
        addNote({ note_title: data.note_title, color: data.color, note_content: JSON.stringify(json), category_id: data.category_id }, {
            onSuccess: async () => {
                showSnackbar("New Note Added", 'success')
                reset()
            },
            onError: async (error) => {
                console.log("Error", error)
                showSnackbar("Failed to add new note, try again", "error")
            }
        })
    }



    return (
        <View className="flex-1 bg-gray-50" style={styles.container}>
            {/* Header */}
            <View className="bg-blue-500 py-4 px-4 shadow-md" style={styles.headerContainer}>
                <View className="flex-row items-center justify-between" style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="p-2 rounded-full bg-blue-600"
                        style={styles.backButtonContainer}
                    >
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>

                    <View className="flex-1 px-4" style={styles.titleContainer}>
                        <Controller
                            control={control}
                            name="note_title"
                            rules={{ required: "Title is required" }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    className="text-white text-xl font-bold bg-transparent"
                                    style={styles.titleInput}
                                    value={value}
                                    // onChangeText={(text) => setNote({ ...note, title: text })}
                                    onChangeText={onChange}
                                    placeholder="Note Title"
                                    placeholderTextColor="#e0e0e0"
                                    error={!!errors.note_title}
                                />
                            )}

                        />

                    </View>

                    <TouchableOpacity
                        // onPress={handleSave}
                        // onPress={handleSubmit(handleSave)}
                        onPress={handleSubmit(onSubmit)}
                        className="p-2 rounded-full bg-blue-600"
                        style={styles.saveButtonContainer}
                    >
                        <Save size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Color Selection */}
            <Controller
                control={control}
                name="color"
                rules={{}}
                render={({ field: { onChange, value } }) => (
                    <ColorSelect currentColor={value} onSelectColor={(color) => {
                        setSelectedColor(color);  // update local state
                        onChange(color);          // update React Hook Form
                    }} value={value} />
                )}

            />
            {/* <ColorSelect currentColor={selectedColor} onSelectColor={setSelectedColor} /> */}

            {/* Category Selection */}

            {/* Color Selection */}
            <Controller
                control={control}
                name="category_id"
                rules={{}}
                render={({ field: { onChange, value } }) => (
                    <CategorySelect currentCategory={selectedCategory} onSelectCategory={(category) => {
                        setSelectedCategory(category);
                        onChange(category?.id || null)
                    }} />
                )}

            />
            {/* <CategorySelect currentCategory={selectedCategory} onSelectCategory={setSelectedCategory} /> */}


            <View style={{ backgroundColor: 'black', borderRadius: 12, overflow: 'hidden', flex: 1 }}>

                <Controller
                    control={control}
                    name="note_content"
                    rules={{}}
                    render={({ field: { onChange, value } }) => (
                        <RichEditor setPlainText={setPlainText} setEditorState={setEditorState} editorBackgroundColor={selectedColor} onChange={onChange} value={value} setJson={setJson}/>
                    )}
                />

                {/* <RichEditor setPlainText={setPlainText} setEditorState={setEditorState} editorBackgroundColor={selectedColor} /> */}
            </View>

            {/* Footer with metadata */}
            <View className="bg-white py-3 px-4 border-t border-gray-200" style={styles.footerContainer}>
                <View className="flex-row justify-between" style={styles.footer}>
                    <Text className="text-gray-500 text-sm" style={styles.createdAtText}>
                        {/* Created: {new Date(note.createdAt).toLocaleDateString()} */}
                    </Text>
                    <Text className="text-gray-500 text-sm" style={styles.updatedAtText}>
                        {/* Last edited: {new Date(note.updatedAt).toLocaleDateString()} */}
                    </Text>
                </View>
            </View>

        </View>
    );
}

const makeStyles = (colors?: any) => StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        // display: 'flex',
        // overflow: 'hidden',
    },
    headerContainer: {
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        paddingHorizontal: 16,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButtonContainer: {
        padding: 8,
        borderRadius: 9999,
        backgroundColor: '#2563eb',
    },
    titleContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    titleInput: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: 'transparent',
    },
    saveButtonContainer: {
        padding: 8,
        borderRadius: 9999,
        backgroundColor: '#2563eb',
    },
    colorSelectionContainer: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    colorSelectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    colorSelectionTitle: {
        fontSize: 16,
        color: '#4b5563',
    },
    colorSelectionScrollView: {
        maxHeight: 64,
    },
    colorsSelectionContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 0.8,
    },
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
    footerContainer: {
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    createdAtText: {
        fontSize: 12,
        color: '#6b7280',
    },
    updatedAtText: {
        fontSize: 12,
        color: '#6b7280',
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