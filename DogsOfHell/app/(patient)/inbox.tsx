import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

// IMPORT YOUR COMPONENT (adjust path if needed)
import DirectMessage from "../../components/dm";

type MessageStatus = "Active" | "Closed";

interface ChatPreview {
  id: string;
  patientName: string;
  avatar: string;
  lastMessage: string;
  time: string;
  status: MessageStatus;
  unreadCount: number;
}

export default function MessagesScreen() {
  const [activeFilter, setActiveFilter] = useState<"All" | MessageStatus>(
    "All",
  );

  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);

  const [messages] = useState<ChatPreview[]>([
    {
      id: "1",
      patientName: "Rahul Sharma",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=male",
      lastMessage:
        "Doctor, the cough is getting slightly worse at night. Should I increase the dosage?",
      time: "10:42 AM",
      status: "Active",
      unreadCount: 2,
    },
    {
      id: "2",
      patientName: "Priya Patel",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=female",
      lastMessage:
        "I have uploaded my latest blood test reports. Please take a look when you can.",
      time: "Yesterday",
      status: "Active",
      unreadCount: 1,
    },
    {
      id: "3",
      patientName: "Amit Kumar",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=male&key=2",
      lastMessage:
        "Thank you, the new prescription worked perfectly. I feel much better now.",
      time: "Mon",
      status: "Closed",
      unreadCount: 0,
    },
  ]);

  const filteredMessages = messages.filter((msg) => {
    if (activeFilter === "All") return true;
    return msg.status === activeFilter;
  });

  return (
    <View className="flex-1 bg-zinc-950">
      {/* Header section */}
      <View className="px-4 pt-12 pb-4 bg-zinc-900 border-b border-zinc-800">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-3xl font-bold">Responses</Text>
          <Pressable className="bg-zinc-800 p-2 rounded-full border border-zinc-700">
            <Ionicons name="create-outline" size={22} color="white" />
          </Pressable>
        </View>

        <View className="flex-row items-center bg-zinc-950 rounded-xl px-4 py-2.5 border border-zinc-800">
          <Ionicons name="search" size={20} color="#71717a" />
          <TextInput
            placeholder="Search patients or messages..."
            placeholderTextColor="#71717a"
            className="flex-1 text-white ml-2 text-base"
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="flex-row px-4 py-4 gap-3 border-b border-zinc-900">
        {(["All", "Active", "Closed"] as const).map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setActiveFilter(filter)}
            className={`px-5 py-2 rounded-full border ${
              activeFilter === filter
                ? "bg-teal-600 border-teal-500"
                : "bg-zinc-900 border-zinc-700"
            }`}
          >
            <Text
              className={`font-semibold ${activeFilter === filter ? "text-white" : "text-zinc-400"}`}
            >
              {filter}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Messages List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg, index) => (
            <Pressable
              key={msg.id}
              onPress={() => setSelectedChat(msg)}
              className={`flex-row items-center p-4 bg-zinc-900 ${
                index !== filteredMessages.length - 1
                  ? "border-b border-zinc-800"
                  : ""
              }`}
            >
              <View className="relative mr-4">
                <Image
                  source={{ uri: msg.avatar }}
                  className="w-14 h-14 rounded-full border border-zinc-700"
                />
                {msg.status === "Active" && (
                  <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-zinc-900 rounded-full" />
                )}
              </View>

              <View className="flex-1 justify-center">
                <View className="flex-row justify-between items-center mb-1">
                  <Text
                    className="text-white font-bold text-lg"
                    numberOfLines={1}
                  >
                    {msg.patientName}
                  </Text>
                  <Text
                    className={`text-xs font-medium ${msg.unreadCount > 0 ? "text-teal-400" : "text-zinc-500"}`}
                  >
                    {msg.time}
                  </Text>
                </View>
                <Text
                  className={`text-sm ${msg.unreadCount > 0 ? "text-zinc-200 font-medium" : "text-zinc-500"}`}
                  numberOfLines={2}
                >
                  {msg.lastMessage}
                </Text>
              </View>
            </Pressable>
          ))
        ) : (
          <View className="flex-1 items-center justify-center pt-20">
            <Text className="text-zinc-400 text-lg font-medium">
              No messages
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={selectedChat !== null}
        animationType="slide"
        onRequestClose={() => setSelectedChat(null)}
      >
        <DirectMessage
          user={selectedChat}
          onClose={() => setSelectedChat(null)}
        />
      </Modal>
    </View>
  );
}
