import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// --- YOUR CUSTOM COMPONENTS ---
import ImageGridOverlay, { ImagePiece } from "@/components/ImageOverlay";
import PatientResultView from "@/components/patientResult"; // Adjust path if needed

export default function Dashboard() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [pieces, setPieces] = useState<ImagePiece[]>([]);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const [showProcessing, setShowProcessing] = useState<boolean>(false);
  const [processStep, setProcessStep] = useState<number>(0);
  
  // Controls whether we show the Dashboard or the Result View
  const [isProcessed, setIsProcessed] = useState<boolean>(false);

  const splitImage = async (uriToSplit: string) => {
    const size = 3;
    try {
      // 1. SPLIT THE IMAGE LOCALLY
      const img = await ImageManipulator.manipulateAsync(uriToSplit, [], {});
      const pieceWidth = img.width / size;
      const pieceHeight = img.height / size;

      let temp: ImagePiece[] = [];
      let counter = 1;

      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const crop = {
            originX: col * pieceWidth,
            originY: row * pieceHeight,
            width: pieceWidth,
            height: pieceHeight,
          };

          const cropped = await ImageManipulator.manipulateAsync(
            uriToSplit,
            [{ crop }],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG }
          );

          // Default severity to 'low' initially
          temp.push({ id: counter, uri: cropped.uri, severity: "low" });
          counter++;
        }
      }
      
      // Set pieces immediately so the UI doesn't hang
      setPieces(temp);

      // ==================================================
      // 2. FETCH SEVERITY SCORES FROM FASTAPI BACKEND
      // ==================================================
      try {
        const formData = new FormData();
        formData.append("file", {
          uri: uriToSplit,
          name: "wound.jpg",
          type: "image/jpeg",
        } as any);

        // NOTE: Use 10.0.2.2 for Android Emulators to hit Windows Localhost
        console.log("Pinging ML backend...");
        const response = await fetch("https://salted-noncoagulable-earnest.ngrok-free.dev/predict", {
    method: "POST",
    body: formData,
    headers: { "Content-Type": "multipart/form-data" },
});

        if (response.ok) {
          const mlData = await response.json();
          console.log("ML Scores:", mlData.scores);
          
          // 3. MAP THE ML SCORES TO OUR PIECES
          const prioritizedPieces = temp.map((piece, index) => {
            // Assuming any score above 0.5 is flagged as high-priority
            const isHighPriority = mlData.scores[index] > 0.5;
            return {
              ...piece,
              severity: isHighPriority ? "high" : "low" as "high" | "low"
            };
          });

          // Update the grid with the glowing red highlights
          setPieces(prioritizedPieces);
        }
      } catch (mlError) {
        console.log("FastAPI backend not reachable, defaulting to low severity.", mlError);
      }

    } catch (error) {
      console.log("Failed to split image.", error);
    }
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setPieces([]);
      setIsProcessed(false); // Ensure we are in dashboard mode
    }
  };

  const handleSend = () => {
    if (!selectedImage) return;

    setShowProcessing(true);
    setProcessStep(0);

    // Simulated processing delay for UI
    setTimeout(() => {
      setProcessStep(1);

      setTimeout(() => {
        setProcessStep(2);

        // Run actual image slicing and ML call
        splitImage(selectedImage).then(() => {
          setTimeout(() => {
            setProcessStep(3);

            setTimeout(() => {
              // Hide modal and show the Result Component
              setShowProcessing(false);
              setIsProcessed(true);
            }, 600);
          }, 1500);
        });
      }, 1500);
    }, 1500);
  };

  const steps = [
    { num: 1, title: "Upload Image", desc: "Take or select a photo from your library." },
    { num: 2, title: "Auto-Processing", desc: "Our system instantly cuts your photo." },
    { num: 3, title: "Grid Results", desc: "View your beautiful 3x3 interactive collage." },
  ];

  const featureCards = [
    { icon: "flash", label: "Fast Processing" },
    { icon: "wifi", label: "Works in Low Internet" },
    { icon: "albums", label: "Clean Layout" },
  ];

  // ==================================================
  // EARLY RETURN: SHOW RESULT SCREEN IF DONE
  // ==================================================
  if (isProcessed && selectedImage) {
    return (
      <PatientResultView
        imageUri={selectedImage}
        medicine="Wound Scan Analysis"
        dose="Priority Order Sorted"
        onBack={() => {
          setIsProcessed(false);
          setSelectedImage(null);
          setPieces([]);
        }}
      />
    );
  }

  // ==================================================
  // NORMAL DASHBOARD VIEW
  // ==================================================
  return (
    <View className="flex-1 bg-[#fefefe] px-4 pt-10">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER --- */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-bold text-teal-400">Relay</Text>
          <View className="flex-row gap-2 items-center">
            <Pressable className="bg-zinc-800 p-2 rounded-full">
              <Ionicons name="notifications-outline" size={22} color="white" />
            </Pressable>
            <Pressable onPress={() => setShowDropdown(true)}>
              <Image
                source={{ uri: "https://xsgames.co/randomusers/avatar.php?g=male" }}
                className="w-10 h-10 rounded-full border border-zinc-700"
              />
            </Pressable>
          </View>
        </View>

        {/* --- DROPDOWN MODAL --- */}
        <Modal visible={showDropdown} transparent animationType="fade">
          <Pressable className="flex-1" onPress={() => setShowDropdown(false)}>
            <View className="absolute top-20 right-4 w-48 bg-zinc-900 rounded-2xl p-2 border border-zinc-700 shadow-xl">
              <Pressable
                className="flex-row items-center gap-3 p-3 rounded-xl active:bg-zinc-800"
                onPress={() => {
                  setShowDropdown(false);
                  router.push("/(patient)/profile");
                }}
              >
                <View className="w-8 h-8 rounded-full bg-teal-500/20 items-center justify-center">
                  <Ionicons name="person-outline" size={16} color="#2dd4bf" />
                </View>
                <Text className="text-white font-medium text-base">Profile</Text>
              </Pressable>

              <Pressable className="flex-row items-center gap-3 p-3 rounded-xl active:bg-zinc-800 mt-1">
                <View className="w-8 h-8 rounded-full bg-zinc-700/50 items-center justify-center">
                  <Ionicons name="settings-outline" size={16} color="#a1a1aa" />
                </View>
                <Text className="text-white font-medium text-base">Settings</Text>
              </Pressable>

              <View className="h-[1px] bg-zinc-800 my-2 mx-2" />

              <Pressable
                className="flex-row items-center gap-3 p-3 rounded-xl active:bg-zinc-800"
                onPress={() => {
                  setShowDropdown(false);
                  router.replace("/");
                }}
              >
                <View className="w-8 h-8 rounded-full bg-red-500/20 items-center justify-center">
                  <Ionicons name="log-out-outline" size={16} color="#ef4444" />
                </View>
                <Text className="text-red-500 font-medium text-base">Logout</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>

        {/* --- GREETING & HERO --- */}
        <View className="mb-8">
          <Text className="text-black text-3xl font-bold">Hi, Rahul 👋</Text>
        </View>

        <View className="items-center mb-10 w-full h-56 bg-zinc-900/50 rounded-2xl border border-zinc-800 justify-center overflow-hidden">
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop" }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* --- STEPS --- */}
        <View className="mb-10 gap-6">
          {steps.map((step) => (
            <View key={step.num} className="flex-row items-start gap-4">
              <View className="w-10 h-10 bg-teal-100 rounded-full items-center justify-center ">
                <Text className="text-teal-400 text-xl font-bold">{step.num}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-zinc-500 text-lg font-semibold">{step.title}</Text>
                <Text className="text-zinc-500 text-base">{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* --- SELECT IMAGE BUTTON --- */}
        <View className="w-full mb-10">
          <Pressable
            onPress={pickImageAsync}
            className="py-4 rounded-2xl flex-row justify-center items-center gap-2 bg-teal-500 "
          >
            <Ionicons name="camera-outline" size={24} color="white" />
            <Text className="text-white font-bold text-lg">Select an Image</Text>
          </Pressable>
        </View>

        {/* --- FEATURE CARDS --- */}
        <View className="flex-row justify-center gap-3 mb-10">
          {featureCards.map((card, i) => (
            <View
              key={i}
              className="flex-1 items-center bg-zinc-100 p-4 rounded-xl shadow  justify-center h-28 gap-2"
            >
              <Ionicons name={card.icon as any} size={28} color="#2dd4bf" />
              <Text className="text-black font-bold text-center text-sm ">{card.label}</Text>
            </View>
          ))}
        </View>

        {/* --- READY TO SEND PREVIEW --- */}
        <View>
          <Text className="text-white text-xl font-bold mb-4">Ready to Send</Text>
          {selectedImage ? (
            <View className="w-full bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
              <View className="flex-row items-center gap-4 mb-4">
                <Image
                  source={{ uri: selectedImage }}
                  className="w-20 h-20 rounded-lg"
                  resizeMode="cover"
                />
                <View className="flex-1 justify-center">
                  <Text className="text-white font-bold text-lg mb-1">Image Selected</Text>
                  <Text className="text-teal-400 font-medium text-sm">Ready for processing</Text>
                </View>
              </View>

              <Pressable
                onPress={handleSend}
                className="w-full py-3.5 rounded-xl bg-teal-600 flex-row justify-center items-center gap-2 shadow-lg"
              >
                <Ionicons name="paper-plane" size={20} color="white" />
                <Text className="text-white font-bold text-lg">Send Request</Text>
              </Pressable>
            </View>
          ) : (
            <View className="w-full h-20 bg-zinc-300 rounded-xl  items-center justify-center">
              <Text className="text-zinc-500 font-medium text-base">No uploads yet</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* --- PROCESSING ANIMATION MODAL --- */}
      <Modal visible={showProcessing} animationType="slide" transparent={false}>
        <View className="flex-1 bg-[#E0F2FE] items-center pt-20 px-6">
          <Text className="text-[#0F766E] text-3xl font-black mb-10">Processing</Text>

          <View className="bg-white w-full rounded-[32px] p-6 shadow-xl items-center relative mt-4">
            <View className="w-full h-48 bg-slate-400 rounded-2xl overflow-hidden mb-8">
              <Image source={{ uri: selectedImage! }} className="w-full h-full opacity-60" blurRadius={2} />
              <View className="absolute inset-0 bg-black/20" />
            </View>

            <View className="absolute top-48 w-16 h-16 bg-[#0F766E] rounded-full border-4 border-white items-center justify-center shadow-md">
              {processStep < 3 ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="checkmark" size={28} color="white" />
              )}
            </View>

            <View className="w-full mt-6 gap-4 pl-2">
              <View className="flex-row items-center gap-3">
                {processStep > 0 ? (
                  <Ionicons name="checkmark-circle" size={24} color="#0F766E" />
                ) : processStep === 0 ? (
                  <ActivityIndicator size="small" color="#0F766E" />
                ) : (
                  <Ionicons name="ellipse-outline" size={24} color="#CBD5E1" />
                )}
                <Text className={`font-semibold text-lg ${processStep >= 0 ? "text-[#0F766E]" : "text-slate-400"}`}>
                  Extracting text
                </Text>
              </View>

              <View className="flex-row items-center gap-3">
                {processStep > 1 ? (
                  <Ionicons name="checkmark-circle" size={24} color="#0F766E" />
                ) : processStep === 1 ? (
                  <ActivityIndicator size="small" color="#0F766E" />
                ) : (
                  <Ionicons name="ellipse-outline" size={24} color="#CBD5E1" />
                )}
                <Text className={`font-semibold text-lg ${processStep >= 1 ? "text-[#0F766E]" : "text-slate-400"}`}>
                  Detecting important area
                </Text>
              </View>

              <View className="flex-row items-center gap-3">
                {processStep > 2 ? (
                  <Ionicons name="checkmark-circle" size={24} color="#0F766E" />
                ) : processStep === 2 ? (
                  <ActivityIndicator size="small" color="#0F766E" />
                ) : (
                  <Ionicons name="ellipse-outline" size={24} color="#CBD5E1" />
                )}
                <Text className={`font-semibold text-lg ${processStep >= 2 ? "text-[#0F766E]" : "text-slate-400"}`}>
                  Uploading important data
                </Text>
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

      {/* --- GRID OVERLAY --- */}
      <ImageGridOverlay
        visible={showOverlay}
        onClose={() => setShowOverlay(false)}
        pieces={pieces}
      />
    </View>
  );
}
