import type { PaymentMethod } from "@/lib/payment-methods"

export interface Account {
  id: string
  name: string
  type: PaymentMethod
  balance: number
  accountNumber?: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Transfer {
  id: string
  fromAccountId: string
  toAccountId: string
  amount: number
  description: string
  date: string
  fee?: number
}

// Mock accounts data
export const mockAccounts: Account[] = [
  {
    id: "acc_1",
    name: "Main Checking",
    type: "bank_transfer",
    balance: 2500.0,
    accountNumber: "****1234",
    description: "Primary checking account",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-03-30",
  },
  {
    id: "acc_2",
    name: "Savings Account",
    type: "bank_transfer",
    balance: 15000.0,
    accountNumber: "****5678",
    description: "Emergency savings",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-03-29",
  },
  {
    id: "acc_3",
    name: "Chase Freedom",
    type: "credit_card",
    balance: -850.0, // Negative balance represents debt
    accountNumber: "****9012",
    description: "Rewards credit card",
    isActive: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-03-28",
  },
  {
    id: "acc_4",
    name: "Business Checking",
    type: "bank_transfer",
    balance: 5200.0,
    accountNumber: "****3456",
    description: "Business expenses account",
    isActive: true,
    createdAt: "2024-02-01",
    updatedAt: "2024-03-25",
  },
  {
    id: "acc_5",
    name: "Cash Wallet",
    type: "cash",
    balance: 150.0,
    description: "Physical cash on hand",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-03-30",
  },
  {
    id: "acc_6",
    name: "PayPal",
    type: "digital_wallet",
    balance: 320.5,
    accountNumber: "user@example.com",
    description: "PayPal digital wallet",
    isActive: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-03-27",
  },
]

// Mock transfers data
export const mockTransfers: Transfer[] = [
  {
    id: "transfer_1",
    fromAccountId: "acc_1",
    toAccountId: "acc_3",
    amount: 500.0,
    description: "Credit card payment",
    date: "2024-03-25",
  },
  {
    id: "transfer_2",
    fromAccountId: "acc_2",
    toAccountId: "acc_1",
    amount: 1000.0,
    description: "Transfer to checking",
    date: "2024-03-20",
  },
  {
    id: "transfer_3",
    fromAccountId: "acc_1",
    toAccountId: "acc_6",
    amount: 100.0,
    description: "Top up PayPal",
    date: "2024-03-15",
    fee: 2.5,
  },
]

export function getAccountsByType(type: PaymentMethod): Account[] {
  return mockAccounts.filter((account) => account.type === type && account.isActive)
}

export function getAccountById(id: string): Account | undefined {
  return mockAccounts.find((account) => account.id === id)
}

export function getTotalBalanceByType(type: PaymentMethod): number {
  return mockAccounts
    .filter((account) => account.type === type && account.isActive)
    .reduce((total, account) => total + account.balance, 0)
}

export function getAllActiveAccounts(): Account[] {
  return mockAccounts.filter((account) => account.isActive)
}

export function getAccountTypeIcon(type: PaymentMethod): string {
  const icons = {
    cash: "💵",
    debit_card: "💳",
    credit_card: "💳",
    bank_transfer: "🏦",
    check: "📝",
    digital_wallet: "📱",
    other: "❓",
  }
  return icons[type] || "❓"
}

export function formatAccountBalance(
  balance: number,
  type: PaymentMethod,
): {
  amount: string
  isDebt: boolean
  color: string
} {
  const isDebt = type === "credit_card" ? balance < 0 : false
  const displayAmount = Math.abs(balance)

  return {
    amount: displayAmount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    isDebt,
    color: isDebt
      ? "text-rose-600 dark:text-rose-400"
      : balance > 0
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-muted-foreground",
  }
}
