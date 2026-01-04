import { FaGem } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

interface DashboardHeaderProps {
  username: string;
  tier: string;
}

export default function DashboardHeader({ username, tier }: DashboardHeaderProps) {
  const t = useTranslations();

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          {t('dashboard.welcome_user', { username })}
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          {t('dashboard.overview')}
        </p>
      </div>
      <div className="flex items-center gap-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-2 rounded-full font-medium shadow-sm">
        <FaGem />
        <span className="capitalize">{t('dashboard.tier_label', { tier })}</span>
      </div>
    </header>
  );
}
