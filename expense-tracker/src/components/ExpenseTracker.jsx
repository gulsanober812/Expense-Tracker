import React, { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import ExpenseChart from './ExpenseChart';
import TransactionItem from './TransactionItem';

Chart.register(...registerables);

const ExpenseTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState('all');

  // Load transactions from localStorage on initial render
  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    setTransactions(savedTransactions);
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      type,
      date,
    };

    setTransactions([...transactions, newTransaction]);
    setDescription('');
    setAmount('');
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const updateTransaction = (updatedTransaction) => {
    setTransactions(transactions.map(transaction => 
      transaction.id === updatedTransaction.id ? updatedTransaction : transaction
    ));
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'income') return transaction.type === 'income';
    if (filter === 'expense') return transaction.type === 'expense';
    if (filter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(transaction.date) >= oneWeekAgo;
    }
    if (filter === 'month') {
      const transactionDate = new Date(transaction.date);
      const currentDate = new Date();
      return transactionDate.getMonth() === currentDate.getMonth() && 
             transactionDate.getFullYear() === currentDate.getFullYear();
    }
    return true;
  });

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="container mx-auto px-4 pt-6"> {/* Changed py-8 to pt-0 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> {/* Reduced gap from 8 to 6 */}
        {/* Transaction Form */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"> {/* Reduced padding */}
          <h2 className="text-lg font-semibold mb-3">Add Transaction</h2> {/* Smaller text */}
          <form onSubmit={addTransaction} className="space-y-3"> {/* Reduced spacing */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                placeholder="e.g. Groceries, Salary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    checked={type === 'income'}
                    onChange={() => setType('income')}
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm">Income</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={type === 'expense'}
                    onChange={() => setType('expense')}
                    className="h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm">Expense</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 text-sm"
            >
              Add Transaction
            </button>
          </form>
        </div>

        {/* Summary and Chart */}
        <div className="lg:col-span-2 space-y-6"> {/* Reduced spacing */}
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3"> {/* Reduced gap */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow"> {/* Reduced padding */}
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Balance</h3>
              <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {balance >= 0 ? '+' : ''}{balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Income</h3>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                +{totalIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Expenses</h3>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                -{totalExpenses.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
            <h3 className="text-xs font-medium mb-2">Filter Transactions</h3>
            <div className="flex flex-wrap gap-1"> {/* Reduced gap */}
              {['all', 'income', 'expense', 'week', 'month'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-2 py-1 rounded-md text-xs ${
                    filter === filterType
                      ? filterType === 'income'
                        ? 'bg-green-600 text-white'
                        : filterType === 'expense'
                        ? 'bg-red-600 text-white'
                        : 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {filterType === 'all' ? 'All' : 
                   filterType === 'week' ? 'Last 7 Days' : 
                   filterType === 'month' ? 'This Month' : 
                   filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
            <h3 className="text-md font-semibold mb-3">Income vs Expenses</h3>
            <div className="h-60"> {/* Slightly reduced height */}
              <ExpenseChart transactions={filteredTransactions} />
            </div>
          </div>

          {/* Transaction List */}
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-semibold">Transactions</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {filteredTransactions.length} item{filteredTransactions.length !== 1 ? 's' : ''}
              </p>
            </div>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">No transactions found</p>
              </div>
            ) : (
              <div className="space-y-2"> {/* Reduced spacing */}
                {filteredTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onDelete={deleteTransaction}
                    onUpdate={updateTransaction}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker; 