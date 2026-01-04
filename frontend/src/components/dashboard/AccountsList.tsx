import { FaPiggyBank, FaUniversity } from 'react-icons/fa';
import Link from 'next/link';

interface Account {
  id: string; // or number
  account_name: string;
  masked_account_number: string;
  balance: number;
}

interface AccountsListProps {
  accounts: Account[];
}

export default function AccountsList({ accounts }: AccountsListProps) {
  return (
    <section className="bg-white rounded-xl shadow-sm p-6 mb-6 card-hover">
      <header className="mb-4">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Your Accounts</h2>
      </header>

      {accounts.length > 0 ? (
        <div className="space-y-4">
          {accounts.map((account) => (
            <Link href="#" key={account.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaPiggyBank />
                </div>
                <div>
                  <span className="block font-medium text-[var(--color-text-primary)]">{account.account_name}</span>
                  <span className="block text-sm text-[var(--color-text-secondary)]">{account.masked_account_number}</span>
                </div>
              </div>
              <div className="font-bold text-[var(--color-text-primary)]">
                ${account.balance.toFixed(2)}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center text-[var(--color-text-secondary)]">
            <FaUniversity className="text-3xl mb-2 opacity-30" />
            <strong className="block">No Accounts Found</strong>
            <p className="text-sm">Contact support to get started.</p>
        </div>
      )}
    </section>
  );
}
