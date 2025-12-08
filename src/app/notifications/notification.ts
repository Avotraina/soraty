// src/app/notifications/index.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Request permission for notifications
export async function registerForNotifications() {
  if (Platform.OS !== 'web') {
    const { status } = await Notifications.requestPermissionsAsync();
    // Alert.alert(status)
    if (status !== 'granted') {
      alert('Notification permission not granted!');
    }
  }

  // ANDROID: you MUST create a channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
    });
  }
}

// Schedule a notification for a specific date/time
export async function scheduleReminderNotification(
  id: string,
  title: string,
  body: string,
  date: Date,
  time: string,
  existingNotificationId?: string,
): Promise<string | undefined> {
  try {
    // Cancel previous notification for this reminder

    if (existingNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(existingNotificationId);
    }
    const [hour, minute] = time.split(":").map(Number);


    // Combine date + time into one Date
    const scheduledDate = new Date(date);
    scheduledDate.setHours(hour);
    scheduledDate.setMinutes(minute);
    scheduledDate.setSeconds(0);
    scheduledDate.setMilliseconds(0);

    // Schedule a new one
    const notification_id = await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true, data: { reminderId: id } },
      trigger: scheduledDate as unknown as Notifications.NotificationTriggerInput,
      // trigger: {
      //   type: 'date',
      //   value: scheduledDate,
      // } as unknown as Notifications.NotificationTriggerInput,
    });

    console.log('Scheduled notification:', { notification_id, title, body, scheduledDate });

    return notification_id;
  } catch (e) {
    console.log('Error scheduling notification:', e);
  }
}


// Cancel a notification by id
export async function cancelNotification(id: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (e) {
    console.log('Error cancelling notification:', e);
  }
}
