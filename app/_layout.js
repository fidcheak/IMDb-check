import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../constants/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.dark.background },
          headerTintColor: Colors.dark.text,
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: Colors.dark.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="title/[id]"
          options={{ title: "Details", presentation: "modal" }}
        />
      </Stack>
    </>
  );
}
