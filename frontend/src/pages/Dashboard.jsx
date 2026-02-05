import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  Text,
  Group,
  RingProgress,
  SimpleGrid,
  Title,
  Button
} from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight, IconRefresh } from '@tabler/icons-react';
import { useAuth } from '../context/AuthContext';
import { expensesService } from '../services/expenses';
import ExpenseChart from '../components/expenses/ExpenseChart';
import { useDecimal } from '../hooks/useDecimal';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { sumDecimals, formatDisplay, cleanDecimal } = useDecimal()

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // console.log('Loading dashboard data...');
      setLoading(true);

      // Test API connection
      const expenses = await expensesService.getAll();
      // console.log('Expenses data:', expenses);

      const incomeTransactions = expenses.filter(e => e.type === 2)
      const expenseTransactions = expenses.filter(e => e.type === 1)

      const totalIncome = sumDecimals(incomeTransactions.map(e => e.amount))
      const totalExpenses = sumDecimals(expenseTransactions.map(e => e.amount))

      setStats({
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        recentTransactions: expenses.slice(0, 5)
      });

    } catch (error) {
      // console.error('Error loading dashboard data:', error);
      // Set dummy data untuk testing
      setStats({
        totalIncome: 1000000,
        totalExpenses: 500000,
        balance: 500000,
        recentTransactions: [
          { id: 1, description: 'Test Income', amount: 1000000, type: 'income', expense_date: new Date() },
          { id: 2, description: 'Test Expense', amount: 500000, type: 'expense', expense_date: new Date() }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text size="xl">Loading dashboard...</Text>
      </div>
    );
  }

  return (
    <div>
      <Group position="apart" mb="xl">
        <Title order={1}>Dashboard</Title>
        <Button
          leftIcon={<IconRefresh size="1rem" />}
          onClick={loadDashboardData}
          loading={loading}
        >
          Refresh
        </Button>
      </Group>

      <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'md', cols: 1 }]} mb="xl">
        <Card shadow="sm" p="lg" radius="md">
          <Group position="apart">
            <div>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Total Income
              </Text>
              <Text size="xl" weight={700} color="green">
                Rp {(stats.totalIncome.toLocaleString())}
              </Text>
            </div>
            <IconArrowUpRight size="2rem" color="green" />
          </Group>
        </Card>

        <Card shadow="sm" p="lg" radius="md">
          <Group position="apart">
            <div>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Total Expense
              </Text>
              <Text size="xl" weight={700} color="red">
                Rp {(stats.totalExpenses.toLocaleString())}
              </Text>
            </div>
            <IconArrowDownRight size="2rem" color="red" />
          </Group>
        </Card>

        <Card shadow="sm" p="lg" radius="md">
          <Group position="apart">
            <div>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Balance
              </Text>
              <Text
                size="xl"
                weight={700}
                color={stats.balance >= 0 ? 'green' : 'red'}
              >
                Rp {(stats.balance.toLocaleString())}
              </Text>
            </div>
            <RingProgress
              size={60}
              roundCaps
              thickness={6}
              sections={[
                {
                  value: stats.totalIncome > 0 ?
                    (stats.totalExpenses / stats.totalIncome) * 100 : 0,
                  color: stats.balance >= 0 ? 'green' : 'red'
                }
              ]}
            />
          </Group>
        </Card>
      </SimpleGrid>

      <Grid>
        <Grid.Col span={8}>
          <Card shadow="sm" p="lg" radius="md">
            <Title order={3} mb="md">Expense Chart</Title>
            <ExpenseChart />
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow="sm" p="lg" radius="md">
            <Title order={3} mb="md">Recent Transactions</Title>
            {stats.recentTransactions.length > 0 ? (
              stats.recentTransactions.map((transaction) => (
                <Group key={transaction.id} position="apart" mb="sm" p="xs" style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <div>
                    <Text size="sm" weight={500}>{transaction.description}</Text>
                    <Text size="xs" color="dimmed">
                      {new Date(transaction.expense_date).toLocaleDateString('id-ID')}
                    </Text>
                  </div>
                  <Text
                    color={transaction.type === 2 ? 'green' : 'red'}
                    weight={500}
                  >
                    {transaction.type === 2 ? '+' : '-'}
                    Rp {(transaction.amount?.toLocaleString())}
                  </Text>
                </Group>
              ))
            ) : (
              <Text color="dimmed" align="center" py="md">
                No transactions found
              </Text>
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default Dashboard;