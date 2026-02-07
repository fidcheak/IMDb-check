import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Colors } from "../../constants/theme";
import LogoHeader from "../../components/LogoHeader";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#1C1C1C", // A slightly lighter black for contrast
          borderTopColor: "#333333",
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.dark.tint, // Our new gold color
        tabBarInactiveTintColor: Colors.dark.icon, // Our new icon grey
        headerShown: true,
        headerStyle: { backgroundColor: Colors.dark.background },
        headerTintColor: Colors.dark.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: () => <LogoHeader />,
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <Ionicons name="search" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="top"
        options={{
          title: "Top Charts",
          tabBarIcon: ({ color }) => (
            <Ionicons name="trophy" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
