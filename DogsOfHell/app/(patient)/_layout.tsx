import { Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0f172a",
        tabBarInactiveTintColor: "rgba(254, 255, 255, 0.7)",
        headerStyle: {
          backgroundColor: "#9CC4FB",
        },
        headerShadowVisible: false,
        headerTintColor: "#0f172a",
        tabBarStyle: {
          backgroundColor: "#9CC4FB",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "clover" : "clover-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="inbox"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name="inbox-full" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="face-man-profile"
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
