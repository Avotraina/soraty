import { getAll, getFirst, runQuery } from "@/src/database/database";
import { v7 as uuidv7 } from 'uuid';


export type T_Category = {
    id?: string;
    category_name: string;
    is_synced?: number;
    color: string;
};


export const PAGE_SIZE = 20;


export const CategoryRepo = {

    async getAll(): Promise<T_Category[]> {
        return getAll<T_Category>('SELECT * FROM categories ORDER BY id DESC');
    },

    async getById(id: number): Promise<T_Category | null> {
        return getFirst<T_Category>('SELECT * FROM categories WHERE id = ?', id);
    },

    async getByColor(color: string): Promise<T_Category | null> {
        return getFirst<T_Category>('SELECT * FROM categories WHERE color = ?', color);
    },

    // Fetch paginated categories with offset and limit
    async getPaginated(page: number = 0, limit: number = PAGE_SIZE): Promise<T_Category[]> {
        const offset = page * limit;
        return getAll<T_Category>(
            'SELECT * FROM categories ORDER BY id DESC LIMIT ? OFFSET ?',
            limit,
            offset
        );
    },


    // Create a new category
    async create(category_name: string, color: string): Promise<void> {
        const id = uuidv7();
        await runQuery('INSERT INTO categories (id, category_name, color) VALUES (?, ?, ?)', id, category_name, color);
    },

    async update(id: string, category_name: string, color: string): Promise<void> {
        await runQuery('UPDATE categories SET category_name = ?, email = ? WHERE id = ?', category_name, color, id);
    },

    // Delete a category
    async remove(id: number): Promise<void> {
        await runQuery('DELETE FROM categories WHERE id = ?', id);
    },

    // Count total categories
    async count(): Promise<number> {
        const rows = await getAll<{ count: number }>('SELECT COUNT(*) as count FROM categories');
        return rows[0]?.count ?? 0;
    },

}