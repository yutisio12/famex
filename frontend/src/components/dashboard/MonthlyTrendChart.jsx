import React from 'react';
import { Card, Title, Text } from '@mantine/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyTrendChart = ({ data }) => (
  <Card shadow="sm" p="lg" radius="md" withBorder>
    <Title order={3} mb="md">Tren Bulanan</Title>
    {data && data.length > 0 ? (
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(v) => {
                if (v >= 1000000) return `${(v / 1000000).toFixed(1)}jt`;
                if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
                return v;
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, undefined]}
              contentStyle={{
                borderRadius: 12,
                border: 'none',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                padding: '10px'
              }}
            />
            <Legend />
            <Bar dataKey="Income" fill="#40C057" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expense" fill="#FA5252" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <Text color="dimmed" align="center" py="xl">Belum ada data transaksi</Text>
    )}
  </Card>
);

export default MonthlyTrendChart;
