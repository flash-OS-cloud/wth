

import TextRecognition from "@react-native-ml-kit/text-recognition";


export const runOCR = async(imageUri: string) => {
    try {
        const result = await TextRecognition.recognize(imageUri) 
        return result.text
    }
    catch (error) {
        console.log("OCR Error",error)
        return null

    }
}