import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

// Updated Message interface to support images
interface Message {
  id: string;
  text: string;
  sender: "doctor" | "patient";
  time: string;
  type?: "text" | "image";
  uri?: string;
}

const mockChatDatabase: Record<string, Message[]> = {
  "1": [
    { id: "1", type: "text", text: "Hello Doctor, I've been experiencing a mild fever since yesterday.", sender: "patient", time: "10:00 AM" },
    { id: "2", type: "text", text: "Hi Rahul. Are you experiencing any other symptoms like a cough or body ache?", sender: "doctor", time: "10:05 AM" },
  ],
};

interface DirectMessageProps {
  user: { id: string; patientName: string; avatar: string } | null;
  onClose: () => void;
  currentUserRole: "doctor" | "patient";
}

export default function DirectMessage({ user, onClose, currentUserRole }: DirectMessageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  // --- MODAL & ANIMATION STATES ---
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [tempImageUri, setTempImageUri] = useState<string | null>(null);

  useEffect(() => {
  requestAnimationFrame(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  });
}, [messages.length]);

  useEffect(() => {
    if (user) setMessages(mockChatDatabase[user.id] || []);
  }, [user]);

  // --- STANDARD TEXT SEND ---
  const handleSend = () => {
    if (!inputText.trim() || !user) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "text",
      text: inputText,
      sender: currentUserRole,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

  // --- ADD IMAGE MESSAGE TO CHAT ---
  const sendImageMessage = (uri: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "image",
      text: "Image uploaded",
      uri: uri,
      sender: currentUserRole,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // --- IMAGE PICKER LOGIC ---
  const pickImage = async (source: "camera" | "gallery") => {
    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8 });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    }

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setShowUploadModal(false);

      // CONDITIONAL LOGIC: Patient vs Doctor
      if (currentUserRole === "patient") {
        setTempImageUri(uri);
        setShowProcessing(true);
        setProcessStep(0);

        // Run the 3-step animation sequence
        setTimeout(() => {
          setProcessStep(1);
          setTimeout(() => {
            setProcessStep(2);
            setTimeout(() => {
              setProcessStep(3);
              setTimeout(() => {
                setShowProcessing(false);
                sendImageMessage(uri); // Send after animation
              }, 600);
            }, 1500);
          }, 1500);
        }, 1500);
      } else {
        // Doctor: Instantly send without animation
        sendImageMessage(uri);
      }
    }
  };

  if (!user) return null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#0F1B42' }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* --- HEADER --- */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-4 bg-[#1A294F] border-b border-zinc-800">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={onClose} className="p-1 active:bg-zinc-800 rounded-full">
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Image source={{ uri: user.avatar }} className="w-10 h-10 rounded-full border border-zinc-700" />
          <View>
            <Text className="text-white font-bold text-lg">{user.patientName}</Text>
            <Text className="text-teal-400 text-xs font-medium">Active now</Text>
          </View>
        </View>
      </View>

      {/* --- CHAT MESSAGES --- */}
<ScrollView
  ref={scrollViewRef}
  className="flex-1 px-4 py-4"
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
  keyboardDismissMode="interactive"
  removeClippedSubviews={false}
