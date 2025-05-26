// Get today's date as a string in YYYY-MM-DD format
export const getTodayString = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

// Today's date as a constant
export const TODAY: string = getTodayString();

// Check if a timestamp is from today by comparing date strings
export const isFromToday = (timestamp: number): boolean => {
  const date = new Date(timestamp);
  const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return dateString === TODAY;
};
