import React, { useState } from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";


interface PatientResultProps {
  imageUri: string;
  medicine: string;
  dose: string;
  frequency?: string;
  onBack: () => void; // Prop to let us go back to the upload screen
}

export default function PatientResultView({ imageUri, medicine, dose, frequency = "Twice daily", onBack }: PatientResultProps) {
  // null = Waiting | string = The actual response
  const [doctorResponse, setDoctorResponse] = useState<string | null>(null);

  const toggleDemoState = () => {
    if (doctorResponse) setDoctorResponse(null);
    else setDoctorResponse(" Take medicine twice daily - once in the morning and once in the evening after meals. Ensure you stay hydrated. Follow up in 3 days if fever persists.");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F9FF', width: '100%' }}>
      {/* HEADER */}
      <View className="flex-row items-center px-4 pt-4 pb-2">
        <Pressable onPress={onBack} className="p-2 bg-white rounded-full shadow-sm mr-4">
          <Ionicons name="arrow-back" size={24} color="#0F766E" />
        </Pressable>
        <Text className="text-slate-800 text-2xl font-bold">Case Details</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* STATUS BADGE */}
        <View className="items-center mb-6">
          <View className={`px-4 py-1.5 rounded-full flex-row items-center gap-2 ${doctorResponse ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <View className={`w-2 h-2 rounded-full ${doctorResponse ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <Text className={`font-bold text-xs ${doctorResponse ? 'text-green-700' : 'text-yellow-700'}`}>
              {doctorResponse ? "Doctor Responded" : "Waiting for doctor..."}
            </Text>
          </View>
        </View>

        {/* UPLOADED IMAGE */}
        <Text className="text-slate-800 font-bold text-sm mb-2">Uploaded Image</Text>
        <View className="w-full h-40 bg-slate-200 rounded-2xl overflow-hidden mb-6 shadow-sm border border-slate-200">
          <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
        </View>

        {/* EXTRACTED INFORMATION */}
        <View className="flex-row items-center gap-2 mb-2">
          <View className="w-1 h-4 bg-teal-500 rounded-full" />
          <Text className="text-slate-800 font-bold text-sm">Extracted Information</Text>
        </View>
        <View className="bg-[#E0F2FE] p-4 rounded-xl mb-6 border border-blue-100">
          <View className="flex-row mb-2">
            <Text className="w-24 text-[#0F766E] font-semibold">Medicine:</Text>
            <Text className="text-slate-800 font-bold">{medicine}</Text>
          </View>
          <View className="flex-row mb-2">
            <Text className="w-24 text-[#0F766E] font-semibold">Dose:</Text>
            <Text className="text-slate-800 font-bold">{dose}</Text>
          </View>
          <View className="flex-row">
            <Text className="w-24 text-[#0F766E] font-semibold">Frequency:</Text>
            <Text className="text-slate-800 font-bold">{frequency}</Text>
          </View>
        </View>

        {/* DOCTOR RESPONSE AREA */}
        <View className="flex-row items-center gap-2 mb-4">
          <View className="w-7 h-7 bg-[#0F766E] rounded-full items-center justify-center">
            <Ionicons name="medical" size={14} color="white" />
          </View>
          <Text className="text-slate-800 font-bold text-base">Doctor Response</Text>
        </View>

        {!doctorResponse ? (
          <View className="bg-[#FEF9C3] p-6 rounded-2xl border border-yellow-200 items-center justify-center mb-6 shadow-sm">
            <View className="w-12 h-12 bg-white rounded-full items-center justify-center mb-3 shadow-sm">
              <Text className="text-2xl">⏳</Text>
            </View>
            <Text className="text-[#CA8A04] font-bold text-base mb-1">Waiting for doctor response...</Text>
            <Text className="text-[#A16207] text-xs text-center">A doctor will review your case shortly</Text>
          </View>
        ) : (
          <View className="bg-white p-5 rounded-2xl border border-teal-100 mb-6 shadow-sm">
            <View className="flex-row gap-3 items-start">
              <Image source={{ uri: "https://xsgames.co/randomusers/avatar.php?g=female" }} className="w-10 h-10 rounded-full border border-slate-200" />
              <View className="flex-1">
                <Text className="text-slate-800 font-bold mb-1">Dr. Sharma</Text>
                <Text className="text-slate-600 text-sm leading-5">{doctorResponse}</Text>
              </View>
            </View>
          </View>
        )}

        {/* ACTIONS */}
        <View className="flex-row gap-3 mb-6">
          <Pressable className="flex-1 bg-[#0F766E] py-3.5 rounded-xl items-center flex-row justify-center gap-2 shadow-sm">
            <Ionicons name="refresh" size={18} color="white" />
            <Text className="text-white font-bold">Refresh</Text>
          </Pressable>
          <Pressable onPress={onBack} className="flex-1 bg-white border border-[#0F766E] py-3.5 rounded-xl items-center flex-row justify-center gap-2 shadow-sm">
            <Ionicons name="home-outline" size={18} color="#0F766E" />
            <Text className="text-[#0F766E] font-bold">Back to Home</Text>
          </Pressable>
        </View>

        {/* SECRET DEMO TOGGLE */}
        <Pressable onPress={toggleDemoState} className="py-4 items-center">
          <Text className="text-slate-400 text-xs font-medium">Toggle Demo State: {doctorResponse ? "Hide" : "Show"} Response</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}