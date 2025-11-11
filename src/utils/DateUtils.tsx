export const formatOrderDate = (
  dateStr: string,
  includePrefix: boolean = true,
  showDay: boolean = true
) => {
  const date = new Date(dateStr);

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  if (showDay) {
    options.weekday = 'short';
  }

  const formatted = date.toLocaleString('en-IN', options);
  return includePrefix ? `Placed on ${formatted}` : formatted;
};
