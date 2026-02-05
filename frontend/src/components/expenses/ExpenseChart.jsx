import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { expensesService } from '../../services/expenses';
import { useDecimal } from '../../hooks/useDecimal';

import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

const ExpenseChart = () => {
  const [chartData, setChartData] = useState([]);
  const { sumDecimals, formatDisplay, cleanDecimal } = useDecimal()

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      let data = [
        { name: "Income", value: 0 },
        { name: "Expense", value: 0 },
      ];
      const expenses = await expensesService.getAll();
      expenses.forEach(e => {
        if (e.type === 2) {
          data[0].value += cleanDecimal(e.amount);
          data[0].name = 'Income';
        } else {
          data[1].value += cleanDecimal(e.amount);
          data[1].name = 'Expense';
        }
      })
      setChartData(data)
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  const COLORS = ["#40C057", "#FA5252"];
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={16}
        fontWeight={500}
        style={{
          fill: '#ffffff',        /* warna text */
          fontSize: '12px',
          fontWeight: '600',
          pointerEvents: 'none', /* biar hover pie ga keganggu */
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
        }}
      >
        {`Rp ${value.toLocaleString("id-ID")}`}
      </text >
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart width={400} height={400}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label={renderCustomLabel}
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      {/* <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="income" stroke="#4CAF50" name="Pemasukan" />
        <Line type="monotone" dataKey="expense" stroke="#F44336" name="Pengeluaran" />
      </LineChart> */}
    </ResponsiveContainer>
  );
};

export default ExpenseChart;