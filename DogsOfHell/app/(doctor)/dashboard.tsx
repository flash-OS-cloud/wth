import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 1. IMPORT YOUR DM COMPONENT
import DirectMessage from "../../components/dm";

export default function DoctorDashboard() {
  const [showDropdown, setShowDropdown] = useState(false);

  // 2. ADD STATE FOR THE CHAT MODAL
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  const patientRequests = [
    {
      id: "1",
      name: "Rahul Sharma",
      type: "Prescription - Paracetamol 500mg",
      time: "Today, 10:30 AM",
      status: "New Case",
      image: "https://xsgames.co/randomusers/avatar.php?g=male",
    },
    {
      id: "2",
      name: "Priya Patel",
      type: "Wound image - Minor cut on hand",
      time: "Today, 9:45 AM",
      status: "New Case",
      image: "https://xsgames.co/randomusers/avatar.php?g=female",
    },
    {
      id: "125",
      name: "Amit Patel",
      type: "X-ray scan - Chest examination",
      time: "Today, 8:20 AM",
      status: "Pending",
      image:
        "https://images.unsplash.com/photo-1559706169-d36654cb8f34?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "124",
      name: "Sneha Reddy",
      type: "Prescription - Antibiotic course",
      time: "Yesterday, 6:15 PM",
      status: "Responded",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200&auto=format&fit=crop",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#70A7F5]">
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 40,
          paddingTop: 20,
        }}
      >
        {/* --- HEADER --- */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-3xl font-bold text-[#5A9CF8]">Relay</Text>
            <View className="flex-row items-center gap-1 mt-1">
              <Ionicons name="medkit-outline" size={16} color="#64748b" />
              <Text className="text-slate-500 font-medium text-sm">
                Doctor Panel
              </Text>
            </View>
          </View>
          <Pressable onPress={() => setShowDropdown(true)}>
            <View className="w-12 h-12 bg-teal-600 rounded-full items-center justify-center border-2 border-white shadow-sm">
              <Ionicons name="person" size={24} color="white" />
            </View>
          </Pressable>
        </View>

        {/* --- SUMMARY CARDS --- */}
        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 bg-[#FDF2F2] p-4 rounded-2xl shadow-sm borzzder border-red-100">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-2 h-2 bg-red-400 rounded-full" />
              <Text className="text-slate-600 font-semibold">New Cases</Text>
            </View>
            <Text className="text-red-500 text-3xl font-bold">2</Text>
          </View>
          <View className="flex-1 bg-[#FFF8EE] p-4 rounded-2xl shadow-sm border border-orange-100">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-2 h-2 bg-orange-400 rounded-full" />
              <Text className="text-slate-600 font-semibold">Pending</Text>
            </View>
            <Text className="text-orange-500 text-3xl font-bold">1</Text>
          </View>
        </View>

        {/* --- PATIENT REQUESTS LIST --- */}
        <Text className="text-slate-800 text-xl font-bold mb-4">
          Patient Requests
        </Text>

        <View className="gap-4">
          {patientRequests.map((req) => (
            <View
              key={req.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-blue-50 flex-row gap-4"
            >
              <Image
                source={{ uri: req.image }}
                className="w-20 h-20 rounded-xl"
              />
              <View className="flex-1 justify-center">
                <Text className="text-slate-800 font-bold text-lg">
                  {req.name}
                </Text>
                <Text className="text-slate-500 text-xs mb-1">
                  Case #{req.id} • {req.time}
                </Text>
                <Text className="text-slate-600 text-sm mb-3" numberOfLines={1}>
                  {req.type}
                </Text>

                <View className="flex-row items-center justify-between">
                  <View
                    className={`px-3 py-1 rounded-full flex-row items-center gap-1 ${
                      req.status === "New Case"
                        ? "bg-red-500"
                        : req.status === "Pending"
                          ? "bg-orange-500"
                          : "bg-green-500"
                    }`}
                  >
                    <Ionicons
                      name={
                        req.status === "Responded" ? "checkmark" : "ellipse"
                      }
                      size={10}
                      color="white"
                    />
                    <Text className="text-white text-xs font-bold">
                      {req.status}
                    </Text>
                  </View>

                  {/* 3. TRIGGER CHAT MODAL ON PRESS */}
                  <Pressable
                    onPress={() =>
                      setSelectedPatient({
                        id: req.id,
                        patientName: req.name,
                        avatar: req.image,
                      })
                    }
                    className="bg-teal-500 px-4 py-1.5 rounded-full flex-row items-center gap-1"
                  >
                    <Ionicons
                      name="chatbubbles-outline"
                      size={14}
                      color="white"
                    />
                    <Text className="text-white text-xs font-bold">
                      Message
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* --- DROPDOWN MODAL --- */}
      <Modal visible={showDropdown} transparent animationType="fade">
        {/* ... (Keep your existing Dropdown code here) ... */}
        <Pressable className="flex-1" onPress={() => setShowDropdown(false)}>
          <View className="absolute top-24 right-4 w-48 bg-white rounded-2xl p-2 border border-blue-100 shadow-xl">
            <Pressable
              className="flex-row items-center gap-3 p-3 rounded-xl active:bg-blue-50"
              onPress={() => {
                setShowDropdown(false);
                router.push("/(doctor)/profile");
              }}
            >
              <View className="w-8 h-8 rounded-full bg-teal-100 items-center justify-center">
                <Ionicons name="person-outline" size={16} color="#0f766e" />
              </View>
              <Text className="text-slate-800 font-medium text-base">
                Profile
              </Text>
            </Pressable>
            <View className="h-[1px] bg-slate-100 my-1 mx-2" />
            <Pressable
              className="flex-row items-center gap-3 p-3 rounded-xl active:bg-red-50"
              onPress={() => {
                setShowDropdown(false);
                router.replace("/");
              }}
            >
              <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center">
                <Ionicons name="log-out-outline" size={16} color="#ef4444" />
              </View>
              <Text className="text-red-500 font-medium text-base">Logout</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

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
