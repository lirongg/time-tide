// CountdownTimerPage.jsx
import React from 'react';
import CountdownTimer from './CountdownTimer';

const CountdownTimerPage = ({ selectedTime, onTimerStop, formData }) => {
  const convertDurationToSeconds = (duration) => {
    const [hours, minutes] = duration.split(':');
    return parseInt(hours) * 3600 + parseInt(minutes) * 60;
  };

  return (
    <div>
      <h2>Countdown Timer</h2>
      <CountdownTimer selectedDuration={convertDurationToSeconds(selectedTime)} onTimerStop={onTimerStop} />
    </div>
  );
};

export default CountdownTimerPage;
