import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import alarmSound from "./assets/alarm.mp3";
import "./styles.css";
import TimerDisplay from "./TimerDisplay";
import CountdownLogic from "./CountdownLogic";
import ElapsedTime from "./ElapsedTime";

const CountdownTimer = ({ apiKey, selectedTime, onAlarmStop, intervalId, onTimerStop }) => {
  const history = useHistory();
  const [latestRecordId, setLatestRecordId] = useState(null);
  const { timeLeft, ringing, timerEnded } = CountdownLogic({ selectedTime, onAlarmStop });


  useEffect(() => {
    const fetchLatestRecordId = async () => {
      try {
        console.log("URL:", "https://api.airtable.com/v0/appcMpChnXdqCV4qt/Table%201");
        const response = await axios.get(
          "https://api.airtable.com/v0/appcMpChnXdqCV4qt/Table%201",
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
  
        if (response.status !== 200) {
          throw new Error("Failed to fetch data from Airtable");
        }
  
        console.log("Response:", response);
        const latestId = response.data.records[0].id;
        console.log("Latest Record ID:", latestId);
  
        // Log the data received from the Airtable API
        console.log("Data:", response.data);
  
        setLatestRecordId(latestId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchLatestRecordId();
  }, [apiKey]);

  const handleStop = async () => {
    clearInterval(intervalId);
    onTimerStop();
    history.push("/");
  };

  return (
    <div>
      <h1>Countdown Timer</h1>
      <div className="countdown">
        <TimerDisplay timeLeft={timeLeft} />
        {ringing && <audio autoPlay loop src={alarmSound} />}
        {timerEnded && <div>Time is up! </div>}
        <button onClick={handleStop}>Stop</button>
      </div>
      <ElapsedTime apiKey={apiKey} selectedTime={selectedTime} timeLeft={timeLeft} latestRecordId={latestRecordId} />
    </div>
  );
};

export default CountdownTimer;