import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../constants/theme";

const stackScreenOptions = {
  headerStyle: { backgroundColor: Colors.dark.background },
  headerTintColor: Colors.dark.text,
  headerTitleStyle: { fontWeight: "bold" },
  contentStyle: { backgroundColor: Colors.dark.background },
};

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={stackScreenOptions}>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="title/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="person/[id]"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
}