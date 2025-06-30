"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EditIcon, TrashIcon, PlusIcon, LayoutTemplateIcon } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"
import { useExpenseTemplates } from "@/contexts/expense-templates-context"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { AddExpenseTemplateForm } from "@/components/add-expense-template-form"
import { getPaymentMethodById } from "@/lib/payment-methods"

interface ExpenseTemplatesModalProps {
  children: React.ReactNode
}

export function ExpenseTemplatesModal({ children }: ExpenseTemplatesModalProps) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()
  const { formatCurrency } = useSettings()
  const { templates, deleteTemplate } = useExpenseTemplates()

  const activeTemplates = templates.filter((template) => template.isActive)

  const TemplateCard = ({ template }: { template: any }) => {
    const paymentMethod = template.paymentMethod ? getPaymentMethodById(template.paymentMethod) : null

    return (
      <Card className="relative hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate">{template.name}</CardTitle>
              {template.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
              )}
            </div>
            <div className="flex gap-1 ml-2">
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
          <div className="space-y-3">
            {/* Template Details */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("category")}:</span>
                <Badge variant="outline">{t(template.category as any)}</Badge>
              </div>

              {template.amount && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t("amount")}:</span>
                  <Badge variant="secondary" className="font-mono">
                    {formatCurrency(template.amount)}
                  </Badge>
                </div>
              )}

              {paymentMethod && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t("paymentMethod")}:</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <span>{paymentMethod.icon}</span>
                    <span>{t(paymentMethod.name as any)}</span>
                  </Badge>
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t("template")}</span>
                <div className="flex items-center gap-1">
                  <LayoutTemplateIcon className="h-3 w-3" />
                  <span>{t("quickFill")}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutTemplateIcon className="h-5 w-5" />
            {t("expenseTemplates")}
          </DialogTitle>
          <DialogDescription>{t("manageExpenseTemplatesModal")}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {activeTemplates.length} {activeTemplates.length === 1 ? t("template") : t("templates")}
              </Badge>
            </div>
            <AddExpenseTemplateForm>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                {t("addTemplate")}
              </Button>
            </AddExpenseTemplateForm>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 overflow-y-auto">
            {activeTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <LayoutTemplateIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{t("noTemplatesFound")}</h3>
                  <p className="text-sm text-muted-foreground max-w-md">{t("createFirstTemplateModal")}</p>
                </div>
                <AddExpenseTemplateForm>
                  <Button>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    {t("createFirstTemplate")}
                  </Button>
                </AddExpenseTemplateForm>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            )}
          </div>

          {/* Footer Info */}
          {activeTemplates.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{t("templatesHelp")}</span>
                <span>{t("useTemplatesInAddExpense")}</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
