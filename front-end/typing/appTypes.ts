

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