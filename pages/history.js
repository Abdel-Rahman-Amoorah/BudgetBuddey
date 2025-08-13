import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import styles from "../styles/history";
import { loadBudgetData } from "../utils/storage"; // adjust path if needed

const HistoryPage = ({ navigation }) => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [rawData, setRawData] = useState({ income: [], expenses: [], savings: [], monthlyRecords: {} });
  const [months, setMonths] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // helper: get "YYYY-MM" from a date string
  const monthFromDate = (d) => (d ? d.slice(0, 7) : null);

  // load data once on mount, build months list
  useEffect(() => {
    const init = async () => {
      try {
        const data = await loadBudgetData();
        const incoming = {
          income: data.income ?? [],
          expenses: data.expenses ?? [],
          savings: data.savings ?? [],
          monthlyRecords: data.monthlyRecords ?? {},
        };
        setRawData(incoming);

        // collect possible month keys from monthlyRecords and from each entry date
        const keysFromRecords = Object.keys(incoming.monthlyRecords);
        const keysFromIncome = incoming.income.map(i => monthFromDate(i.startDate)).filter(Boolean);
        const keysFromExpenses = incoming.expenses.map(e => monthFromDate(e.date)).filter(Boolean);

        const setKeys = new Set([...keysFromRecords, ...keysFromIncome, ...keysFromExpenses]);
        const monthList = Array.from(setKeys).sort().reverse(); // newest first

        const monthOptions = monthList.map(k => ({
          value: k,
          label: new Date(`${k}-01`).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        }));

        setMonths(monthOptions);
        // default to latest month if nothing selected
        if (!selectedMonth) setSelectedMonth(monthList[0] ?? (new Date()).toISOString().slice(0, 7));
      } catch (err) {
        console.error("Error loading budget data:", err);
      }
    };

    init();
    // run once
  }, []);

  // rebuild transactions whenever rawData or selectedMonth changes
  useEffect(() => {
    if (!selectedMonth || !rawData) {
      setTransactions([]);
      return;
    }

    const records = rawData.monthlyRecords || {};
    let txs = [];

    // 1) Prefer monthlyRecords arrays if they exist
    const rec = records[selectedMonth];
    if (rec && (Array.isArray(rec.income) || Array.isArray(rec.expenses) || Array.isArray(rec.savings))) {
      txs = [
        ...(rec.income || []),
        ...(rec.expenses || []),
        ...(rec.savings || [])
      ];
    }

    // 2) Fallback: build from flat lists
    if (txs.length === 0) {
      txs = [
        ...(rawData.income || []).filter(i => monthFromDate(i.startDate) === selectedMonth),
        ...(rawData.expenses || []).filter(e => monthFromDate(e.date) === selectedMonth),
        ...(rawData.savings || []).filter(s => monthFromDate(s.date) === selectedMonth),
      ];
    }

    // normalize & sort
    txs = txs
      .map(t => ({
        ...t,
        type: t.type || (t.source ? "income" : t.category === "Savings" ? "savings" : "expense")
      }))
      .sort((a, b) => new Date(b.date || b.startDate) - new Date(a.date || a.startDate));

    setTransactions(txs);
  }, [rawData, selectedMonth]);

  // get totals:
  const getMonthSummary = () => {
    const rec = rawData.monthlyRecords?.[selectedMonth];

    // if monthlyRecords has numeric totals
    if (rec && (typeof rec.income === "number" || typeof rec.expenses === "number" || typeof rec.savings === "number")) {
      const totalIncome = Number(rec.income || 0);
      const totalExpenses = Number(rec.expenses || 0);
      const totalSavings = Number(rec.savings || 0);
      return { totalIncome, totalExpenses, totalSavings, balance: totalIncome - totalExpenses - totalSavings };
    }

    // if monthlyRecords has arrays
    if (rec && (Array.isArray(rec.income) || Array.isArray(rec.expenses) || Array.isArray(rec.savings))) {
      const totalIncome = (rec.income || []).reduce((s, i) => s + (i.amount || 0), 0);
      const totalExpenses = (rec.expenses || []).reduce((s, e) => s + (e.amount || 0), 0);
      const totalSavings = (rec.savings || []).reduce((s, sv) => s + (sv.amount || 0), 0);
      return { totalIncome, totalExpenses, totalSavings, balance: totalIncome - totalExpenses - totalSavings };
    }

    // fallback
    const totalIncome = transactions.filter(t => t.type === "income").reduce((s, i) => s + (i.amount || 0), 0);
    const totalExpenses = transactions.filter(t => t.type === "expense").reduce((s, e) => s + (e.amount || 0), 0);
    const totalSavings = transactions.filter(t => t.type === "savings").reduce((s, sv) => s + (sv.amount || 0), 0);
    return { totalIncome, totalExpenses, totalSavings, balance: totalIncome - totalExpenses - totalSavings };
  };

  const { totalIncome, totalExpenses, balance, totalSavings } = getMonthSummary();

  const getSelectedMonthLabel = () => {
    const found = months.find(m => m.value === selectedMonth);
    return found ? found.label : selectedMonth ?? "Select month";
  };

  return (
    <ScrollView style={styles.container}>

      {/* Month Picker */}
      <TouchableOpacity style={styles.monthSelector} onPress={() => setShowMonthPicker(true)}>
        <Text style={styles.monthSelectorText}>{getSelectedMonthLabel()}</Text>
        <Text style={styles.monthSelectorArrow}>▼</Text>
      </TouchableOpacity>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, styles.incomeCard]}>
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={styles.summaryAmount}>{totalIncome.toFixed(2)} JD</Text>
        </View>
        <View style={[styles.summaryCard, styles.expenseCard]}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={styles.summaryAmount}>{totalExpenses.toFixed(2)} JD</Text>
        </View>
        <View style={[styles.summaryCard, styles.savingsCard]}>
          <Text style={styles.summaryLabel}>Total Savings</Text>
          <Text style={styles.summaryAmount}>
            {rawData.savings
              .filter(s => monthFromDate(s.date) === selectedMonth)
              .reduce((sum, s) => sum + (s.amount || 0), 0)
              .toFixed(2)
            } JD
          </Text>
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
                  <View style={[
                    styles.transactionIcon,
                    transaction.type === "income"
                      ? styles.incomeIcon
                      : transaction.type === "savings"
                        ? styles.savingsIcon
                        : styles.expenseIcon
                  ]}>
                    <Text style={styles.transactionIconText}>
                      {transaction.type === "income"
                        ? "💰"
                        : transaction.type === "savings"
                          ? "🏦"
                          : transaction.category}
                    </Text>
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription}>
                      {transaction.type === "income"
                        ? transaction.source
                        : transaction.type === "savings"
                          ? transaction.description || "Savings"
                          : `${transaction.category} ${transaction.description}`}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {new Date(transaction.date || transaction.startDate)
                        .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </Text>
                  </View>
                </View>

                <View style={styles.transactionRight}>
                  <Text style={[
                    styles.transactionAmount,
                    transaction.type === "income"
                      ? styles.incomeAmount
                      : transaction.type === "savings"
                        ? styles.savingsAmount
                        : styles.expenseAmount
                  ]}>
                    {transaction.type === "income" ? "+" : transaction.type === "savings" ? "💾" : "-"}
                    {(transaction.amount || 0).toFixed(2)} JD
                  </Text>
                  <View style={[
                    styles.transactionTypeBadge,
                    transaction.type === "income"
                      ? styles.incomeBadge
                      : transaction.type === "savings"
                        ? styles.savingsBadge
                        : styles.expenseBadge
                  ]}>
                    <Text style={styles.transactionTypeBadgeText}>
                      {transaction.type === "income" ? "Income" : transaction.type === "savings" ? "Savings" : "Expense"}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Month Picker Modal */}
      <Modal visible={showMonthPicker} transparent animationType="slide" onRequestClose={() => setShowMonthPicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Month</Text>
            <ScrollView style={styles.monthsList}>
              {months.length === 0 ? (
                <Text style={styles.emptyStateText}>No months available</Text>
              ) : (
                months.map((month) => (
                  <TouchableOpacity
                    key={month.value}
                    style={[styles.monthOption, selectedMonth === month.value && styles.selectedMonthOption]}
                    onPress={() => {
                      setSelectedMonth(month.value);
                      setShowMonthPicker(false);
                    }}
                  >
                    <Text style={[styles.monthOptionText, selectedMonth === month.value && styles.selectedMonthOptionText]}>
                      {month.label}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>

            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowMonthPicker(false)}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Footer Buttons */}
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
  );
};

export default HistoryPage;
