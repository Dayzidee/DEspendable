import { FaArrowDown, FaArrowUp, FaReceipt } from 'react-icons/fa';
import Link from 'next/link';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  timestamp: string; // or Date
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <section className="bg-white rounded-xl shadow-sm p-6 mb-6 card-hover">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Recent Transactions</h2>
        <Link href="#" className="text-sm font-medium text-[var(--color-primary)] hover:underline">View All</Link>
      </header>

      {transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map((t) => {
            const isCredit = ['receive', 'admin_deposit'].includes(t.type);
            return (
              <div key={t.id} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCredit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isCredit ? <FaArrowDown /> : <FaArrowUp />}
                  </div>
                  <div>
                    <span className="block font-medium text-[var(--color-text-primary)] capitalize">{t.type.replace('_', ' ')}</span>
                    <span className="block text-sm text-[var(--color-text-secondary)]">{new Date(t.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className={`font-bold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                  {isCredit ? '+' : '-'}${t.amount.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center text-[var(--color-text-secondary)]">
            <FaReceipt className="text-3xl mb-2 opacity-30" />
            <strong className="block">No Transactions Yet</strong>
            <p className="text-sm">When you make your first transaction, it will appear here.</p>
        </div>
      )}
    </section>
  );
}
