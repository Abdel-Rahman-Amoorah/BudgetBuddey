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

    const newIncome = new Income(
      Date.now(), // Unique ID
      parsedAmount,
      source.trim(),
      new Date().toISOString().split("T")[0],
      checked,
      checked ? frequency : null, // Set frequency only if recurring,
      "income"
    );
    const data = await loadBudgetData();
    data.income = data.income ?? [];
    data.income.push(newIncome);
    await saveBudgetData(data);

    setIncomeList(data.income);
    setSource("");
    setAmount("");
  };
  const handleUpdateDailyIncome = async (entryId, newAmount) => {
    const parsedAmount = parseFloat(newAmount);
    if (isNaN(parsedAmount)) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    try {
      const data = await loadBudgetData();
      const updatedIncome = data.income.map((item) =>
        item.id === entryId ? { ...item, amount: item.amount + parsedAmount } : item
      );
      await saveBudgetData({ ...data, income: updatedIncome });
      setIncomeList(updatedIncome);
      setSelectedIncome(null);
      setDailyAmount("");
    } catch (error) {
      console.error("Failed to update income:", error);
      Alert.alert("Error", "Failed to update income. Please try again.");
    }
  };

  const handleDeleteIncome = async (entryId) => {
    try {
      const data = await loadBudgetData();
      const updatedIncome = data.income.filter((item) => item.id !== entryId);
      const updatedData = { ...data, income: updatedIncome };
      await saveBudgetData(updatedData);
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
                      onPress={() => { handleUpdateDailyIncome(selectedIncome.id, dailyamount) }}
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
