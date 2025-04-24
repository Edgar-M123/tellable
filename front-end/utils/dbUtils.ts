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
                searchable_text TEXT
            );
            CREATE VIRTUAL TABLE stories_fts 
            USING FTS5(title, date, tags, emotions, searchable_text);
        `);
        
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
    
    await db.runAsync(
        `INSERT INTO stories (title, date, tags, emotions, origNotes, storyText, searchable_text)
        VALUES (?, ?, ?, ?, ?, ?, ?);
        `,
        [storyDB.title, storyDB.date, storyDB.tags, storyDB.emotions, storyDB.origNotes, storyDB.storyText, storyDB.searchable_text]
    )
    console.log("Inserted into stories table")
    await db.runAsync(
        `INSERT INTO stories_fts (title, date, tags, emotions, searchable_text)
        VALUES (?, ?, ?, ?, ?);
        `,
        [storyDB.title, storyDB.date, storyDB.tags, storyDB.emotions, storyDB.searchable_text]
    )
    console.log("Inserted into stories_fst table")
    
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