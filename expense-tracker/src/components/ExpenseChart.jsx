import React from 'react';
import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const ExpenseChart = ({ transactions }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!transactions || transactions.length === 0) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Prepare data for chart
    const incomeData = transactions.filter(t => t.type === 'income');
    const expenseData = transactions.filter(t => t.type === 'expense');

    // Group by category and sum amounts
    const incomeByCategory = {};
    const expenseByCategory = {};

    incomeData.forEach(t => {
      incomeByCategory[t.description] = (incomeByCategory[t.description] || 0) + t.amount;
    });

    expenseData.forEach(t => {
      expenseByCategory[t.description] = (expenseByCategory[t.description] || 0) + t.amount;
    });

    // Create labels and data arrays
    const labels = [
      ...Object.keys(incomeByCategory).map(label => `Income: ${label}`),
      ...Object.keys(expenseByCategory).map(label => `Expense: ${label}`)
    ];

    const data = [
      ...Object.values(incomeByCategory),
      ...Object.values(expenseByCategory)
    ];

    const backgroundColors = [
      ...Object.keys(incomeByCategory).map(() => 'rgba(34, 197, 94, 0.7)'), // Green for income
      ...Object.keys(expenseByCategory).map(() => 'rgba(239, 68, 68, 0.7)') // Red for expenses
    ];

    const borderColors = [
      ...Object.keys(incomeByCategory).map(() => 'rgba(34, 197, 94, 1)'),
      ...Object.keys(expenseByCategory).map(() => 'rgba(239, 68, 68, 1)')
    ];

    // Create new chart instance
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#6B7280',
              font: {
                size: 12
              },
              padding: 20
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.raw !== null) {
                  label += new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(context.raw);
                }
                return label;
              }
            }
          }
        },
        cutout: '65%',
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [transactions]);

  return (
    <div className="w-full h-full">
      {transactions.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">No transactions to display</p>
        </div>
      ) : (
        <canvas ref={chartRef} />
      )}
    </div>
  );
};

export default ExpenseChart;