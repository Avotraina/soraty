import { formatDate } from '@/app/utils/date-time';
// import { DatePickerHandle } from '@s77rt/react-native-date-picker';
import { Calendar1 } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
// import { DatePickerModal } from 'react-native-paper-dates';
import { DatePicker, type DatePickerHandle } from "@s77rt/react-native-date-picker";

type ReminderDateSelectProps = {
    onDateSelect: (date: Date | null | any) => void;
    value?: Date | null | any | undefined;
    error?: any;
}

export default function CustomReminderDateSelect({ onDateSelect, value, error }: ReminderDateSelectProps) {

    const styles = makeStyles();

    const [date, setDate] = useState(undefined);
    const [open, setOpen] = useState(false);
    const datePicker = useRef<DatePickerHandle>(null);

    const onDismissSingle = useCallback(() => {
        setOpen(false);
    }, [setOpen]);


    // const onConfirmSingle = useCallback(
    //     (params: { date: any | Date }) => {
    //         Alert.alert(params.date.toString())
    //         // setOpen(false);
    //         // setDate(params.date);
    //         // onDateSelect(params.date);
    //         // console.log("Selected date:", params.date);
    //     },
    //     [setOpen, setDate, onDateSelect]
    // );


    const onConfirmSingle = useCallback(
        (date: any) => {
            // Alert.alert(date.toString())
            setOpen(false);
            setDate(date);
            onDateSelect(date);
            console.log("Selected date:", date);
        },
        [setOpen, setDate, onDateSelect]
    );

    return (
        <>
            <TouchableOpacity
                className={`rounded-full px-3 py-1 mr-2 `}
                style={{ ...styles.reminderDateOpener, backgroundColor: error ? '#fee2e2' : '#e5e7eb' }}
                // onPress={() => setOpen(true)}
                onPress={() => datePicker.current?.showPicker()}
            // onPress={() => handleCategorySelect(null)}
            >
                <Calendar1 color={error ? '#dc2626' : '#000'} />
                {/* <Text>{value ? value : date ? formatDate(date) : "Select Date"}</Text> */}
                <Text>{value ? formatDate(value) : "Select Date"}</Text>
            </TouchableOpacity>

            {/* <DatePickerModal
                locale="en"
                mode="single"
                visible={open}
                onDismiss={onDismissSingle}
                // date={value ?? date}
                date={value ? new Date(value) : date}
                onConfirm={onConfirmSingle}
                presentationStyle='pageSheet'
            /> */}
            <DatePicker
                ref={datePicker}
                style={{backgroundColor: 'red'}}
                type="date"
                // multiple={true}
                value={value ? new Date(value) : date || new Date()}
                onChange={onConfirmSingle}
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