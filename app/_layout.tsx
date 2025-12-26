import { ThemeProvider, useThemeContext } from "@/app/theme/theme-context";
// import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from 'expo-notifications';
import { Slot, useRouter } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { PaperProvider } from "react-native-paper";
import { ToastProvider } from "react-native-paper-toast";
import { SnackbarProvider } from "./contexts/snackbar-provider";
import { migrateDbIfNeeded } from "./database/migrations/init-database";
import { registerBackgroundReminderTask } from "./notifications/background";
import { registerForNotifications } from "./notifications/notification";
import { scheduleAllReminders } from "./notifications/schedule-all";
import { queryClient } from "./utils/query-client";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,

        // NEW REQUIRED FIELDS
        shouldShowBanner: true,   // iOS lock screen banner
        shouldShowList: true,     // iOS notification center list
    }),
});

export default function RootLayout() {

    useEffect(() => {
        (async () => {
            await registerForNotifications();
            await registerBackgroundReminderTask();
            // schedule all reminders once at app start
            await scheduleAllReminders();
        })();
    }, []);

    useEffect(() => {
        const setupNotifications = async () => {
            if (Platform.OS === "android") {
                await Notifications.setNotificationChannelAsync("reminders", {
                    name: "Reminders",
                    importance: Notifications.AndroidImportance.HIGH,
                    sound: "default",
                });
            }
        };

        setupNotifications();
    }, []);

    const router = useRouter();


    useEffect(() => {
        // When user taps the notification
        const subscription = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                const data = response.notification.request.content.data;

                // Example: navigate to a note
                if (data?.noteId) {
                    // router.push(`/note/${data.noteId}`);
                    router.push(`/(drawer)/screens/note/${data.noteId}`);
                }

                // Or navigate to any screen:
                // router.push("/(drawer)/screens/note/note-list");
            }
        );

        return () => subscription.remove();
    }, []);

    return (
        <ThemeProvider>
            {/* <GestureHandlerRootView style={{flex: 1}}> */}
            {/* <SafeAreaProvider> */}
            <SQLiteProvider databaseName="soraty.db" onInit={migrateDbIfNeeded}>
                <QueryProviderWrapper />
            </SQLiteProvider>
            {/* </SafeAreaProvider> */}
            {/* </GestureHandlerRootView> */}
        </ThemeProvider>
    );
}

function QueryProviderWrapper() {

    const { theme } = useThemeContext();

    return (
        <QueryClientProvider client={queryClient}>
            <NavigationThemeProvider value={theme}>
                <PaperThemeWrapper />
            </NavigationThemeProvider>
        </QueryClientProvider>
    );
}

function PaperThemeWrapper() {
    const { theme } = useThemeContext();

    return (
        <PaperProvider theme={theme}>
            <StatusBar style={theme.dark ? 'light' : 'dark'} networkActivityIndicatorVisible />
            <ToastProvider>
                <SnackbarProvider>
                    <Slot />
                </SnackbarProvider>
            </ToastProvider>
        </PaperProvider>
    );
}