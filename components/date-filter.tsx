"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useMobile } from "@/hooks/use-mobile"

export type DateFilter =
  | "allTime"
  | "thisYear"
  | "thisMonth"
  | "today"
  | "last7Days"
  | "last30Days"
  | "last90Days"
  | "customRange"

interface DateFilterProps {
  value: DateFilter
  onChange: (filter: DateFilter) => void
}

export function DateFilter({ value, onChange }: DateFilterProps) {
  const { t } = useLanguage()
  const isMobile = useMobile()

  const filterOptions: { value: DateFilter; label: string }[] = [
    { value: "allTime", label: t("allTime") },
    { value: "thisYear", label: t("thisYear") },
    { value: "thisMonth", label: t("thisMonth") },
    { value: "today", label: t("today") },
    { value: "last7Days", label: t("last7Days") },
    { value: "last30Days", label: t("last30Days") },
    { value: "last90Days", label: t("last90Days") },
    { value: "customRange", label: t("customRange") },
  ]

  const currentFilter = filterOptions.find((option) => option.value === value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`${isMobile ? "w-full" : "w-[200px]"} justify-between`}>
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className={isMobile ? "truncate" : ""}>{currentFilter?.label || t("filterBy")}</span>
          </div>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={isMobile ? "w-[calc(100vw-2rem)]" : "w-[200px]"}>
        {filterOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={value === option.value ? "bg-muted" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
