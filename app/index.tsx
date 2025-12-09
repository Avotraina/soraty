import { Redirect } from "expo-router";
import "expo-router/entry";
// import "./global.css";

export default function Index() {
  return <Redirect href="/(drawer)/screens/note/note-list" />;
//   return <Slot />;
}
