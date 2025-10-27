import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      initialRouteName="list"
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
    </Stack>
  );
}
