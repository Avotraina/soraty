import React, { useCallback, useState } from "react";
import { Button, Modal, StyleSheet, Text, View } from "react-native";
// import { Calendar } from "react-native-calendars";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { CustomColors } from "../../theme/colors";
// import CustomAnimatedDropdown from "./custom-dropdown";
// import TestDropdown from "./test-dropdown";
import { addMonths } from "date-fns";

import {
    Calendar,
    CalendarOnDayPress,
    toDateId,
    useDateRange
} from "@marceloterreiro/flash-calendar";


type CalendarRangePickerProps = {
    startYear?: string | number;
}

const todayId = toDateId(new Date());
const maxDateId = toDateId(addMonths(new Date(), 12));

export default function CalendarRangePicker() {
    const [range, setRange] = useState<{ [key: string]: any }>({});
    const [visible, setVisible] = useState(false);

    const { colors } = useTheme();

    const months = [
        { label: "January", value: "01" },
        { label: "February", value: "02" },
        { label: "March", value: "03" },
        { label: "April", value: "04" },
        { label: "May", value: "05" },
        { label: "June", value: "06" },
        { label: "July", value: "07" },
        { label: "August", value: "08" },
        { label: "September", value: "09" },
        { label: "October", value: "10" },
        { label: "November", value: "11" },
        { label: "December", value: "12" },
    ];

    const years = [
        { label: '2024', value: '2024' },
        { label: '2025', value: '2025' }
    ]

    const styles = makeStyles(colors as CustomColors & MD3Colors);


    const onDayPress = (day: any) => {
        const keys = Object.keys(range);
        if (keys.length === 0) {
            setRange({
                [day.dateString]: { startingDay: true, color: "#70d7c7", textColor: "white" },
            });
        } else {
            const firstDate = keys[0];
            const secondDate = day.dateString;

            const dates = getDatesBetween(firstDate, secondDate);
            const newRange: any = {};
            dates.forEach((d, idx) => {
                newRange[d] = {
                    color: "#70d7c7",
                    textColor: "white",
                    startingDay: idx === 0,
                    endingDay: idx === dates.length - 1,
                };
            });
            setRange(newRange);
        }
    };

    const getDatesBetween = (start: string, end: string) => {
        const arr = [];
        let curr = new Date(start);
        const last = new Date(end);
        while (curr <= last) {
            arr.push(curr.toISOString().split("T")[0]);
            curr.setDate(curr.getDate() + 1);
        }
        return arr;
    };

    const {
        calendarActiveDateRanges,
        onCalendarDayPress,
        // Also available for your convenience:
        // dateRange, // { startId?: string, endId?: string }
        // isDateRangeValid, // boolean
        // onClearDateRange, // () => void
    } = useDateRange();

    const [dateIds, setDateIds] = useState<string[]>([]);
    const dateRanges = dateIds.map((dateId) => ({
        startId: dateId,
        endId: dateId,
    }));

    const handleCalendarDayPress = useCallback<CalendarOnDayPress>((dateId) => {
        setDateIds((dateIds) => {
            if (dateIds.includes(dateId)) {
                return dateIds.filter((id) => id !== dateId);
            } else {
                return [...dateIds, dateId];
            }
        });
    }, []);

    return (
        <View style={{ padding: 20 }}>

            <Button title="Select Date Range" onPress={() => setVisible(true)} />

            <Modal visible={visible} transparent animationType="slide">
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "white",
                            borderRadius: 12,
                            padding: 20,
                            marginHorizontal: 20,
                        }}
                    >

                        {/* <TestDropdown /> */}

                        {/* <Calendar.List
                            calendarActiveDateRanges={calendarActiveDateRanges}
                            onCalendarDayPress={onCalendarDayPress}
                        /> */}

                        <Calendar.VStack alignItems="stretch" grow spacing={12}>
                            <Text>✅ This is safe to copy, perf issues addressed</Text>

                            <Calendar.List
                                calendarActiveDateRanges={dateRanges}
                                calendarInitialMonthId={todayId}
                                calendarMaxDateId={maxDateId}
                                calendarMinDateId={todayId}
                                onCalendarDayPress={handleCalendarDayPress}
                            />
                        </Calendar.VStack>



                        {/* <View style={{ position: 'relative', zIndex: 9999, flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                            <CustomAnimatedDropdown
                                options={years}
                                multiSelect={false}
                                selectcontainerStyle={styles.dropDownSelectContainer}
                                selectTextStyle={styles.dropDownSelectText}
                                selectIconStyle={styles.dropDownSelectIcon}
                                dropdownContainerStyle={styles.dropdownContainer}
                                optionStyle={{ color: (colors as CustomColors & MD3Colors).text }}
                                selectedStyle={{ backgroundColor: (colors as CustomColors & MD3Colors).text, color: colors.surface }}
                                defaultValue={years[years.length - 1].value}
                            />
                            <CustomAnimatedDropdown
                                options={months}
                                multiSelect={false}
                                selectcontainerStyle={styles.dropDownSelectContainer}
                                selectTextStyle={styles.dropDownSelectText}
                                selectIconStyle={styles.dropDownSelectIcon}
                                dropdownContainerStyle={styles.dropdownContainer}
                                optionStyle={{ color: (colors as CustomColors & MD3Colors).text }}
                                selectedStyle={{ backgroundColor: (colors as CustomColors & MD3Colors).text, color: colors.surface }}
                                defaultValue={months[months.length - 1].value}
                            />

                        </View> */}
                        {/* <Calendar
                            markingType={"period"}
                            markedDates={range}
                            onDayPress={onDayPress}

                        /> */}


                    </View>


                </View>
            </Modal>

        </View>
    );
}

