import React from 'react'; 
import { useState } from 'react';
import { FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

const TransactionItem = ({ transaction, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(transaction.description);
  const [editedAmount, setEditedAmount] = useState(transaction.amount);
  const [editedType, setEditedType] = useState(transaction.type);
  const [editedDate, setEditedDate] = useState(transaction.date);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate({
      ...transaction,
      description: editedDescription,
      amount: parseFloat(editedAmount),
      type: editedType,
      date: editedDate
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedDescription(transaction.description);
    setEditedAmount(transaction.amount);
    setEditedType(transaction.type);
    setEditedDate(transaction.date);
  };

  const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div
      className={`flex flex-col p-4 rounded-lg transition-all duration-200 ${
        transaction.type === 'income'
          ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500'
          : 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
            <input
              type="number"
              value={editedAmount}
              onChange={(e) => setEditedAmount(e.target.value)}
              step="0.01"
              className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={editedType}
              onChange={(e) => setEditedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input
              type="date"
              value={editedDate}
              onChange={(e) => setEditedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
            <div className="flex space-x-2 ml-auto">
              <button
                onClick={handleSave}
                className="p-2 text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
                aria-label="Save changes"
              >
                <FiCheck size={18} />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 transition-colors"
                aria-label="Cancel editing"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-100">
              {transaction.description}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</p>
          </div>
          <div className="flex items-center space-x-4">
            <p
              className={`font-bold ${
                transaction.type === 'income'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {transaction.type === 'income' ? '+' : '-'}$
              {transaction.amount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="p-2 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                aria-label="Edit transaction"
              >
                <FiEdit2 size={18} />
              </button>
              <button
                onClick={() => onDelete(transaction.id)}
                className="p-2 text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                aria-label="Delete transaction"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionItem;