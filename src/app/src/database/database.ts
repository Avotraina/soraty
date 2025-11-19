import * as SQLite from 'expo-sqlite';
import { v7 as uuidv7 } from 'uuid';


let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const openDatabase = (): Promise<SQLite.SQLiteDatabase> => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('soraty.db');
  }
  return dbPromise;
};

export const withDB = async <T>(
  fn: (db: SQLite.SQLiteDatabase) => Promise<T>
): Promise<T> => {
  const db = await openDatabase();
  return fn(db);
};


export const generateId = (): string => uuidv7();

export const closeDatabase = async (): Promise<void> => {
  if (dbPromise) {
    const db = await dbPromise;
    await db.closeAsync();
    dbPromise = null;
  }
};



/** Run any SQL (insert/update/delete) */
export const runQuery = async (sql: string, ...params: any[]) => {
  const db = await openDatabase();
  return db.runAsync(sql, ...params);
};


/** Get all rows */
export const getAll = async <T = any>(sql: string, ...params: any[]): Promise<T[]> => {
  const db = await openDatabase();
  return db.getAllAsync<T>(sql, ...params);
};


/** Get first row */
export const getFirst = async <T = any>(sql: string, ...params: any[]): Promise<T | null> => {
  const db = await openDatabase();
  return db.getFirstAsync<T>(sql, ...params);
};