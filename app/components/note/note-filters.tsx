import CategorySelectFilter from "@/app/components/category-select-filter";
import CustomPaperDateRangePicker from "@/app/components/custom-paper-date-range-picker";
import NoteColorSelectFilter from "@/app/components/filters/note-color-select-filter";
import { T_Category } from "@/app/features/categories/category.repo";
import { useDebounce } from "@/app/hooks/debounce";
import { CustomColors } from "@/app/theme/colors";
import { formatDate } from "@/app/utils/date-time";
import { Calendar, Filter, Folder, Plus, Search, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextInput as PaperTextInput, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { ThemedInput } from "../themed/themed-input";
import { ThemedText } from "../themed/themed-text";



const NOTE_COLORS = [
    { name: 'Yellow', value: '#FFF9C4' },
    { name: 'Blue', value: '#BBDEFB' },
    { name: 'Green', value: '#C8E6C9' },
    { name: 'Pink', value: '#F8BBD0' },
    { name: 'Purple', value: '#E1BEE7' },
    { name: 'Orange', value: '#FFE0B2' },
];


export default function NoteFilters({ onFiltersChange, defaultValues }: {
    onFiltersChange: (filters: {
        search: string;
        color?: string | null | undefined;
        category?: string | null | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }) => void;
    defaultValues?: {
        search?: string;
        color?: string | null | undefined;
        category?: string | null | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }
}) {

    const { colors } = useTheme();
    const styles = makeStyles(colors as CustomColors & MD3Colors);

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [filterColor, setFilterColor] = useState<string | null>(null);
    const [filterDate, setFilterDate] = useState<string | null>(null);
    const [filterCategory, setFilterCategory] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const debouncedSearch = useDebounce(searchQuery);


    const [dateFilter, setDateFilter] = useState<{ startDate: string | undefined, endDate: string | undefined }>({ startDate: undefined, endDate: undefined });
    const [categoryFilter, setCategoryFilter] = useState<T_Category | null | undefined>(null);
    const [colorFilter, setColorFilter] = useState<string | null>(null);

    useEffect(() => {
        onFiltersChange({
            search: debouncedSearch,
            color: colorFilter ?? null,
            category: categoryFilter?.id ?? null,
            startDate: dateFilter?.startDate,
            endDate: dateFilter?.endDate,
        });

    }, [colorFilter, categoryFilter, dateFilter, debouncedSearch]);

    useEffect(() => {
        // Set default values if provided
        // Verify if an element inside defaultValues is set
        const anyValuePresent = defaultValues && Object.values(defaultValues).some(value => value !== null && value !== undefined && value.length > 0);
        // const allValuesPresent = defaultValues && Object.values(defaultValues).every(value => value !== null && value !== undefined);

        if (anyValuePresent) {
            setShowFilters(true);
        }
    }, [defaultValues]);


    return (
        <>
            <View className="bg-white py-3 px-4" style={styles.searchFilterContainer}>
                {/* Search Bar */}
                <ThemedInput
                    style={styles.searchInput}
                    outlineStyle={{ borderRadius: 25 }}
                    // contentStyle={{ paddingVertical: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center', backgroundColor: 'blue', marginVertical: 10 }}
                    mode="outlined"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search notes..."
                    right={
                        <PaperTextInput.Icon
                            icon={() => <X size={20} color={(colors as CustomColors & MD3Colors).placeholderText} onPress={() => setSearchQuery('')} />}
                        />
                    }
                    left={
                        <PaperTextInput.Icon
                            icon={() => <Search size={20} color={(colors as CustomColors & MD3Colors).placeholderText} />}
                        />
                    }
                />
                {/* <View className="flex-row items-center bg-gray-100 rounded-xl px-3 mb-3" style={styles.searchContainer}>

                    <Search size={20} color="#999" />
                    <ThemedTextInput
                        className="flex-1 py-3 px-2"
                        style={styles.searchInputs}
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <X size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View> */}

                {/* Filter Button */}
                <View className="flex-row justify-between items-center" style={styles.filtersContainer}>
                    <TouchableOpacity
                        className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2"
                        style={styles.filterButton}
                        onPress={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={18} color={colors?.primary} />
                        <ThemedText type="default" className="ml-2 text-gray-700" style={styles.filterButtonText}>Filters</ThemedText>
                    </TouchableOpacity>

                    {/* Active Filters Indicator */}
                    {(filterColor || filterDate || filterCategory || dateFilter?.startDate || categoryFilter || colorFilter || defaultValues) && (
                        <View className="flex-row" style={styles.activeFiltersContainer}>

                            {colorFilter && (
                                <View
                                    className="flex-row items-center bg-blue-100 rounded-full px-3 py-1 mr-2"
                                    style={styles.activeColorFilterContainer}
                                >
                                    <View
                                        className="w-3 h-3 rounded-full mr-1"
                                        style={{ ...styles.activeColorCircle, backgroundColor: colorFilter }}

                                    />
                                    <ThemedText className="text-xs text-blue-800" style={styles.activeColorText}>Color</ThemedText>
                                </View>
                            )}
                            {categoryFilter && (
                                <View
                                    className="flex-row items-center bg-purple-100 rounded-full px-3 py-1"
                                    style={styles.activeCategoryFilterContainer}
                                >
                                    <Folder size={12} color={categoryFilter.color} />
                                    <ThemedText className="text-xs text-purple-800 ml-1" style={styles.activeCategoryFilterText}>Category</ThemedText>
                                </View>
                            )}
                            {dateFilter?.startDate && (
                                <View
                                    className="flex-row items-center bg-green-100 rounded-full px-3 py-1"
                                    style={styles.activeDateFilterContainer}
                                >
                                    <Calendar size={12} color={colors.primary} />
                                    <ThemedText className="text-xs text-green-800 ml-1" style={styles.activeDateFilterText}>Date</ThemedText>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* Filter Options */}
                {showFilters && (
                    <View className="mt-3" style={styles.filtersOptionsContainer}>
                        {/* Color Filters */}
                        <ThemedText type="normalSemiBold" className="font-semibold text-gray-700 mb-2" style={styles.colorFilterHeaderText}>Filter by Color:</ThemedText>
                        <NoteColorSelectFilter currentColor={colorFilter} onSelectColor={setColorFilter} />

                        {/* Category Filters */}
                        <ThemedText type="normalSemiBold"  className="font-semibold text-gray-700 mb-2" style={styles.categoryFilterHeaderText}>Filter by Category:</ThemedText>
                        <CategorySelectFilter currentCategory={categoryFilter} value={defaultValues?.category ?? ''} onSelectCategory={setCategoryFilter} />



                        {/* Date Filters */}
                        <ThemedText type="normalSemiBold"  className="font-semibold text-gray-700 mb-2" style={styles.dateFilterHeaderText}>Filter by Date:</ThemedText>
                        <View className="flex-row flex-wrap" style={styles.dateFilterHeaderContainer}>
                            <TouchableOpacity
                                className={`rounded-full px-3 py-1 mr-2 mb-2 ${!dateFilter.startDate ? 'bg-blue-500' : 'bg-gray-200'}`}
                                style={{ ...styles.colorDateAllOptionContainer, backgroundColor: !dateFilter.startDate ? colors.primary : (colors as CustomColors & MD3Colors).chipsContainer }}
                                onPress={() => { setFilterDate(null); console.log("Date range", dateFilter); setDateFilter({ startDate: undefined, endDate: undefined }) }}
                            >
                                <ThemedText className={!dateFilter ? 'text-white' : 'text-gray-700'} style={{ color: !dateFilter.startDate ? (colors as CustomColors & MD3Colors).primaryText : (colors as CustomColors & MD3Colors).primaryText }}>All Dates</ThemedText>
                            </TouchableOpacity>

                            <CustomPaperDateRangePicker currentRange={dateFilter} onSelectDateRange={setDateFilter} style={{ justifyContent: 'flex-start', flex: 1, alignItems: 'flex-start' }}>
                                <TouchableOpacity
                                    className={`rounded-full px-3 py-1 mr-2 mb-2 ${!filterDate ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    style={{ borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 4, backgroundColor: dateFilter.startDate ? colors.primary : (colors as CustomColors & MD3Colors).chipsContainer }}
                                    onPress={() => { setFilterDate(null); console.log("Date range", dateFilter) }}
                                >

                                    {dateFilter?.startDate ? (
                                        <ThemedText className={!dateFilter.startDate ? 'text-white' : 'text-gray-700'} style={{ color: dateFilter.startDate ? (colors as CustomColors & MD3Colors).primaryText : (colors as CustomColors & MD3Colors).primaryText }}>
                                            {`${dateFilter?.startDate ? formatDate(dateFilter.startDate) : ''} ${dateFilter?.endDate ? '-' : ''} ${dateFilter?.endDate ? formatDate(dateFilter.endDate) : ''}`}
                                        </ThemedText>
                                    ) : (
                                        <Plus color={dateFilter.startDate ? (colors as CustomColors & MD3Colors).primaryText : (colors as CustomColors & MD3Colors).primaryText} size={20} />
                                    )}

                                </TouchableOpacity>
                            </CustomPaperDateRangePicker>
                        </View>


                        {/* Clear Filters Button */}
                        {(filterColor || filterDate || filterCategory || dateFilter?.startDate || categoryFilter || colorFilter) && (
                            <TouchableOpacity
                                className="self-start bg-red-100 rounded-full px-3 py-1 mt-2"
                                style={styles.clearFilterButton}
                                onPress={() => {
                                    // setFilterColor(null);
                                    // setFilterDate(null);
                                    // setFilterCategory(null);

                                    setDateFilter({ startDate: undefined, endDate: undefined });
                                    setCategoryFilter(undefined)
                                    setColorFilter(null)
                                }}
                            >
                                <ThemedText  className="text-red-700" style={styles.clearFilterButtonText}>Clear Filters</ThemedText>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View >
        </>
    )
}

const makeStyles = (colors?: CustomColors & MD3Colors) => StyleSheet.create({
    searchFilterContainer: {
        backgroundColor: colors?.background,
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
        // flex: 1,
        borderRadius: 25,
        // alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        

        // paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        marginBottom: 12,
    },
    searchInputs: {
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
        // backgroundColor: '#f0f0f0',
        backgroundColor: colors?.chipsContainer,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 6,
        justifyContent: 'space-between'
    },
    filterButtonText: {
        fontSize: 14,
        // color: '#333',
        color: colors?.primaryText,
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
        // backgroundColor: '#1E293B',
        backgroundColor: colors?.chipsContainer,
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
        // color: '#1E40AF',
        color: colors?.text,
    },
    activeCategoryFilterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#f3e8ff', // Tailwind bg-purple-100
        backgroundColor: colors?.chipsContainer,
        borderRadius: 9999,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginRight: 8,
    },
    activeCategoryFilterText: {
        fontSize: 12,             // Tailwind 'text-xs'
        // color: '#6b21a8',         // Tailwind 'text-purple-800'
        color: colors?.primaryText,         // Tailwind 'text-purple-800'
        marginLeft: 4,            // Tailwind 'ml-1' (0.25rem = 4px)
    },
    activeDateFilterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#d1fae5',
        backgroundColor: colors?.chipsContainer,
        borderRadius: 9999,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    activeDateFilterText: {
        fontSize: 12,
        // color: '#065f46',
        color: colors?.text,
        marginLeft: 4,
    },
    filtersOptionsContainer: {
        marginTop: 12,
    },
    colorFilterHeaderText: {
        // fontSize: 16,
        // fontWeight: '600',
        // color: '#333',
        color: colors?.secondaryText,
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
    categoryFilterHeaderText: {
        // fontSize: 16,
        // fontWeight: '600',
        // color: '#333',
        color: colors?.secondaryText,
        marginBottom: 8,
    },
    categoryFilterOptionsScrollContainer: {
        marginBottom: 12,
    },
    categoryFilterAllOptionContainer: {
        borderRadius: 9999,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginRight: 8,
    },
    categoryFilterOptionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 9999,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginRight: 8,
    },
    dateFilterHeaderText: {
        // fontSize: 16,
        // fontWeight: '600',
        // color: '#333',
        color: colors?.secondaryText,
        marginBottom: 8,
    },
    dateFilterHeaderContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // backgroundColor: 'red'


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
        // fontSize: 2,
    },
})