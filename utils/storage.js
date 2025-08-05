import * as FileSystem from 'expo-file-system';

const DATA_FILE = FileSystem.documentDirectory + 'budget_data.json';
// Save data to JSON file
export const saveBudgetData = async (data) => {
  try {
    await FileSystem.writeAsStringAsync(DATA_FILE, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

// Load data from JSON file
export const loadBudgetData = async () => {
  try {
    const file = await FileSystem.readAsStringAsync(DATA_FILE);
    const parsed = JSON.parse(file);
    return parsed;
  } catch (e) {
    console.log("⚠️ No valid data found, creating new structure", e);
    const defaultData = { income: [], expenses: [], savings: [] };
    await saveBudgetData(defaultData);
    return defaultData;
  }
};
