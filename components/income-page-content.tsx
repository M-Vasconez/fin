"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"
import { IncomeTable } from "@/components/income-table"
import { IncomeCategories } from "@/components/income-categories"
import { AddIncomeForm } from "@/components/add-income-form"
import { useLanguage } from "@/contexts/language-context"
import { SettingsProvider } from "@/contexts/settings-context"

export function IncomePageContent() {
  const { t } = useLanguage()

  return (
    <SettingsProvider>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{t("income")}</h2>
          <AddIncomeForm>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              {t("addIncome")}
            </Button>
          </AddIncomeForm>
        </div>
        <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-5">
            <CardHeader>
              <CardTitle>{t("incomeEntries")}</CardTitle>
              <CardDescription>{t("manageIncomeSources")}</CardDescription>
            </CardHeader>
            <CardContent>
              <IncomeTable />
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t("incomeCategories")}</CardTitle>
              <CardDescription>{t("organizeIncomeSources")}</CardDescription>
            </CardHeader>
            <CardContent>
              <IncomeCategories />
            </CardContent>
          </Card>
        </div>
      </div>
    </SettingsProvider>
  )
}
