import { v7 as uuidv7 } from 'uuid';
import { getAll, getFirst, runQuery } from "../../database/database";


export const PAGE_SIZE = 20;

export type T_Note = {
    id?: string;
    note_title: string;
    note_content: string;
    is_synced?: number;
    color: string;
    category?: {
        id?: string;
        category_name?: string;
        color?: string;
    };
    category_id: string | null;
};



export const NoteRepo = {
    async getAll(): Promise<T_Note[]> {
        return getAll<T_Note>('SELECT * FROM categories ORDER BY id DESC');
    },

    async getById(id: number): Promise<T_Note | null> {
        return getFirst<T_Note>('SELECT * FROM categories WHERE id = ?', id);
    },

    async getByColor(color: string): Promise<T_Note | null> {
        return getFirst<T_Note>('SELECT * FROM categories WHERE color = ?', color);
    },


    // Create a new category
    async create({note_title, note_content, color, category_id}: {note_title: string, note_content: string, color: string, category_id: string | null}): Promise<void> {
        const id = uuidv7();
        await runQuery('INSERT INTO notes (id, note_title, note_content, color, category_id) VALUES (?, ?, ?, ?, ?)', id, note_title, note_content, color, category_id);
    },

}