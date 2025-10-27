import { default as Editor, default as RichEditor } from '@/components/dom-components/rich-editor';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    Palette,
    Save
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const IS_DOM = typeof Editor !== "undefined";

export default function NoteDetailScreen() {

    const styles = makeStyles();

    const router = useRouter();
    const params = useLocalSearchParams();

    const [editorState, setEditorState] = useState<string | null>(null);
    const [plainText, setPlainText] = useState("");

    // Mock note data - in a real app this would come from a database
    const mockNote = {
        id: params.id?.toString() || '1',
        title: params.title?.toString() || 'Meeting Notes',
        content: params.content?.toString() || 'Discuss project requirements with team\n- Review timeline\n- Assign tasks\n- Set milestones',
        color: params.color?.toString() || '#FFE599',
        createdAt: params.createdAt?.toString() || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const [note, setNote] = useState(mockNote);
    const [isEditing, setIsEditing] = useState(false);

    // Note colors for selection
    const noteColors = [
        '#FFE599', // Yellow
        '#A4C2F4', // Blue
        '#F9CB9C', // Orange
        '#B4A7D6', // Purple
        '#8FBC8F', // Green
        '#F9B7B7', // Red
        '#E6B8AF', // Pink
        '#D5A6BD', // Magenta
    ];

    const handleSave = () => {
        // In a real app, this would save to a database
        Alert.alert('Note Saved', 'Your note has been saved successfully!', [
            { text: 'OK', onPress: () => router.back() }
        ]);
    };

    const handleColorChange = (color: string) => {
        setNote({ ...note, color });
    };

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
                        <TextInput
                            className="text-white text-xl font-bold bg-transparent"
                            style={styles.titleInput}
                            value={note.title as string}
                            onChangeText={(text) => setNote({ ...note, title: text })}
                            placeholder="Note Title"
                            placeholderTextColor="#e0e0e0"
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleSave}
                        className="p-2 rounded-full bg-blue-600"
                        style={styles.saveButtonContainer}
                    >
                        <Save size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Color Selection */}
            <View className="py-3 px-4 bg-white border-b border-gray-200" style={styles.colorSelectionContainer}>
                <View className="flex-row items-center mb-2" style={styles.colorSelectionTitleContainer}>
                    <Palette size={20} color="#666" className="mr-2" style={{ marginRight: 8 }} />
                    <Text className="text-gray-700 font-medium" style={styles.colorSelectionTitle}>Note Color</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-16" style={styles.colorSelectionScrollView}>
                    <View className="flex-row gap-3" style={styles.colorsSelectionContainer}>
                        {noteColors.map((color, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleColorChange(color)}
                                className={`w-10 h-10 rounded-full border-2 ${note.color === color ? 'border-blue-500' : 'border-gray-300'}`}
                                style={{ ...styles.colorCircle, backgroundColor: color, borderColor: note.color === color ? '#3b82f6' : '#d1d5db' }}
                            // style={{ backgroundColor: color }}
                            />
                        ))}
                    </View>
                </ScrollView>
            </View>

            {/* Formatting Toolbar */}
            {/* <View className="flex-row items-center bg-white py-2 px-4 border-b border-gray-200">
                <TouchableOpacity className="p-2 rounded-md bg-gray-100 mr-2">
                    <Bold size={20} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2 rounded-md bg-gray-100 mr-2">
                    <Italic size={20} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2 rounded-md bg-gray-100 mr-2">
                    <Underline size={20} color="#333" />
                </TouchableOpacity>
                <View className="h-6 w-px bg-gray-300 mx-2" />
                <TouchableOpacity className="p-2 rounded-md bg-gray-100 mr-2">
                    <AlignLeft size={20} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2 rounded-md bg-gray-100 mr-2">
                    <AlignCenter size={20} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2 rounded-md bg-gray-100">
                    <AlignRight size={20} color="#333" />
                </TouchableOpacity>
            </View> */}

            {/* Note Content Editor */}
            <ScrollView className="flex-1 p-4">
                <RichEditor setPlainText={setPlainText} setEditorState={setEditorState} />
                {/* <TextInput
                    className="text-base text-gray-800 bg-transparent"
                    value={note.content}
                    onChangeText={(text) => setNote({ ...note, content: text })}
                    placeholder="Start typing your note here..."
                    placeholderTextColor="#aaa"
                    multiline
                    textAlignVertical="top"
                    style={{
                        minHeight: 300,
                        backgroundColor: note.color,
                        borderRadius: 12,
                        padding: 16,
                    }}
                /> */}
            </ScrollView>

            {/* Footer with metadata */}
            <View className="bg-white py-3 px-4 border-t border-gray-200">
                <View className="flex-row justify-between">
                    <Text className="text-gray-500 text-sm">
                        Created: {new Date(note.createdAt).toLocaleDateString()}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                        Last edited: {new Date(note.updatedAt).toLocaleDateString()}
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
    }


})