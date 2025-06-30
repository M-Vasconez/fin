import type { DateFilter } from "@/components/date-filter"

export function getDateRange(filter: DateFilter): { start: Date; end: Date } {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (filter) {
    case "today":
      return {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
      }

    case "last7Days":
      return {
        start: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
      }

    case "last30Days":
      return {
        start: new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
      }

    case "last90Days":
      return {
        start: new Date(today.getTime() - 89 * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
      }

    case "thisMonth":
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
      }

    case "thisYear":
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
      }

    case "allTime":
    default:
      return {
        start: new Date(2020, 0, 1), // Start from 2020
        end: new Date(2030, 11, 31, 23, 59, 59, 999), // End at 2030
      }
  }
}

export function isDateInRange(date: string, start: Date, end: Date): boolean {
  const checkDate = new Date(date)
  return checkDate >= start && checkDate <= end
}

export function formatDateRange(filter: DateFilter): string {
  const { start, end } = getDateRange(filter)

  if (filter === "allTime") {
    return "All Time"
  }

  if (filter === "today") {
    return start.toLocaleDateString()
  }

  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
}
