import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    marginTop: 20,
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
  inputContainer: {
    marginBottom: 10,
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
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#2C3E50",
  },
  addButton: {
    backgroundColor: "#27AE60",
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
    backgroundColor: "#27AE60",
    padding: 20,
    borderRadius: 12,
    marginTop: 10,
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
  incomeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  incomeInfo: {
    flex: 1,
  },
  incomeSource: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  incomeDate: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#27AE60",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: "#FFFFFF",
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
  rowAlign: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  radioRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
    height: "50%",
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
    alignItems: "center",
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  deleteButton: {
    marginTop: 20,
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