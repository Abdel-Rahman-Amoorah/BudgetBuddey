import { StyleSheet } from "react-native"

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
    marginBottom: 20,
    textAlign: "center",
  },
  summaryContainer: {
    marginBottom: 30,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  incomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#27AE60",
  },
  saveingcard: {
    borderLeftWidth: 4,
    borderLeftColor: "#270060",
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#E74C3C",
  },
  balanceCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#3498DB",
  },
  summaryLabel: {
    fontSize: 16,
    color: "#7F8C8D",
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  chartsContainer: {
    marginBottom: 20,
  },
  chartCard: {
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
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 15,
    textAlign: "center",
  },
  pieChartPlaceholder: {
    alignItems: "center",
    marginBottom: 20,
  },
  pieChartCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#ECF0F1",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#BDC3C7",
  },
  chartPlaceholderText: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
  },
  chartPlaceholderSubtext: {
    fontSize: 12,
    color: "#95A5A6",
    textAlign: "center",
  },
  legend: {
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: "#2C3E50",
  },
  barChartPlaceholder: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 120,
    marginBottom: 15,
  },
  barContainer: {
    alignItems: "center",
  },
  bar: {
    width: 40,
    borderRadius: 4,
    marginBottom: 8,
  },
  incomeBar: {
    height: 80,
    backgroundColor: "#27AE60",
  },
  expenseBar: {
    height: 60,
    backgroundColor: "#E74C3C",
  },
  barLabel: {
    fontSize: 12,
    color: "#7F8C8D",
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: "#FFFFFF",
    padding: 15,
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
  headerButtonWrapper: {
    flex: 1,
    backgroundColor: "#2C3E50",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
})

export default styles