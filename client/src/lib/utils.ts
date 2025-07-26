import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { quotesOfTheDay } from "./quotes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const getQuoteOfTheDay = () => {
  const today = new Date();
  const dayIndex = today.getDate() + today.getMonth() * 31; // a rough unique index per day
  const quote = quotesOfTheDay[dayIndex % quotesOfTheDay.length];
  return quote;
};