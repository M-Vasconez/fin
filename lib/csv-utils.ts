import type { Transaction } from "@/lib/mock-data"
import type { Account } from "@/lib/accounts"
import type { ExpenseTemplate } from "@/lib/expense-templates"

// CSV Export Functions
export function exportTransactionsToCSV(transactions: Transaction[]): string {
  const headers = ["id", "date", "amount", "description", "category", "type", "paymentMethod"]
  const csvContent = [
    headers.join(","),
    ...transactions.map((transaction) =>
      [
        transaction.id,
        transaction.date,
        transaction.amount.toString(),
        `"${transaction.description.replace(/"/g, '""')}"`,
        transaction.category,
        transaction.type,
        transaction.paymentMethod,
      ].join(","),
    ),
  ].join("\n")

  return csvContent
}

export function exportAccountsToCSV(accounts: Account[]): string {
  const headers = ["id", "name", "type", "balance", "currency", "isActive", "createdAt", "updatedAt"]
  const csvContent = [
    headers.join(","),
    ...accounts.map((account) =>
      [
        account.id,
        `"${account.name.replace(/"/g, '""')}"`,
        account.type,
        account.balance.toString(),
        account.currency,
        account.isActive.toString(),
        account.createdAt,
        account.updatedAt,
      ].join(","),
    ),
  ].join("\n")

  return csvContent
}

export function exportCategoriesToCSV(categories: { income: string[]; expense: string[] }): string {
  const headers = ["name", "type"]
  const allCategories = [
    ...categories.income.map((cat) => ({ name: cat, type: "income" })),
    ...categories.expense.map((cat) => ({ name: cat, type: "expense" })),
  ]

  const csvContent = [
    headers.join(","),
    ...allCategories.map((category) => [`"${category.name.replace(/"/g, '""')}"`, category.type].join(",")),
  ].join("\n")

  return csvContent
}

export function exportTemplatesToCSV(templates: ExpenseTemplate[]): string {
  const headers = [
    "id",
    "name",
    "description",
    "amount",
    "category",
    "paymentMethod",
    "isActive",
    "createdAt",
    "updatedAt",
  ]
  const csvContent = [
    headers.join(","),
    ...templates.map((template) =>
      [
        template.id,
        `"${template.name.replace(/"/g, '""')}"`,
        `"${template.description.replace(/"/g, '""')}"`,
        template.amount.toString(),
        template.category,
        template.paymentMethod,
        template.isActive.toString(),
        template.createdAt,
        template.updatedAt,
      ].join(","),
    ),
  ].join("\n")

  return csvContent
}

// CSV Import Functions
export function parseCSV(csvContent: string): string[][] {
  const lines = csvContent.split("\n").filter((line) => line.trim())
  const result: string[][] = []

  for (const line of lines) {
    const row: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++ // Skip next quote
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === "," && !inQuotes) {
        row.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }

    row.push(current.trim())
    result.push(row)
  }

  return result
}

export function validateTransactionCSV(data: string[][]): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (data.length === 0) {
    errors.push("CSV file is empty")
    return { isValid: false, errors }
  }

  const headers = data[0]
  const requiredHeaders = ["id", "date", "amount", "description", "category", "type", "paymentMethod"]

  for (const header of requiredHeaders) {
    if (!headers.includes(header)) {
      errors.push(`Missing required header: ${header}`)
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors }
  }

  // Validate data rows
  for (let i = 1; i < data.length; i++) {
    const row = data[i]
    if (row.length !== headers.length) {
      errors.push(`Row ${i + 1}: Incorrect number of columns`)
      continue
    }

    const amountIndex = headers.indexOf("amount")
    const typeIndex = headers.indexOf("type")
    const dateIndex = headers.indexOf("date")

    if (isNaN(Number(row[amountIndex]))) {
      errors.push(`Row ${i + 1}: Invalid amount value`)
    }

    if (!["income", "expense"].includes(row[typeIndex])) {
      errors.push(`Row ${i + 1}: Invalid type value (must be 'income' or 'expense')`)
    }

    if (isNaN(Date.parse(row[dateIndex]))) {
      errors.push(`Row ${i + 1}: Invalid date format`)
    }
  }

  return { isValid: errors.length === 0, errors }
}

export function validateAccountCSV(data: string[][]): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (data.length === 0) {
    errors.push("CSV file is empty")
    return { isValid: false, errors }
  }

  const headers = data[0]
  const requiredHeaders = ["id", "name", "type", "balance", "currency", "isActive", "createdAt", "updatedAt"]

  for (const header of requiredHeaders) {
    if (!headers.includes(header)) {
      errors.push(`Missing required header: ${header}`)
    }
  }

  return { isValid: errors.length === 0, errors }
}

export function parseTransactionsFromCSV(data: string[][]): Transaction[] {
  const headers = data[0]
  const transactions: Transaction[] = []

  for (let i = 1; i < data.length; i++) {
    const row = data[i]
    const transaction: Transaction = {
      id: row[headers.indexOf("id")],
      date: row[headers.indexOf("date")],
      amount: Number(row[headers.indexOf("amount")]),
      description: row[headers.indexOf("description")],
      category: row[headers.indexOf("category")],
      type: row[headers.indexOf("type")] as "income" | "expense",
      paymentMethod: row[headers.indexOf("paymentMethod")] as any,
    }
    transactions.push(transaction)
  }

  return transactions
}

export function parseAccountsFromCSV(data: string[][]): Account[] {
  const headers = data[0]
  const accounts: Account[] = []

  for (let i = 1; i < data.length; i++) {
    const row = data[i]
    const account: Account = {
      id: row[headers.indexOf("id")],
      name: row[headers.indexOf("name")],
      type: row[headers.indexOf("type")] as any,
      balance: Number(row[headers.indexOf("balance")]),
      currency: row[headers.indexOf("currency")],
      isActive: row[headers.indexOf("isActive")] === "true",
      createdAt: row[headers.indexOf("createdAt")],
      updatedAt: row[headers.indexOf("updatedAt")],
    }
    accounts.push(account)
  }

  return accounts
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
