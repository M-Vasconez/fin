import type { Metadata } from "next"
import { ExpensePageContent } from "@/components/expense-page-content"

export const metadata: Metadata = {
  title: "Expenses | Personal Finance Manager",
  description: "Manage your expenses and categories",
}

export default function ExpensesPage() {
  return <ExpensePageContent />
}
