import Expense from "../models/Expense.js";

export const createExpense = async (data) => {
    const expense = await Expense.create({ ...data });
    return expense;
}

export const getExpensesByFilter = async (filter) => {
    const expenses = await Expense.find(filter);
    return expenses;
}

export const getExpensesDetailsByFilter = async (filter) => {
    const expenses = await Expense.find(filter).populate("driverId").exec();;
    return expenses;
}

export const updateExpenseByFilter = async (filter, data, updatedDocCondition) => {
    const expense = await Expense.findOneAndUpdate(filter, data, updatedDocCondition);
    return expense;
}

export const deleteExpenseByFilter = async (filter) => {
    const expense = await Expense.findOneAndDelete(filter);
    return expense;
}
