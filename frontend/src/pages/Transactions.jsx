import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import TransactionToolbar from '../components/transactions/TransactionToolbar';
import TransactionTable from '../components/transactions/TransactionTable';
import Pagination from '../components/transactions/Pagination';
import AddTransactionModal from '../components/transactions/AddTransactionModal';
import EditTransactionModal from '../components/transactions/EditTransactionModal';
import TransactionDetailsModal from '../components/transactions/TransactionDetailsModal';
import DeleteConfirmModal from '../components/transactions/DeleteConfirmModal';
import { Plus } from 'lucide-react';

const PAGE_SIZE = 10;

export function Transactions() {
  const { user, logout } = useAuth();

  // Mobile sidebar state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter States
  const [activeType, setActiveType] = useState('All'); // 'All' | 'Income' | 'Expenses'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Raw Data from Backend
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalTx, setEditModalTx] = useState(null);
  const [detailsModalTx, setDetailsModalTx] = useState(null);
  const [deleteModalTx, setDeleteModalTx] = useState(null);

  // Fetch both expenses and incomes from existing backend endpoints
  const fetchAllTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const [expenseRes, incomeRes] = await Promise.allSettled([
        api.get('/expenses'),
        api.get('/income')
      ]);

      if (expenseRes.status === 'fulfilled' && expenseRes.value?.data?.data) {
        const data = expenseRes.value.data.data;
        setExpenses(Array.isArray(data) ? data : []);
      } else {
        setExpenses([]);
      }

      if (incomeRes.status === 'fulfilled' && incomeRes.value?.data?.data) {
        const data = incomeRes.value.data.data;
        setIncomes(Array.isArray(data) ? data : []);
      } else {
        setIncomes([]);
      }
    } catch (err) {
      console.warn('Notice while loading transactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllTransactions();
  }, [fetchAllTransactions]);

  // Combine and normalize expenses and incomes into unified transaction objects
  const combinedTransactions = useMemo(() => {
    const normalizedExpenses = expenses.map((exp) => ({
      _id: exp._id,
      type: 'Expense',
      amount: Number(exp.amount) || 0,
      description: exp.description || exp.category || 'Expense',
      category: exp.category || 'Other',
      date: exp.date || exp.createdAt,
      notes: exp.notes || '',
      raw: exp
    }));

    const normalizedIncomes = incomes.map((inc) => ({
      _id: inc._id,
      type: 'Income',
      amount: Number(inc.amount) || 0,
      description: inc.description || inc.source || 'Income',
      category: inc.source || 'Salary',
      date: inc.date || inc.createdAt,
      notes: inc.notes || '',
      raw: inc
    }));

    // Merge and sort descending by date (newest first)
    return [...normalizedExpenses, ...normalizedIncomes].sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return dateB - dateA;
    });
  }, [expenses, incomes]);

  // Dynamic category options based on loaded records
  const categoryOptions = useMemo(() => {
    const cats = new Set();
    combinedTransactions.forEach((tx) => {
      if (tx.category) cats.add(tx.category);
    });
    // Add common defaults if list is small
    const defaults = [
      'Food & Dining',
      'Freelance',
      'Shopping',
      'Utilities',
      'Transport',
      'Salary',
      'Entertainment'
    ];
    defaults.forEach((c) => cats.add(c));
    return Array.from(cats);
  }, [combinedTransactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return combinedTransactions.filter((tx) => {
      // 1. Type Filter ('All', 'Income', 'Expenses')
      if (activeType === 'Income' && tx.type !== 'Income') return false;
      if (activeType === 'Expenses' && tx.type !== 'Expense') return false;

      // 2. Category Filter
      if (selectedCategory !== 'All Categories') {
        const catA = (tx.category || '').toLowerCase();
        const catB = selectedCategory.toLowerCase();
        if (!catA.includes(catB) && !catB.includes(catA)) {
          // Check common mappings (e.g., "Food" matches "Food & Dining")
          const isFoodMatch =
            (catA.includes('food') || catA.includes('dining')) &&
            (catB.includes('food') || catB.includes('dining'));
          const isUtilityMatch =
            (catA.includes('bill') || catA.includes('util')) &&
            (catB.includes('bill') || catB.includes('util'));
          if (!isFoodMatch && !isUtilityMatch) {
            return false;
          }
        }
      }

      // 3. Search Filter (matches description, category, notes, type, amount)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const descMatch = (tx.description || '').toLowerCase().includes(q);
        const catMatch = (tx.category || '').toLowerCase().includes(q);
        const notesMatch = (tx.notes || '').toLowerCase().includes(q);
        const typeMatch = (tx.type || '').toLowerCase().includes(q);
        const amountMatch = (tx.amount || '').toString().includes(q);
        if (!descMatch && !catMatch && !notesMatch && !typeMatch && !amountMatch) {
          return false;
        }
      }

      // 4. Date Range Filter
      if (selectedPeriod !== 'All Time' && tx.date) {
        const txDate = new Date(tx.date);
        const now = new Date(); // In this environment: Oct 2026

        if (!isNaN(txDate.getTime())) {
          const txYear = txDate.getFullYear();
          const txMonth = txDate.getMonth();
          const nowYear = now.getFullYear();
          const nowMonth = now.getMonth();

          if (selectedPeriod === 'This Month') {
            if (txYear !== nowYear || txMonth !== nowMonth) return false;
          } else if (selectedPeriod === 'Last Month') {
            const lastMonth = nowMonth === 0 ? 11 : nowMonth - 1;
            const lastMonthYear = nowMonth === 0 ? nowYear - 1 : nowYear;
            if (txYear !== lastMonthYear || txMonth !== lastMonth) return false;
          } else if (selectedPeriod === 'Last 3 Months') {
            const threeMonthsAgo = new Date(nowYear, nowMonth - 3, 1);
            if (txDate < threeMonthsAgo || txDate > now) return false;
          } else if (selectedPeriod === 'This Year') {
            if (txYear !== nowYear) return false;
          }
        }
      }

      return true;
    });
  }, [combinedTransactions, activeType, selectedCategory, searchQuery, selectedPeriod]);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeType, selectedCategory, searchQuery, selectedPeriod]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE) || 1;
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredTransactions.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredTransactions, currentPage]);

  return (
    <div className="min-h-screen bg-[#0B1114] text-[#F1F5F4] flex">
      {/* 1. Sidebar */}
      <Sidebar
        activeItem="Transactions"
        user={user}
        onLogout={logout}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. Top Navigation Bar */}
        <Navbar
          user={user}
          onLogout={logout}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search transactions, categories, or notes..."
        />

        {/* 3. Main Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1536px] w-full mx-auto">
          {/* Header Row: Title and + Add Transaction Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#F1F5F4] tracking-tight leading-tight">
                Transactions
              </h1>
              <p className="text-sm sm:text-base text-[#71848A] mt-1">
                View and manage all your transactions.
              </p>
            </div>

            {/* + Add Transaction Button */}
            <button
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] font-semibold text-xs sm:text-sm shadow-[0_0_20px_rgba(53,233,160,0.25)] hover:shadow-[0_0_25px_rgba(53,233,160,0.4)] transition-all duration-200 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Transaction</span>
            </button>
          </div>

          {/* 4. Filter Toolbar */}
          <TransactionToolbar
            activeType={activeType}
            onTypeChange={setActiveType}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categoryOptions={categoryOptions}
          />

          {/* 5. Transactions Table */}
          <TransactionTable
            transactions={paginatedTransactions}
            loading={loading}
            onViewDetails={(tx) => setDetailsModalTx(tx)}
            onEdit={(tx) => setEditModalTx(tx)}
            onDelete={(tx) => setDeleteModalTx(tx)}
            onAddNew={() => setAddModalOpen(true)}
          />

          {/* 6. Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>

      {/* Modals */}
      <AddTransactionModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={fetchAllTransactions}
      />

      <EditTransactionModal
        transaction={editModalTx}
        isOpen={!!editModalTx}
        onClose={() => setEditModalTx(null)}
        onSuccess={fetchAllTransactions}
      />

      <TransactionDetailsModal
        transaction={detailsModalTx}
        isOpen={!!detailsModalTx}
        onClose={() => setDetailsModalTx(null)}
        onEdit={(tx) => setEditModalTx(tx)}
        onDelete={(tx) => setDeleteModalTx(tx)}
      />

      <DeleteConfirmModal
        transaction={deleteModalTx}
        isOpen={!!deleteModalTx}
        onClose={() => setDeleteModalTx(null)}
        onSuccess={fetchAllTransactions}
      />
    </div>
  );
}

export default Transactions;
