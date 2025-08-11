import { createContext, useState } from "react";

export const NavContext = createContext();
export const NavProvider = ({ children }) => {
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalSavings, setTotalSavings] = useState(0);
    const [incomeData, setIncomeData] = useState([]);
  return (
    <NavContext.Provider value={{
        totalIncome,
        setTotalIncome,
        totalExpenses,
        setTotalExpenses,
        totalSavings,
        setTotalSavings,
        incomeData,
        setIncomeData
    }}>
      {children}
    </NavContext.Provider>
  );
}