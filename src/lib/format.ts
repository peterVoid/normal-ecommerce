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

export function formatDateString(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
