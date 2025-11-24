import { Drawer } from 'expo-router/drawer';
import 'react-native-get-random-values';

// export default function RootLayout() {
// export default function DrawerLayout() {
//   return (
//     // <SQLiteProvider databaseName="soraty.db" onInit={migrateDbIfNeeded}>
//     //   <QueryClientProvider client={queryClient}>
//     //     <AppInner />
//     //   </QueryClientProvider>
//     // </SQLiteProvider>
//     // <Portal.Provider>
//     <ThemeProvider>
//       <SafeAreaProvider>
//         {/* <AppInner /> */}
//         <MainDrawer />
//       </SafeAreaProvider>
//     </ThemeProvider>
//     // </Portal.Provider>

//   );
// }


export default function DrawerLayout() {
return (
    <Drawer defaultStatus="closed">
      <Drawer.Screen name="screens/note/note-list" options={{
        title: 'Notes',
        drawerLabel: 'Notes',
        headerShown: true,
      }} />
      <Drawer.Screen name="screens/note/new-note" options={{
        title: 'New note',
        drawerLabel: 'New note',
        headerShown: true,
        drawerItemStyle: { display: 'none'}
      }} />
      <Drawer.Screen name="screens/note/[note_id]" options={{
        title: 'New note',
        drawerLabel: 'New note',
        headerShown: true,
        drawerItemStyle: { display: 'none'}
      }} />
      <Drawer.Screen name="screens/category/category-list" options={{
        title: 'Categories',
        drawerLabel: 'Categories',
        headerShown: true,

      }} />
    </Drawer>
  );
}


// function AppInner() {
//   const { theme } = useThemeContext();

//   return (

//     <PaperProvider theme={theme}>
//       <SQLiteProvider databaseName="soraty.db" onInit={migrateDbIfNeeded}>
//         <QueryClientProvider client={queryClient}>
//           {/* <NavigationContainer theme={theme} onReady={() => BootSplash.hide({ fade: true })}> */}
//           {/* <NavigationContainer theme={theme}> */}
//           <ToastProvider>
//             <SnackbarProvider>
//               {/* <Rootstack /> */}
//               <Stack
//                 initialRouteName="(note)/note-list"
//                 // initialRouteName="(note)/new-note"
//                 // initialRouteName="(category)/category-list"
//                 // initialRouteName="(category)/category-list"
//                 screenOptions={{
//                   headerShown: true,
//                   headerStyle: {
//                     backgroundColor: '#f4511e',
//                   },
//                   headerTintColor: '#fff',
//                   headerTitleStyle: {
//                     fontWeight: 'bold',
//                   },
//                 }}>
//                 {/* Optionally configure static options outside the route.*/}
//                 <Stack.Screen name="old-list" options={{ title: 'List' }} />
//                 <Stack.Screen name="list" options={{ title: 'List' }} />
//                 <Stack.Screen name="new" options={{ title: 'New' }} />
//                 <Stack.Screen name="(category)/category-list" options={{ title: 'Categories' }} />
//                 <Stack.Screen name="(note)/note-list" options={{ title: 'Notes' }} />
//                 <Stack.Screen name="(note)/new-note" options={{ title: 'Notes' }} />
//                 <Stack.Screen name="(note)/test-date" options={{ title: 'Notes' }} />
//                 {/* <Stack.Screen name="(note)/test-paper-date" options={{ title: 'Notes' }} /> */}
//               </Stack>
//             </SnackbarProvider>
//           </ToastProvider>
//           {/* </NavigationContainer> */}
//         </QueryClientProvider>
//       </SQLiteProvider>

//     </PaperProvider>

//   );

// }


// function MainDrawer() {

//   const { theme } = useThemeContext();

//   return (

//     <PaperProvider theme={theme}>
//       <SQLiteProvider databaseName="soraty.db" onInit={migrateDbIfNeeded}>
//         <QueryClientProvider client={queryClient}>
//           <ToastProvider>
//             <SnackbarProvider>
//               <Drawer defaultStatus="closed">
//                 <Drawer.Screen name="screens/note/note-list" options={{
//                   title: 'Notes',
//                   drawerLabel: 'Notes',
//                   headerShown: true,
//                 }} />
//                 <Drawer.Screen name="category-list" options={{
//                   title: 'Categories',
//                   drawerLabel: 'Categoriess',
//                   headerShown: true,

//                 }} />
//               </Drawer>
//             </SnackbarProvider>
//           </ToastProvider>
//         </QueryClientProvider>
//       </SQLiteProvider>
//     </PaperProvider>
//   );

// }