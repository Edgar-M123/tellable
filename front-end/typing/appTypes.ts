

export function toDBFormat(obj: StoryRaw | Story | StoryPreview): StoryDB | StoryPreviewDB {

    if ((obj as Story).emotions && (obj as Story).id) {
        const story = obj as Story
        return {...story, emotions: JSON.stringify(story.emotions), tags: JSON.stringify(story.tags)} as StoryDB
    }

    if ((obj as StoryRaw).emotions) {
        const storyRaw = obj as Story
        return {...storyRaw, emotions: JSON.stringify(storyRaw.emotions), tags: JSON.stringify(storyRaw.tags)} as StoryDB
    }
    
    const storyPrev = obj as StoryPreview
    
    return {...storyPrev, tags: JSON.stringify(storyPrev.tags)}
}

export function fromDBFormat(obj: StoryDB | StoryPreviewDB): Story | StoryPreview {

    if ((obj as StoryDB).emotions) {
        const story = obj as StoryDB
        return {...story, emotions: JSON.parse(story.emotions), tags: JSON.parse(story.tags)} as Story
    } else {
        const storyPrev = obj as StoryPreviewDB
        return {...storyPrev, tags: JSON.parse(storyPrev.tags)} as StoryPreview
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
}

export interface TransformStoryResponseError {
    error: string;
    message: string;
    status: number;
}
