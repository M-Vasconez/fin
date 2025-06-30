"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react"
import { EditCategoryForm } from "@/components/edit-category-form"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { useLanguage } from "@/contexts/language-context"

interface CategoryManagerProps {
  type: "income" | "expense"
}

const incomeCategories = [
  { id: "1", name: "salary", count: 2 },
  { id: "2", name: "freelance", count: 2 },
  { id: "3", name: "investment", count: 1 },
  { id: "4", name: "rental", count: 0 },
  { id: "5", name: "other", count: 0 },
]

const expenseCategories = [
  { id: "1", name: "housing", count: 1 },
  { id: "2", name: "food", count: 1 },
  { id: "3", name: "utilities", count: 2 },
  { id: "4", name: "entertainment", count: 1 },
  { id: "5", name: "transportation", count: 0 },
  { id: "6", name: "healthcare", count: 0 },
  { id: "7", name: "other", count: 0 },
]

export function CategoryManager({ type }: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState("")
  const { t } = useLanguage()
  const categories = type === "income" ? incomeCategories : expenseCategories

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      // Add new category logic
      setNewCategory("")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input placeholder={t("categoryName")} value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
        <Button onClick={handleAddCategory}>
          <PlusIcon className="h-4 w-4 mr-2" />
          {t("addCategory")}
        </Button>
      </div>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between p-2 border rounded-md">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{t(category.name as any)}</Badge>
              <span className="text-xs text-muted-foreground">
                {category.count} {category.count === 1 ? t("entry") : t("entries")}
              </span>
            </div>
            <div className="flex gap-1">
              <EditCategoryForm category={{ ...category, name: t(category.name as any) }}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <EditIcon className="h-4 w-4" />
                  <span className="sr-only">{t("edit")}</span>
                </Button>
              </EditCategoryForm>
              <DeleteConfirmationDialog
                title={t("deleteCategory")}
                description={t("deleteCategoryConfirm")}
                onConfirm={() => {}}
              >
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <TrashIcon className="h-4 w-4" />
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
