import RichEditor, { default as Editor } from '@/src/app/components/dom-components/rich-editor';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    Check,
    Save,
    Trash
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ColorSelect, { COLORS } from '@/src/app/components/color/color-select';
import ExampleTheme from "@/src/app/components/dom-components/example-theme";
import CategorySelect from '@/src/app/components/note/category-select';
import NoteReminderTimeSelect from '@/src/app/components/note/reminder/note-reminder-select';
import { useSnackbar } from '@/src/app/contexts/snackbar-provider';
import { useAddNoteMutation, useGetNoteByIdQuery, useUpdateNoteMutation } from '@/src/app/features/notes/note.query';
import { CustomColors } from '@/src/app/theme/colors';
import { useForm } from '@tanstack/react-form';
import { TextInput, useTheme } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

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

export default function NoteDetailScreen() {

    const { colors } = useTheme();
    const styles = makeStyles(colors as CustomColors & MD3Colors);

    const router = useRouter();
    const { note_id } = useLocalSearchParams();

    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSub = Keyboard.addListener("keyboardDidShow", () =>
            setKeyboardVisible(true)
        );
        const hideSub = Keyboard.addListener("keyboardDidHide", () =>
            setKeyboardVisible(false)
        );

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const [editorState, setEditorState] = useState<string | null>(null);
    const [plainText, setPlainText] = useState("");
    const [json, setJson] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(COLORS[0]);

    const { showSnackbar } = useSnackbar();

    console.log("PARAMS", note_id);

    const { data: noteData, isLoading } = useGetNoteByIdQuery(note_id as string);

    console.log("NOTE DATA", noteData);

    const { mutate: addNote, isPending } = useAddNoteMutation();

    const { mutate: updateNote, isSuccess } = useUpdateNoteMutation()

    // Initialize TanStack Form with default values
    const [reminderValue, setReminderValue] = useState<{ date: string | null; time: string | null }>({ date: null, time: null });

    const form = useForm({
        defaultValues: {
            note_title: noteData?.note_title || '',
            note_content: noteData?.note_content || '',
            category_id: noteData?.category_id || null,
            color: noteData?.color || COLORS[0],
            reminder: { date: noteData?.reminder_date || null, time: noteData?.reminder_time || null }
        },
        onSubmit: async ({ value }) => {
            console.log("FORM DATA", value);
            console.log("EDITOR JSON", json);


            updateNote(
                {
                    note: {
                        id: note_id as string,
                        note_title: value.note_title,
                        // note_content: value.note_content,
                        note_content: json ? JSON.stringify(json) : '',
                        color: value.color,
                        // category: value.category_id,
                        category_id: value.category_id,
                    },
                    reminder: {
                        reminder_date: value.reminder.date,
                        reminder_time: value.reminder.time
                    }
                }, {
                onSuccess: async () => {
                    showSnackbar("Note Updated", 'success');
                },
                onError: async (error) => {
                    console.log("Error", error)
                    showSnackbar("Failed to edit this note, try again", "error")
                }
            }

            )

        },
    });

    // Patch form values when noteData arrives from the server
    useEffect(() => {
        if (!noteData) return;

        const parsedContent = (() => {
            try {
                return JSON.parse(noteData.note_content as string);
            } catch (e) {
                return noteData.note_content;
            }
        })();

        // Update form field values
        form.setFieldValue('note_title', noteData.note_title || '');
        form.setFieldValue('note_content', noteData.note_content || '');
        form.setFieldValue('color', noteData.color || COLORS[0]);
        form.setFieldValue('category_id', noteData.category_id || null);
        const reminderPayload = {
            date: noteData.reminder_date || null,
            time: noteData.reminder_time || null,
        };
        setReminderValue(reminderPayload);
        // Patch the TanStack form `reminder` field so form values reflect DB columns
        try {
            form.setFieldValue('reminder', reminderPayload);
        } catch (e) {
            // Defensive: if the form isn't ready yet, still keep local reminderValue
            console.debug('Failed to set form.reminder:', e);
        }

        // Initialize editor/json and selection states
        setJson(parsedContent);
        setEditorState(typeof noteData.note_content === 'string' ? noteData.note_content : null);
        setSelectedColor(noteData?.color || COLORS[0]);
        if (noteData.category_id) {
            setSelectedCategory({
                id: noteData.category_id,
                category_name: noteData.category_name || '',
                color: noteData.category_color || '#000'
            });
        } else {
            setSelectedCategory(null);
        }
    }, [noteData]);

    if (isLoading) {
        return <View><Text>Loading...</Text></View>
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
                        <form.Field
                            name="note_title"
                            validators={{
                                onBlur: ({ value }) =>
                                    value === '' ? 'Title is required' : undefined,
                            }}
                            children={(field) => (
                                <TextInput
                                    className="text-white text-xl font-bold bg-transparent"
                                    style={styles.titleInput}
                                    value={field.state.value}
                                    onChangeText={(text) => field.handleChange(text)}
                                    onBlur={field.handleBlur}
                                    placeholder="Note Title"
                                    placeholderTextColor="#e0e0e0"
                                    error={!!field.state.meta.errors.length}
                                />
                            )}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => form.handleSubmit()}
                        className="p-2 rounded-full bg-blue-600"
                        style={styles.saveButtonContainer}
                    >
                        <Save size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Color Selection */}
            <form.Field
                name="color"
                children={(field) => (
                    <ColorSelect
                        currentColor={field.state.value}
                        onSelectColor={(color) => {
                            setSelectedColor(color);
                            field.handleChange((color as string) || COLORS[0]);
                        }}
                        value={field.state.value}
                    />
                )}
            />
            {/* <ColorSelect currentColor={selectedColor} onSelectColor={setSelectedColor} /> */}

            {/* Category Selection */}
            <form.Field
                name="category_id"
                children={(field) => (
                    <CategorySelect
                        currentCategory={selectedCategory}
                        onSelectCategory={(category) => {
                            setSelectedCategory(category);
                            field.handleChange(category?.id || null);
                        }}
                    />
                )}
            />


            {/* Date and Time Selection */}
            <form.Field
                name="reminder"
                validators={{
                    onChange: (field) => {
                        const { date, time } = field.value || {};
                        const hasDate = Boolean(date);
                        const hasTime = Boolean(time);
                        if (hasDate && !hasTime) return "Time is required when date is selected";
                        if (hasTime && !hasDate) return "Date is required when time is selected";

                        // return true;
                    }
                }}
            >
                {(field) => (
                    <NoteReminderTimeSelect
                        value={field.state.value ?? { date: null, time: null }}
                        onChange={(newReminder) => {
                            const payload = {
                                date: newReminder?.date ? new Date(newReminder.date).toDateString() : null,
                                time: newReminder?.time ?? null,
                            };
                            // keep local UI state in sync
                            setReminderValue(payload);
                            // update form state so `form.handleSubmit()` gets the value
                            try {
                                field.handleChange(payload as any);
                            } catch (e) {
                                console.debug('Failed to call field.handleChange for reminder:', e);
                            }
                        }}
                        submitCount={field.state.meta.isTouched ? 1 : 0}
                        // error={field.state.meta.errors[0]}
                        error={field.state.meta.errors.length > 0 ? field.state.meta.errors[0] : null}
                    // isSubmitSuccessful={field.state.meta.isValid}
                    />
                )}

            </form.Field>



            <View style={{ backgroundColor: 'black', borderRadius: 12, overflow: 'hidden', flex: 1 }}>
                <form.Field
                    name="note_content"
                    children={(field) => (
                        <RichEditor
                            setPlainText={setPlainText}
                            setEditorState={setEditorState}
                            editorBackgroundColor={selectedColor}
                            onChange={(content) => field.handleChange((content as string) || '')}
                            value={field.state.value}
                            setJson={setJson}
                        />
                    )}
                />
            </View>

            {/* Footer with metadata */}
            {/* <View className="bg-white py-3 px-4 border-t border-gray-200" style={styles.footerContainer}>
                <View className="flex-row justify-between" style={styles.footer}>
                    <Text className="text-gray-500 text-sm" style={styles.createdAtText}>
                        Created: {new Date(note.createdAt).toLocaleDateString()}
                    </Text>
                    <Text className="text-gray-500 text-sm" style={styles.updatedAtText}>
                        Last edited: {new Date(note.updatedAt).toLocaleDateString()}
                    </Text>
                </View>
            </View> */}
            {!keyboardVisible && (
                <FAB onConfirm={() => form.handleSubmit()} onDelete={() => { }} />
            )}

        </View>
    );
}

type FABProps = {
    onConfirm?: () => void;
    onDelete?: () => void;
};


function FAB({ onConfirm, onDelete }: FABProps) {
    const { colors } = useTheme();
    const styles = makeStyles(colors as CustomColors & MD3Colors);


    return (
        <View style={styles.fabContainer}>
            <TouchableOpacity style={styles.fabConfirmButton} onPress={onConfirm}>
                <Check size={24} color={colors.background} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.fabDeleteButton} onPress={onDelete}>
                <Trash size={24} color={'#dc2626'} />
            </TouchableOpacity>
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
        paddingVertical: 8,
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
    },
    fabContainer: {
        position: 'absolute',
        bottom: 32,
        right: 32,
        flexDirection: 'column',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        // width: 'auto'
    },
    fabConfirmButton: {
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        // backgroundColor: '#fee2e2',
        backgroundColor: colors.primary,
        width: 56,
        aspectRatio: 1 / 1,
    },
    fabDeleteButton: {
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        backgroundColor: '#fee2e2',
        width: 56,
        aspectRatio: 1 / 1,
    },

})