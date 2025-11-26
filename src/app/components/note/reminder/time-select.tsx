import { Clock } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TimePickerModal } from 'react-native-paper-dates';

type ReminderTimeSelectProps = {
    onTimeSelect?: (date: Date | null | any) => void;
    value?: Date | null | any;
}

export default function ReminderTimeSelect({ onTimeSelect, value }: ReminderTimeSelectProps) {

    const styles = makeStyles();

    const [time, setTime] = useState<string | undefined>(undefined);
    const [open, setOpen] = useState(false);

    const onDismiss = useCallback(() => {
        setOpen(false);
    }, [setOpen]);


    const onConfirm = useCallback(
        (params: any) => {
            setOpen(false);

            // Support different shapes from DatePickerModal depending on mode/version
            let hours: number | undefined;
            let minutes: number | undefined;

            if (params && typeof params === 'object') {
                if (params.hours !== undefined && params.minutes !== undefined) {
                    hours = Number(params.hours);
                    minutes = Number(params.minutes);
                } else if (params.date instanceof Date) {
                    const d: Date = params.date;
                    hours = d.getHours();
                    minutes = d.getMinutes();
                }
            }

            if (hours !== undefined && minutes !== undefined) {
                const hh = String(hours).padStart(2, '0');
                const mm = String(minutes).padStart(2, '0');
                const timeStr = `${hh}:${mm}`;
                setTime(timeStr);
                onTimeSelect?.(timeStr);
                console.log('Selected time:', timeStr);
            } else {
                // Fallback: forward raw params
                onTimeSelect?.(params);
                console.log('Selected params:', params);
            }
        },
        [setOpen, setTime, onTimeSelect]
    );

    return (
        <>
            <TouchableOpacity
                className={`rounded-full px-3 py-1 mr-2 `}
                style={{ ...styles.reminderDateOpener, backgroundColor: '#e5e7eb' }}
                onPress={() => setOpen(true)}
            // onPress={() => handleCategorySelect(null)}
            >
                <Clock />
                {/* <Text>{value ? (value instanceof Date ? formatDate(value) : String(value)) : time ? time : 'Select Time'}</Text> */}
                <Text>{value ? value : 'Select Time'}</Text>
            </TouchableOpacity>
            <TimePickerModal
                visible={open}
                onDismiss={onDismiss}
                onConfirm={onConfirm}
                hours={12}
                minutes={14}
            />
            {/* <DatePickerModal
                locale="en"
                mode="single"
                visible={open}
                onDismiss={onDismissSingle}
                date={value instanceof Date ? value : undefined}
                onConfirm={onConfirm}
                presentationStyle='pageSheet'
            /> */}
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