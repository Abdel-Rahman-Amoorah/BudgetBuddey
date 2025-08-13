import { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, TouchableWithoutFeedback } from "react-native";
import styles from "../styles/savings";
import { loadBudgetData, saveBudgetData } from "../utils/storage";
import { NavContext } from "../utils/context";

const SavingsPage = ({ navigation }) => {
  const { totalSavings, setTotalSavings } = useContext(NavContext);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [addAmount, setAddAmount] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadBudgetData();
      setSavingsGoals(data.savings || []);

      // Calculate initial total savings
      const initialTotal = (data.savings || []).reduce(
        (total, goal) => total + (goal.currentAmount || 0),
        0
      );
      setTotalSavings(initialTotal);
    };
    fetchData();
  }, []);

  const categories = [
    { icon: "🚨", name: "Emergency", color: "#E74C3C" },
    { icon: "✈️", name: "Travel", color: "#3498DB" },
    { icon: "💻", name: "Electronics", color: "#27AE60" },
    { icon: "🚗", name: "Vehicle", color: "#9B59B6" },
    { icon: "🏠", name: "Home", color: "#F39C12" },
    { icon: "🎓", name: "Education", color: "#E67E22" },
    { icon: "💍", name: "Wedding", color: "#E91E63" },
    { icon: "🎯", name: "General", color: "#34495E" },
  ];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const saveToStorage = async (updatedGoals) => {
    const data = await loadBudgetData();
    const updatedData = { ...data, savings: updatedGoals };
    await saveBudgetData(updatedData);
  };

  const handleDeleteGoal = async () => {
    if (!goalToDelete) return;

    const updatedGoals = savingsGoals.filter(goal => goal.id !== goalToDelete.id);
    setSavingsGoals(updatedGoals);
    await saveToStorage(updatedGoals);

    // Update total savings in context
    const newTotal = updatedGoals.reduce(
      (total, goal) => total + (goal.currentAmount || 0),
      0
    );
    setTotalSavings(newTotal);

    setShowDeleteModal(false);
    setGoalToDelete(null);
  };

  const handleAddGoal = async () => {
    if (!goalName.trim() || !targetAmount.trim()) {
      Alert.alert("Error", "Please fill in goal name and target amount");
      return;
    }

    const amount = parseFloat(targetAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Error", "Please enter a valid target amount");
      return;
    }

    const newGoal = {
      id: Date.now(),
      goal: goalName.trim(),
      targetAmount: amount,
      deadline: deadline || "2025-12-31",
      currentAmount: 0,
      category: selectedCategory.icon,
      color: selectedCategory.color,
      completed: false,
    };

    const updatedGoals = [...savingsGoals, newGoal];
    setSavingsGoals(updatedGoals);
    await saveToStorage(updatedGoals);

    // Update total savings (though it will be 0 for new goals)
    const newTotal = updatedGoals.reduce(
      (total, goal) => total + (goal.currentAmount || 0),
      0
    );
    setTotalSavings(newTotal);

    // Reset form
    setGoalName("");
    setTargetAmount("");
    setDeadline("");
    setSelectedCategory(categories[0]);
    setShowAddGoal(false);
  };

  const handleAddMoney = async () => {
    if (!addAmount.trim()) {
      Alert.alert("Error", "Please enter an amount");
      return;
    }

    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    const updatedGoals = savingsGoals.map((goal) => {
      if (goal.id === selectedGoal.id) {
        const newAmount = goal.currentAmount + amount;
        const isCompleted = newAmount >= goal.targetAmount;

        if (isCompleted && !goal.completed) {
          Alert.alert("🎉 Congratulations!", `You've reached your ${goal.goal} goal!`);
        }

        return {
          ...goal,
          currentAmount: Math.min(newAmount, goal.targetAmount),
          completed: isCompleted,
        };
      }
      return goal;
    });

    setSavingsGoals(updatedGoals);
    await saveToStorage(updatedGoals);

    // Update total savings in context
    const newTotal = updatedGoals.reduce(
      (total, goal) => total + (goal.currentAmount || 0),
      0
    );
    setTotalSavings(newTotal);

    setAddAmount("");
    setShowAddMoney(false);
    setSelectedGoal(null);
  };

  const getCompletedGoals = () => savingsGoals.filter((goal) => goal.completed).length;
  const getProgressPercentage = (goal) => Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const activeGoals = savingsGoals.filter((goal) => !goal.completed);
  const completedGoals = savingsGoals.filter((goal) => goal.completed);

  return (
    <ScrollView style={styles.container}>
      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, styles.totalSavingsCard]}>
          <Text style={styles.summaryLabel}>Total Savings</Text>
          <Text style={styles.summaryAmount}>{totalSavings} JD</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.halfCard, styles.goalsCard]}>
            <Text style={styles.summaryLabel}>Active Goals</Text>
            <Text style={styles.summaryAmount}>{activeGoals.length}</Text>
          </View>

          <View style={[styles.summaryCard, styles.halfCard, styles.completedCard]}>
            <Text style={styles.summaryLabel}>Completed</Text>
            <Text style={styles.summaryAmount}>{getCompletedGoals()}</Text>
          </View>
        </View>
      </View>

      {/* Add New Goal Button */}
      <TouchableOpacity style={styles.addGoalButton} onPress={() => setShowAddGoal(true)}>
        <Text style={styles.addGoalButtonText}>+ Add New Savings Goal</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Active Goals</Text>
      {/* Active Goals */}
      {activeGoals.length > 0 ? (
        <View style={styles.goalsSection}>
          {activeGoals.map((goal) => (
            <View key={goal.id} style={styles.goalCard}>
              <TouchableOpacity style={styles.goalHeader} onLongPress={() => { setGoalToDelete(goal); setShowDeleteModal(true); }}>
                <View style={styles.goalInfo} >
                  <Text style={styles.goalIcon}>{goal.category}</Text>
                  <View style={styles.goalDetails}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.goalDeadline}>Target: {formatDate(goal.deadline)}</Text>
                    <Text style={styles.goalDays}>
                      {getDaysRemaining(goal.deadline) > 0 ? `${getDaysRemaining(goal.deadline)} days left` : "Overdue"}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.addMoneyButton}
                  onPress={() => {
                    setSelectedGoal(goal)
                    setShowAddMoney(true)
                  }}
                >
                  <Text style={styles.addMoneyButtonText}>+ Add</Text>
                </TouchableOpacity>
              </TouchableOpacity>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${getProgressPercentage(goal)}%`, backgroundColor: goal.color },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{getProgressPercentage(goal).toFixed(0)}%</Text>
              </View>

              <View style={styles.goalAmounts}>
                <Text style={styles.currentAmount}>{goal.currentAmount.toFixed(2)} JD</Text>
                <Text style={styles.targetAmount}>of {goal.targetAmount.toFixed(2)} JD</Text>
              </View>
            </View>
          ))}
        </View>
      )
        : (
          <View style={styles.listContainer}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No Active Goals</Text>
              <Text style={styles.emptyStateSubtext}>Add a new goal to get started</Text>
            </View>
          </View>
        )}
      <Text style={styles.sectionTitle}>🎉 Completed Goals</Text>

      {/* Completed Goals */}
      {completedGoals.length > 0 ? (
        <View style={styles.goalsSection}>
          {completedGoals.map((goal) => (
            <View key={goal.id} style={[styles.goalCard, styles.completedGoalCard]}>
              <TouchableOpacity style={styles.goalHeader} onLongPress={() => { setGoalToDelete(goal); setShowDeleteModal(true); }}>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalIcon}>{goal.category}</Text>
                  <View style={styles.goalDetails}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.completedText}>✅ Goal Achieved!</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: "100%", backgroundColor: "#27AE60" }]} />
                </View>
                <Text style={styles.progressText}>100%</Text>
              </View>

              <View style={styles.goalAmounts}>
                <Text style={styles.currentAmount}>{goal.targetAmount.toFixed(2)} JD</Text>
                <Text style={styles.targetAmount}>Target Reached!</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.listContainer}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No Completed Savings Goals</Text>
            <Text style={styles.emptyStateSubtext}>Try completing some!</Text>
          </View>
        </View>
      )}

      {/* Add Goal Modal */}
      <Modal
        visible={showAddGoal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddGoal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Savings Goal</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Goal Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Emergency Fund, Vacation"
                value={goalName}
                onChangeText={setGoalName}
                placeholderTextColor="#95A5A6"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Target Amount (JD)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0.00"
                value={targetAmount}
                onChangeText={setTargetAmount}
                keyboardType="numeric"
                placeholderTextColor="#95A5A6"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Target Date (Optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="YYYY-MM-DD"
                value={deadline}
                onChangeText={setDeadline}
                placeholderTextColor="#95A5A6"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoriesGrid}>
                {categories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.categoryItem,
                      selectedCategory.name === category.name && styles.selectedCategory,
                      { borderColor: category.color },
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddGoal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddGoal}>
                <Text style={styles.saveButtonText}>Create Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Money Modal */}
      <Modal
        visible={showAddMoney}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddMoney(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Money to Goal</Text>
            {selectedGoal && (
              <View style={styles.selectedGoalInfo}>
                <Text style={styles.selectedGoalName}>
                  {selectedGoal.category} {selectedGoal.name}
                </Text>
                <Text style={styles.selectedGoalProgress}>
                  {selectedGoal.currentAmount.toFixed(2)} / {selectedGoal.targetAmount.toFixed(2)} JD
                </Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Amount to Add (JD)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0.00"
                value={addAmount}
                onChangeText={setAddAmount}
                keyboardType="numeric"
                placeholderTextColor="#95A5A6"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddMoney(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddMoney}>
                <Text style={styles.saveButtonText}>Add Money</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButtonWrapper} onPress={() => navigation.navigate("Income")}>
          <Text style={styles.footerButtonText}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButtonWrapper} onPress={() => navigation.navigate("Dashboard")}>
          <Text style={styles.footerButtonText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButtonWrapper} onPress={() => navigation.navigate("Expenses")}>
          <Text style={styles.footerButtonText}>Expenses</Text>
        </TouchableOpacity>
      </View>
      {/* Delete Goal Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Goal</Text>
            {goalToDelete && (
              <Text style={{ marginVertical: 10 }}>
                Are you sure you want to delete "{goalToDelete.goal}"?
              </Text>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleDeleteGoal}
              >
                <Text style={styles.saveButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>

  )
};

export default SavingsPage;