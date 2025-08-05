import React, { useContext } from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { NavContext } from "../utils/context"
import styles from "../styles/dashboard"

const DashboardPage = ({ navigation }) => {
  const { totalIncome, totalExpenses,totalSavings } = useContext(NavContext)
  const remainingBalance = totalIncome - totalExpenses - totalSavings

  const expenseCategories = []

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View styles={styles.header}>
        <TouchableOpacity style={styles.headerButtonWrapper} onPress={() => navigation.navigate("History")}>
          <Text style={styles.footerButtonText}>View History</Text>
        </TouchableOpacity>
      </View>
      {/* Financial Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, styles.incomeCard]}>
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={styles.summaryAmount}>{totalIncome} JD</Text>
        </View>
        <View style={[styles.summaryCard, styles.saveingcard]}>
          <Text style={styles.summaryLabel}>Total Savings</Text>
          <Text style={styles.summaryAmount}>{totalIncome} JD</Text>
        </View>
        <View style={[styles.summaryCard, styles.expenseCard]}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={styles.summaryAmount}>{totalExpenses} JD</Text>
        </View>

        <View style={[styles.summaryCard, styles.balanceCard]}>
          <Text style={styles.summaryLabel}>Remaining Balance</Text>
          <Text style={styles.summaryAmount}>{remainingBalance} JD</Text>
        </View>
      </View>

      {/* Charts Section */}
      <View style={styles.chartsContainer}>
        {/* Pie Chart Placeholder */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Expenses by Category</Text>
          <View style={styles.pieChartPlaceholder}>
            <View style={styles.pieChartCircle}>
              <Text style={styles.chartPlaceholderText}>Pie Chart</Text>
              <Text style={styles.chartPlaceholderSubtext}>Will go here</Text>
            </View>
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            {expenseCategories.map((category, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: category.color }]} />
                <Text style={styles.legendText}>
                  {category.name}: {category.amount} JD
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bar Chart Placeholder */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Income vs Expenses</Text>
          <View style={styles.barChartPlaceholder}>
            <View style={styles.barContainer}>
              <View style={[styles.bar, styles.incomeBar]} />
              <Text style={styles.barLabel}>Income</Text>
            </View>
            <View style={styles.barContainer}>
              <View style={[styles.bar, styles.expenseBar]} />
              <Text style={styles.barLabel}>Expenses</Text>
            </View>
          </View>
          <Text style={styles.chartPlaceholderText}>Bar Chart Will Go Here</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButtonWrapper} onPress={() => navigation.navigate("Income")}>
          <Text style={styles.footerButtonText}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButtonWrapper} onPress={() => navigation.navigate("Savings")}>
          <Text style={styles.footerButtonText}>Savings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButtonWrapper} onPress={() => navigation.navigate("Expenses")}>
          <Text style={styles.footerButtonText}>Expenses</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default DashboardPage
