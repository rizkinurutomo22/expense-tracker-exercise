import Express from "express";

import {
  getAllExpenses,
  getSingleExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getTotalExpenseByDate,
  getTotalExpenseByCategory,
} from "../controllers/expense-controller.js";

const router = Express.Router();

router.route("/").get(getAllExpenses).post(createExpense);
router
  .route("/:id")
  .get(getSingleExpense)
  .put(updateExpense)
  .delete(deleteExpense);
router.route("/:startDate/:endDate").get(getTotalExpenseByDate);
router.route("/category/category/:category").get(getTotalExpenseByCategory);

export default router;
