import { useState, useEffect } from "react";
export default function ProgressBar({ timer }) {
  const [deletingTime, setDeletingTime] = useState(timer);

  useEffect(() => {
    const interval = setInterval(() => {
      setDeletingTime((prevTime) => prevTime - 100);
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <progress value={deletingTime} max={timer} />;
}
