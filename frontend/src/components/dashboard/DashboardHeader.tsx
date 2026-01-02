import { FaGem } from 'react-icons/fa';

interface DashboardHeaderProps {
  username: string;
  tier: string;
}

export default function DashboardHeader({ username, tier }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          Welcome, <span className="text-[var(--color-primary)]">{username}</span>
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          Here&apos;s your financial overview for today.
        </p>
      </div>
      <div className="flex items-center gap-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-2 rounded-full font-medium shadow-sm">
        <FaGem />
        <span className="capitalize">{tier} Tier</span>
      </div>
    </header>
  );
}
