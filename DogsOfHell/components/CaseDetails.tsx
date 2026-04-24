import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";

export interface CaseData {
    id: string
    name: string
    time: string
    image?: string
    type?: string
    status?: string
    urgent?: boolean

}

interface CaseDetailsProps {
    caseData: CaseData | null
    onClose: () => void
}

export default function CaseDetails({ caseData, onClose} : CaseDetailsProps) {
    const [responseText, setResponseText] = useState("")
    const gridOpacities = useRef(Array.from({length : 9}).map(() => new Animated.Value(1))).current

    useEffect(() => {
        Animated.stagger(
            150,
            gridOpacities.map((anim) => 
            Animated.timing(anim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true
            })
        )
        ).start()
    }, [])


    if(!caseData) return null

    return(
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#F4F8FF' }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      
      {/* --- HEADER --- */}
      <View className="flex-row items-center px-4 pt-12 pb-4 bg-[#F4F8FF]">
        <Pressable onPress={onClose} className="p-2 bg-white rounded-full shadow-sm mr-4">
          <Ionicons name="arrow-back" size={24} color="#5A9CF8" />
        </Pressable>
        <Text className="text-slate-800 text-2xl font-bold">Case Details</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* --- UPLOADED IMAGE WITH GRID ANIMATION --- */}
        <View className="bg-white p-4 rounded-2xl shadow-sm border border-blue-50 mb-4">
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-1 h-4 bg-teal-500 rounded-full" />
            <Text className="text-slate-800 font-bold text-sm">Uploaded Image</Text>
          </View>
          
          <View className="w-full h-48 rounded-xl overflow-hidden relative bg-slate-100">
            {/* The actual image */}
            <Image source={{ uri: caseData.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop" }} className="w-full h-full" resizeMode="cover" />
            
            {/* The Animated Overlay Grid */}
            <View className="absolute inset-0 flex-row flex-wrap">
              {gridOpacities.map((anim, i) => (
                <Animated.View 
                  key={i} 
                  style={{ 
                    opacity: anim, 
                    width: '33.33%', 
                    height: '33.33%', 
                    backgroundColor: '#e2e8f0',
                    borderColor: 'white',
                    borderWidth: 1
                  }} 
                />
              ))}
            </View>
          </View>
        </View>

        {/* --- PATIENT DETAILS --- */}
        <View className="bg-white p-4 rounded-2xl shadow-sm border border-blue-50 mb-4">
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-6 h-6 bg-teal-100 rounded-full items-center justify-center">
              <Ionicons name="person" size={14} color="#0f766e" />
            </View>
            <Text className="text-slate-800 font-bold text-sm">Patient Details</Text>
          </View>
          
          <View className="bg-[#F8FAFC] p-3 rounded-xl mb-2 flex-row items-center">
            <Ionicons name="person-outline" size={16} color="#64748b" className="mr-3" />
            <View className="ml-2">
              <Text className="text-slate-400 text-xs font-semibold">Patient Name</Text>
              <Text className="text-slate-800 font-bold">{caseData.name}</Text>
            </View>
          </View>
          <View className="bg-[#F8FAFC] p-3 rounded-xl mb-2 flex-row items-center">
            <Text className="text-[#64748b] font-bold mr-3 w-4 text-center">#</Text>
            <View className="ml-2">
              <Text className="text-slate-400 text-xs font-semibold">Case ID</Text>
              <Text className="text-slate-800 font-bold">#{caseData.id}</Text>
            </View>
          </View>
          <View className="bg-[#F8FAFC] p-3 rounded-xl flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#64748b" className="mr-3" />
            <View className="ml-2">
              <Text className="text-slate-400 text-xs font-semibold">Submitted</Text>
              <Text className="text-slate-800 font-bold">{caseData.time}</Text>
            </View>
          </View>
        </View>

        {/* --- EXTRACTED INFORMATION --- */}
        <View className="bg-white p-4 rounded-2xl shadow-sm border border-blue-50 mb-4">
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-1 h-4 bg-teal-500 rounded-full" />
            <Text className="text-slate-800 font-bold text-sm">Extracted Information</Text>
          </View>
          <View className="bg-[#F8FAFC] p-4 rounded-xl">
            <View className="flex-row mb-2">
              <Text className="w-24 text-teal-600 font-semibold">Medicine:</Text>
              <Text className="text-slate-800 font-bold">Paracetamol</Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="w-24 text-teal-600 font-semibold">Dose:</Text>
              <Text className="text-slate-800 font-bold">500mg</Text>
            </View>
            <View className="flex-row">
              <Text className="w-24 text-teal-600 font-semibold">Frequency:</Text>
              <Text className="text-slate-800 font-bold">Twice daily</Text>
            </View>
          </View>
        </View>

        {/* --- AI SUGGESTION --- */}
        <View className="bg-white p-4 rounded-2xl shadow-sm border border-blue-50 mb-4">
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-6 h-6 bg-purple-100 rounded-full items-center justify-center">
              <Ionicons name="color-wand" size={14} color="#7e22ce" />
            </View>
            <Text className="text-slate-800 font-bold text-sm">AI Suggestion</Text>
          </View>
          <View className="bg-purple-100/50 p-4 rounded-xl border border-purple-100">
            <Text className="text-purple-800 text-sm leading-5">
               Paracetamol 500mg is commonly used for pain relief and fever reduction. Recommended dosage is typically twice daily with food. Monitor for any adverse reactions and ensure adequate hydration.
            </Text>
          </View>
        </View>

        {/* --- WRITE YOUR RESPONSE --- */}
        <View className="bg-white p-4 rounded-2xl shadow-sm border border-blue-50 mb-4">
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-1 h-4 bg-[#5A9CF8] rounded-full" />
            <Text className="text-slate-800 font-bold text-sm">Write Your Response</Text>
          </View>
          <Text className="text-slate-500 text-xs mb-2">Treatment Advice</Text>
          <TextInput
            className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 h-28 text-left"
            placeholder="Enter treatment advice, dosage instructions, precautions..."
            placeholderTextColor="#94a3b8"
            multiline
            textAlignVertical="top"
            value={responseText}
            onChangeText={setResponseText}
          />
          <Text className="text-slate-400 text-xs mt-2 mb-4 text-right">{responseText.length} characters</Text>
          
          <Pressable 
            className={`py-3.5 rounded-xl flex-row items-center justify-center gap-2 ${responseText.trim() ? 'bg-[#5A9CF8]' : 'bg-slate-200'}`}
            disabled={!responseText.trim()}
          >
            <Ionicons name="send" size={16} color={responseText.trim() ? "white" : "#94a3b8"} />
            <Text className={`font-bold ${responseText.trim() ? 'text-white' : 'text-slate-400'}`}>Send Response</Text>
          </Pressable>
        </View>

        {/* --- TIP BANNER --- */}
        <View className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl flex-row gap-2 items-start">
          <Ionicons name="bulb" size={16} color="#eab308" />
          <Text className="flex-1 text-yellow-800 text-xs leading-4">
            <Text className="font-bold">Tip: </Text>
            Include dosage instructions, duration of treatment, precautions, and when to follow up. Be clear and concise for patient safety.
          </Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>

    )
}