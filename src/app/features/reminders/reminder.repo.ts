import { getAll } from "@/src/app/database/database";


export type T_Reminder = {
    id: string;
    note_id: string;
    reminder_date: string;
    reminder_time: string;
    is_synced?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
}

export const ReminderRepo = {

    async getAll(): Promise<T_Reminder[]> {
        return getAll<T_Reminder>('SELECT * FROM reminders ORDER BY id DESC');
    },

};
