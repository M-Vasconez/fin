"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { mockExpenseTemplates, type ExpenseTemplate } from "@/lib/expense-templates"

interface ExpenseTemplatesContextType {
  templates: ExpenseTemplate[]
  addTemplate: (template: Omit<ExpenseTemplate, "id" | "createdAt" | "updatedAt">) => void
  updateTemplate: (id: string, updates: Partial<ExpenseTemplate>) => void
  deleteTemplate: (id: string) => void
  getActiveTemplates: () => ExpenseTemplate[]
  getTemplateById: (id: string) => ExpenseTemplate | undefined
}

const ExpenseTemplatesContext = createContext<ExpenseTemplatesContextType | undefined>(undefined)

export function ExpenseTemplatesProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<ExpenseTemplate[]>(mockExpenseTemplates)

  const addTemplate = (templateData: Omit<ExpenseTemplate, "id" | "createdAt" | "updatedAt">) => {
    const newTemplate: ExpenseTemplate = {
      ...templateData,
      id: `template_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTemplates((prev) => [...prev, newTemplate])
  }

  const updateTemplate = (id: string, updates: Partial<ExpenseTemplate>) => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === id
          ? {
              ...template,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : template,
      ),
    )
  }

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((template) => template.id !== id))
  }

  const getActiveTemplates = () => {
    return templates.filter((template) => template.isActive)
  }

  const getTemplateById = (id: string) => {
    return templates.find((template) => template.id === id)
  }

  return (
    <ExpenseTemplatesContext.Provider
      value={{
        templates,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        getActiveTemplates,
        getTemplateById,
      }}
    >
      {children}
    </ExpenseTemplatesContext.Provider>
  )
}

export function useExpenseTemplates() {
  const context = useContext(ExpenseTemplatesContext)
  if (context === undefined) {
    throw new Error("useExpenseTemplates must be used within an ExpenseTemplatesProvider")
  }
  return context
}
