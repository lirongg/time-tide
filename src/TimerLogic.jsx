import React, { useState, useEffect } from "react";

const CountdownLogic = ({ selectedTime, onAlarmStop }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [ringing, setRinging] = useState(false);
  const [timerEnded, setTimerEnded] = useState(false);

  useEffect(() => {
    const COUNTDOWN_TARGET = new Date();
    const selectedDuration = convertDurationToSeconds(selectedTime);
    COUNTDOWN_TARGET.setSeconds(
      COUNTDOWN_TARGET.getSeconds() + selectedDuration
    );


    const id = setInterval(() => {
      const totalTimeLeft = COUNTDOWN_TARGET - new Date();
      if (totalTimeLeft <= 0) {
        clearInterval(id);
        setRinging(true);
        setTimerEnded(true);
        onAlarmStop();
      } else {
        const hours = Math.floor((totalTimeLeft / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((totalTimeLeft / (1000 * 60)) % 60);
        const seconds = Math.floor((totalTimeLeft / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(id);
  }, [selectedTime]);

  const convertDurationToSeconds = (duration) => {
    const [hours, minutes, seconds] = duration.split(":");
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
  };

  return {
    timeLeft,
    ringing,
    timerEnded,
  };
};

export default CountdownLogic;
