"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react"
import { EditCategoryForm } from "@/components/edit-category-form"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { useLanguage } from "@/contexts/language-context"

const categories = [
  { id: "1", name: "housing", count: 1 },
  { id: "2", name: "food", count: 1 },
  { id: "3", name: "utilities", count: 2 },
  { id: "4", name: "entertainment", count: 1 },
  { id: "5", name: "transportation", count: 0 },
  { id: "6", name: "healthcare", count: 0 },
  { id: "7", name: "other", count: 0 },
]

export function ExpenseCategories() {
  const { t } = useLanguage()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">{t("categories")}</h3>
        <Button variant="ghost" size="sm">
          <PlusIcon className="h-4 w-4 mr-1" />
          {t("addCategory")}
        </Button>
      </div>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{t(category.name as any)}</Badge>
              <span className="text-xs text-muted-foreground">
                {category.count} {category.count === 1 ? t("entry") : t("entries")}
              </span>
            </div>
            <div className="flex gap-1">
              <EditCategoryForm category={{ ...category, name: t(category.name as any) }}>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <EditIcon className="h-3.5 w-3.5" />
                  <span className="sr-only">{t("edit")}</span>
                </Button>
              </EditCategoryForm>
              <DeleteConfirmationDialog
                title={t("deleteCategory")}
                description={t("deleteCategoryConfirm")}
                onConfirm={() => {}}
              >
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <TrashIcon className="h-3.5 w-3.5" />
                  <span className="sr-only">{t("delete")}</span>
                </Button>
              </DeleteConfirmationDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
