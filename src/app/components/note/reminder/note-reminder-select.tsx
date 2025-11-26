import { BellRing, X } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReminderDateSelect from "./date-select";
import ReminderTimeSelect from "./time-select";

// type ReminderProps = {
//     currentDate?: string | null | any;
//     currentTime?: string | null | any;
//     onSelectDateTime: (date: string | null | undefined, time: string | null | undefined) => void;
//     // value?: string;
// }

type ReminderValue = {
    date?: string | null;
    time?: string | null;
};

type ReminderProps = {
    value: ReminderValue;                                // controlled
    onChange: (val: ReminderValue) => void; 
    submitCount: number;
    error?: any;
    isSubmitSuccessful?: boolean;
};

// export default function NoteReminderTimeSelect({ currentDate, currentTime, onSelectDateTime }: ReminderProps) {
export default function NoteReminderTimeSelect({ value, onChange, submitCount, error, isSubmitSuccessful }: ReminderProps) {
    const styles = makeStyles();

    const [showReminder, setShowReminder] = useState(false);
    const [date, setDate] = useState<string | undefined | null | any>(undefined);
    const [time, setTime] = useState<string | undefined | null | any>(undefined);

    // const [hasError, setHasError] = useState(false);

    // const hasError = submitCount > 0 && Boolean(error);
    const hasError = !isSubmitSuccessful && Boolean(error);

    // useEffect(() => {
    //     Alert.alert("Submit Count Changed", `submitCount: ${submitCount}, error: ${error ? JSON.stringify(error) : 'none'}`);
    //     if (submitCount > 0 && error) {
    //         setHasError(true);
    //     } else {
    //         setHasError(false);
    //     }
    // }, []);

    const isDateMissing = hasError && value?.time && !value?.date;
    const isTimeMissing = hasError && value?.date && !value?.time;

    const handleDateTimeSelect = (type: 'date' | 'time', selected: string | any | null) => {

        const updated = {
            ...value,
            [type]: selected,
        }
        onChange(updated);

        // if (type === 'date') {
        //     setDate(value);
        //     onSelectDateTime(value, time)
        // } else if (type === 'time') {
        //     setTime(value);
        //     onSelectDateTime(date, value)
        // }
        // setDate(selectedDate);
        // setTime(selectedTime);
        // onSelectDateTime?.(selectedDate, selectedTime);
    }

    const handleClearReminder = () => {
        onChange({ date: null, time: null });
        // Alert.alert("")
        // setDate(undefined);
        // setTime(undefined);
        // onSelectDateTime(undefined, undefined);
    }

    const hasReminder = Boolean(value?.date || value?.time);

    return (
        <>
            {/* Filter Button */}
            <View className="flex-row justify-between items-center" style={[styles.reminderContainer, { paddingVertical: showReminder ? 0 : 12 }]}>
                <TouchableOpacity
                    className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2"
                    style={[styles.reminderButton, hasError ? { backgroundColor: "#fee2e2" } : {},]}
                    onPress={() => setShowReminder(!showReminder)}
                >
                    {/* <BellRing size={18} color={(currentDate || currentTime) ? '#1E40AF' : '#666'} fill={(currentDate || currentTime) ? '#1E40AF' : 'transparent'} /> */}
                    <BellRing
                        size={18}
                        color={hasError ? "#dc2626" : hasReminder ? "#1E40AF" : "#666"}
                        fill={hasError ? "#dc2626" : hasReminder ? "#1E40AF" : "transparent"}
                    />
                    <Text className="ml-2 text-gray-700" style={styles.reminderButtonText}>Reminder</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                    className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2"
                    style={styles.clearButton}
                    onPress={handleClearReminder}
                >
                    <X size={18} color="#666" />
                    <Text className="ml-2 text-gray-700" style={styles.reminderButtonText}>Clear</Text>
                </TouchableOpacity> */}

                {(hasReminder) && (
                    <TouchableOpacity
                        className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2"
                        style={styles.clearButton}
                        onPress={() => handleClearReminder()}
                    >
                        <X size={18} color="#666" />
                        <Text className="ml-2 text-gray-700" style={styles.reminderButtonText}>Clear</Text>
                    </TouchableOpacity>
                )}
            </View>

            {showReminder && (
                <View className="mt-3" style={styles.reminderDateTimeContainer}>
                    {/* <TouchableOpacity
                        className={`rounded-full px-3 py-1 mr-2 `}
                        style={{ ...styles.reminderDateOpener, backgroundColor: '#e5e7eb' }}
                    >
                        <Text style={{}}>Date</Text>
                    </TouchableOpacity> */}
                    <ReminderDateSelect onDateSelect={(date) => handleDateTimeSelect('date', date)} value={value?.date} error={isDateMissing} />
                    <ReminderTimeSelect onTimeSelect={(time) => handleDateTimeSelect('time', time)} value={value?.time} error={isTimeMissing} />
                    {/* <TouchableOpacity
                        className={`rounded-full px-3 py-1 mr-2 `}
                        style={{ ...styles.reminderTimeOpener, backgroundColor: '#e5e7eb' }}
                    >
                        <Text style={{}}>Time</Text>
                    </TouchableOpacity> */}
                </View>
            )}
        </>
    );

}


const makeStyles = (colors?: any) => StyleSheet.create({

    reminderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        // paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        // borderBottomWidth: 1,
        // borderBottomColor: '#e5e7eb',
    },
    reminderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 6,
        justifyContent: 'space-between'
    },
    reminderButtonText: {
        fontSize: 14,
        color: '#333',
    },
    colorFilterHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    reminderDateTimeContainer: {
        marginTop: 12,
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    reminderDateOpener: {
        borderRadius: 9999,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginRight: 8,
        flex: 2 / 3
    },
    reminderTimeOpener: {
        borderRadius: 9999,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginRight: 8,
        flex: 1 / 3
    },
    clearButton: {
        borderRadius: 9999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        // marginTop: 8,
        backgroundColor: '#fee2e2',
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
});