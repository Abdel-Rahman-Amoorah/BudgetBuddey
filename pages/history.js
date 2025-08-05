// const defaultData = { income: [], expenses: [], savings: [] };
// await saveBudgetData(defaultData);

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from "react-native"
import styles from "../styles/history"
const HistoryPage = () => {
  const [selectedMonth, setSelectedMonth] = useState("2024-01")
  const [showMonthPicker, setShowMonthPicker] = useState(false)

  // Sample historical data - in a real app, this would come from AsyncStorage
  const historicalData = {
    "2024-01": {
      income: [
        { id: 1, source: "Salary", amount: 1200, date: "2024-01-01", type: "income" },
        { id: 2, source: "Freelance", amount: 300, date: "2024-01-15", type: "income" },
        { id: 3, source: "Side Project", amount: 150, date: "2024-01-20", type: "income" },
      ],
      expenses: [
        {
          id: 4,
          category: "🛒",
          categoryName: "Food",
          description: "Groceries",
          amount: 45,
          date: "2024-01-02",
          type: "expense",
        },
        {
          id: 5,
          category: "🚗",
          categoryName: "Transport",
          description: "Gas",
          amount: 30,
          date: "2024-01-03",
          type: "expense",
        },
        {
          id: 6,
          category: "🏠",
          categoryName: "Rent",
          description: "Monthly Rent",
          amount: 400,
          date: "2024-01-01",
          type: "expense",
        },
        {
          id: 7,
          category: "📱",
          categoryName: "Phone",
          description: "Monthly Bill",
          amount: 25,
          date: "2024-01-05",
          type: "expense",
        },
        {
          id: 8,
          category: "🎬",
          categoryName: "Entertainment",
          description: "Movie Night",
          amount: 15,
          date: "2024-01-10",
          type: "expense",
        },
        {
          id: 9,
          category: "🛒",
          categoryName: "Food",
          description: "Restaurant",
          amount: 35,
          date: "2024-01-12",
          type: "expense",
        },
      ],
    },
    "2024-02": {
      income: [
        { id: 10, source: "Salary", amount: 1200, date: "2024-02-01", type: "income" },
        { id: 11, source: "Bonus", amount: 500, date: "2024-02-14", type: "income" },
      ],
      expenses: [
        {
          id: 12,
          category: "🛒",
          categoryName: "Food",
          description: "Groceries",
          amount: 60,
          date: "2024-02-02",
          type: "expense",
        },
        {
          id: 13,
          category: "🏠",
          categoryName: "Rent",
          description: "Monthly Rent",
          amount: 400,
          date: "2024-02-01",
          type: "expense",
        },
        {
          id: 14,
          category: "👕",
          categoryName: "Clothing",
          description: "Winter Jacket",
          amount: 80,
          date: "2024-02-10",
          type: "expense",
        },
      ],
    },
    "2024-03": {
      income: [{ id: 15, source: "Salary", amount: 1200, date: "2024-03-01", type: "income" }],
      expenses: [
        {
          id: 16,
          category: "🛒",
          categoryName: "Food",
          description: "Groceries",
          amount: 50,
          date: "2024-03-02",
          type: "expense",
        },
        {
          id: 17,
          category: "🏠",
          categoryName: "Rent",
          description: "Monthly Rent",
          amount: 400,
          date: "2024-03-01",
          type: "expense",
        },
      ],
    },
  }

  const months = [
    { value: "2024-01", label: "January 2024" },
    { value: "2024-02", label: "February 2024" },
    { value: "2024-03", label: "March 2024" },
    { value: "2024-04", label: "April 2024" },
    { value: "2024-05", label: "May 2024" },
    { value: "2024-06", label: "June 2024" },
  ]

  const getCurrentMonthData = () => {
    return historicalData[selectedMonth] || { income: [], expenses: [] }
  }

  const getCombinedTransactions = () => {
    const monthData = getCurrentMonthData()
    const allTransactions = [...monthData.income, ...monthData.expenses]

    // Sort by date (newest first)
    return allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const getMonthSummary = () => {
    const monthData = getCurrentMonthData()
    const totalIncome = monthData.income.reduce((sum, item) => sum + item.amount, 0)
    const totalExpenses = monthData.expenses.reduce((sum, item) => sum + item.amount, 0)
    const balance = totalIncome - totalExpenses

    return { totalIncome, totalExpenses, balance }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const getSelectedMonthLabel = () => {
    const month = months.find((m) => m.value === selectedMonth)
    return month ? month.label : "Select Month"
  }

  const { totalIncome, totalExpenses, balance } = getMonthSummary()
  const transactions = getCombinedTransactions()

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>History</Text>

      {/* Month Selector */}
      <TouchableOpacity style={styles.monthSelector} onPress={() => setShowMonthPicker(true)}>
        <Text style={styles.monthSelectorText}>{getSelectedMonthLabel()}</Text>
        <Text style={styles.monthSelectorArrow}>▼</Text>
      </TouchableOpacity>

      {/* Month Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, styles.incomeCard]}>
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={styles.summaryAmount}>{totalIncome.toFixed(2)} JD</Text>
        </View>

        <View style={[styles.summaryCard, styles.expenseCard]}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={styles.summaryAmount}>{totalExpenses.toFixed(2)} JD</Text>
        </View>

        <View style={[styles.summaryCard, balance >= 0 ? styles.positiveBalanceCard : styles.negativeBalanceCard]}>
          <Text style={styles.summaryLabel}>Net Balance</Text>
          <Text style={styles.summaryAmount}>{balance.toFixed(2)} JD</Text>
        </View>
      </View>

      {/* Transaction History */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Transaction History</Text>

        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No transactions found</Text>
            <Text style={styles.emptyStateSubtext}>for {getSelectedMonthLabel()}</Text>
          </View>
        ) : (
          <View style={styles.transactionsList}>
            {transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View
                    style={[
                      styles.transactionIcon,
                      transaction.type === "income" ? styles.incomeIcon : styles.expenseIcon,
                    ]}
                  >
                    <Text style={styles.transactionIconText}>
                      {transaction.type === "income" ? "💰" : transaction.category}
                    </Text>
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription}>
                      {transaction.type === "income"
                        ? transaction.source
                        : `${transaction.category} ${transaction.description}`}
                    </Text>
                    <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                  </View>
                </View>
                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      transaction.type === "income" ? styles.incomeAmount : styles.expenseAmount,
                    ]}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {transaction.amount.toFixed(2)} JD
                  </Text>
                  <View
                    style={[
                      styles.transactionTypeBadge,
                      transaction.type === "income" ? styles.incomeBadge : styles.expenseBadge,
                    ]}
                  >
                    <Text style={styles.transactionTypeBadgeText}>
                      {transaction.type === "income" ? "Income" : "Expense"}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Month Picker Modal */}
      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Month</Text>
            <ScrollView style={styles.monthsList}>
              {months.map((month) => (
                <TouchableOpacity
                  key={month.value}
                  style={[styles.monthOption, selectedMonth === month.value && styles.selectedMonthOption]}
                  onPress={() => {
                    setSelectedMonth(month.value)
                    setShowMonthPicker(false)
                  }}
                >
                  <Text
                    style={[styles.monthOptionText, selectedMonth === month.value && styles.selectedMonthOptionText]}
                  >
                    {month.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowMonthPicker(false)}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

export default HistoryPage
