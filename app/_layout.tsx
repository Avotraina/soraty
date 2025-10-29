import { migrateDbIfNeeded } from "@/src/database/migrations/init-database";
import { queryClient } from "@/src/utils/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="soraty.db" onInit={migrateDbIfNeeded}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </SQLiteProvider>
  );
}
