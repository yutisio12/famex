import React from 'react';
import { Card, Text, Group, SimpleGrid, ThemeIcon } from '@mantine/core';
import { IconWallet, IconArrowUpRight, IconArrowDownRight, IconPercentage } from '@tabler/icons-react';

const formatTrend = (current, previous) => {
  if (!previous || previous === 0) {
    return current > 0 ? '+100%' : '0%';
  }
  const pct = ((current - previous) / previous * 100).toFixed(1);
  return pct >= 0 ? `+${pct}%` : `${pct}%`;
};

const StatCard = ({ label, value, icon, color, trend, trendLabel }) => (
  <Card shadow="sm" p="lg" radius="md" withBorder>
    <Group position="apart">
      <div style={{ flex: 1 }}>
        <Text color="dimmed" size="xs" transform="uppercase" weight={700} mb={4}>
          {label}
        </Text>
        <Text size="xl" weight={700} color={color} mb={4}>
          Rp {value.toLocaleString('id-ID')}
        </Text>
        {trend !== undefined && (
          <Text size="xs" color={trend.currentVal >= trend.previousVal ? 'green' : 'red'} weight={500}>
            {formatTrend(trend.currentVal || 0, trend.previousVal || 0)} {trendLabel || 'dari bulan lalu'}
          </Text>
        )}
      </div>
      <ThemeIcon color={color} variant="light" size="lg" radius="md">
        {icon}
      </ThemeIcon>
    </Group>
  </Card>
);

const SavingsCard = ({ rate, trend }) => (
  <Card shadow="sm" p="lg" radius="md" withBorder>
    <Group position="apart">
      <div style={{ flex: 1 }}>
        <Text color="dimmed" size="xs" transform="uppercase" weight={700} mb={4}>
          Savings Rate
        </Text>
        <Text size="xl" weight={700} color={rate >= 0 ? 'green' : 'red'} mb={4}>
          {rate}%
        </Text>
        <Text size="xs" color="dimmed" weight={500}>
          Bulan ini
        </Text>
      </div>
      <ThemeIcon color="violet" variant="light" size="lg" radius="md">
        <IconPercentage size="1.2rem" />
      </ThemeIcon>
    </Group>
  </Card>
);

const DashboardCards = ({ balance, thisMonthIncome, thisMonthExpense, savingsRate, incomeTrend, expenseTrend }) => (
  <SimpleGrid
    cols={4}
    spacing="md"
    breakpoints={[
      { maxWidth: 'sm', cols: 1 },
      { maxWidth: 'md', cols: 2 },
    ]}
  >
    <StatCard
      label="Total Balance"
      value={balance}
      icon={<IconWallet size="1.2rem" />}
      color={balance >= 0 ? 'green' : 'red'}
    />
    <StatCard
      label="Income Bulan Ini"
      value={thisMonthIncome}
      icon={<IconArrowUpRight size="1.2rem" />}
      color="green"
      trend={incomeTrend}
    />
    <StatCard
      label="Expense Bulan Ini"
      value={thisMonthExpense}
      icon={<IconArrowDownRight size="1.2rem" />}
      color="red"
      trend={expenseTrend}
    />
    <SavingsCard rate={savingsRate} />
  </SimpleGrid>
);

export default DashboardCards;
