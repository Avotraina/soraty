import { ThemeProvider, useThemeContext } from "@/src/app/theme/theme-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { ToastProvider } from "react-native-paper-toast";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SnackbarProvider } from "./contexts/snackbar-provider";
import { migrateDbIfNeeded } from "./database/migrations/init-database";
import { queryClient } from "./utils/query-client";


export default function RootLayout() {
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