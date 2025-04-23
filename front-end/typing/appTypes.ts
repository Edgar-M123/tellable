

export interface Story {
    id: string;
    title: string;
    date: Date;
    tags: string[];
    origNotes: string;
    storyText: string;
}



export interface StoryPreview {
    id: string;
    title: string;
    date: Date;
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