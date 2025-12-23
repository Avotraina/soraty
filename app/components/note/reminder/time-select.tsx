import { CustomColors } from '@/app/theme/colors';
import { Clock } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { ThemedText } from '../../themed/themed-text';

type ReminderTimeSelectProps = {
    onTimeSelect?: (date: Date | null | any) => void;
    value?: Date | null | any;
    error?: any;
}

export default function ReminderTimeSelect({ onTimeSelect, value, error }: ReminderTimeSelectProps) {

    const { colors } = useTheme();
    const styles = makeStyles(colors as CustomColors & MD3Colors);

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
                style={{ ...styles.reminderDateOpener, backgroundColor: error ? colors.errorContainer : (colors as CustomColors & MD3Colors).chipsContainer }}
                onPress={() => setOpen(true)}
            // onPress={() => handleCategorySelect(null)}
            >
                <Clock color={error ? colors.error : (colors as CustomColors & MD3Colors).primaryText} />
                {/* <Text>{value ? (value instanceof Date ? formatDate(value) : String(value)) : time ? time : 'Select Time'}</Text> */}
                <ThemedText type='default' style={[styles.reminderTimeText, { color: error ? colors.error : (colors as CustomColors & MD3Colors).primaryText }]}>{value ? value : 'Select Time'}</ThemedText>
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
    reminderTimeText: {
        color: colors.primaryText,
    },
})