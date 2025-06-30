"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { mockAccounts, mockTransfers, type Account, type Transfer } from "@/lib/accounts"

interface AccountsContextType {
  accounts: Account[]
  transfers: Transfer[]
  updateAccountBalance: (accountId: string, newBalance: number) => void
  addTransfer: (transfer: Omit<Transfer, "id">) => Promise<{ success: boolean; message: string }>
  getAccountById: (id: string) => Account | undefined
  refreshAccounts: () => void
  replaceAllAccounts: (accounts: Account[]) => void
}

const AccountsContext = createContext<AccountsContextType | undefined>(undefined)

export function AccountsProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts)
  const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers)

  const updateAccountBalance = (accountId: string, newBalance: number) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId ? { ...account, balance: newBalance, updatedAt: new Date().toISOString() } : account,
      ),
    )
  }

  const getAccountById = (id: string): Account | undefined => {
    return accounts.find((account) => account.id === id)
  }

  const addTransfer = async (transferData: Omit<Transfer, "id">): Promise<{ success: boolean; message: string }> => {
    try {
      const fromAccount = getAccountById(transferData.fromAccountId)
      const toAccount = getAccountById(transferData.toAccountId)

      if (!fromAccount || !toAccount) {
        return { success: false, message: "One or both accounts not found" }
      }

      // Calculate total amount including fee
      const totalAmount = transferData.amount + (transferData.fee || 0)

      // For credit cards, check if we have enough available credit or if it's a payment
      if (fromAccount.type === "credit_card") {
        // If transferring FROM a credit card, we're essentially borrowing more
        // Check if we have available credit (negative balance means debt)
        const availableCredit = Math.abs(fromAccount.balance) // Available credit
        if (totalAmount > availableCredit) {
          return { success: false, message: "Insufficient credit available" }
        }
      } else {
        // For regular accounts, check if we have sufficient funds
        if (fromAccount.balance < totalAmount) {
          return { success: false, message: "Insufficient funds in source account" }
        }
      }

      // Create the transfer record
      const newTransfer: Transfer = {
        ...transferData,
        id: `transfer_${Date.now()}`,
      }

      // Update account balances
      let newFromBalance: number
      let newToBalance: number

      if (fromAccount.type === "credit_card") {
        // Transferring FROM credit card increases debt (more negative)
        newFromBalance = fromAccount.balance - totalAmount
      } else {
        // Transferring FROM regular account decreases balance
        newFromBalance = fromAccount.balance - totalAmount
      }

      if (toAccount.type === "credit_card") {
        // Transferring TO credit card reduces debt (less negative, towards positive)
        newToBalance = toAccount.balance + transferData.amount
      } else {
        // Transferring TO regular account increases balance
        newToBalance = toAccount.balance + transferData.amount
      }

      // Update both accounts
      updateAccountBalance(transferData.fromAccountId, newFromBalance)
      updateAccountBalance(transferData.toAccountId, newToBalance)

      // Add transfer to history
      setTransfers((prev) => [newTransfer, ...prev])

      // Determine success message based on transfer type
      let successMessage = "Transfer completed successfully"
      if (toAccount.type === "credit_card") {
        successMessage = "Credit card payment completed successfully"
      } else if (fromAccount.type === "credit_card") {
        successMessage = "Cash advance completed successfully"
      }

      return { success: true, message: successMessage }
    } catch (error) {
      console.error("Transfer failed:", error)
      return { success: false, message: "Transfer failed due to an unexpected error" }
    }
  }

  const refreshAccounts = () => {
    // In a real app, this would fetch from an API
    setAccounts([...mockAccounts])
  }

  const replaceAllAccounts = (newAccounts: Account[]) => {
    setAccounts(newAccounts)
    setTransfers([]) // Clear transfers when replacing accounts
  }

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        transfers,
        updateAccountBalance,
        addTransfer,
        getAccountById,
        refreshAccounts,
        replaceAllAccounts,
      }}
    >
      {children}
    </AccountsContext.Provider>
  )
}

export function useAccounts() {
  const context = useContext(AccountsContext)
  if (context === undefined) {
    throw new Error("useAccounts must be used within an AccountsProvider")
  }
  return context
}
