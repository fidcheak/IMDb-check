import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Без подписей
        tabBarActiveTintColor: "#F5C518",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: styles.floatingTabBar,
        tabBarItemStyle: styles.tabItem, // Прижимаем контент внутри
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="top"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "star" : "star-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingTabBar: {
    position: "absolute",
    bottom: 30,
    marginHorizontal: 30, // Симметричный отступ от краев экрана
    backgroundColor: "rgba(28, 28, 30, 0.98)",
    borderRadius: 30,
    height: 64,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    // Убираем системные отступы iOS/Android для точного центрирования
    paddingBottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
});
