

export interface Story {
    id: string;
    title: string;
    date: string;
    tags: string[];
    origNotes: string;
    storyText: string;
    searchable_text: string;
}



export interface StoryPreview {
    id: string;
    title: string;
    date: string;
    tags: string[];
}


export interface TransformStoryResponseSuccess {
    title: string;
    story: string;
    tags: string[];
    emotions: string[];
    searchable_text: string;
}

export interface TransformStoryResponseError {
    error: string;
    message: string;
    status: number;
}
