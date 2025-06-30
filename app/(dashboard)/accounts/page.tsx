import type { Metadata } from "next"
import { AccountsPageContent } from "@/components/accounts-page-content"

export const metadata: Metadata = {
  title: "Accounts | Personal Finance Manager",
  description: "Manage your bank accounts, credit cards, and payment methods",
}

export default function AccountsPage() {
  return <AccountsPageContent />
}
