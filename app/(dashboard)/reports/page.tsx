import type { Metadata } from "next"
import { ReportsPageContent } from "@/components/reports-page-content"

export const metadata: Metadata = {
  title: "Reports | Personal Finance Manager",
  description: "View financial reports by day, week, month, and year",
}

export default function ReportsPage() {
  return <ReportsPageContent />
}
