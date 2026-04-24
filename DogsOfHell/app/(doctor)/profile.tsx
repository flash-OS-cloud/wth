import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DoctorProfile() {
  return (
    <View className="flex-1 bg-[#F4F8FF]">
      <View className="px-4 pt-12 pb-6 bg-[#9CC4FB] items-center rounded-b-3xl shadow-sm">
        <View className="w-24 h-24 bg-teal-600 rounded-full items-center justify-center border-4 border-white mb-4 shadow-sm">
          <Ionicons name="person" size={48} color="white" />
        </View>
        <Text className="text-slate-900 text-2xl font-bold">Dr. Sharma</Text>
        <Text className="text-slate-700 text-base font-medium mt-1">General Physician</Text>
        <View className="flex-row items-center gap-1 mt-2 bg-white/30 px-3 py-1 rounded-full">
          <Ionicons name="location" size={14} color="#0f172a" />
          <Text className="text-slate-800 text-xs font-semibold">City Hospital, India</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View className="flex-row justify-between bg-white rounded-2xl p-4 shadow-sm border border-blue-50 mb-6">
          <View className="items-center flex-1 border-r border-slate-100">
            <Text className="text-slate-500 text-xs uppercase font-bold mb-1">Cases Solved</Text>
            <Text className="text-[#5A9CF8] text-2xl font-black">342</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-slate-500 text-xs uppercase font-bold mb-1">Rating</Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-[#5A9CF8] text-2xl font-black">4.9</Text>
              <Ionicons name="star" size={18} color="#fbbf24" />
            </View>
          </View>
        </View>

        {/* Options */}
        <View className="bg-white rounded-2xl shadow-sm border border-blue-50 overflow-hidden">
          <Pressable className="flex-row items-center p-4 border-b border-slate-100 active:bg-slate-50">
            <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
              <Ionicons name="settings-outline" size={20} color="#5A9CF8" />
            </View>
            <Text className="flex-1 text-slate-800 font-bold text-base">Account Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </Pressable>

          <Pressable className="flex-row items-center p-4 active:bg-slate-50">
            <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
              <Ionicons name="help-buoy-outline" size={20} color="#5A9CF8" />
            </View>
            <Text className="flex-1 text-slate-800 font-bold text-base">Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}