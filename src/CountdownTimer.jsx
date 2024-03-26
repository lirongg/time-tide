// CountdownTimer.jsx
import React, { useState, useEffect } from 'react';
import './styles.css';

const CountdownTimer = ({ selectedDuration, onTimerStop, updateElapsedTime }) => {
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
  const [elapsedTime, setElapsedTime] = useState(0); // Track elapsed time
  const [intervalId, setIntervalId] = useState(null);
  const [ringing, setRinging] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const timeLeft = getTimeLeft();
      setTimeLeft(timeLeft);
      if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
        clearInterval(intervalId);
        setRinging(true);
        setTimeout(() => {
          setRinging(false);
          onTimerStop(elapsedTime); // Pass the elapsed time to onTimerStop
          updateElapsedTime(elapsedTime); // Update the elapsed time in App.jsx
        }, 20000); // Ring for 20 seconds
      }
    }, 1000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, []);

  const handleStop = () => {
    clearInterval(intervalId);
    // Calculate elapsed time in seconds
    const elapsedSeconds =
      selectedDuration - (timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds);
    setElapsedTime(elapsedSeconds);
    onTimerStop(elapsedSeconds); // Pass elapsed time to the parent component
  
    // Log elapsedTime after it has been updated
    setTimeout(() => {
      console.log('Timer stopped. Elapsed time:', elapsedSeconds);
    }, 0); // Using setTimeout to log after the state update
  };
  
  
  return (
    <div className="countdown">
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
      {ringing && <audio autoPlay loop>
        <source src="alarm.mp3" type="audio/mpeg" />
      </audio>}
      <button onClick={handleStop}>Stop</button>
    </div>
  );
};

export default CountdownTimer;
