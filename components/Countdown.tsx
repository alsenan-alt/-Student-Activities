import React, { useState, useEffect, useMemo } from 'react';

interface CountdownProps {
  targetDate: string;
  onComplete: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, onComplete }) => {
  const calculateTimeLeft = () => {
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

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isExpired, setIsExpired] = useState(+new Date(targetDate) <= +new Date());

  useEffect(() => {
    if (isExpired) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        setIsExpired(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

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
       <div className="text-center bg-red-500/20 text-red-400 font-bold py-2 px-4 rounded-lg">
            انتهى وقت الفعالية
       </div>
    );
  }

  return (
    <div className="flex justify-center items-center gap-2 text-center" dir="ltr">
        {timerComponents.map(component => (
            <div key={component.label} className="flex flex-col items-center justify-center bg-[var(--color-bg)] p-2 rounded-md w-16">
                 <span className="text-xl font-bold text-[var(--color-accent)] tracking-widest" style={{fontFamily: 'monospace'}}>
                    {String(component.value).padStart(2, '0')}
                 </span>
                 <span className="text-xs text-[var(--color-text-secondary)]">{component.label}</span>
            </div>
        ))}
    </div>
  );
};

export default Countdown;
