import { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { NavContext } from "../utils/context";
import { Expense } from "../Models/budgetentry";
import { loadBudgetData, saveBudgetData } from "../utils/storage";
import styles from "../styles/expenses";

const ExpensesPage = ({ navigation }) => {
  const { setTotalExpenses, totalExpenses } = useContext(NavContext);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedExpense, setSelectedExpense] = useState(null);
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

  // Load expenses on mount
  useEffect(() => {
    const fetchExpenses = async () => {
      const data = await loadBudgetData();
      setExpensesList(data.expenses ?? []);
    };
    fetchExpenses();
  }, []);

  // Calculate total monthly expenses and update context
  useEffect(() => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyExpenses = expensesList.filter((exp) =>
      exp.date.startsWith(currentMonth)
    );
    const total = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    setTotalExpenses(total);
  }, [expensesList, setTotalExpenses]);

  // Reset form fields helper
  const resetForm = () => {
    setSelectedCategory(null);
    setDescription("");
    setPrice("");
    setEditMode(false);
    setSelectedExpense(null);
  };

  // Add new expense
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
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert("Error", "Please enter a valid positive number");
      return;
    }

    try {
      const dateStr = new Date().toISOString().split("T")[0];
      const monthKey = dateStr.slice(0, 7); // YYYY-MM

      const newExpense = new Expense(
        Date.now(),
        parsed,
        description.trim() || selectedCategory.name,
        dateStr,
        selectedCategory.name,
        "expense"
      );

      const data = await loadBudgetData();
      console.log("Data before adding:", data);

      if (!Array.isArray(data.expenses)) {
        data.expenses = [];
      }
      data.expenses.push(newExpense);

      if (!data.monthlyRecords[monthKey]) {
        data.monthlyRecords[monthKey] = { income: 0, expenses: 0, savings: 0 };
      }
      data.monthlyRecords[monthKey].expenses += parsed;


      await saveBudgetData(data);
      console.log("Data after saving:", data);

      setExpensesList(data.expenses);
      resetForm();
    } catch (err) {
      console.error("Error adding expense:", err);
      Alert.alert("Error", "Failed to add expense. See console for details.");
    }
  };

  // Update existing expense
  const handleUpdateExpense = async () => {
    if (!selectedExpense) return;

    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    if (!price.trim()) {
      Alert.alert("Error", "Please enter an amount");
      return;
    }

    const parsed = parseFloat(price);
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert("Error", "Please enter a valid positive number");
      return;
    }

    const data = await loadBudgetData();
    const dateStr = selectedExpense.date;
    const monthKey = dateStr.slice(0, 7);

    // Find the old expense from flat list
    const oldExpense = data.expenses.find((e) => e.id === selectedExpense.id);
    if (!oldExpense) {
      Alert.alert("Error", "Original expense not found");
      return;
    }

    // Update the flat list with new expense data
    data.expenses = data.expenses.map((item) =>
      item.id === selectedExpense.id
        ? {
          ...item,
          amount: parsed,
          description: description.trim() || selectedCategory.name,
          category: selectedCategory.name,
        }
        : item
    );

    // Update monthly total: subtract old amount, add new amount
    if (!data.monthlyRecords[monthKey]) {
      data.monthlyRecords[monthKey] = { income: 0, expenses: 0, savings: 0 };
    }

    data.monthlyRecords[monthKey].expenses =
      (data.monthlyRecords[monthKey].expenses || 0) - oldExpense.amount + parsed;

    // Prevent negative totals
    if (data.monthlyRecords[monthKey].expenses < 0) {
      data.monthlyRecords[monthKey].expenses = 0;
    }

    await saveBudgetData(data);

    setExpensesList(data.expenses);
    resetForm();
  };

  const handleDeleteExpense = async (entryId) => {
    try {
      const data = await loadBudgetData();

      // Remove from flat list
      data.expenses = data.expenses.filter((item) => item.id !== entryId);

      // Remove from monthlyRecords
      for (const monthKey in data.monthlyRecords) {
        data.monthlyRecords[monthKey].expenses = data.monthlyRecords[
          monthKey
        ].expenses.filter((item) => item.id !== entryId);
      }

      await saveBudgetData(data);
      setExpensesList(data.expenses);
      resetForm();
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  // When selecting an expense from the list: populate form for editing
  const onSelectExpense = (expense) => {
    setSelectedExpense(expense);
    setSelectedCategory(categories.find((c) => c.name === expense.category));
    setDescription(expense.description);
    setPrice(expense.amount.toString());
    setEditMode(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add / Edit Expense</Text>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Select Category</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryItem,
                selectedCategory?.name === category.name &&
                styles.selectedCategory,
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

        {!editMode && !selectedExpense && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
            <Text style={styles.addButtonText}>Add Expense</Text>
          </TouchableOpacity>
        )}

        {selectedExpense && !editMode && (
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity
              style={[styles.addButton, { flex: 1, marginRight: 5 }]}
              onPress={() => setEditMode(true)}
            >
              <Text style={styles.addButtonText}>Edit Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deleteButton, { flex: 1, marginLeft: 5 }]}
              onPress={() => {
                Alert.alert(
                  "Confirm Delete",
                  "Are you sure you want to delete this expense?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => handleDeleteExpense(selectedExpense.id),
                    },
                  ]
                );
              }}
            >
              <Text style={[styles.addButtonText, { color: "white" }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedExpense && editMode && (
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity
              style={[styles.addButton, { flex: 1, marginRight: 5 }]}
              onPress={handleUpdateExpense}
            >
              <Text style={styles.addButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deleteButton, { flex: 1, marginLeft: 5 }]}
              onPress={() => {
                setEditMode(false);
                resetForm();
              }}
            >
              <Text style={[styles.addButtonText, { color: "white" }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Monthly Expenses</Text>
        <Text style={styles.summaryAmount}>
          {setTotalExpenses ? totalExpenses.toFixed(2) : "0.00"} JD
        </Text>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Recent Expenses</Text>
        {expensesList.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No expenses yet</Text>
            <Text style={styles.emptyStateSubtext}>Add your first expense above</Text>
          </View>
        ) : (
          expensesList
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((expense) => {
              const icon =
                categories.find((cat) => cat.name === expense.category)?.icon || "❓";
              return (
                <TouchableOpacity
                  key={expense.id}
                  onPress={() => onSelectExpense(expense)}
                >
                  <View style={styles.expenseItem}>
                    <View style={styles.expenseIcon}>
                      <Text style={styles.expenseIconText}>{icon}</Text>
                    </View>
                    <View style={styles.expenseInfo}>
                      <Text style={styles.expenseDescription}>{expense.description}</Text>
                      <Text style={styles.expenseDate}>{expense.date}</Text>
                    </View>
                    <Text style={styles.expenseAmount}>
                      -{expense.amount.toFixed(2)} JD
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButtonWrapper}
          onPress={() => navigation.navigate("Income")}
        >
          <Text style={styles.footerButtonText}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButtonWrapper}
          onPress={() => navigation.navigate("Savings")}
        >
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
