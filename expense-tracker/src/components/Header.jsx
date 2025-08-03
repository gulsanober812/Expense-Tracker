import React from 'react';
import { useState, useEffect } from 'react';
import { FiBell, FiUser, FiDownload, FiSun, FiMoon, FiMenu, FiX, FiArrowLeft } from 'react-icons/fi';

 
const Header = ({ onBack }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);


  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('darkMode', newDarkMode ? 'enabled' : 'disabled');
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode === 'enabled' || (!savedMode && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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

    const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Fallback behavior
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // If no history, you might want to redirect to a specific URL
        window.location.href = '/'; // Adjust this as needed
      }
    }
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm py-2 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10">
        {/* Left section - Back button and Logo */}
         <div className="flex items-center space-x-2">
          {/* Back arrow button */}
          <button 
            onClick={handleBack}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-1"
            aria-label="Back to welcome screen"
          >
            <FiArrowLeft size={20} />
          </button>
          
          <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold mr-2">
            CD
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Cash Candy</h1>
        </div>

        {/* Desktop icons - hidden on mobile */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={handleDownloadCSV}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center"
            title="Download CSV"
          >
            <FiDownload size={20} className="mr-1" />
            <span className="text-sm">Export</span>
          </button>

      

          <div className="relative">
            <button 
              onClick={toggleNotifications}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative"
              aria-label="Notifications"
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
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <FiUser size={16} />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-white">MahNoor</span>
          </div>
        </div>

        {/* Mobile menu button - shown only on mobile */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </header>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-md py-2 px-4 absolute right-0 left-0 z-10">
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
            >
              <FiDownload size={20} className="mr-3" />
              <span>Export CSV</span>
            </button>


            <button 
              onClick={toggleNotifications}
              className="flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded relative"
            >
              <FiBell size={20} className="mr-3" />
              <span>Notifications</span>
              <span className="absolute right-4 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </button>

            <div className="flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                <FiUser size={16} />
              </div>
              <span>MahNoor</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;