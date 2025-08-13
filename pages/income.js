import { useState, useContext, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, TouchableWithoutFeedback } from "react-native"
import { NavContext } from "../utils/context"
import { Income } from "../Models/budgetentry"
import { Checkbox, RadioButton } from 'react-native-paper';
import { saveBudgetData, loadBudgetData } from "../utils/storage";
import styles from "../styles/income";

const IncomePage = ({ navigation }) => {
  const { setTotalIncome, totalIncome } = useContext(NavContext)
  const [source, setSource] = useState("")
  const [amount, setAmount] = useState("")
  const [dailyamount, setDailyAmount] = useState("")
  const [checked, setChecked] = useState(true);
  const [frequency, setFrequency] = useState('monthly');
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [incomeList, setIncomeList] = useState([])
  useEffect(() => {
    const fetchIncomeData = async () => {
      const data = await loadBudgetData();
      setIncomeList(data.income ?? []);
    };
    fetchIncomeData();
  }, []);
  useEffect(() => {
    const total = incomeList.reduce((total, income) => total + income.amount, 0);
    setTotalIncome(total);
  }, [incomeList]);
  const handleAddIncome = async () => {
    if (!source.trim() || !amount.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    const today = new Date();
    const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    const newIncome = new Income(
      Date.now(),
      parsedAmount,
      source.trim(),
      today.toISOString().split("T")[0],
      checked,
      checked ? frequency : null
    );

    const data = await loadBudgetData();
    data.income = data.income ?? [];
    data.income.push(newIncome);

    // Ensure monthlyRecords exists
    data.monthlyRecords = data.monthlyRecords ?? {};
    data.monthlyRecords[monthKey] = data.monthlyRecords[monthKey] ?? { income: 0, expenses: 0, savings: 0 };

    // Add this income to that month’s total
    data.monthlyRecords[monthKey].income += parsedAmount;

    await saveBudgetData(data);

    setIncomeList(data.income);
    setSource("");
    setAmount("");
  };

  const handleUpdateDailyIncome = async (entryId) => {
    if (!dailyamount.trim()) {
      Alert.alert("Error", "Please enter an amount");
      return;
    }

    const parsedAmount = parseFloat(dailyamount);
    if (isNaN(parsedAmount)) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    const today = new Date();
    const todayDate = today.toISOString().split("T")[0];
    const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    const data = await loadBudgetData();
    data.income = data.income ?? [];
    // Ensure monthlyRecords exists
    data.monthlyRecords = data.monthlyRecords ?? {};
    data.monthlyRecords[monthKey] = data.monthlyRecords[monthKey] ?? { income: 0, expenses: 0, savings: 0 };

    // Find today's "Daily Income" entry
    const existingIncomeIndex = data.income.findIndex(item => item.id === entryId);
    if (existingIncomeIndex >= 0) {
      // ✅ Add new amount to previous value
      const oldAmount = data.income[existingIncomeIndex].amount;
      const newTotal = oldAmount + parsedAmount;

      data.income[existingIncomeIndex].amount = newTotal;

      // Adjust monthly total: add only the new addition
      data.monthlyRecords[monthKey].income += parsedAmount;

    } else {
      // Add new income entry if not found
      const newIncome = new Income(
        Date.now(),
        parsedAmount,
        "Daily",
        todayDate,
        false,
        null
      );
      data.income.push(newIncome);

      // Add to monthly total
      data.monthlyRecords[monthKey].income += parsedAmount;
    }

    await saveBudgetData(data);

    setIncomeList(data.income);
    setDailyAmount(""); // clear input
  };

  const handleDeleteIncome = async (entryId) => {
    try {
      const data = await loadBudgetData();
      const entryToDelete = data.income.find((item) => item.id === entryId);

      if (!entryToDelete) return; // Nothing to delete

      // Extract month key from entry's start date
      const entryDate = new Date(entryToDelete.startDate);
      const monthKey = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}`;

      // Ensure monthlyRecords exists
      data.monthlyRecords = data.monthlyRecords ?? {};
      data.monthlyRecords[monthKey] = data.monthlyRecords[monthKey] ?? { income: 0, expenses: 0, savings: 0 };

      // Subtract the amount from that month's total income
      data.monthlyRecords[monthKey].income -= entryToDelete.amount;
      if (data.monthlyRecords[monthKey].income < 0) {
        data.monthlyRecords[monthKey].income = 0; // Avoid negative totals
      }

      // Remove the entry from income list
      const updatedIncome = data.income.filter((item) => item.id !== entryId);
      data.income = updatedIncome;

      await saveBudgetData(data);

      setIncomeList(updatedIncome);
      setSelectedIncome(null);
    } catch (err) {
      console.error("Failed to delete entry:", err);
    }
  };
  return (
    <ScrollView style={styles.container}>
      {/* Total Income Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Monthly Income</Text>
        <Text style={styles.summaryAmount}>{totalIncome} JD</Text>
      </View>
      {/* Add Income Form */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Income Source</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Work, Freelance, Business"
            value={source}
            onChangeText={setSource}
            placeholderTextColor="#95A5A6"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount (JD)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholderTextColor="#95A5A6"
          />
        </View>

        <View style={[styles.inputContainer, styles.rowAlign]}>
          <Text style={styles.label}>Recurring</Text>
          <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => setChecked(!checked)}
          />
        </View>

        {checked && <View style={styles.inputContainer}>
          <Text style={styles.label}>Frequency</Text>
          <RadioButton.Group onValueChange={value => setFrequency(value)} value={frequency}>
            <View style={styles.radioRow}>
              <View style={styles.radioItem}>
                <RadioButton value="Daily" />
                <Text>Daily</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="weekly" />
                <Text>Weekly</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="monthly" />
                <Text>Monthly</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>}

        <TouchableOpacity style={styles.addButton} onPress={handleAddIncome}>
          <Text style={styles.addButtonText}>Add Income</Text>
        </TouchableOpacity>
      </View>
      {/* Daily Income List */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Daily Income Entries</Text>
        {incomeList.filter((income) => income.frequency === "Daily").length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No daily income entries yet</Text>
            <Text style={styles.emptyStateSubtext}>Add your first income source above</Text>
          </View>
        ) : (
          incomeList.filter((income) => income.frequency === "Daily").map((income) => (
            <TouchableOpacity key={income.id} onPress={() => setSelectedIncome(income)}>
              <View key={income.id} style={styles.incomeItem}>
                <View style={styles.incomeInfo}>
                  <Text style={styles.incomeSource}>{income.source}</Text>
                  <Text style={styles.incomeDate}>{income.startDate}</Text>
                </View>
                <Text style={styles.incomeAmount}>+{income.amount} JD</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
      {/* Weekly Income List */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Weekly Income Entries</Text>
        {incomeList.filter((income) => income.frequency === "weekly").length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No Weekly income entries yet</Text>
            <Text style={styles.emptyStateSubtext}>Add your first income source above</Text>
          </View>
        ) : (
          incomeList.filter((income) => income.frequency === "weekly").map((income) => (
            <TouchableOpacity key={income.id} onPress={() => setSelectedIncome(income)}>
              <View key={income.id} style={styles.incomeItem}>
                <View style={styles.incomeInfo}>
                  <Text style={styles.incomeSource}>{income.source}</Text>
                  <Text style={styles.incomeDate}>{income.startDate}</Text>
                </View>
                <Text style={styles.incomeAmount}>+{income.amount} JD</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Monthly Income List */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Monthly Income Entries</Text>
        {incomeList.filter((income) => income.frequency === "monthly").length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No Monthly income entries yet</Text>
            <Text style={styles.emptyStateSubtext}>Add your first income source above</Text>
          </View>
        ) : (
          incomeList.filter((income) => income.frequency === "monthly").map((income) => (
            <TouchableOpacity key={income.id} onPress={() => setSelectedIncome(income)}>
              <View key={income.id} style={styles.incomeItem}>
                <View style={styles.incomeInfo}>
                  <Text style={styles.incomeSource}>{income.source}</Text>
                  <Text style={styles.incomeDate}>{income.startDate}, {income.frequency}, {income.recurring ? "Recurring" : "One-time"}</Text>
                </View>
                <Text style={styles.incomeAmount}>+{income.amount} JD</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={selectedIncome !== null}
          onRequestClose={() => {
            setSelectedIncome(null);
            setEditMode(!editMode);
          }}
        >
          <TouchableWithoutFeedback onPress={() => setSelectedIncome(null)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}> {selectedIncome?.source}</Text>
                  {selectedIncome?.frequency === "Daily" ? <View style={styles.inputContainer}>
                    <Text style={styles.label}>Amount (JD)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="0.00"
                      value={dailyamount}
                      onChangeText={setDailyAmount}
                      keyboardType="numeric"
                      placeholderTextColor="#95A5A6"
                    />
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => { handleUpdateDailyIncome(selectedIncome.id); setSelectedIncome(null) }}
                    >
                      <Text style={styles.modalButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                    :
                    <TouchableOpacity style={[styles.modalButton]} onPress={() => {
                      setEditMode(!editMode)
                    }}>
                      <Text style={styles.modalButtonText}>{editMode ? "Just Delete it" : "Edit Entry"}</Text>
                    </TouchableOpacity>}

                  <TouchableOpacity style={[styles.modalButton, styles.deleteButton]} onPress={() => {
                    setSelectedIncome(null)
                    handleDeleteIncome(selectedIncome.id)
                  }}>
                    <Text style={styles.modalButtonText}>Delete Entry</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setSelectedIncome(null)}>
                    <Text style={styles.ModalcloseButton}>Close</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>


      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButtonWrapper} onPress={() => navigation.navigate("Dashboard")}>
          <Text style={styles.footerButtonText}>Dashboard</Text>
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

export default IncomePage
