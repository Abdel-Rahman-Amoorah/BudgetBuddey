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
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 15,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryItem: {
    width: "22%",
    aspectRatio: 1,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  selectedCategory: {
    backgroundColor: "#E8F5E8",
    borderWidth: 3,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 10,
    color: "#2C3E50",
    textAlign: "center",
    fontWeight: "500",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0E6ED",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#2C3E50",
  },
  addButton: {
    backgroundColor: "#E74C3C",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  summaryCard: {
    backgroundColor: "#E74C3C",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  listContainer: {
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
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 15,
  },
  emptyState: {
    alignItems: "center",
    padding: 30,
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
  expenseItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  expenseIconText: {
    fontSize: 18,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E74C3C",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: "#FFFFFF",
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  footerButtonWrapper: {
    flex: 1,
    backgroundColor: "#2C3E50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  footerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    width: 20,
    height: 100,
    padding: 20,

    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "40%",
    borderColor: "#000000", // Add your desired color here
    borderWidth: 1
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  modalButton: {
    backgroundColor: "#3498DB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  deleteButton: {
    backgroundColor: "#E74C3C",
  },

  ModalcloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#95A5A6",
    borderRadius: 8,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
})

export default styles