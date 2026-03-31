// src/components/common/ProgressBar.jsx
const ProgressBar = ({ value, size = "md", color = "brand" }) => {
  const clamped = Math.min(100, Math.max(0, value));
  const colorMap = {
    brand: "bg-brand-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
  };
  const heightMap = { sm: "h-1.5", md: "h-2", lg: "h-3" };

  return (
    <div className={`w-full ${heightMap[size]} bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden`}>
      <div
        className={`h-full ${colorMap[color]} rounded-full transition-all duration-500`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};

export default ProgressBar;
