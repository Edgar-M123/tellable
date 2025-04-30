import { Story, StoryRaw, TransformStoryResponseError, TransformStoryResponseSuccess } from "@/typing/appTypes";
import functions from '@react-native-firebase/functions'
import * as sqlite from 'expo-sqlite/kv-store'
import { saveStoryAsync } from "./dbUtils";
import { SQLiteDatabase } from "expo-sqlite";

export async function transformStoryRequest(storyText: string): Promise<TransformStoryResponseSuccess> {

    console.log("Running FB function")

    // try {
    //     const response = await fetch(
    //         "http://192.168.2.13:5001/tellable-a2659/us-central1/gemini_text_processor",
    //         {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({storyText})
    //         }
    //     )
    
    //     if (!response.ok) {
    //         const errorData: TransformStoryResponseError = await response.json()
    //         throw new Error(`Story transformation failed due to: ${errorData.message || response.statusText}`); 
    //     }
    
    //     const response_parsed: TransformStoryResponseSuccess = await response.json()
    //     return response_parsed
    // } catch (error) {
    //     console.error("Failed to process text", error);
    //     throw error
    // }

    // if (process.env.NODE_ENV != "production") {
    //     functions().useEmulator("192.168.2.13", 5001)
    // }

    // const fnRef = functions().httpsCallable("gemini_text_processor")
    const fnRef = functions().httpsCallableFromUrl("https://gemini-text-processor-bgp5jn2geq-uc.a.run.app")

    try {
        const response = await fnRef(storyText)
        console.log("Received FB Function response: ", response)
        const parsed = response.data as TransformStoryResponseSuccess
        return parsed
    } catch (error) {
        console.error(error)
        throw error
    }


}



export async function transformStoryFn(db: SQLiteDatabase, storyText: string, storyDate: string) {

    const storyData = await transformStoryRequest(storyText)

    // verify data like maybe they got additional tags that arent included in free tier
    const verifiedData = storyData

    // store data
    const finalStory: StoryRaw = {
        title: verifiedData.title,
        date: storyDate,
        tags: verifiedData.tags,
        emotions: verifiedData.emotions,
        origNotes: storyText,
        storyText: verifiedData.story,
        searchable_text: verifiedData.searchable_text,
        tips: verifiedData.tips
    }

    return finalStory
}

export async function createStory(db: SQLiteDatabase, text: string, date: string) {

    console.log("Creating story")
    const storyRaw = await transformStoryFn(db, text, date)
    const id = await saveStoryAsync(db, storyRaw)
    return id
}