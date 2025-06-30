"use client"

import type React from "react"

import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { UserNav } from "@/components/user-nav"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { AccountsProvider } from "@/contexts/accounts-context"
import { ExpenseTemplatesProvider } from "@/contexts/expense-templates-context"
import { GoalsProvider } from "@/contexts/goals-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LanguageProvider>
        <SettingsProvider>
          <AccountsProvider>
            <ExpenseTemplatesProvider>
              <GoalsProvider>
                <div className="min-h-screen bg-background">
                  <div className="border-b">
                    <div className="flex h-16 items-center px-4">
                      <MainNav className="mx-6" />
                      <div className="ml-auto flex items-center space-x-4">
                        <UserNav />
                      </div>
                    </div>
                  </div>
                  <main className="flex-1 space-y-4 p-8 pt-6">{children}</main>
                  <MobileNav />
                </div>
              </GoalsProvider>
            </ExpenseTemplatesProvider>
          </AccountsProvider>
        </SettingsProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
