"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useGoals } from "@/contexts/goals-context"
import { useLanguage } from "@/contexts/language-context"
import { useAccounts } from "@/contexts/accounts-context"
import { goalCategories, type GoalCategory } from "@/lib/goals"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface EditGoalFormProps {
  goalId: string
  onClose: () => void
}

export function EditGoalForm({ goalId, onClose }: EditGoalFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [currentAmount, setCurrentAmount] = useState("")
  const [targetDate, setTargetDate] = useState<Date>()
  const [category, setCategory] = useState<GoalCategory>()
  const [accountId, setAccountId] = useState("")

  const { goals, updateGoal } = useGoals()
  const { t } = useLanguage()
  const { accounts } = useAccounts()

  const goal = goals.find((g) => g.id === goalId)

  useEffect(() => {
    if (goal) {
      setName(goal.name)
      setDescription(goal.description || "")
      setTargetAmount(goal.targetAmount.toString())
      setCurrentAmount(goal.currentAmount.toString())
      setTargetDate(new Date(goal.targetDate))
      setCategory(goal.category)
      setAccountId(goal.accountId)
    }
  }, [goal])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !targetAmount || !targetDate || !category || !accountId) {
      return
    }

    updateGoal(goalId, {
      name,
      description: description || undefined,
      targetAmount: Number.parseFloat(targetAmount),
      currentAmount: Number.parseFloat(currentAmount) || 0,
      targetDate: targetDate.toISOString(),
      category,
      accountId,
    })

    onClose()
  }

  if (!goal) return null

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("editGoal")}</DialogTitle>
          <DialogDescription>{t("editGoalDescription")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("goalName")}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("goalNamePlaceholder")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{t("goalCategory")}</Label>
            <Select value={category} onValueChange={(value: GoalCategory) => setCategory(value)} required>
              <SelectTrigger>
                <SelectValue placeholder={t("selectGoalCategory")} />
              </SelectTrigger>
              <SelectContent>
                {goalCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{t(cat.value)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentAmount">{t("currentAmount")}</Label>
              <Input
                id="currentAmount"
                type="number"
                step="0.01"
                min="0"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAmount">{t("targetAmount")}</Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                min="0"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("targetDate")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !targetDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {targetDate ? format(targetDate, "PPP") : t("pickTargetDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={targetDate}
                  onSelect={setTargetDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountId">{t("account")}</Label>
            <Select value={accountId} onValueChange={setAccountId} required>
              <SelectTrigger>
                <SelectValue placeholder={t("selectAccount")} />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("goalDescription")}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("goalDescriptionPlaceholder")}
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button type="submit">{t("saveChanges")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
