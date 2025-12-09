// import { DatePicker, DatePickerHandle } from "@s77rt/react-native-date-picker";
import React, { isValidElement, ReactElement, ReactNode, useCallback } from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { Button } from 'react-native-paper';
import { DatePickerModal } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";

type DateRangeSelectProps = {
    onClose?: () => void;
    currentRange?: {
        startDate: string | undefined,
        endDate: string | undefined,
    },
    onSelectDateRange: (dateRange: {
        startDate: string | undefined,
        endDate: string | undefined,
    }) => void
    value?: string;
    children?: ReactNode,
    style?: StyleProp<ViewStyle & TextStyle>
}

export default function CustomPaperDateRangePicker({
    currentRange,
    onSelectDateRange,
    children,
    style
}: DateRangeSelectProps) {
    const [range, setRange] = React.useState({ startDate: currentRange?.startDate, endDate: currentRange?.endDate });
    const [open, setOpen] = React.useState(false);
    // const datePicker = useRef<DatePickerHandle>(null);


    const onDismiss = React.useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirm = useCallback(
        ({ startDate, endDate }: any) => {
            setOpen(false);
            setRange({ startDate, endDate });
            onSelectDateRange({ startDate, endDate })
        },
        [setOpen, setRange]
    );

    const childWithPress =
        isValidElement(children)
            ? React.cloneElement(
                children as ReactElement<any>,
                {
                    ...((children as ReactElement<any>).props || {}),
                    onPress: () => setOpen(true),
                    // onPress: () => datePicker.current?.showPicker(),
                }
            )
            : children;

    return (
        <SafeAreaProvider>
            <View style={[{ justifyContent: 'center', flex: 1, alignItems: 'center' }, style]}>

                {children ? (
                    childWithPress
                ) : (
                    <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
                    {/* // <Button onPress={() => datePicker.current?.showPicker()} uppercase={false} mode="outlined"> */}
                        Pick range
                    </Button>
                )}

                {/* <DatePicker
                    ref={datePicker}
                    style={{ backgroundColor: 'red' }}
                    type="date"
                    multiple={true}
                    collapsable
                    // value={value ? new Date(value) : date || new Date()}
                    // onChange={onConfirmSingle}
                /> */}

                <DatePickerModal
                    locale="en"
                    mode="range"
                    visible={open}
                    onDismiss={onDismiss}
                    startDate={currentRange?.startDate as any}
                    endDate={currentRange?.endDate as any}
                    onConfirm={onConfirm}
                    allowEditing
                    startYear={1990}
                    presentationStyle="pageSheet"
                />
            </View>
        </SafeAreaProvider>
    )
}