import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 1. IMPORT DM COMPONENT
import DirectMessage from "../../components/dm";

export default function DoctorQueries() {
  const [activeTab, setActiveTab] = useState<"Active" | "Resolved">("Active");

  // 2. ADD CHAT STATE
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  // Added IDs (1 & 2) and Avatars to match the mock database in your dm.tsx!
  const queries = [
    {
      id: "1",
      name: "Rahul Sharma",
      type: "Prescription - Paracetamol 500mg",
      time: "10 Apr, 10:30 AM",
      status: "Active",
      urgent: true,
      avatar: "https://xsgames.co/randomusers/avatar.php?g=male",
    },
    {
      id: "2",
      name: "Priya Patel",
      type: "Wound image - Minor cut on hand",
      time: "9 Apr, 3:15 PM",
      status: "Resolved",
      urgent: false,
      avatar: "https://xsgames.co/randomusers/avatar.php?g=female",
    },
    {
      id: "125",
      name: "Amit Patel",
      type: "Medical report uploaded - Blood test",
      time: "8 Apr, 11:45 AM",
      status: "Active",
      urgent: false,
      avatar:
        "https://images.unsplash.com/photo-1559706169-d36654cb8f34?q=80&w=200&auto=format&fit=crop",
    },
  ];

  const filteredQueries = queries.filter((q) => q.status === activeTab);

  return (
    <SafeAreaView className="flex-1 bg-[#F4F8FF]">
      {/* --- HEADER --- */}
      <View className="px-4 pt-6 pb-4 bg-white border-b border-blue-50 shadow-sm">
        <View className="flex-row items-center mb-4 gap-3">
          <Pressable className="w-10 h-10 bg-[#F4F8FF] rounded-full items-center justify-center border border-blue-100">
            <Ionicons name="arrow-back" size={20} color="#5A9CF8" />
          </Pressable>
          <Text className="text-slate-800 text-2xl font-bold">My Requests</Text>
        </View>

        <View className="flex-row bg-[#F4F8FF] rounded-full p-1 border border-blue-50">
          {(["Active", "Resolved"] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-full items-center ${activeTab === tab ? "bg-[#5A9CF8] shadow-sm" : ""}`}
            >
              <Text
                className={`font-bold ${activeTab === tab ? "text-white" : "text-slate-500"}`}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* --- QUERY LIST --- */}
      <ScrollView
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        {filteredQueries.map((query) => (
          // 3. TRIGGER DM MODAL ON CARD PRESS
          <Pressable
            key={query.id}
            onPress={() =>
              setSelectedPatient({
                id: query.id,
                patientName: query.name,
                avatar: query.avatar,
              })
            }
            className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-blue-50 flex-row items-center justify-between"
          >
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-1">
                <Text className="text-slate-800 font-bold text-base">
                  Case #{query.id}
                </Text>
                <Text className="text-slate-500 text-xs">{query.time}</Text>
              </View>
              <Text className="text-slate-600 text-sm mb-3">
                {query.name} • {query.type}
              </Text>

              <View
                className={`self-start px-3 py-1 rounded-full flex-row items-center gap-1 ${
                  query.status === "Active"
                    ? query.urgent
                      ? "bg-red-500"
                      : "bg-orange-500"
                    : "bg-green-500"
                }`}
              >
                <Ionicons
                  name={query.status === "Resolved" ? "checkmark" : "ellipse"}
                  size={10}
                  color="white"
                />
                <Text className="text-white text-xs font-bold">
                  {query.status === "Active"
                    ? query.urgent
                      ? "Needs Response"
                      : "Waiting"
                    : "Responded"}
                </Text>
              </View>
            </View>
            <Ionicons name="chatbubbles" size={24} color="#5A9CF8" />
          </Pressable>
        ))}
      </ScrollView>

      {/* --- 4. ADD DM MODAL --- */}
      <Modal
        visible={selectedPatient !== null}
        animationType="slide"
        onRequestClose={() => setSelectedPatient(null)}
      >
        <DirectMessage
          user={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          currentUserRole="doctor"
        />
      </Modal>
    </SafeAreaView>
  );
}
