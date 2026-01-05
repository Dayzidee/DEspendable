import { FaArrowDown, FaArrowUp, FaReceipt } from 'react-icons/fa';
import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  timestamp: string; // or Date
  description?: string;
  category?: string;
  author?: string;
  title?: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const t = useTranslations('dashboard');

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 mb-6 card-hover">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{t('recentTransactions')}</h2>
        <Link href="/transactions" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
          {t('viewAll')}
        </Link>
      </header>

      {transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map((t_item) => {
            const isCredit = ['receive', 'admin_deposit', 'income', 'top_up', 'refund'].includes(t_item.type);
            // Force override for Admin Adjustment/Credit
            const descriptionLower = (t_item.description || '').toLowerCase();
            const typeLower = (t_item.type || '').toLowerCase();
            const titleLower = (t_item.title || '').toLowerCase(); // potential other field

            const isAdminActivity =
              descriptionLower.includes('admin') ||
              typeLower.includes('admin') ||
              titleLower.includes('admin') ||
              t_item.author === 'Admin';

            const displayTitle = isAdminActivity ? "Credit Alert" : (t_item.description || t_item.type.replace('_', ' '));
            const displayCategory = isAdminActivity ? "Money Received" : t_item.category;

            return (
              <div key={t_item.id} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCredit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isCredit ? <FaArrowDown /> : <FaArrowUp />}
                  </div>
                  <div>
                    <span className="block font-medium text-[var(--color-text-primary)] capitalize">{displayTitle}</span>
                    <span className="block text-sm text-[var(--color-text-secondary)]">{displayCategory ? `${displayCategory} • ` : ''}{new Date(t_item.timestamp).toLocaleDateString('de-DE')}</span>
                  </div>
                </div>
                <div className={`font-bold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                  {isCredit ? '+' : '-'}€{t_item.amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center text-[var(--color-text-secondary)]">
          <FaReceipt className="text-3xl mb-2 opacity-30" />
          <strong className="block">{t('noTransactions')}</strong>
          <p className="text-sm">{t('noTransactionsDesc')}</p>
        </div>
      )}
    </section>
  );
}
