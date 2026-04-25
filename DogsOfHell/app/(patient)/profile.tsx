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
<View className="flex-1 bg-white">
  {/* Header */}
  <View className="flex-row items-center justify-between px-4 pt-12 pb-4 bg-white border-b border-gray-200">
    <Pressable
      className="bg-gray-100 p-2 rounded-full"
      onPress={() => router.replace("/(patient)/dashboard")}
    >
      <Ionicons name="arrow-back" size={24} color="black" />
    </Pressable>

    <Text className="text-black text-xl font-bold">Patient Record</Text>

    <Pressable className="bg-gray-100 p-2 rounded-full">
      <Ionicons name="ellipsis-horizontal" size={24} color="black" />
    </Pressable>
  </View>

  <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
    {/* Profile Card */}
    <View className="items-center bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-6 mt-4">
      <View className="relative">
        <Image
          source={{ uri: patient.avatar }}
          className="w-28 h-28 rounded-full border-4 border-white"
        />
        <View className="absolute bottom-0 right-0 bg-teal-500 rounded-full p-1 border-2 border-white">
          <Ionicons name="checkmark" size={16} color="white" />
        </View>
      </View>

      <Text className="text-black text-2xl font-bold mt-4">
        {patient.name}
      </Text>
      <Text className="text-teal-600 text-base font-medium mb-4">
        {patient.username}
      </Text>

      <View className="flex-row justify-between w-full bg-white rounded-xl p-4 border border-gray-200">
        <View className="items-center flex-1 border-r border-gray-200">
          <Text className="text-gray-500 text-xs mb-1">Age</Text>
          <Text className="text-black font-semibold text-lg">
            {patient.age}
          </Text>
        </View>

        <View className="items-center flex-1 border-r border-gray-200">
          <Text className="text-gray-500 text-xs mb-1">Blood</Text>
          <Text className="text-red-500 font-semibold text-lg">
            {patient.bloodType}
          </Text>
        </View>

        <View className="items-center flex-1">
          <Text className="text-gray-500 text-xs mb-1">Weight</Text>
          <Text className="text-black font-semibold text-lg">
            {patient.weight}
          </Text>
        </View>
      </View>
    </View>

    {/* Buttons */}
    <View className="flex-row gap-3 mb-8">
      <Pressable
        className="flex-1 bg-teal-600 py-3.5 rounded-xl flex-row justify-center items-center gap-2"
        onPress={() => setShowChat(true)}
      >
        <Ionicons name="chatbubble-ellipses" size={20} color="white" />
        <Text className="text-white font-semibold text-base">Message</Text>
      </Pressable>

      <Pressable className="flex-1 bg-gray-100 py-3.5 rounded-xl flex-row justify-center items-center gap-2 border border-gray-200">
        <Ionicons name="document-text" size={20} color="black" />
        <Text className="text-black font-semibold text-base">
          Full Report
        </Text>
      </Pressable>
    </View>

    {/* Diagnoses */}
    <View>
      <Text className="text-black text-xl font-bold mb-4">
        Recent Diagnoses
      </Text>

      <View className="bg-gray-50 rounded-2xl border border-gray-200 p-2">
        {patient.diagnoses.map((record, index) => (
          <View
            key={record.id}
            className={`flex-row items-center p-3 ${
              index !== patient.diagnoses.length - 1
                ? "border-b border-gray-200"
                : ""
            }`}
          >
            <View className="w-12 h-12 bg-white rounded-full items-center justify-center border border-gray-200 mr-4">
              <Ionicons name={record.icon as any} size={22} color="#0d9488" />
            </View>

            <View className="flex-1">
              <Text className="text-black font-bold text-base mb-0.5">
                {record.condition}
              </Text>
              <Text className="text-gray-500 text-sm">{record.date}</Text>
            </View>

            <View
              className={`px-3 py-1 rounded-full ${
                record.status === "Ongoing"
                  ? "bg-orange-100 border border-orange-200"
                  : "bg-green-100 border border-green-200"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  record.status === "Ongoing"
                    ? "text-orange-600"
                    : "text-green-600"
                }`}
              >
                {record.status}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  </ScrollView>
</View>
  );
}
