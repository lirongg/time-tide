// CountdownTimer.jsx
import React, { useState, useEffect } from 'react';
import './styles.css';

const CountdownTimer = ({ selectedDuration, onTimerStop }) => {
  const COUNTDOWN_TARGET = new Date();
  COUNTDOWN_TARGET.setSeconds(COUNTDOWN_TARGET.getSeconds() + selectedDuration);

  const getTimeLeft = () => {
    const totalTimeLeft = COUNTDOWN_TARGET - new Date();
    if (totalTimeLeft <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }
  
    const hours = Math.floor((totalTimeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((totalTimeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((totalTimeLeft / 1000) % 60);
    return { hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
      clearInterval(intervalId);
      onTimerStop();
    }
  }, [timeLeft, onTimerStop]);

  const handleStop = () => {
    clearInterval(intervalId);
    onTimerStop();
  };

  return (
    <div className="countdown">
      <div>Countdown</div>
      <div className="content">
        <div className="box">
          <div className="value">
            <span>{timeLeft.hours}</span>
          </div>
          <span className="label">hours</span>
        </div>
        <div className="box">
          <div className="value">
            <span>{timeLeft.minutes}</span>
          </div>
          <span className="label">minutes</span>
        </div>
        <div className="box">
          <div className="value">
            <span>{timeLeft.seconds}</span>
          </div>
          <span className="label">seconds</span>
        </div>
      </div>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
};

export default CountdownTimer;
