import type { PaymentMethod } from "@/lib/payment-methods"

export interface ExpenseTemplate {
  id: string
  name: string
  description?: string
  amount?: number // Optional - might vary each time
  category: string
  paymentMethod?: PaymentMethod // Optional - might vary
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Mock expense templates data
export const mockExpenseTemplates: ExpenseTemplate[] = [
  {
    id: "template_1",
    name: "Rent Payment",
    description: "Monthly rent payment",
    amount: 1200,
    category: "housing",
    paymentMethod: "bank_transfer",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "template_2",
    name: "Electric Bill",
    description: "Monthly electricity bill",
    // No amount - varies each month
    category: "utilities",
    paymentMethod: "credit_card",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "template_3",
    name: "Grocery Shopping",
    description: "Weekly grocery shopping",
    // No amount - varies each time
    category: "food",
    paymentMethod: "debit_card",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "template_4",
    name: "Internet Subscription",
    description: "Monthly internet service",
    amount: 45.99,
    category: "utilities",
    paymentMethod: "credit_card",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "template_5",
    name: "Gas Station",
    description: "Fuel for car",
    // No amount - varies each time
    category: "transportation",
    paymentMethod: "credit_card",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "template_6",
    name: "Coffee Shop",
    description: "Daily coffee",
    // No amount - varies
    category: "food",
    paymentMethod: "cash",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
]

export function getActiveTemplates(): ExpenseTemplate[] {
  return mockExpenseTemplates.filter((template) => template.isActive)
}

export function getTemplateById(id: string): ExpenseTemplate | undefined {
  return mockExpenseTemplates.find((template) => template.id === id)
}
