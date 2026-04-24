import DirectMessage from "@/components/dm";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";

export default function PatientProfile() {
  const [showChat, setShowChat] = useState(false);
  const patient = {
    id: 1,
    name: "Rahul Sharma",
    username: "@rahul_s",
    age: 28,
    gender: "Male",
    bloodType: "O+",
    weight: "72 kg",
    height: "178 cm",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=male",
    diagnoses: [
      {
        id: 1,
        condition: "Acute Bronchitis",
        date: "Mar 12, 2026",
        status: "Resolved",
        icon: "medkit",
      },
      {
        id: 2,
        condition: "Mild Hypertension",
        date: "Jan 05, 2026",
        status: "Ongoing",
        icon: "pulse",
      },
      {
        id: 3,
        condition: "Vitamin D Deficiency",
        date: "Nov 20, 2025",
        status: "Resolved",
        icon: "sunny",
      },
    ],
  };

  return (
    <View className="flex-1 bg-zinc-950">
      <View className="flex-row items-center justify-between px-4 pt-12 pb-4 bg-zinc-900 border-b border-zinc-800">
        <Pressable
          className="bg-zinc-800 p-2 rounded-full"
          onPress={() => router.replace("/(patient)/dashboard")}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text className="text-white text-xl font-bold">Patient Record</Text>
        <Pressable className="bg-zinc-800 p-2 rounded-full">
          <Ionicons name="ellipsis-horizontal" size={24} color="white" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-6 mt-4">
          <View className="relative">
            <Image
              source={{ uri: patient.avatar }}
              className="w-28 h-28 rounded-full border-4 border-zinc-800"
            />
            <View className="absolute bottom-0 right-0 bg-teal-500 rounded-full p-1 border-2 border-zinc-900">
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
          </View>

          <Text className="text-white text-2xl font-bold mt-4">
            {patient.name}
          </Text>
          <Text className="text-teal-400 text-base font-medium mb-4">
            {patient.username}
          </Text>

          <View className="flex-row justify-between w-full bg-zinc-950 rounded-xl p-4 border border-zinc-800">
            <View className="items-center flex-1 border-r border-zinc-800">
              <Text className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
                Age
              </Text>
              <Text className="text-white font-semibold text-lg">
                {patient.age}
              </Text>
            </View>
            <View className="items-center flex-1 border-r border-zinc-800">
              <Text className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
                Blood
              </Text>
              <Text className="text-red-400 font-semibold text-lg">
                {patient.bloodType}
              </Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
                Weight
              </Text>
              <Text className="text-white font-semibold text-lg">
                {patient.weight}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-3 mb-8">
          <Pressable
            className="flex-1 bg-teal-600 py-3.5 rounded-xl flex-row justify-center items-center gap-2"
            onPress={() => setShowChat(true)}
          >
            <Ionicons name="chatbubble-ellipses" size={20} color="white" />
            <Text className="text-white font-semibold text-base">Message</Text>
          </Pressable>
          <Pressable className="flex-1 bg-zinc-800 py-3.5 rounded-xl flex-row justify-center items-center gap-2 border border-zinc-700">
            <Ionicons name="document-text" size={20} color="white" />
            <Text className="text-white font-semibold text-base">
              Full Report
            </Text>
          </Pressable>
        </View>

        <View>
          <Text className="text-white text-xl font-bold mb-4">
            Recent Diagnoses
          </Text>

          <View className="bg-zinc-900 rounded-2xl border border-zinc-800 p-2">
            {patient.diagnoses.map((record, index) => (
              <View
                key={record.id}
                className={`flex-row items-center p-3 ${index !== patient.diagnoses.length - 1 ? "border-b border-zinc-800" : ""}`}
              >
                <View className="w-12 h-12 bg-zinc-950 rounded-full items-center justify-center border border-zinc-800 mr-4">
                  <Ionicons
                    name={record.icon as any}
                    size={22}
                    color="#2dd4bf"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-white font-bold text-base mb-0.5">
                    {record.condition}
                  </Text>
                  <Text className="text-zinc-500 text-sm">{record.date}</Text>
                </View>

                <View
                  className={`px-3 py-1 rounded-full ${record.status === "Ongoing" ? "bg-orange-500/20 border border-orange-500/30" : "bg-green-500/20 border border-green-500/30"}`}
                >
                  <Text
                    className={`text-xs font-bold ${record.status === "Ongoing" ? "text-orange-400" : "text-green-400"}`}
                  >
                    {record.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={showChat}
        animationType="slide"
        onRequestClose={() => setShowChat(false)}
        presentationStyle="fullScreen"
      >
        <DirectMessage
          user={{
            id: String(patient.id),
            patientName: patient.name,
            avatar: patient.avatar,
          }}
          onClose={() => setShowChat(false)}
          currentUserRole="patient"
        />
      </Modal>
    </View>
  );
}
