import { type ClassValue, clsx } from "clsx";
import { DateTime } from "luxon";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAge(birth: string): number {
  const birthDate = DateTime.fromFormat(birth, "yyyy-MM-dd");

  const now = DateTime.now();

  const diff = now.diff(birthDate, "years").years;

  return Math.floor(diff);
}
