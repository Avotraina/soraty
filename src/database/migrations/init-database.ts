import * as SQLite from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase) {
  const DATABASE_VERSION = 2;

  const result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion < DATABASE_VERSION) {
    if (currentVersion === 0) {
      await db.execAsync(`
        PRAGMA journal_mode = 'wal';


        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          email TEXT
        );

        -- COLORS TABLE
        CREATE TABLE IF NOT EXISTS colors (
          id TEXT PRIMARY KEY,
          color_name TEXT UNIQUE,
          is_synced INTEGER DEFAULT 0,
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now'))
        );

        -- CATEGORIES TABLE
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          category_name TEXT UNIQUE,
          is_synced INTEGER DEFAULT 0,
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now')),
          color TEXT,
          color_id TEXT,
          FOREIGN KEY (color_id) REFERENCES colors(id) ON DELETE SET NULL
        );

        -- NOTES TABLE
        CREATE TABLE IF NOT EXISTS notes (
          id TEXT PRIMARY KEY,
          note_title,
          note_content TEXT,
          is_synced INTEGER DEFAULT 0,
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now')),
          color TEXT,
          category_id TEXT,
          color_id TEXT,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
          FOREIGN KEY (color_id) REFERENCES colors(id) ON DELETE SET NULL
        );

      `);

      // Default users to insert
      // const defaultColors = [
      //   { id: 1, name: 'Alice', email: 'alice@example.com' },
      //   { id: 2, name: 'Bob', email: 'bob@example.com' },
      //   { id: 3, name: 'Charlie', email: 'charlie@example.com' },
      // ];

      // for (const user of defaultColors) {
      //   await db.runAsync(
      //     `INSERT OR IGNORE INTO colors (id, name, email) VALUES (?, ?, ?)`,
      //     user.id,
      //     user.name,
      //     user.email
      //   );
      // }
    }

    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  }
}