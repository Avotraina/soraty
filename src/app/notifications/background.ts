// src/app/notifications/background.ts
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
// import { getAllReminders } from '../database/database'; // your DB functions
import { scheduleAllReminders } from './schedule-all';

const BACKGROUND_TASK = 'background-reminder-task';

// TaskManager.defineTask(BACKGROUND_TASK, async () => {
//     try {
//         const reminders = await getAllReminders();
//         const now = new Date();

//         reminders.forEach((reminder: any) => {
//             const reminderDate = new Date(reminder.date + ' ' + reminder.time);
//             if (reminderDate > now) {
//                 scheduleReminderNotification(
//                     reminder.id,
//                     'Reminder ⏰',
//                     reminder.note || 'You have a task!',
//                     reminderDate
//                 );
//             }
//         });

//         return BackgroundFetch.BackgroundFetchResult.NewData;
//     } catch (error) {
//         console.log('Background fetch failed', error);
//         return BackgroundFetch.BackgroundFetchResult.Failed;
//     }
// });

TaskManager.defineTask(BACKGROUND_TASK, async () => {
  try {
    await scheduleAllReminders();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.log('Background task failed', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

// Call this to register the task
export async function registerBackgroundReminderTask() {
  const status = await BackgroundTask.getStatusAsync();
  if (status === BackgroundTask.BackgroundTaskStatus.Available) {
    await BackgroundTask.registerTaskAsync(BACKGROUND_TASK, {
      minimumInterval: 15, // in minutes (or other as per your need)
    });
  } else {
    console.log('BackgroundTask not available:', status);
  }
}




function getAllReminders() {
    return [];
}

