import { useQuery } from "@tanstack/react-query";
import { ReminderRepo } from "./reminder.repo";

export const useRemindersQuery = () =>
    useQuery({
        queryKey: ['reminders'],
        queryFn: ReminderRepo.getAll
    })