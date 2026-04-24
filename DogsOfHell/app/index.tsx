import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  VirtualizedList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const handleDoctor =() => {
    router.replace("/(doctor)/dashboard")
  }
  const handlePatient = () => {
    router.replace("/(patient)/dashboard");
  };
  return (
    <SafeAreaView className="flex-1 bg-[rgb(75_169_188)] w-full">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-white w-[90%] max-w-[380px] mx-6 px-6 py-8 rounded-xl shadow-md">
            <Text className="text-[rgb(65_133_149)] text-4xl font-bold text-center mb-8">
              Relay
            </Text>
            <View className="mb-6">
              <TextInput
                className="w-full bg-gray-50 border mb-6 border-gray-200 rounded-lg px-4 py-3.5 text-base text-gray-800"
                placeholder="Enter your phone number"
                placeholderTextColor="rgb(156, 163, 175)"
                keyboardType="phone-pad"
                autoCapitalize="none"
              />

              <View className="w-full bg-gray-50 border border-gray-200 rounded-lg flex-row items-center pr-3">
                <TextInput
                  className="flex-1 px-4 py-3.5 text-base text-gray-800"
                  placeholder="Password"
                  placeholderTextColor="rgb(156, 163, 175)"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="p-1"
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={22}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={handlePatient}
              className="w-full bg-[rgb(75_169_188)] py-4 rounded-lg shadow-sm"
            >
              <Text className="text-white text-center font-bold text-lg">
                Continue
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDoctor}
              className="w-full bg-[rgb(75_169_188)] py-4 mt-4 rounded-lg shadow-sm"
            >
              <Text className="text-white text-center font-bold text-lg">
                Continue as Doctor
              </Text>
            </TouchableOpacity>
            <View className="items-center mt-2">
              <Text className="text-center text-xs text-gray-500">
                By Continuing, you agree to our T&C.
              </Text>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


