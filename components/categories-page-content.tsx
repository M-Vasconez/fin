"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryManager } from "@/components/category-manager"
import { AddCategoryForm } from "@/components/add-category-form"
import { useLanguage } from "@/contexts/language-context"

export function CategoriesPageContent() {
  const { t } = useLanguage()

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t("categories")}</h2>
        <AddCategoryForm>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            {t("addCategory")}
          </Button>
        </AddCategoryForm>
      </div>
      <Tabs defaultValue="income" className="space-y-4">
        <TabsList>
          <TabsTrigger value="income">{t("incomeCategories")}</TabsTrigger>
          <TabsTrigger value="expense">{t("expenseCategories")}</TabsTrigger>
        </TabsList>
        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("incomeCategories")}</CardTitle>
              <CardDescription>{t("manageCategoriesIncome")}</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryManager type="income" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expense" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("expenseCategories")}</CardTitle>
              <CardDescription>{t("manageCategoriesExpense")}</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryManager type="expense" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
