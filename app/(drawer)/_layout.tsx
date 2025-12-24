import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { ArrowLeft } from 'lucide-react-native';
import { StyleSheet, useColorScheme, View } from 'react-native';
import 'react-native-get-random-values';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { CustomColors } from '../theme/colors';
// import { color } from 'react-native-paper';

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

  const router = useRouter();
  const scheme = useColorScheme(); // light | dark

  const { colors } = useTheme();
  const styles = makeStyles(colors as CustomColors & MD3Colors);

  const rippleColor = colors.onBackground.replace(/[\d.]+\)$/,'0.4)');

  return (
    <Drawer defaultStatus="closed"
      screenOptions={({ navigation }) => ({
        headerRight: () => (
          navigation.canGoBack() && (<View
            style={styles.backButtonContainer}
          >
            <TouchableRipple
              borderless
              // rippleColor="rgba(0,0,0,.2)"
              // rippleColor={`rgba(${parseInt(colors.onBackground.slice(1, 3), 16)},${parseInt(colors.onBackground.slice(3, 5), 16)},${parseInt(colors.onBackground.slice(5, 7), 16)},0.2)`}
              rippleColor={rippleColor}
              onPress={() => router.back()}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowLeft size={24} color={colors.onBackground} />
              </View>
            </TouchableRipple>
          </View>)

        )
      })}
    >
      <Drawer.Screen name="screens/note/note-list" options={{
        title: 'Notes',
        drawerLabel: 'Notes',
        headerShown: true,
      }} />
      <Drawer.Screen name="screens/note/new-note" options={{
        title: 'New note',
        drawerLabel: 'New note',
        headerShown: true,
        drawerItemStyle: { display: 'none' }
      }} />
      <Drawer.Screen name="screens/note/[note_id]" options={{
        title: 'Edit note',
        drawerLabel: 'Edit note',
        headerShown: true,
        drawerItemStyle: { display: 'none' }
      }} />
      <Drawer.Screen name="screens/category/category-list" options={{
        title: 'Categories',
        drawerLabel: 'Categories',
        headerShown: true,

      }} />
      <Drawer.Screen name="screens/test-date" options={{
        title: 'Test',
        drawerLabel: 'Test',
        headerShown: true,

      }} />
      <Drawer.Screen name="screens/settings" options={{
        title: 'Settings',
        drawerLabel: 'Settings',
        headerShown: true,

      }} />
    </Drawer>
  );
}


const makeStyles = (colors: CustomColors & MD3Colors) => StyleSheet.create({
  backButtonContainer: {
    overflow: "hidden",
    borderRadius: 28,
    marginRight: 4,
  }
})

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