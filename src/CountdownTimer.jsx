import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import alarmSound from "./assets/alarm.mp3";
import "./styles.css";
import TimerDisplay from "./TimerDisplay";
import CountdownLogic from "./CountdownLogic";
import ElapsedTime from "./ElapsedTime";
import moment from "moment";

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
  
        // Sort records based on createdTime in descending order
        const sortedRecords = response.data.records.sort((a, b) =>
          moment(a.createdTime).isBefore(moment(b.createdTime)) ? 1 : -1
        );
  
        // Get the latest record (first element)
        const latestRecord = sortedRecords[0];
  
        console.log("Latest Record:", latestRecord);
  
        // Set the latest record ID
        if (latestRecord) {
          setLatestRecordId(latestRecord.id);
        } else {
          console.error("No records found.");
        }
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
      <div className="countdown">
        <TimerDisplay timeLeft={timeLeft} />
        {ringing && <audio autoPlay loop src={alarmSound} />}
        {timerEnded && <div className="timeup">Time is up! </div>}
        <button onClick={handleStop}>Stop</button>
      </div>
      <ElapsedTime apiKey={apiKey} selectedTime={selectedTime} timeLeft={timeLeft} latestRecordId={latestRecordId} />
    </div>
  );
};

export default CountdownTimer;