import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import alarmSound from "./assets/alarm.mp3";
import "./styles.css";
import TimerDisplay from "./TimerDisplay";
import CountdownLogic from "./CountdownLogic";
import TimerController from "./TimerController";

const CountdownTimer = ({ apiKey, selectedTime, onAlarmStop, intervalId, onTimerStop }) => {
  const history = useHistory();
  const [latestRecordId, setLatestRecordId] = useState(null);
  const { timeLeft, ringing, timerEnded } = CountdownLogic({ selectedTime, onAlarmStop });

  useEffect(() => {
    const fetchLatestRecordId = async () => {
      try {
        console.log("Fetching Airtable data...");
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

        const latestId = response.data.records[0].id;
        console.log("Latest Record ID:", latestId);
        setLatestRecordId(latestId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchLatestRecordId();
  }, [apiKey]);

  const handleStop = async () => {
    clearInterval(intervalId);
    try {
      const elapsedTime = calculateElapsedTime(timeLeft);
      console.log("Elapsed Time:", elapsedTime);
      
      // Update ElapsedTime for the latest record
      await updateElapsedTime(elapsedTime);
      
      onTimerStop();
      // Redirect back to the home page ("/")
      history.push("/");
    } catch (error) {
      console.error("Error updating ElapsedTime:", error);
    }
  };

  const convertDurationToSeconds = (duration) => {
    const [hours, minutes, seconds] = duration.split(":");
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
  };

  const calculateElapsedTime = (timeLeft) => {
    const selectedDurationInSeconds = convertDurationToSeconds(selectedTime);
    const remainingTimeInSeconds = timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;
    const elapsedSeconds = selectedDurationInSeconds - remainingTimeInSeconds;

    const formattedHours = Math.floor(elapsedSeconds / 3600);
    const formattedMinutes = Math.floor((elapsedSeconds % 3600) / 60);
    const formattedSeconds = elapsedSeconds % 60;

    const formattedElapsedTime = `${formattedHours.toString().padStart(2, "0")}:${formattedMinutes.toString().padStart(2, "0")}:${formattedSeconds.toString().padStart(2, "0")}`;

    return formattedElapsedTime;
  };

  const updateElapsedTime = async (elapsedTime) => {
    try {
      await axios.patch(
        `https://api.airtable.com/v0/appcMpChnXdqCV4qt/Table%201/${latestRecordId}`,
        {
          fields: {
            ElapsedTime: elapsedTime,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Updated ElapsedTime for record:", latestRecordId);
    } catch (error) {
      console.error("Error updating ElapsedTime:", error);
    }
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
    </div>
  );
};

export default CountdownTimer;
