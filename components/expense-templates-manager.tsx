"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EditIcon, TrashIcon, PlusIcon } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"
import { useExpenseTemplates } from "@/contexts/expense-templates-context"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { AddExpenseTemplateForm } from "@/components/add-expense-template-form"
import { getPaymentMethodById } from "@/lib/payment-methods"

export function ExpenseTemplatesManager() {
  const { t } = useLanguage()
  const { formatCurrency } = useSettings()
  const { templates, deleteTemplate } = useExpenseTemplates()

  const activeTemplates = templates.filter((template) => template.isActive)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t("expenseTemplates")}</h3>
        <AddExpenseTemplateForm>
          <Button variant="outline" size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            {t("addTemplate")}
          </Button>
        </AddExpenseTemplateForm>
      </div>

      {activeTemplates.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>{t("noTemplatesFound")}</p>
          <p className="text-sm mt-2">{t("createFirstTemplate")}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {activeTemplates.map((template) => {
            const paymentMethod = template.paymentMethod ? getPaymentMethodById(template.paymentMethod) : null

            return (
              <Card key={template.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      {template.description && (
                        <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <EditIcon className="h-4 w-4" />
                        <span className="sr-only">{t("edit")}</span>
                      </Button>
                      <DeleteConfirmationDialog
                        title={t("deleteTemplate")}
                        description={t("deleteTemplateConfirm")}
                        onConfirm={() => deleteTemplate(template.id)}
                      >
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <TrashIcon className="h-4 w-4" />
                          <span className="sr-only">{t("delete")}</span>
                        </Button>
                      </DeleteConfirmationDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{t(template.category as any)}</Badge>
                    {template.amount && <Badge variant="secondary">{formatCurrency(template.amount)}</Badge>}
                    {paymentMethod && (
                      <Badge variant="outline">
                        <span className="mr-1">{paymentMethod.icon}</span>
                        {t(paymentMethod.name as any)}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
