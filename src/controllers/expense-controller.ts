import { Response, Request } from "express";

import fs from "fs/promises";

const filePath = "./src/data/expenses.json";

async function getExpenses() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
  }
}

export async function getAllExpenses(req: Request, res: Response) {
  try {
    const expenses = await getExpenses();
    res
      .status(200)
      .json({ message: "Success, getting all expensess", expenses });
  } catch (error) {
    console.error(error);
  }
}

export async function getSingleExpense(req: Request, res: Response) {
  try {
    const expenses = await getExpenses();
    const expense = expenses.find(
      (expense: { id: number }) => expense.id === Number(req.params.id)
    );

    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ expense });
  } catch (error) {
    console.error(error);
  }
}

export async function createExpense(req: Request, res: Response) {
  try {
    const { name, nominal, category, date } = req.body;

    if (!name && !nominal && !category) {
      res.status(400).json({ message: "Required fields is missing" });
    } else {
      const expenses = await getExpenses();
      let maxId = expenses.reduce(
        (max: number, expense: any) => (expense.id > max ? expense.id : max),
        0
      );

      const newExpense = { id: maxId + 1, name, nominal, category, date };
      expenses.push(newExpense);
      await fs.writeFile(filePath, JSON.stringify(expenses, null, 2));
      res
        .status(201)
        .json({ message: "Success adding new expense", newExpense });
    }
  } catch (error) {
    console.error(error);
  }
}

export async function updateExpense(req: Request, res: Response) {
  try {
    const expenses = await getExpenses();
    const expenseIndex = expenses.findIndex(
      (expense: { id: number }) => expense.id === Number(req.params.id)
    );
    const expense = expenses[expenseIndex];

    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
    } else {
      expenses[expenseIndex] = { ...expense, ...req.body };
      await fs.writeFile(filePath, JSON.stringify(expenses, null, 2));
      res.status(200).json({
        message: "Update succesfull",
        expense: expenses[expenseIndex],
      });
    }
  } catch (error) {
    console.error(error);
  }
}

export async function deleteExpense(req: Request, res: Response) {
  try {
    const expenses = await getExpenses();
    const expenseIndex = expenses.findIndex(
      (expense: { id: number }) => expense.id === Number(req.params.id)
    );

    if (expenseIndex === -1) {
      res.status(404).json({ message: "Expense not found" });
    } else {
      expenses.splice(expenseIndex, 1);
      await fs.writeFile(filePath, JSON.stringify(expenses, null));
      res.status(200).json({ message: "Delete successfull" });
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getTotalExpenseByDate(req: Request, res: Response) {
  try {
    const expenses = await getExpenses();
    const { startDate, endDate } = req.params;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      !expenses.some((obj: any) => obj.date === startDate) ||
      !expenses.some((obj: any) => obj.date === endDate)
    ) {
      return res.status(404).json({ error: "Date not found" });
    } else if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const filteredExpenses = expenses.filter((expense: any) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });

    const totalExpenses = filteredExpenses.reduce(
      (total: number, expense: any) => (total += expense.nominal),
      0
    );
    res.status(200).json({
      message: "Succes",
      totalExpenses,
      start: startDate,
      end: endDate,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getTotalExpenseByCategory(req: Request, res: Response) {
  try {
    const expenses = await getExpenses();
    const { category } = req.params;

    if (!expenses.some((obj: any) => obj.category === category)) {
      return res.status(404).json({ error: "Expenses Not Found" });
    }

    const filteredExpenses = expenses.filter((expense: any) => {
      return expense.category === category;
    });

    const totalExpenses = filteredExpenses.reduce(
      (total: number, expense: any) => (total += expense.nominal),
      0
    );
    res.status(200).json({
      message: "Succes",
      totalExpenses,
    });
  } catch (error) {
    console.error(error);
  }
}
