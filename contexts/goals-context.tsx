"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type Goal, mockGoals } from "@/lib/goals"

interface GoalsContextType {
  goals: Goal[]
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "updatedAt">) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  getGoalsByAccount: (accountId: string) => Goal[]
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined)

export function GoalsProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([])

  useEffect(() => {
    // Load goals from localStorage or use mock data
    const savedGoals = localStorage.getItem("goals")
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals))
      } catch (error) {
        console.error("Failed to parse goals from localStorage:", error)
        setGoals(mockGoals)
      }
    } else {
      setGoals(mockGoals)
    }
  }, [])

  useEffect(() => {
    // Save goals to localStorage whenever goals change
    localStorage.setItem("goals", JSON.stringify(goals))
  }, [goals])

  const addGoal = (goalData: Omit<Goal, "id" | "createdAt" | "updatedAt">) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setGoals((prev) => [...prev, newGoal])
  }

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, ...updates, updatedAt: new Date().toISOString() } : goal)),
    )
  }

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id))
  }

  const getGoalsByAccount = (accountId: string) => {
    return goals.filter((goal) => goal.accountId === accountId)
  }

  return (
    <GoalsContext.Provider
      value={{
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        getGoalsByAccount,
      }}
    >
      {children}
    </GoalsContext.Provider>
  )
}

export function useGoals() {
  const context = useContext(GoalsContext)
  if (context === undefined) {
    throw new Error("useGoals must be used within a GoalsProvider")
  }
  return context
}
