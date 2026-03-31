// src/components/common/Spinner.jsx
const Spinner = ({ size = "md", className = "" }) => {
  const sizeMap = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };
  return (
    <div className={`${sizeMap[size]} border-2 border-brand-500 border-t-transparent rounded-full animate-spin ${className}`} />
  );
};
export default Spinner;
