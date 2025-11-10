import { SnackbarProvider } from "@/app/src/contexts/snackbar-provider";
import { migrateDbIfNeeded } from "@/app/src/database/migrations/init-database";
import { ThemeProvider, useThemeContext } from "@/app/src/theme/theme-context";
import { queryClient } from "@/app/src/utils/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import 'react-native-get-random-values';
import { PaperProvider } from "react-native-paper";
import { ToastProvider } from 'react-native-paper-toast';
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    // <SQLiteProvider databaseName="soraty.db" onInit={migrateDbIfNeeded}>
    //   <QueryClientProvider client={queryClient}>
    //     <AppInner />
    //   </QueryClientProvider>
    // </SQLiteProvider>
    // <Portal.Provider>
    <ThemeProvider>
      <SafeAreaProvider>
        <AppInner />
      </SafeAreaProvider>
    </ThemeProvider>
    // </Portal.Provider>

  );
}



function AppInner() {
  const { theme } = useThemeContext();

  return (

    <PaperProvider theme={theme}>
      <SQLiteProvider databaseName="soraty.db" onInit={migrateDbIfNeeded}>
        <QueryClientProvider client={queryClient}>
          {/* <NavigationContainer theme={theme} onReady={() => BootSplash.hide({ fade: true })}> */}
          {/* <NavigationContainer theme={theme}> */}
          <ToastProvider>
            <SnackbarProvider>
              {/* <Rootstack /> */}
              <Stack
                initialRouteName="(category)/category-list"
                screenOptions={{
                  headerShown: true,
                  headerStyle: {
                    backgroundColor: '#f4511e',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}>
                {/* Optionally configure static options outside the route.*/}
                <Stack.Screen name="old-list" options={{ title: 'List' }} />
                <Stack.Screen name="list" options={{ title: 'List' }} />
                <Stack.Screen name="new" options={{ title: 'New' }} />
                <Stack.Screen name="(category)/category-list" options={{ title: 'Categories' }} />
              </Stack>
            </SnackbarProvider>
          </ToastProvider>
          {/* </NavigationContainer> */}
        </QueryClientProvider>
      </SQLiteProvider>

    </PaperProvider>

  );

}