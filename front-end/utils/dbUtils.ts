import { TagColors } from "@/constants/Colors";
import { fromDBFormat, Story, StoryDB, StoryPreview, StoryPreviewDB, StoryRaw, toDBFormat } from "@/typing/appTypes";
import { SQLiteDatabase } from "expo-sqlite";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 1;
    
    console.log("Checking DB user_version")
    const output = await db.getFirstAsync<{user_version: number}>('PRAGMA user_version');
    
    if (output == null) {
        console.log("user_version output was null")
        throw Error("PRAGMA user_version failed.")
    }
    
    console.log("comparing against expected version")
    let currentDbVersion = output.user_version
    if (currentDbVersion >= DATABASE_VERSION) {
        console.log("DB is on expected version")
        return;
    }
    
    console.log("DB is not on expected version. Going through creation/migration")
    if (currentDbVersion === 0) {
        
        console.log("Creating database")
        await db.execAsync(`
            PRAGMA journal_mode = 'wal';
            CREATE TABLE IF NOT EXISTS stories (
                id INTEGER PRIMARY KEY NOT NULL,
                title TEXT,
                date TEXT,
                tags TEXT,
                emotions TEXT,
                origNotes TEXT,
                storyText TEXT,
                searchable_text TEXT,
                tips TEXT
            );

            CREATE VIRTUAL TABLE stories_fts 
            USING FTS5(id, title, date, tags, emotions, searchable_text);
            
            CREATE TABLE IF NOT EXISTS tags (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT
            );
        `);

        const statement = await db.prepareAsync('INSERT INTO tags (name) VALUES (?)')
        
        try {
            for (const tag in TagColors) {
                await statement.executeAsync(tag)
            }
        } finally {
            await statement.finalizeAsync()
        }
        
        console.log("DB created")
        currentDbVersion = 1;
    }

    // if (currentDbVersion === 1) {
    //   Add more migrations
    // }
    console.log("Setting DB user version")
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export async function saveStoryAsync(db: SQLiteDatabase, storyRaw: StoryRaw) {

    console.log("Saving story...")
    
    const storyDB = toDBFormat(storyRaw) as StoryDB
    console.log("Converted to DB format")
    
    const {lastInsertRowId} = await db.runAsync(
        `INSERT INTO stories (title, date, tags, emotions, origNotes, storyText, searchable_text, tips)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `,
        [storyDB.title, storyDB.date, storyDB.tags, storyDB.emotions, storyDB.origNotes, storyDB.storyText, storyDB.searchable_text, storyDB.tips]
    )
    console.log("Inserted into stories table")
    await db.runAsync(
        `INSERT INTO stories_fts (id, title, date, tags, emotions, searchable_text)
        VALUES (?, ?, ?, ?, ?, ?);
        `,
        [lastInsertRowId, storyDB.title, storyDB.date, storyDB.tags, storyDB.emotions, storyDB.searchable_text]
    )
    console.log("Inserted into stories_fst table")
    
    return lastInsertRowId
}

export async function deleteStoryAsync(db: SQLiteDatabase, id: number) {
    console.log("Deleting story with ID ", id)
    
    await db.runAsync(
        'DELETE FROM stories WHERE id = ?',
        id
    )
    console.log("Deleted from stories table")
    await db.runAsync(
        'DELETE FROM stories_fts WHERE id = ?',
        id
    )
    console.log("Deleted from stories_fst table")
    
}

export async function getStoryAsync(db: SQLiteDatabase, id: string) {
    
    const query = `
    SELECT
    id, title, date, tags, emotions, origNotes, storyText, searchable_text, tips
    FROM stories
    WHERE id = ?
    `
    
    const resultDB = await db.getFirstAsync<StoryDB | null>(query, id)

    if (resultDB) {
        const result = fromDBFormat(resultDB) as Story
        return result
    }

    throw Error("id doesn't exist in DB")

    
}

export async function getStoryPreviewsAsync(db:SQLiteDatabase, limit?: number) {
    
    console.log("Getting all previews from stories table")

    let resultDB: StoryPreviewDB[];
    if (limit) {
        resultDB = await db.getAllAsync<StoryPreviewDB>("SELECT id, title, date, tags FROM stories ORDER BY date DESC LIMIT ?", limit)
    } else {
        resultDB = await db.getAllAsync<StoryPreviewDB>("SELECT id, title, date, tags FROM stories ORDER BY date DESC")
    }
    
    console.log("Got all previews. Converting to right format")
    
    let result: StoryPreview[] = []
    for (const item of resultDB) {
        result.push(fromDBFormat(item))
    }
    console.log("All previews converted")
    
    return result
}

export async function getTagsAsync(db: SQLiteDatabase) {
    console.log("Getting all tags from tags table")
    const tags = await db.getAllAsync<{name: string}>("SELECT name FROM tags ORDER BY name ASC")
    let tagsList = []
    for (const obj of tags) {
        tagsList.push(obj.name)
    }

    return tagsList
    
}

export async function updateStoryTagsAsync(db: SQLiteDatabase, id: number | string, tags: string[]) {
    console.log("Updating tags for id: ", id)

    const tagsString = JSON.stringify(tags)

    await db.runAsync("UPDATE stories SET tags = ? WHERE id = ?", tagsString, id)
    await db.runAsync("UPDATE stories_fts SET tags = ? WHERE id = ?", tagsString, id)

}


// Function to search stories
export async function searchStories(db: SQLiteDatabase, query: string) {
      
    console.log("Searching for query: ", query)

    if (!query || query.trim() === '') {
        // Handle empty search query case
        console.log("Empty search query, returning all stories")
        return await getStoryPreviewsAsync(db);
        // return getAllStories(db);
    }

    // Format query for FTS5 - prefix matching with *
    console.log("formatting query")
    const formattedQuery = query.trim().split(' ').map(word => `${word}*`).join(' ');
    console.log("formatted query:", formattedQuery)

    const sqlString = `
    SELECT s.id, s.title, s.date, s.tags 
    FROM stories s 
    JOIN stories_fts f ON s.id = f.id 
    WHERE stories_fts MATCH ? 
    ORDER BY s.date DESC;`

    console.log("Search Sql: ", sqlString)
    
    const result = await db.getAllAsync<StoryPreviewDB>(sqlString, [formattedQuery]);
    
    console.log("Search returned: ", result);
    
    let stories: StoryPreview[] = []
    for (const storyDB of result) {
        stories.push((fromDBFormat(storyDB) as StoryPreview))
    }
    return stories;

}