import type { DatePickerHandle } from "@s77rt/react-native-date-picker";
import { DatePicker } from "@s77rt/react-native-date-picker";
import { useRef, useState } from "react";
import { Button, View } from "react-native";

export default function DeleteCategoryConfirmation() {

    const datePicker = useRef<DatePickerHandle>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    return (
        <View>
            <Button title="Test Date Screen" onPress={() => datePicker.current?.showPicker()} />
            <DatePicker
                ref={datePicker}
                type="date"
                multiple={false}
                value={selectedDate}
                onChange={setSelectedDate}
            />
        </View>
    )

}