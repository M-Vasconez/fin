import type React from "react"
import { Inter } from "next/font/google"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { UserNav } from "@/components/user-nav"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { AccountsProvider } from "@/contexts/accounts-context"
import { ExpenseTemplatesProvider } from "@/contexts/expense-templates-context"
import { GoalsProvider } from "@/contexts/goals-context"

const inter = Inter({ subsets: ["latin"] })

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <SettingsProvider>
          <AccountsProvider>
            <ExpenseTemplatesProvider>
              <GoalsProvider>
                <div className="flex min-h-screen flex-col">
                  <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-14 items-center">
                      <MainNav />
                      <MobileNav />
                      <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <div className="w-full flex-1 md:w-auto md:flex-none">{/* Search can be added here */}</div>
                        <UserNav />
                      </div>
                    </div>
                  </header>
                  <main className="flex-1">{children}</main>
                </div>
              </GoalsProvider>
            </ExpenseTemplatesProvider>
          </AccountsProvider>
        </SettingsProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
