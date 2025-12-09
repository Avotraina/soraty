// src/app/notifications/scheduleAll.ts
// import { getAllReminders } from '../database/database';
import { ReminderRepo } from '../features/reminders/reminder.repo';
import { scheduleReminderNotification } from './notification';

export async function scheduleAllReminders() {
  try {

    // const {data: reminders} = useRemindersQuery();
    const reminders = await ReminderRepo.getAll();

    console.log('Scheduling all reminders:', reminders);

    // const reminders = await getAllReminders();
    const now = new Date();

    reminders?.forEach(reminder => {
      const reminderDate = new Date(`${reminder.reminder_date} ${reminder.reminder_time}`);
      if (reminderDate > now) {
        scheduleReminderNotification(
          reminder.id,
          'Reminder ⏰',
          reminder.note_id || 'You have a task!',
          reminderDate
        );
      }
    });
  } catch (e) {
    console.log('Error scheduling all reminders:', e);
  }
}
