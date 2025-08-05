import { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, TouchableWithoutFeedback } from "react-native";
import { NavContext } from "../utils/context";
import { Expense } from "../Models/budgetentry";
import { loadBudgetData, saveBudgetData } from "../utils/storage";
import styles from "../styles/expenses";

const ExpensesPage = ({ navigation }) => {
  const { setTotalExpenses, totalExpenses } = useContext(NavContext);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [SelectExpense, setSelectExpense] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [price, setPrice] = useState("");
  const [expensesList, setExpensesList] = useState([]);

  const categories = [
    { icon: "🛒", name: "Food", color: "#FF6B6B" },
    { icon: "🚗", name: "Transport", color: "#4ECDC4" },
    { icon: "🏠", name: "Rent", color: "#45B7D1" },
    { icon: "📱", name: "Phone", color: "#96CEB4" },
    { icon: "👕", name: "Clothing", color: "#FECA57" },
    { icon: "🎬", name: "Entertainment", color: "#FF9FF3" },
    { icon: "💊", name: "Health", color: "#54A0FF" },
    { icon: "📚", name: "Education", color: "#5F27CD" },
  ];

  useEffect(() => {
    const fetchExpenses = async () => {
      const data = await loadBudgetData();
      setExpensesList(data.expenses ?? []);
    };
    fetchExpenses();
  }, []);

  useEffect(() => {
    const total = expensesList.reduce((sum, exp) => sum + exp.amount, 0);
    setTotalExpenses(total);
  }, [expensesList]);

  const handleAddExpense = async () => {
    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    if (!price.trim()) {
      Alert.alert("Error", "Please enter an amount");
      return;
    }

    const parsed = parseFloat(price);
    if (isNaN(parsed)) {
      Alert.alert("Error", "Please enter a valid number");
      return;
    }

    const newExpense = new Expense(
      Date.now(),
      parsed,
      description.trim() || selectedCategory.name,
      new Date().toISOString().split("T")[0],
      selectedCategory.name,
      "expense"
    );

    const data = await loadBudgetData();
    data.expenses.push(newExpense);
    await saveBudgetData(data);

    setExpensesList(data.expenses); // Sync UI
    setSelectedCategory(null);
    setDescription("");
    setPrice("");
  };
  const handleDeleteExpense = async (entryId) => {
    try {
      const data = await loadBudgetData();
      const updatedExpenses = data.expenses.filter((item) => item.id !== entryId);
      data.expenses = updatedExpenses;
      await saveBudgetData(data);
      setExpensesList(updatedExpenses);
      setSelectExpense(null);
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Expense</Text>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Select Category</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryItem,
                selectedCategory?.name === category.name && styles.selectedCategory,
                { borderColor: category.color },
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Groceries, Gas, Coffee"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#95A5A6"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount (JD)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="0.00"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholderTextColor="#95A5A6"
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Monthly Expenses</Text>
        <Text style={styles.summaryAmount}>{totalExpenses.toFixed(2)} JD</Text>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Recent Expenses</Text>
        {expensesList.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No expenses yet</Text>
            <Text style={styles.emptyStateSubtext}>Add your first expense above</Text>
          </View>
        ) : (
          expensesList.map((expense) => {
            const icon = categories.find(cat => cat.name === expense.category)?.icon || "❓";
            return (
              <TouchableOpacity key={expense.id} onPress={() => setSelectExpense(expense)}>
                <View key={expense.id} style={styles.expenseItem}>
                  <View style={styles.expenseIcon}>
                    <Text style={styles.expenseIconText}>{icon}</Text>
                  </View>
                  <View style={styles.expenseInfo}>
                    <Text style={styles.expenseDescription}>{expense.description}</Text>
                    <Text style={styles.expenseDate}>{expense.date}</Text>
                  </View>
                  <Text style={styles.expenseAmount}>-{expense.amount.toFixed(2)} JD</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={SelectExpense !== null}
        onRequestClose={() => {
          setSelectExpense(null);
          setEditMode(!editMode);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setSelectExpense(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Income: {SelectExpense?.source}</Text>

                <TouchableOpacity style={styles.modalButton} onPress={() => {
                  setEditMode(!editMode)
                }}>
                  <Text style={styles.modalButtonText}>{editMode ? "Just Delete it" : "Edit Entry"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.modalButton, styles.deleteButton]} onPress={() => {
                  setSelectExpense(null)
                  handleDeleteExpense(SelectExpense.id)
                }}>
                  <Text style={styles.modalButtonText}>Delete Entry</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSelectExpense(null)}>
                  <Text style={styles.ModalcloseButton}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButtonWrapper}
          onPress={() => navigation.navigate("Income")}
        >
          <Text style={styles.footerButtonText}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButtonWrapper} onPress={() => navigation.navigate("Savings")}>
          <Text style={styles.footerButtonText}>Savings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButtonWrapper}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text style={styles.footerButtonText}>Dashboard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ExpensesPage;
