import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './styles.css';
import axios from 'axios';

const CountdownTimerPage = ({ selectedTime, onTimerStop, apiKey, latestRecordId }) => {
  const history = useHistory(); // Initialize useHistory

  const convertDurationToSeconds = (duration) => {
    const [hours, minutes, seconds] = duration.split(':');
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
  };

  const COUNTDOWN_TARGET = new Date();
  const selectedDuration = convertDurationToSeconds(selectedTime);
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
  const [ringing, setRinging] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const timeLeft = getTimeLeft();
      setTimeLeft(timeLeft);
      if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
        clearInterval(intervalId);
        setRinging(true);
          handleStop(); // Call handleStop when timer reaches zero
      
      }
    }, 1000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, []);

  const handleStop = async () => {
    clearInterval(intervalId);
    const elapsedSeconds = selectedDuration - (timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds); // Calculate elapsed time
    try {
      // Update ElapsedTime field in Airtable
      await axios.patch(
        `https://api.airtable.com/v0/appcMpChnXdqCV4qt/Table%201`, 
        {
          records: [
            {
              id: latestRecordId,
              fields: {
                ElapsedTime: elapsedSeconds
              }
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Redirect back to App.jsx after stopping the timer
      history.push('/');
    } catch (error) {
      console.error('Error updating ElapsedTime:', error);
    }
  };


  return (
    <div>
      <h1>Countdown Timer</h1>
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
    </div>
  );
};

export default CountdownTimerPage;
