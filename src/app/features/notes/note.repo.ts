import { getAll, getFirst, runQuery } from "@/src/app/database/database";
import { v7 as uuidv7 } from 'uuid';
import { cancelNotification, scheduleReminderNotification } from "../../notifications/notification";
import { buildReminderDate } from "../../utils/date-time";


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
    created_at?: Date | string;
    reminder_date?: string | null;
    reminder_time?: string | null;
    category_name?: string;
    category_color?: string;
};



export const NoteRepo = {
    async getAll(): Promise<T_Note[]> {
        return getAll<T_Note>('SELECT * FROM categories ORDER BY id DESC');
    },

    // Fetch paginated notes with offset and limit
    // async getPaginated(page: number = 0, limit: number = PAGE_SIZE): Promise<T_Note[]> {
    async getPaginated(page: number = 0, limit: number = PAGE_SIZE, filters?: {
        search: string;
        color?: string | null | undefined;
        category?: string | null | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }): Promise<any> {
        const offset = page * limit;
        const like = `%${filters?.search}%`
        console.log("SEARCH", filters?.search)

        // Build dynamic conditions
        const conditions: string[] = [];
        const params: any[] = [];

        // Search filter (title OR content OR category name)
        if (filters?.search) {
            conditions.push(`(n.note_title LIKE ? OR n.note_content LIKE ? OR c.category_name LIKE ?)`);
            params.push(like, like, like);
        }

        // Color filter
        if (filters?.color) {
            conditions.push(`n.color = ?`);
            params.push(filters.color);
        }

        // Category filter
        if (filters?.category) {
            conditions.push(`c.id = ?`);
            params.push(filters.category);
        }

        // Date range filter
        if (filters?.startDate) {
            conditions.push(`n.created_at >= ?`);
            // params.push(filters.startDate);
            params.push((new Date(filters.startDate)).toISOString());
        }
        if (filters?.endDate) {
            conditions.push(`n.created_at <= ?`);
            // params.push(filters.endDate);
            params.push((new Date(filters.endDate)).toISOString());

        }

        // Combine conditions with AND
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const query = `
            SELECT
            n.id,
            n.note_title,
            n.note_content,
            n.color,
            n.created_at,
            c.id as category_id,
            c.category_name,
            c.color as category_color
            , r.reminder_date,
            r.reminder_time,
            r.notification_id,
            r.id as reminder_id
            FROM notes n
            LEFT JOIN categories c ON n.category_id = c.id
            LEFT JOIN reminders r ON r.note_id = n.id
            ${whereClause}
            GROUP BY n.id
            ORDER BY n.created_at DESC
            LIMIT ? OFFSET ?;
        `;

        params.push(limit, offset);

        // const like = `%`
        return getAll<any>(query, params);
    },

    async getById(id: string): Promise<T_Note | any> {
        return getFirst<T_Note>(
            `
                SELECT 
                    n.id,
                    n.note_title,
                    n.note_content,
                    n.color,
                    n.created_at,
                    n.category_id,
                    c.category_name,
                    c.color as category_color,
                    r.reminder_date,
                    r.reminder_time,
                    r.notification_id,
                    r.id
                FROM notes n
                LEFT JOIN categories c ON n.category_id = c.id
                LEFT JOIN reminders r ON r.note_id = n.id
                WHERE n.id = ?
            `,
            id
        );
    },

    async getByColor(color: string): Promise<T_Note | null> {
        return getFirst<T_Note>('SELECT * FROM notes WHERE color = ?', color);
    },


    // Create a new note
    async create({ note_title, note_content, color, category_id, created_at, reminder_date, reminder_time }: { note_title: string, note_content: string, color: string, category_id: string | null, created_at: Date | string, reminder_date?: string | null, reminder_time?: string | null }): Promise<void> {
        const id = uuidv7();
        await runQuery('INSERT INTO notes (id, note_title, note_content, color, category_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', id, note_title, note_content, color, category_id, created_at, created_at);
        if (reminder_date && reminder_time) {
            const reminderDateISO = new Date(reminder_date).toISOString();
            const notification_id = await scheduleReminderNotification(
                id.toString(),
                'Reminder ⏰',
                note_title || 'You have a task!',
                new Date(buildReminderDate(reminder_date, reminder_time)),
                reminder_time
            );
            await runQuery('INSERT INTO reminders (id, note_id, reminder_date, reminder_time, notification_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', id, id, reminderDateISO ?? null, reminder_time ?? null, notification_id ?? null, created_at, created_at);

            // console.log("Date for reminder:", buildReminderDate(reminder_date, reminder_time));


        }
    },


    async update(note: T_Note, reminder?: { reminder_date: string, reminder_time: string, notification_id?: string }): Promise<void> {

        const noteKeys = Object.keys(note) as (keyof T_Note)[];
        const fieldsToUpdate = noteKeys.filter(key => key !== 'id' && note[key] !== undefined);

        const setClause = fieldsToUpdate.map(key => `${key} = ?`).join(', ');
        const params = fieldsToUpdate.map(key => note[key]);
        params.push(note.id); // for WHERE clause

        const updateQuery = `UPDATE notes SET ${setClause}, updated_at = ? WHERE id = ?`;
        params.splice(params.length - 1, 0, new Date().toISOString()); // insert updated_at before id

        await runQuery(updateQuery, ...params);

        if (reminder) {

            const reminderDateISO = new Date(reminder.reminder_date).toISOString();

            const notification_id = await scheduleReminderNotification(
                note.id as string,
                'Reminder ⏰',
                note.note_title || 'You have a task!',
                new Date(buildReminderDate(reminder.reminder_date, reminder.reminder_time)),
                reminder.reminder_time,
                reminder.notification_id ?? undefined
            );

            await runQuery(
                `
                    INSERT INTO reminders (id, note_id, reminder_date, reminder_time, notification_id, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                        reminder_date = excluded.reminder_date,
                        reminder_time = excluded.reminder_time,
                        notification_id = excluded.notification_id,
                        updated_at = excluded.updated_at
                `,
                note.id as string,
                note.id as string,
                reminderDateISO,
                reminder.reminder_time,
                notification_id,
                new Date().toISOString(),
                new Date().toISOString()

            )

        }

    },


    async remove(id: string, reminder?: {id: string, notification_id: string}): Promise<void> {
        await runQuery('DELETE FROM notes WHERE id = ?', id);
        if (reminder) {
            await runQuery('DELETE FROM reminders WHERE id = ?', reminder.id);
            if (reminder.notification_id) {
                // Cancel the scheduled notification
                await cancelNotification(reminder.notification_id);
            }
        }
    }


}