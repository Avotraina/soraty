// https://marceloprado.github.io/flash-calendar/fundamentals/tips-and-tricks


import type { CalendarOnDayPress, CalendarTheme } from "@marceloterreiro/flash-calendar";
import { Calendar, toDateId, useDateRange } from "@marceloterreiro/flash-calendar";
import { addMonths } from "date-fns";
import { useCallback, useState } from "react";
import { Text } from "react-native";

const todayId = toDateId(new Date());
const maxDateId = toDateId(addMonths(new Date(), 12));

const linearAccent = "#585ABF";

const linearTheme: CalendarTheme = {
  rowMonth: {
    content: {
      textAlign: "left",
      color: "rgba(255, 255, 255, 0.5)",
      fontWeight: "700",
    },
  },
  rowWeek: {
    container: {
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255, 255, 255, 0.1)",
      borderStyle: "solid",
    },
  },
  itemWeekName: { content: { color: "rgba(255, 255, 255, 0.5)" } },
  itemDayContainer: {
    activeDayFiller: {
      backgroundColor: linearAccent,
    },
  },
  itemDay: {
    idle: ({ isPressed, isWeekend }: any) => ({
      container: {
        backgroundColor: isPressed ? linearAccent : "transparent",
        borderRadius: 4,
      },
      content: {
        color: isWeekend && !isPressed ? "rgba(255, 255, 255, 0.5)" : "#ffffff",
      },
    }),
    today: ({ isPressed }: any) => ({
      container: {
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: isPressed ? 4 : 30,
        backgroundColor: isPressed ? linearAccent : "transparent",
      },
      content: {
        color: isPressed ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
      },
    }),
    active: ({ isEndOfRange, isStartOfRange }: any) => ({
      container: {
        backgroundColor: linearAccent,
        borderTopLeftRadius: isStartOfRange ? 4 : 0,
        borderBottomLeftRadius: isStartOfRange ? 4 : 0,
        borderTopRightRadius: isEndOfRange ? 4 : 0,
        borderBottomRightRadius: isEndOfRange ? 4 : 0,
      },
      content: {
        color: "#ffffff",
      },
    }),
  },
};

export const SlowExampleAddressed = () => {
  const [dateIds, setDateIds] = useState<string[]>([]);
  const dateRanges = dateIds.map((dateId) => ({
    startId: dateId,
    endId: dateId,
  }));

  // This is the fix: memoized onCalendarDayPress and updater function pattern
  // It keeps `BaseCalendar` props stable, allowing each month to skip re-renders
  const handleCalendarDayPress = useCallback<CalendarOnDayPress>((dateId) => {
    setDateIds((dateIds) => {
      if (dateIds.includes(dateId)) {
        return dateIds.filter((id) => id !== dateId);
      } else {
        return [...dateIds, dateId];
      }
    });
  }, []);

  const {
    calendarActiveDateRanges,
    onCalendarDayPress,
    // Also available for your convenience:
    // dateRange, // { startId?: string, endId?: string }
    // isDateRangeValid, // boolean
    // onClearDateRange, // () => void
  } = useDateRange();

  return (
    <Calendar.VStack alignItems="stretch" grow spacing={12}>
      <Text>✅ This is safe to copy, perf issues addressed</Text>

      <Calendar.List style={{backgroundColor: 'black'}}
        calendarActiveDateRanges={calendarActiveDateRanges}
        onCalendarDayPress={onCalendarDayPress}
        theme={linearTheme}
      />

      {/* <Calendar.List style={{backgroundColor: 'black'}}
        calendarActiveDateRanges={dateRanges}
        calendarInitialMonthId={todayId}
        calendarMaxDateId={maxDateId}
        calendarMinDateId={todayId} 
        onCalendarDayPress={handleCalendarDayPress}
      /> */}
    </Calendar.VStack>
  );
};

export default SlowExampleAddressed



// import type { CalendarOnDayPress } from "@marceloterreiro/flash-calendar";
// import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
// import { addMonths } from "date-fns";
// import { useCallback, useState } from "react";
// import { Text } from "react-native";

// const todayId = toDateId(new Date());
// const maxDateId = toDateId(addMonths(new Date(), 12));

// const SlowExampleAddressed = () => {
//   const [dateIds, setDateIds] = useState<string[]>([]);
//   const dateRanges = dateIds.map((dateId) => ({
//     startId: dateId,
//     endId: dateId,
//   }));

//   // This is the fix: memoized onCalendarDayPress and updater function pattern
//   // It keeps `BaseCalendar` props stable, allowing each month to skip re-renders
//   const handleCalendarDayPress = useCallback<CalendarOnDayPress>((dateId) => {
//     setDateIds((dateIds) => {
//       if (dateIds.includes(dateId)) {
//         return dateIds.filter((id) => id !== dateId);
//       } else {
//         return [...dateIds, dateId];
//       }
//     });
//   }, []);

//   return (
//     <Calendar.VStack alignItems="stretch" grow spacing={12}>
//       <Text>✅ This is safe to copy, perf issues addressed</Text>

//       <Calendar.List style={{backgroundColor: 'black'}}
//         calendarActiveDateRanges={dateRanges}
//         calendarInitialMonthId={todayId}
//         calendarMaxDateId={maxDateId}
//         calendarMinDateId={todayId}
//         onCalendarDayPress={handleCalendarDayPress}
//       />
//     </Calendar.VStack>
//   );
// };


// export default SlowExampleAddressed