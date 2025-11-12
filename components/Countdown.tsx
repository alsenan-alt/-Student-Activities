import React, { useState, useEffect, useMemo } from 'react';

interface CountdownProps {
  targetDate: string;
  onComplete: () => void;
  cardAccentColor?: string;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, onComplete, cardAccentColor }) => {
  // Memoize the function to avoid re-creating it on every render,
  // it only changes if the targetDate prop changes.
  const calculateTimeLeft = useMemo(() => {
    return () => {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return timeLeft;
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
  // The isExpired logic can be derived directly from the timeLeft state.
  const isExpired = useMemo(() => {
    return +new Date(targetDate) <= +new Date();
  }, [targetDate, timeLeft]); // Re-check on each tick.

  useEffect(() => {
    if (isExpired) {
      onComplete();
      // Ensure time is zeroed out if it was already expired on load.
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    // Set up an interval to update the timeLeft state every second.
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clean up the interval when the component unmounts or dependencies change.
    return () => clearInterval(timer);
  }, [isExpired, calculateTimeLeft, onComplete]);

  const timerComponents = useMemo(() => (
    [
      { label: 'يوم', value: timeLeft.days },
      { label: 'ساعة', value: timeLeft.hours },
      { label: 'دقيقة', value: timeLeft.minutes },
      { label: 'ثانية', value: timeLeft.seconds },
    ]
  ), [timeLeft]);

  if (isExpired) {
    return (
       <div className="text-center bg-red-500/20 text-red-400 font-bold py-2 px-4 rounded-lg text-sm">
            انتهت الفعالية
       </div>
    );
  }

  return (
    <div className="flex justify-center items-center gap-1.5 sm:gap-2.5 text-center" dir="ltr">
        {timerComponents.map(component => (
            <div key={component.label} className="flex flex-col items-center justify-center bg-black/20 p-2 rounded-md w-14 sm:w-16">
                 <span className="text-xl sm:text-2xl font-bold tracking-widest" style={{fontFamily: 'monospace', color: cardAccentColor || 'var(--color-accent)'}}>
                    {String(component.value).padStart(2, '0')}
                 </span>
                 <span className="text-xs text-[var(--color-text-secondary)]">{component.label}</span>
            </div>
        ))}
    </div>
  );
};

export default Countdown;