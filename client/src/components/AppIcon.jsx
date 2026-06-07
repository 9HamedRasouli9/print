import { Users } from "lucide-react";

export default function AppIcon({ size = "md", className = "" }) {
  const sizes = {
    sm: { box: "p-1.5", icon: "w-5 h-5" },
    md: { box: "p-2", icon: "w-6 h-6" },
  };
  const { box, icon } = sizes[size] || sizes.md;

  return (
    <div className={`${box} bg-indigo-600 rounded-lg ${className}`}>
      <Users className={`${icon} text-white`} />
    </div>
  );
}