>        {messages.map((msg) => {
          const isMe = msg.sender === currentUserRole;
          return (
            <View key={msg.id} className={`mb-4 max-w-[80%] ${isMe ? "self-end" : "self-start"}`}>
              
              {msg.type === "image" ? (
                // IMAGE BUBBLE
                <View className={`p-1.5 rounded-2xl ${isMe ? "bg-teal-600 rounded-tr-sm" : "bg-zinc-800 rounded-tl-sm border border-zinc-700"}`}>
                  <Image source={{ uri: msg.uri }} className="w-48 h-48 rounded-xl bg-zinc-900" resizeMode="cover" />
                </View>
              ) : (
                // TEXT BUBBLE
                <View className={`p-3 rounded-2xl ${isMe ? "bg-teal-600 rounded-tr-sm" : "bg-zinc-800 rounded-tl-sm border border-zinc-700"}`}>
                  <Text className="text-white text-base leading-6">{msg.text}</Text>
                </View>
              )}

              <Text className={`text-zinc-500 text-xs mt-1 ${isMe ? "text-right mr-1" : "text-left ml-1"}`}>{msg.time}</Text>
            </View>
          );
        })}
      </ScrollView>

      {/* --- INPUT AREA --- */}
      {/* --- INPUT AREA --- */}
      <View className="px-4 py-3 bg-zinc-900 border-t border-zinc-800 flex-row items-center gap-3">
        
        {/* OPEN UPLOAD MODAL BUTTON */}
        <Pressable 
          onPress={() => setShowUploadModal(true)} 
          className="bg-zinc-800 rounded-full border border-zinc-700 items-center justify-center h-11 w-11 ml-1"
        >
          <Ionicons name="add" size={24} color="#2dd4bf" />
        </Pressable>
        
        {/* TEXT INPUT (Bug-free version) */}
        <View className="flex-1 flex-row items-center bg-zinc-950 border border-zinc-800 rounded-2xl px-4 h-12">
          <TextInput
            className="flex-1 text-white text-base"
            placeholder="Type a message..."
            placeholderTextColor="#71717a"
            value={inputText}
            onChangeText={setInputText}
            // Removed multiline and dynamic heights to ensure zero layout crashes
          />
        </View>

        {/* DYNAMIC SEND / MIC BUTTON */}
        {inputText.trim().length > 0 ? (
          // IF TEXT EXISTS: Show Teal Send Button
          <Pressable 
            onPress={handleSend} 
            className="h-11 w-11 bg-teal-600 rounded-full items-center justify-center shadow-sm shadow-teal-900"
          >
            <Ionicons name="send" size={18} color="white" className="ml-1" />
          </Pressable>
        ) : (
          // IF NO TEXT: Show Dark Mic Button
          <Pressable 
            className="h-11 w-11 bg-zinc-800 rounded-full border border-zinc-700 items-center justify-center"
          >
            <Ionicons name="mic-outline" size={20} color="white" />
          </Pressable>
        )}
      </View>

      {/* --- 1. SELECTION MODAL --- */}
      <Modal visible={showUploadModal} transparent animationType="fade">
        <Pressable className="flex-1 bg-black/60 justify-end" onPress={() => setShowUploadModal(false)}>
          <View className="bg-white rounded-t-3xl p-6 pb-10">
            <Text className="text-center text-[#0F766E] text-xl font-bold mb-6">Upload Medical Document</Text>
            
            <View className="border border-dashed border-teal-300 rounded-2xl p-8 items-center mb-6 bg-teal-50/50">
              <View className="w-16 h-16 bg-[#0F766E] rounded-full items-center justify-center mb-4">
                <Ionicons name="camera" size={32} color="white" />
              </View>
              <Text className="text-center text-teal-800 font-medium">Tap below to capture or upload your medical document</Text>
            </View>

            <View className="gap-3">
              <Pressable onPress={() => pickImage("camera")} className="w-full py-4 rounded-xl border-2 border-[#0F766E] flex-row justify-center items-center gap-2">
                <Ionicons name="camera-outline" size={20} color="#0F766E" />
                <Text className="text-[#0F766E] font-bold text-lg">Capture Image</Text>
              </Pressable>

              <Pressable onPress={() => pickImage("gallery")} className="w-full py-4 rounded-xl border-2 border-[#0F766E] flex-row justify-center items-center gap-2">
                <Ionicons name="image-outline" size={20} color="#0F766E" />
                <Text className="text-[#0F766E] font-bold text-lg">Upload from Gallery</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* --- 2. PROCESSING ANIMATION MODAL (PATIENT ONLY) --- */}
      <Modal visible={showProcessing} animationType="fade" transparent={false}>
        <View className="flex-1 bg-[#E0F2FE] items-center pt-20 px-6">
          <Text className="text-[#0F766E] text-3xl font-black mb-10">Processing</Text>
          <View className="bg-white w-full rounded-[32px] p-6 shadow-xl items-center relative mt-4">
            
            <View className="w-full h-48 bg-slate-400 rounded-2xl overflow-hidden mb-8">
               {tempImageUri && <Image source={{ uri: tempImageUri }} className="w-full h-full opacity-60" blurRadius={2} />}
               <View className="absolute inset-0 bg-black/20" />
            </View>

            <View className="absolute top-48 w-16 h-16 bg-[#0F766E] rounded-full border-4 border-white items-center justify-center shadow-md">
               {processStep < 3 ? <ActivityIndicator size="small" color="white" /> : <Ionicons name="checkmark" size={28} color="white" />}
            </View>

            <View className="w-full mt-6 gap-4 pl-2">
              <View className="flex-row items-center gap-3">
                {processStep > 0 ? <Ionicons name="checkmark-circle" size={24} color="#0F766E" /> : processStep === 0 ? <ActivityIndicator size="small" color="#0F766E" /> : <Ionicons name="ellipse-outline" size={24} color="#CBD5E1" />}
                <Text className={`font-semibold text-lg ${processStep >= 0 ? "text-[#0F766E]" : "text-slate-400"}`}>Extracting text</Text>
              </View>
              <View className="flex-row items-center gap-3">
                {processStep > 1 ? <Ionicons name="checkmark-circle" size={24} color="#0F766E" /> : processStep === 1 ? <ActivityIndicator size="small" color="#0F766E" /> : <Ionicons name="ellipse-outline" size={24} color="#CBD5E1" />}
                <Text className={`font-semibold text-lg ${processStep >= 1 ? "text-[#0F766E]" : "text-slate-400"}`}>Detecting important area</Text>
              </View>
              <View className="flex-row items-center gap-3">
                {processStep > 2 ? <Ionicons name="checkmark-circle" size={24} color="#0F766E" /> : processStep === 2 ? <ActivityIndicator size="small" color="#0F766E" /> : <Ionicons name="ellipse-outline" size={24} color="#CBD5E1" />}
                <Text className={`font-semibold text-lg ${processStep >= 2 ? "text-[#0F766E]" : "text-slate-400"}`}>Uploading important data</Text>
              </View>
            </View>

            <View className="w-full h-2 bg-slate-200 rounded-full mt-8 overflow-hidden">
               <View className="h-full bg-[#0F766E] rounded-full" style={{ width: `${(processStep / 3) * 100}%` }} />
            </View>

            <Text className="text-[#0F766E] font-bold mt-6 mb-2 text-base">
              {processStep < 3 ? "Processing your image, please wait..." : "Done!"}
            </Text>
            <View className="flex-row items-center gap-1">
              <Ionicons name="wifi" size={14} color="#94A3B8" />
              <Text className="text-slate-400 text-xs font-semibold">Works even in low internet</Text>
            </View>

          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}