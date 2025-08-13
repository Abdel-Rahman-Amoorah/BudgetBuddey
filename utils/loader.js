import { useContext, useEffect } from "react";
import { NavContext } from "./context";
import { loadBudgetData,clearBudgetData } from "./storage";

const LoadInitialData = ({ navigation }) => {
  const { setTotalIncome, setTotalExpenses,setIncomeData,setTotalSavings } = useContext(NavContext);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadBudgetData(); // Already JSON

        console.log("Loaded Data:", data);

        if (data && data.expenses && data.income) {
          const totalIncome = data.income.reduce((sum, item) => sum + item.amount, 0);
          const totalExpenses = data.expenses.reduce((sum, item) => sum + item.amount, 0);
          setTotalSavings(data.savings.reduce((sum, item) => sum + item.currentAmount, 0))
          setIncomeData(data.income)
          setTotalIncome(totalIncome);
          setTotalExpenses(totalExpenses);
        } else {
          setTotalIncome(0);
          setTotalExpenses(0);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        setTotalIncome(0);
        setTotalExpenses(0);
      }

      navigation.navigate("Dashboard");
    };
    // clearBudgetData();
    loadData();
  }, []);

  return null; // This screen is just for loading
};

export default LoadInitialData;
