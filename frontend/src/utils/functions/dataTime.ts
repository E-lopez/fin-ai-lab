interface DateTimeOptions {
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short';
}

export function monthYearFormat(value: string) {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return value; // Return original value if invalid date
  }
  const options: DateTimeOptions = {
    year: 'numeric', 
    month: 'short',
  };
  const dateTimeFormat = new Intl.DateTimeFormat("es-ES", options);
  return dateTimeFormat.format(date);
}

export function SecondsToMinutesSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return { minutes, seconds };
}