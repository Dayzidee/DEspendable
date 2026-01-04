'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FaChartPie } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SpendingAnalyticsProps {
  data?: ChartData<'doughnut'>;
}

import { useTranslations } from 'next-intl';

export default function SpendingAnalytics({ data }: SpendingAnalyticsProps) {
  const t = useTranslations('dashboard');
  const chartData = data || {
    labels: [],
    datasets: [],
  };

  const hasData = chartData.datasets.length > 0 && chartData.datasets[0].data.length > 0;

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 mb-6 card-hover">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{t('spendingAnalytics')}</h2>
        <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-600 outline-none" disabled defaultValue="30">
          <option value="30">{t('last30Days')}</option>
          <option value="90">{t('last90Days')}</option>
        </select>
      </header>

      {hasData ? (
        <div className="h-64 relative">
          <Doughnut
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: '70%',
              plugins: {
                legend: { position: 'right' }
              }
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center text-[var(--color-text-secondary)]">
          <FaChartPie className="text-4xl mb-3 opacity-20" />
          <strong className="block mb-1">{t('noSpendingData')}</strong>
          <p className="text-sm">{t('noSpendingDataDesc')}</p>
        </div>
      )}
    </section>
  );
}
