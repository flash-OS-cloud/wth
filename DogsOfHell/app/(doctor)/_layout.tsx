import { Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function DoctorTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0f172a", 
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.7)", 
        headerStyle: {
          backgroundColor: "#9CC4FB", 
        },
        headerShadowVisible: false,
        headerTintColor: "#0f172a",
        tabBarStyle: {
          backgroundColor: "#9CC4FB", 
          borderTopWidth: 0, 
          elevation: 0, 
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "view-dashboard" : "view-dashboard-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="queries"
        options={{
          title: "Queries",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "clipboard-text-multiple" : "clipboard-text-multiple-outline"} 
              size={26} 
              color={color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "doctor" : "stethoscope"}
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tabs>
  );
}