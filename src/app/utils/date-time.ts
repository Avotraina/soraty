export function formatDate(dateArg: Date | string) {

    const date = new Date(dateArg);
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();

    return `${d}/${m}/${y}`;
}

export function buildReminderDate(reminder_date: string, reminder_time: string) {
  // Convert ISO string to local date
  const base = new Date(reminder_date);

  // Extract Y / M / D
  const year = base.getFullYear();
  const month = base.getMonth(); // 0-index
  const day = base.getDate();

  // Extract hh:mm
  const [hour, minute] = reminder_time.split(":").map(Number);

  // Build final date
  return new Date(year, month, day, hour, minute, 0);
}