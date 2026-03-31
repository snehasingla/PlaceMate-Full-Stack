// src/components/common/Badge.jsx
// Colored badge for status, difficulty, priority labels

const variantMap = {
  // Difficulty
  Easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",

  // Status
  solved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  inProgress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  notStarted: "bg-gray-100 text-gray-500 dark:bg-dark-border dark:text-gray-400",
  reviseLater: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",

  // Priority
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  low: "bg-gray-100 text-gray-500 dark:bg-dark-border dark:text-gray-400",

  // Application pipeline
  wishlist: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  applied: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  oaScheduled: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  interviewScheduled: "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400",
  rejected: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  selected: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",

  // Default
  default: "bg-gray-100 text-gray-600 dark:bg-dark-border dark:text-gray-400",
};

// Friendly labels for display
const labelMap = {
  notStarted: "Not Started",
  inProgress: "In Progress",
  reviseLater: "Revise Later",
  oaScheduled: "OA Scheduled",
  interviewScheduled: "Interview",
};

const Badge = ({ value, className = "" }) => {
  const display = labelMap[value] || value;
  const style = variantMap[value] || variantMap.default;

  return (
    <span className={`badge ${style} ${className}`}>
      {display}
    </span>
  );
};

export default Badge;
