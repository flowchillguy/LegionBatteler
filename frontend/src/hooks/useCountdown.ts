import { useEffect, useState } from "react";

export default function useCooldown(cooldownSeconds: number) {
  const [timeLeft, setTimeLeft] = useState(0);

  const isLocked = timeLeft > 0;

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const startCooldown = () => {
    setTimeLeft(cooldownSeconds);
  };

  return [isLocked, startCooldown, timeLeft] as const;
}