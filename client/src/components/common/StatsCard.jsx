// src/components/common/StatsCard.jsx
// KPI card for the dashboard

const StatsCard = ({ icon: Icon, label, value, sub, color = "brand" }) => {
  const colorMap = {
    brand: "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400",
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="card flex items-start gap-4">
      <div className={`p-3 rounded-xl ${colorMap[color]} flex-shrink-0`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

export default StatsCard;
