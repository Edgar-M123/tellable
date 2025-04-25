import { getTodayString } from "@/utils/dateUtils";
import React, {Dispatch, SetStateAction} from "react";


export const CreateStoryContext = React.createContext({});

export interface CreateStoryContextValues {
    storyText: string;
    setStoryText: Dispatch<SetStateAction<string>>
    storyDate: string;
    setStoryDate: Dispatch<SetStateAction<string>>;
}

export function CreateStoryContextProvider(props: {children: any}) {

    const [storyText, setStoryText] = React.useState("")
    const [storyDate, setStoryDate] = React.useState<string>(getTodayString())

    const values = {
        storyText,
        setStoryText,
        storyDate,
        setStoryDate
    }


    return (
        <CreateStoryContext.Provider value={values}>
            {props.children}
        </CreateStoryContext.Provider>
    )
}