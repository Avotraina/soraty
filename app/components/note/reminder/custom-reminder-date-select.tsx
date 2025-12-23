import { formatDate } from '@/app/utils/date-time';
// import { DatePickerHandle } from '@s77rt/react-native-date-picker';
import { Calendar1 } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
// import { DatePickerModal } from 'react-native-paper-dates';
import { CustomColors } from '@/app/theme/colors';
import { DatePicker, type DatePickerHandle } from "@s77rt/react-native-date-picker";
import { useTheme } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { ThemedText } from '../../themed/themed-text';

type ReminderDateSelectProps = {
    onDateSelect: (date: Date | null | any) => void;
    value?: Date | null | any | undefined;
    error?: any;
}

export default function CustomReminderDateSelect({ onDateSelect, value, error }: ReminderDateSelectProps) {

    const { colors } = useTheme();
    const styles = makeStyles(colors as CustomColors & MD3Colors);

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
                style={{ ...styles.reminderDateOpener, backgroundColor: error ? colors.errorContainer : (colors as CustomColors & MD3Colors).chipsContainer }}
                // onPress={() => setOpen(true)}
                onPress={() => datePicker.current?.showPicker()}
            // onPress={() => handleCategorySelect(null)}
            >
                <Calendar1 color={error ? colors.error : (colors as CustomColors & MD3Colors).primaryText} />
                {/* <Text>{value ? value : date ? formatDate(date) : "Select Date"}</Text> */}
                <ThemedText type='default' style={[styles.reminderDateText, { color: error ? colors.error : (colors as CustomColors & MD3Colors).primaryText }]}>{value ? formatDate(value) : "Select Date"}</ThemedText>
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
                style={{ backgroundColor: 'red' }}
                type="date"
                // multiple={true}
                value={value ? new Date(value) : date || new Date()}
                onChange={onConfirmSingle}
            />
        </>
    );

}

const makeStyles = (colors: CustomColors & MD3Colors) => StyleSheet.create({
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
    reminderDateText: {
        color: colors.primaryText,
    },
})