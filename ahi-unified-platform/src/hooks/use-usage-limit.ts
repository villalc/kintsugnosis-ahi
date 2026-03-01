import { useState, useEffect } from 'react';

export function useUsageLimit(toolId: string, limit: number = 2) {
  const [mounted, setMounted] = useState(false);

  // Initialize state from localStorage if available (client-side only)
  const [usageCount, setUsageCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const key = `usage_${toolId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      const count = parseInt(stored, 10);
      setUsageCount(count);
      setIsBlocked(count >= limit);
    }
  }, [toolId, limit]);

  const incrementUsage = () => {
    setUsageCount((prev) => {
      const newCount = prev + 1;
      localStorage.setItem(`usage_${toolId}`, newCount.toString());
      if (newCount >= limit) {
        setIsBlocked(true);
      }
      return newCount;
    });
  };

  const remaining = Math.max(0, limit - usageCount);

  return { usageCount, isBlocked, incrementUsage, remaining, mounted };
}
