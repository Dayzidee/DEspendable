import { FaWallet, FaUniversity, FaHourglassHalf, FaExchangeAlt } from 'react-icons/fa';
import Link from 'next/link';

interface FinancialSummaryProps {
  totalBalance: number;
  accountsCount: number;
  pendingCount: number;
}

export default function FinancialSummary({ totalBalance, accountsCount, pendingCount }: FinancialSummaryProps) {
  return (
    <section className="bg-white rounded-xl p-6 shadow-sm mb-8 flex flex-col lg:flex-row justify-between items-center gap-6 animate-fade-in-up">
      <div className="flex items-center gap-4 w-full lg:w-auto">
        <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-xl">
          <FaWallet />
        </div>
        <div>
          <span className="block text-sm text-[var(--color-text-secondary)] font-medium">Total Balance</span>
          <span className="block text-2xl font-bold text-[var(--color-text-primary)]">${totalBalance.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full lg:w-auto">
        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
          <FaUniversity />
        </div>
        <div>
          <span className="block text-sm text-[var(--color-text-secondary)] font-medium">Accounts</span>
          <span className="block text-2xl font-bold text-[var(--color-text-primary)]">{accountsCount}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full lg:w-auto">
        <div className="w-12 h-12 rounded-full bg-[var(--color-warning)]/10 text-[var(--color-warning)] flex items-center justify-center text-xl">
          <FaHourglassHalf />
        </div>
        <div>
          <span className="block text-sm text-[var(--color-text-secondary)] font-medium">Pending</span>
          <span className="block text-2xl font-bold text-[var(--color-text-primary)]">{pendingCount}</span>
        </div>
      </div>

      <Link href="/transfer" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors w-full lg:w-auto justify-center">
        <FaExchangeAlt /> New Transfer
      </Link>
    </section>
  );
}
