import type { DatePickerHandle } from "@s77rt/react-native-date-picker";
import * as React from 'react';
import { useRef, useState } from "react";
import { Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";

export default function DeleteCategoryConfirmation() {

    const datePicker = useRef<DatePickerHandle>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    return (
        <View
            style={{
                overflow: "hidden",
                borderRadius: 28,
                marginRight: 12,
            }}
        >
            <TouchableRipple
                borderless
                rippleColor="rgba(0,0,0,.2)"
                onPress={() => console.log('pressed')}
            >
                <View
                    style={{
                        width: 40,
                        height: 40,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text>←</Text>
                </View>
            </TouchableRipple>
        </View>
        // <View>
        //     <Button title="Test Date Screen" onPress={() => datePicker.current?.showPicker()} />
        //     <DatePicker
        //         ref={datePicker}
        //         type="date"
        //         multiple={false}
        //         value={selectedDate}
        //         onChange={setSelectedDate}
        //     />

        //     <TouchableRipple
        //         onPress={() => console.log('Pressed')}
        //         style={{
        //             // backgroundColor: 'red',
        //             // flex: 1,
        //             height: '100%'
        //         }}
        //         rippleColor="rgba(0, 0, 0, .32)"
        //     >
        //         <Text>Press anywhere</Text>
        //     </TouchableRipple>
        // </View>
    )

}