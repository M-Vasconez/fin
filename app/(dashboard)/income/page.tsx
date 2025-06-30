import type { Metadata } from "next"
import { IncomePageContent } from "@/components/income-page-content"

export const metadata: Metadata = {
  title: "Income | Personal Finance Manager",
  description: "Manage your income sources and categories",
}

export default function IncomePage() {
  return <IncomePageContent />
}
