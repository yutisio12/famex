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

  const COLORS = ["#7048E8", "#BE4BDB"]; // Violet and Grape/Purple shades
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.4;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fill: '#ffffff',
          fontSize: '12px',
          fontWeight: '800',
          pointerEvents: 'none',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8), 0 0 5px rgba(0,0,0,0.5)',
        }}
      >
        {`Rp ${value.toLocaleString("id-ID")}`}
      </text >
    );
  };

  return (
    <div style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={110}
            paddingAngle={5}
            label={renderCustomLabel}
            stroke="none"
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              padding: '10px'
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => <span style={{ color: '#495057', fontWeight: 600, fontSize: '14px' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;