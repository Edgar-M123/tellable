

export function toDBFormat(obj: StoryRaw | Story | StoryPreview): StoryDB | StoryPreviewDB {

    if ((obj as Story).emotions && (obj as Story).id) {
        const story = obj as Story

        const storyDB = {
            ...story, 
            emotions: JSON.stringify(story.emotions), 
            tags: JSON.stringify(story.tags),
            tips: JSON.stringify(story.tips)
        } as StoryDB

        return storyDB
    }

    if ((obj as StoryRaw).emotions) {
        const storyRaw = obj as Story
        
        const storyDB = {
            ...storyRaw, 
            emotions: JSON.stringify(storyRaw.emotions), 
            tags: JSON.stringify(storyRaw.tags),
            tips: JSON.stringify(storyRaw.tips)
        } as StoryDB

        return storyDB
    }
    
    const storyPrev = obj as StoryPreview
    
    return {...storyPrev, tags: JSON.stringify(storyPrev.tags)}
}

export function fromDBFormat(obj: StoryDB | StoryPreviewDB): Story | StoryPreview {

    if ((obj as StoryDB).emotions) {
        const storyDB = obj as StoryDB
        
        const story = {
            ...storyDB, 
            emotions: JSON.parse(storyDB.emotions), 
            tags: JSON.parse(storyDB.tags),
            tips: JSON.parse(storyDB.tips)
        } as Story
        
        return story

    } else {

        const storyPrevDB = obj as StoryPreviewDB

        const storyPrev = {
            ...storyPrevDB, 
            tags: JSON.parse(storyPrevDB.tags)
        } as StoryPreview

        return storyPrev
    }
}

export interface StoryRaw {
    title: string;
    date: string;
    tags: string[];
    origNotes: string;
    storyText: string;
    emotions: string[];
    searchable_text: string;
    tips: string[];
}


export interface Story extends StoryRaw {
    id: number;
}

export interface StoryDB {
    id: number;
    title: string;
    date: string;
    tags: string;
    origNotes: string;
    storyText: string;
    emotions: string;
    searchable_text: string;
    tips: string;
}



export interface StoryPreviewDB {
    id: number;
    title: string;
    date: string;
    tags: string;
}

export interface StoryPreview {
    id: number;
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
    tips: string[];
}

export interface TransformStoryResponseError {
    error: string;
    message: string;
    status: number;
}
