import { FaWallet, FaUniversity, FaHourglassHalf, FaExchangeAlt } from 'react-icons/fa';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

interface FinancialSummaryProps {
  totalBalance: number;
  accountsCount: number;
  pendingCount: number;
}

export default function FinancialSummary({ totalBalance, accountsCount, pendingCount }: FinancialSummaryProps) {
  const t = useTranslations();

  return (
    <section className="bg-gradient-to-br from-[#0018A8] to-[#0025D9] rounded-2xl p-8 shadow-xl mb-8 flex flex-col lg:flex-row justify-between items-center gap-8 animate-fade-in-up text-white relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-2xl"></div>

      <div className="relative z-10 flex flex-col md:flex-row gap-8 w-full">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-inner">
            <FaWallet />
          </div>
          <div>
            <span className="block text-sm text-blue-100 font-medium uppercase tracking-wider">{t('dashboard.totalBalance')}</span>
            <span className="block text-4xl font-bold mt-1">€{totalBalance.toFixed(2)}</span>
          </div>
        </div>

        <div className="hidden md:block w-px bg-white/20 h-16 self-center"></div>

        <div className="flex gap-8 w-full md:w-auto">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
              <FaUniversity />
            </div>
            <div>
              <span className="block text-xs text-blue-100">{t('dashboard.accounts')}</span>
              <span className="block text-xl font-bold">{accountsCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
              <FaHourglassHalf />
            </div>
            <div>
              <span className="block text-xs text-blue-100">{t('dashboard.pending')}</span>
              <span className="block text-xl font-bold">{pendingCount}</span>
            </div>
          </div>
        </div>
      </div>

      <Link href="/transfer" className="relative z-10 bg-white text-[#0018A8] hover:bg-gray-50 flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full lg:w-auto justify-center whitespace-nowrap">
        <FaExchangeAlt /> {t('transfer.newTransfer')}
      </Link>
    </section>
  );
}
