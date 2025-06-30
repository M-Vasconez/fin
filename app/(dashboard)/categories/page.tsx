import type { Metadata } from "next"
import { CategoriesPageContent } from "@/components/categories-page-content"

export const metadata: Metadata = {
  title: "Categories | Personal Finance Manager",
  description: "Manage your income and expense categories",
}

export default function CategoriesPage() {
  return <CategoriesPageContent />
}
