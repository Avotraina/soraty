"use dom"

// import { useEditorBridge } from '@10play/tentap-editor';
import { useRouter } from 'expo-router';
import { Calendar, Filter, Plus, Save, Search, Settings, Trash2, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import Editor from './webviews/rich-editor';

// const IS_DOM = typeof Editor !== "undefined";

// Define types
type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: Date;
};

const initialConfig = {
  namespace: 'MyEditor',
  nodes: [],
  theme: {
    // paragraph: { marginBottom: 12 },
    // text: { color: '#000' },
  },
  onError: (error: Error) => {
    console.error(error);
  },
};

// Predefined colors for post-it notes
const NOTE_COLORS = [
  { name: 'Yellow', value: '#FFF9C4' },
  { name: 'Blue', value: '#BBDEFB' },
  { name: 'Green', value: '#C8E6C9' },
  { name: 'Pink', value: '#F8BBD0' },
  { name: 'Purple', value: '#E1BEE7' },
  { name: 'Orange', value: '#FFE0B2' },
];

function PostItListScreen() {

  // const { colors } = useTheme();

  // const styles = makeStyles(colors as CustomColors & MD3Colors);
  const styles = makeStyles();

  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Meeting Notes',
      content: 'Discuss project timeline with team',
      color: '#FFF9C4',
      createdAt: new Date(2023, 5, 15),
    },
    {
      id: '2',
      title: 'Shopping List',
      content: 'Milk, Eggs, Bread, Fruits',
      color: '#BBDEFB',
      createdAt: new Date(2023, 5, 12),
    },
    {
      id: '3',
      title: 'Ideas',
      content: 'New app features to implement',
      color: '#C8E6C9',
      createdAt: new Date(2023, 5, 10),
    },
    {
      id: '4',
      title: 'Reminders',
      content: 'Call mom on Sunday',
      color: '#F8BBD0',
      createdAt: new Date(2023, 5, 18),
    },
    {
      id: '5',
      title: 'Remindersdddd',
      content: 'Call mom on Sunday',
      color: '#F8BBD0',
      createdAt: new Date(2023, 5, 18),
    },
    {
      id: '6',
      title: 'Remindersdddd',
      content: 'Call mom on Sunday',
      color: '#F8BBD0',
      createdAt: new Date(2023, 5, 18),
    },
    {
      id: '',
      title: 'Remindersdddd',
      content: 'Call mom on Sunday',
      color: '#F8BBD0',
      createdAt: new Date(2023, 5, 18),
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FFF9C4');
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterColor, setFilterColor] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleAddNote = () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title,
        content: newNote.content,
        color: selectedColor,
        createdAt: new Date(),
      };
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '' });
      setModalVisible(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // Filter and search notes
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesColor = filterColor ? note.color === filterColor : true;

      const matchesDate = filterDate ?
        note.createdAt.toDateString() === new Date(filterDate).toDateString() :
        true;

      return matchesSearch && matchesColor && matchesDate;
    });
  }, [notes, searchQuery, filterColor, filterDate]);

  // const editor = useEditorBridge({
  //   // autofocus: true,
  //   // avoidIosKeyboard: true,
  //   // initialContent: 'Start editing!',
  // });

  const handleChange = (editorState: any) => {
    editorState.read(() => {
      const json = editorState.toJSON();
      console.log(json); // store this in your notes
    });
    // editorState.read(() => {
    //   const root = $getRoot();
    //   // onChange(root.getText()); // simple text extraction; can use JSON for full rich text
    // });
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      className="rounded-xl p-4 m-2 shadow-md"
      activeOpacity={0.9}
      style={{ ...styles.noteContainer, backgroundColor: item.color, minHeight: 150 }}
    >
      <View className="flex-row justify-between items-start" style={styles.noteHeaderContainer}>
        <Text className="text-lg font-bold text-gray-800 mb-2" style={styles.noteHeaderTitle} numberOfLines={1}>
          {item.title || 'Untitled'}
        </Text>
        <TouchableOpacity onPress={() => handleDeleteNote(item.id)} style={styles.noteHeaderIconsContainer}>
          <Trash2 size={18} color="#666" />
        </TouchableOpacity>
      </View>
      <Text className="text-gray-700 mb-3" numberOfLines={4} style={styles.noteContentText}>
        {item.content}
      </Text>
      <Text className="text-xs text-gray-500 mt-auto" style={styles.noteFooterText}>
        {item.createdAt.toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );


  const [editorState, setEditorState] = useState<string | null>(null);
  const [plainText, setPlainText] = useState("");

  return (
    <View className="flex-1 bg-gray-100" style={styles.container}>
      {/* Header */}
      <View className="bg-white py-4 px-4 shadow-sm" style={styles.headerContainer}>
        <View className="flex-row justify-between items-center" style={styles.header}>
          <Text className="text-2xl font-bold text-gray-800" style={styles.headerTitle}>My Notes</Text>
          <View className="flex-row" style={styles.headerButtonsContainer}>
            <TouchableOpacity
              className="mr-4 p-2 rounded-full bg-blue-100"
              style={{ ...styles.headerButtonContainer }}
            //   onPress={() => router.push('/settings')}
            >
              <Settings size={20} color="#4A90E2" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 rounded-full bg-blue-100"
              style={{ ...styles.headerButtonContainer }}
              onPress={() => setModalVisible(true)}
            >
              <Plus size={20} color="#4A90E2" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search and Filters */}
      <View className="bg-white py-3 px-4" style={styles.searchFilterContainer}>
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-3 mb-3" style={styles.searchContainer}>
          <Search size={20} color="#999" />
          <TextInput
            className="flex-1 py-3 px-2"
            style={styles.searchInput}
            placeholder="Search notes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Button */}
        <View className="flex-row justify-between items-center" style={styles.filtersContainer}>
          <TouchableOpacity
            className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2"
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} color="#666" />
            <Text className="ml-2 text-gray-700" style={styles.filterButtonText}>Filters</Text>
          </TouchableOpacity>

          {/* Active Filters Indicator */}
          {(filterColor || filterDate) && (
            <View className="flex-row" style={styles.activeFiltersContainer}>
              {filterColor && (
                <View
                  className="flex-row items-center bg-blue-100 rounded-full px-3 py-1 mr-2"
                  style={styles.activeColorFilterContainer}
                >
                  <View
                    className="w-3 h-3 rounded-full mr-1"
                    style={{ ...styles.activeColorCircle, backgroundColor: filterColor }}
                  />
                  <Text className="text-xs text-blue-800" style={styles.activeColorText}>Color</Text>
                </View>
              )}
              {filterDate && (
                <View
                  className="flex-row items-center bg-green-100 rounded-full px-3 py-1"
                  style={styles.activeDateFilterContainer}
                >
                  <Calendar size={12} color="#065f46" />
                  <Text className="text-xs text-green-800 ml-1" style={styles.activeDateFilterText}>Date</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Filter Options */}
        {showFilters && (
          <View className="mt-3" style={styles.filtersOptionsContainer}>
            {/* Color Filters */}
            <Text className="font-semibold text-gray-700 mb-2" style={styles.colorFilterHeaderText}>Filter by Color:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={true} className="mb-3" style={styles.colorFilterOptionsScrollContainer}>
              <View className="flex-row" style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  className={`rounded-full px-3 py-1 mr-2 ${!filterColor ? 'bg-blue-500' : 'bg-gray-200'}`}
                  style={{ ...styles.colorFilterAllOptionContainer, backgroundColor: !filterColor ? '#3b82f6' : '#e5e7eb' }}
                  onPress={() => setFilterColor(null)}
                >
                  <Text className={!filterColor ? 'text-white' : 'text-gray-700'} style={{ color: !filterColor ? '#fff' : '#4b5563' }}>All</Text>
                </TouchableOpacity>

                {NOTE_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color.value}
                    className={`flex-row items-center rounded-full px-3 py-1 mr-2 ${filterColor === color.value ? 'bg-blue-500' : 'bg-gray-200'}`}
                    style={{ ...styles.colorFilterOptionsContainer, backgroundColor: filterColor === color.value ? '#3b82f6' : '#e5e7eb' }}
                    onPress={() => setFilterColor(filterColor === color.value ? null : color.value)}
                  >
                    <View
                      className="w-3 h-3 rounded-full mr-1"
                      style={{ ...styles.colorFilterOptionsCircle, backgroundColor: color.value }}
                    />
                    <Text className={filterColor === color.value ? 'text-white' : 'text-gray-700'} style={{ color: filterColor === color.value ? '#fff' : '#4b5563' }}>
                      {color.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Date Filters */}
            <Text className="font-semibold text-gray-700 mb-2" style={styles.dateFilterHeaderText}>Filter by Date:</Text>
            <View className="flex-row flex-wrap" style={styles.dateFilterHeaderContainer}>
              <TouchableOpacity
                className={`rounded-full px-3 py-1 mr-2 mb-2 ${!filterDate ? 'bg-blue-500' : 'bg-gray-200'}`}
                style={{ ...styles.colorDateAllOptionContainer, backgroundColor: !filterDate ? '#3b82f6' : '#e5e7eb' }}
                onPress={() => setFilterDate(null)}
              >
                <Text className={!filterDate ? 'text-white' : 'text-gray-700'} style={{ color: !filterDate ? '#fff' : '#4b5563' }}>All Dates</Text>
              </TouchableOpacity>

              {[...new Set(notes.map(note => note.createdAt.toDateString()))]
                .map(dateStr => new Date(dateStr))
                .sort((a, b) => b.getTime() - a.getTime())
                .slice(0, 5)
                .map((date, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`rounded-full px-3 py-1 mr-2 mb-2 ${filterDate === date.toDateString() ? 'bg-blue-500' : 'bg-gray-200'}`}
                    style={{ ...styles.dateFilterOptionsContainer, backgroundColor: filterDate === date.toDateString() ? '#3b82f6' : '#e5e7eb' }}
                    onPress={() => setFilterDate(filterDate === date.toDateString() ? null : date.toDateString())}
                  >
                    <Text className={filterDate === date.toDateString() ? 'text-white' : 'text-gray-700'} style={{ color: filterDate === date.toDateString() ? '#fff' : '#4b5563' }}>
                      {date.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                ))
              }
            </View>

            {/* Clear Filters Button */}
            {(filterColor || filterDate) && (
              <TouchableOpacity
                className="self-start bg-red-100 rounded-full px-3 py-1 mt-2"
                style={styles.clearFilterButton}
                onPress={() => {
                  setFilterColor(null);
                  setFilterDate(null);
                }}
              >
                <Text className="text-red-700" style={styles.clearFilterButtonText}>Clear Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Notes List */}
      <FlatList
        data={filteredNotes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        className="px-2 pt-2"
        style={{ paddingHorizontal: 8, paddingVertical: 8, flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10" style={styles.noteListEmptyContainer}>
            <Text className="text-gray-500 text-lg" style={styles.noteListEmptyTitleText}>No notes found</Text>
            <Text className="text-gray-400 mt-1" style={styles.noteListEmptySubtitleText}>Try adjusting your search or filters</Text>
          </View>
        }
      />


      {/* Add Note Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50" style={styles.addNoteModalOverlay}>
          <View className="bg-white rounded-xl p-6 w-11/12 max-w-md" style={styles.addNoteModalContainer}>
            <Text className="text-xl font-bold text-gray-800 mb-4" style={styles.addNoteModalHeaderText}>New Note</Text>

            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4"
              placeholder="Title"
              value={newNote.title}
              onChangeText={(text) => setNewNote({ ...newNote, title: text })}
            />

            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4 h-32"
              placeholder="Content"
              multiline
              textAlignVertical="top"
              value={newNote.content}
              onChangeText={(text) => setNewNote({ ...newNote, content: text })}
            />

            <Text className="font-semibold text-gray-700 mb-2">Color</Text>
            {/* <LexicalComposer initialConfig={initialConfig}>
              <RichTextPlugin
                contentEditable={<ContentEditable className="editor-input" />}
                placeholder={<Text style={{ color: '#999' }}>Enter some rich text...</Text>}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <RichTextPlugin
                contentEditable={<ContentEditable style={{ minHeight: 150, padding: 8, borderWidth: 1, borderColor: '#ccc' }} />}
                placeholder={<Text style={{ color: '#999' }}>Enter some rich text...</Text>}
                ErrorBoundary={LexicalErrorBoundary}
              />
            </LexicalComposer> */}

            {/* <RichEditor /> */}
            {/* <Editor setPlainText={setPlainText} setEditorState={setEditorState} /> */}

            {/* <LexicalComposer initialConfig={initialConfig}>
              <RichTextPlugin
                contentEditable={<ContentEditable style={{ minHeight: 150, borderWidth: 1, borderColor: '#ccc', padding: 8 }} />}
                placeholder={<Text style={{ color: '#999' }}>Start typing...</Text>}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <OnChangePlugin onChange={handleChange} />
            </LexicalComposer> */}
            {/* <RichText editor={editor} />
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{
                position: 'absolute',
                width: '100%',
                bottom: 0,
              }}
            >
              <Toolbar editor={editor} />
            </KeyboardAvoidingView> */}

            {/* <Text className="font-semibold text-gray-700 mb-2">Color</Text>
            <View className="flex-row flex-wrap mb-6">
              {NOTE_COLORS.map((color) => (
                <TouchableOpacity
                  key={color.value}
                  className="w-10 h-10 rounded-full m-1 border-2"
                  style={{
                    backgroundColor: color.value,
                    borderColor: selectedColor === color.value ? '#4A90E2' : 'transparent'
                  }}
                  onPress={() => setSelectedColor(color.value)}
                />
              ))}
            </View> */}

            <View className="flex-row justify-end">
              <TouchableOpacity
                className="bg-gray-200 rounded-lg px-4 py-2 mr-2"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 rounded-lg px-4 py-2 flex-row items-center"
                onPress={handleAddNote}
              >
                <Save size={16} color="white" className="mr-1" />
                <Text className="text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// const makeStyles = (colors: CustomColors & MD3Colors | MD3Colors) => StyleSheet.create({
const makeStyles = (colors?: any) => StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'column',
    // top: 0,
    // zIndex: 10,
    // position: 'fixed'
    backgroundColor: 'red'
  },
  headerContainer: {
    // backgroundColor: 'white',
    // backgroundColor: 'black',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    // top: 0,
    // zIndex: 10,
    // position: 'fixed'

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  headerButtonContainer: {
    borderRadius: '100%',
    padding: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchFilterContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    justifyContent: 'space-between'
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333',
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    // paddingVertical: 8,
    // paddingHorizontal: 12,
    // backgroundColor: '#f0f0f0',
    // borderRadius: 20,
  },
  activeColorFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
  },
  activeColorCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
    marginRight: 8,
  },
  activeColorText: {
    fontSize: 12,
    color: '#1E40AF',
  },
  activeDateFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  activeDateFilterText: {
    fontSize: 12,
    color: '#065f46',
    marginLeft: 4,
  },
  filtersOptionsContainer: {
    marginTop: 12,
  },
  colorFilterHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  colorFilterOptionsScrollContainer: {
    marginBottom: 12,
  },
  colorFilterAllOptionContainer: {
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
  },
  colorFilterOptionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
  },
  colorFilterOptionsCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  dateFilterHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dateFilterHeaderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorDateAllOptionContainer: {
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  dateFilterOptionsContainer: {
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  clearFilterButton: {
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
    backgroundColor: '#fee2e2',
    alignSelf: 'flex-start',
  },
  clearFilterButtonText: {
    color: '#b91c1c',
  },
  noteListEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noteListEmptyTitleText: {
    fontSize: 18,
    color: '#999',
  },
  noteListEmptySubtitleText: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 4,
  },
  noteContainer: {
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
    justifyContent: 'space-between',
  },
  noteHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  noteHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    flex: 1,
    marginRight: 8,
  },
  noteHeaderIconsContainer: {

  },
  noteContentText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  noteFooterText: {
    fontSize: 12,
    color: '#888',
    marginTop: 'auto',
  },
  addNoteModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  addNoteModalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 24,
    width: '91.6667%',
    maxWidth: 448
  },
  addNoteModalHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16
  }
})


export default PostItListScreen;