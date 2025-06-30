import type React from "react"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { UserNav } from "@/components/user-nav"
import { AccountsProvider } from "@/contexts/accounts-context"
import { ExpenseTemplatesProvider } from "@/contexts/expense-templates-context"
import { GoalsProvider } from "@/contexts/goals-context"
import { LanguageProvider } from "@/contexts/language-context"
import { SettingsProvider } from "@/contexts/settings-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <SettingsProvider>
        <AccountsProvider>
          <ExpenseTemplatesProvider>
            <GoalsProvider>
              <div className="min-h-screen bg-background">
                {/* Desktop Navigation */}
                <div className="hidden md:flex h-16 items-center px-4 border-b">
                  <MainNav className="mx-6" />
                  <div className="ml-auto flex items-center space-x-4">
                    <UserNav />
                  </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                  <MobileNav />
                </div>

                {/* Main Content */}
                <main className="flex-1">{children}</main>
              </div>
            </GoalsProvider>
          </ExpenseTemplatesProvider>
        </AccountsProvider>
      </SettingsProvider>
    </LanguageProvider>
  )
}
