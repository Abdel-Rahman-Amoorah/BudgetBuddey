// Income Entry
export class Income {
    constructor(id, amount, source, startDate, recurring = false, frequency = null,) {
        this.id = id;                 // unique identifier
        this.amount = amount;
        this.source = source;           // e.g., "Salary", "Freelance"
        this.startDate = startDate;     // e.g., "2025-08-01"
        this.recurring = recurring;     // true or false
        this.frequency = frequency;     // Daily, Weekly, Monthly, null for one-time income
    }
}

// Expense Entry
export class Expense {
    constructor(id, amount, source, date, category) {
        this.id = id;                 // unique identifier
        this.amount = amount;
        this.source = source;           // e.g., "Groceries", "Gas"
        this.date = date;               // e.g., "2025-08-03"
        this.category = category;       // e.g., "Food", "Transport"
    }
}

// Saving Entry
export class Saving {
    constructor(id, amount, goal, deadline, targetAmount = null, goalStatus) {
        this.id = id;                 // unique identifier
        this.amount = amount;           // how much saved
        this.goal = goal;               // e.g., "Emergency Fund", "Vacation"
        this.deadline = deadline;       // e.g., "2025-12-31"
        this.targetAmount = targetAmount; // optional goal target    
        this.goalStatus = goalStatus || false;   // true if goal is met, false otherwise
        this.currentAmount = currentAmount || 0;
        this.category = category || "🎯";
        this.color = color || "#34495E";
    }
}
