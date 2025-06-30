import type { Metadata } from "next"
import { DashboardContent } from "@/components/dashboard-content"

export const metadata: Metadata = {
  title: "Dashboard | Personal Finance Manager",
  description: "Track your income and expenses with ease",
}

export default function DashboardPage() {
  return <DashboardContent />
}
