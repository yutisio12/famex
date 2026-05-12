import React from 'react';
import { Card, Title, Text, Group, Progress, Stack } from '@mantine/core';

const COLORS = ['#7048E8', '#BE4BDB', '#4C6EF5', '#15AABF', '#40C057', '#FAB005'];

const CategoryBreakdown = ({ data }) => (
  <Card shadow="sm" p="lg" radius="md" withBorder>
    <Title order={3} mb="md">Kategori Pengeluaran</Title>
    {data && data.length > 0 ? (
      <Stack spacing="sm">
        {data.map((cat, i) => (
          <div key={i}>
            <Group position="apart" mb={4}>
              <Text size="sm" weight={500}>{cat.name}</Text>
              <Text size="xs" color="dimmed">
                Rp {Number(cat.total).toLocaleString('id-ID')} ({cat.percentage}%)
              </Text>
            </Group>
            <Progress
              value={parseFloat(cat.percentage)}
              color={COLORS[i % COLORS.length]}
              radius="md"
              size="sm"
            />
          </div>
        ))}
      </Stack>
    ) : (
      <Text color="dimmed" align="center" py="xl">Belum ada data pengeluaran</Text>
    )}
  </Card>
);

export default CategoryBreakdown;
