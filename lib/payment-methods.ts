export type PaymentMethod =
  | "cash"
  | "debit_card"
  | "credit_card"
  | "bank_transfer"
  | "check"
  | "digital_wallet"
  | "other"

export interface PaymentMethodOption {
  id: PaymentMethod
  name: string
  icon: string
  description: string
}

export const paymentMethods: PaymentMethodOption[] = [
  {
    id: "cash",
    name: "cash",
    icon: "💵",
    description: "Physical cash payment",
  },
  {
    id: "debit_card",
    name: "debitCard",
    icon: "💳",
    description: "Debit card payment",
  },
  {
    id: "credit_card",
    name: "creditCard",
    icon: "💳",
    description: "Credit card payment",
  },
  {
    id: "bank_transfer",
    name: "bankTransfer",
    icon: "🏦",
    description: "Bank transfer or wire",
  },
  {
    id: "check",
    name: "check",
    icon: "📝",
    description: "Check payment",
  },
  {
    id: "digital_wallet",
    name: "digitalWallet",
    icon: "📱",
    description: "Digital wallet (PayPal, Apple Pay, etc.)",
  },
  {
    id: "other",
    name: "other",
    icon: "❓",
    description: "Other payment method",
  },
]

export function getPaymentMethodById(id: PaymentMethod): PaymentMethodOption | undefined {
  return paymentMethods.find((method) => method.id === id)
}
