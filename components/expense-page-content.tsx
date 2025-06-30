"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, LayoutTemplateIcon } from "lucide-react"
import { ExpenseTable } from "@/components/expense-table"
import { ExpenseCategories } from "@/components/expense-categories"
import { ExpenseTemplatesModal } from "@/components/expense-templates-modal"
import { MobileTemplatesModal } from "@/components/mobile-templates-modal"
import { AddExpenseForm } from "@/components/add-expense-form"
import { MobileExpenseForm } from "@/components/mobile-expense-form"
import { useLanguage } from "@/contexts/language-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { ExpenseTemplatesProvider } from "@/contexts/expense-templates-context"
import { useMobile } from "@/hooks/use-mobile"

export function ExpensePageContent() {
  const { t } = useLanguage()
  const isMobile = useMobile()

  return (
    <SettingsProvider>
      <ExpenseTemplatesProvider>
        <div className="flex-1 space-y-4 p-3 md:p-4 pt-6 md:pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("expenses")}</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              {isMobile ? (
                <MobileTemplatesModal>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <LayoutTemplateIcon className="mr-2 h-4 w-4" />
                    {t("templates")}
                  </Button>
                </MobileTemplatesModal>
              ) : (
                <ExpenseTemplatesModal>
                  <Button variant="outline">
                    <LayoutTemplateIcon className="mr-2 h-4 w-4" />
                    {t("templates")}
                  </Button>
                </ExpenseTemplatesModal>
              )}
              {isMobile ? (
                <MobileExpenseForm>
                  <Button className="w-full sm:w-auto">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    {t("addExpense")}
                  </Button>
                </MobileExpenseForm>
              ) : (
                <AddExpenseForm>
                  <Button>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    {t("addExpense")}
                  </Button>
                </AddExpenseForm>
              )}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-5">
              <CardHeader>
                <CardTitle>{t("expenseEntries")}</CardTitle>
                <CardDescription>{t("manageExpenses")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseTable />
              </CardContent>
            </Card>
            {!isMobile && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>{t("expenseCategories")}</CardTitle>
                  <CardDescription>{t("organizeSpending")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExpenseCategories />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </ExpenseTemplatesProvider>
    </SettingsProvider>
  )
}
