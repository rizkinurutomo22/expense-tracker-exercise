import express from "express";

import expenseRoutes from "./routes/expense-routes.js";

const app = express();
const PORT = 8000;

app.use(express.json());

app.use("/api/v1/expenses", expenseRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
