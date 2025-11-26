import NoteFilters from '@/src/app/components/note/note-filters';
import RichViewer from '@/src/app/components/rich-viewer';
import { useNotesInfiniteQuery } from '@/src/app/features/notes/note.query';
import { useDebounce } from '@/src/app/hooks/debounce';
import { Link, useRouter } from 'expo-router';
import { Folder, Plus, Settings, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
// import RichViewer from '../components/rich-viewer';

// Define types
type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: Date;
  categoryId?: string;
  category_name?: string,
  category_id?: string;
  category_color?: string;
  note_title?: string;
  note_content?: string;
};

type Category = {
  id: string;
  name: string;
  color: string;
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

// Predefined categories


export default function PostItListScreen() {

  const styles = makeStyles();

  const router = useRouter();
  // const [notes, setNotes] = useState<Note[]>([
  //   {
  //     id: '1',
  //     title: 'Meeting Notes',
  //     content: 'Discuss project timeline with team',
  //     color: '#FFF9C4',
  //     createdAt: new Date(2023, 5, 15),
  //     categoryId: '2',
  //   },
  //   {
  //     id: '2',
  //     title: 'Shopping List',
  //     content: 'Milk, Eggs, Bread, Fruits',
  //     color: '#BBDEFB',
  //     createdAt: new Date(2023, 5, 12),
  //     categoryId: '4',
  //   },
  //   {
  //     id: '3',
  //     title: 'Ideas',
  //     content: 'New app features to implement',
  //     color: '#C8E6C9',
  //     createdAt: new Date(2023, 5, 10),
  //     categoryId: '3',
  //   },
  //   {
  //     id: '4',
  //     title: 'Reminders',
  //     content: 'Call mom on Sunday',
  //     color: '#F8BBD0',
  //     createdAt: new Date(2023, 5, 18),
  //     categoryId: '1',
  //   },
  //   {
  //     id: '5',
  //     title: 'Reminders',
  //     content: 'Call mom on Sunday',
  //     color: '#F8BBD0',
  //     createdAt: new Date(2023, 5, 18),
  //   },
  //   {
  //     id: '6',
  //     title: 'Reminders',
  //     content: 'Call mom on Sunday',
  //     color: '#F8BBD0',
  //     createdAt: new Date(2023, 5, 18),
  //   },
  //   {
  //     id: '7',
  //     title: 'Reminders',
  //     content: 'Call mom on Sunday',
  //     color: '#F8BBD0',
  //     createdAt: new Date(2023, 5, 18),
  //   },
  //   // {
  //   //   id: '8',
  //   //   title: 'Reminders',
  //   //   content: 'Call mom on Sunday',
  //   //   color: '#F8BBD0',
  //   //   createdAt: new Date(2023, 5, 18),
  //   // },
  // ]);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterColor, setFilterColor] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchQuery);


  // const handleDeleteNote = (id: string) => {
  //   setNotes(notes.filter(note => note.id !== id));
  // };

  // Filter and search notes
  // const filteredNotes = useMemo(() => {
  //   return notes.filter(note => {
  //     const matchesSearch =
  //       note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       note.content.toLowerCase().includes(searchQuery.toLowerCase());

  //     const matchesColor = filterColor ? note.color === filterColor : true;

  //     const matchesDate = filterDate ?
  //       note.createdAt.toDateString() === new Date(filterDate).toDateString() :
  //       true;

  //     const matchesCategory = filterCategory ? note.categoryId === filterCategory : true;

  //     return matchesSearch && matchesColor && matchesDate && matchesCategory;
  //   });
  // }, [notes, searchQuery, filterColor, filterDate, filterCategory]);


  const [filters, setFilters] = useState<
    {
      search: string;
      color?: string | null | undefined;
      category?: string | null | undefined;
      startDate?: string | undefined;
      endDate?: string | undefined;
    }
  >({
    search: "",
    color: null,
    category: null,
    startDate: undefined,
    endDate: undefined,
  });

  const { data } = useNotesInfiniteQuery(filters);
  const noteList = data?.pages[0]?.flatMap((page: any) => page) || []


  console.log(filters)
  // console.log("START DATEs", new Date(filters.startDate as any))


  console.log("NOTE LIST", data)




  const renderNoteItem = ({ item, index }: { item: Note, index: number }) => {
    // const category = item.categoryId

    return (
      <TouchableOpacity
        className="rounded-xl p-4 m-2 shadow-md"
        activeOpacity={0.9}
        // style={{ backgroundColor: item.color, minHeight: 150 }}
        // style={{ ...styles.noteContainer, backgroundColor: item.color, minHeight: 150 }}
        style={[styles.noteContainer, { backgroundColor: item.color, minHeight: 150 }, index >= noteList.length - (noteList.length % 2 || 2) ? { marginBottom: 90 } : {}]}
      >
        <View className="flex-row justify-between items-start" style={styles.noteHeaderContainer}>
          <Text className="text-lg font-bold text-gray-800 mb-2" style={styles.noteHeaderTitle} numberOfLines={1}>
            {item.note_title || 'Untitled'}
          </Text>
          <TouchableOpacity style={styles.noteHeaderIconsContainer}>
            <Trash2 size={18} color="#666" />
          </TouchableOpacity>
        </View>

        {item.category_id && (
          <View
            className="flex-row items-center self-start rounded-full px-2 py-1 mb-2"
            style={{ ...styles.noteCategoryContainer, backgroundColor: `${item.category_color}40` }}
          >
            <Folder size={12} color={item?.category_color} />
            <Text
              className="text-xs font-medium ml-1"
              style={{ ...styles.noteCategoryText, color: item.category_color }}
            >
              {item.category_name}
            </Text>
          </View>
        )}

        {/* <Text className="text-gray-700 mb-3" numberOfLines={4} style={styles.noteContentText}>
          {item.note_content}
        </Text> */}
        {/* <Text className="text-gray-700 mb-3" numberOfLines={4} style={styles.noteContentText}>
                    <RichViewer value={item.note_content as any} />

        </Text> */}

        {/* <View style={{ marginBottom: 12 }}> */}
        {/* <RichViewer value={item.note_content} /> */}
        <RichViewer value={item.note_content as any} />
        {/* </View> */}

        {/* <RichViewer value={item.note_content} /> */}
        {/* <Text className="text-gray-700 mb-3" numberOfLines={4} style={styles.noteContentText}>
        </Text> */}
        <Text className="text-xs text-gray-500 mt-auto" style={styles.noteFooterText}>
          {/* {item.createdAt.toLocaleDateString()} */}
        </Text>
      </TouchableOpacity>
    )

  };

  return (
    <View className="flex-1 bg-gray-100" style={styles.container}>
      {/* Header */}
      <View className="bg-white py-4 px-4 shadow-sm" style={styles.headerContainer}>
        <View className="flex-row justify-between items-center" style={styles.header}>
          <Text className="text-2xl font-bold text-gray-800" style={styles.headerTitle}>My Notes</Text>
          <View className="flex-row" style={styles.headerButtonsContainer}>
            <TouchableOpacity
              className="mr-4 p-2 rounded-full bg-blue-100"
              // onPress={() => router.push('/settings')}
              style={{ ...styles.headerButtonContainer }}
            >
              <Settings size={20} color="#4A90E2" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 rounded-full bg-blue-100"
              // onPress={() => setModalVisible(true)}
              style={{ ...styles.headerButtonContainer }}
            >
              <Plus size={20} color="#4A90E2" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search and Filters */}
      <NoteFilters onFiltersChange={setFilters} />


      {/* Notes List */}
      <FlatList
        data={noteList}
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

      <FAB />

    </View>
  );
}

function FAB() {

  const { colors } = useTheme();

  const styles = makeStyles(colors);

  return (
    <Link href="/screens/note/new-note" asChild >
      <TouchableOpacity style={{
        position: 'absolute',
        bottom: 32,
        right: 32,
        backgroundColor: colors.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4
      }}>
        <Plus size={24} color={colors.background} />

      </TouchableOpacity>
    </Link>
  );


}


const makeStyles = (colors?: any) => StyleSheet.create({

  container: {
    flex: 1,
    flexGrow: 1,
  },
  headerContainer: {
    // justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
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
  noteCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  noteCategoryText: {
    fontSize: 12,           // Tailwind 'text-xs'
    fontWeight: '500',       // Tailwind 'font-medium'
    marginLeft: 4,           // Tailwind 'ml-1' (0.25rem = 4px)
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

});