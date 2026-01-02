import { ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="w-full lg:w-1/3 space-y-6">
      {children}
    </aside>
  );
}
