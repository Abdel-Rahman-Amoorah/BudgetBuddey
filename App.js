import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavProvider } from './utils/context';
import DashboardPage from './pages/dashboard';
import ExpensesPage from './pages/expenses';
import IncomePage from './pages/income';
import LoadInitialData from './utils/loader';
import HistoryPage from './pages/history';
import SavingsPage from './pages/savings';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name='loader' component={LoadInitialData} />
          <Stack.Screen name="Dashboard" component={DashboardPage} />
          <Stack.Screen name="Expenses" component={ExpensesPage} />
          <Stack.Screen name="Income" component={IncomePage} />
          <Stack.Screen name="History" component={HistoryPage} />
          <Stack.Screen name="Savings" component={SavingsPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavProvider>
  );
}
