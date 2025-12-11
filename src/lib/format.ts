import { MonthOfBirth } from "@/constants";

export function formatRupiah(value?: number | string | null) {
  if (value === null || value === undefined || value === "") return "";

  const number = typeof value === "number" ? value : parseInt(value, 10);

  if (isNaN(number)) return "";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
}

export function parseRupiah(value: string) {
  if (!value) return 0;

  const raw = value.replace(/[^0-9]/g, "");

  return Number(raw || 0);
}

export function parseDecimalPrice(
  value: string | number | null | undefined
): number {
  if (value === null || value === undefined || value === "") return 0;

  if (typeof value === "number") {
    return Math.round(value);
  }

  const parsed = parseFloat(value);

  if (isNaN(parsed)) return 0;

  return Math.round(parsed);
}

export function formatDateString(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatMonthOfBirth(month: MonthOfBirth) {
  switch (month) {
    case MonthOfBirth.JAN:
      return "January";
    case MonthOfBirth.FEB:
      return "February";
    case MonthOfBirth.MAR:
      return "March";
    case MonthOfBirth.APR:
      return "April";
    case MonthOfBirth.MAY:
      return "May";
    case MonthOfBirth.JUN:
      return "June";
    case MonthOfBirth.JUL:
      return "July";
    case MonthOfBirth.AUG:
      return "August";
    case MonthOfBirth.SEP:
      return "September";
    case MonthOfBirth.OCT:
      return "October";
    case MonthOfBirth.NOV:
      return "November";
    case MonthOfBirth.DEC:
      return "December";
    default:
      return "";
  }
}
