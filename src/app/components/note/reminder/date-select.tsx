import { formatDate } from '@/src/app/utils/date-time';
import { Calendar1 } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';

type ReminderDateSelectProps = {
    onDateSelect: (date: Date | null | any) => void;
    value?: Date | null | any | undefined;
}

export default function ReminderDateSelect({ onDateSelect, value } : ReminderDateSelectProps) {

    const styles = makeStyles();

    const [date, setDate] = useState(undefined);
    const [open, setOpen] = useState(false);

    const onDismissSingle = useCallback(() => {
        setOpen(false);
    }, [setOpen]);


    const onConfirmSingle = useCallback(
        (params: {date: any}) => {
            setOpen(false);
            setDate(params.date);
            onDateSelect(params.date);
            console.log("Selected date:", params.date);
        },
        [setOpen, setDate, onDateSelect]
    );

    return (
        <>
            <TouchableOpacity
                className={`rounded-full px-3 py-1 mr-2 `}
                style={{ ...styles.reminderDateOpener, backgroundColor: '#e5e7eb' }}
                onPress={() => setOpen(true)}
            // onPress={() => handleCategorySelect(null)}
            >
                <Calendar1 />
                {/* <Text>{value ? value : date ? formatDate(date) : "Select Date"}</Text> */}
                <Text>{value ? formatDate(value) : "Select Date"}</Text>
            </TouchableOpacity>
            <DatePickerModal
                locale="en"
                mode="single"
                visible={open}
                onDismiss={onDismissSingle}
                date={value ?? date}
                onConfirm={onConfirmSingle}
                presentationStyle='pageSheet'
            />
        </>
    );

}

const makeStyles = (colors?: any) => StyleSheet.create({
    reminderDateOpener: {
        borderRadius: 9999,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginRight: 8,
        flex: 2 / 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 6,
    },
})