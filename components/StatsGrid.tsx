"use client";

import StatCard from "@/components/StatCard";

interface StatsGridProps {
  stats: Array<{
    id: string;
    title: string;
    iconName: keyof typeof import("lucide-react");
    className?: string;
  }>;
  onStatClick: (statId: string) => void;
}

export default function StatsGrid({ stats, onStatClick }: StatsGridProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          title={stat.title}
          iconName={stat.iconName}
          className={stat.className}
          statId={stat.id}
          onClick={onStatClick}
        />
      ))}
    </div>
  );
}
