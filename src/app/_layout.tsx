import { ThemeProvider, useThemeContext } from "@/src/app/theme/theme-context";
import { QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from 'expo-notifications';
import { Slot, useRouter } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { PaperProvider } from "react-native-paper";
import { ToastProvider } from "react-native-paper-toast";
import { SafeAreaProvider } from "react-native-safe-area-context";
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
            <SafeAreaProvider>
                <SQLiteProvider databaseName="soraty.db" onInit={migrateDbIfNeeded}>
                    <QueryProviderWrapper />
                </SQLiteProvider>
            </SafeAreaProvider>
        </ThemeProvider>
    );
}

function QueryProviderWrapper() {
    return (
        <QueryClientProvider client={queryClient}>
            <PaperThemeWrapper />
        </QueryClientProvider>
    );
}

function PaperThemeWrapper() {
    const { theme } = useThemeContext();

    return (
        <PaperProvider theme={theme}>
            <ToastProvider>
                <SnackbarProvider>
                    <StatusBar style="inverted" translucent />
                    <Slot />
                </SnackbarProvider>
            </ToastProvider>
        </PaperProvider>
    );
}