import { cn } from "../../utils/cn";

export default function StatCard({ title, value, icon: Icon, trend, trendValue, colorClass, onClick }) {
  return (
    <div
      onClick={onClick}
      onKeyDown={onClick ? (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-gray-900/50 dark:border-gray-800 transition-all hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 group",
        onClick ? 'cursor-pointer' : ''
      )}
    >
      <div className="flex items-center justify-between z-10 relative">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <div className={cn("rounded-lg p-2 transition-transform group-hover:scale-110", colorClass.bg, colorClass.text)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-x-2 z-10 relative">
        <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{value}</p>
        {trend && (
          <span className={cn(
            "text-sm font-medium",
            trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
          )}>
            {trend === "up" ? "+" : "-"}{trendValue}%
          </span>
        )}
      </div>
      
      {/* Subtle background glow effect on hover */}
      <div className={cn(
        "absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
        colorClass.bg
      )} />
    </div>
  );
}
