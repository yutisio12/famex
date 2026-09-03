import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Card, SimpleGrid, Skeleton } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useAuth } from '../context/AuthContext';
import { expensesService } from '../services/expenses';
import { useDecimal } from '../hooks/useDecimal';
import ExpenseForm from '../components/expenses/ExpenseForm';

import DashboardCards from '../components/dashboard/DashboardCards';
import MonthlyTrendChart from '../components/dashboard/MonthlyTrendChart';
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import QuickActions from '../components/dashboard/QuickActions';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    expenses: [],
    categories: [],
    recentTransactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { fullName } = useAuth();
  const { sumDecimals, cleanDecimal } = useDecimal();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [expenses, recentResponse, categories] = await Promise.all([
        expensesService.getAll(),
        expensesService.getDataTable({ page: 1, limit: 8, sort: 'id,DESC' }),
        expensesService.category(),
      ]);
      setDashboardData({
        expenses,
        categories,
        recentTransactions: recentResponse.data || [],
      });
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to load!',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const { expenses, categories, recentTransactions } = dashboardData;

  const isInMonth = (expense, month, year) => {
    const d = new Date(expense.expense_date);
    return d.getMonth() === month && d.getFullYear() === year;
  };

  const computed = useMemo(() => {
    if (!expenses.length) {
      return {
        balance: 0,
        thisMonthIncome: 0,
        thisMonthExpense: 0,
        lastMonthIncome: 0,
        lastMonthExpense: 0,
        savingsRate: 0,
        monthlyTrend: [],
        categoryBreakdown: [],
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const lastMonth = lastMonthDate.getMonth();
    const lastMonthYear = lastMonthDate.getFullYear();

    const totalIncome = sumDecimals(expenses.filter(e => e.type === 2).map(e => e.amount));
    const totalExpense = sumDecimals(expenses.filter(e => e.type === 1).map(e => e.amount));

    const thisMonthIncome = sumDecimals(
      expenses.filter(e => e.type === 2 && isInMonth(e, currentMonth, currentYear)).map(e => e.amount)
    );
    const thisMonthExpense = sumDecimals(
      expenses.filter(e => e.type === 1 && isInMonth(e, currentMonth, currentYear)).map(e => e.amount)
    );

    const lastMonthIncome = sumDecimals(
      expenses.filter(e => e.type === 2 && isInMonth(e, lastMonth, lastMonthYear)).map(e => e.amount)
    );
    const lastMonthExpense = sumDecimals(
      expenses.filter(e => e.type === 1 && isInMonth(e, lastMonth, lastMonthYear)).map(e => e.amount)
    );

    const savingsRate = thisMonthIncome > 0
      ? ((thisMonthIncome - thisMonthExpense) / thisMonthIncome * 100).toFixed(1)
      : 0;

    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      const label = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
      const income = sumDecimals(
        expenses.filter(e => e.type === 2 && isInMonth(e, m, y)).map(e => e.amount)
      );
      const expense = sumDecimals(
        expenses.filter(e => e.type === 1 && isInMonth(e, m, y)).map(e => e.amount)
      );
      monthlyTrend.push({ month: label, Income: income, Expense: expense });
    }

    const categoryMap = {};
    expenses.filter(e => e.type === 1).forEach(e => {
      const catId = e.category_id || 'none';
      if (!categoryMap[catId]) categoryMap[catId] = 0;
      categoryMap[catId] += cleanDecimal(e.amount);
    });

    const categoryBreakdown = Object.entries(categoryMap)
      .map(([catId, total]) => {
        const cat = categories.find(c => c.id === parseInt(catId));
        return {
          name: cat?.name || (catId === 'none' ? 'Tanpa Kategori' : `Kategori ${catId}`),
          total,
          percentage: totalExpense > 0 ? (total / totalExpense * 100).toFixed(1) : 0,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);

    return {
      balance: totalIncome - totalExpense,
      thisMonthIncome,
      thisMonthExpense,
      lastMonthIncome,
      lastMonthExpense,
      savingsRate,
      monthlyTrend,
      categoryBreakdown,
    };
  }, [expenses, categories, sumDecimals, cleanDecimal]);

  if (loading) {
    return (
      <div>
        <Skeleton height={40} width={200} mb="xl" />
        <SimpleGrid
          cols={4}
          spacing="md"
          breakpoints={[
            { maxWidth: 'sm', cols: 1 },
            { maxWidth: 'md', cols: 2 },
          ]}
          mb="xl"
        >
          {[1, 2, 3, 4].map(i => (
            <Card key={i} shadow="sm" p="lg" radius="md" withBorder>
              <Skeleton height={16} width={80} mb="sm" />
              <Skeleton height={28} width={120} mb="xs" />
              <Skeleton height={12} width={100} />
            </Card>
          ))}
        </SimpleGrid>
        <SimpleGrid cols={2} spacing="md" breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
          <Skeleton height={300} />
          <Skeleton height={300} />
        </SimpleGrid>
      </div>
    );
  }

  return (
    <div>
      <QuickActions
        fullName={fullName}
        onAddTransaction={() => setAddModalOpen(true)}
        onRefresh={loadDashboardData}
        loading={loading}
      />

      <DashboardCards
        balance={computed.balance}
        thisMonthIncome={computed.thisMonthIncome}
        thisMonthExpense={computed.thisMonthExpense}
        savingsRate={computed.savingsRate}
        incomeTrend={{ currentVal: computed.thisMonthIncome, previousVal: computed.lastMonthIncome }}
        expenseTrend={{ currentVal: computed.thisMonthExpense, previousVal: computed.lastMonthExpense }}
      />

      <SimpleGrid
        cols={2}
        spacing="md"
        breakpoints={[{ maxWidth: 'md', cols: 1 }]}
        mt="xl"
      >
        <MonthlyTrendChart data={computed.monthlyTrend} />
        <CategoryBreakdown data={computed.categoryBreakdown} />
      </SimpleGrid>

      <div style={{ marginTop: 16 }}>
        <RecentTransactions transactions={recentTransactions} />
      </div>

      <Modal
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Tambah Transaksi Baru"
        size="lg"
      >
        <ExpenseForm onSuccess={() => {
          setAddModalOpen(false);
          loadDashboardData();
        }} />
      </Modal>
    </div>
  );
};

export default Dashboard;
