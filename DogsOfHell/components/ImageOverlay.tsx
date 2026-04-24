import React, { useState } from "react";
import { View, Text, Image, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// 1. ADD 'severity' TO THE TYPE
export type ImagePiece = {
  id: number;
  uri: string;
  severity?: "high" | "low"; 
};

type ImageGridOverlayProps = {
  visible: boolean;
  onClose: () => void;
  pieces: ImagePiece[];
};

const ImageGridOverlay: React.FC<ImageGridOverlayProps> = ({ visible, onClose, pieces }) => {
  const [selectedSinglePiece, setSelectedSinglePiece] = useState<ImagePiece | null>(null);
  
  // Keep them sorted by ID so the 3x3 grid looks correct visually!
  const sortedPieces = [...pieces].sort((a, b) => a.id - b.id);

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-zinc-950 px-4 pt-12">
        <View className="flex-row items-center mb-8 gap-3">
          <Pressable onPress={onClose} className="bg-zinc-800 p-2 rounded-full">
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-3xl font-bold">Wound Analysis</Text>
        </View>

        {sortedPieces.length > 0 && (
          <View className="flex-1 items-center justify-center">
            <Text className="text-zinc-500 mb-6 text-base px-6 text-center">
              AI has prioritized the critical wound areas. Pieces are numbered 1-9 for exact reassembly.
            </Text>
            
            <View className="flex-row flex-wrap justify-center w-84">
              {sortedPieces.map((piece) => {
                // 2. CHECK IF THIS PIECE IS FLAGGED BY YOUR FASTAPI BACKEND
                const isCritical = piece.severity === "high";

                return (
                  <Pressable
                    key={piece.id}
                    onPress={() => setSelectedSinglePiece(piece)}
                    className={`w-28 h-28 border relative ${
                      isCritical ? "border-red-500 border-2 z-10 shadow-lg shadow-red-500/50" : "border-zinc-800"
                    }`}
                  >
                    <Image source={{ uri: piece.uri }} className="w-full h-full opacity-90" />
                    
                    {/* Add a warning icon to critical pieces */}
                    {isCritical && (
                      <View className="absolute top-1 right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                        <Ionicons name="warning" size={12} color="white" />
                      </View>
                    )}
                    
                    <View className={`absolute bottom-1 left-1 rounded px-1.5 py-0.5 ${isCritical ? 'bg-red-500' : 'bg-black/70'}`}>
                      <Text className="text-white text-xs font-bold">{piece.id}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
            
            {/* Legend for the judges */}
            <View className="w-full mt-10 flex-row items-center justify-center gap-2">
              <View className="w-3 h-3 bg-red-500 rounded-full" />
              <Text className="text-zinc-400 text-sm font-medium">High Priority Data Chunks (Loaded First)</Text>
            </View>
          </View>
        )}
      </View>

      {/* SINGLE PIECE MODAL */}
      <Modal visible={!!selectedSinglePiece} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/95 items-center justify-center p-4">
          {selectedSinglePiece && (
            <>
              <Text className="text-zinc-400 font-bold text-xl mb-4">
                Piece #{selectedSinglePiece.id} {selectedSinglePiece.severity === "high" && " (CRITICAL)"}
              </Text>
              <Image
                source={{ uri: selectedSinglePiece.uri }}
                className={`w-full h-96 rounded-xl border-2 ${selectedSinglePiece.severity === "high" ? "border-red-500" : "border-zinc-800"}`}
                resizeMode="contain"
              />
            </>
          )}
          <Pressable
            onPress={() => setSelectedSinglePiece(null)}
            className="mt-8 bg-zinc-800 px-8 py-3 rounded-xl border border-zinc-600"
          >
            <Text className="text-white font-semibold text-lg">Close View</Text>
          </Pressable>
        </View>
      </Modal>
    </Modal>
  );
};

export default ImageGridOverlay;