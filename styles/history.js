import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
    textAlign: "center",
  },
  monthSelector: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  monthSelectorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  monthSelectorArrow: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  incomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#27AE60",
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#E74C3C",
  },
  positiveBalanceCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#3498DB",
  },
  negativeBalanceCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#F39C12",
  },
  summaryLabel: {
    fontSize: 16,
    color: "#7F8C8D",
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  historyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 15,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#7F8C8D",
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#95A5A6",
  },
  transactionsList: {
    marginTop: 10,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  incomeIcon: {
    backgroundColor: "#E8F5E8",
  },
  expenseIcon: {
    backgroundColor: "#FDEAEA",
  },
  transactionIconText: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  incomeAmount: {
    color: "#27AE60",
  },
  expenseAmount: {
    color: "#E74C3C",
  },
  transactionTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  incomeBadge: {
    backgroundColor: "#E8F5E8",
  },
  expenseBadge: {
    backgroundColor: "#FDEAEA",
  },
  transactionTypeBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#2C3E50",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 15,
    textAlign: "center",
  },
  monthsList: {
    maxHeight: 300,
  },
  monthOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  selectedMonthOption: {
    backgroundColor: "#E8F5E8",
  },
  monthOptionText: {
    fontSize: 16,
    color: "#2C3E50",
  },
  selectedMonthOptionText: {
    fontWeight: "bold",
    color: "#27AE60",
  },
  modalCloseButton: {
    backgroundColor: "#3498DB",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  modalCloseButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default styles;