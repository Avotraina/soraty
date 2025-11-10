import { getAll, getFirst, runQuery } from "@/app/src/database/database";
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
    // async getPaginated(page: number = 0, limit: number = PAGE_SIZE): Promise<T_Category[]> {
    async getPaginated(page: number = 0, limit: number = PAGE_SIZE, search: string): Promise<any> {
        const offset = page * limit;
        const like = `%${search}%`
        // const like = `%`
        // return getAll<T_Category>(
        return getAll<any>(
            // 'SELECT c.id, c.category_name, COUNT(n.id) AS note_count FROM categories c LEFT JOIN notes n ON n.category_id = c.id WHERE c.category_name LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?',
            // 'SELECT DISTINCT c.id, c.category_name, c.color, (SELECT COUNT(*) FROM notes WHERE notes.category_id = c.id) AS note_count FROM categories WHERE c.category_name LIKE ? c LEFT JOIN notes n ON n.category_id = c.id GROUP BY c.id ORDER BY id DESC LIMIT ? OFFSET ?',
            // 'SELECT id, category_name FROM categories WHERE category_name LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?',
            `
                SELECT
                    c.id,
                    c.category_name,
                    c.color,
                    COUNT(n.id) as note_count
                FROM categories c
                LEFT JOIN notes n ON n.category_id = c.id
                WHERE c.category_name LIKE ?
                GROUP BY c.id
                ORDER BY c.created_at DESC
                LIMIT ? OFFSET ?;

            `,
            like,
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