import React from "react";
import { Star } from "lucide-react";

/**
 * Reusable star rating component styled for Dark Glassmorphism.
 */
export default function StarRating({ value = 0, count, size = "w-4 h-4" }) {
  const roundedValue = Math.round(value);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={`${size} transition-colors ${
              n <= roundedValue
                ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                : "text-white/15"
            }`}
          />
        ))}
      </div>
      {typeof count === "number" && (
        <span className="text-[11px] font-medium text-sage-300/70">
          ({count})
        </span>
      )}
    </div>
  );
}