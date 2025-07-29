import React from 'react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { FiMenu, FiX, FiSun, FiMoon, FiBell, FiUser } from 'react-icons/fi';
import { 
  FaChartPie, 
  FaFileInvoiceDollar, 
  FaCheckCircle, 
  FaMoneyBillWave, 
  FaShieldAlt, 
  FaUsersCog, 
  FaCog 
} from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi'; 

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const navItems = [
    { name: 'Dashboard', icon: <FaChartPie className="text-lg" /> },
    { name: 'Reports', icon: <FaFileInvoiceDollar className="text-lg" /> },
    { name: 'Expenses', icon: <FaFileInvoiceDollar className="text-lg" /> },
    { name: 'My Approvals', icon: <FaCheckCircle className="text-lg" /> },
    { name: 'Advance Request', icon: <FaMoneyBillWave className="text-lg" /> },
    { name: 'Advance Payment', icon: <FaMoneyBillWave className="text-lg" /> },
    { name: 'Policy', icon: <FaShieldAlt className="text-lg" /> },
    { name: 'Users', icon: <FaUsersCog className="text-lg" /> },
    { name: 'Settings', icon: <FaCog className="text-lg" /> }
  ];

    
  const handleDownloadCSV = () => {
    
    const transactions = [
      { description: 'Groceries', amount: 50.00, type: 'Expense', date: '07/29/2025' },
      { description: 'Salary', amount: 2000.00, type: 'Income', date: '07/30/2025' }
    ];

    const csvContent = [
      ['Description', 'Amount', 'Type', 'Date'],
      ...transactions.map(item => [
        `"${item.description}"`,
        item.amount,
        item.type,
        item.date
      ])
    ].map(e => e.join(',')).join('\n');

   
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'expense_records.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm py-2 px-6 flex items-center justify-between sticky top-0 z-10">
       
        <div className="flex items-center space-x-4">
            
          
          
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold mr-2">
              CD
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Cash Candy</h1>
          </div>
        </div>

       
        <div className="flex items-center space-x-6">
          <button
            onClick={handleDownloadCSV}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center"
            title="Download CSV"
          >
            <FiDownload size={20} className="mr-1" />
            <span className="text-sm hidden sm:inline"></span>
          </button>

        
          
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={toggleNotifications}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative"
            >
              <FiBell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Notifications</p>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <p className="text-sm text-gray-700 dark:text-gray-300">New expense report submitted</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <p className="text-sm text-gray-700 dark:text-gray-300">Your reimbursement was approved</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <p className="text-sm text-gray-700 dark:text-gray-300">Policy update available</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Profile */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <FiUser size={16} />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-white">MahNoor</span>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-md fixed top-12 left-0 h-[calc(100vh-3rem)] z-10">
          <div className="h-full overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a href="#" className={`flex items-center p-3 text-base font-medium ${index === 2 ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}>
                    <span className="text-gray-500 dark:text-gray-400 mr-3">
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </>
  );
};

export default Header;