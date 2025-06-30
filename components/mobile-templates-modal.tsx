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

interface MobileTemplatesModalProps {
  children: React.ReactNode
}

export function MobileTemplatesModal({ children }: MobileTemplatesModalProps) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()
  const { formatCurrency } = useSettings()
  const { templates, deleteTemplate } = useExpenseTemplates()

  const activeTemplates = templates.filter((template) => template.isActive)

  const TemplateCard = ({ template }: { template: any }) => {
    const paymentMethod = template.paymentMethod ? getPaymentMethodById(template.paymentMethod) : null

    return (
      <Card className="relative">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm truncate">{template.name}</CardTitle>
              {template.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
              )}
            </div>
            <div className="flex gap-1 ml-2">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <EditIcon className="h-3 w-3" />
                <span className="sr-only">{t("edit")}</span>
              </Button>
              <DeleteConfirmationDialog
                title={t("deleteTemplate")}
                description={t("deleteTemplateConfirm")}
                onConfirm={() => deleteTemplate(template.id)}
              >
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <TrashIcon className="h-3 w-3" />
                  <span className="sr-only">{t("delete")}</span>
                </Button>
              </DeleteConfirmationDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-3">
          <div className="space-y-2">
            {/* Template Details */}
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">
                {t(template.category as any)}
              </Badge>
              {template.amount && (
                <Badge variant="secondary" className="text-xs font-mono">
                  {formatCurrency(template.amount)}
                </Badge>
              )}
              {paymentMethod && (
                <Badge variant="outline" className="text-xs">
                  <span className="mr-1">{paymentMethod.icon}</span>
                  {t(paymentMethod.name as any)}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <LayoutTemplateIcon className="h-5 w-5" />
            {t("templates")}
          </DialogTitle>
          <DialogDescription>{t("manageExpenseTemplatesModal")}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-4">
            <Badge variant="secondary" className="text-xs">
              {activeTemplates.length} {activeTemplates.length === 1 ? t("template") : t("templates")}
            </Badge>
            <AddExpenseTemplateForm>
              <Button size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                {t("addTemplate")}
              </Button>
            </AddExpenseTemplateForm>
          </div>

          {/* Templates List */}
          <div className="flex-1 overflow-y-auto">
            {activeTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <LayoutTemplateIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">{t("noTemplatesFound")}</h3>
                  <p className="text-xs text-muted-foreground">{t("createFirstTemplateModal")}</p>
                </div>
                <AddExpenseTemplateForm>
                  <Button size="sm">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    {t("createFirstTemplate")}
                  </Button>
                </AddExpenseTemplateForm>
              </div>
            ) : (
              <div className="space-y-3">
                {activeTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            )}
          </div>

          {/* Footer Info */}
          {activeTemplates.length > 0 && (
            <div className="mt-4 pt-3 border-t">
              <p className="text-xs text-muted-foreground text-center">{t("useTemplatesInAddExpense")}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
