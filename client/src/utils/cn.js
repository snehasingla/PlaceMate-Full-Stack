import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Clean utility to merge Tailwind classes safely without conflicts
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