{/* <CalendarList
                            markingType="period"
                            markedDates={range}
                            onDayPress={onDayPress}

                            // Enable scrolling
                            scrollEnabled={true}       // vertical scroll
                            // pastScrollRange={12}       // months before current
                            // futureScrollRange={12}     // months after current

                            // OR horizontal scroll
                            horizontal={true}
                            pagingEnabled={true}       // scroll one month at a time
                        /> */}

const makeStyles = (colors: CustomColors & MD3Colors) => StyleSheet.create({

    dropDownSelectContainer: {
        // backgroundColor: 'green',
        // borderWidth: 0,
        // borderColor: 'green',
        // padding: 0,
        // marginBottom: 8
        // color: 'green'
        // height: 
        // flex: 1

    },
    dropDownSelectText: {
        fontSize: 12,
        fontWeight: "bold",
        // marginTop: 18,
        // marginBottom: 8,
        // color: colors.text,
        color: 'black',
        // backgroundColor: 'green'
    },
    dropDownSelectIcon: {
        color: colors.text,
        // color: 'green',
        // backgroundColor: 'tranparent',
        // backgroundColor: 'green'

    },
    dropdownContainer: {
        backgroundColor: colors.surface,
        elevation: 4,
        shadowColor: colors.text,
        // backgroundColor: 'green',
        // color: 'green'

    },
})



// import React, { useState } from "react";
// import { StyleSheet, View } from "react-native";
// import { Button, Menu, Provider, Text } from "react-native-paper";

// export default function MonthYearPickerPaper() {
//     const [monthMenuVisible, setMonthMenuVisible] = useState(false);
//     const [yearMenuVisible, setYearMenuVisible] = useState(false);

//     const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
//     const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

//     const months = [
//         "January", "February", "March", "April", "May", "June",
//         "July", "August", "September", "October", "November", "December"
//     ];

//     const years = Array.from({ length: 20 }, (_, i) => 2020 + i);

//     return (
//         <Provider>
//             <View style={styles.container}>
//                 {/* Month Picker */}
//                 <Menu
//                     visible={monthMenuVisible}
//                     onDismiss={() => setMonthMenuVisible(false)}
//                     anchor={
//                         <Button mode="outlined" onPress={() => setMonthMenuVisible(true)}>
//                             {months[selectedMonth - 1]}
//                         </Button>
//                     }
//                 >
//                     {months.map((m, idx) => (
//                         <Menu.Item
//                             key={idx}
//                             title={m}
//                             onPress={() => {
//                                 setSelectedMonth(idx + 1);
//                                 setMonthMenuVisible(false);
//                             }}
//                         />
//                     ))}
//                 </Menu>

