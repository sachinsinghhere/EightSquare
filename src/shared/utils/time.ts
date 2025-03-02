/**
 * Formats time in seconds to a display string (mm:ss)
 */
export const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Converts minutes to seconds
 */
export const minutesToSeconds = (minutes: number): number => minutes * 60;

/**
 * Validates if the time input is within acceptable range
 */
export const isValidTimeInput = (minutes: number): boolean => {
  return minutes > 0 && minutes <= 180; // Maximum 3 hours
}; 