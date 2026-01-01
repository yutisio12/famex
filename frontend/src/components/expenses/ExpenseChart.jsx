import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { expensesService } from '../../services/expenses';
import { useDecimal } from '../../hooks/useDecimal';

const ExpenseChart = () => {
  const [chartData, setChartData] = useState([]);
  const { sumDecimals, formatDisplay, cleanDecimal } = useDecimal()

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      const expenses = await expensesService.getAll();

      // Group by date (simplified example)
      const groupedData = expenses.reduce((acc, expense) => {
        const date = new Date(expense.expense_date).toLocaleDateString('id-ID');
        if (!acc[date]) {
          acc[date] = { date, income: 0, expense: 0 };
        }

        const cleanAmount = cleanDecimal(expense.amount);

        if (expense.type === 2) {
          acc[date].income += cleanAmount;
        } else {
          acc[date].expense += cleanAmount;
        }

        return acc;
      }, {});

      setChartData(Object.values(groupedData).slice(-7)); // Last 7 days
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="income" stroke="#4CAF50" name="Pemasukan" />
        <Line type="monotone" dataKey="expense" stroke="#F44336" name="Pengeluaran" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ExpenseChart;