//                 {/* Year Picker */}
//                 <Menu
//                     visible={yearMenuVisible}
//                     onDismiss={() => setYearMenuVisible(false)}
//                     anchor={
//                         <Button mode="outlined" onPress={() => setYearMenuVisible(true)} style={{ marginTop: 10 }}>
//                             {selectedYear}
//                         </Button>
//                     }
//                 >
//                     {years.map((y) => (
//                         <Menu.Item
//                             key={y}
//                             title={y.toString()}
//                             onPress={() => {
//                                 setSelectedYear(y);
//                                 setYearMenuVisible(false);
//                             }}
//                         />
//                     ))}
//                 </Menu>

//                 {/* Display Selected */}
//                 <Text style={{ marginTop: 20, fontSize: 16 }}>
//                     Selected: {months[selectedMonth - 1]} {selectedYear}
//                 </Text>
//             </View>
//         </Provider>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         justifyContent: "center",
//     },
// });






// import React, { useState } from "react";
// import { View } from "react-native";
// import { CalendarList } from "react-native-calendars";

// export default function CalendarRangePicker() {
//     const [range, setRange] = useState<{ [key: string]: any }>({});
//     const [selected, setSelected] = useState("");

//     const onDayPress = (day: any) => {
//         const keys = Object.keys(range);
//         if (keys.length === 0) {
//             setRange({
//                 [day.dateString]: { startingDay: true, color: "#70d7c7", textColor: "white" },
//             });
//         } else {
//             const firstDate = keys[0];
//             const secondDate = day.dateString;

//             const dates = getDatesBetween(firstDate, secondDate);
//             const newRange: any = {};
//             dates.forEach((d, idx) => {
//                 newRange[d] = {
//                     color: "#70d7c7",
//                     textColor: "white",
//                     startingDay: idx === 0,
//                     endingDay: idx === dates.length - 1,
//                 };
//             });
//             setRange(newRange);
//         }
//     };

//     const getDatesBetween = (start: string, end: string) => {
//         const arr = [];
//         let curr = new Date(start);
//         const last = new Date(end);
//         while (curr <= last) {
//             arr.push(curr.toISOString().split("T")[0]);
//             curr.setDate(curr.getDate() + 1);
//         }
//         return arr;
//     };

//     return (
//         <View style={{ padding: 20 }}>
//             {/* <Calendar
//                 markingType={"period"}
//                 markedDates={range}
//                 onDayPress={onDayPress}
//             /> */}
//             <CalendarList
//                 onDayPress={(day) => setSelected(day.dateString)}
//                 pastScrollRange={24} // months before current
//                 futureScrollRange={24} // months after current
//                 scrollEnabled
//                 showScrollIndicator
//                 markedDates={{
//                     [selected]: { selected: true, selectedColor: "blue" },
//                 }}
//                 theme={{
//                     todayTextColor: "red",
//                     arrowColor: "blue",
//                 }}
//             />
//         </View>
//     );
// }







// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useState } from 'react';
// import { Button, Modal, Text, View } from 'react-native';

// export default function DatePicker() {

//     const [visible, setVisible] = useState(false);
//     const [startDate, setStartDate] = useState(new Date());
//     const [endDate, setEndDate] = useState(new Date());

//     return (
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//             <Button title="Select Date Range" onPress={() => setVisible(true)} />

//             <Modal visible={visible} transparent animationType="slide">
//                 <View
//                     style={{
//                         flex: 1,
//                         justifyContent: "center",
//                         backgroundColor: "rgba(0,0,0,0.5)",
//                     }}
//                 >
//                     <View
//                         style={{
//                             backgroundColor: "white",
//                             borderRadius: 12,
//                             padding: 20,
//                             marginHorizontal: 20,
//                         }}
//                     >
//                         <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
//                             Start Date
//                         </Text>
//                         <DateTimePicker
//                             value={startDate}
//                             mode="date"
//                             onChange={(_, date) => date && setStartDate(date)}
//                         />

//                         <Text style={{ fontWeight: "bold", marginVertical: 6 }}>
//                             End Date: 
//                         </Text>
//                         <DateTimePicker
//                             value={endDate}
//                             mode="date"
//                             onChange={(_, date) => date && setEndDate(date)}
//                         />

//                         <Button title="Done" onPress={() => setVisible(false)} />
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// }